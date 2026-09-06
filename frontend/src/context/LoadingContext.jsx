import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Global manual state loading (e.g., for async AI inference, sync, heavy data load)
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState({
    title: 'Processing Clinical Operation',
    subtitle: 'NetraAI Edge Inference Engine Active',
    portal: 'health_worker',
    progress: null,
  });

  // Automatic route navigation loading state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [portalSwitchInfo, setPortalSwitchInfo] = useState(null);

  // Trigger manual state loading
  const startLoading = (title, subtitle, portal = 'health_worker', progress = null) => {
    setLoadingConfig({
      title: title || 'Processing Clinical Operation',
      subtitle: subtitle || 'Autonomous Edge Diagnostic Runtime Active',
      portal,
      progress,
    });
    setIsLoading(true);
  };

  const updateProgress = (progress) => {
    setLoadingConfig((prev) => ({ ...prev, progress }));
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  // Helper for wrapping async promises with loading state
  const withLoading = async (asyncFn, title, subtitle, portal) => {
    startLoading(title, subtitle, portal);
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  // Listen to route changes for top progress bar & portal switch detection
  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;

    if (prev !== curr) {
      prevPathRef.current = curr;

      // Check if switching between portals
      const getPortal = (path) => {
        if (path.startsWith('/doctor')) return 'doctor';
        if (path.startsWith('/admin')) return 'admin';
        if (path === '/' || path === '/landing' || path === '/login') return 'public';
        return 'health_worker';
      };

      const fromPortal = getPortal(prev);
      const toPortal = getPortal(curr);

      if (fromPortal !== toPortal && fromPortal !== 'public' && toPortal !== 'public') {
        const portalNames = {
          doctor: 'Ophthalmologist Tele-Consultation Cockpit',
          admin: 'State Epidemiological Surveillance Center',
          health_worker: 'Frontline Clinical Triage Workspace',
        };

        setPortalSwitchInfo({
          from: fromPortal,
          to: toPortal,
          targetName: portalNames[toPortal] || 'Clinical Portal',
        });

        setTimeout(() => {
          setPortalSwitchInfo(null);
        }, 550);
      }

      // Start top navigation laser progress
      setIsNavigating(true);
      setNavProgress(20);

      const t1 = setTimeout(() => setNavProgress(65), 80);
      const t2 = setTimeout(() => setNavProgress(90), 180);
      const t3 = setTimeout(() => {
        setNavProgress(100);
        setTimeout(() => {
          setIsNavigating(false);
          setNavProgress(0);
        }, 150);
      }, 280);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [location.pathname, location.search]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingConfig,
        startLoading,
        updateProgress,
        stopLoading,
        withLoading,
        isNavigating,
        navProgress,
        portalSwitchInfo,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export default LoadingContext;
