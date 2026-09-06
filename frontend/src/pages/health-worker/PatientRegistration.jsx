import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { generatePatientId } from '../../data/mockData';
import { patientsApi } from '../../services/api';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function PatientRegistration() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientId: generatePatientId(),
    name: '',
    age: '',
    gender: '',
    phone: '',
    village: '',
    diabetesDuration: '',
    eyeProblems: 'none',
    previousScreening: 'no',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await patientsApi.create(form);
      const patientState = {
        ...form,
        id: created.id,
        patient_id: created.id,
        patientId: created.patient_code || form.patientId,
      };
      navigate('/screening/capture', { state: { patient: patientState } });
    } catch (err) {
      console.warn('Patient creation error, proceeding with local form:', err);
      navigate('/screening/capture', { state: { patient: form } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Stepper */}
      <div className="stepper">
        <div className="stepper-step active">
          <div className="stepper-circle">1</div>
          <span className="stepper-label" style={{ display: 'inline' }}>{t('patient')}</span>
        </div>
        <div className="stepper-line"></div>
        <div className="stepper-step">
          <div className="stepper-circle">2</div>
          <span className="stepper-label">{t('retinalImage')}</span>
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
          <h3 className="card-title">{t('newPatient')}</h3>
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{t('step')} 1 {t('of')} 4</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="patientId">{t('patientId')}</label>
              <input id="patientId" className="form-input" value={form.patientId} readOnly style={{ background: 'var(--gray-50)' }} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">{t('patientName')} *</label>
                <input id="name" className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Enter patient name" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="age">{t('age')} *</label>
                <input id="age" className="form-input" type="number" value={form.age} onChange={e => handleChange('age', e.target.value)} placeholder="e.g. 55" min="1" max="120" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="gender">{t('gender')} *</label>
                <select id="gender" className="form-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">{t('mobileNumber')}</label>
                <input id="phone" className="form-input" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="9876543210" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="village">{t('village')} *</label>
              <input id="village" className="form-input" value={form.village} onChange={e => handleChange('village', e.target.value)} placeholder="e.g. Khandwa" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="diabetesDuration">{t('diabetesDuration')}</label>
                <input id="diabetesDuration" className="form-input" type="number" value={form.diabetesDuration} onChange={e => handleChange('diabetesDuration', e.target.value)} placeholder="e.g. 10" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="eyeProblems">{t('existingEyeProblems')}</label>
                <select id="eyeProblems" className="form-select" value={form.eyeProblems} onChange={e => handleChange('eyeProblems', e.target.value)}>
                  <option value="none">{t('none')}</option>
                  <option value="cataract">Cataract</option>
                  <option value="glaucoma">Glaucoma</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('previousScreening')}</label>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                  <input type="radio" name="prevScreening" value="yes" checked={form.previousScreening === 'yes'} onChange={() => handleChange('previousScreening', 'yes')} />
                  {t('yes')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                  <input type="radio" name="prevScreening" value="no" checked={form.previousScreening === 'no'} onChange={() => handleChange('previousScreening', 'no')} />
                  {t('no')}
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> {t('back')}
              </button>
              <button type="submit" className="btn btn-primary">
                {t('continueToScreening')} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
