import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { DOCTOR_CASES } from '../../data/mockData';
import { doctorApi } from '../../services/api';
import PillBatteryMeter from '../../components/dashboard/PillBatteryMeter';
import {
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  ShieldCheck,
  ChevronRight,
  Filter,
  Search,
  Zap,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import StateLoader from '../../components/ui/StateLoader';

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilter = searchParams.get('filter');
  const [filter, setFilter] = useState(urlFilter || 'all');
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState(DOCTOR_CASES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlFilter) {
      setFilter(urlFilter);
    } else {
      setFilter('all');
    }
  }, [urlFilter]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await doctorApi.getCases();
      if (data && data.length > 0) {
        setCases(data);
      }
    } catch (e) {
      console.warn('Could not fetch doctor cases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      (c.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.patientId || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.village || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'high') return c.priority === 'HIGH';
    if (filter === 'medium') return c.priority === 'MEDIUM';
    if (filter === 'low') return c.priority === 'LOW';
    if (filter === 'pending') return c.status === 'pending';
    if (filter === 'reviewed') return c.status === 'reviewed';
    return true;
  });

  const highRiskCount = cases.filter((c) => c.priority === 'HIGH').length;
  const pendingCount = cases.filter((c) => c.status === 'pending').length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: '#f8fafc',
        padding: '24px 32px 64px',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  color: '#2dd4bf',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                <Stethoscope size={13} />
                Doctor's Diagnostic Cockpit
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                AI Pre-Triaged Queue Active
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Doctor Case Review & Second Opinion Hub
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Verify AI-assisted Diabetic Retinopathy diagnoses, inspect Grad-CAM biomarker heatmaps, and authorize tertiary referrals.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchCases}
              title="Sync with SQLite Database"
              style={{
                padding: '10px 16px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Sync DB</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 20px',
                borderRadius: '20px',
                background: 'rgba(8, 20, 34, 0.8)',
                border: '1px solid rgba(20, 184, 166, 0.25)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Awaiting Sign-Off</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>{pendingCount} Cases</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Turnaround SLA</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2dd4bf' }}>&lt; 12.4m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Metric Cards with PillBatteryMeter */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          {/* Metric 1 */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Pending Specialist Queue
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                {pendingCount} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 7 Total</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.76rem', color: '#5eead4' }}>
                ✓ {DOCTOR_CASES.length - pendingCount} cases signed off today
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <PillBatteryMeter filled={5} total={8} activeColor="#2dd4bf" />
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Load</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fca5a5', marginBottom: '8px' }}>
                High Priority PDR / CSME
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f87171' }}>
                {highRiskCount} <span style={{ fontSize: '1rem', color: '#64748b' }}>Urgent</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.76rem', color: '#f87171' }}>
                ⚡ Requires &lt;48h tertiary referral dispatch
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <PillBatteryMeter filled={6} total={8} activeColor="#ef4444" />
              <span style={{ fontSize: '0.68rem', color: '#f87171' }}>Urgent</span>
            </div>
          </div>

          {/* Metric 3: Fast Action Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.15))',
              borderRadius: '24px',
              border: '1.5px solid rgba(45, 212, 191, 0.4)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={16} color="#5eead4" />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#5eead4' }}>
                  RAPID DIGITAL SIGN-OFF
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Review Highest Priority Case
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                {DOCTOR_CASES[0].patientName} • {DOCTOR_CASES[0].result} ({DOCTOR_CASES[0].village})
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => navigate(`/doctor/case/${DOCTOR_CASES[0].id}`, { state: { caseData: DOCTOR_CASES[0] } })}
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  background: '#ffffff',
                  border: 'none',
                  color: '#042f2e',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Launch Review Studio ▷
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'high', label: 'High Priority (PDR)' },
              { id: 'medium', label: 'Medium Priority' },
              { id: 'low', label: 'Low Priority' },
              { id: 'pending', label: 'Pending Sign-Off' },
              { id: 'reviewed', label: 'Reviewed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  if (tab.id === 'all') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ filter: tab.id });
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: filter === tab.id ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                  border: filter === tab.id ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: filter === tab.id ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: filter === tab.id ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, ID, or village..."
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              borderRadius: '100px',
              padding: '9px 18px',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>

        {/* Doctor Case Queue Table */}
        <div
          style={{
            background: 'rgba(8, 20, 34, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            padding: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Patient Info
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    AI Predicted Severity
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Model Confidence
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Triage Priority
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px 16px' }}>
                      <StateLoader
                        variant="table"
                        title="Syncing Urgent Specialist Review Queue..."
                        rows={5}
                        portal="doctor"
                      />
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8', fontSize: '0.86rem' }}>
                      No clinical cases found matching the active filter.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                  <motion.tr
                    key={c.id}
                    whileHover={{ backgroundColor: 'rgba(15, 30, 48, 0.6)' }}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onClick={() => navigate(`/doctor/case/${c.id}`, { state: { caseData: c } })}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.86rem' }}>
                        {c.patientName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {c.patientId} • {c.village} • Age {c.age}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '100px',
                          background: c.result.includes('Severe')
                            ? 'rgba(239, 68, 68, 0.15)'
                            : c.result.includes('Moderate')
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(16, 185, 129, 0.15)',
                          color: c.result.includes('Severe') ? '#f87171' : c.result.includes('Moderate') ? '#fbbf24' : '#34d399',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}
                      >
                        {c.result}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '70px', height: '6px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${c.confidence * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
                              borderRadius: '100px'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>
                          {Math.round(c.confidence * 100)}%
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: c.priority === 'HIGH' ? '#f87171' : c.priority === 'MEDIUM' ? '#fbbf24' : '#34d399'
                        }}
                      >
                        ● {c.priority} PRIORITY
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '100px',
                          background: c.status === 'reviewed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: c.status === 'reviewed' ? '#34d399' : '#fbbf24',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        {c.status === 'reviewed' ? '✓ Signed Off' : 'Pending Review'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: 'rgba(20, 184, 166, 0.15)',
                          border: '1px solid rgba(45, 212, 191, 0.3)',
                          color: '#2dd4bf',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Review Case
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
