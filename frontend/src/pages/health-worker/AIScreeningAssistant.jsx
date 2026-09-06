import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Camera,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Namaste! I am the NetraAI Clinical Assistant. I can help you with camera positioning, diagnosing fundus artifacts, explaining DR severity to patients in Hindi, or executing ICDR triage protocols. How can I assist your screening session today?',
    hindiText: 'नमस्ते! मैं नेत्रा-एआई क्लिनिकल सहायक हूँ। मैं आपको कैमरा पोज़िशनिंग, फंडस इमेज क्वालिटी सुधारने, मरीजों को हिंदी में रिपोर्ट समझाने और आईसीडीआर रेफरल नियमों में मदद कर सकता हूँ।',
    time: '10:02 AM'
  }
];

const PRESET_CHIPS = [
  {
    label: 'Glare on pupil capture',
    query: 'How do I avoid glare and reflection when capturing retinal images with a handheld camera in rural sunlight?'
  },
  {
    label: 'Explain Grade 2 in Hindi',
    query: 'How do I explain Moderate NPDR (Grade 2) to an elderly rural patient in simple Hindi?'
  },
  {
    label: 'The 4-2-1 rule for Severe DR',
    query: 'What is the exact 4-2-1 rule for diagnosing Severe NPDR under the ICDR guidelines?'
  },
  {
    label: 'Emergency 108 referral trigger',
    query: 'When should I immediately call 108 emergency transport for a diabetic patient?'
  }
];

export default function AIScreeningAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [isTyping, setIsTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response with clinical intelligence
    setTimeout(() => {
      let botResponse = '';
      const q = query.toLowerCase();

      if (q.includes('glare') || q.includes('reflection') || q.includes('camera')) {
        botResponse = `To eliminate glare artifacts in non-mydriatic handheld fundus imaging:\n1. Ensure the patient is in a shaded or dimly lit corner (dark cloth overhead works well in field camps).\n2. Wait 2 minutes for natural physiological pupil dilation (scotopic response).\n3. Keep the lens perpendicular (90°) to the cornea, and adjust working distance to 18-22mm until the blue alignment LEDs align.\n4. If crescent reflections appear at the border, slightly tilt the camera 2-3 degrees inferiorly.`;
      } else if (q.includes('hindi') || q.includes('grade 2') || q.includes('moderate')) {
        botResponse = `यहाँ मरीज और परिवार को समझाने के लिए सरल हिंदी वाक्य हैं:\n"चाचाजी/माताजी, आपकी आँखों के पिछले पर्दे (रेटिना) पर मधुमेह (शुगर) के कारण खून की नसों से हल्का रिसाव और बारीक लाल धब्बे बनने लगे हैं। इसे मॉडरेट रेटिनोपैथी कहते हैं। अभी रोशनी बची हुई है, लेकिन अगर हमने 1 महीने में बड़े डॉक्टर से जांच नहीं कराई और शुगर नियंत्रित नहीं की, तो पर्दा कमजोर हो सकता है। हम आपकी रिपोर्ट सीधे इंदौर नेत्र अस्पताल भेज रहे हैं।"`;
      } else if (q.includes('4-2-1') || q.includes('severe')) {
        botResponse = `The ICDR 4-2-1 Rule identifies Severe NPDR (pre-proliferative with a 50% 1-year progression risk):\n• '4': >20 intraretinal micro-hemorrhages in each of all 4 retinal quadrants.\n• '2': Definite venous beading in 2 or more quadrants.\n• '1': Prominent Intraretinal Microvascular Abnormalities (IRMA) in 1 or more quadrants.\nMeeting ANY of these three criteria without neovascularization classifies the case as Grade 3 Severe NPDR. Schedule a 2 to 4-week tertiary consultation.`;
      } else if (q.includes('emergency') || q.includes('108') || q.includes('transport')) {
        botResponse = `Trigger emergency referral and tertiary transport immediately if:\n1. Sudden painless vision blackout or dense curtain of dark floaters (suspected Vitreous Hemorrhage).\n2. Gross neovascularization of the disc (NVD) > 1/3 disc area.\n3. Acute tractional retinal detachment.\nAction: Open the Urgent PDR Escalation Station, send the WhatsApp referral packet, and request 108 ambulance dispatch.`;
      } else {
        botResponse = `Based on NetraAI's rural clinical decision engine:\nFor the patient's retinal findings, verify optic disc centering and macula visibility. If model confidence is >80%, generate the bilingual report and assign the ICDR-directed follow-up interval. Would you like me to guide you through the camera capture or explain the Grad-CAM heatmap?`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
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
                <Sparkles size={13} />
                ASHA Clinical Decision Support Copilot
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                Offline Mesh Knowledge Base v2.4
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              AI Screening Assistant & Knowledge Copilot
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Interactive medical guidance, camera troubleshooting, local-language counseling scripts, and referral triage assistance.
            </p>
          </div>

          {/* Language Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '100px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '3px'
            }}
          >
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: language === 'en' ? 'linear-gradient(135deg, #14b8a6, #0891b2)' : 'transparent',
                color: language === 'en' ? '#ffffff' : '#94a3b8',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none'
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: language === 'hi' ? 'linear-gradient(135deg, #14b8a6, #0891b2)' : 'transparent',
                color: language === 'hi' ? '#ffffff' : '#94a3b8',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none'
              }}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        {/* Main Assistant Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          {/* Chat Interface */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              height: '620px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden'
            }}
          >
            {/* Chat Messages Body */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  {m.sender === 'bot' && (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        boxShadow: '0 0 12px rgba(20, 184, 166, 0.4)'
                      }}
                    >
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    style={{
                      borderRadius: '18px',
                      padding: '14px 18px',
                      background: m.sender === 'user' ? 'linear-gradient(135deg, #0d9488, #0891b2)' : 'rgba(15, 28, 44, 0.85)',
                      border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-line',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {language === 'hi' && m.hindiText ? m.hindiText : m.text}
                    <div
                      style={{
                        fontSize: '0.66rem',
                        color: m.sender === 'user' ? '#99f6e4' : '#64748b',
                        marginTop: '6px',
                        textAlign: 'right'
                      }}
                    >
                      {m.time}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#cbd5e1',
                        flexShrink: 0
                      }}
                    >
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(20, 184, 166, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2dd4bf'
                    }}
                  >
                    <Bot size={16} />
                  </div>
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: '14px',
                      background: 'rgba(15, 28, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.78rem',
                      color: '#5eead4'
                    }}
                  >
                    NetraAI is referencing ICDR Guidelines & Clinical DB...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              {PRESET_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: 'rgba(20, 184, 166, 0.12)',
                    border: '1px solid rgba(45, 212, 191, 0.25)',
                    color: '#2dd4bf',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  💡 {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(10, 22, 36, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <button
                onClick={() => {
                  setMicActive(!micActive);
                  if (!micActive) {
                    setTimeout(() => {
                      setInputVal('How to fix corneal reflection on fundus camera?');
                      setMicActive(false);
                    }, 2000);
                  }
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: micActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: micActive ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: micActive ? '#f87171' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Voice input simulation"
              >
                {micActive ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'hi' ? 'नेत्रा-एआई सहायक से कोई भी सवाल पूछें...' : 'Ask NetraAI anything about camera capture, DR grading, or referral...'}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '100px',
                  padding: '10px 20px',
                  fontSize: '0.84rem',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />

              <button
                onClick={() => handleSend()}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Diagnostic Decision Tree & Quick Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Flowcard 1: Image Artifacts */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Camera size={16} color="#2dd4bf" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  Camera Capture Best Practices
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                <li><strong>Illumination:</strong> Ambient camp light must be &lt; 50 lux.</li>
                <li><strong>Fixation Target:</strong> Ask patient to stare at green LED dot inside eyepiece.</li>
                <li><strong>Optic Disc Centering:</strong> 45° standard field must capture nasal arc and temporal fovea.</li>
                <li><strong>Dilation Drops:</strong> Use Tropicamide 0.5% only if pupil diameter is &lt; 3.0mm after 5 min dark adaptation.</li>
              </ul>
            </div>

            {/* Quick Flowcard 2: Referral Timelines */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <BookOpen size={16} color="#38bdf8" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  ICDR Triage Timeline Quick-Ref
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#34d399' }}>
                  <span>Grade 0 Normal:</span>
                  <strong>Annual (12m)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px', color: '#6ee7b7' }}>
                  <span>Grade 1 Mild:</span>
                  <strong>6 – 9 Months</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', color: '#fbbf24' }}>
                  <span>Grade 2 Moderate:</span>
                  <strong>3 – 6 Months</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', color: '#f97316' }}>
                  <span>Grade 3 Severe (4-2-1):</span>
                  <strong>2 – 4 Weeks</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', color: '#f87171' }}>
                  <span>Grade 4 PDR / CSME:</span>
                  <strong>&lt; 48 Hours Urgent</strong>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => navigate('/protocols')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#2dd4bf',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Explore Full ICDR Protocols
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
