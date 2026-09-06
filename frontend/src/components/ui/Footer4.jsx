import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  ArrowRight, 
  Check, 
  Shield, 
  Heart, 
  Activity, 
  Sparkles, 
  ExternalLink,
  Globe,
  Radio
} from 'lucide-react';

/**
 * Footer4 component (React Bits Pro @reactbits-pro/footer-4)
 * Premium footer featuring a bold headline, clinical alerts / newsletter signup with email input,
 * 4-column comprehensive link directory, and large glowing NetraAI logo.
 */
export function Footer4({ onOpenModal, className = '' }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  const footerLinks = [
    {
      category: 'AI Screening Platform',
      links: [
        { label: 'Grad-CAM Explainability', href: '#workflow' },
        { label: 'Center-Flow Architecture', href: '#architecture' },
        { label: 'Sensitivity Matrix (ROC)', href: '#accuracy' },
        { label: 'Edge Inference Engine', href: '#architecture' },
        { label: 'Bilingual Report Handouts', href: '#workflow' },
      ],
    },
    {
      category: 'Clinical Protocols',
      links: [
        { label: 'ICDR 5-Grade Standards', href: '#workflow' },
        { label: 'Severe PDR Referral SLA', href: '#workflow' },
        { label: 'Quality Gate Filtering', href: '#architecture' },
        { label: 'ABHA Healthpass Linkage', href: '#workflow' },
        { label: '5,237 Scan Validation Cohort', href: '#accuracy' },
      ],
    },
    {
      category: 'Role Portals',
      links: [
        { label: 'ASHA / PHC Worker Portal', href: '/dashboard' },
        { label: 'Ophthalmologist Tele-Review', href: '/doctor' },
        { label: 'Chief Medical Officer (CMO)', href: '/admin' },
        { label: 'Live Clinical Case Demo', href: '#demo' },
        { label: 'Offline Sync Mesh Terminal', href: '/dashboard' },
      ],
    },
    {
      category: 'Initiative & Compliance',
      links: [
        { label: 'Smart India Hackathon 2026', href: 'https://www.sih.gov.in', external: true },
        { label: 'Problem Statement ID 26038', href: '#faq' },
        { label: 'Tekathon 5.0 MedTech Track', href: '#faq' },
        { label: 'MoHFW Digital Guidelines', href: '#faq' },
        { label: 'Ethical AI Decision Support', href: '#faq' },
      ],
    },
  ];

  return (
    <footer
      className={`select-none ${className}`}
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, #030712 0%, #02040a 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
      }}
    >
      {/* Background Hospital-Cyan Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* 🌟 REACT BITS PRO FOOTER-4 HEADER ROW (Bold Headline + Newsletter / Updates) 🌟 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '4rem',
          }}
        >
          {/* Bold Mission Headline */}
          <div style={{ maxWidth: '620px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(20, 184, 166, 0.12)',
                color: '#2dd4bf',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={13} />
              <span>SIH 2026 Problem Statement 26038</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                color: '#FFFFFF',
                margin: '0 0 1rem 0',
              }}
            >
              Eliminating Preventable Blindness Across Rural Bharat.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
              AI-assisted retinal screening and tele-ophthalmology triage built for offline primary health centers, rural clinics, and district hospital networks.
            </p>
          </div>

          {/* Newsletter / Clinical Deployment Updates Form */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '20px',
              background: 'rgba(8, 20, 34, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
              Subscribe to Clinical Updates
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Receive updates on validation cohorts, multi-lingual model releases, and state deployment kits.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@health.gov.in"
                required
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2dd4bf')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '11px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                {subscribed ? (
                  <>
                    <Check size={16} />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.85rem', fontSize: '0.72rem', color: '#64748b' }}>
              <Shield size={12} color="#10b981" />
              <span>Zero spam. Direct medical research and deployment notices only.</span>
            </div>
          </div>
        </div>

        {/* 🌟 4-COLUMN COMPREHENSIVE LINK DIRECTORY 🌟 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h4
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#2dd4bf',
                  marginBottom: '1.25rem',
                }}
              >
                {column.category}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {column.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      style={{
                        color: '#94a3b8',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        transition: 'color 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#5eead4')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <span>{link.label}</span>
                      {link.external && <ExternalLink size={12} style={{ opacity: 0.6 }} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 🌟 LARGE NETRAAI LOGO & BOTTOM LEGAL BAR 🌟 */}
        <div
          style={{
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {/* Logo & Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(20, 184, 166, 0.4)',
                }}
              >
                <Eye size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Netra<span style={{ color: '#2dd4bf' }}>AI</span>
              </span>
            </div>

            {/* Edge Operational Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span>All Edge Screening Nodes Operational</span>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
            <div>© 2026 NetraAI • Problem Statement 26038 • Smart India Hackathon / Tekathon 5.0</div>
            <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#475569' }}>
              Screening & Clinical Decision Support System • Not an autonomous replacement for a certified ophthalmologist.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer4;
