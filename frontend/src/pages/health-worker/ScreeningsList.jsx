import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { RECENT_SCREENINGS } from '../../data/mockData';
import { screeningsApi } from '../../services/api';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wifi,
  ChevronRight,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import StateLoader from '../../components/ui/StateLoader';

const FILTER_TABS = [
  { id: 'all', label: 'All Patients' },
  { id: 'urgent', label: 'High Risk (PDR)', urgent: true },
  { id: 'moderate', label: 'Moderate NPDR' },
  { id: 'mild', label: 'Mild NPDR' },
  { id: 'normal', label: 'No DR' },
  { id: 'offline', label: 'Offline Records' }
];

export default function ScreeningsList() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [screenings, setScreenings] = useState(RECENT_SCREENINGS);
  const [loading, setLoading] = useState(false);

  const fetchScreenings = async () => {
    setLoading(true);
    try {
      const data = await screeningsApi.getRecent(50);
      if (data && data.length > 0) {
        setScreenings(data);
      }
    } catch (e) {
      console.warn('Could not fetch screenings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  const filtered = screenings.filter((s) => {
    const matchesSearch =
      s.patientId.toLowerCase().includes(search.toLowerCase()) ||
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.result.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'urgent') return s.riskLevel === 'high' || s.status === 'referral';
    if (activeTab === 'moderate') return s.result.includes('Moderate');
    if (activeTab === 'mild') return s.result.includes('Mild');
    if (activeTab === 'normal') return s.result.includes('No DR');
    if (activeTab === 'offline') return s.status === 'review';
    return true;
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'moderate':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'high':
      case 'urgent':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

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
                <ClipboardList size={13} />
                Rural Eye Registry • 2,482 Screened
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Patient Screenings Directory
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Comprehensive clinical database of rural diabetic eye exams with instant Grad-CAM review, referral slips, and export.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={fetchScreenings}
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

            <button
              onClick={() => navigate('/screening/new')}
              style={{
                padding: '10px 22px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)'
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              New Screening
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          {/* Segmented Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    background: isActive ? 'rgba(20, 184, 166, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                    border: isActive ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#5eead4' : '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient name, ID, or severity..."
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                borderRadius: '100px',
                padding: '9px 16px 9px 38px',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
                width: '280px'
              }}
            />
          </div>
        </div>

        {/* Clinical Records Table */}
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
                    Patient Identity
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    AI DR Diagnosis
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Model Confidence
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Triage & Referral
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Exam Date
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Clinical Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px 16px' }}>
                      <StateLoader
                        variant="table"
                        title="Querying Encrypted Screening Registry..."
                        rows={5}
                        portal="health_worker"
                      />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8', fontSize: '0.86rem' }}>
                      No screening records found matching the active filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                  const riskStyle = getRiskColor(s.riskLevel);
                  return (
                    <motion.tr
                      key={s.id}
                      whileHover={{ backgroundColor: 'rgba(15, 30, 48, 0.6)' }}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onClick={() =>
                        navigate('/screening/results', {
                          state: {
                            screening: {
                              ...s,
                              prediction: {
                                class: s.riskLevel === 'low' ? 0 : s.riskLevel === 'moderate' ? 2 : 3,
                                label: s.result,
                                confidence: s.confidence,
                                probabilities: {
                                  no_dr: s.riskLevel === 'low' ? s.confidence : 0.03,
                                  mild: 0.07,
                                  moderate: s.riskLevel === 'moderate' ? s.confidence : 0.05,
                                  severe: s.riskLevel === 'high' ? s.confidence : 0.03,
                                  proliferative: 0.02
                                }
                              }
                            },
                            isDemo: true
                          }
                        })
                      }
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.86rem' }}>
                          {s.patientName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {s.patientId} • Khandwa Camp
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: riskStyle.bg,
                            color: riskStyle.text,
                            border: `1px solid ${riskStyle.border}`,
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: riskStyle.text }} />
                          {s.result}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '70px', height: '6px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${s.confidence * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
                                borderRadius: '100px'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>
                            {Math.round(s.confidence * 100)}%
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            color: s.status === 'referral' ? '#f87171' : s.status === 'review' ? '#fbbf24' : '#34d399',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {s.status === 'referral' && <AlertTriangle size={12} />}
                          {s.status === 'review' && <Clock size={12} />}
                          {s.status === 'complete' && <CheckCircle2 size={12} />}
                          {s.status}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.76rem', color: '#64748b' }}>
                        {s.date}
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/screening/explain', { state: { screening: s } });
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: 'rgba(20, 184, 166, 0.15)',
                              border: '1px solid rgba(45, 212, 191, 0.3)',
                              color: '#2dd4bf',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Grad-CAM
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/screening/report', { state: { screening: s } });
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#cbd5e1',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Report
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
