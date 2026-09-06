// NetraAI — Internationalization
const translations = {
  en: {
    // App
    appName: 'NetraAI',
    tagline: 'See the risk. Understand the reason. Take action.',
    appDescription: 'AI-assisted diabetic retinopathy screening for rural healthcare.',

    // Login
    login: 'Sign In',
    loginTitle: 'Welcome back',
    loginSubtitle: 'Sign in to your screening account',
    employeeId: 'Mobile / Employee ID',
    password: 'Password',
    demoCredentials: 'Demo Credentials',
    healthWorker: 'Health Worker',
    doctor: 'Doctor',
    admin: 'Admin',

    // Navigation
    dashboard: 'Dashboard',
    newScreening: 'New Screening',
    patients: 'Patients',
    screenings: 'Screenings',
    reports: 'Reports',
    settings: 'Settings',
    doctorDashboard: 'Doctor Dashboard',
    caseReview: 'Case Review',
    pendingReviews: 'Pending Reviews',
    analytics: 'Analytics',
    logout: 'Logout',

    // Dashboard
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    todaysScreening: "Today's Screening",
    patientsScreened: 'Patients Screened',
    noDR: 'No DR',
    needsReview: 'Needs Review',
    highRisk: 'High Risk',
    recentScreenings: 'Recent Screenings',
    patient: 'Patient',
    result: 'Result',
    status: 'Status',
    date: 'Date',

    // Patient Registration
    newPatient: 'New Patient',
    patientId: 'Patient ID',
    patientName: 'Name',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    mobileNumber: 'Mobile Number',
    village: 'Location / Village',
    diabetesDuration: 'Diabetes Duration (years)',
    existingEyeProblems: 'Existing Eye Problems',
    previousScreening: 'Previous Screening',
    yes: 'Yes',
    no: 'No',
    none: 'None',
    continueToScreening: 'Continue to Retinal Screening',

    // Image Capture
    retinalImage: 'Retinal Image',
    captureImage: 'Capture Image',
    uploadImage: 'Upload Image',
    dragDropImage: 'Drag & drop a retinal image or click to browse',
    supportedFormats: 'Supported formats: JPG, PNG (max 10MB)',
    imageTips: 'For best results:',
    tip1: 'Ensure the retina is clearly visible',
    tip2: 'Avoid excessive blur',
    tip3: 'Avoid strong reflections',
    tip4: 'Keep the eye centered',
    step: 'Step',
    of: 'of',

    // Image Quality
    imageQuality: 'Image Quality',
    sharpness: 'Sharpness',
    brightness: 'Brightness',
    retinalArea: 'Retinal Area',
    visibility: 'Visibility',
    good: 'Good',
    poor: 'Poor',
    overallQuality: 'Overall Quality',
    qualityGood: 'Image quality is sufficient for AI analysis.',
    qualityPoor: 'Image quality is too low for reliable screening. Please capture another image.',
    retakeImage: 'Retake Image',
    proceedToAnalysis: 'Proceed to AI Analysis',

    // AI Analysis
    analyzingImage: 'Analyzing retinal image...',
    preprocessing: 'Preprocessing',
    qualityAssessment: 'Quality Assessment',
    aiAnalysis: 'AI Analysis',
    generatingExplanation: 'Generating Explanation',

    // Results
    aiScreeningResult: 'AI Screening Result',
    confidence: 'Confidence',
    noDRFull: 'No DR',
    mildDR: 'Mild DR',
    moderateDR: 'Moderate DR',
    severeDR: 'Severe DR',
    proliferativeDR: 'Proliferative DR',

    // Explainability
    aiExplanation: 'AI Explanation',
    whyThisResult: 'Why this result?',
    originalImage: 'Original',
    gradCamHeatmap: 'AI Attention',
    overlay: 'Overlay',
    explainTitle: 'Why did the AI flag this image?',
    explainText: 'The highlighted regions are the areas that contributed most strongly to the model\'s prediction. Warmer colors (red/yellow) indicate higher model attention.',
    explainDisclaimer: 'This visualization explains model attention and is not a clinical diagnosis of an individual lesion.',

    // Risk & Referral
    riskLevel: 'Risk Level',
    lowRisk: 'LOW RISK',
    lowModerateRisk: 'LOW–MODERATE RISK',
    moderateRisk: 'MODERATE RISK',
    highRiskLabel: 'HIGH RISK',
    referralRecommendation: 'Referral Recommendation',
    noRiskText: 'No significant DR detected by the screening model. Follow normal clinical follow-up protocols.',
    mildRiskText: 'Mild abnormalities detected. Consider ophthalmic evaluation according to clinical protocol.',
    moderateRiskText: 'AI screening indicates potential diabetic retinopathy. Specialist evaluation recommended.',
    severeRiskText: 'Significant abnormalities detected. Priority specialist evaluation recommended.',

    // Reports
    screeningReport: 'AI-Assisted Retinal Screening Report',
    patientInformation: 'Patient Information',
    screeningResult: 'Screening Result',
    modelConfidence: 'Model Confidence',
    downloadPdf: 'Download PDF',
    generateReport: 'Generate Report',
    viewExplanation: 'View Explanation',
    importantNotice: 'Important Notice',
    disclaimerText: 'This AI-assisted screening result is not a final medical diagnosis. Final clinical assessment must be performed by a qualified healthcare professional.',
    screeningCentre: 'Screening Centre',

    // Doctor
    doctorPortal: 'Doctor Portal',
    casePriority: 'Priority',
    caseStatus: 'Status',
    addNotes: 'Add Clinical Notes',
    confirmReview: 'Confirm Review',
    requestNewImage: 'Request New Image',
    clinicalReviewStatus: 'Clinical Review Status',
    reviewed: 'Reviewed',
    pending: 'Pending',
    patientHistory: 'Patient History',
    doctorNotes: 'Doctor Notes',

    // Admin
    screeningAnalytics: 'Screening Analytics',
    totalScreened: 'Total Screened',
    drDistribution: 'DR Severity Distribution',
    screeningsOverTime: 'Screenings Over Time',
    referralRate: 'Referral Rate',
    villageScreening: 'Village-wise Screening',
    highRiskCases: 'High Risk Cases',

    // Offline
    online: 'Online',
    offline: 'Offline',
    offlineMessage: 'Your screening data is being stored securely on this device.',
    recordsPending: 'records waiting to sync',
    syncing: 'Syncing...',
    syncComplete: 'records synchronized',
    dataSyncAuto: 'Data will sync automatically when connection is restored.',

    // Errors
    invalidFormat: "This file format isn't supported. Please upload JPG or PNG.",
    poorImage: 'Image quality insufficient. Please capture another image.',
    aiUnavailable: 'AI analysis temporarily unavailable. Your image has been securely saved and can be analyzed when the service is available.',
    networkUnavailable: "You're offline. Your screening will be saved locally and synchronized later.",

    // Demo
    demoMode: 'Demo Mode',
    demoCase: 'Demo Case',

    // Medical Safety
    screeningDisclaimer: 'This system is intended for screening and clinical decision support. It does not replace examination or diagnosis by a qualified healthcare professional.',
    privacyNotice: 'Patient data should only be collected and processed with appropriate authorization and according to applicable healthcare/privacy requirements.',

    // Actions
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    complete: 'Complete',
    referral: 'Referral',
    review: 'Review',
  },

  hi: {
    // App
    appName: 'नेत्रAI',
    tagline: 'जोखिम देखें। कारण समझें। कार्रवाई करें।',
    appDescription: 'ग्रामीण स्वास्थ्य सेवा के लिए AI-सहायता प्राप्त डायबिटिक रेटिनोपैथी जांच।',

    // Login
    login: 'साइन इन',
    loginTitle: 'वापसी पर स्वागत है',
    loginSubtitle: 'अपने स्क्रीनिंग खाते में साइन इन करें',
    employeeId: 'मोबाइल / कर्मचारी ID',
    password: 'पासवर्ड',
    demoCredentials: 'डेमो क्रेडेंशियल',
    healthWorker: 'स्वास्थ्य कार्यकर्ता',
    doctor: 'डॉक्टर',
    admin: 'व्यवस्थापक',

    // Navigation
    dashboard: 'डैशबोर्ड',
    newScreening: 'नई जांच',
    patients: 'मरीज़',
    screenings: 'जांच',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    doctorDashboard: 'डॉक्टर डैशबोर्ड',
    caseReview: 'केस समीक्षा',
    pendingReviews: 'लंबित समीक्षा',
    analytics: 'विश्लेषिकी',
    logout: 'लॉगआउट',

    // Dashboard
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
    todaysScreening: 'आज की जांच',
    patientsScreened: 'जांचे गए मरीज़',
    noDR: 'कोई DR नहीं',
    needsReview: 'समीक्षा आवश्यक',
    highRisk: 'उच्च जोखिम',
    recentScreenings: 'हालिया जांच',
    patient: 'मरीज़',
    result: 'परिणाम',
    status: 'स्थिति',
    date: 'तारीख',

    // Patient Registration
    newPatient: 'नया मरीज़',
    patientId: 'मरीज़ ID',
    patientName: 'नाम',
    age: 'आयु',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    mobileNumber: 'मोबाइल नंबर',
    village: 'स्थान / गांव',
    diabetesDuration: 'मधुमेह अवधि (वर्ष)',
    existingEyeProblems: 'मौजूदा नेत्र समस्याएं',
    previousScreening: 'पिछली जांच',
    yes: 'हां',
    no: 'नहीं',
    none: 'कोई नहीं',
    continueToScreening: 'रेटिनल जांच जारी रखें',

    // Image Capture
    retinalImage: 'रेटिनल छवि',
    captureImage: 'छवि कैप्चर करें',
    uploadImage: 'छवि अपलोड करें',
    dragDropImage: 'रेटिनल छवि यहां खींचें या ब्राउज़ करने के लिए क्लिक करें',
    supportedFormats: 'समर्थित प्रारूप: JPG, PNG (अधिकतम 10MB)',
    imageTips: 'सर्वोत्तम परिणामों के लिए:',
    tip1: 'सुनिश्चित करें कि रेटिना स्पष्ट रूप से दिखाई दे',
    tip2: 'अधिक धुंधलेपन से बचें',
    tip3: 'तेज़ प्रतिबिंबों से बचें',
    tip4: 'आंख को केंद्र में रखें',
    step: 'चरण',
    of: 'का',

    // Image Quality
    imageQuality: 'छवि गुणवत्ता',
    sharpness: 'स्पष्टता',
    brightness: 'चमक',
    retinalArea: 'रेटिनल क्षेत्र',
    visibility: 'दृश्यता',
    good: 'अच्छी',
    poor: 'खराब',
    overallQuality: 'समग्र गुणवत्ता',
    qualityGood: 'छवि गुणवत्ता AI विश्लेषण के लिए पर्याप्त है।',
    qualityPoor: 'विश्वसनीय जांच के लिए छवि गुणवत्ता बहुत कम है। कृपया दूसरी छवि कैप्चर करें।',
    retakeImage: 'दोबारा छवि लें',
    proceedToAnalysis: 'AI विश्लेषण के लिए आगे बढ़ें',

    // AI Analysis
    analyzingImage: 'रेटिनल छवि का विश्लेषण हो रहा है...',
    preprocessing: 'प्रीप्रोसेसिंग',
    qualityAssessment: 'गुणवत्ता मूल्यांकन',
    aiAnalysis: 'AI विश्लेषण',
    generatingExplanation: 'स्पष्टीकरण तैयार हो रहा है',

    // Results
    aiScreeningResult: 'AI जांच परिणाम',
    confidence: 'विश्वसनीयता',
    noDRFull: 'कोई DR नहीं',
    mildDR: 'हल्का DR',
    moderateDR: 'मध्यम DR',
    severeDR: 'गंभीर DR',
    proliferativeDR: 'प्रोलिफेरेटिव DR',

    // Explainability
    aiExplanation: 'AI स्पष्टीकरण',
    whyThisResult: 'यह परिणाम क्यों?',
    originalImage: 'मूल छवि',
    gradCamHeatmap: 'AI ध्यान',
    overlay: 'ओवरले',
    explainTitle: 'AI ने इस छवि को क्यों चिह्नित किया?',
    explainText: 'हाइलाइट किए गए क्षेत्र वे हैं जिन्होंने मॉडल की भविष्यवाणी में सबसे अधिक योगदान दिया। गर्म रंग (लाल/पीला) उच्च मॉडल ध्यान को दर्शाते हैं।',
    explainDisclaimer: 'यह विज़ुअलाइज़ेशन मॉडल के ध्यान को दर्शाता है और किसी व्यक्तिगत घाव का नैदानिक निदान नहीं है।',

    // Risk & Referral
    riskLevel: 'जोखिम स्तर',
    lowRisk: 'कम जोखिम',
    lowModerateRisk: 'कम–मध्यम जोखिम',
    moderateRisk: 'मध्यम जोखिम',
    highRiskLabel: 'उच्च जोखिम',
    referralRecommendation: 'रेफरल अनुशंसा',
    noRiskText: 'स्क्रीनिंग मॉडल द्वारा कोई महत्वपूर्ण DR नहीं पाया गया। सामान्य नैदानिक अनुवर्ती प्रोटोकॉल का पालन करें।',
    mildRiskText: 'हल्की असामान्यताएं पाई गईं। नैदानिक प्रोटोकॉल के अनुसार नेत्र मूल्यांकन पर विचार करें।',
    moderateRiskText: 'AI जांच संभावित डायबिटिक रेटिनोपैथी का संकेत देती है। नेत्र विशेषज्ञ से जांच कराने की सलाह दी जाती है।',
    severeRiskText: 'महत्वपूर्ण असामान्यताएं पाई गईं। प्राथमिकता नेत्र विशेषज्ञ मूल्यांकन की सिफारिश की जाती है।',

    // Reports
    screeningReport: 'AI-सहायता प्राप्त रेटिनल जांच रिपोर्ट',
    patientInformation: 'मरीज़ की जानकारी',
    screeningResult: 'जांच परिणाम',
    modelConfidence: 'मॉडल विश्वसनीयता',
    downloadPdf: 'PDF डाउनलोड करें',
    generateReport: 'रिपोर्ट बनाएं',
    viewExplanation: 'स्पष्टीकरण देखें',
    importantNotice: 'महत्वपूर्ण सूचना',
    disclaimerText: 'यह AI-सहायता प्राप्त जांच परिणाम अंतिम चिकित्सा निदान नहीं है। अंतिम नैदानिक मूल्यांकन एक योग्य स्वास्थ्य पेशेवर द्वारा किया जाना चाहिए।',
    screeningCentre: 'जांच केंद्र',

    // Doctor
    doctorPortal: 'डॉक्टर पोर्टल',
    casePriority: 'प्राथमिकता',
    caseStatus: 'स्थिति',
    addNotes: 'नैदानिक नोट्स जोड़ें',
    confirmReview: 'समीक्षा की पुष्टि करें',
    requestNewImage: 'नई छवि का अनुरोध करें',
    clinicalReviewStatus: 'नैदानिक समीक्षा स्थिति',
    reviewed: 'समीक्षित',
    pending: 'लंबित',
    patientHistory: 'मरीज़ का इतिहास',
    doctorNotes: 'डॉक्टर नोट्स',

    // Admin
    screeningAnalytics: 'जांच विश्लेषिकी',
    totalScreened: 'कुल जांचे गए',
    drDistribution: 'DR गंभीरता वितरण',
    screeningsOverTime: 'समय के साथ जांच',
    referralRate: 'रेफरल दर',
    villageScreening: 'गांव-वार जांच',
    highRiskCases: 'उच्च जोखिम मामले',

    // Offline
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    offlineMessage: 'आपका जांच डेटा इस डिवाइस पर सुरक्षित रूप से संग्रहीत है।',
    recordsPending: 'रिकॉर्ड सिंक होने की प्रतीक्षा में',
    syncing: 'सिंक हो रहा है...',
    syncComplete: 'रिकॉर्ड सिंक्रोनाइज़ हो गए',
    dataSyncAuto: 'कनेक्शन बहाल होने पर डेटा स्वचालित रूप से सिंक हो जाएगा।',

    // Errors
    invalidFormat: 'इस फ़ाइल प्रारूप का समर्थन नहीं है। कृपया JPG या PNG अपलोड करें।',
    poorImage: 'छवि गुणवत्ता अपर्याप्त। कृपया दूसरी छवि कैप्चर करें।',
    aiUnavailable: 'AI विश्लेषण अस्थायी रूप से अनुपलब्ध है। आपकी छवि सुरक्षित रूप से सहेज ली गई है।',
    networkUnavailable: 'आप ऑफ़लाइन हैं। आपकी जांच स्थानीय रूप से सहेजी जाएगी और बाद में सिंक्रोनाइज़ की जाएगी।',

    // Demo
    demoMode: 'डेमो मोड',
    demoCase: 'डेमो केस',

    // Medical Safety
    screeningDisclaimer: 'यह प्रणाली जांच और नैदानिक निर्णय समर्थन के लिए है। यह योग्य स्वास्थ्य पेशेवर द्वारा जांच या निदान का विकल्प नहीं है।',
    privacyNotice: 'रोगी डेटा केवल उचित प्राधिकरण और लागू स्वास्थ्य/गोपनीयता आवश्यकताओं के अनुसार एकत्र और संसाधित किया जाना चाहिए।',

    // Actions
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    back: 'पीछे',
    next: 'अगला',
    submit: 'जमा करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    complete: 'पूर्ण',
    referral: 'रेफरल',
    review: 'समीक्षा',
  }
};

export default translations;
