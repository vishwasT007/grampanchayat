import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  Upload, 
  FileText, 
  IndianRupee,
  Calendar,
  User,
  CreditCard,
  Hash,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getRecordById, createRecord, updateRecord } from '../../services/financialService';

const FinancialForm = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'INCOME',
    category: 'TAX',
    subcategory: '',
    subcategoryMr: '',
    amount: '',
    description: '',
    descriptionMr: '',
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMode: 'CASH',
    referenceNumber: '',
    receivedFrom: '',
    receivedFromMr: '',
    paidTo: '',
    paidToMr: '',
    attachment: null,
    remarks: '',
    remarksMr: ''
  });

  const [errors, setErrors] = useState({});
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Income categories
  const incomeCategories = {
    TAX: {
      en: 'Tax',
      mr: 'कर',
      subcategories: [
        { en: 'Property Tax', mr: 'मालमत्ता कर' },
        { en: 'Water Tax', mr: 'पाणी कर' },
        { en: 'Trade License', mr: 'व्यापार परवाना' },
        { en: 'Building Permission', mr: 'इमारत परवानगी' }
      ]
    },
    GRANT: {
      en: 'Grant',
      mr: 'अनुदान',
      subcategories: [
        { en: 'Central Government Grant', mr: 'केंद्र शासन अनुदान' },
        { en: 'State Government Grant', mr: 'राज्य शासन अनुदान' },
        { en: 'District Grant', mr: 'जिल्हा अनुदान' },
        { en: 'Special Grant', mr: 'विशेष अनुदान' }
      ]
    },
    FEES: {
      en: 'Fees & Charges',
      mr: 'फी आणि शुल्क',
      subcategories: [
        { en: 'Birth/Death Certificate', mr: 'जन्म/मृत्यू प्रमाणपत्र' },
        { en: 'Other Certificates', mr: 'इतर प्रमाणपत्रे' },
        { en: 'Rent Income', mr: 'भाडे उत्पन्न' },
        { en: 'Advertisement Fees', mr: 'जाहिरात शुल्क' }
      ]
    },
    DONATION: {
      en: 'Donation',
      mr: 'देणगी',
      subcategories: [
        { en: 'CSR Donation', mr: 'CSR देणगी' },
        { en: 'Individual Donation', mr: 'वैयक्तिक देणगी' },
        { en: 'Organization Donation', mr: 'संस्था देणगी' }
      ]
    },
    OTHER: {
      en: 'Other Income',
      mr: 'इतर उत्पन्न',
      subcategories: [
        { en: 'Miscellaneous', mr: 'विविध' }
      ]
    }
  };

  // Expense categories
  const expenseCategories = {
    SALARY: {
      en: 'Salary & Wages',
      mr: 'वेतन आणि मजुरी',
      subcategories: [
        { en: 'Staff Salaries', mr: 'कर्मचारी वेतन' },
        { en: 'Daily Wages', mr: 'दैनंदिन मजुरी' },
        { en: 'Honorarium', mr: 'मानधन' },
        { en: 'Allowances', mr: 'भत्ते' }
      ]
    },
    INFRASTRUCTURE: {
      en: 'Infrastructure',
      mr: 'पायाभूत सुविधा',
      subcategories: [
        { en: 'Road Construction', mr: 'रस्ता बांधकाम' },
        { en: 'Road Repair', mr: 'रस्ता दुरुस्ती' },
        { en: 'Drainage Work', mr: 'गटार काम' },
        { en: 'Street Lights', mr: 'रस्ता दिवे' },
        { en: 'Water Supply', mr: 'पाणी पुरवठा' },
        { en: 'Building Maintenance', mr: 'इमारत देखभाल' }
      ]
    },
    UTILITIES: {
      en: 'Utilities',
      mr: 'उपयुक्तता',
      subcategories: [
        { en: 'Electricity Bill', mr: 'वीज बिल' },
        { en: 'Water Bill', mr: 'पाणी बिल' },
        { en: 'Telephone/Internet', mr: 'दूरध्वनी/इंटरनेट' },
        { en: 'Fuel', mr: 'इंधन' }
      ]
    },
    SUPPLIES: {
      en: 'Supplies & Materials',
      mr: 'पुरवठा आणि साहित्य',
      subcategories: [
        { en: 'Stationery', mr: 'लेखन साहित्य' },
        { en: 'Office Supplies', mr: 'कार्यालय पुरवठा' },
        { en: 'Cleaning Materials', mr: 'स्वच्छता साहित्य' },
        { en: 'Equipment', mr: 'उपकरणे' }
      ]
    },
    PROGRAMS: {
      en: 'Programs & Schemes',
      mr: 'कार्यक्रम आणि योजना',
      subcategories: [
        { en: 'Health Programs', mr: 'आरोग्य कार्यक्रम' },
        { en: 'Education Programs', mr: 'शिक्षण कार्यक्रम' },
        { en: 'Social Welfare', mr: 'समाज कल्याण' },
        { en: 'Agriculture Programs', mr: 'शेती कार्यक्रम' }
      ]
    },
    ADMINISTRATIVE: {
      en: 'Administrative',
      mr: 'प्रशासकीय',
      subcategories: [
        { en: 'Legal Fees', mr: 'कायदेशीर शुल्क' },
        { en: 'Audit Fees', mr: 'ऑडिट शुल्क' },
        { en: 'Insurance', mr: 'विमा' },
        { en: 'Bank Charges', mr: 'बँक शुल्क' },
        { en: 'Travel Expenses', mr: 'प्रवास खर्च' }
      ]
    },
    OTHER: {
      en: 'Other Expenses',
      mr: 'इतर खर्च',
      subcategories: [
        { en: 'Miscellaneous', mr: 'विविध' }
      ]
    }
  };

  const paymentModes = [
    { value: 'CASH', en: 'Cash', mr: 'रोख' },
    { value: 'CHEQUE', en: 'Cheque', mr: 'धनादेश' },
    { value: 'ONLINE', en: 'Online Payment', mr: 'ऑनलाइन पेमेंट' },
    { value: 'NEFT', en: 'NEFT', mr: 'NEFT' },
    { value: 'RTGS', en: 'RTGS', mr: 'RTGS' },
    { value: 'IMPS', en: 'IMPS', mr: 'IMPS' },
    { value: 'UPI', en: 'UPI', mr: 'UPI' },
    { value: 'BANK_TRANSFER', en: 'Bank Transfer', mr: 'बँक हस्तांतरण' },
    { value: 'DD', en: 'Demand Draft', mr: 'मागणी धनादेश' }
  ];

  useEffect(() => {
    const loadTransaction = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const transaction = await getRecordById(id);
          if (transaction) {
            // Convert ISO date to YYYY-MM-DD format for input
            const transactionDate = transaction.transactionDate 
              ? new Date(transaction.transactionDate).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];
            
            setFormData({
              ...transaction,
              transactionDate
            });
            if (transaction.attachment) {
              setAttachmentPreview(transaction.attachment);
            }
          } else {
            alert('Transaction not found');
            navigate('/admin/financials');
          }
        } catch (error) {
          console.error('Error loading transaction:', error);
          alert('Failed to load transaction');
        } finally {
          setLoading(false);
        }
      }
    };
    loadTransaction();
  }, [id, isEditMode, navigate]);

  const getCurrentCategories = () => {
    return formData.type === 'INCOME' ? incomeCategories : expenseCategories;
  };

  const getSubcategories = () => {
    const categories = getCurrentCategories();
    return categories[formData.category]?.subcategories || [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'INCOME' ? 'TAX' : 'SALARY',
      subcategory: '',
      subcategoryMr: '',
      receivedFrom: '',
      receivedFromMr: '',
      paidTo: '',
      paidToMr: ''
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: '',
      subcategoryMr: ''
    }));
  };

  const handleSubcategoryChange = (e) => {
    const index = e.target.value;
    if (index !== '') {
      const subcategories = getSubcategories();
      const selected = subcategories[parseInt(index)];
      setFormData(prev => ({
        ...prev,
        subcategory: selected.en,
        subcategoryMr: selected.mr
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subcategory: '',
        subcategoryMr: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          attachment: language === 'en' 
            ? 'File size should not exceed 5MB' 
            : 'फाइलचा आकार 5MB पेक्षा जास्त नसावा'
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          attachment: language === 'en' 
            ? 'Only PDF and image files are allowed' 
            : 'फक्त PDF आणि प्रतिमा फाइल्स परवानगी आहे'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, attachment: file }));
      setAttachmentPreview(file.name);
      setErrors(prev => ({ ...prev, attachment: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subcategory) {
      newErrors.subcategory = language === 'en' ? 'Subcategory is required' : 'उपश्रेणी आवश्यक आहे';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = language === 'en' ? 'Valid amount is required' : 'वैध रक्कम आवश्यक आहे';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'en' ? 'Description is required' : 'वर्णन आवश्यक आहे';
    }

    if (!formData.descriptionMr.trim()) {
      newErrors.descriptionMr = language === 'en' ? 'Marathi description is required' : 'मराठी वर्णन आवश्यक आहे';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = language === 'en' ? 'Transaction date is required' : 'व्यवहार तारीख आवश्यक आहे';
    }

    if (!formData.referenceNumber.trim()) {
      newErrors.referenceNumber = language === 'en' ? 'Reference number is required' : 'संदर्भ क्रमांक आवश्यक आहे';
    }

    if (formData.type === 'INCOME') {
      if (!formData.receivedFrom.trim()) {
        newErrors.receivedFrom = language === 'en' ? 'Received from is required' : 'यांच्याकडून प्राप्त आवश्यक आहे';
      }
      if (!formData.receivedFromMr.trim()) {
        newErrors.receivedFromMr = language === 'en' ? 'Marathi received from is required' : 'मराठी प्राप्त आवश्यक आहे';
      }
    } else {
      if (!formData.paidTo.trim()) {
        newErrors.paidTo = language === 'en' ? 'Paid to is required' : 'यांना भरलेले आवश्यक आहे';
      }
      if (!formData.paidToMr.trim()) {
        newErrors.paidToMr = language === 'en' ? 'Marathi paid to is required' : 'मराठी भरलेले आवश्यक आहे';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        if (isEditMode) {
          // Update existing transaction
          await updateRecord(id, formData);
          alert(
            language === 'en' 
              ? 'Transaction updated successfully!' 
              : 'व्यवहार यशस्वीरित्या अपडेट झाला!'
          );
        } else {
          // Add new transaction
          await createRecord(formData);
          alert(
            language === 'en' 
              ? 'Transaction added successfully!' 
              : 'व्यवहार यशस्वीरित्या जोडला!'
          );
        }
        
        navigate('/admin/financials');
      } catch (error) {
        console.error('Error saving transaction:', error);
        alert(
          language === 'en'
            ? `Failed to ${isEditMode ? 'update' : 'add'} transaction: ${error.message}`
            : `व्यवहार ${isEditMode ? 'अपडेट' : 'जोडण्यात'} अयशस्वी: ${error.message}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode 
            ? (language === 'en' ? 'Edit Transaction' : 'व्यवहार संपादित करा')
            : (language === 'en' ? 'Add New Transaction' : 'नवीन व्यवहार जोडा')}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'en' 
            ? 'Enter financial transaction details' 
            : 'आर्थिक व्यवहार तपशील प्रविष्ट करा'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-[#ff6b00]" />
            {language === 'en' ? 'Transaction Type' : 'व्यवहार प्रकार'}
          </h2>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange('INCOME')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                formData.type === 'INCOME'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-green-300'
              }`}
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold">
                {language === 'en' ? 'Income' : 'उत्पन्न'}
              </div>
              <div className="text-sm">
                {language === 'en' ? 'Money Received' : 'पैसे प्राप्त'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('EXPENSE')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                formData.type === 'EXPENSE'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-red-300'
              }`}
            >
              <div className="text-2xl mb-2">📉</div>
              <div className="font-semibold">
                {language === 'en' ? 'Expense' : 'खर्च'}
              </div>
              <div className="text-sm">
                {language === 'en' ? 'Money Paid' : 'पैसे दिले'}
              </div>
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-[#ff6b00]" />
            {language === 'en' ? 'Transaction Details' : 'व्यवहार तपशील'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Category' : 'श्रेणी'} <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              >
                {Object.entries(getCurrentCategories()).map(([key, value]) => (
                  <option key={key} value={key}>
                    {language === 'en' ? value.en : value.mr}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Subcategory' : 'उपश्रेणी'} <span className="text-red-500">*</span>
              </label>
              <select
                onChange={handleSubcategoryChange}
                value={getSubcategories().findIndex(s => s.en === formData.subcategory)}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {language === 'en' ? 'Select subcategory' : 'उपश्रेणी निवडा'}
                </option>
                {getSubcategories().map((sub, index) => (
                  <option key={index} value={index}>
                    {language === 'en' ? sub.en : sub.mr}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.subcategory}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Amount (₹)' : 'रक्कम (₹)'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {formData.amount && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(formData.amount)}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.amount}
                </p>
              )}
            </div>

            {/* Transaction Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Transaction Date' : 'व्यवहार तारीख'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                    errors.transactionDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.transactionDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.transactionDate}
                </p>
              )}
            </div>

            {/* Description (English) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Description (English)' : 'वर्णन (इंग्रजी)'} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter transaction description in English..."
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>

            {/* Description (Marathi) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Description (Marathi)' : 'वर्णन (मराठी)'} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descriptionMr"
                value={formData.descriptionMr}
                onChange={handleChange}
                rows="3"
                placeholder="व्यवहाराचे वर्णन मराठीत प्रविष्ट करा..."
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.descriptionMr ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descriptionMr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.descriptionMr}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-[#ff6b00]" />
            {language === 'en' ? 'Payment Information' : 'पेमेंट माहिती'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Payment Mode' : 'पेमेंट पद्धत'} <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              >
                {paymentModes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {language === 'en' ? mode.en : mode.mr}
                  </option>
                ))}
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Reference Number' : 'संदर्भ क्रमांक'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="REF/2025/001"
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                    errors.referenceNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.referenceNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.referenceNumber}
                </p>
              )}
            </div>

            {/* Received From / Paid To (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'INCOME'
                  ? (language === 'en' ? 'Received From (English)' : 'यांच्याकडून प्राप्त (इंग्रजी)')
                  : (language === 'en' ? 'Paid To (English)' : 'यांना भरलेले (इंग्रजी)')}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name={formData.type === 'INCOME' ? 'receivedFrom' : 'paidTo'}
                  value={formData.type === 'INCOME' ? formData.receivedFrom : formData.paidTo}
                  onChange={handleChange}
                  placeholder={formData.type === 'INCOME' ? 'Name of payer...' : 'Name of payee...'}
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                    (formData.type === 'INCOME' ? errors.receivedFrom : errors.paidTo) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {(formData.type === 'INCOME' ? errors.receivedFrom : errors.paidTo) && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {formData.type === 'INCOME' ? errors.receivedFrom : errors.paidTo}
                </p>
              )}
            </div>

            {/* Received From / Paid To (Marathi) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'INCOME'
                  ? (language === 'en' ? 'Received From (Marathi)' : 'यांच्याकडून प्राप्त (मराठी)')
                  : (language === 'en' ? 'Paid To (Marathi)' : 'यांना भरलेले (मराठी)')}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name={formData.type === 'INCOME' ? 'receivedFromMr' : 'paidToMr'}
                  value={formData.type === 'INCOME' ? formData.receivedFromMr : formData.paidToMr}
                  onChange={handleChange}
                  placeholder={formData.type === 'INCOME' ? 'देणाऱ्याचे नाव...' : 'घेणाऱ्याचे नाव...'}
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                    (formData.type === 'INCOME' ? errors.receivedFromMr : errors.paidToMr) ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {(formData.type === 'INCOME' ? errors.receivedFromMr : errors.paidToMr) && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {formData.type === 'INCOME' ? errors.receivedFromMr : errors.paidToMr}
                </p>
              )}
            </div>

            {/* Attachment */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Attachment (Invoice, Receipt, etc.)' : 'संलग्नक (चलन, पावती, इ.)'}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg hover:border-[#ff6b00] transition-colors ${
                    errors.attachment ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-gray-600">
                      {attachmentPreview || (language === 'en' ? 'Choose file...' : 'फाइल निवडा...')}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {attachmentPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, attachment: null }));
                      setAttachmentPreview(null);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'en' 
                  ? 'PDF or Image files only. Max size: 5MB' 
                  : 'फक्त PDF किंवा प्रतिमा फाइल्स. कमाल आकार: 5MB'}
              </p>
              {errors.attachment && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.attachment}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Additional Notes (Optional)' : 'अतिरिक्त टिप्पण्या (ऐच्छिक)'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Remarks (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Remarks (English)' : 'टिप्पणी (इंग्रजी)'}
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional notes..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            {/* Remarks (Marathi) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Remarks (Marathi)' : 'टिप्पणी (मराठी)'}
              </label>
              <textarea
                name="remarksMr"
                value={formData.remarksMr}
                onChange={handleChange}
                rows="3"
                placeholder="कोणत्याही अतिरिक्त टिप्पण्या..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/financials')}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <X size={20} />
            {language === 'en' ? 'Cancel' : 'रद्द करा'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-[#138808] to-[#1aa910] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Save size={20} />
            {loading 
              ? (language === 'en' ? 'Saving...' : 'जतन करत आहे...')
              : isEditMode 
                ? (language === 'en' ? 'Update Transaction' : 'व्यवहार अपडेट करा')
                : (language === 'en' ? 'Save Transaction' : 'व्यवहार जतन करा')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialForm;
