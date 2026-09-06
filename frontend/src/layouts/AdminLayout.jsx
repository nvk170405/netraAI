import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import CapsuleSidebar from '../components/dashboard/CapsuleSidebar';
import { BarChart3, ShieldCheck, LayoutDashboard, Globe } from 'lucide-react';

export default function AdminLayout() {
  const { user, switchRole, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
      <CapsuleSidebar portal="admin" />

      {/* 2. Main Admin Intelligence Stage */}
      <main
        style={{
          flex: 1,
          marginLeft: '104px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#030712',
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
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
          {/* Admin Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                boxShadow: '0 0 10px #f59e0b'
              }}
            />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{user?.name || 'Dr. Navin Kumar'}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '0.68rem',
                    fontWeight: 600
                  }}
                >
                  State Rural Health Mission Director
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Epidemiological Surveillance Hub • SIH Smart Health Informatics Center
              </div>
            </div>
          </div>

          {/* Quick Role Toggle Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { switchRole('health_worker'); navigate('/dashboard'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                color: '#2dd4bf',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Switch to Health Worker
            </button>

            <button
              onClick={() => { switchRole('doctor'); navigate('/doctor'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Switch to Doctor
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
