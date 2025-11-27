import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Video, Image as ImageIcon } from 'lucide-react';
import { getProgramById, createProgram, updateProgram } from '../../services/galleryService';
import { compressImage, validateImageFile } from '../../utils/imageCompression';

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
    youtubeLink: '', // Add YouTube link field
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [compressing, setCompressing] = useState(false); // Add compression state
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
        youtubeLink: program.youtubeLink || '',
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

  const handleImageFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setCompressing(true);

    try {
      // Validate and compress files
      const validFiles = [];
      const errors = [];

      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.errors.join(', ')}`);
          continue;
        }

        // Compress image
        try {
          const fileSizeKB = file.size / 1024;
          console.log(`Original size of ${file.name}: ${fileSizeKB.toFixed(2)}KB`);
          
          // Compress if larger than 1MB
          let processedFile = file;
          if (fileSizeKB > 1024) {
            console.log(`Compressing ${file.name}...`);
            processedFile = await compressImage(file, 350); // Target 350KB
            const compressedSizeKB = processedFile.size / 1024;
            console.log(`Compressed ${file.name}: ${fileSizeKB.toFixed(2)}KB → ${compressedSizeKB.toFixed(2)}KB`);
          }
          
          validFiles.push(processedFile);
        } catch (compressionError) {
          console.error(`Error compressing ${file.name}:`, compressionError);
          errors.push(`${file.name}: Failed to compress`);
        }
      }

      if (errors.length > 0) {
        alert('Some files had errors:\n' + errors.join('\n'));
      }

      if (validFiles.length === 0) {
        setCompressing(false);
        return;
      }

      // Add to new files
      setNewImageFiles(prev => [...prev, ...validFiles]);

      // Create previews
      for (const file of validFiles) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }

      // Clear error
      setErrors(prev => ({
        ...prev,
        images: ''
      }));

      // Show success message
      if (validFiles.length > 0) {
        const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0) / 1024;
        console.log(`Successfully processed ${validFiles.length} image(s). Total size: ${totalSize.toFixed(2)}KB`);
      }
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process images. Please try again.');
    } finally {
      setCompressing(false);
    }
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
    
    // Check if at least one media type is provided (images or YouTube link)
    const hasImages = (isEdit && existingImages.length > 0) || newImageFiles.length > 0;
    const hasYouTube = formData.youtubeLink && formData.youtubeLink.trim() !== '';
    
    if (!hasImages && !hasYouTube) {
      newErrors.media = 'Please provide either images or a YouTube video link';
    }
    
    // Validate YouTube link format if provided
    if (formData.youtubeLink && formData.youtubeLink.trim() !== '') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(formData.youtubeLink)) {
        newErrors.youtubeLink = 'Please enter a valid YouTube URL';
      }
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
        youtubeLink: formData.youtubeLink || '',
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
                <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  compressing 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-300 hover:border-orange-500'
                }`}>
                  {compressing ? (
                    <>
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto mb-3"></div>
                      <p className="text-orange-600 font-medium mb-1">Compressing images...</p>
                      <p className="text-sm text-orange-500">Please wait while we optimize your images</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                      <p className="text-xs text-gray-400 mt-2">Images over 1MB will be automatically compressed to ~350KB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFilesChange}
                  className="hidden"
                  disabled={loading || compressing}
                />
              </label>
              {errors.media && (
                <p className="text-red-500 text-sm mt-2">{errors.media}</p>
              )}
            </div>
          </div>
        </div>

        {/* YouTube Video Link */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b flex items-center gap-2">
            <Video className="w-5 h-5 text-orange-600" />
            <span>YouTube Video (Optional)</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.youtubeLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={loading}
              />
              {errors.youtubeLink && (
                <p className="text-red-500 text-sm mt-1">{errors.youtubeLink}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Add a YouTube video link to display alongside or instead of images. 
                Supported formats: youtube.com/watch?v=, youtu.be/
              </p>
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
