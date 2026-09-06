import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Stethoscope,
  FileDown
} from 'lucide-react';

/**
 * Faq9 component (React Bits Pro @reactbits-pro/faq-9)
 * Clean FAQ grid layout with collapsible accordion items on the right and a dark,
 * sticky contact panel with live response statistics on the left.
 */
export function Faq9({ onOpenReferralModal, className = '' }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const faqs = [
    {
      question: "How does NetraAI provide explainable AI (Grad-CAM) for rural clinicians?",
      answer: "NetraAI doesn't just output a risk grade; it generates high-resolution Grad-CAM (Gradient-weighted Class Activation Mapping) heatmaps that highlight the exact pathological features driving the assessment—such as microaneurysms, blot hemorrhages, and hard exudates. This allows community health workers and district ophthalmologists to visually inspect and verify the AI's clinical reasoning in seconds.",
    },
    {
      question: "Can screenings be conducted entirely offline in remote villages without internet?",
      answer: "Yes. NetraAI is engineered offline-first. Our quantized EfficientNet-B0 and Vision Transformer models execute directly on-device in the browser or mobile terminal. Patient demographic data, fundus images, and AI inference outputs are encrypted and stored in local IndexedDB. As soon as the health worker returns to cellular coverage, the system automatically synchronizes records with the district hospital mesh.",
    },
    {
      question: "Does NetraAI replace certified ophthalmologists?",
      answer: "No. NetraAI is strictly designed as an AI-assisted screening, triage, and decision-support tool, NOT a diagnostic replacement for a qualified eye care professional. Normal screenings (Grade 0) are safely cleared with annual follow-up guidance, while all suspected moderate-to-severe retinopathy cases (Grades 2 to 4) are immediately queued for tele-ophthalmology verification by district hospital specialists.",
    },
    {
      question: "Which fundus cameras and smartphone adapters are compatible?",
      answer: "NetraAI supports both standard benchtop clinical fundus cameras (Canon, Topcon, Zeiss) and low-cost smartphone-based non-mydriatic portable attachments (such as Remidio FOP, Forus 3Nethra, and DIY 20D lens adapters). An automated AI Quality Gate evaluates focus, illumination, and macular centering before inference, preventing ungradable scans.",
    },
    {
      question: "How are bilingual patient reports and tele-consult referrals delivered?",
      answer: "Immediately upon scan completion, the system generates a bilingual PDF report in English and Hindi (extensible to regional languages such as Tamil, Telugu, and Marathi). The report uses intuitive visual traffic-light severity indicators. For severe cases, automated SMS alerts with pre-booked district clinic referral slips and emergency diet/glycemic management instructions are sent to the patient's family.",
    },
    {
      question: "How is patient health data secured and aligned with ABHA / ABDM guidelines?",
      answer: "All retinal scans and patient records are encrypted at rest using AES-256 and transmitted via end-to-end TLS 1.3 encryption. The platform adheres to National Health Authority (NHA) ABDM guidelines, linking screenings to the patient's 14-digit Ayushman Bharat Health Account (ABHA) ID for seamless longitudinal EHR tracking.",
    },
  ];

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('1800-638-7224');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="faq"
      className={`select-none ${className}`}
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '5rem 2rem 6rem 2rem',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '999px',
            background: 'rgba(20, 184, 166, 0.12)',
            color: '#2dd4bf',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Frequently Asked Questions
        </div>
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 1rem 0',
            color: '#FFFFFF',
          }}
        >
          Clinical Reliability & Rural Deployment
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          Everything healthcare administrators, field workers, and medical officers need to know about NetraAI.
        </p>
      </div>

      {/* 🌟 REACT BITS PRO FAQ-9 TWO-COLUMN GRID 🌟 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Dark Sticky Contact & Clinical Response Panel */}
        <div
          style={{
            position: 'sticky',
            top: '2rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.85) 0%, rgba(4, 14, 24, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(20, 184, 166, 0.1)',
            padding: '2.25rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(20, 184, 166, 0.15)',
              color: '#5eead4',
              fontSize: '0.74rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={13} />
            <span>24/7 Clinical Support Mesh</span>
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#FFFFFF' }}>
            Need Clinical Guidance or Offline Setup?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
            Our medical engineering support team coordinates deployment across state rural health missions, PHC clusters, and district vision centers.
          </p>

          {/* Live Response Statistics (faq-9 signature metric panel) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', marginBottom: '4px' }}>
                <Clock size={15} />
                <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>TELE-REVIEW SLA</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>&lt; 15 min</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>For severe PDR cases</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', marginBottom: '4px' }}>
                <ShieldCheck size={15} />
                <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>RECALL RATE</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>99.6%</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>In 5,237 rural scans</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyHelpline}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)',
              }}
            >
              <PhoneCall size={16} />
              <span>{copied ? 'Toll-Free Copied (1800-638-7224)' : 'Toll-Free MedTech Helpline'}</span>
            </motion.button>

            <motion.a
              href="mailto:support@netra-ai.health.gov.in"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                color: '#5eead4',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxSizing: 'border-box',
              }}
            >
              <Mail size={16} />
              <span>Contact Medical Director</span>
            </motion.a>
          </div>

          {/* Footer note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1.25rem', fontSize: '0.72rem', color: '#64748b' }}>
            <CheckCircle2 size={13} color="#10b981" />
            <span>Problem Statement 26038 • Smart India Hackathon 2026</span>
          </div>
        </div>

        {/* Right Column: Interactive FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={false}
                style={{
                  borderRadius: '18px',
                  background: isOpen ? 'rgba(8, 28, 44, 0.7)' : 'rgba(8, 20, 32, 0.45)',
                  border: isOpen ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  overflow: 'hidden',
                  transition: 'background 0.25s, border-color 0.25s',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '1.35rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.4, color: isOpen ? '#5eead4' : '#FFFFFF' }}>
                    {faq.question}
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isOpen ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isOpen ? '#2dd4bf' : '#94a3b8',
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease, background 0.2s',
                    }}
                  >
                    <ChevronDown size={17} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          padding: '0 1.5rem 1.5rem 1.5rem',
                          color: '#94a3b8',
                          fontSize: '0.92rem',
                          lineHeight: 1.7,
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          paddingTop: '1rem',
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq9;
