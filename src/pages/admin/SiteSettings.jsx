import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import BilingualInput from '../../components/common/BilingualInput';
import { mockSiteSettings } from '../../data/mockData';

function SiteSettings() {
  const [formData, setFormData] = useState({
    panchayatName: { en: '', mr: '' },
    tagline: { en: '', mr: '' },
    phone: '',
    email: '',
    address: { en: '', mr: '' },
    officeTimings: { en: '', mr: '' },
    facebook: '',
    twitter: '',
    instagram: ''
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('SITE_SETTINGS');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFormData({
          panchayatName: settings.panchayatName || { en: '', mr: '' },
          tagline: settings.tagline || { en: '', mr: '' },
          phone: settings.contact?.phone || '',
          email: settings.contact?.email || '',
          address: settings.contact?.address || { en: '', mr: '' },
          officeTimings: settings.officeTimings || { en: '', mr: '' },
          facebook: settings.socialMedia?.facebook || '',
          twitter: settings.socialMedia?.twitter || '',
          instagram: settings.socialMedia?.instagram || ''
        });
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use mock data as fallback
        setFormData({
          panchayatName: mockSiteSettings.panchayatName,
          tagline: mockSiteSettings.tagline,
          phone: mockSiteSettings.contact.phone,
          email: mockSiteSettings.contact.email,
          address: mockSiteSettings.contact.address,
          officeTimings: mockSiteSettings.officeTimings,
          facebook: mockSiteSettings.socialMedia.facebook,
          twitter: mockSiteSettings.socialMedia.twitter,
          instagram: mockSiteSettings.socialMedia.instagram
        });
      }
    } else {
      // Initialize with mock data
      setFormData({
        panchayatName: mockSiteSettings.panchayatName,
        tagline: mockSiteSettings.tagline,
        phone: mockSiteSettings.contact.phone,
        email: mockSiteSettings.contact.email,
        address: mockSiteSettings.contact.address,
        officeTimings: mockSiteSettings.officeTimings,
        facebook: mockSiteSettings.socialMedia.facebook,
        twitter: mockSiteSettings.socialMedia.twitter,
        instagram: mockSiteSettings.socialMedia.instagram
      });
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.panchayatName.en.trim()) {
      newErrors.panchayatName = 'Panchayat name is required';
    }
    if (!formData.tagline.en.trim()) {
      newErrors.tagline = 'Tagline is required';
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
    if (!formData.address.en.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.officeTimings.en.trim()) {
      newErrors.officeTimings = 'Office timings are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const settingsData = {
        panchayatName: formData.panchayatName,
        tagline: formData.tagline,
        contact: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        officeTimings: formData.officeTimings,
        socialMedia: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram
        }
      };

      // Save to localStorage
      localStorage.setItem('SITE_SETTINGS', JSON.stringify(settingsData));
      console.log('Settings saved successfully!', settingsData);

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        // Reload page to apply new settings
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your Gram Panchayat website settings
          </p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Settings saved successfully! Reloading page...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Panchayat Name with Auto-Translation */}
            <BilingualInput
              label="Panchayat Name"
              name="panchayatName"
              value={formData.panchayatName}
              onChange={(value) => handleChange('panchayatName', value)}
              required
              placeholder="e.g., Gram Panchayat Warghat"
            />
            {errors.panchayatName && (
              <p className="text-red-500 text-sm mt-1">{errors.panchayatName}</p>
            )}

            {/* Tagline with Auto-Translation */}
            <BilingualInput
              label="Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={(value) => handleChange('tagline', value)}
              required
              placeholder="e.g., Progress with Tradition"
            />
            {errors.tagline && (
              <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@grampanchayat.gov.in"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address with Auto-Translation */}
            <BilingualInput
              label="Address"
              name="address"
              type="textarea"
              rows={3}
              value={formData.address}
              onChange={(value) => handleChange('address', value)}
              required
              placeholder="Village, Taluka, District, State, PIN"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}

            {/* Office Timings with Auto-Translation */}
            <BilingualInput
              label="Office Timings"
              name="officeTimings"
              value={formData.officeTimings}
              onChange={(value) => handleChange('officeTimings', value)}
              required
              placeholder="e.g., Mon-Fri: 10:00 AM - 5:00 PM"
            />
            {errors.officeTimings && (
              <p className="text-red-500 text-sm mt-1">{errors.officeTimings}</p>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Facebook className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Social Media Links
            </h2>
          </div>

          <div className="space-y-4">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook size={16} className="inline mr-2" />
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter size={16} className="inline mr-2" />
                Twitter URL
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram size={16} className="inline mr-2" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SiteSettings;
