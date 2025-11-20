// Mock data for development - replace with actual API calls later

export const mockSiteSettings = {
  panchayatName: {
    en: 'Gram Panchayat Shivpur',
    mr: 'ग्रामपंचायत शिवपूर',
  },
  tagline: {
    en: 'Working for Village Development',
    mr: 'गाव विकासासाठी कार्यरत',
  },
  logo: '/logo.png',
  contact: {
    phone: '+91 1234567890',
    email: 'grampanchayat@example.com',
    address: {
      en: 'Village Shivpur, Taluka Sample, District Example, Maharashtra - 411001',
      mr: 'गाव शिवपूर, तालुका सॅम्पल, जिल्हा उदाहरण, महाराष्ट्र - ४११००१',
    },
  },
  officeTimings: {
    en: 'Monday to Friday: 10:00 AM - 5:00 PM',
    mr: 'सोमवार ते शुक्रवार: सकाळी १० ते संध्याकाळी ५',
  },
  socialMedia: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },
};

export const mockMembers = [
  {
    id: 1,
    name: { en: 'Ramesh Kumar Patil', mr: 'रमेश कुमार पाटील' },
    designation: { en: 'Sarpanch', mr: 'सरपंच' },
    phone: '+91 9876543210',
    photoUrl: 'https://via.placeholder.com/150',
    type: 'SARPANCH',
    order: 1,
    termStart: '2020-01-01',
    termEnd: '2025-12-31',
  },
  {
    id: 2,
    name: { en: 'Sunita Deshmukh', mr: 'सुनिता देशमुख' },
    designation: { en: 'Upsarpanch', mr: 'उपसरपंच' },
    phone: '+91 9876543211',
    photoUrl: 'https://via.placeholder.com/150',
    type: 'UPSARPANCH',
    order: 2,
    termStart: '2020-01-01',
    termEnd: '2025-12-31',
  },
  {
    id: 3,
    name: { en: 'Prakash Jadhav', mr: 'प्रकाश जाधव' },
    designation: { en: 'Member', mr: 'सदस्य' },
    phone: '+91 9876543212',
    photoUrl: 'https://via.placeholder.com/150',
    type: 'MEMBER',
    order: 3,
    termStart: '2020-01-01',
    termEnd: '2025-12-31',
  },
];

export const mockStaff = [
  {
    id: 1,
    name: { en: 'Ashok Sharma', mr: 'अशोक शर्मा' },
    designation: { en: 'Gram Sevak', mr: 'ग्रामसेवक' },
    phone: '+91 9876543220',
    photoUrl: 'https://via.placeholder.com/150',
    type: 'STAFF',
    order: 1,
  },
];

export const mockServices = [
  {
    id: 1,
    name: { en: 'Birth Certificate', mr: 'जन्म दाखला' },
    category: 'Certificate',
    description: {
      en: 'Apply for birth certificate for newborn children',
      mr: 'नवजात मुलांसाठी जन्म प्रमाणपत्र मिळवा',
    },
    requiredDocuments: {
      en: '1. Hospital birth record\n2. Parents ID proof\n3. Address proof',
      mr: '१. रुग्णालयाचा जन्म रेकॉर्ड\n२. पालकांचा ओळखपत्र\n३. पत्त्याचा पुरावा',
    },
    fees: '₹50',
    processingTime: '7 days',
    howToApply: {
      en: '1. Fill application form\n2. Attach required documents\n3. Submit at Gram Panchayat office\n4. Collect certificate after 7 days',
      mr: '१. अर्ज भरा\n२. आवश्यक कागदपत्रे जोडा\n३. ग्रामपंचायत कार्यालयात जमा करा\n४. ७ दिवसांनंतर प्रमाणपत्र गोळा करा',
    },
  },
  {
    id: 2,
    name: { en: 'Property Tax Payment', mr: 'मालमत्ता कर भरणा' },
    category: 'Tax',
    description: {
      en: 'Pay property tax online or offline',
      mr: 'ऑनलाइन किंवा ऑफलाइन मालमत्ता कर भरा',
    },
    requiredDocuments: {
      en: '1. Property tax bill\n2. Property ownership document',
      mr: '१. मालमत्ता कर बिल\n२. मालमत्ता मालकी दस्तऐवज',
    },
    fees: 'As per property size',
    processingTime: 'Immediate',
    howToApply: {
      en: '1. Get tax bill from office\n2. Pay via UPI or cash\n3. Collect receipt',
      mr: '१. कार्यालयातून कर बिल घ्या\n२. UPI किंवा रोख भरा\n३. पावती गोळा करा',
    },
  },
];

export const mockSchemes = [
  {
    id: 1,
    name: { en: 'Pradhan Mantri Awas Yojana', mr: 'प्रधानमंत्री आवास योजना' },
    category: 'CENTRAL',
    description: {
      en: 'Housing scheme for economically weaker sections',
      mr: 'आर्थिकदृष्ट्या दुर्बल घटकांसाठी गृहनिर्माण योजना',
    },
    eligibility: {
      en: '1. Annual income below ₹3 lakh\n2. No pucca house in family\n3. Indian citizen',
      mr: '१. वार्षिक उत्पन्न ₹३ लाखांपेक्षा कमी\n२. कुटुंबात पक्के घर नाही\n३. भारतीय नागरिक',
    },
    documentsRequired: {
      en: '1. Income certificate\n2. Ration card\n3. Aadhaar card\n4. Bank account details',
      mr: '१. उत्पन्न प्रमाणपत्र\n२. शिधापत्रिका\n३. आधार कार्ड\n४. बँक खाते तपशील',
    },
    applicationProcess: {
      en: 'Apply online at pmayg.nic.in or visit Gram Panchayat office',
      mr: 'pmayg.nic.in वर ऑनलाइन अर्ज करा किंवा ग्रामपंचायत कार्यालयाला भेट द्या',
    },
    status: 'ACTIVE',
  },
];

export const mockNotices = [
  {
    id: 1,
    title: {
      en: 'Gram Sabha Meeting - 25th December 2025',
      mr: 'ग्रामसभा बैठक - २५ डिसेंबर २०२५',
    },
    type: 'MEETING',
    description: {
      en: 'All villagers are requested to attend the Gram Sabha meeting to discuss village development plans.',
      mr: 'गाव विकास योजनांवर चर्चा करण्यासाठी सर्व गावकऱ्यांना ग्रामसभा बैठकीत उपस्थित राहण्याची विनंती आहे.',
    },
    startDate: '2025-11-20',
    endDate: '2025-12-25',
    status: 'ACTIVE',
    showOnHome: true,
  },
  {
    id: 2,
    title: {
      en: 'Water Supply Tender',
      mr: 'पाणीपुरवठा निविदा',
    },
    type: 'TENDER',
    description: {
      en: 'Tender for village water supply pipeline work. Last date to submit: 30th November 2025',
      mr: 'गाव पाणीपुरवठा पाइपलाइन कामासाठी निविदा. सबमिट करण्याची शेवटची तारीख: ३० नोव्हेंबर २०२५',
    },
    startDate: '2025-11-15',
    endDate: '2025-11-30',
    status: 'ACTIVE',
    showOnHome: true,
  },
];

export const mockPrograms = [
  {
    id: 1,
    title: { en: 'Swachh Bharat Abhiyan', mr: 'स्वच्छ भारत अभियान' },
    date: '2025-10-02',
    photoUrl: 'https://via.placeholder.com/400x300',
    description: {
      en: 'Cleanliness drive organized in the village',
      mr: 'गावात स्वच्छता मोहीम आयोजित',
    },
    showOnHome: true,
  },
];

export const mockForms = [
  {
    id: 1,
    title: { en: 'Birth Certificate Application Form', mr: 'जन्म प्रमाणपत्र अर्ज फॉर्म' },
    description: {
      en: 'Form to apply for birth certificate',
      mr: 'जन्म प्रमाणपत्रासाठी अर्ज करण्याचे फॉर्म',
    },
    category: 'Certificate',
    fileUrl: '/forms/birth-certificate.pdf',
    language: 'BOTH',
  },
  {
    id: 2,
    title: { en: 'Property Tax Form', mr: 'मालमत्ता कर फॉर्म' },
    description: {
      en: 'Form for property tax payment',
      mr: 'मालमत्ता कर भरण्यासाठी फॉर्म',
    },
    category: 'Tax',
    fileUrl: '/forms/property-tax.pdf',
    language: 'BOTH',
  },
];
