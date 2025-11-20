import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockNotices } from '../../data/mockData';

function NoticeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: { en: '', mr: '' },
    type: 'ANNOUNCEMENT',
    description: { en: '', mr: '' },
    startDate: '',
    endDate: '',
    showOnHome: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      // Load notices from localStorage
      const savedNotices = localStorage.getItem('NOTICES');
      if (savedNotices) {
        try {
          const notices = JSON.parse(savedNotices);
          const notice = notices.find(n => n.id === parseInt(id));
          if (notice) {
            console.log('Loading notice for edit:', notice);
            setFormData({
              title: notice.title,
              type: notice.type,
              description: notice.description,
              startDate: notice.startDate,
              endDate: notice.endDate,
              showOnHome: notice.showOnHome || false
            });
          } else {
            console.error('Notice not found with id:', id);
          }
        } catch (error) {
          console.error('Error loading notice:', error);
        }
      }
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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

    if (!formData.title.en.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.en.trim()) {
      newErrors.description = 'Description is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Load existing notices from localStorage
    const savedNotices = localStorage.getItem('NOTICES');
    let notices = [];
    
    if (savedNotices) {
      try {
        notices = JSON.parse(savedNotices);
      } catch (error) {
        console.error('Error parsing notices:', error);
      }
    }

    const noticeData = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      showOnHome: formData.showOnHome,
      status: 'ACTIVE'
    };

    if (isEdit) {
      // Update existing notice
      const index = notices.findIndex(n => n.id === parseInt(id));
      if (index !== -1) {
        notices[index] = {
          ...notices[index],
          ...noticeData,
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
      }
      console.log('Updating notice:', notices[index]);
    } else {
      // Add new notice
      const newNotice = {
        ...noticeData,
        id: notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1,
        createdAt: new Date().toISOString()
      };
      notices.push(newNotice);
      console.log('Creating notice:', newNotice);
    }

    // Save to localStorage
    localStorage.setItem('NOTICES', JSON.stringify(notices));
    console.log('Notice saved to localStorage');
    
    // Navigate back to notices list
    alert(isEdit ? 'Notice updated successfully!' : 'Notice created successfully!');
    navigate('/admin/notices');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/notices')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title with Auto-Translation */}
            <div className="md:col-span-2">
              <BilingualInput
                label="Notice Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
                placeholder="Enter notice title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

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
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="MEETING">Meeting</option>
                <option value="TENDER">Tender</option>
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
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Show on Homepage
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-2">(Display in home page notices)</p>
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
              label="Notice Description"
              name="description"
              type="textarea"
              rows={6}
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              required
              placeholder="Enter detailed description of the notice..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
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
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Notice' : 'Save Notice'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoticeForm;
