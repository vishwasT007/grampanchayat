import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useEffect, useState } from 'react';
import { getAboutContent } from '../services/pagesService';
import { 
  MapPin, 
  Users, 
  Home, 
  TrendingUp, 
  Target, 
  Eye,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';

const About = () => {
  const { t, language, getContent } = useLanguage();
  const { settings: siteSettings, loading: settingsLoading } = useSiteSettings();
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await getAboutContent();
        setPageContent(content);
      } catch (error) {
        console.error('Error loading about content:', error);
        setPageContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading || settingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!siteSettings) {
    return null;
  }

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'No About Information Available' : 'बद्दल माहिती उपलब्ध नाही'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'About page content has not been added yet.' 
              : 'पृष्ठ सामग्री अद्याप जोडली गेली नाही.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Modern Government Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-white to-green-600 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 p-4 bg-white rounded-full shadow-2xl">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-600 via-blue-900 to-green-600 rounded-full flex items-center justify-center">
                <Award className="text-white w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {language === 'en' ? 'About' : 'बद्दल'} 
              <span className="block mt-2 bg-gradient-to-r from-orange-600 via-blue-900 to-green-600 bg-clip-text text-transparent">
                {getContent(siteSettings.panchayatName)}
              </span>
            </h1>
            
            <div className="w-32 h-1 mx-auto mb-6 flex rounded-full overflow-hidden shadow-lg">
              <div className="flex-1 bg-orange-600"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-green-600"></div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {getContent(pageContent.description)}
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-16 fill-current text-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Population Card */}
              <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <Users size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{pageContent.population}</div>
                  <div className="text-white/90 text-lg">
                    {language === 'en' ? 'Population' : 'लोकसंख्या'}
                  </div>
                </div>
              </div>

              {/* Area Card */}
              <div className="group relative bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <MapPin size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{pageContent.area}</div>
                  <div className="text-white/90 text-lg">
                    {language === 'en' ? 'Area' : 'क्षेत्रफळ'}
                  </div>
                </div>
              </div>

              {/* Households Card */}
              <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <Home size={40} className="mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{pageContent.households}</div>
                  <div className="text-white/90 text-lg">
                    {language === 'en' ? 'Households' : 'कुटुंबे'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History, Vision & Mission Section */}
      {(pageContent.history || pageContent.vision || pageContent.mission) && (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Our Journey' : 'आमचा प्रवास'}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-green-600 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* History */}
              {pageContent.history && (
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="text-orange-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'en' ? 'History' : 'इतिहास'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(pageContent.history)}
                  </p>
                </div>
              )}

              {/* Vision */}
              {pageContent.vision && (
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Eye className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'en' ? 'Vision' : 'दृष्टीकोन'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(pageContent.vision)}
                  </p>
                </div>
              )}

              {/* Mission */}
              {pageContent.mission && (
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Target className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'en' ? 'Mission' : 'ध्येय'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {getContent(pageContent.mission)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Important Places Section */}
      {pageContent.importantPlaces && pageContent.importantPlaces.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {language === 'en' ? 'Important Places' : 'महत्त्वाची ठिकाणे'}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {pageContent.importantPlaces.map((place, index) => (
                <div 
                  key={place.id} 
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/20"
                >
                  {place.photoUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={place.photoUrl}
                        alt={getContent(place.name)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {!place.photoUrl && (
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-green-400 flex items-center justify-center">
                      <MapPin size={64} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {getContent(place.name)}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {getContent(place.description)}
                    </p>
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

export default About;
