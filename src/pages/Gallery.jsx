import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Gallery = () => {
  const { language } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadPrograms = () => {
      const savedPrograms = localStorage.getItem('GALLERY_PROGRAMS');
      console.log('Loading Gallery Programs:', savedPrograms ? 'Found' : 'Not Found');
      
      if (savedPrograms) {
        try {
          const parsed = JSON.parse(savedPrograms);
          console.log('Parsed Gallery Programs:', parsed);
          // Sort by date (newest first)
          const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPrograms(sorted);
        } catch (error) {
          console.error('Error parsing gallery programs:', error);
          setPrograms([]);
        }
      } else {
        console.log('No gallery programs in localStorage');
        setPrograms([]);
      }
    };

    loadPrograms();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'GALLERY_PROGRAMS') {
        console.log('Gallery programs updated!');
        loadPrograms();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const openLightbox = (program, index) => {
    setSelectedImage(program);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? programs.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(programs[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === programs.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(programs[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentIndex]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Photo Gallery' : 'फोटो गॅलरी'}
          </h1>
          <p className="text-xl text-white/90">
            {language === 'en' 
              ? 'Glimpses of village programs, events, and development activities' 
              : 'गावातील कार्यक्रम, कार्यक्रम आणि विकास उपक्रमांची झलक'}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-custom">
          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-gray-200"
                  onClick={() => openLightbox(program, index)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={program.photoUrl}
                      alt={language === 'en' ? program.title.en : program.title.mr}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <ImageIcon size={48} className="mx-auto mb-2" />
                        <p className="font-semibold">
                          {language === 'en' ? 'Click to view' : 'पाहण्यासाठी क्लिक करा'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                      {language === 'en' ? program.title.en : program.title.mr}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {language === 'en' ? program.description.en : program.description.mr}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={16} />
                      <span>{formatDate(program.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <ImageIcon size={64} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'en' ? 'No Photos Available' : 'कोणतेही फोटो उपलब्ध नाहीत'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Photos and programs will be displayed here once they are uploaded by the admin.' 
                  : 'प्रशासकाद्वारे अपलोड केल्यानंतर येथे फोटो आणि कार्यक्रम प्रदर्शित केले जातील.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          {programs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {programs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image Container */}
          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.photoUrl}
              alt={language === 'en' ? selectedImage.title.en : selectedImage.title.mr}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
            
            {/* Image Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mt-4 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {language === 'en' ? selectedImage.title.en : selectedImage.title.mr}
              </h2>
              <p className="text-white/90 mb-3">
                {language === 'en' ? selectedImage.description.en : selectedImage.description.mr}
              </p>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar size={18} />
                <span>{formatDate(selectedImage.date)}</span>
              </div>
              {programs.length > 1 && (
                <div className="text-white/60 text-sm mt-3">
                  {currentIndex + 1} / {programs.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
