import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockMembers } from '../../data/mockData';
import { getMember, createMember, updateMember } from '../../services/membersService';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: { en: '', mr: '' },
    designation: { en: '', mr: '' },
    phone: '',
    type: 'MEMBER',
    position: 0,
    termStart: '',
    termEnd: '',
    photo: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const member = await getMember(id);
          if (member) {
            setFormData({
              name: member.name || { en: '', mr: '' },
              designation: member.designation || { en: '', mr: '' },
              phone: member.phone || '',
              type: member.type || 'MEMBER',
              position: member.position || 0,
              termStart: member.termStart || '',
              termEnd: member.termEnd || '',
              photo: member.photo || ''
            });
          }
        } catch (error) {
          console.error('Error loading member:', error);
          alert('Failed to load member. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadMember();
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
    
    // Date validation
    if (formData.termStart && formData.termEnd && formData.termEnd < formData.termStart) {
      newErrors.termEnd = 'End date must be after start date';
    }

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
      const memberData = {
        name: formData.name,
        designation: formData.designation,
        phone: formData.phone,
        type: formData.type,
        position: parseInt(formData.position) || 0,
        photo: formData.photo,
        ...(formData.termStart && { termStart: formData.termStart }),
        ...(formData.termEnd && { termEnd: formData.termEnd })
      };

      if (isEdit) {
        await updateMember(id, memberData, photoFile);
        console.log('Member updated successfully');
      } else {
        await createMember(memberData, photoFile);
        console.log('Member created successfully');
      }

      navigate('/admin/members');
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
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
              {formData.photo ? (
                <img
                  src={formData.photo}
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
              <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleSimpleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            <div>
              <label htmlFor="termStart" className="block text-sm font-semibold text-gray-700 mb-2">
                Term Start Date
                <span className="text-xs text-gray-500 ml-2">(Optional)</span>
              </label>
              <input
                type="date"
                id="termStart"
                name="termStart"
                value={formData.termStart}
                onChange={handleSimpleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div>
              <label htmlFor="termEnd" className="block text-sm font-semibold text-gray-700 mb-2">
                Term End Date
                <span className="text-xs text-gray-500 ml-2">(Optional)</span>
              </label>
              <input
                type="date"
                id="termEnd"
                name="termEnd"
                value={formData.termEnd}
                onChange={handleSimpleChange}
                min={formData.termStart}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="YYYY-MM-DD"
              />
              {formData.termStart && formData.termEnd && formData.termEnd < formData.termStart && (
                <p className="text-red-500 text-xs mt-1">End date must be after start date</p>
              )}
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
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : (isEdit ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
