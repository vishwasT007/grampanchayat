import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { mockSiteSettings } from '../../data/mockData';

function SiteSettings() {
  const [formData, setFormData] = useState({
    panchayatName_en: '',
    panchayatName_mr: '',
    tagline_en: '',
    tagline_mr: '',
    phone: '',
    email: '',
    address_en: '',
    address_mr: '',
    officeTimings_en: '',
    officeTimings_mr: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('SITE_SETTINGS');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFormData({
          panchayatName_en: settings.panchayatName?.en || '',
          panchayatName_mr: settings.panchayatName?.mr || '',
          tagline_en: settings.tagline?.en || '',
          tagline_mr: settings.tagline?.mr || '',
          phone: settings.contact?.phone || '',
          email: settings.contact?.email || '',
          address_en: settings.contact?.address?.en || '',
          address_mr: settings.contact?.address?.mr || '',
          officeTimings_en: settings.officeTimings?.en || '',
          officeTimings_mr: settings.officeTimings?.mr || '',
          facebook: settings.socialMedia?.facebook || '',
          twitter: settings.socialMedia?.twitter || '',
          instagram: settings.socialMedia?.instagram || ''
        });
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use mock data as fallback
        setFormData({
          panchayatName_en: mockSiteSettings.panchayatName.en,
          panchayatName_mr: mockSiteSettings.panchayatName.mr,
          tagline_en: mockSiteSettings.tagline.en,
          tagline_mr: mockSiteSettings.tagline.mr,
          phone: mockSiteSettings.contact.phone,
          email: mockSiteSettings.contact.email,
          address_en: mockSiteSettings.contact.address.en,
          address_mr: mockSiteSettings.contact.address.mr,
          officeTimings_en: mockSiteSettings.officeTimings.en,
          officeTimings_mr: mockSiteSettings.officeTimings.mr,
          facebook: mockSiteSettings.socialMedia.facebook || '',
          twitter: mockSiteSettings.socialMedia.twitter || '',
          instagram: mockSiteSettings.socialMedia.instagram || ''
        });
      }
    } else {
      // First time - use mock data and save it
      const initialSettings = {
        panchayatName: mockSiteSettings.panchayatName,
        tagline: mockSiteSettings.tagline,
        contact: mockSiteSettings.contact,
        officeTimings: mockSiteSettings.officeTimings,
        socialMedia: mockSiteSettings.socialMedia
      };
      localStorage.setItem('SITE_SETTINGS', JSON.stringify(initialSettings));
      setFormData({
        panchayatName_en: mockSiteSettings.panchayatName.en,
        panchayatName_mr: mockSiteSettings.panchayatName.mr,
        tagline_en: mockSiteSettings.tagline.en,
        tagline_mr: mockSiteSettings.tagline.mr,
        phone: mockSiteSettings.contact.phone,
        email: mockSiteSettings.contact.email,
        address_en: mockSiteSettings.contact.address.en,
        address_mr: mockSiteSettings.contact.address.mr,
        officeTimings_en: mockSiteSettings.officeTimings.en,
        officeTimings_mr: mockSiteSettings.officeTimings.mr,
        facebook: mockSiteSettings.socialMedia.facebook || '',
        twitter: mockSiteSettings.socialMedia.twitter || '',
        instagram: mockSiteSettings.socialMedia.instagram || ''
      });
    }
  }, []);

  const handleChange = (e) => {
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
    // Clear saved message
    if (saved) {
      setSaved(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.panchayatName_en.trim()) {
      newErrors.panchayatName_en = 'English name is required';
    }
    if (!formData.panchayatName_mr.trim()) {
      newErrors.panchayatName_mr = 'Marathi name is required';
    }
    if (!formData.tagline_en.trim()) {
      newErrors.tagline_en = 'English tagline is required';
    }
    if (!formData.tagline_mr.trim()) {
      newErrors.tagline_mr = 'Marathi tagline is required';
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
    if (!formData.address_en.trim()) {
      newErrors.address_en = 'English address is required';
    }
    if (!formData.address_mr.trim()) {
      newErrors.address_mr = 'Marathi address is required';
    }
    if (!formData.officeTimings_en.trim()) {
      newErrors.officeTimings_en = 'English office timings are required';
    }
    if (!formData.officeTimings_mr.trim()) {
      newErrors.officeTimings_mr = 'Marathi office timings are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const settingsData = {
      panchayatName: {
        en: formData.panchayatName_en,
        mr: formData.panchayatName_mr
      },
      tagline: {
        en: formData.tagline_en,
        mr: formData.tagline_mr
      },
      contact: {
        phone: formData.phone,
        email: formData.email,
        address: {
          en: formData.address_en,
          mr: formData.address_mr
        }
      },
      officeTimings: {
        en: formData.officeTimings_en,
        mr: formData.officeTimings_mr
      },
      socialMedia: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        instagram: formData.instagram
      }
    };

    // Save to localStorage
    localStorage.setItem('SITE_SETTINGS', JSON.stringify(settingsData));
    console.log('Settings saved to localStorage:', settingsData);
    
    // Show success message
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Reload the page to apply new settings
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your Gram Panchayat website settings</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Save className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-green-800 font-medium">Settings saved successfully!</p>
            <p className="text-green-700 text-sm">Your changes have been updated.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Panchayat Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <Building2 className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Panchayat Information</h2>
          </div>
          
          <div className="space-y-4">
            {/* Panchayat Name English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panchayat Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="panchayatName_en"
                value={formData.panchayatName_en}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.panchayatName_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Panchayat name in English"
              />
              {errors.panchayatName_en && (
                <p className="text-red-500 text-sm mt-1">{errors.panchayatName_en}</p>
              )}
            </div>

            {/* Panchayat Name Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panchayat Name (Marathi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="panchayatName_mr"
                value={formData.panchayatName_mr}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.panchayatName_mr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="मराठीत ग्रामपंचायतचे नाव प्रविष्ट करा"
              />
              {errors.panchayatName_mr && (
                <p className="text-red-500 text-sm mt-1">{errors.panchayatName_mr}</p>
              )}
            </div>

            {/* Tagline English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tagline_en"
                value={formData.tagline_en}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.tagline_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter tagline in English"
              />
              {errors.tagline_en && (
                <p className="text-red-500 text-sm mt-1">{errors.tagline_en}</p>
              )}
            </div>

            {/* Tagline Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline (Marathi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tagline_mr"
                value={formData.tagline_mr}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.tagline_mr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="मराठीत टॅगलाइन प्रविष्ट करा"
              />
              {errors.tagline_mr && (
                <p className="text-red-500 text-sm mt-1">{errors.tagline_mr}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <Phone className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+91 1234567890"
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
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address English */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address_en"
                value={formData.address_en}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.address_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address in English"
              />
              {errors.address_en && (
                <p className="text-red-500 text-sm mt-1">{errors.address_en}</p>
              )}
            </div>

            {/* Address Marathi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address (Marathi) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address_mr"
                value={formData.address_mr}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.address_mr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="मराठीत संपूर्ण पत्ता प्रविष्ट करा"
              />
              {errors.address_mr && (
                <p className="text-red-500 text-sm mt-1">{errors.address_mr}</p>
              )}
            </div>
          </div>
        </div>

        {/* Office Timings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <Clock className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Office Timings</h2>
          </div>
          
          <div className="space-y-4">
            {/* Office Timings English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Timings (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="officeTimings_en"
                value={formData.officeTimings_en}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.officeTimings_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Monday - Friday, 10:00 AM - 5:00 PM"
              />
              {errors.officeTimings_en && (
                <p className="text-red-500 text-sm mt-1">{errors.officeTimings_en}</p>
              )}
            </div>

            {/* Office Timings Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Timings (Marathi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="officeTimings_mr"
                value={formData.officeTimings_mr}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.officeTimings_mr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="सोमवार - शुक्रवार, सकाळी १० ते संध्याकाळी ५"
              />
              {errors.officeTimings_mr && (
                <p className="text-red-500 text-sm mt-1">{errors.officeTimings_mr}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <Facebook className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Social Media Links</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add your social media profile URLs (optional)</p>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 inline mr-1" />
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter className="w-4 h-4 inline mr-1" />
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 inline mr-1" />
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default SiteSettings;
