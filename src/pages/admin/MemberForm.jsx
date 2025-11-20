import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockMembers } from '../../data/mockData';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: { en: '', mr: '' },
    designation: { en: '', mr: '' },
    phone: '',
    type: 'MEMBER',
    order: '',
    termStart: '',
    termEnd: '',
    photoUrl: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      const member = mockMembers.find(m => m.id === parseInt(id));
      if (member) {
        setFormData({
          name: member.name,
          designation: member.designation,
          phone: member.phone,
          type: member.type,
          order: member.order,
          termStart: member.termStart || '',
          termEnd: member.termEnd || '',
          photoUrl: member.photoUrl || ''
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

    if (!formData.name.en.trim()) newErrors.name = 'Member name is required';
    if (!formData.designation.en.trim()) newErrors.designation = 'Designation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\+]?[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.type) newErrors.type = 'Member type is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const memberData = {
      name: formData.name,
      designation: formData.designation,
      phone: formData.phone,
      type: formData.type,
      order: parseInt(formData.order) || 0,
      photoUrl: formData.photoUrl,
      ...(formData.termStart && { termStart: formData.termStart }),
      ...(formData.termEnd && { termEnd: formData.termEnd })
    };

    if (isEdit) {
      console.log('Updating member:', id, memberData);
      // TODO: Update in localStorage or API
    } else {
      console.log('Creating new member:', memberData);
      // TODO: Save to localStorage or API
    }

    navigate('/admin/members');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Upload to server and get URL
      // For now, create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/members')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? 'Edit Member' : 'Add New Member'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update member information' : 'Fill in the details to add a new member'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo
            </label>
            <div className="flex items-center gap-6">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Member photo"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all"
                >
                  <Upload size={16} />
                  Choose Photo
                </label>
                <p className="text-sm text-gray-500 mt-2">Recommended: 400x400px, Max 2MB</p>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div>
            <BilingualInput
              label="Member Name"
              name="name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              required
              placeholder="Enter member name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Designation Fields */}
          <div>
            <BilingualInput
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={(value) => handleChange('designation', value)}
              required
              placeholder="Enter designation"
            />
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="+91 1234567890"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                Member Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-3 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              >
                <option value="SARPANCH">Sarpanch</option>
                <option value="UPSARPANCH">Upsarpanch</option>
                <option value="MEMBER">Member</option>
                <option value="STAFF">Staff</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Term Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="order" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div>
              <label htmlFor="termStart" className="block text-sm font-semibold text-gray-700 mb-2">
                Term Start Date
              </label>
              <input
                type="date"
                id="termStart"
                name="termStart"
                value={formData.termStart}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="termEnd" className="block text-sm font-semibold text-gray-700 mb-2">
                Term End Date
              </label>
              <input
                type="date"
                id="termEnd"
                name="termEnd"
                value={formData.termEnd}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/members')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Save size={20} />
              {isEdit ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
