import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useOffline } from '../../context/OfflineContext';
import { DEMO_CASES, DR_LABELS, DR_COLORS, RISK_MAP } from '../../data/mockData';
import { AlertTriangle, FileText, Eye, ArrowLeft, Shield, Activity } from 'lucide-react';

export default function ResultsPage() {
  const { t, language } = useLanguage();
  const { isOnline, addPendingRecord } = useOffline();
  const navigate = useNavigate();
  const location = useLocation();
  const [animateBars, setAnimateBars] = useState(false);

  // Get screening data from navigation state or default to demo case 2
  const screening = location.state?.screening || DEMO_CASES[1];
  const isDemo = location.state?.isDemo ?? true;
  const prediction = screening.prediction;
  const risk = RISK_MAP[prediction.class];

  useEffect(() => {
    // Animate probability bars on mount
    const timer = setTimeout(() => setAnimateBars(true), 100);

    // If offline, save to pending queue
    if (!isOnline) {
      addPendingRecord({ type: 'screening', data: screening });
    }

    return () => clearTimeout(timer);
  }, []);

  const probEntries = [
    { label: t('noDRFull'), value: prediction.probabilities.no_dr, color: DR_COLORS[0] },
    { label: t('mildDR'), value: prediction.probabilities.mild, color: DR_COLORS[1] },
    { label: t('moderateDR'), value: prediction.probabilities.moderate, color: DR_COLORS[2] },
    { label: t('severeDR'), value: prediction.probabilities.severe, color: DR_COLORS[3] },
    { label: t('proliferativeDR'), value: prediction.probabilities.proliferative, color: DR_COLORS[4] },
  ];

  const getRiskText = () => {
    const texts = {
      0: t('noRiskText'),
      1: t('mildRiskText'),
      2: t('moderateRiskText'),
      3: t('severeRiskText'),
      4: t('severeRiskText'),
    };
    return texts[prediction.class];
  };

  const getRiskLabel = () => {
    if (language === 'hi') return risk.labelHi;
    return risk.label;
  };

  const severityLabels = {
    0: t('noDRFull'),
    1: t('mildDR'),
    2: t('moderateDR'),
    3: t('severeDR'),
    4: t('proliferativeDR'),
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Demo badge */}
      {isDemo && (
        <div style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>
          <span className="badge badge-info">{t('demoMode')} — Simulated AI Result</span>
        </div>
      )}

      {/* Result Hero */}
      <div className="result-hero">
        <div className="result-patient">
          {t('patient')}: {screening.patientId}
          {screening.patientName && ` • ${screening.patientName}`}
        </div>
        <div style={{ margin: 'var(--space-4) 0' }}>
          <span style={{
            fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--gray-400)'
          }}>
            {t('aiScreeningResult')}
          </span>
        </div>
        <div className="result-severity" style={{ color: risk.color }}>
          {severityLabels[prediction.class]}
        </div>
        <div className="result-confidence">
          {t('confidence')}: {Math.round(prediction.confidence * 100)}%
        </div>
      </div>

      {/* Probability Distribution */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Activity size={18} /> DR Classification
          </h3>
        </div>
        <div className="card-body">
          <div className="probability-list">
            {probEntries.map((entry, i) => (
              <div className="probability-item" key={i}>
                <span className="probability-label">{entry.label}</span>
                <div className="probability-bar-track">
                  <div
                    className="probability-bar-fill"
                    style={{
                      width: animateBars ? `${entry.value * 100}%` : '0%',
                      background: entry.color,
                    }}
                  ></div>
                </div>
                <span className="probability-value">{Math.round(entry.value * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Level & Referral */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Shield size={18} /> {t('riskLevel')} & {t('referralRecommendation')}
          </h3>
        </div>
        <div className="card-body">
          <div className={`referral-card ${risk.level === 'low' ? 'low' : risk.level === 'moderate' ? 'moderate' : 'high'}`}>
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4>{getRiskLabel()}</h4>
              <p>{getRiskText()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 200 }} onClick={() => navigate('/screening/explain', { state: { screening, isDemo } })}>
          <Eye size={18} /> {t('viewExplanation')}
        </button>
        <button className="btn btn-secondary btn-lg" style={{ flex: 1, minWidth: 200 }} onClick={() => navigate('/screening/report', { state: { screening, isDemo } })}>
          <FileText size={18} /> {t('generateReport')}
        </button>
      </div>

      {/* Back */}
      <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={18} /> {t('backToDashboard')}
      </button>

      {/* Disclaimer */}
      <div className="disclaimer">
        <Shield size={14} /> {t('disclaimerText')}
      </div>
    </div>
  );
}
