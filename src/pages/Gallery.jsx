import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Eye,
  Sparkles
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Government Style */}
      <section className="relative bg-gradient-to-br from-orange-600 via-white to-green-600 py-20">
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-green-600 rounded-full shadow-lg">
              <Camera className="text-white" size={32} />
              <span className="text-white font-bold text-xl">
                {language === 'en' ? 'Photo Gallery' : 'फोटो गॅलरी'}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              {language === 'en' ? 'Visual Chronicles' : 'दृश्य इतिहास'}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {language === 'en' 
                ? 'Capturing moments of progress, celebration, and community spirit in our village' 
                : 'आमच्या गावातील प्रगती, उत्सव आणि समुदाय भावनेचे क्षण टिपून'}
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span>{language === 'en' ? 'Events & Programs' : 'कार्यक्रम आणि उपक्रम'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>{language === 'en' ? 'Development Activities' : 'विकास क्रियाकलाप'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-orange-600 rounded"></div>
              <ImageIcon className="text-blue-900" size={32} />
              <div className="h-1 w-12 bg-green-600 rounded"></div>
            </div>
            <h2 className="text-4xl font-bold text-blue-900 mb-3">
              {language === 'en' ? 'Programs & Events' : 'कार्यक्रम आणि कार्यक्रम'}
            </h2>
            <p className="text-gray-600">
              {language === 'en' ? 'Browse through our collection of memorable moments' : 'आमच्या संस्मरणीय क्षणांचा संग्रह पहा'}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mb-4"></div>
              <p className="text-gray-600 font-semibold">
                {language === 'en' ? 'Loading gallery...' : 'गॅलरी लोड करत आहे...'}
              </p>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => {
                const firstImage = program.images && program.images.length > 0 
                  ? program.images[0] 
                  : 'https://via.placeholder.com/400x300?text=No+Image';
                
                return (
                  <div
                    key={program.id}
                    className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-orange-600"
                    onClick={() => openLightbox(program, index)}
                  >
                    <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
                    
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-green-100">
                      <img
                        src={firstImage}
                        alt={language === 'en' ? program.titleEn : program.titleMr}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      
                      {/* Multiple Images Badge */}
                      {program.images && program.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                          <ImageIcon size={16} />
                          <span>{program.images.length} {language === 'en' ? 'Photos' : 'फोटो'}</span>
                        </div>
                      )}

                      {/* Number Badge */}
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-900 font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye size={32} />
                          </div>
                          <p className="font-bold text-lg">
                            {language === 'en' ? 'View Gallery' : 'गॅलरी पहा'}
                          </p>
                          {program.images && program.images.length > 1 && (
                            <p className="text-sm text-white/80 mt-1">
                              {program.images.length} {language === 'en' ? 'images' : 'प्रतिमा'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-xl text-blue-900 mb-2 line-clamp-2 flex-1 group-hover:text-orange-600 transition-colors">
                          {language === 'en' ? program.titleEn : program.titleMr || program.titleEn}
                        </h3>
                        <Sparkles className="text-orange-500 flex-shrink-0 ml-2" size={20} />
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {language === 'en' ? program.descriptionEn : program.descriptionMr || program.descriptionEn}
                      </p>
                      
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-green-50 px-4 py-2 rounded-lg border border-orange-200">
                        <Calendar size={16} className="text-orange-600" />
                        <span className="text-sm font-semibold text-gray-700">{formatDate(program.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl border-2 border-dashed border-orange-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full mb-6">
                <ImageIcon size={48} className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                {language === 'en' ? 'No Photos Available' : 'कोणतेही फोटो उपलब्ध नाहीत'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {language === 'en' 
                  ? 'Photos and programs will be displayed here once they are uploaded by the admin.' 
                  : 'प्रशासकाद्वारे अपलोड केल्यानंतर येथे फोटो आणि कार्यक्रम प्रदर्शित केले जातील.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Lightbox Modal */}
      {selectedProgram && selectedProgram.images && selectedProgram.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={closeLightbox}
        >
          {/* Animated Backdrop with Tricolor Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-blue-900/80 to-black/95 backdrop-blur-sm"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>

          {/* Modal Content */}
          <div 
            className="relative max-w-7xl w-full max-h-[95vh] flex flex-col z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Header Bar */}
            <div className="flex items-center justify-between mb-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Camera size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">
                    {language === 'en' ? 'Photo Gallery' : 'फोटो गॅलरी'}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {language === 'en' ? selectedProgram.titleEn : selectedProgram.titleMr || selectedProgram.titleEn}
                  </p>
                </div>
              </div>
              <button
                onClick={closeLightbox}
                className="w-12 h-12 bg-white/10 hover:bg-red-600 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/50 hover:scale-110"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Buttons */}
            {selectedProgram.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-20 shadow-xl hover:scale-110"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-20 shadow-xl hover:scale-110"
                  aria-label="Next Image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-black/50 to-blue-900/30 backdrop-blur-md rounded-2xl mb-4 p-8 border border-white/20 shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={selectedProgram.images[currentImageIndex]}
                  alt={`${language === 'en' ? selectedProgram.titleEn : selectedProgram.titleMr} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
                {/* Image Counter Badge */}
                {selectedProgram.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-600 to-green-600 text-white px-5 py-2 rounded-full font-bold text-lg shadow-xl flex items-center gap-2">
                    <ImageIcon size={20} />
                    <span>{currentImageIndex + 1} / {selectedProgram.images.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Info Panel */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
              <div className="bg-gradient-to-r from-orange-600/20 to-green-600/20 h-1 rounded-full mb-6"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {language === 'en' ? selectedProgram.titleEn : selectedProgram.titleMr || selectedProgram.titleEn}
                    </h3>
                  </div>
                  
                  <p className="text-white/80 mb-4 leading-relaxed pl-13">
                    {language === 'en' ? selectedProgram.descriptionEn : selectedProgram.descriptionMr || selectedProgram.descriptionEn}
                  </p>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 w-fit">
                    <Calendar size={20} className="text-orange-400" />
                    <span className="font-semibold">{formatDate(selectedProgram.date)}</span>
                  </div>
                </div>
              </div>

              {/* Premium Thumbnails */}
              {selectedProgram.images.length > 1 && (
                <div className="border-t border-white/20 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-green-600 rounded-full flex items-center justify-center">
                      <ImageIcon size={16} className="text-white" />
                    </div>
                    <h4 className="font-bold text-white">
                      {language === 'en' ? 'All Photos' : 'सर्व फोटो'}
                    </h4>
                    <span className="text-white/60 text-sm">({selectedProgram.images.length})</span>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-600 scrollbar-track-white/10">
                    {selectedProgram.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all group ${
                          idx === currentImageIndex 
                            ? 'ring-4 ring-orange-500 scale-110 shadow-xl shadow-orange-500/50' 
                            : 'ring-2 ring-white/30 hover:ring-white/60 hover:scale-105'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        {/* Active Indicator */}
                        {idx === currentImageIndex && (
                          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/50 to-transparent flex items-end justify-center pb-1">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <Eye size={14} className="text-orange-600" />
                            </div>
                          </div>
                        )}
                        {/* Number Badge */}
                        <div className="absolute top-1 right-1 w-6 h-6 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-3 flex items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">←</kbd>
                <span>{language === 'en' ? 'Previous' : 'मागील'}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">→</kbd>
                <span>{language === 'en' ? 'Next' : 'पुढील'}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">ESC</kbd>
                <span>{language === 'en' ? 'Close' : 'बंद करा'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
