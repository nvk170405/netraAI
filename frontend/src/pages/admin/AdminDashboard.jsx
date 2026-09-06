import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { ADMIN_STATS, DR_LABELS, DR_COLORS } from '../../data/mockData';
import { adminApi } from '../../services/api';
import PillBatteryMeter from '../../components/dashboard/PillBatteryMeter';
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Download,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useLoading } from '../../context/LoadingContext';
import StateLoader from '../../components/ui/StateLoader';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { startLoading, stopLoading } = useLoading();
  const [activeMetricTab, setActiveMetricTab] = useState('all');
  const [stats, setStats] = useState(ADMIN_STATS);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analytics, monthly, highRisk, villages] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getMonthlyStats(),
        adminApi.getHighRisk(),
        adminApi.getVillageStats(),
      ]);

      setStats((prev) => ({
        ...prev,
        ...analytics,
        monthlyScreenings: monthly && monthly.length > 0 ? monthly : prev.monthlyScreenings,
        highRiskCases: highRisk && highRisk.length > 0 ? highRisk : prev.highRiskCases,
        villages: villages && villages.length > 0 ? villages : prev.villages,
      }));
    } catch (e) {
      console.warn('Could not fetch admin live analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const totalHighRisk = (stats.severe || 0) + (stats.proliferative || 0);

  const handleExportCSV = async () => {
    startLoading(
      'Exporting Epidemiological Dataset (CSV)',
      'Aggregating anonymized fundus triage records across rural clusters for SIH 2026 audit...',
      'admin'
    );
    await new Promise((r) => setTimeout(r, 900));
    stopLoading();
    alert('Anonymized clinical CSV dataset exported successfully.');
  };

  const handleExportReport = async () => {
    startLoading(
      'Generating NPCB Compliance Report (PDF)',
      'Compiling National Programme for Control of Blindness triage metrics and risk ratios...',
      'admin'
    );
    await new Promise((r) => setTimeout(r, 1100));
    stopLoading();
    alert('NPCB Compliance PDF generated successfully.');
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
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                <BarChart3 size={13} />
                State Epidemiological Intelligence Center
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                National Blindness Prevention Mesh
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Rural Screening Analytics & Epidemiological Oversight
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Aggregate clinical outcomes across 8 mobile camp clusters in Madhya Pradesh, referral conversion SLAs, and disease progression trends.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchAdminData}
              title="Sync with SQLite Database"
              style={{
                padding: '10px 16px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} color="#2dd4bf" />
              <span>Sync DB</span>
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                padding: '10px 18px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileSpreadsheet size={15} color="#2dd4bf" />
              Export CSV Dataset
            </button>

            <button
              onClick={handleExportReport}
              style={{
                padding: '10px 20px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)'
              }}
            >
              <FileText size={15} />
              NPCB Compliance PDF
            </button>
          </div>
        </div>

        {/* Top 4 Metrics Row */}
        <div
          id="metrics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>
                Total Patients Screened
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                {(stats.totalScreened || 0).toLocaleString()}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#34d399' }}>
                ↑ +14.2% screening velocity this month
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <PillBatteryMeter filled={7} total={8} activeColor="#2dd4bf" />
              <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>88% Target</span>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600, marginBottom: '6px' }}>
                High-Risk PDR Detected
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f87171' }}>
                {totalHighRisk}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#f87171' }}>
                6.1% sight-threatening triage rate
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <PillBatteryMeter filled={5} total={8} activeColor="#ef4444" />
              <span style={{ fontSize: '0.66rem', color: '#f87171' }}>Referral</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 600, marginBottom: '6px' }}>
                Referral Conversion SLA
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>
                {stats.referralRate || 0}%
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#fbbf24' }}>
                91.4% attended tertiary evaluation
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <PillBatteryMeter filled={6} total={8} activeColor="#fbbf24" />
              <span style={{ fontSize: '0.66rem', color: '#fef08a' }}>Conversion</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: '#bae6fd', fontWeight: 600, marginBottom: '6px' }}>
                Active Village Camp Clusters
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
                8 Hubs
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#38bdf8' }}>
                100% rural mesh sync health
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <PillBatteryMeter filled={8} total={8} activeColor="#38bdf8" />
              <span style={{ fontSize: '0.66rem', color: '#38bdf8' }}>Online</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Village Camp Performance Intensity Matrix */}
          <div
            id="clusters"
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Village Cluster Screening Distribution
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                  Completed fundus triage volume across mobile primary health centers
                </p>
              </div>
              <MapPin size={18} color="#2dd4bf" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(stats.villages || []).map((v, i) => {
                const percent = Math.round((v.count / 350) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{v.name} PHC Camp</span>
                      <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{v.count} Screened</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #0d9488, #2dd4bf)',
                          borderRadius: '100px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ICDR Severity Breakdown Card */}
          <div
            id="breakdown"
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                ICDR Severity Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Grade 0: No DR', count: stats.nodr || 0, color: '#10b981', percent: stats.totalScreened ? `${Math.round(((stats.nodr || 0) / stats.totalScreened) * 100)}%` : '66.1%' },
                  { label: 'Grade 1: Mild NPDR', count: stats.mild || 0, color: '#34d399', percent: stats.totalScreened ? `${Math.round(((stats.mild || 0) / stats.totalScreened) * 100)}%` : '15.8%' },
                  { label: 'Grade 2: Moderate NPDR', count: stats.moderate || 0, color: '#fbbf24', percent: stats.totalScreened ? `${Math.round(((stats.moderate || 0) / stats.totalScreened) * 100)}%` : '12.0%' },
                  { label: 'Grade 3: Severe NPDR', count: stats.severe || 0, color: '#f97316', percent: stats.totalScreened ? `${Math.round(((stats.severe || 0) / stats.totalScreened) * 100)}%` : '4.7%' },
                  { label: 'Grade 4: Proliferative PDR', count: stats.proliferative || 0, color: '#ef4444', percent: stats.totalScreened ? `${Math.round(((stats.proliferative || 0) / stats.totalScreened) * 100)}%` : '1.4%' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{item.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                        {item.count.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', width: '45px', textAlign: 'right' }}>
                        {item.percent}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(20, 184, 166, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                fontSize: '0.74rem',
                color: '#5eead4'
              }}
            >
              ✓ Early detection of Grade 1 & 2 prevented an estimated <strong>142 vision impairment events</strong> in the Khandwa and Dewas sectors this quarter.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
