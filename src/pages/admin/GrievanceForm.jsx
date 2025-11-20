import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';

function GrievanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    category: 'OTHER',
    status: 'PENDING',
    priority: 'MEDIUM',
    submittedBy: '',
    phone: '',
    email: '',
    address: '',
    submittedDate: new Date().toISOString().split('T')[0],
    resolvedDate: '',
    assignedTo: '',
    response: { en: '', mr: '' }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      // In real app, load from API or storage
      // For now, just mock data
      setFormData({
        title: { 
          en: 'Water Supply Issue',
          mr: 'पाणीपुरवठा समस्या'
        },
        description: {
          en: 'No water supply for the last 3 days',
          mr: 'गेल्या ३ दिवसांपासून पाणीपुरवठा नाही'
        },
        category: 'WATER',
        status: 'PENDING',
        priority: 'HIGH',
        submittedBy: 'Ramesh Kumar',
        phone: '+91 9876543210',
        email: 'ramesh@example.com',
        address: 'Village Road, Area 1',
        submittedDate: '2024-11-15',
        resolvedDate: '',
        assignedTo: 'Water Department',
        response: { en: '', mr: '' }
      });
    }
  }, [id, isEdit]);

  // Handler for bilingual fields
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handler for simple fields
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
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
    if (!formData.submittedBy.trim()) {
      newErrors.submittedBy = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.submittedDate) {
      newErrors.submittedDate = 'Submitted date is required';
    }
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Department assignment is required';
    }
    if (formData.status === 'RESOLVED' && !formData.resolvedDate) {
      newErrors.resolvedDate = 'Resolved date is required when status is Resolved';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const grievanceData = {
      id: isEdit ? parseInt(id) : Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      submittedBy: formData.submittedBy,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      submittedDate: formData.submittedDate,
      resolvedDate: formData.resolvedDate || null,
      assignedTo: formData.assignedTo,
      response: (formData.response.en && formData.response.mr) ? formData.response : null
    };

    // In a real app, this would save to backend/localStorage
    console.log(isEdit ? 'Updating grievance:' : 'Creating grievance:', grievanceData);
    
    // Navigate back to grievances list
    navigate('/admin/grievances');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/grievances')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Grievance' : 'Add New Grievance'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update grievance information and status' : 'Record a new citizen grievance'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grievance Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Grievance Details
          </h2>
          
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <BilingualInput
                label="Grievance Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
                placeholder="Enter grievance title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <BilingualInput
                label="Description"
                name="description"
                type="textarea"
                rows={4}
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                required
                placeholder="Describe the grievance in detail"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category, Status, Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="WATER">Water</option>
                  <option value="ROAD">Road</option>
                  <option value="ELECTRICITY">Electricity</option>
                  <option value="SANITATION">Sanitation</option>
                  <option value="TAX">Tax</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleSimpleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleSimpleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Citizen Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submitted By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="submittedBy"
                value={formData.submittedBy}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.submittedBy ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter citizen name"
              />
              {errors.submittedBy && (
                <p className="text-red-500 text-sm mt-1">{errors.submittedBy}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+91 9876543210"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="citizen@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Management Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Management Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Department or Officer name"
              />
              {errors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
              )}
            </div>

            {/* Submitted Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submitted Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="submittedDate"
                value={formData.submittedDate}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.submittedDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.submittedDate && (
                <p className="text-red-500 text-sm mt-1">{errors.submittedDate}</p>
              )}
            </div>

            {/* Resolved Date */}
            {formData.status === 'RESOLVED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolved Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="resolvedDate"
                  value={formData.resolvedDate}
                  onChange={handleSimpleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.resolvedDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.resolvedDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.resolvedDate}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Response */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Response (Optional)
          </h2>
          
          <div>
            <BilingualInput
              label="Response"
              name="response"
              type="textarea"
              rows={3}
              value={formData.response}
              onChange={(value) => handleChange('response', value)}
              placeholder="Enter response or action taken"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/grievances')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Grievance' : 'Save Grievance'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GrievanceForm;
