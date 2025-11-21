import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { getAboutContent } from '../services/pagesService';

const About = () => {
  const { t, getContent } = useLanguage();

  // Load content from Firebase or use defaults
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await getAboutContent();
        
        if (content) {
          setPageContent(content);
        } else {
          // Use default content if nothing in Firebase
          setPageContent(getDefaultContent());
        }
      } catch (error) {
        console.error('Error loading about content:', error);
        setPageContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    };

    const getDefaultContent = () => ({
      description: {
        en: 'Shivpur is a vibrant village located in the heart of Maharashtra. With a rich cultural heritage and a progressive outlook, our village has been at the forefront of rural development. The village is known for its agricultural productivity, community spirit, and commitment to education and social welfare.',
        mr: 'शिवपूर हे महाराष्ट्राच्या हृदयात वसलेले एक चैतन्यशील गाव आहे. समृद्ध सांस्कृतिक वारसा आणि प्रगतीशील दृष्टीकोन असलेले आमचे गाव ग्रामीण विकासात आघाडीवर आहे. गाव त्याच्या कृषी उत्पादकता, सामुदायिक भावना आणि शिक्षण आणि समाज कल्याणाच्या वचनबद्धतेसाठी ओळखले जाते.',
      },
      population: '5,000+',
      area: '15 sq km',
      households: '800+',
      history: {
        en: 'Our village has a rich history spanning over 500 years.',
        mr: 'आमच्या गावाचा ५०० वर्षांपेक्षा जास्त कालावधीचा समृद्ध इतिहास आहे.'
      },
      vision: {
        en: 'To transform Shivpur into a model village.',
        mr: 'शिवपूरला एक आदर्श गाव बनवणे.'
      },
      mission: {
        en: 'Our mission is to provide quality infrastructure.',
        mr: 'आमचे ध्येय दर्जेदार पायाभूत सुविधा प्रदान करणे आहे.'
      },
      importantPlaces: [
        {
          id: 1,
          name: { en: 'Village Temple', mr: 'गाव मंदिर' },
          description: {
            en: 'Ancient temple dedicated to Lord Shiva, the spiritual center of our village',
            mr: 'भगवान शिवाला समर्पित प्राचीन मंदिर, आमच्या गावाचे आध्यात्मिक केंद्र',
          },
          photoUrl: '',
        },
        {
          id: 2,
          name: { en: 'Community Hall', mr: 'सामुदायिक सभागृह' },
          description: {
            en: 'Modern community hall for village meetings and cultural programs',
            mr: 'गाव सभा आणि सांस्कृतिक कार्यक्रमांसाठी आधुनिक सामुदायिक सभागृह',
          },
          photoUrl: '',
        },
        {
          id: 3,
          name: { en: 'Village Pond', mr: 'गाव तलाव' },
          description: {
            en: 'Historic pond that serves as the main water source during summer',
            mr: 'ऐतिहासिक तलाव जो उन्हाळ्यात मुख्य पाण्याचा स्रोत म्हणून काम करतो',
          },
          photoUrl: '',
        },
      ]
    });

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  if (!pageContent) return <div>Loading...</div>;

  const villageInfo = {
    description: pageContent.description,
    population: pageContent.population,
    area: pageContent.area,
    households: pageContent.households,
  };

  const importantPlaces = pageContent.importantPlaces;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">{t('nav.about')}</h1>
          <p className="text-xl text-primary-100">
            {getContent(villageInfo.description).substring(0, 100)}...
          </p>
        </div>
      </section>

      {/* Village Description */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {t('nav.about')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {getContent(villageInfo.description)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {villageInfo.population}
                </div>
                <div className="text-gray-700">Population</div>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {villageInfo.area}
                </div>
                <div className="text-gray-700">Area</div>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {villageInfo.households}
                </div>
                <div className="text-gray-700">Households</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Places */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Important Places
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {importantPlaces.map((place) => (
              <div key={place.id} className="card">
                <img
                  src={place.photoUrl}
                  alt={getContent(place.name)}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {getContent(place.name)}
                  </h3>
                  <p className="text-gray-600">
                    {getContent(place.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
