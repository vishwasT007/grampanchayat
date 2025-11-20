import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { mockPrograms } from '../../data/mockData';
import BilingualInput from '../../components/common/BilingualInput';

function GalleryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    date: '',
    photo: '',
    showOnHome: false
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      // Load programs from localStorage
      const savedPrograms = localStorage.getItem('GALLERY_PROGRAMS');
      if (savedPrograms) {
        try {
          const programs = JSON.parse(savedPrograms);
          const program = programs.find(p => p.id === parseInt(id));
          if (program) {
            console.log('Loading program for edit:', program);
            setFormData({
              title: program.title,
              description: program.description,
              date: program.date,
              photo: program.photoUrl || '',
              showOnHome: program.showOnHome || false
            });
            if (program.photoUrl) {
              setPhotoPreview(program.photoUrl);
            }
          } else {
            console.error('Program not found with id:', id);
          }
        } catch (error) {
          console.error('Error loading program:', error);
        }
      }
    }
  }, [id, isEdit]);

  // Handler for bilingual fields
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Read and preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({
      ...prev,
      photo: ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.en.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.en.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.photo && !isEdit) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Load existing programs from localStorage
    const savedPrograms = localStorage.getItem('GALLERY_PROGRAMS');
    let programs = [];
    
    if (savedPrograms) {
      try {
        programs = JSON.parse(savedPrograms);
      } catch (error) {
        console.error('Error parsing programs:', error);
      }
    }

    const programData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      photoUrl: formData.photo,
      showOnHome: formData.showOnHome
    };

    if (isEdit) {
      // Update existing program
      const index = programs.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        programs[index] = {
          ...programs[index],
          ...programData,
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
      }
      console.log('Updating program:', programs[index]);
    } else {
      // Add new program
      const newProgram = {
        ...programData,
        id: programs.length > 0 ? Math.max(...programs.map(p => p.id)) + 1 : 1,
        createdAt: new Date().toISOString()
      };
      programs.push(newProgram);
      console.log('Creating program:', newProgram);
    }

    // Save to localStorage
    localStorage.setItem('GALLERY_PROGRAMS', JSON.stringify(programs));
    console.log('Program saved to localStorage');
    
    // Navigate back to gallery list
    alert(isEdit ? 'Photo/Program updated successfully!' : 'Photo/Program added successfully!');
    navigate('/admin/gallery');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/gallery')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Photo Upload
          </h2>
          
          <div className="space-y-4">
            {/* Photo Preview */}
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-orange-500 file:to-orange-600
                    file:text-white hover:file:from-orange-600 hover:file:to-orange-700
                    file:cursor-pointer cursor-pointer"
                />
              </label>
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <BilingualInput
                label="Program Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
                placeholder="Enter program title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
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
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Show on Home */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="showOnHome"
                  checked={formData.showOnHome}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Show on Homepage
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            Description
          </h2>
          
          <div>
            <BilingualInput
              label="Description"
              name="description"
              type="textarea"
              rows={4}
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              required
              placeholder="Describe the program or event"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Photo' : 'Save Photo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GalleryForm;
