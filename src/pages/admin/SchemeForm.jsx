import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockSchemes } from '../../data/mockData';

function SchemeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: { en: '', mr: '' },
    category: 'CENTRAL',
    description: { en: '', mr: '' },
    eligibility: { en: '', mr: '' },
    documentsRequired: { en: '', mr: '' },
    applicationProcess: { en: '', mr: '' },
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const scheme = mockSchemes.find(s => s.id === parseInt(id));
      if (scheme) {
        setFormData({
          name: scheme.name,
          category: scheme.category,
          description: scheme.description,
          eligibility: scheme.eligibility,
          documentsRequired: {
            en: scheme.documentsRequired.en.join('\n'),
            mr: scheme.documentsRequired.mr.join('\n')
          },
          applicationProcess: scheme.applicationProcess,
          status: scheme.status
        });
      }
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.en.trim()) {
      newErrors.name = 'Scheme name is required';
    }
    if (!formData.description.en.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.eligibility.en.trim()) {
      newErrors.eligibility = 'Eligibility criteria is required';
    }
    if (!formData.documentsRequired.en.trim()) {
      newErrors.documentsRequired = 'Required documents are required';
    }
    if (!formData.applicationProcess.en.trim()) {
      newErrors.applicationProcess = 'Application process is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const schemeData = {
      id: isEdit ? parseInt(id) : Date.now(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      eligibility: formData.eligibility,
      documentsRequired: {
        en: formData.documentsRequired.en.split('\n').filter(doc => doc.trim()),
        mr: formData.documentsRequired.mr.split('\n').filter(doc => doc.trim())
      },
      applicationProcess: formData.applicationProcess,
      status: formData.status
    };

    // In a real app, this would save to backend/localStorage
    console.log(isEdit ? 'Updating scheme:' : 'Creating scheme:', schemeData);
    
    // Navigate back to schemes list
    navigate('/admin/schemes');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/schemes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Scheme' : 'Add New Scheme'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update scheme information' : 'Add a new government scheme'}
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
            {/* Scheme Name with Auto-Translation */}
            <div className="md:col-span-2">
              <BilingualInput
                label="Scheme Name"
                name="name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                required
                placeholder="Enter scheme name"
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
                <option value="CENTRAL">Central Government</option>
                <option value="STATE">State Government</option>
                <option value="DISTRICT">District Level</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Description
          </h2>
          
          <div className="space-y-4">
            {/* Description with Auto-Translation */}
            <BilingualInput
              label="Scheme Description"
              name="description"
              type="textarea"
              rows={5}
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              required
              placeholder="Describe the scheme in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Eligibility Criteria
          </h2>
          
          <div className="space-y-4">
            {/* Eligibility with Auto-Translation */}
            <BilingualInput
              label="Eligibility Criteria"
              name="eligibility"
              type="textarea"
              rows={5}
              value={formData.eligibility}
              onChange={(value) => handleChange('eligibility', value)}
              required
              placeholder="Who can apply for this scheme..."
            />
            {errors.eligibility && (
              <p className="text-red-500 text-sm mt-1">{errors.eligibility}</p>
            )}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Required Documents
          </h2>
          
          <div className="space-y-4">
            {/* Documents Required with Auto-Translation */}
            <BilingualInput
              label="Documents Required"
              name="documentsRequired"
              type="textarea"
              rows={6}
              value={formData.documentsRequired}
              onChange={(value) => handleChange('documentsRequired', value)}
              required
              placeholder="List required documents (one per line)..."
            />
            {errors.documentsRequired && (
              <p className="text-red-500 text-sm mt-1">{errors.documentsRequired}</p>
            )}
            <p className="text-xs text-gray-500">Enter one document per line</p>
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Application Process
          </h2>
          
          <div className="space-y-4">
            {/* Application Process with Auto-Translation */}
            <BilingualInput
              label="Application Process"
              name="applicationProcess"
              type="textarea"
              rows={6}
              value={formData.applicationProcess}
              onChange={(value) => handleChange('applicationProcess', value)}
              required
              placeholder="Explain how to apply for this scheme..."
            />
            {errors.applicationProcess && (
              <p className="text-red-500 text-sm mt-1">{errors.applicationProcess}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Status
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheme Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleSimpleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/schemes')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Scheme' : 'Save Scheme'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchemeForm;
