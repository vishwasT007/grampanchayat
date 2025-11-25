import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Users, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getAllYears, getLatestYear, getStatisticsSummaryByYear } from '../services/villageStatisticsService';
import { downloadPDF } from '../utils/pdfGenerator';
import { useSiteSettings } from '../context/SiteSettingsContext';

const VillageStatisticsPublic = () => {
  const { language } = useLanguage();
  const { settings } = useSiteSettings();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadStatistics();
    }
  }, [selectedYear]);

  const loadInitialData = async () => {
    try {
      const allYears = await getAllYears();
      setYears(allYears);
      
      const latest = await getLatestYear();
      if (latest) {
        setSelectedYear(latest);
      } else if (allYears.length > 0) {
        setSelectedYear(allYears[0]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await getStatisticsSummaryByYear(selectedYear);
      console.log('Raw data from Firebase:', data);
      
      // Transform the data into array format for display
      if (data && data.villages && Array.isArray(data.villages)) {
        const summaryArray = data.villages.map(village => {
          // Find corresponding data for this village
          const villageDemographics = data.demographics?.find(d => d.villageId === village.id) || {};
          const villageBreakdowns = data.breakdowns?.filter(b => b.villageId === village.id) || [];
          const villageGroups = data.groups?.find(g => g.villageId === village.id) || {};
          const villageInfra = data.infrastructure?.find(i => i.villageId === village.id) || {};
          
          return {
            village,
            demographics: villageDemographics,
            breakdowns: villageBreakdowns,
            groups: villageGroups,
            infrastructure: villageInfra
          };
        });
        
        console.log('Transformed summary array:', summaryArray);
        setSummary(summaryArray);
      } else {
        console.log('No villages found in data');
        setSummary([]);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      setSummary([]);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const options = {
        title: 'Village Statistics Report',
        gramPanchayatName: settings?.title?.en || 'Gram Panchayat',
        orientation: 'landscape'
      };
      await downloadPDF(selectedYear, options);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'en' ? 'No Data Available' : 'डेटा उपलब्ध नाही'}
            </h2>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Village statistics data has not been added yet.' 
                : 'ग्राम सांख्यिकी डेटा अद्याप जोडला गेला नाही.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const CATEGORIES = ['ST', 'SC', 'OBC', 'OTHER'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <BarChart3 className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'en' ? 'Village Statistics' : 'ग्राम सांख्यिकी'}
              </h1>
              <p className="text-orange-100 mt-1">
                {language === 'en' ? 'Census & Infrastructure Data' : 'जनगणना आणि पायाभूत सुविधा डेटा'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Year Selector & Download */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Select Year' : 'वर्ष निवडा'}
              </label>
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Download className="w-5 h-5" />
              {downloading 
                ? (language === 'en' ? 'Generating...' : 'तयार करत आहे...')
                : (language === 'en' ? 'Download Full Report (PDF)' : 'संपूर्ण अहवाल डाउनलोड करा (PDF)')
              }
            </button>
          </div>
        </div>

        {summary.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'en' 
                ? `No data available for year ${selectedYear}` 
                : `${selectedYear} साठी डेटा उपलब्ध नाही`}
            </p>
          </div>
        ) : (
          <>
            {/* Section A: Population Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  {language === 'en' ? 'Population Overview' : 'लोकसंख्या विहंगावलोकन'}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-50 to-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Village' : 'गाव'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Total Population' : 'एकूण लोकसंख्या'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Male' : 'पुरुष'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Female' : 'महिला'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.map((item, index) => (
                      <tr key={item.village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {language === 'en' ? item.village.nameEn : item.village.nameMr}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
                          {(item.demographics.totalPopulation || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {(item.demographics.malePopulation || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {(item.demographics.femalePopulation || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {language === 'en' ? 'TOTAL' : 'एकूण'}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        {summary.reduce((sum, item) => sum + (item.demographics.totalPopulation || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        {summary.reduce((sum, item) => sum + (item.demographics.malePopulation || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        {summary.reduce((sum, item) => sum + (item.demographics.femalePopulation || 0), 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Section B: Category-wise Population */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? 'Category-wise Population' : 'श्रेणीनुसार लोकसंख्या'}
              </h2>

              {summary.map((item, idx) => (
                <div key={item.village.id} className={`mb-6 ${idx !== summary.length - 1 ? 'pb-6 border-b border-gray-200' : ''}`}>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {language === 'en' ? item.village.nameEn : item.village.nameMr}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                            {language === 'en' ? 'Category' : 'श्रेणी'}
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                            {language === 'en' ? 'Male' : 'पुरुष'}
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                            {language === 'en' ? 'Female' : 'महिला'}
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                            {language === 'en' ? 'Total' : 'एकूण'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {CATEGORIES.map(category => {
                          const catData = item.breakdowns.find(b => b.category === category) || {};
                          return (
                            <tr key={category}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{category}</td>
                              <td className="px-4 py-2 text-center text-sm text-gray-700">
                                {(catData.maleCount || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-center text-sm text-gray-700">
                                {(catData.femaleCount || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
                                {((catData.maleCount || 0) + (catData.femaleCount || 0)).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Section C: Groups & Committees */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {language === 'en' ? 'Groups & Committees' : 'गट आणि समित्या'}
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-orange-50 to-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Village' : 'गाव'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Mahila Bachat Gat' : 'महिला बचत गट'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Yuvak Mandal' : 'युवक मंडळ'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Kisan Gat' : 'किसान गट'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        {language === 'en' ? 'Other Groups' : 'इतर गट'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.map((item, index) => (
                      <tr key={item.village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {language === 'en' ? item.village.nameEn : item.village.nameMr}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {item.groups.mahilaBachatGatCount || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {item.groups.yuvakMandalCount || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {item.groups.kisanGatCount || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          {item.groups.otherGroupCount || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section D: Water & Infrastructure */}
            <div className="space-y-8">
              {/* Table 1: Water Supply Sources */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    {language === 'en' ? 'Water Supply Sources' : 'पाणी पुरवठा साधने'}
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-orange-50 to-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Sr. No.' : 'अ.क्र.'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Water Source' : 'पाणी स्रोत'}
                        </th>
                        {summary.map(item => (
                          <th key={item.village.id} className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                            {language === 'en' ? item.village.nameEn : item.village.nameMr}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-50">
                          {language === 'en' ? 'Total' : 'एकूण'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Private Wells */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">1</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Private Wells' : 'खाजगी विहीर'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.privateWells || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.privateWells || 0), 0)}
                        </td>
                      </tr>
                      
                      {/* Public Wells */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">2</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Public Wells' : 'सार्वजनिक विहीर'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.publicWells || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.publicWells || 0), 0)}
                        </td>
                      </tr>
                      
                      {/* NIT Scheme */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">3</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'NIT Scheme' : 'एनआयटी योजना'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.nitScheme || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.nitScheme || 0), 0)}
                        </td>
                      </tr>
                      
                      {/* Handpumps */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">4</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Handpumps' : 'हँडपंप'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.handpumps || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.handpumps || 0), 0)}
                        </td>
                      </tr>
                      
                      {/* Water Tank Capacity */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">5</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Water Tank Capacity' : 'पाणी टाकीची क्षमता'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.waterTankCapacity || '—'}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center text-gray-500 bg-blue-50">—</td>
                      </tr>
                      
                      {/* Water Filter Plant */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">6</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Water Filter Plant' : 'पाणी गाळणी प्रकल्प'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.waterFilterPlant || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.waterFilterPlant || 0), 0)}
                        </td>
                      </tr>
                      
                      {/* Private Ponds */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">7</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {language === 'en' ? 'Private Ponds' : 'खाजगी तलाव'}
                        </td>
                        {summary.map(item => (
                          <td key={item.village.id} className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.privatePonds || 0}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center font-bold text-blue-900 bg-blue-50">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.privatePonds || 0), 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Tap Connection Details */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    {language === 'en' ? 'Tap Connection Details' : 'नळ जोडणी माहिती'}
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-orange-50 to-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Sr. No.' : 'अ.क्र.'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Village' : 'गाव'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Families' : 'कुटुंबे'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Old Connections' : 'जुने नळ'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'New Connections' : 'नवीन नळ'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider bg-indigo-50">
                          {language === 'en' ? 'Total Connections' : 'एकूण नळ'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Private Wells' : 'खाजगी विहीर'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          {language === 'en' ? 'Pending' : 'प्रलंबित'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {summary.map((item, index) => (
                        <tr key={item.village.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {language === 'en' ? item.village.nameEn : item.village.nameMr}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.families || 0}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.oldTapConnections || 0}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.newTapConnections || 0}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-indigo-50">
                            {item.infrastructure.totalTapConnections || 0}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.privateWellsForTap || 0}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {item.infrastructure.pendingTapConnections || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-indigo-50">
                      <tr className="font-bold">
                        <td className="px-6 py-4" colSpan="2">
                          {language === 'en' ? 'Total' : 'एकूण'}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.families || 0), 0)}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.oldTapConnections || 0), 0)}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.newTapConnections || 0), 0)}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900 bg-indigo-100">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.totalTapConnections || 0), 0)}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.privateWellsForTap || 0), 0)}
                        </td>
                        <td className="px-6 py-4 text-center text-indigo-900">
                          {summary.reduce((sum, item) => sum + (item.infrastructure.pendingTapConnections || 0), 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VillageStatisticsPublic;

