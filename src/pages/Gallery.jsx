import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllPrograms } from '../services/galleryService';

const Gallery = () => {
  const { language } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await getAllPrograms();
      // Sort by date (newest first)
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPrograms(sorted);
    } catch (error) {
      console.error('Error loading gallery programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const openLightbox = (program, programIndex) => {
    setSelectedProgram(program);
    setCurrentProgramIndex(programIndex);
    setCurrentImageIndex(0); // Start with first image
  };

  const closeLightbox = () => {
    setSelectedProgram(null);
    setCurrentImageIndex(0);
  };

  const goToPreviousProgram = () => {
    const newIndex = currentProgramIndex === 0 ? programs.length - 1 : currentProgramIndex - 1;
    setCurrentProgramIndex(newIndex);
    setSelectedProgram(programs[newIndex]);
    setCurrentImageIndex(0);
  };

  const goToNextProgram = () => {
    const newIndex = currentProgramIndex === programs.length - 1 ? 0 : currentProgramIndex + 1;
    setCurrentProgramIndex(newIndex);
    setSelectedProgram(programs[newIndex]);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (!selectedProgram) return;
    const newIndex = currentImageIndex === 0 
      ? selectedProgram.images.length - 1 
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNextImage = () => {
    if (!selectedProgram) return;
    const newIndex = currentImageIndex === selectedProgram.images.length - 1 
      ? 0 
      : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedProgram) return;
      
      if (e.key === 'ArrowLeft') {
        if (selectedProgram.images.length > 1) {
          goToPreviousImage();
        }
      }
      if (e.key === 'ArrowRight') {
        if (selectedProgram.images.length > 1) {
          goToNextImage();
        }
      }
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedProgram, currentProgramIndex, currentImageIndex]);

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
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => {
                const firstImage = program.images && program.images.length > 0 
                  ? program.images[0] 
                  : 'https://via.placeholder.com/400x300?text=No+Image';
                
                return (
                  <div
                    key={program.id}
                    className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-gray-200"
                    onClick={() => openLightbox(program, index)}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={firstImage}
                        alt={language === 'en' ? program.titleEn : program.titleMr}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      {/* Multiple Images Badge */}
                      {program.images && program.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <ImageIcon size={14} />
                          {program.images.length}
                        </div>
                      )}
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
                        {language === 'en' ? program.titleEn : program.titleMr || program.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {language === 'en' ? program.descriptionEn : program.descriptionMr || program.descriptionEn}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} />
                        <span>{formatDate(program.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
      {selectedProgram && selectedProgram.images && selectedProgram.images.length > 0 && (
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

          {/* Previous Image Button */}
          {selectedProgram.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Image Button */}
          {selectedProgram.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
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
              src={selectedProgram.images[currentImageIndex]}
              alt={`${language === 'en' ? selectedProgram.titleEn : selectedProgram.titleMr} - Image ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
            
            {/* Image Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mt-4 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {language === 'en' ? selectedProgram.titleEn : selectedProgram.titleMr || selectedProgram.titleEn}
              </h2>
              <p className="text-white/90 mb-3">
                {language === 'en' ? selectedProgram.descriptionEn : selectedProgram.descriptionMr || selectedProgram.descriptionEn}
              </p>
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <Calendar size={18} />
                <span>{formatDate(selectedProgram.date)}</span>
              </div>
              
              {/* Image Counter */}
              {selectedProgram.images.length > 1 && (
                <div className="flex items-center justify-between text-white/70 text-sm mt-4 pt-4 border-t border-white/20">
                  <span>
                    {language === 'en' ? 'Image' : 'प्रतिमा'} {currentImageIndex + 1} / {selectedProgram.images.length}
                  </span>
                  <span>
                    {language === 'en' ? 'Use arrow keys to navigate' : 'नेव्हिगेट करण्यासाठी बाण की वापरा'}
                  </span>
                </div>
              )}

              {/* Thumbnail Navigation */}
              {selectedProgram.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {selectedProgram.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-orange-500 ring-2 ring-orange-500/50' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
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
