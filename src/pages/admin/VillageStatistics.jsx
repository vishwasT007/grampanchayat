import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, Calendar } from 'lucide-react';
import { getAllYears, addYear, getLatestYear } from '../../services/villageStatisticsService';
import VillageManagementTab from '../../components/admin/VillageStatistics/VillageManagementTab';
import DemographicsTab from '../../components/admin/VillageStatistics/DemographicsTab';
import CategoryPopulationTab from '../../components/admin/VillageStatistics/CategoryPopulationTab';
import GroupsTab from '../../components/admin/VillageStatistics/GroupsTab';
import InfrastructureTab from '../../components/admin/VillageStatistics/InfrastructureTab';
import ReportsTab from '../../components/admin/VillageStatistics/ReportsTab';

const TABS = [
  { id: 'villages', label: 'Manage Villages', labelMr: 'गावे व्यवस्थापित करा' },
  { id: 'demographics', label: 'Demographics', labelMr: 'लोकसंख्या' },
  { id: 'categories', label: 'Category-wise', labelMr: 'श्रेणीनुसार' },
  { id: 'groups', label: 'Groups & Committees', labelMr: 'गट आणि समित्या' },
  { id: 'infrastructure', label: 'Water & Infrastructure', labelMr: 'पाणी आणि पायाभूत सुविधा' },
  { id: 'reports', label: 'PDF / Reports', labelMr: 'PDF / अहवाल' }
];

const VillageStatistics = () => {
  const [activeTab, setActiveTab] = useState('villages');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    
    try {
      // Load years
      const allYears = await getAllYears();
      setYears(allYears);
      
      // Set initial selected year
      const latest = await getLatestYear();
      if (latest) {
        setSelectedYear(latest);
      } else if (allYears.length > 0) {
        setSelectedYear(allYears[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYear = async () => {
    const yearNum = parseInt(newYear);
    
    if (!yearNum || yearNum < 1900 || yearNum > 2100) {
      alert('Please enter a valid year between 1900 and 2100');
      return;
    }
    
    try {
      await addYear(yearNum);
      const allYears = await getAllYears();
      setYears(allYears);
      setSelectedYear(yearNum);
      setNewYear('');
      setShowAddYear(false);
    } catch (error) {
      alert(error.message || 'Failed to add year');
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const renderTabContent = () => {
    // Village Management tab doesn't need year selection
    if (activeTab === 'villages') {
      return <VillageManagementTab />;
    }

    if (!selectedYear) {
      return (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No year selected. Please add a year to get started.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'demographics':
        return <DemographicsTab selectedYear={selectedYear} />;
      case 'categories':
        return <CategoryPopulationTab selectedYear={selectedYear} />;
      case 'groups':
        return <GroupsTab selectedYear={selectedYear} />;
      case 'infrastructure':
        return <InfrastructureTab selectedYear={selectedYear} />;
      case 'reports':
        return <ReportsTab selectedYear={selectedYear} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Village Statistics</h1>
              <p className="text-sm text-orange-100">ग्राम सांख्यिकी</p>
            </div>
          </div>
          <p className="text-sm text-white/90 mt-2">
            Manage census data, population breakdowns, groups, and infrastructure year-wise
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Year / वर्ष निवडा
              </label>
              <select
                value={selectedYear || ''}
                onChange={handleYearChange}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {years.length === 0 ? (
                  <option value="">No years available</option>
                ) : (
                  years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              {!showAddYear ? (
                <button
                  onClick={() => setShowAddYear(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Year
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Enter year (e.g., 2025)"
                    className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddYear()}
                  />
                  <button
                    onClick={handleAddYear}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddYear(false);
                      setNewYear('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{tab.labelMr}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageStatistics;
