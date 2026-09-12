/**
 * NetraAI API Service Layer
 * Connects React frontend to FastAPI backend (:8000) and SQLite database.
 * Provides authenticated client calls with automatic JWT handling and
 * transparent fallback to mockData if backend is unreachable.
 */

import {
  RECENT_SCREENINGS,
  DOCTOR_CASES,
  ADMIN_STATS,
  DEMO_CASES
} from '../data/mockData';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;

/**
 * Returns authorization headers with JWT bearer token if available in localStorage.
 */
export function getAuthHeaders(customHeaders = {}) {
  const token = localStorage.getItem('netra_token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Core fetch wrapper with timeout and standard JSON decoding.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? (() => {
      const token = localStorage.getItem('netra_token');
      const h = { ...options.headers };
      if (token) h['Authorization'] = `Bearer ${token}`;
      return h;
    })()
    : getAuthHeaders(options.headers);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.status === 401) {
      console.warn('Session expired or unauthorized request to:', endpoint);
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const error = new Error(errBody.detail || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = errBody;
      throw error;
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==========================================
// 1. HEALTH CHECK
// ==========================================
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// ==========================================
// 2. PATIENTS API
// ==========================================
export const patientsApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.village) query.append('village', params.village);
    if (params.skip !== undefined) query.append('skip', params.skip);
    if (params.limit !== undefined) query.append('limit', params.limit);

    try {
      return await request(`/patients?${query.toString()}`);
    } catch (e) {
      console.warn('[API fallback] patientsApi.getAll:', e.message);
      return [];
    }
  },

  async getById(id) {
    try {
      return await request(`/patients/${id}`);
    } catch (e) {
      console.warn('[API fallback] patientsApi.getById:', e.message);
      return null;
    }
  },

  async getByCode(code) {
    try {
      return await request(`/patients/code/${code}`);
    } catch (e) {
      console.warn('[API fallback] patientsApi.getByCode:', e.message);
      return null;
    }
  },

  async create(patientData) {
    try {
      return await request('/patients', {
        method: 'POST',
        body: JSON.stringify({
          patient_code: patientData.patientId || patientData.patient_code || '',
          name: patientData.name || '',
          age: patientData.age ? parseInt(patientData.age, 10) : null,
          gender: patientData.gender || null,
          phone: patientData.phone || null,
          village: patientData.village || null,
          diabetes_duration: patientData.diabetesDuration ? parseInt(patientData.diabetesDuration, 10) : null,
          existing_eye_problems: patientData.eyeProblems || 'none',
          previous_screening: patientData.previousScreening === 'yes',
        }),
      });
    } catch (e) {
      console.warn('[API fallback] patientsApi.create:', e.message);
      return {
        id: Math.floor(Math.random() * 1000) + 20,
        patient_code: patientData.patientId || 'P-LOCAL',
        name: patientData.name,
        created_at: new Date().toISOString(),
      };
    }
  },
};

// ==========================================
// 3. SCREENINGS API
// ==========================================
export const screeningsApi = {
  async getRecent(limit = 20) {
    try {
      return await request(`/screenings/recent?limit=${limit}`);
    } catch (e) {
      console.warn('[API fallback] screeningsApi.getRecent:', e.message);
      return RECENT_SCREENINGS;
    }
  },

  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.risk_level) query.append('risk_level', params.risk_level);
    if (params.skip !== undefined) query.append('skip', params.skip);
    if (params.limit !== undefined) query.append('limit', params.limit);

    try {
      return await request(`/screenings?${query.toString()}`);
    } catch (e) {
      console.warn('[API fallback] screeningsApi.getAll:', e.message);
      return RECENT_SCREENINGS;
    }
  },

  async getById(screeningId) {
    try {
      return await request(`/screenings/${screeningId}`);
    } catch (e) {
      console.warn('[API fallback] screeningsApi.getById:', e.message);
      return DEMO_CASES[1];
    }
  },

  async create(formDataOrData) {
    try {
      let body;
      if (formDataOrData instanceof FormData) {
        body = formDataOrData;
      } else {
        const formData = new FormData();
        if (formDataOrData.patient_id) formData.append('patient_id', formDataOrData.patient_id);
        if (formDataOrData.patientId) formData.append('patient_code', formDataOrData.patientId);
        if (formDataOrData.patient_code) formData.append('patient_code', formDataOrData.patient_code);
        if (formDataOrData.demo_case) formData.append('demo_case', formDataOrData.demo_case);
        if (formDataOrData.imageFile) formData.append('image', formDataOrData.imageFile);
        body = formData;
      }

      return await request('/screenings', {
        method: 'POST',
        body,
      });
    } catch (e) {
      console.warn('[API fallback] screeningsApi.create:', e.message);
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        predicted_label: 'Moderate DR',
        predicted_class: 2,
        confidence: 0.82,
        risk_level: 'moderate',
        referral_status: 'recommended',
        status: 'referral',
        is_mock: true,
      };
    }
  },
};

// ==========================================
// 4. DOCTOR API
// ==========================================
export const doctorApi = {
  async getCases(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.skip !== undefined) query.append('skip', params.skip);
    if (params.limit !== undefined) query.append('limit', params.limit);

    try {
      return await request(`/doctor/cases?${query.toString()}`);
    } catch (e) {
      console.warn('[API fallback] doctorApi.getCases:', e.message);
      return DOCTOR_CASES;
    }
  },

  async getCaseById(screeningId) {
    try {
      return await request(`/doctor/cases/${screeningId}`);
    } catch (e) {
      console.warn('[API fallback] doctorApi.getCaseById:', e.message);
      const found = DOCTOR_CASES.find((c) => c.id === screeningId || c.screening_id === screeningId);
      return found || DOCTOR_CASES[0];
    }
  },

  async submitReview(screeningId, reviewData) {
    try {
      return await request(`/doctor/review/${screeningId}`, {
        method: 'POST',
        body: JSON.stringify({
          notes: reviewData.notes || '',
          status: reviewData.status || 'reviewed',
        }),
      });
    } catch (e) {
      console.warn('[API fallback] doctorApi.submitReview:', e.message);
      return {
        screening_id: screeningId,
        status: 'reviewed',
        notes: reviewData.notes,
        reviewed_at: new Date().toISOString(),
      };
    }
  },
};

// ==========================================
// 5. ADMIN API
// ==========================================
export const adminApi = {
  async getAnalytics() {
    try {
      const data = await request('/admin/analytics');
      return {
        totalScreened: data.total_screened,
        nodr: data.no_dr,
        mild: data.mild,
        moderate: data.moderate,
        severe: data.severe,
        proliferative: data.proliferative,
        referralRate: data.referral_rate,
      };
    } catch (e) {
      console.warn('[API fallback] adminApi.getAnalytics:', e.message);
      return ADMIN_STATS;
    }
  },

  async getMonthlyStats() {
    try {
      return await request('/admin/monthly-stats');
    } catch (e) {
      console.warn('[API fallback] adminApi.getMonthlyStats:', e.message);
      return ADMIN_STATS.monthlyScreenings;
    }
  },

  async getHighRisk() {
    try {
      return await request('/admin/high-risk');
    } catch (e) {
      console.warn('[API fallback] adminApi.getHighRisk:', e.message);
      return ADMIN_STATS.highRiskCases;
    }
  },

  async getVillageStats() {
    try {
      return await request('/admin/village-stats');
    } catch (e) {
      console.warn('[API fallback] adminApi.getVillageStats:', e.message);
      return ADMIN_STATS.villages;
    }
  },

  async getUsers() {
    try {
      return await request('/admin/users');
    } catch (e) {
      console.warn('[API fallback] adminApi.getUsers:', e.message);
      return [];
    }
  },

  async createUser(userData) {
    return await request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// ==========================================
// 6. EXPLAINABILITY API
// ==========================================
export const explainabilityApi = {
  async getExplanation(screeningId) {
    try {
      return await request(`/explainability/${screeningId}`);
    } catch (e) {
      console.warn('[API fallback] explainabilityApi.getExplanation:', e.message);
      return null;
    }
  },

  async generateExplanation(screeningId) {
    try {
      return await request(`/explainability/${screeningId}/generate`, { method: 'POST' });
    } catch (e) {
      console.warn('[API fallback] explainabilityApi.generateExplanation:', e.message);
      return null;
    }
  },
};

// ==========================================
// 7. TELEHEALTH API
// ==========================================
export const telehealthApi = {
  async getSessions() {
    try {
      return await request('/telehealth/sessions');
    } catch (e) {
      console.warn('[API fallback] telehealthApi.getSessions:', e.message);
      return [];
    }
  },

  async createSession(sessionData) {
    try {
      return await request('/telehealth/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
    } catch (e) {
      console.warn('[API fallback] telehealthApi.createSession:', e.message);
      return sessionData;
    }
  },
};

export default {
  patients: patientsApi,
  screenings: screeningsApi,
  doctor: doctorApi,
  admin: adminApi,
  explainability: explainabilityApi,
  telehealth: telehealthApi,
  checkBackendHealth,
};
