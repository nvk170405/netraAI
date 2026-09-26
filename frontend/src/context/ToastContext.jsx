import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

let toastIdCounter = 0;

/**
 * Toast notification types:
 * - success: Green — operation completed successfully
 * - error: Red — something went wrong
 * - warning: Amber — degraded mode (e.g., offline fallback)
 * - info: Blue — neutral information
 */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 5000, action = null }) => {
      const id = `toast-${++toastIdCounter}`;
      const toast = { id, type, title, message, action, createdAt: Date.now() };

      setToasts((prev) => {
        // Limit to 5 visible toasts max — remove oldest if exceeding
        const next = [...prev, toast];
        if (next.length > 5) return next.slice(next.length - 5);
        return next;
      });

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  // Convenience helpers
  const success = useCallback(
    (title, message, opts = {}) => addToast({ type: 'success', title, message, ...opts }),
    [addToast]
  );

  const error = useCallback(
    (title, message, opts = {}) => addToast({ type: 'error', title, message, duration: 8000, ...opts }),
    [addToast]
  );

  const warning = useCallback(
    (title, message, opts = {}) => addToast({ type: 'warning', title, message, duration: 6000, ...opts }),
    [addToast]
  );

  const info = useCallback(
    (title, message, opts = {}) => addToast({ type: 'info', title, message, ...opts }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
