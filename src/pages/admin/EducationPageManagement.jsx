import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  AlertCircle,
  School,
  Users,
  BookOpen,
  Plus,
  Trash2,
  Baby
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import BilingualInput from '../../components/common/BilingualInput';
import { getEducationContent, updateEducationContent } from '../../services/pagesService';

const EducationPageManagement = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Page Description
    description: {
      en: 'Education is the foundation of our village development. We are committed to providing quality education to all children and promoting literacy among adults. Our village has well-equipped schools and anganwadis that ensure holistic development of children.',
      mr: 'शिक्षण हा आमच्या गाव विकासाचा पाया आहे. आम्ही सर्व मुलांना दर्जेदार शिक्षण देण्यास आणि प्रौढांमध्ये साक्षरता वाढवण्यासाठी वचनबद्ध आहोत. आमच्या गावात सुसज्ज शाळा आणि अंगणवाड्या आहेत ज्या मुलांचा सर्वांगीण विकास सुनिश्चित करतात.'
    },

    // Schools
    schools: [
      {
        id: 1,
        name: { en: 'Government Primary School', mr: 'शासकीय प्राथमिक शाळा' },
        type: { en: 'Primary', mr: 'प्राथमिक' },
        classes: '1st to 7th',
        students: '250+',
        teachers: '12',
        facilities: {
          en: 'Computer Lab, Library, Playground, Mid-day Meal',
          mr: 'संगणक प्रयोगशाळा, ग्रंथालय, खेळाचे मैदान, मध्यान्ह भोजन'
        },
        description: {
          en: 'Well-established primary school with modern facilities and dedicated teachers',
          mr: 'आधुनिक सुविधा आणि समर्पित शिक्षकांसह सुस्थापित प्राथमिक शाळा'
        }
      },
      {
        id: 2,
        name: { en: 'Zilla Parishad High School', mr: 'जिल्हा परिषद हायस्कूल' },
        type: { en: 'Secondary', mr: 'माध्यमिक' },
        classes: '8th to 10th',
        students: '180+',
        teachers: '15',
        facilities: {
          en: 'Science Lab, Computer Lab, Sports Room, Library',
          mr: 'विज्ञान प्रयोगशाळा, संगणक प्रयोगशाळा, क्रीडा कक्ष, ग्रंथालय'
        },
        description: {
          en: 'Quality secondary education with focus on science and mathematics',
          mr: 'विज्ञान आणि गणितावर लक्ष केंद्रित करून दर्जेदार माध्यमिक शिक्षण'
        }
      }
    ],

    // Anganwadis
    anganwadis: [
      {
        id: 1,
        name: { en: 'Anganwadi Center 1', mr: 'अंगणवाडी केंद्र १' },
        location: { en: 'Main Village', mr: 'मुख्य गाव' },
        children: '35',
        worker: { en: 'Smt. Anita Patil', mr: 'श्रीमती अनिता पाटील' },
        helper: { en: 'Smt. Sunita Bhosale', mr: 'श्रीमती सुनिता भोसले' },
        services: {
          en: 'Nutrition, Pre-school Education, Health Check-ups, Immunization',
          mr: 'पोषण, पूर्व-शालेय शिक्षण, आरोग्य तपासणी, लसीकरण'
        },
        description: {
          en: 'Comprehensive child development center for children aged 0-6 years',
          mr: '०-६ वर्षे वयोगटातील मुलांसाठी सर्वसमावेशक बाल विकास केंद्र'
        }
      },
      {
        id: 2,
        name: { en: 'Anganwadi Center 2', mr: 'अंगणवाडी केंद्र २' },
        location: { en: 'East Hamlet', mr: 'पूर्व वस्ती' },
        children: '30',
        worker: { en: 'Smt. Rekha Kamble', mr: 'श्रीमती रेखा कांबळे' },
        helper: { en: 'Smt. Meera Jadhav', mr: 'श्रीमती मीरा जाधव' },
        services: {
          en: 'Nutrition, Pre-school Education, Health Check-ups, Immunization',
          mr: 'पोषण, पूर्व-शालेय शिक्षण, आरोग्य तपासणी, लसीकरण'
        },
        description: {
          en: 'Well-equipped anganwadi serving children from eastern part of village',
          mr: 'गावाच्या पूर्वेकडील भागातील मुलांना सेवा देणारी सुसज्ज अंगणवाडी'
        }
      }
    ],

    // Educational Programs
    programs: [
      {
        id: 1,
        name: { en: 'Adult Literacy Program', mr: 'प्रौढ साक्षरता कार्यक्रम' },
        description: {
          en: 'Evening classes for adults who missed formal education, focusing on basic reading, writing and numeracy skills',
          mr: 'औपचारिक शिक्षण गमावलेल्या प्रौढांसाठी संध्याकाळचे वर्ग, मूलभूत वाचन, लेखन आणि अंकीय कौशल्यांवर लक्ष केंद्रित'
        },
        timing: { en: '6 PM - 8 PM (Mon-Fri)', mr: 'सायं ६ - ८ (सोम-शुक्र)' },
        participants: '40+',
        coordinator: { en: 'Mr. Suresh Deshmukh', mr: 'श्री सुरेश देशमुख' }
      },
      {
        id: 2,
        name: { en: 'Computer Training for Youth', mr: 'युवकांसाठी संगणक प्रशिक्षण' },
        description: {
          en: 'Free computer training program for village youth covering basic computer skills, MS Office, and internet usage',
          mr: 'मूलभूत संगणक कौशल्ये, MS Office आणि इंटरनेट वापर समाविष्ट असलेल्या गावातील युवकांसाठी मोफत संगणक प्रशिक्षण कार्यक्रम'
        },
        timing: { en: '4 PM - 6 PM (Tue-Sat)', mr: 'सायं ४ - ६ (मंगळ-शनि)' },
        participants: '25',
        coordinator: { en: 'Mr. Rahul Patil', mr: 'श्री राहुल पाटील' }
      },
      {
        id: 3,
        name: { en: 'Girl Child Education Support', mr: 'मुलींच्या शिक्षणासाठी आधार' },
        description: {
          en: 'Scholarship and support program to encourage girl child education and reduce dropout rates',
          mr: 'मुलींचे शिक्षण प्रोत्साहन देण्यासाठी आणि शाळा सोडणे कमी करण्यासाठी शिष्यवृत्ती आणि समर्थन कार्यक्रम'
        },
        beneficiaries: '50+ girls',
        coordinator: { en: 'Mrs. Savita Shinde', mr: 'श्रीमती सविता शिंदे' }
      }
    ],

    // Statistics
    stats: {
      literacyRate: '78%',
      totalStudents: '500+',
      totalTeachers: '30+',
      schoolDropoutRate: '5%'
    }
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
        const content = await getEducationContent();
        if (content) {
          setFormData(content);
        }
      } catch (error) {
        console.error('Error loading education content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleBilingualChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }));
  };

  // Handler for BilingualInput component
  const handleBilingualInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value
      }
    }));
  };

  // School handlers
  const handleSchoolChange = (index, field, value) => {
    const updatedSchools = [...formData.schools];
    updatedSchools[index] = {
      ...updatedSchools[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, schools: updatedSchools }));
  };

  const addSchool = () => {
    const newSchool = {
      id: Date.now(),
      name: { en: '', mr: '' },
      type: { en: '', mr: '' },
      classes: '',
      students: '',
      teachers: '',
      facilities: { en: '', mr: '' },
      description: { en: '', mr: '' }
    };
    setFormData(prev => ({
      ...prev,
      schools: [...prev.schools, newSchool]
    }));
  };

  const removeSchool = (index) => {
    if (window.confirm(language === 'en' ? 'Remove this school?' : 'ही शाळा काढायची?')) {
      setFormData(prev => ({
        ...prev,
        schools: prev.schools.filter((_, i) => i !== index)
      }));
    }
  };

  // Anganwadi handlers
  const handleAnganwadiChange = (index, field, value) => {
    const updatedAnganwadis = [...formData.anganwadis];
    updatedAnganwadis[index] = {
      ...updatedAnganwadis[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, anganwadis: updatedAnganwadis }));
  };

  const addAnganwadi = () => {
    const newAnganwadi = {
      id: Date.now(),
      name: { en: '', mr: '' },
      location: { en: '', mr: '' },
      children: '',
      worker: { en: '', mr: '' },
      helper: { en: '', mr: '' },
      services: { en: '', mr: '' },
      description: { en: '', mr: '' }
    };
    setFormData(prev => ({
      ...prev,
      anganwadis: [...prev.anganwadis, newAnganwadi]
    }));
  };

  const removeAnganwadi = (index) => {
    if (window.confirm(language === 'en' ? 'Remove this anganwadi?' : 'ही अंगणवाडी काढायची?')) {
      setFormData(prev => ({
        ...prev,
        anganwadis: prev.anganwadis.filter((_, i) => i !== index)
      }));
    }
  };

  // Program handlers
  const handleProgramChange = (index, field, value) => {
    const updatedPrograms = [...formData.programs];
    updatedPrograms[index] = {
      ...updatedPrograms[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, programs: updatedPrograms }));
  };

  const addProgram = () => {
    const newProgram = {
      id: Date.now(),
      name: { en: '', mr: '' },
      description: { en: '', mr: '' },
      timing: { en: '', mr: '' },
      participants: '',
      coordinator: { en: '', mr: '' }
    };
    setFormData(prev => ({
      ...prev,
      programs: [...prev.programs, newProgram]
    }));
  };

  const removeProgram = (index) => {
    if (window.confirm(language === 'en' ? 'Remove this program?' : 'हा कार्यक्रम काढायचा?')) {
      setFormData(prev => ({
        ...prev,
        programs: prev.programs.filter((_, i) => i !== index)
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSaving(true);
        await updateEducationContent(formData);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        alert(
          language === 'en' 
            ? 'Education page content updated successfully!' 
            : 'Education पृष्ठ सामग्री यशस्वीरित्या अद्यतनित झाली!'
        );
      } catch (error) {
        console.error('Error saving education content:', error);
        alert(
          language === 'en'
            ? 'Failed to save education content'
            : 'सामग्री जतन करण्यात अयशस्वी'
        );
      } finally {
        setSaving(false);
      }
    }
  };

  const previewPage = async () => {
    try {
      await updateEducationContent(formData);
      window.open('/education', '_blank');
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
            {language === 'en' ? 'Education Page Management' : 'शिक्षण पृष्ठ व्यवस्थापन'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? 'Edit schools, anganwadis, and educational programs' 
              : 'शाळा, अंगणवाड्या आणि शैक्षणिक कार्यक्रम संपादित करा'}
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
        {/* Page Description */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="text-[#ff6b00]" />
            {language === 'en' ? 'Page Description' : 'पृष्ठ वर्णन'}
          </h2>

          <div>
            <BilingualInput
              label="Education Page Description"
              name="description"
              type="textarea"
              rows={4}
              value={formData.description}
              onChange={(value) => handleBilingualInputChange('description', value)}
              required
              placeholder="Enter education page description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-[#ff6b00]" />
            {language === 'en' ? 'Education Statistics' : 'शिक्षण आकडेवारी'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Literacy Rate' : 'साक्षरता दर'}
              </label>
              <input
                type="text"
                value={formData.stats.literacyRate}
                onChange={(e) => handleStatChange('literacyRate', e.target.value)}
                placeholder="78%"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Total Students' : 'एकूण विद्यार्थी'}
              </label>
              <input
                type="text"
                value={formData.stats.totalStudents}
                onChange={(e) => handleStatChange('totalStudents', e.target.value)}
                placeholder="500+"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Total Teachers' : 'एकूण शिक्षक'}
              </label>
              <input
                type="text"
                value={formData.stats.totalTeachers}
                onChange={(e) => handleStatChange('totalTeachers', e.target.value)}
                placeholder="30+"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Dropout Rate' : 'शाळा सोडणे दर'}
              </label>
              <input
                type="text"
                value={formData.stats.schoolDropoutRate}
                onChange={(e) => handleStatChange('schoolDropoutRate', e.target.value)}
                placeholder="5%"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>
        </div>

        {/* Schools */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <School className="text-[#ff6b00]" />
              {language === 'en' ? 'Schools' : 'शाळा'}
            </h2>
            <button
              type="button"
              onClick={addSchool}
              className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white rounded-lg hover:bg-[#0f6906] transition-colors"
            >
              <Plus size={18} />
              {language === 'en' ? 'Add School' : 'शाळा जोडा'}
            </button>
          </div>

          <div className="space-y-6">
            {formData.schools.map((school, index) => (
              <div key={school.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 relative">
                <button
                  type="button"
                  onClick={() => removeSchool(index)}
                  className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-4 pr-10">
                  <div>
                    <BilingualInput
                      label="School Name"
                      name={`school-name-${index}`}
                      value={school.name}
                      onChange={(value) => handleSchoolChange(index, 'name', value)}
                      placeholder="Enter school name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Classes' : 'वर्ग'}
                      </label>
                      <input
                        type="text"
                        value={school.classes}
                        onChange={(e) => handleSchoolChange(index, 'classes', e.target.value)}
                        placeholder="1st to 7th"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Students' : 'विद्यार्थी'}
                      </label>
                      <input
                        type="text"
                        value={school.students}
                        onChange={(e) => handleSchoolChange(index, 'students', e.target.value)}
                        placeholder="250+"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Teachers' : 'शिक्षक'}
                      </label>
                      <input
                        type="text"
                        value={school.teachers}
                        onChange={(e) => handleSchoolChange(index, 'teachers', e.target.value)}
                        placeholder="12"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                    <div>
                      <BilingualInput
                        label="School Type"
                        name={`school-type-${index}`}
                        value={school.type}
                        onChange={(value) => handleSchoolChange(index, 'type', value)}
                        placeholder="Primary / Secondary"
                      />
                    </div>
                  </div>

                  <div>
                    <BilingualInput
                      label="Facilities"
                      name={`school-facilities-${index}`}
                      value={school.facilities}
                      onChange={(value) => handleSchoolChange(index, 'facilities', value)}
                      placeholder="Enter school facilities"
                    />
                  </div>

                  <div>
                    <BilingualInput
                      label="Description"
                      name={`school-description-${index}`}
                      type="textarea"
                      rows={2}
                      value={school.description}
                      onChange={(value) => handleSchoolChange(index, 'description', value)}
                      placeholder="Enter school description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anganwadis */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Baby className="text-[#ff6b00]" />
              {language === 'en' ? 'Anganwadis' : 'अंगणवाड्या'}
            </h2>
            <button
              type="button"
              onClick={addAnganwadi}
              className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white rounded-lg hover:bg-[#0f6906] transition-colors"
            >
              <Plus size={18} />
              {language === 'en' ? 'Add Anganwadi' : 'अंगणवाडी जोडा'}
            </button>
          </div>

          <div className="space-y-6">
            {formData.anganwadis.map((anganwadi, index) => (
              <div key={anganwadi.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 relative">
                <button
                  type="button"
                  onClick={() => removeAnganwadi(index)}
                  className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-4 pr-10">
                  <div>
                    <BilingualInput
                      label="Anganwadi Name"
                      name={`anganwadi-name-${index}`}
                      value={anganwadi.name}
                      onChange={(value) => handleAnganwadiChange(index, 'name', value)}
                      placeholder="Enter anganwadi name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <BilingualInput
                        label="Location"
                        name={`anganwadi-location-${index}`}
                        value={anganwadi.location}
                        onChange={(value) => handleAnganwadiChange(index, 'location', value)}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Children' : 'मुले'}
                      </label>
                      <input
                        type="text"
                        value={anganwadi.children}
                        onChange={(e) => handleAnganwadiChange(index, 'children', e.target.value)}
                        placeholder="35"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <BilingualInput
                        label="Worker"
                        name={`anganwadi-worker-${index}`}
                        value={anganwadi.worker}
                        onChange={(value) => handleAnganwadiChange(index, 'worker', value)}
                        placeholder="Enter worker name"
                      />
                    </div>
                    <div>
                      <BilingualInput
                        label="Helper"
                        name={`anganwadi-helper-${index}`}
                        value={anganwadi.helper}
                        onChange={(value) => handleAnganwadiChange(index, 'helper', value)}
                        placeholder="Enter helper name"
                      />
                    </div>
                  </div>

                  <div>
                    <BilingualInput
                      label="Services"
                      name={`anganwadi-services-${index}`}
                      value={anganwadi.services}
                      onChange={(value) => handleAnganwadiChange(index, 'services', value)}
                      placeholder="Enter services provided"
                    />
                  </div>

                  <div>
                    <BilingualInput
                      label="Description"
                      name={`anganwadi-description-${index}`}
                      type="textarea"
                      rows={2}
                      value={anganwadi.description}
                      onChange={(value) => handleAnganwadiChange(index, 'description', value)}
                      placeholder="Enter anganwadi description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Programs - Simplified */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="text-[#ff6b00]" />
              {language === 'en' ? 'Educational Programs' : 'शैक्षणिक कार्यक्रम'}
            </h2>
            <button
              type="button"
              onClick={addProgram}
              className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white rounded-lg hover:bg-[#0f6906] transition-colors"
            >
              <Plus size={18} />
              {language === 'en' ? 'Add Program' : 'कार्यक्रम जोडा'}
            </button>
          </div>

          <div className="space-y-6">
            {formData.programs.map((program, index) => (
              <div key={program.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 relative">
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-4 pr-10">
                  <div>
                    <BilingualInput
                      label="Program Name"
                      name={`program-name-${index}`}
                      value={program.name}
                      onChange={(value) => handleProgramChange(index, 'name', value)}
                      placeholder="Enter program name"
                    />
                  </div>

                  <div>
                    <BilingualInput
                      label="Description"
                      name={`program-description-${index}`}
                      type="textarea"
                      rows={2}
                      value={program.description}
                      onChange={(value) => handleProgramChange(index, 'description', value)}
                      placeholder="Enter program description"
                    />
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

export default EducationPageManagement;
