import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  AlertCircle,
  FileText,
  MapPin,
  Users,
  Home,
  ImagePlus,
  Trash2,
  Plus,
  Upload,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import BilingualInput from '../../components/common/BilingualInput';
import { getAboutContent, updateAboutContent } from '../../services/pagesService';

const AboutPageManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Village Hero Image
    villageImage: '',
    
    // Village Description
    description: {
      en: 'Shivpur is a vibrant village located in the heart of Maharashtra. With a rich cultural heritage and a progressive outlook, our village has been at the forefront of rural development. The village is known for its agricultural productivity, community spirit, and commitment to education and social welfare.',
      mr: 'शिवपूर हे महाराष्ट्राच्या हृदयात वसलेले एक चैतन्यशील गाव आहे. समृद्ध सांस्कृतिक वारसा आणि प्रगतीशील दृष्टीकोन असलेले आमचे गाव ग्रामीण विकासात आघाडीवर आहे. गाव त्याच्या कृषी उत्पादकता, सामुदायिक भावना आणि शिक्षण आणि समाज कल्याणाच्या वचनबद्धतेसाठी ओळखले जाते.'
    },
    
    // Village Stats
    population: '5,000+',
    area: '15 sq km',
    households: '800+',
    
    // History
    history: {
      en: 'Our village has a rich history spanning over 500 years. Founded during the Maratha Empire, Shivpur has witnessed significant historical events and has been home to many notable personalities. The village played an important role during the freedom struggle and continues to preserve its historical heritage.',
      mr: 'आमच्या गावाचा ५०० वर्षांपेक्षा जास्त कालावधीचा समृद्ध इतिहास आहे. मराठा साम्राज्याच्या काळात स्थापन झालेल्या शिवपूरने महत्त्वाच्या ऐतिहासिक घटना पाहिल्या आहेत आणि अनेक उल्लेखनीय व्यक्तिमत्त्वांचे घर आहे. स्वातंत्र्य संग्रामात गावाने महत्त्वाची भूमिका बजावली आणि आपला ऐतिहासिक वारसा जतन करत आहे.'
    },
    
    // Vision
    vision: {
      en: 'To transform Shivpur into a model village that balances traditional values with modern development, ensuring prosperity, education, and well-being for all residents while preserving our cultural heritage and environment.',
      mr: 'शिवपूरला एक आदर्श गाव बनवणे जे पारंपारिक मूल्ये आणि आधुनिक विकासाचा समतोल साधते, आमचे सांस्कृतिक वारसा आणि पर्यावरण जतन करताना सर्व रहिवाशांसाठी समृद्धी, शिक्षण आणि कल्याण सुनिश्चित करते.'
    },
    
    // Mission
    mission: {
      en: 'Our mission is to provide quality infrastructure, promote sustainable agriculture, ensure access to education and healthcare, empower youth and women, and foster community participation in development initiatives.',
      mr: 'आमचे ध्येय दर्जेदार पायाभूत सुविधा प्रदान करणे, शाश्वत शेती प्रोत्साहन देणे, शिक्षण आणि आरोग्य सेवांचा प्रवेश सुनिश्चित करणे, युवक आणि महिलांचे सशक्तीकरण करणे आणि विकास उपक्रमांमध्ये समुदाय सहभाग वाढवणे आहे.'
    },
    
    // Important Places
    importantPlaces: [
      {
        id: 1,
        name: { en: 'Village Temple', mr: 'गाव मंदिर' },
        description: {
          en: 'Ancient temple dedicated to Lord Shiva, the spiritual center of our village',
          mr: 'भगवान शिवाला समर्पित प्राचीन मंदिर, आमच्या गावाचे आध्यात्मिक केंद्र'
        },
        photoUrl: ''
      },
      {
        id: 2,
        name: { en: 'Community Hall', mr: 'सामुदायिक सभागृह' },
        description: {
          en: 'Modern community hall for village meetings and cultural programs',
          mr: 'गाव सभा आणि सांस्कृतिक कार्यक्रमांसाठी आधुनिक सामुदायिक सभागृह'
        },
        photoUrl: ''
      },
      {
        id: 3,
        name: { en: 'Village Pond', mr: 'गाव तलाव' },
        description: {
          en: 'Historic pond that serves as the main water source during summer',
          mr: 'ऐतिहासिक तलाव जो उन्हाळ्यात मुख्य पाण्याचा स्रोत म्हणून काम करतो'
        },
        photoUrl: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load saved data from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await getAboutContent();
        if (content) {
          setFormData({
            ...content,
            villageImage: content.villageImage || ''
          });
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBilingualChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
    if (errors[`${field}_${lang}`]) {
      setErrors(prev => ({ ...prev, [`${field}_${lang}`]: '' }));
    }
  };

  // Handler for BilingualInput component
  const handleBilingualInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...formData.importantPlaces];
    updatedPlaces[index] = {
      ...updatedPlaces[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      importantPlaces: updatedPlaces
    }));
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(language === 'en' ? 'Please select an image file' : 'कृपया प्रतिमा फाइल निवडा');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'en' ? 'Image size should be less than 5MB' : 'प्रतिमा आकार 5MB पेक्षा कमी असावा');
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPlaces = [...formData.importantPlaces];
        updatedPlaces[index] = {
          ...updatedPlaces[index],
          photoUrl: reader.result
        };
        setFormData(prev => ({
          ...prev,
          importantPlaces: updatedPlaces
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVillageImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(language === 'en' ? 'Please select an image file' : 'कृपया प्रतिमा फाइल निवडा');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'en' ? 'Image size should be less than 5MB' : 'प्रतिमा आकार 5MB पेक्षा कमी असावा');
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          villageImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVillageImage = () => {
    setFormData(prev => ({
      ...prev,
      villageImage: ''
    }));
  };

  const removeImage = (index) => {
    const updatedPlaces = [...formData.importantPlaces];
    updatedPlaces[index] = {
      ...updatedPlaces[index],
      photoUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      importantPlaces: updatedPlaces
    }));
  };

  const addPlace = () => {
    const newPlace = {
      id: Date.now(),
      name: { en: '', mr: '' },
      description: { en: '', mr: '' },
      photoUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      importantPlaces: [...prev.importantPlaces, newPlace]
    }));
  };

  const removePlace = (index) => {
    if (window.confirm(language === 'en' ? 'Remove this place?' : 'ही जागा काढायची?')) {
      setFormData(prev => ({
        ...prev,
        importantPlaces: prev.importantPlaces.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.en.trim()) {
      newErrors.description_en = language === 'en' ? 'English description is required' : 'इंग्रजी वर्णन आवश्यक आहे';
    }
    if (!formData.description.mr.trim()) {
      newErrors.description_mr = language === 'en' ? 'Marathi description is required' : 'मराठी वर्णन आवश्यक आहे';
    }
    if (!formData.population.trim()) {
      newErrors.population = language === 'en' ? 'Population is required' : 'लोकसंख्या आवश्यक आहे';
    }
    if (!formData.area.trim()) {
      newErrors.area = language === 'en' ? 'Area is required' : 'क्षेत्रफळ आवश्यक आहे';
    }
    if (!formData.households.trim()) {
      newErrors.households = language === 'en' ? 'Households is required' : 'घरे आवश्यक आहेत';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSaving(true);
        await updateAboutContent(formData);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        alert(
          language === 'en' 
            ? 'About page content updated successfully!' 
            : 'About पृष्ठ सामग्री यशस्वीरित्या अद्यतनित झाली!'
        );
      } catch (error) {
        console.error('Error saving about content:', error);
        alert(
          language === 'en'
            ? 'Failed to save about content'
            : 'सामग्री जतन करण्यात अयशस्वी'
        );
      } finally {
        setSaving(false);
      }
    }
  };

  const previewPage = async () => {
    try {
      // Save current data before preview
      await updateAboutContent(formData);
      window.open('/about', '_blank');
    } catch (error) {
      console.error('Error saving before preview:', error);
      alert('Failed to save content before preview');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'en' ? 'About Page Management' : 'About पृष्ठ व्यवस्थापन'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? 'Edit village information, history, vision, and important places' 
              : 'गावाची माहिती, इतिहास, दृष्टीकोन आणि महत्त्वाच्या ठिकाणी संपादित करा'}
          </p>
        </div>
        <button
          onClick={previewPage}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#138808] text-[#138808] rounded-lg hover:bg-[#138808] hover:text-white transition-colors"
        >
          <Eye size={20} />
          {language === 'en' ? 'Preview Page' : 'पृष्ठ पूर्वावलोकन'}
        </button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-2 text-green-700">
          <AlertCircle size={20} />
          {language === 'en' ? 'Changes saved successfully!' : 'बदल यशस्वीरित्या जतन झाले!'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Village Hero Image */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImagePlus className="text-[#ff6b00]" />
            {language === 'en' ? 'Village Hero Image' : 'गाव मुख्य प्रतिमा'}
          </h2>

          {/* Show current image if exists */}
          {formData.villageImage && (
            <div className="mb-4 relative inline-block">
              <img
                src={formData.villageImage}
                alt="Village"
                className="h-48 w-auto rounded-lg border-2 border-gray-300 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                }}
              />
              <button
                type="button"
                onClick={removeVillageImage}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Upload and URL Input Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div>
              <label className="block">
                <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                  <Upload size={20} />
                  <span className="font-medium">
                    {language === 'en' ? 'Upload Village Photo' : 'गाव फोटो अपलोड करा'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVillageImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                {language === 'en' ? 'Recommended: 1200x600px, Max 5MB, JPG/PNG' : 'शिफारस: 1200x600px, कमाल 5MB, JPG/PNG'}
              </p>
            </div>

            {/* URL Input */}
            <div>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={(formData.villageImage && formData.villageImage.startsWith('data:')) ? '' : (formData.villageImage || '')}
                  onChange={(e) => handleChange('villageImage', e.target.value)}
                  placeholder={language === 'en' ? 'Or paste image URL' : 'किंवा प्रतिमा URL पेस्ट करा'}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {language === 'en' ? 'https://example.com/village-image.jpg' : 'https://example.com/village-image.jpg'}
              </p>
            </div>
          </div>
        </div>

        {/* Village Description */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-[#ff6b00]" />
            {language === 'en' ? 'Village Description' : 'गाव वर्णन'}
          </h2>

          <div>
            <BilingualInput
              label="Village Description"
              name="description"
              type="textarea"
              rows={4}
              value={formData.description}
              onChange={(value) => handleBilingualInputChange('description', value)}
              required
              placeholder="Enter village description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Village Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-[#ff6b00]" />
            {language === 'en' ? 'Village Statistics' : 'गाव आकडेवारी'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Population' : 'लोकसंख्या'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.population}
                onChange={(e) => handleChange('population', e.target.value)}
                placeholder="5,000+"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.population ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.population && (
                <p className="text-red-500 text-sm mt-1">{errors.population}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Area' : 'क्षेत्रफळ'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="15 sq km"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Households' : 'घरे'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.households}
                onChange={(e) => handleChange('households', e.target.value)}
                placeholder="800+"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-[#ff6b00] ${
                  errors.households ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.households && (
                <p className="text-red-500 text-sm mt-1">{errors.households}</p>
              )}
            </div>
          </div>
        </div>

        {/* History, Vision, Mission */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-[#ff6b00]" />
            {language === 'en' ? 'History, Vision & Mission' : 'इतिहास, दृष्टी आणि ध्येय'}
          </h2>

          <div className="space-y-6">
            {/* History */}
            <div>
              <BilingualInput
                label="History"
                name="history"
                type="textarea"
                rows={3}
                value={formData.history}
                onChange={(value) => handleBilingualInputChange('history', value)}
                placeholder="Enter village history"
              />
            </div>

            {/* Vision */}
            <div>
              <BilingualInput
                label="Vision"
                name="vision"
                type="textarea"
                rows={3}
                value={formData.vision}
                onChange={(value) => handleBilingualInputChange('vision', value)}
                placeholder="Enter village vision"
              />
            </div>

            {/* Mission */}
            <div>
              <BilingualInput
                label="Mission"
                name="mission"
                type="textarea"
                rows={3}
                value={formData.mission}
                onChange={(value) => handleBilingualInputChange('mission', value)}
                placeholder="Enter village mission"
              />
            </div>
          </div>
        </div>

        {/* Important Places */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="text-[#ff6b00]" />
              {language === 'en' ? 'Important Places' : 'महत्त्वाची ठिकाणे'}
            </h2>
            <button
              type="button"
              onClick={addPlace}
              className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white rounded-lg hover:bg-[#0f6906] transition-colors"
            >
              <Plus size={18} />
              {language === 'en' ? 'Add Place' : 'ठिकाण जोडा'}
            </button>
          </div>

          <div className="space-y-6">
            {formData.importantPlaces.map((place, index) => (
              <div key={place.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 relative">
                <button
                  type="button"
                  onClick={() => removePlace(index)}
                  className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-4 pr-10">
                  <div>
                    <BilingualInput
                      label="Place Name"
                      name={`place-name-${index}`}
                      value={place.name}
                      onChange={(value) => handlePlaceChange(index, 'name', value)}
                      placeholder="Enter place name"
                    />
                  </div>

                  <div>
                    <BilingualInput
                      label="Description"
                      name={`place-description-${index}`}
                      type="textarea"
                      rows={2}
                      value={place.description}
                      onChange={(value) => handlePlaceChange(index, 'description', value)}
                      placeholder="Enter place description"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Photo' : 'फोटो'}
                    </label>
                    
                    {/* Show current image if exists */}
                    {place.photoUrl && (
                      <div className="mb-3 relative inline-block">
                        <img
                          src={place.photoUrl}
                          alt={place.name.en}
                          className="h-32 w-auto rounded-lg border-2 border-gray-300 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {/* Upload and URL Input Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* File Upload */}
                      <div>
                        <label className="block">
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                            <Upload size={18} />
                            <span className="text-sm font-medium">
                              {language === 'en' ? 'Upload Image' : 'प्रतिमा अपलोड करा'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'en' ? 'Max 5MB, JPG/PNG' : 'कमाल 5MB, JPG/PNG'}
                        </p>
                      </div>

                      {/* URL Input */}
                      <div>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={(place.photoUrl && place.photoUrl.startsWith('data:')) ? '' : (place.photoUrl || '')}
                            onChange={(e) => handlePlaceChange(index, 'photoUrl', e.target.value)}
                            placeholder={language === 'en' ? 'Or paste image URL' : 'किंवा प्रतिमा URL पेस्ट करा'}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'en' ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            {language === 'en' ? 'Cancel' : 'रद्द करा'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-[#138808] to-[#1aa910] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          >
            <Save size={20} />
            {saving 
              ? (language === 'en' ? 'Saving...' : 'जतन करत आहे...')
              : (language === 'en' ? 'Save Changes' : 'बदल जतन करा')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPageManagement;
