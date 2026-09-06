import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// API base URL — points to FastAPI backend
const API_BASE = 'http://localhost:8000/api';

// Demo users fallback (for offline mode)
const DEMO_USERS = {
  'health001': { id: 'HW001', name: 'Anjali Sharma', role: 'health_worker', phone: '9876543210', location: 'PHC Bharatpur', password: 'netra123' },
  'doctor001': { id: 'DR001', name: 'Dr. Rajesh Kumar', role: 'doctor', phone: '9876543211', location: 'District Hospital, Jaipur', password: 'netra123' },
  'admin001': { id: 'AD001', name: 'Priya Singh', role: 'admin', phone: '9876543212', location: 'State Health Office', password: 'netra123' },
  'demo': { id: 'HW001', name: 'Anjali Sharma', role: 'health_worker', phone: '9876543210', location: 'PHC Bharatpur', password: 'netra123' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('netra_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('netra_token') || null;
  });

  const login = useCallback(async (employeeId, password) => {
    // Try real backend first
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employeeId, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const userData = data.user;
        setUser(userData);
        setToken(data.access_token);
        localStorage.setItem('netra_user', JSON.stringify(userData));
        localStorage.setItem('netra_token', data.access_token);
        return { success: true, user: userData };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.detail || 'Invalid credentials' };
    } catch (networkError) {
      // Fallback to demo users when backend is unreachable
      console.warn('Backend unreachable, using offline demo login');
      const demoUser = DEMO_USERS[employeeId];
      if (demoUser && demoUser.password === password) {
        const userData = { ...demoUser };
        delete userData.password;
        setUser(userData);
        setToken(null);
        localStorage.setItem('netra_user', JSON.stringify(userData));
        localStorage.removeItem('netra_token');
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('netra_user');
    localStorage.removeItem('netra_token');
  }, []);

  const switchRole = useCallback(async (role) => {
    const userMap = { health_worker: 'health001', doctor: 'doctor001', admin: 'admin001' };
    const key = userMap[role];
    if (key) {
      // Try to login via backend for the new role
      const result = await login(key, 'netra123');
      if (!result.success) {
        // Fallback
        const demoUser = { ...DEMO_USERS[key] };
        delete demoUser.password;
        setUser(demoUser);
        localStorage.setItem('netra_user', JSON.stringify(demoUser));
      }
    }
  }, [login]);

  // Helper to get auth headers for API calls
  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // Helper for authenticated API calls
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const headers = { ...getAuthHeaders(), ...options.headers };
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      if (res.status === 401) {
        logout();
        throw new Error('Session expired');
      }
      return res;
    } catch (err) {
      console.warn(`API call to ${endpoint} failed:`, err.message);
      throw err;
    }
  }, [getAuthHeaders, logout]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      switchRole,
      isAuthenticated: !!user,
      getAuthHeaders,
      apiFetch,
      apiBase: API_BASE,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
