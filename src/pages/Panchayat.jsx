import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, UserCircle, Mail, Building2, Award, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getMembers } from '../services/membersService';

const Panchayat = () => {
  const { t, getContent } = useLanguage();
  const { settings: siteSettings, loading: settingsLoading } = useSiteSettings();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        const data = await getMembers();
        setMembers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  const sarpanch = members.filter(m => m.type === 'SARPANCH');
  const upsarpanch = members.filter(m => m.type === 'UPSARPANCH');
  const panchayatMembers = members.filter(m => m.type === 'MEMBER');
  const staff = members.filter(m => m.type === 'STAFF');

  if (loading || settingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!siteSettings) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Government Aesthetic */}
      <section className="relative bg-gradient-to-br from-orange-600 via-white to-green-600 py-20">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-green-600 rounded-full shadow-lg">
              <Building2 className="text-white" size={28} />
              <span className="text-white font-bold text-xl">Gram Panchayat</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              {t('nav.panchayat')}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Meet our elected representatives and dedicated office staff committed to serving our community
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span>Saffron - Courage & Sacrifice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Green - Growth & Prosperity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Details - Enhanced */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-600 rounded"></div>
              <Building2 className="text-blue-900" size={32} />
              <div className="h-1 w-12 bg-green-600 rounded"></div>
            </div>
            <h2 className="text-4xl font-bold text-blue-900 mb-3">Office Information</h2>
            <p className="text-gray-600">Your gateway to local governance and public services</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-80 lg:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-green-600/20"></div>
                  <img
                    src="https://via.placeholder.com/600x400"
                    alt="Gram Panchayat Office"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900">Government of India</p>
                    <p className="text-xs text-gray-600">Serving the community since establishment</p>
                  </div>
                </div>
                
                {/* Contact Info Side */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-blue-900">Office Address</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {getContent(siteSettings.contact.address)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-blue-900">Working Hours</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {getContent(siteSettings.officeTimings)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-blue-900">Contact Details</h3>
                      <p className="text-gray-700 mb-1">
                        <a href={`tel:${siteSettings.contact.phone}`} className="hover:text-orange-600 transition-colors">
                          {siteSettings.contact.phone}
                        </a>
                      </p>
                      <p className="text-gray-700">
                        <a href={`mailto:${siteSettings.contact.email}`} className="hover:text-orange-600 transition-colors flex items-center gap-2">
                          <Mail size={16} />
                          {siteSettings.contact.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sarpanch - Premium Design */}
      {sarpanch.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <Award className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">{getContent(sarpanch[0].designation)}</h2>
              <p className="text-gray-600">Head of the Gram Panchayat</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-orange-600">
                <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Photo with decorative elements */}
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-green-600 rounded-full opacity-20 blur-xl"></div>
                      <div className="relative w-56 h-56 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                        {sarpanch[0].photo ? (
                          <img
                            src={sarpanch[0].photo}
                            alt={getContent(sarpanch[0].name)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle size={140} className="text-gray-400" />
                        )}
                      </div>
                      {/* Badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-green-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold">
                        SARPANCH
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-blue-900 mb-2">
                          {getContent(sarpanch[0].name)}
                        </h3>
                        <p className="text-xl text-orange-600 font-semibold mb-1">
                          {getContent(sarpanch[0].designation)}
                        </p>
                      </div>
                      
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-green-50 px-6 py-3 rounded-xl border border-orange-200">
                        <Phone size={20} className="text-orange-600" />
                        <a href={`tel:${sarpanch[0].phone}`} className="text-blue-900 hover:text-orange-600 transition-colors font-semibold">
                          {sarpanch[0].phone}
                        </a>
                      </div>
                      
                      {sarpanch[0].termStart && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <p className="text-sm text-blue-900 font-semibold mb-1">Current Term</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {new Date(sarpanch[0].termStart).getFullYear()} - {new Date(sarpanch[0].termEnd).getFullYear()}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                          "Committed to the development and welfare of our village community"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upsarpanch - Premium Design */}
      {upsarpanch.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <Award className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">{getContent(upsarpanch[0].designation)}</h2>
              <p className="text-gray-600">Vice-Head of the Gram Panchayat</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-2xl shadow-2xl overflow-hidden border-t-4 border-green-600">
                <div className="bg-gradient-to-r from-green-600 to-orange-600 h-2"></div>
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Photo with decorative elements */}
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-orange-600 rounded-full opacity-20 blur-xl"></div>
                      <div className="relative w-56 h-56 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                        {upsarpanch[0].photo ? (
                          <img
                            src={upsarpanch[0].photo}
                            alt={getContent(upsarpanch[0].name)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle size={140} className="text-gray-400" />
                        )}
                      </div>
                      {/* Badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-orange-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-bold">
                        UP-SARPANCH
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-blue-900 mb-2">
                          {getContent(upsarpanch[0].name)}
                        </h3>
                        <p className="text-xl text-green-600 font-semibold mb-1">
                          {getContent(upsarpanch[0].designation)}
                        </p>
                      </div>
                      
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-orange-50 px-6 py-3 rounded-xl border border-green-200">
                        <Phone size={20} className="text-green-600" />
                        <a href={`tel:${upsarpanch[0].phone}`} className="text-blue-900 hover:text-green-600 transition-colors font-semibold">
                          {upsarpanch[0].phone}
                        </a>
                      </div>
                      
                      {upsarpanch[0].termStart && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <p className="text-sm text-blue-900 font-semibold mb-1">Current Term</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {new Date(upsarpanch[0].termStart).getFullYear()} - {new Date(upsarpanch[0].termEnd).getFullYear()}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                          "Supporting the vision of progress and prosperity for our community"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Members - Modern Grid */}
      {panchayatMembers.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <Users className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">Gram Panchayat Members</h2>
              <p className="text-gray-600">Elected representatives serving our community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {panchayatMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-orange-600 hover:scale-105"
                >
                  {/* Top colored bar */}
                  <div className="h-1 bg-gradient-to-r from-orange-600 to-green-600"></div>
                  
                  <div className="p-6">
                    {/* Photo */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-orange-600 to-green-600 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
                      <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={getContent(member.name)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle size={80} className="text-gray-400" />
                        )}
                      </div>
                      {/* Member number badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-orange-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="text-center space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {getContent(member.name)}
                        </h3>
                        <p className="text-orange-600 font-semibold text-sm">
                          {getContent(member.designation)}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-green-50 px-4 py-2 rounded-lg border border-orange-200">
                          <Phone size={16} className="text-orange-600" />
                          <a 
                            href={`tel:${member.phone}`} 
                            className="text-blue-900 hover:text-orange-600 transition-colors text-sm font-medium"
                          >
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Staff - Modern Grid */}
      {staff.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <Building2 className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">Office Staff</h2>
              <p className="text-gray-600">Dedicated professionals serving the public</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((staffMember, index) => (
                <div 
                  key={staffMember.id} 
                  className="group bg-gradient-to-br from-green-50 via-white to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-green-600 hover:scale-105"
                >
                  {/* Top colored bar */}
                  <div className="h-1 bg-gradient-to-r from-green-600 to-orange-600"></div>
                  
                  <div className="p-6">
                    {/* Photo */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-orange-600 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
                      <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                        {staffMember.photo ? (
                          <img
                            src={staffMember.photo}
                            alt={getContent(staffMember.name)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle size={80} className="text-gray-400" />
                        )}
                      </div>
                      {/* Staff number badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="text-center space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-1 group-hover:text-green-600 transition-colors">
                          {getContent(staffMember.name)}
                        </h3>
                        <p className="text-green-600 font-semibold text-sm">
                          {getContent(staffMember.designation)}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-orange-50 px-4 py-2 rounded-lg border border-green-200">
                          <Phone size={16} className="text-green-600" />
                          <a 
                            href={`tel:${staffMember.phone}`} 
                            className="text-blue-900 hover:text-green-600 transition-colors text-sm font-medium"
                          >
                            {staffMember.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Panchayat;
