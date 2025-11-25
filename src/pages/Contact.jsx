import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Sparkles, MessageSquare, User, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Contact = () => {
  const { t, getContent } = useLanguage();
  const { settings: siteSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'QUERY',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'QUERY',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div>
      {/* Premium Hero Section with Tricolor Gradient */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Tricolor Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-white to-green-600"></div>

        <div className="container-custom relative z-10">
          <div className="text-center">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-green-600 rounded-full mb-6 shadow-2xl shadow-orange-500/50 animate-bounce-slow">
              <MessageSquare size={40} className="text-white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t('nav.contact')}
            </h1>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-orange-500 to-orange-600 rounded-full"></div>
              <Sparkles className="text-orange-400" size={24} />
              <div className="h-1 w-20 bg-gradient-to-r from-green-600 via-green-500 to-transparent rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get in touch with us or submit your grievances
            </p>

            {/* Cultural Elements */}
            <div className="flex items-center justify-center gap-8 mt-8 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                <span className="text-sm">Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700"></div>
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Premium Contact Information */}
            <div>
              {/* Section Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-orange-600 rounded"></div>
                  <Phone className="text-blue-900" size={32} />
                  <div className="h-1 w-12 bg-green-600 rounded"></div>
                </div>
                <h2 className="text-4xl font-bold text-blue-900 mb-3">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  Reach out to us through any of the following channels
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Phone Card */}
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-orange-600 transform hover:scale-105">
                  <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Phone className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-blue-900 mb-2">Phone</h3>
                        <a
                          href={`tel:${siteSettings?.contact?.phone || ''}`}
                          className="text-orange-600 hover:text-orange-700 text-lg font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                        >
                          {siteSettings?.contact?.phone || 'Not available'}
                          <Sparkles size={18} className="group-hover:animate-spin" />
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          Available during office hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-green-600 transform hover:scale-105">
                  <div className="bg-gradient-to-r from-green-600 to-orange-600 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <Mail className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-blue-900 mb-2">Email</h3>
                        <a
                          href={`mailto:${siteSettings?.contact?.email || ''}`}
                          className="text-green-600 hover:text-green-700 text-lg font-semibold flex items-center gap-2 group-hover:gap-3 transition-all break-all"
                        >
                          {siteSettings?.contact?.email || 'Not available'}
                          <Sparkles size={18} className="group-hover:animate-spin flex-shrink-0" />
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-blue-600 transform hover:scale-105">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-blue-900 mb-2">Address</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {getContent(siteSettings?.contact?.address) || 'Not available'}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <Clock size={16} />
                          {getContent(siteSettings?.officeTimings) || 'Mon - Fri: 10:00 AM - 5:00 PM'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed or Placeholder */}
              <div className="mt-8">
                {siteSettings?.googleMapsLink ? (
                  <div className="h-80 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-300">
                    <iframe
                      src={siteSettings.googleMapsLink}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Gram Panchayat Location"
                    ></iframe>
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-orange-100 to-green-100 rounded-2xl shadow-xl overflow-hidden border-2 border-dashed border-orange-300 flex items-center justify-center group hover:border-solid transition-all">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow-lg">
                        <MapPin size={32} className="text-orange-600" />
                      </div>
                      <p className="text-gray-600 font-semibold">Map will be embedded here</p>
                      <p className="text-sm text-gray-500 mt-1">Interactive location map</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Contact Form */}
            <div>
              {/* Section Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-orange-600 rounded"></div>
                  <Send className="text-blue-900" size={32} />
                  <div className="h-1 w-12 bg-green-600 rounded"></div>
                </div>
                <h2 className="text-4xl font-bold text-blue-900 mb-3">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              {submitted ? (
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-green-600 animate-fade-in">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 h-2"></div>
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full mb-6 shadow-2xl shadow-green-500/50 animate-bounce">
                      <CheckCircle className="text-white" size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-blue-900 mb-3">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      We will get back to you soon.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-1 w-16 bg-gradient-to-r from-orange-600 to-green-600 rounded-full"></div>
                      <Sparkles className="text-green-600" size={20} />
                      <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-orange-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-orange-600">
                  <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                  <div className="p-8 space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <User size={18} className="text-orange-600" />
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all bg-gradient-to-r from-orange-50/50 to-green-50/50 hover:border-orange-400"
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <Phone size={18} className="text-green-600" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-gradient-to-r from-green-50/50 to-orange-50/50 hover:border-green-400"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <Mail size={18} className="text-blue-600" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-gradient-to-r from-blue-50/50 to-white hover:border-blue-400"
                      />
                    </div>

                    {/* Category Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <MessageSquare size={18} className="text-orange-600" />
                        Category *
                      </label>
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all bg-gradient-to-r from-orange-50/50 to-green-50/50 hover:border-orange-400 font-semibold text-gray-700"
                      >
                        <option value="QUERY">❓ Query</option>
                        <option value="COMPLAINT">⚠️ Complaint</option>
                        <option value="SUGGESTION">💡 Suggestion</option>
                      </select>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <Sparkles size={18} className="text-green-600" />
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter the subject of your message"
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-gradient-to-r from-green-50/50 to-orange-50/50 hover:border-green-400"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                        <MessageSquare size={18} className="text-blue-600" />
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-400 resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <Send size={24} />
                      <span className="text-lg">{t('common.submit')}</span>
                      <Sparkles size={20} className="animate-pulse" />
                    </button>

                    {/* Form Footer Info */}
                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 text-center">
                        <span className="font-semibold text-orange-600">*</span> Required fields
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Your information is secure with us</span>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
