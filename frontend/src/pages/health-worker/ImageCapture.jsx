import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Upload, Camera, CheckCircle2, ArrowLeft, ArrowRight, Image } from 'lucide-react';

export default function ImageCapture() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragover, setDragover] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(t('invalidFormat'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleProceed = () => {
    navigate('/screening/quality', {
      state: { patient, image: imagePreview }
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
        <div className="stepper-step active">
          <div className="stepper-circle">2</div>
          <span className="stepper-label" style={{ display: 'inline' }}>{t('retinalImage')}</span>
        </div>
        <div className="stepper-line"></div>
        <div className="stepper-step">
          <div className="stepper-circle">3</div>
          <span className="stepper-label">{t('imageQuality')}</span>
        </div>
        <div className="stepper-line"></div>
        <div className="stepper-step">
          <div className="stepper-circle">4</div>
          <span className="stepper-label">{t('result')}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('retinalImage')}</h3>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{t('step')} 2 {t('of')} 4</span>
        </div>
        <div className="card-body">
          {error && (
            <div style={{ background: 'var(--danger-light)', color: '#991B1B', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-sm)' }}>
              {error}
            </div>
          )}

          {!imagePreview ? (
            <div
              className={`upload-area ${dragover ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleDrop}
            >
              <Upload size={48} />
              <h3>{t('dragDropImage')}</h3>
              <p>{t('supportedFormats')}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  <Upload size={16} /> {t('uploadImage')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={(e) => e.stopPropagation()}>
                  <Camera size={16} /> {t('captureImage')}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                background: 'var(--gray-900)', aspectRatio: '1',
                maxHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', maxWidth: 400
              }}>
                <img src={imagePreview} alt="Retinal scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { setImage(null); setImagePreview(null); }}>
                  <Image size={14} /> Change Image
                </button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ marginTop: 'var(--space-6)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--navy-900)' }}>
              {t('imageTips')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[t('tip1'), t('tip2'), t('tip3'), t('tip4')].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-sm)', color: 'var(--gray-600)' }}>
                  <CheckCircle2 size={14} color="var(--success)" /> {tip}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> {t('back')}
            </button>
            <button className="btn btn-primary" disabled={!imagePreview} onClick={handleProceed}>
              {t('next')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
