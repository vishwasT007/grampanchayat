import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { School, Baby, BookOpen, Users, TrendingUp } from 'lucide-react';

const Education = () => {
  const { t, language } = useLanguage();
  
  // Load content from localStorage or use defaults
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    const loadContent = () => {
      const savedContent = localStorage.getItem('EDUCATION_PAGE_CONTENT');
      console.log('Loading Education Page Content:', savedContent ? 'Found' : 'Not Found');
      
      if (savedContent) {
        try {
          const parsed = JSON.parse(savedContent);
          console.log('Parsed Content:', parsed);
          setPageContent(parsed);
        } catch (error) {
          console.error('Error parsing saved content:', error);
          setPageContent(getDefaultContent());
        }
      } else {
        console.log('Using default content');
        setPageContent(getDefaultContent());
      }
    };

    const getDefaultContent = () => ({
      description: {
        en: 'Education is the foundation of our village development. We are committed to providing quality education to all children and promoting literacy among adults.',
        mr: 'शिक्षण हा आमच्या गाव विकासाचा पाया आहे. आम्ही सर्व मुलांना दर्जेदार शिक्षण देण्यास वचनबद्ध आहोत.'
      },
      stats: {
        literacyRate: '78%',
        totalStudents: '500+',
        totalTeachers: '30+',
        schoolDropoutRate: '5%'
      },
      schools: [],
      anganwadis: [],
      programs: []
    });

    loadContent();

    // Listen for storage changes (when admin saves)
    const handleStorageChange = (e) => {
      if (e.key === 'EDUCATION_PAGE_CONTENT') {
        console.log('Education content updated!');
        loadContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!pageContent) return <div>Loading...</div>;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('nav.education')}</h1>
          <p className="text-xl text-white/90">
            {language === 'en' ? pageContent.description.en : pageContent.description.mr}
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {pageContent.stats.literacyRate}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Literacy Rate' : 'साक्षरता दर'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {pageContent.stats.totalStudents}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Total Students' : 'एकूण विद्यार्थी'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-orange-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {pageContent.stats.totalTeachers}
              </div>
              <div className="text-gray-700 font-semibold">
                {language === 'en' ? 'Total Teachers' : 'एकूण शिक्षक'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-purple-200">
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

      {/* Schools */}
      {pageContent.schools.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
              <School size={32} className="text-[#ff6b00]" />
              {language === 'en' ? 'Schools' : 'शाळा'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageContent.schools.map((school) => (
                <div key={school.id} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {language === 'en' ? school.name.en : school.name.mr}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Classes' : 'वर्ग'}:</span>
                      <span className="font-semibold">{school.classes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Students' : 'विद्यार्थी'}:</span>
                      <span className="font-semibold">{school.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Teachers' : 'शिक्षक'}:</span>
                      <span className="font-semibold">{school.teachers}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {language === 'en' ? school.description.en : school.description.mr}
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {language === 'en' ? 'Facilities' : 'सुविधा'}:
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? school.facilities.en : school.facilities.mr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Anganwadis */}
      {pageContent.anganwadis.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
              <Baby size={32} className="text-[#138808]" />
              {language === 'en' ? 'Anganwadis' : 'अंगणवाड्या'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageContent.anganwadis.map((anganwadi) => (
                <div key={anganwadi.id} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {language === 'en' ? anganwadi.name.en : anganwadi.name.mr}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Location' : 'स्थान'}:</span>
                      <span className="font-semibold">{language === 'en' ? anganwadi.location.en : anganwadi.location.mr}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Children' : 'मुले'}:</span>
                      <span className="font-semibold">{anganwadi.children}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{language === 'en' ? 'Worker' : 'कार्यकर्ता'}:</span>
                      <span className="font-semibold">{language === 'en' ? anganwadi.worker.en : anganwadi.worker.mr}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {language === 'en' ? anganwadi.description.en : anganwadi.description.mr}
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {language === 'en' ? 'Services' : 'सेवा'}:
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? anganwadi.services.en : anganwadi.services.mr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Educational Programs */}
      {pageContent.programs.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
              <BookOpen size={32} className="text-[#000080]" />
              {language === 'en' ? 'Educational Programs' : 'शैक्षणिक कार्यक्रम'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageContent.programs.map((program) => (
                <div key={program.id} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {language === 'en' ? program.name.en : program.name.mr}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {language === 'en' ? program.description.en : program.description.mr}
                  </p>
                  {program.timing && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{language === 'en' ? 'Timing' : 'वेळ'}:</span> {language === 'en' ? program.timing.en : program.timing.mr}
                    </div>
                  )}
                  {program.participants && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{language === 'en' ? 'Participants' : 'सहभागी'}:</span> {program.participants}
                    </div>
                  )}
                  {program.coordinator && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{language === 'en' ? 'Coordinator' : 'समन्वयक'}:</span> {language === 'en' ? program.coordinator.en : program.coordinator.mr}
                    </div>
                  )}
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
