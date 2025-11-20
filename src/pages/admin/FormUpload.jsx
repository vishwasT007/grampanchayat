import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, FileText } from 'lucide-react';
import { mockForms } from '../../data/mockData';
import BilingualInput from '../../components/common/BilingualInput';

function FormUpload() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    category: 'APPLICATION',
    language: 'BOTH',
    file: null,
    fileName: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      // Load forms from localStorage
      const savedForms = localStorage.getItem('FORMS');
      if (savedForms) {
        try {
          const forms = JSON.parse(savedForms);
          const form = forms.find(f => f.id === parseInt(id));
          if (form) {
            console.log('Loading form for edit:', form);
            setFormData({
              title: form.title,
              description: form.description,
              category: form.category,
              language: form.language,
              file: null,
              fileName: form.fileName || form.fileUrl || ''
            });
          } else {
            console.error('Form not found with id:', id);
          }
        } catch (error) {
          console.error('Error loading form:', error);
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({
          ...prev,
          file: 'Please select a PDF file'
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: 'File size should be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
      setErrors(prev => ({
        ...prev,
        file: ''
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      fileName: ''
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
    if (!formData.file && !isEdit) {
      newErrors.file = 'PDF file is required';
    }
    if (!formData.fileName && !formData.file) {
      newErrors.file = 'PDF file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Load existing forms from localStorage
    const savedForms = localStorage.getItem('FORMS');
    let forms = [];
    
    if (savedForms) {
      try {
        forms = JSON.parse(savedForms);
      } catch (error) {
        console.error('Error parsing forms:', error);
      }
    }

    const formDataToSubmit = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      language: formData.language,
      fileName: formData.fileName,
      fileUrl: `/forms/${formData.fileName}`, // Simulated file URL
      downloads: 0,
      uploadedAt: new Date().toISOString()
    };

    if (isEdit) {
      // Update existing form
      const index = forms.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        forms[index] = {
          ...forms[index],
          ...formDataToSubmit,
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
      }
      console.log('Updating form:', forms[index]);
    } else {
      // Add new form
      const newForm = {
        ...formDataToSubmit,
        id: forms.length > 0 ? Math.max(...forms.map(f => f.id)) + 1 : 1,
        createdAt: new Date().toISOString()
      };
      forms.push(newForm);
      console.log('Creating form:', newForm);
    }

    // Save to localStorage
    localStorage.setItem('FORMS', JSON.stringify(forms));
    console.log('Form saved to localStorage');
    console.log('File:', formData.file);
    
    // Navigate back to forms list
    alert(isEdit ? 'Form updated successfully!' : 'Form uploaded successfully!');
    navigate('/admin/forms');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/forms')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Form' : 'Upload New Form'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? 'Update form information' : 'Upload a new downloadable form'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
            PDF File Upload
          </h2>
          
          <div className="space-y-4">
            {/* File Display */}
            {formData.fileName ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800">{formData.fileName}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF up to 10MB</p>
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-orange-500 file:to-orange-600
                    file:text-white hover:file:from-orange-600 hover:file:to-orange-700
                    file:cursor-pointer cursor-pointer"
                />
              </label>
              {errors.file && (
                <p className="text-red-500 text-sm mt-1">{errors.file}</p>
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
                label="Form Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                required
                placeholder="Enter form title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleSimpleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="CERTIFICATE">Certificate</option>
                <option value="APPLICATION">Application</option>
                <option value="TAX">Tax</option>
                <option value="LICENSE">License</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleSimpleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ENGLISH">English Only</option>
                <option value="MARATHI">Marathi Only</option>
                <option value="BOTH">Both Languages</option>
              </select>
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
              placeholder="Describe the form and its purpose"
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
            onClick={() => navigate('/admin/forms')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Form' : 'Upload Form'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormUpload;
