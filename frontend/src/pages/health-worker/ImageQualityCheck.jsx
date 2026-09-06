import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export default function ImageQualityCheck() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { patient, image } = location.state || {};
  const [checking, setChecking] = useState(true);
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    // Simulate quality check
    const timer = setTimeout(() => {
      setQuality({
        sharpness: true,
        brightness: true,
        retinalArea: true,
        visibility: true,
        overall: 'good'
      });
      setChecking(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const qualityItems = quality ? [
    { label: t('sharpness'), pass: quality.sharpness },
    { label: t('brightness'), pass: quality.brightness },
    { label: t('retinalArea'), pass: quality.retinalArea },
    { label: t('visibility'), pass: quality.visibility },
  ] : [];

  const handleProceed = () => {
    navigate('/screening/analysis', {
      state: { patient, image, quality }
    });
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Stepper */}
      <div className="stepper">
        <div className="stepper-step completed">
          <div className="stepper-circle"><CheckCircle2 size={16} /></div>
          <span className="stepper-label" style={{ display: 'inline' }}>{t('patient')}</span>
        </div>
        <div className="stepper-line completed"></div>
        <div className="stepper-step completed">
          <div className="stepper-circle"><CheckCircle2 size={16} /></div>
          <span className="stepper-label" style={{ display: 'inline' }}>{t('retinalImage')}</span>
        </div>
        <div className="stepper-line completed"></div>
        <div className="stepper-step active">
          <div className="stepper-circle">3</div>
          <span className="stepper-label" style={{ display: 'inline' }}>{t('imageQuality')}</span>
        </div>
        <div className="stepper-line"></div>
        <div className="stepper-step">
          <div className="stepper-circle">4</div>
          <span className="stepper-label">{t('result')}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('imageQuality')}</h3>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{t('step')} 3 {t('of')} 4</span>
        </div>
        <div className="card-body">
          {/* Image Preview */}
          {image && (
            <div style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              background: 'var(--gray-900)', aspectRatio: '1',
              maxHeight: 250, maxWidth: 250, margin: '0 auto var(--space-6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src={image} alt="Retinal scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {checking ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div className="spinner" style={{ margin: '0 auto var(--space-4)', width: 40, height: 40 }}></div>
              <p style={{ color: 'var(--gray-600)', fontWeight: 500 }}>Checking image quality...</p>
            </div>
          ) : (
            <>
              {/* Quality Grid */}
              <div className="quality-grid">
                {qualityItems.map((item, i) => (
                  <div className="quality-item" key={i}>
                    {item.pass ?
                      <CheckCircle2 size={20} color="var(--success)" /> :
                      <XCircle size={20} color="var(--danger)" />
                    }
                    <span className="quality-label">{item.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 'var(--font-xs)', fontWeight: 600, color: item.pass ? 'var(--success)' : 'var(--danger)' }}>
                      {item.pass ? t('good') : t('poor')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Overall Quality */}
              <div className={`quality-overall ${quality.overall}`}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
                  {t('overallQuality')}
                </div>
                <h3>{quality.overall === 'good' ? t('good').toUpperCase() : t('poor').toUpperCase()}</h3>
                <p style={{ fontSize: 'var(--font-sm)', marginTop: 'var(--space-2)' }}>
                  {quality.overall === 'good' ? t('qualityGood') : t('qualityPoor')}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  {quality.overall === 'poor' ? (
                    <><RotateCcw size={16} /> {t('retakeImage')}</>
                  ) : (
                    <><ArrowLeft size={16} /> {t('back')}</>
                  )}
                </button>
                {quality.overall === 'good' && (
                  <button className="btn btn-primary" onClick={handleProceed}>
                    {t('proceedToAnalysis')} <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
