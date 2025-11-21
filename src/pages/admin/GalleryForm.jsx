import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { getProgramById, createProgram, updateProgram } from '../../services/galleryService';

function GalleryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleMr: '',
    descriptionEn: '',
    descriptionMr: '',
    date: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadProgram();
    }
  }, [id, isEdit]);

  const loadProgram = async () => {
    try {
      setInitialLoading(true);
      const program = await getProgramById(id);
      setFormData({
        titleEn: program.titleEn || '',
        titleMr: program.titleMr || '',
        descriptionEn: program.descriptionEn || '',
        descriptionMr: program.descriptionMr || '',
        date: program.date?.toISOString?.().split('T')[0] || '',
      });
      setExistingImages(program.images || []);
    } catch (error) {
      console.error('Error loading program:', error);
      alert('Failed to load program');
      navigate('/admin/gallery');
    } finally {
      setInitialLoading(false);
    }
  };

  // Handler for bilingual fields
  const handleChange = (field, language, value) => {
    const fieldName = `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handler for simple fields
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles = [];
    const errors = [];

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        errors.push(`File ${index + 1} is not an image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`File ${file.name} is too large (max 5MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Add to new files
    setNewImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Clear error
    setErrors(prev => ({
      ...prev,
      images: ''
    }));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
  };

  const handleRemoveNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titleEn.trim()) {
      newErrors.titleEn = 'English title is required';
    }
    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = 'English description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!isEdit && newImageFiles.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    if (isEdit && existingImages.length === 0 && newImageFiles.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const programData = {
        titleEn: formData.titleEn,
        titleMr: formData.titleMr,
        descriptionEn: formData.descriptionEn,
        descriptionMr: formData.descriptionMr,
        date: formData.date,
      };

      if (isEdit) {
        // Update existing program
        await updateProgram(id, programData, newImageFiles, existingImages);
        alert('Program updated successfully!');
      } else {
        // Create new program
        await createProgram(programData, newImageFiles);
        alert('Program created successfully!');
      }

      navigate('/admin/gallery');
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImageFiles.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/gallery')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Photo/Program' : 'Add New Photo/Program'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update photo/program information' : 'Add a new photo or program to the gallery'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b flex items-center justify-between">
            <span>Photos ({totalImages})</span>
            {totalImages > 0 && (
              <span className="text-sm font-normal text-gray-500">
                {existingImages.length} saved + {newImageFiles.length} new
              </span>
            )}
          </h2>
          
          <div className="space-y-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Images (will be uploaded)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload More Button */}
            <div>
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                  <p className="text-xs text-gray-400 mt-2">You can select multiple images at once</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFilesChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              {errors.images && (
                <p className="text-red-500 text-sm mt-2">{errors.images}</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Title - English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleChange('title', 'en', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.titleEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter program title in English"
                disabled={loading}
              />
              {errors.titleEn && (
                <p className="text-red-500 text-sm mt-1">{errors.titleEn}</p>
              )}
            </div>

            {/* Title - Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Marathi)
              </label>
              <input
                type="text"
                value={formData.titleMr}
                onChange={(e) => handleChange('title', 'mr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="कार्यक्रमाचे शीर्षक मराठीत प्रविष्ट करा"
                disabled={loading}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleSimpleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Description
          </h2>
          
          <div className="space-y-4">
            {/* Description - English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.descriptionEn}
                onChange={(e) => handleChange('description', 'en', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.descriptionEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the program or event in English"
                disabled={loading}
              />
              {errors.descriptionEn && (
                <p className="text-red-500 text-sm mt-1">{errors.descriptionEn}</p>
              )}
            </div>

            {/* Description - Marathi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Marathi)
              </label>
              <textarea
                rows={4}
                value={formData.descriptionMr}
                onChange={(e) => handleChange('description', 'mr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="कार्यक्रम किंवा कार्यक्रमाचे वर्णन मराठीत करा"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEdit ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Update Program' : 'Save Program'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GalleryForm;
