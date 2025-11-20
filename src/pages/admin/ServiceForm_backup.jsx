import { useState, useEffect } from 'react';
impo  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };eNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockServices } from '../../data/mockData';

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: { en: '', mr: '' },
    category: 'Certificate',
    description: { en: '', mr: '' },
    requiredDocuments: { en: '', mr: '' },
    fees: '',
    processingTime: '',
    howToApply: { en: '', mr: '' }
  });

  const [errors, setErrors] = useState({});

  const categories = ['Certificate', 'Tax', 'License', 'Registration', 'Other'];

  useEffect(() => {
    if (isEdit && id) {
      const service = mockServices.find(s => s.id === parseInt(id));
      if (service) {
        setFormData({
          name: service.name,
          category: service.category,
          description: service.description,
          requiredDocuments: service.requiredDocuments,
          fees: service.fees,
          processingTime: service.processingTime,
          howToApply: service.howToApply
        });
      }
    }
  }, [isEdit, id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name_en.trim()) newErrors.name_en = 'English name is required';
    if (!formData.name_mr.trim()) newErrors.name_mr = 'Marathi name is required';
    if (!formData.description_en.trim()) newErrors.description_en = 'English description is required';
    if (!formData.description_mr.trim()) newErrors.description_mr = 'Marathi description is required';
    if (!formData.requiredDocuments_en.trim()) newErrors.requiredDocuments_en = 'Required documents (English) is required';
    if (!formData.requiredDocuments_mr.trim()) newErrors.requiredDocuments_mr = 'Required documents (Marathi) is required';
    if (!formData.fees.trim()) newErrors.fees = 'Fees is required';
    if (!formData.processingTime.trim()) newErrors.processingTime = 'Processing time is required';
    if (!formData.howToApply_en.trim()) newErrors.howToApply_en = 'How to apply (English) is required';
    if (!formData.howToApply_mr.trim()) newErrors.howToApply_mr = 'How to apply (Marathi) is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serviceData = {
      name: {
        en: formData.name_en,
        mr: formData.name_mr
      },
      category: formData.category,
      description: {
        en: formData.description_en,
        mr: formData.description_mr
      },
      requiredDocuments: {
        en: formData.requiredDocuments_en,
        mr: formData.requiredDocuments_mr
      },
      fees: formData.fees,
      processingTime: formData.processingTime,
      howToApply: {
        en: formData.howToApply_en,
        mr: formData.howToApply_mr
      }
    };

    if (isEdit) {
      console.log('Updating service:', id, serviceData);
      // TODO: Update in localStorage or API
    } else {
      console.log('Creating new service:', serviceData);
      // TODO: Save to localStorage or API
    }

    navigate('/admin/services');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/services')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? 'Edit Service' : 'Add New Service'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update service information' : 'Fill in the details to add a new service'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div>
              <label htmlFor="name_en" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_en"
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.name_en ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="e.g., Birth Certificate"
              />
              {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
            </div>

            <div>
              <label htmlFor="name_mr" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name (Marathi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_mr"
                name="name_mr"
                value={formData.name_mr}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.name_mr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="उदा. जन्म दाखला"
              />
              {errors.name_mr && <p className="text-red-500 text-sm mt-1">{errors.name_mr}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Fees */}
            <div>
              <label htmlFor="fees" className="block text-sm font-semibold text-gray-700 mb-2">
                Fees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.fees ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="e.g., ₹50 or Free"
              />
              {errors.fees && <p className="text-red-500 text-sm mt-1">{errors.fees}</p>}
            </div>

            {/* Processing Time */}
            <div className="md:col-span-2">
              <label htmlFor="processingTime" className="block text-sm font-semibold text-gray-700 mb-2">
                Processing Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="processingTime"
                name="processingTime"
                value={formData.processingTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.processingTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="e.g., 7 days, Immediate"
              />
              {errors.processingTime && <p className="text-red-500 text-sm mt-1">{errors.processingTime}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="description_en" className="block text-sm font-semibold text-gray-700 mb-2">
                Description (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border ${errors.description_en ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Describe the service..."
              />
              {errors.description_en && <p className="text-red-500 text-sm mt-1">{errors.description_en}</p>}
            </div>

            <div>
              <label htmlFor="description_mr" className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Marathi) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description_mr"
                name="description_mr"
                value={formData.description_mr}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border ${errors.description_mr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="सेवेचे वर्णन करा..."
              />
              {errors.description_mr && <p className="text-red-500 text-sm mt-1">{errors.description_mr}</p>}
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Required Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="requiredDocuments_en" className="block text-sm font-semibold text-gray-700 mb-2">
                Required Documents (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requiredDocuments_en"
                name="requiredDocuments_en"
                value={formData.requiredDocuments_en}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-3 border ${errors.requiredDocuments_en ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm`}
                placeholder="1. Document 1&#10;2. Document 2&#10;3. Document 3"
              />
              {errors.requiredDocuments_en && <p className="text-red-500 text-sm mt-1">{errors.requiredDocuments_en}</p>}
            </div>

            <div>
              <label htmlFor="requiredDocuments_mr" className="block text-sm font-semibold text-gray-700 mb-2">
                Required Documents (Marathi) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requiredDocuments_mr"
                name="requiredDocuments_mr"
                value={formData.requiredDocuments_mr}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-3 border ${errors.requiredDocuments_mr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm`}
                placeholder="१. कागदपत्र १&#10;२. कागदपत्र २&#10;३. कागदपत्र ३"
              />
              {errors.requiredDocuments_mr && <p className="text-red-500 text-sm mt-1">{errors.requiredDocuments_mr}</p>}
            </div>
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How to Apply</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="howToApply_en" className="block text-sm font-semibold text-gray-700 mb-2">
                Application Process (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="howToApply_en"
                name="howToApply_en"
                value={formData.howToApply_en}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-3 border ${errors.howToApply_en ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm`}
                placeholder="1. Step 1&#10;2. Step 2&#10;3. Step 3"
              />
              {errors.howToApply_en && <p className="text-red-500 text-sm mt-1">{errors.howToApply_en}</p>}
            </div>

            <div>
              <label htmlFor="howToApply_mr" className="block text-sm font-semibold text-gray-700 mb-2">
                Application Process (Marathi) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="howToApply_mr"
                name="howToApply_mr"
                value={formData.howToApply_mr}
                onChange={handleChange}
                rows="6"
                className={`w-full px-4 py-3 border ${errors.howToApply_mr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm`}
                placeholder="१. पायरी १&#10;२. पायरी २&#10;३. पायरी ३"
              />
              {errors.howToApply_mr && <p className="text-red-500 text-sm mt-1">{errors.howToApply_mr}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Save size={20} />
              {isEdit ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
