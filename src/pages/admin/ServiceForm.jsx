import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockServices } from '../../data/mockData';
import { getService, createService, updateService } from '../../services/servicesService';

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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = ['Certificate', 'Tax', 'License', 'Registration', 'Other'];

  useEffect(() => {
    const loadService = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const service = await getService(id);
          if (service) {
            setFormData({
              name: service.name || { en: '', mr: '' },
              category: service.category || 'Certificate',
              description: service.description || { en: '', mr: '' },
              requiredDocuments: service.requiredDocuments || { en: '', mr: '' },
              fees: service.fees || '',
              processingTime: service.processingTime || '',
              howToApply: service.howToApply || { en: '', mr: '' }
            });
          }
        } catch (error) {
          console.error('Error loading service:', error);
          alert('Failed to load service. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadService();
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

    if (!formData.name.en.trim()) newErrors.name = 'Service name is required';
    if (!formData.description.en.trim()) newErrors.description = 'Description is required';
    if (!formData.requiredDocuments.en.trim()) newErrors.requiredDocuments = 'Required documents is required';
    if (!formData.fees.trim()) newErrors.fees = 'Fees is required';
    if (!formData.processingTime.trim()) newErrors.processingTime = 'Processing time is required';
    if (!formData.howToApply.en.trim()) newErrors.howToApply = 'How to apply is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        requiredDocuments: formData.requiredDocuments,
        fees: formData.fees,
        processingTime: formData.processingTime,
        howToApply: formData.howToApply
      };

      if (isEdit) {
        await updateService(id, serviceData);
        console.log('Service updated successfully');
      } else {
        await createService(serviceData);
        console.log('Service created successfully');
      }

      navigate('/admin/services');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update service information' : 'Add a new service offered by the Panchayat'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name with Auto-Translation */}
            <div className="md:col-span-2">
              <BilingualInput
                label="Service Name"
                name="name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                required
                placeholder="Enter service name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleSimpleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fees"
                value={formData.fees}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.fees ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., ₹100 or Free"
              />
              {errors.fees && (
                <p className="text-red-500 text-sm mt-1">{errors.fees}</p>
              )}
            </div>

            {/* Processing Time */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="processingTime"
                value={formData.processingTime}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.processingTime ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 7 days or 1-2 weeks"
              />
              {errors.processingTime && (
                <p className="text-red-500 text-sm mt-1">{errors.processingTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Description
          </h2>
          
          <div className="space-y-4">
            <BilingualInput
              label="Service Description"
              name="description"
              type="textarea"
              rows={5}
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              required
              placeholder="Describe the service in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Required Documents
          </h2>
          
          <div className="space-y-4">
            <BilingualInput
              label="Documents Required"
              name="requiredDocuments"
              type="textarea"
              rows={5}
              value={formData.requiredDocuments}
              onChange={(value) => handleChange('requiredDocuments', value)}
              required
              placeholder="List required documents..."
            />
            {errors.requiredDocuments && (
              <p className="text-red-500 text-sm mt-1">{errors.requiredDocuments}</p>
            )}
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            How to Apply
          </h2>
          
          <div className="space-y-4">
            <BilingualInput
              label="Application Process"
              name="howToApply"
              type="textarea"
              rows={5}
              value={formData.howToApply}
              onChange={(value) => handleChange('howToApply', value)}
              required
              placeholder="Explain how to apply for this service..."
            />
            {errors.howToApply && (
              <p className="text-red-500 text-sm mt-1">{errors.howToApply}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : (isEdit ? 'Update Service' : 'Save Service')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
