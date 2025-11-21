import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getNoticeById, createNotice, updateNotice } from '../../services/noticesService';

function NoticeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleMr: '',
    type: 'ANNOUNCEMENT',
    descriptionEn: '',
    descriptionMr: '',
    startDate: '',
    endDate: '',
    showOnHome: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadNotice();
    }
  }, [id, isEdit]);

  const loadNotice = async () => {
    try {
      setInitialLoading(true);
      const notice = await getNoticeById(id);
      setFormData({
        titleEn: notice.titleEn || '',
        titleMr: notice.titleMr || '',
        type: notice.type || 'ANNOUNCEMENT',
        descriptionEn: notice.descriptionEn || '',
        descriptionMr: notice.descriptionMr || '',
        startDate: notice.startDate || '',
        endDate: notice.endDate || '',
        showOnHome: notice.showOnHome || false
      });
    } catch (error) {
      console.error('Error loading notice:', error);
      alert('Failed to load notice. Redirecting to notices list.');
      navigate('/admin/notices');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field, language, value) => {
    const fieldName = language ? `${field}${language.charAt(0).toUpperCase() + language.slice(1)}` : field;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error when user types
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleSimpleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titleEn.trim()) {
      newErrors.titleEn = 'Title is required';
    }
    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = 'Description is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      
      const noticeData = {
        titleEn: formData.titleEn,
        titleMr: formData.titleMr,
        type: formData.type,
        descriptionEn: formData.descriptionEn,
        descriptionMr: formData.descriptionMr,
        startDate: formData.startDate,
        endDate: formData.endDate,
        showOnHome: formData.showOnHome
      };

      if (isEdit) {
        await updateNotice(id, noticeData);
        alert('Notice updated successfully!');
      } else {
        await createNotice(noticeData);
        alert('Notice created successfully!');
      }
      
      navigate('/admin/notices');
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Failed to save notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/notices')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Notice' : 'Add New Notice'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update notice information' : 'Create a new notice, meeting, or tender'}
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
          
          <div className="grid grid-cols-1 gap-6">
            {/* Title - English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleChange('title', 'en', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.titleEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter notice title in English"
                disabled={loading}
              />
              {errors.titleEn && (
                <p className="text-red-500 text-sm mt-1">{errors.titleEn}</p>
              )}
            </div>

            {/* Title - Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Marathi)
              </label>
              <input
                type="text"
                value={formData.titleMr}
                onChange={(e) => handleChange('title', 'mr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="सूचना शीर्षक मराठीत प्रविष्ट करा"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleSimpleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="MEETING">Meeting</option>
                  <option value="TENDER">Tender</option>
                  <option value="EVENT">Event</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="URGENT">Urgent</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Show on Home */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showOnHome"
                    checked={formData.showOnHome}
                    onChange={handleSimpleChange}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Show on Homepage
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Description
          </h2>
          
          <div className="space-y-4">
            {/* Description - English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                value={formData.descriptionEn}
                onChange={(e) => handleChange('description', 'en', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.descriptionEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter detailed description in English"
                disabled={loading}
              />
              {errors.descriptionEn && (
                <p className="text-red-500 text-sm mt-1">{errors.descriptionEn}</p>
              )}
            </div>

            {/* Description - Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Marathi)
              </label>
              <textarea
                rows={6}
                value={formData.descriptionMr}
                onChange={(e) => handleChange('description', 'mr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="मराठीत तपशीलवार वर्णन प्रविष्ट करा"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Validity Period
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">When this notice becomes active</p>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">When this notice expires</p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The notice will automatically be marked as active during the specified date range.
              After the end date, it will be marked as inactive.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/notices')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEdit ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Update Notice' : 'Save Notice'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoticeForm;
