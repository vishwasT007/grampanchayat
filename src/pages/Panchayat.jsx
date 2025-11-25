import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('nav.panchayat')}</h1>
          <p className="text-xl text-primary-100">
            Meet our elected representatives and office staff
          </p>
        </div>
      </section>

      {/* Office Details */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Office Information
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img
                    src="https://via.placeholder.com/400x300"
                    alt="Gram Panchayat Office"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="text-primary-600 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Address</h3>
                      <p className="text-gray-600">
                        {getContent(siteSettings.contact.address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="text-primary-600 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Office Hours</h3>
                      <p className="text-gray-600">
                        {getContent(siteSettings.officeTimings)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="text-primary-600 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Contact</h3>
                      <p className="text-gray-600">
                        {siteSettings.contact.phone}
                      </p>
                      <p className="text-gray-600">
                        {siteSettings.contact.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sarpanch */}
      {sarpanch.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              {getContent(sarpanch[0].designation)}
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="card p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <img
                    src={sarpanch[0].photoUrl}
                    alt={getContent(sarpanch[0].name)}
                    className="w-48 h-48 rounded-full object-cover border-4 border-primary-200"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {getContent(sarpanch[0].name)}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-4">
                      {getContent(sarpanch[0].designation)}
                    </p>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone size={18} className="text-gray-500" />
                      <a href={`tel:${sarpanch[0].phone}`} className="text-gray-700 hover:text-primary-600">
                        {sarpanch[0].phone}
                      </a>
                    </div>
                    {sarpanch[0].termStart && (
                      <p className="text-sm text-gray-500 mt-3">
                        Term: {new Date(sarpanch[0].termStart).getFullYear()} - {new Date(sarpanch[0].termEnd).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upsarpanch */}
      {upsarpanch.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              {getContent(upsarpanch[0].designation)}
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="card p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <img
                    src={upsarpanch[0].photoUrl}
                    alt={getContent(upsarpanch[0].name)}
                    className="w-48 h-48 rounded-full object-cover border-4 border-primary-200"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {getContent(upsarpanch[0].name)}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-4">
                      {getContent(upsarpanch[0].designation)}
                    </p>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone size={18} className="text-gray-500" />
                      <a href={`tel:${upsarpanch[0].phone}`} className="text-gray-700 hover:text-primary-600">
                        {upsarpanch[0].phone}
                      </a>
                    </div>
                    {upsarpanch[0].termStart && (
                      <p className="text-sm text-gray-500 mt-3">
                        Term: {new Date(upsarpanch[0].termStart).getFullYear()} - {new Date(upsarpanch[0].termEnd).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Members */}
      {panchayatMembers.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Gram Panchayat Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {panchayatMembers.map((member) => (
                <div key={member.id} className="card p-6 text-center">
                  <img
                    src={member.photo}
                    alt={getContent(member.name)}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {getContent(member.name)}
                  </h3>
                  <p className="text-primary-600 mb-3">
                    {getContent(member.designation)}
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <Phone size={16} className="text-gray-500" />
                    <a href={`tel:${member.phone}`} className="text-gray-700 hover:text-primary-600 text-sm">
                      {member.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Staff */}
      {staff.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Office Staff
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((staffMember) => (
                <div key={staffMember.id} className="card p-6 text-center">
                  <img
                    src={staffMember.photo}
                    alt={getContent(staffMember.name)}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {getContent(staffMember.name)}
                  </h3>
                  <p className="text-primary-600 mb-3">
                    {getContent(staffMember.designation)}
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <Phone size={16} className="text-gray-500" />
                    <a href={`tel:${staffMember.phone}`} className="text-gray-700 hover:text-primary-600 text-sm">
                      {staffMember.phone}
                    </a>
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
