import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Camera, Check, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewPatientModal({ isOpen, onClose }) {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [village, setVillage] = useState('Kalyanpur PHC');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      navigate('/login');
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(16px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.98) 0%, rgba(3, 10, 20, 0.99) 100%)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.25)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(20, 184, 166, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2dd4bf',
                }}
              >
                <UserPlus size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Quick Patient Registration</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Register patient for fundus imaging & AI analysis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  color: '#10b981',
                }}
              >
                <Check size={28} />
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Patient Registered!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Redirecting to retinal fundus image capture terminal...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Patient Full Name (मरीज़ का नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Kamala Devi"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    Age (उम्र)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 58"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(45, 212, 191, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    Gender (लिंग)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(8, 24, 38, 1)',
                      border: '1px solid rgba(45, 212, 191, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Female">Female (महिला)</option>
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Village / Primary Health Centre
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rampur Sub-Centre, Ward 3"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Camera size={16} />
                <span>Register & Open Camera Capture</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
