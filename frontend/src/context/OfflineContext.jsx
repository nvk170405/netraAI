import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingRecords, setPendingRecords] = useState(() => {
    const stored = localStorage.getItem('netra_pending_sync');
    return stored ? JSON.parse(stored) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when connection is restored
      if (pendingRecords.length > 0) {
        simulateSync();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingRecords]);

  const addPendingRecord = useCallback((record) => {
    setPendingRecords(prev => {
      const updated = [...prev, { ...record, timestamp: Date.now() }];
      localStorage.setItem('netra_pending_sync', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const simulateSync = useCallback(async () => {
    if (isSyncing || pendingRecords.length === 0) return;

    setIsSyncing(true);
    setSyncedCount(0);
    const total = pendingRecords.length;

    for (let i = 0; i < total; i++) {
      await new Promise(r => setTimeout(r, 800));
      setSyncedCount(i + 1);
    }

    setPendingRecords([]);
    localStorage.removeItem('netra_pending_sync');
    setIsSyncing(false);
    setShowSyncSuccess(true);

    setTimeout(() => setShowSyncSuccess(false), 4000);
  }, [isSyncing, pendingRecords]);

  // Toggle offline mode for demo purposes
  const toggleOfflineDemo = useCallback(() => {
    setIsOnline(prev => !prev);
  }, []);

  return (
    <OfflineContext.Provider value={{
      isOnline, pendingRecords, isSyncing, syncedCount, showSyncSuccess,
      addPendingRecord, simulateSync, toggleOfflineDemo
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
}
