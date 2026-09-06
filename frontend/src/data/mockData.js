// NetraAI — Mock Data & Demo Cases

export const DEMO_CASES = [
  {
    id: 'demo-1',
    patientId: 'P-10289',
    patientName: 'Ramesh Patel',
    age: 55,
    gender: 'Male',
    village: 'Bahadurpur',
    phone: '9812345671',
    diabetesDuration: 8,
    date: '2026-09-05',
    imageQuality: { sharpness: true, brightness: true, retinalArea: true, visibility: true, overall: 'good' },
    prediction: {
      class: 0,
      label: 'No DR',
      confidence: 0.94,
      probabilities: { no_dr: 0.94, mild: 0.03, moderate: 0.02, severe: 0.01, proliferative: 0.00 }
    },
    riskLevel: 'low',
    referralStatus: 'none',
    status: 'complete',
    reviewStatus: null
  },
  {
    id: 'demo-2',
    patientId: 'P-10291',
    patientName: 'Sunita Devi',
    age: 62,
    gender: 'Female',
    village: 'Khandwa',
    phone: '9812345672',
    diabetesDuration: 15,
    date: '2026-09-05',
    imageQuality: { sharpness: true, brightness: true, retinalArea: true, visibility: true, overall: 'good' },
    prediction: {
      class: 2,
      label: 'Moderate DR',
      confidence: 0.82,
      probabilities: { no_dr: 0.03, mild: 0.07, moderate: 0.82, severe: 0.06, proliferative: 0.02 }
    },
    riskLevel: 'moderate',
    referralStatus: 'recommended',
    status: 'referral',
    reviewStatus: 'pending'
  },
  {
    id: 'demo-3',
    patientId: 'P-10293',
    patientName: 'Arjun Singh',
    age: 68,
    gender: 'Male',
    village: 'Dewas',
    phone: '9812345673',
    diabetesDuration: 22,
    date: '2026-09-05',
    imageQuality: { sharpness: true, brightness: true, retinalArea: true, visibility: true, overall: 'good' },
    prediction: {
      class: 3,
      label: 'Severe DR',
      confidence: 0.89,
      probabilities: { no_dr: 0.01, mild: 0.02, moderate: 0.05, severe: 0.89, proliferative: 0.03 }
    },
    riskLevel: 'high',
    referralStatus: 'urgent',
    status: 'referral',
    reviewStatus: 'pending'
  }
];

export const RECENT_SCREENINGS = [
  { id: 's-001', patientId: 'P-10291', patientName: 'Sunita Devi', result: 'Moderate DR', confidence: 0.82, status: 'referral', date: '2026-09-05', riskLevel: 'moderate' },
  { id: 's-002', patientId: 'P-10290', patientName: 'Vikram Yadav', result: 'No DR', confidence: 0.91, status: 'complete', date: '2026-09-05', riskLevel: 'low' },
  { id: 's-003', patientId: 'P-10289', patientName: 'Ramesh Patel', result: 'No DR', confidence: 0.94, status: 'complete', date: '2026-09-05', riskLevel: 'low' },
  { id: 's-004', patientId: 'P-10288', patientName: 'Meera Joshi', result: 'Mild DR', confidence: 0.76, status: 'review', date: '2026-09-04', riskLevel: 'low' },
  { id: 's-005', patientId: 'P-10287', patientName: 'Rahul Sharma', result: 'No DR', confidence: 0.88, status: 'complete', date: '2026-09-04', riskLevel: 'low' },
  { id: 's-006', patientId: 'P-10286', patientName: 'Kavita Kumari', result: 'Severe DR', confidence: 0.89, status: 'referral', date: '2026-09-04', riskLevel: 'high' },
  { id: 's-007', patientId: 'P-10285', patientName: 'Suresh Gupta', result: 'Moderate DR', confidence: 0.78, status: 'review', date: '2026-09-03', riskLevel: 'moderate' },
  { id: 's-008', patientId: 'P-10284', patientName: 'Anita Devi', result: 'No DR', confidence: 0.93, status: 'complete', date: '2026-09-03', riskLevel: 'low' },
];

export const DOCTOR_CASES = [
  { id: 'dc-001', patientId: 'P-10291', patientName: 'Sunita Devi', age: 62, result: 'Moderate DR', confidence: 0.82, priority: 'HIGH', status: 'pending', date: '2026-09-05', village: 'Khandwa', diabetesDuration: 15, gender: 'Female' },
  { id: 'dc-002', patientId: 'P-10293', patientName: 'Arjun Singh', age: 68, result: 'Severe DR', confidence: 0.89, priority: 'HIGH', status: 'pending', date: '2026-09-05', village: 'Dewas', diabetesDuration: 22, gender: 'Male' },
  { id: 'dc-003', patientId: 'P-10286', patientName: 'Kavita Kumari', age: 58, result: 'Severe DR', confidence: 0.89, priority: 'HIGH', status: 'pending', date: '2026-09-04', village: 'Barwani', diabetesDuration: 18, gender: 'Female' },
  { id: 'dc-004', patientId: 'P-10285', patientName: 'Suresh Gupta', age: 53, result: 'Moderate DR', confidence: 0.78, priority: 'MEDIUM', status: 'pending', date: '2026-09-03', village: 'Ujjain', diabetesDuration: 10, gender: 'Male' },
  { id: 'dc-005', patientId: 'P-10288', patientName: 'Meera Joshi', age: 47, result: 'Mild DR', confidence: 0.76, priority: 'MEDIUM', status: 'pending', date: '2026-09-04', village: 'Indore', diabetesDuration: 6, gender: 'Female' },
  { id: 'dc-006', patientId: 'P-10280', patientName: 'Gopal Das', age: 71, result: 'Moderate DR', confidence: 0.81, priority: 'MEDIUM', status: 'reviewed', date: '2026-09-02', village: 'Sagar', diabetesDuration: 20, gender: 'Male' },
  { id: 'dc-007', patientId: 'P-10278', patientName: 'Lakshmi Bai', age: 65, result: 'Mild DR', confidence: 0.72, priority: 'LOW', status: 'reviewed', date: '2026-09-01', village: 'Ratlam', diabetesDuration: 12, gender: 'Female' },
];

export const ADMIN_STATS = {
  totalScreened: 2482,
  nodr: 1641,
  mild: 392,
  moderate: 298,
  severe: 117,
  proliferative: 34,
  referralRate: 18.1,
  villages: [
    { name: 'Khandwa', count: 312 },
    { name: 'Dewas', count: 287 },
    { name: 'Barwani', count: 245 },
    { name: 'Ujjain', count: 198 },
    { name: 'Indore', count: 176 },
    { name: 'Sagar', count: 154 },
    { name: 'Ratlam', count: 142 },
    { name: 'Bhopal', count: 138 },
  ],
  monthlyScreenings: [
    { month: 'Mar', count: 180 },
    { month: 'Apr', count: 245 },
    { month: 'May', count: 312 },
    { month: 'Jun', count: 358 },
    { month: 'Jul', count: 410 },
    { month: 'Aug', count: 489 },
    { month: 'Sep', count: 488 },
  ],
  highRiskCases: [
    { patientId: 'P-10293', name: 'Arjun Singh', village: 'Dewas', result: 'Severe DR', confidence: 0.89, date: '2026-09-05' },
    { patientId: 'P-10286', name: 'Kavita Kumari', village: 'Barwani', result: 'Severe DR', confidence: 0.89, date: '2026-09-04' },
    { patientId: 'P-10271', name: 'Bhagwan Das', village: 'Khandwa', result: 'Proliferative DR', confidence: 0.91, date: '2026-08-30' },
    { patientId: 'P-10265', name: 'Kamla Bai', village: 'Ujjain', result: 'Severe DR', confidence: 0.85, date: '2026-08-28' },
    { patientId: 'P-10258', name: 'Ratan Lal', village: 'Sagar', result: 'Severe DR', confidence: 0.87, date: '2026-08-25' },
  ]
};

export const DR_LABELS = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'];
export const DR_COLORS = ['#10B981', '#34D399', '#F59E0B', '#F97316', '#EF4444'];

export const RISK_MAP = {
  0: { level: 'low', label: 'LOW RISK', labelHi: 'कम जोखिम', color: '#10B981' },
  1: { level: 'low', label: 'LOW–MODERATE RISK', labelHi: 'कम–मध्यम जोखिम', color: '#34D399' },
  2: { level: 'moderate', label: 'MODERATE RISK', labelHi: 'मध्यम जोखिम', color: '#F59E0B' },
  3: { level: 'high', label: 'HIGH RISK', labelHi: 'उच्च जोखिम', color: '#EF4444' },
  4: { level: 'high', label: 'HIGH RISK', labelHi: 'उच्च जोखिम', color: '#EF4444' },
};

export function generatePatientId() {
  return 'P-' + (10290 + Math.floor(Math.random() * 100));
}
