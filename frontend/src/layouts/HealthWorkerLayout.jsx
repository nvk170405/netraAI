import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import CapsuleSidebar from '../components/dashboard/CapsuleSidebar';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Globe } from 'lucide-react';

export default function HealthWorkerLayout() {
  const { user } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { isOnline, pendingRecords, isSyncing, syncedCount, showSyncSuccess, toggleOfflineDemo } = useOffline();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: '#f8fafc',
        display: 'flex',
        position: 'relative'
      }}
    >
      {/* 1. Floating Capsule Sidebar (Image 2 style) */}
      <CapsuleSidebar />

      {/* 2. Main Content Area */}
      <main
        style={{
          flex: 1,
          marginLeft: '104px', // Accommodates 74px floating dock + margins
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#030712',
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
        {/* Offline & Sync Alerts */}
        {!isOnline && (
          <div
            style={{
              padding: '10px 24px',
              background: 'rgba(239, 68, 68, 0.15)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500
            }}
          >
            <WifiOff size={16} />
            <span>
              <strong>{t('offline')}</strong> — {pendingRecords.length > 0 ? `${pendingRecords.length} ${t('recordsPending')}` : t('dataSyncAuto')}
            </span>
          </div>
        )}

        {isSyncing && (
          <div
            style={{
              padding: '10px 24px',
              background: 'rgba(20, 184, 166, 0.15)',
              borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
              color: '#5eead4',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500
            }}
          >
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span>
              {t('syncing')} {syncedCount}/{pendingRecords.length + syncedCount}
            </span>
          </div>
        )}

        {showSyncSuccess && (
          <div
            style={{
              padding: '10px 24px',
              background: 'rgba(16, 185, 129, 0.15)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500
            }}
          >
            <CheckCircle2 size={16} />
            <span>✓ {t('syncComplete')}</span>
          </div>
        )}

        {/* Top Floating Glass Navigation Bar */}
        <header
          style={{
            height: '64px',
            background: 'rgba(8, 20, 34, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          {/* Left Location & Clinic context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isOnline ? '#10b981' : '#f59e0b',
                boxShadow: isOnline ? '0 0 10px #10b981' : 'none'
              }}
            />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{user?.name || 'Anita Patel (ASHA Health Worker)'}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(20, 184, 166, 0.15)',
                    color: '#2dd4bf',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    fontSize: '0.68rem',
                    fontWeight: 600
                  }}
                >
                  PHC Triage Lead
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {user?.location || 'Khandwa Mobile Eye Screening Camp • Sector 4'}
              </div>
            </div>
          </div>

          {/* Right Controls: Mesh Status + Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Offline Simulation toggle */}
            <button
              onClick={toggleOfflineDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '100px',
                background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: isOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: isOnline ? '#34d399' : '#fca5a5',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Click to toggle offline mode simulation"
            >
              {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
              <span>{isOnline ? 'Online Mesh Active' : 'Offline Mode (Demo)'}</span>
            </button>

            {/* Language switch */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '100px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => language !== 'en' && toggleLanguage()}
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: language === 'en' ? 'linear-gradient(135deg, #14b8a6, #0891b2)' : 'transparent',
                  color: language === 'en' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                EN
              </button>
              <button
                onClick={() => language !== 'hi' && toggleLanguage()}
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: language === 'hi' ? 'linear-gradient(135deg, #14b8a6, #0891b2)' : 'transparent',
                  color: language === 'hi' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                हिं
              </button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        {/* Disclaimer Footer */}
        <footer
          style={{
            padding: '20px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(3, 7, 18, 0.95)',
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '0.74rem', color: '#64748b', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
            {t('screeningDisclaimer') || 'NetraAI is an assistive AI clinical decision support tool designed for rural screening. Final diagnoses and surgical interventions require evaluation by a registered ophthalmologist.'}
          </p>
        </footer>
      </main>
    </div>
  );
}
