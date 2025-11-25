import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { School, Baby, BookOpen, Users, TrendingUp, GraduationCap, Award, Target, Sparkles } from 'lucide-react';
import { getEducationContent } from '../services/pagesService';

const Education = () => {
  const { t, language } = useLanguage();
  
  // Load content from Firebase
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await getEducationContent();
        setPageContent(content);
      } catch (error) {
        console.error('Error loading education content:', error);
        setPageContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'No Education Data Available' : 'शिक्षण डेटा उपलब्ध नाही'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Education information has not been added yet.' 
              : 'शिक्षण माहिती अद्याप जोडली गेली नाही.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Government Style */}
      <section className="relative bg-gradient-to-br from-orange-600 via-white to-green-600 py-20">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-green-600 rounded-full shadow-lg">
              <GraduationCap className="text-white" size={32} />
              <span className="text-white font-bold text-xl">{language === 'en' ? 'Education' : 'शिक्षण'}</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              {t('nav.education')}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {language === 'en' ? pageContent.description.en : pageContent.description.mr}
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span>{language === 'en' ? 'Knowledge & Wisdom' : 'ज्ञान आणि बुद्धी'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>{language === 'en' ? 'Growth & Progress' : 'वाढ आणि प्रगती'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics - Enhanced Design */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-600 rounded"></div>
              <TrendingUp className="text-blue-900" size={32} />
              <div className="h-1 w-12 bg-green-600 rounded"></div>
            </div>
            <h2 className="text-4xl font-bold text-blue-900 mb-3">
              {language === 'en' ? 'Education at a Glance' : 'शिक्षण एका दृष्टीक्षेपात'}
            </h2>
            <p className="text-gray-600">Key metrics and achievements in education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-blue-600 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="text-white" size={32} />
                </div>
                <Sparkles className="text-blue-300" size={24} />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {pageContent.stats.literacyRate}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Literacy Rate' : 'साक्षरता दर'}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-green-600 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={32} />
                </div>
                <Sparkles className="text-green-300" size={24} />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {pageContent.stats.totalStudents}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Total Students' : 'एकूण विद्यार्थी'}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-orange-600 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="text-white" size={32} />
                </div>
                <Sparkles className="text-orange-300" size={24} />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {pageContent.stats.totalTeachers}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Total Teachers' : 'एकूण शिक्षक'}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-purple-600 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="text-white" size={32} />
                </div>
                <Sparkles className="text-purple-300" size={24} />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {pageContent.stats.schoolDropoutRate}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Dropout Rate' : 'शाळा सोडणे दर'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schools - Premium Design */}
      {pageContent.schools.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <School className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">
                {language === 'en' ? 'Our Schools' : 'आमच्या शाळा'}
              </h2>
              <p className="text-gray-600">Centers of excellence nurturing young minds</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pageContent.schools.map((school, index) => (
                <div 
                  key={school.id} 
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-t-4 border-orange-600 hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                  <div className="p-8">
                    {/* Header with Number Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-blue-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {language === 'en' ? school.name.en : school.name.mr}
                        </h3>
                        <span className="inline-block px-4 py-1 bg-gradient-to-r from-orange-100 to-green-100 text-orange-700 rounded-full text-sm font-semibold">
                          {language === 'en' ? school.type.en : school.type.mr}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{school.students}</div>
                        <div className="text-xs text-gray-600 font-semibold">{language === 'en' ? 'Students' : 'विद्यार्थी'}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{school.teachers}</div>
                        <div className="text-xs text-gray-600 font-semibold">{language === 'en' ? 'Teachers' : 'शिक्षक'}</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                        <div className="text-lg font-bold text-orange-600 mb-1">{school.classes}</div>
                        <div className="text-xs text-gray-600 font-semibold">{language === 'en' ? 'Classes' : 'वर्ग'}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {language === 'en' ? school.description.en : school.description.mr}
                    </p>

                    {/* Facilities */}
                    <div className="bg-gradient-to-br from-orange-50 to-green-50 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="text-orange-600" size={20} />
                        <div className="text-sm font-bold text-blue-900">
                          {language === 'en' ? 'Facilities & Amenities' : 'सुविधा आणि सोयी'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {language === 'en' ? school.facilities.en : school.facilities.mr}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Anganwadis - Beautiful Design */}
      {pageContent.anganwadis.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <Baby className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">
                {language === 'en' ? 'Anganwadi Centers' : 'अंगणवाड्या'}
              </h2>
              <p className="text-gray-600">Early childhood care and development</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pageContent.anganwadis.map((anganwadi, index) => (
                <div 
                  key={anganwadi.id} 
                  className="group bg-gradient-to-br from-green-50 via-white to-orange-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-t-4 border-green-600 hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-green-600 to-orange-600 h-2"></div>
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-blue-900 mb-2 group-hover:text-green-600 transition-colors">
                          {language === 'en' ? anganwadi.name.en : anganwadi.name.mr}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="font-semibold">{language === 'en' ? anganwadi.location.en : anganwadi.location.mr}</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gradient-to-br from-green-100 to-orange-100 p-6 rounded-xl mb-6">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">{anganwadi.children}</div>
                          <div className="text-xs text-gray-600 font-semibold">{language === 'en' ? 'Children' : 'मुले'}</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="text-center px-4">
                          <Baby className="mx-auto text-orange-600 mb-1" size={28} />
                          <div className="text-xs text-gray-600 font-semibold">{language === 'en' ? 'Age 0-6' : 'वय ०-६'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Staff */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                          <Users className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-semibold">{language === 'en' ? 'Worker' : 'कार्यकर्ता'}</div>
                          <div className="text-sm font-bold text-gray-800">{language === 'en' ? anganwadi.worker.en : anganwadi.worker.mr}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                          <Users className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-semibold">{language === 'en' ? 'Helper' : 'सहाय्यक'}</div>
                          <div className="text-sm font-bold text-gray-800">{language === 'en' ? anganwadi.helper.en : anganwadi.helper.mr}</div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {language === 'en' ? anganwadi.description.en : anganwadi.description.mr}
                    </p>

                    {/* Services */}
                    <div className="bg-gradient-to-br from-green-50 to-orange-50 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="text-green-600" size={20} />
                        <div className="text-sm font-bold text-blue-900">
                          {language === 'en' ? 'Services Provided' : 'प्रदान केलेल्या सेवा'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {language === 'en' ? anganwadi.services.en : anganwadi.services.mr}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Educational Programs - Modern Grid */}
      {pageContent.programs.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-1 w-12 bg-orange-600 rounded"></div>
                <BookOpen className="text-blue-900" size={32} />
                <div className="h-1 w-12 bg-green-600 rounded"></div>
              </div>
              <h2 className="text-4xl font-bold text-blue-900 mb-3">
                {language === 'en' ? 'Educational Programs' : 'शैक्षणिक कार्यक्रम'}
              </h2>
              <p className="text-gray-600">Empowering communities through learning initiatives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageContent.programs.map((program, index) => (
                <div 
                  key={program.id} 
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-t-4 border-blue-600 hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"></div>
                  <div className="p-8">
                    {/* Number Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="text-white" size={24} />
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                      {language === 'en' ? program.name.en : program.name.mr}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {language === 'en' ? program.description.en : program.description.mr}
                    </p>

                    {/* Details */}
                    <div className="space-y-3">
                      {program.timing && (
                        <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">
                              {language === 'en' ? 'Timing' : 'वेळ'}
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                              {language === 'en' ? program.timing.en : program.timing.mr}
                            </div>
                          </div>
                        </div>
                      )}

                      {program.participants && (
                        <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-orange-50 p-3 rounded-lg border border-green-200">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">
                              {language === 'en' ? 'Participants' : 'सहभागी'}
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                              {program.participants}
                            </div>
                          </div>
                        </div>
                      )}

                      {program.beneficiaries && (
                        <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-orange-50 p-3 rounded-lg border border-green-200">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">
                              {language === 'en' ? 'Beneficiaries' : 'लाभार्थी'}
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                              {program.beneficiaries}
                            </div>
                          </div>
                        </div>
                      )}

                      {program.coordinator && (
                        <div className="flex items-start gap-3 bg-gradient-to-r from-orange-50 to-purple-50 p-3 rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold mb-1">
                              {language === 'en' ? 'Coordinator' : 'समन्वयक'}
                            </div>
                            <div className="text-sm text-gray-800 font-medium">
                              {language === 'en' ? program.coordinator.en : program.coordinator.mr}
                            </div>
                          </div>
                        </div>
                      )}
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

export default Education;
