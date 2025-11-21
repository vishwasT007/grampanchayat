// Village Statistics Data Layer - localStorage based
// This replaces Firebase Firestore with localStorage for consistency with the existing project

// ===========================
// STORAGE KEYS
// ===========================
const STORAGE_KEYS = {
  VILLAGES: 'VILLAGES',
  VILLAGE_DEMOGRAPHICS: 'VILLAGE_DEMOGRAPHICS',
  VILLAGE_POPULATION_BREAKDOWNS: 'VILLAGE_POPULATION_BREAKDOWNS',
  VILLAGE_GROUPS: 'VILLAGE_GROUPS',
  VILLAGE_INFRASTRUCTURE: 'VILLAGE_INFRASTRUCTURE',
  STATISTICS_YEARS: 'STATISTICS_YEARS',
  REPORTS: 'REPORTS'
};

// ===========================
// HELPER FUNCTIONS
// ===========================

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get current timestamp
const getTimestamp = () => new Date().toISOString();

// ===========================
// VILLAGES CRUD
// ===========================

export const getAllVillages = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VILLAGES);
  return data ? JSON.parse(data) : [];
};

export const getVillageById = (id) => {
  const villages = getAllVillages();
  return villages.find(v => v.id === id);
};

export const createVillage = (villageData) => {
  const villages = getAllVillages();
  const newVillage = {
    id: generateId(),
    gramPanchayatId: 'default', // can be made dynamic later
    nameEn: villageData.nameEn,
    nameMr: villageData.nameMr,
    code: villageData.code || '',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  };
  villages.push(newVillage);
  localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(villages));
  return newVillage;
};

export const updateVillage = (id, updates) => {
  const villages = getAllVillages();
  const index = villages.findIndex(v => v.id === id);
  if (index !== -1) {
    villages[index] = {
      ...villages[index],
      ...updates,
      updatedAt: getTimestamp()
    };
    localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(villages));
    return villages[index];
  }
  return null;
};

export const deleteVillage = (id) => {
  const villages = getAllVillages();
  const filtered = villages.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(filtered));
};

// Initialize default villages if none exist
export const initializeDefaultVillages = () => {
  const existing = getAllVillages();
  if (existing.length === 0) {
    // Don't create default villages - let admin add them manually
    // This makes the system fully dynamic
    console.log('No villages found. Admin can add villages from the Village Management tab.');
  }
};

// ===========================
// DEMOGRAPHICS CRUD
// ===========================

export const getAllDemographics = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VILLAGE_DEMOGRAPHICS);
  return data ? JSON.parse(data) : [];
};

export const getDemographicsByVillageAndYear = (villageId, year) => {
  const demographics = getAllDemographics();
  return demographics.find(d => d.villageId === villageId && d.year === parseInt(year));
};

export const getDemographicsByYear = (year) => {
  const demographics = getAllDemographics();
  return demographics.filter(d => d.year === parseInt(year));
};

export const upsertDemographics = (demographicsData) => {
  const demographics = getAllDemographics();
  const { villageId, year } = demographicsData;
  
  // Check if record exists
  const existingIndex = demographics.findIndex(
    d => d.villageId === villageId && d.year === parseInt(year)
  );

  if (existingIndex !== -1) {
    // Update existing
    demographics[existingIndex] = {
      ...demographics[existingIndex],
      ...demographicsData,
      updatedAt: getTimestamp()
    };
  } else {
    // Create new
    const newRecord = {
      id: generateId(),
      villageId,
      year: parseInt(year),
      totalPopulation: demographicsData.totalPopulation || 0,
      malePopulation: demographicsData.malePopulation || 0,
      femalePopulation: demographicsData.femalePopulation || 0,
      source: demographicsData.source || '',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    demographics.push(newRecord);
  }

  localStorage.setItem(STORAGE_KEYS.VILLAGE_DEMOGRAPHICS, JSON.stringify(demographics));
};

export const bulkUpsertDemographics = (demographicsArray) => {
  demographicsArray.forEach(data => upsertDemographics(data));
};

// ===========================
// POPULATION BREAKDOWNS CRUD
// ===========================

export const getAllPopulationBreakdowns = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VILLAGE_POPULATION_BREAKDOWNS);
  return data ? JSON.parse(data) : [];
};

export const getBreakdownsByVillageAndYear = (villageId, year) => {
  const breakdowns = getAllPopulationBreakdowns();
  return breakdowns.filter(b => b.villageId === villageId && b.year === parseInt(year));
};

export const getBreakdownsByYear = (year) => {
  const breakdowns = getAllPopulationBreakdowns();
  return breakdowns.filter(b => b.year === parseInt(year));
};

export const upsertPopulationBreakdown = (breakdownData) => {
  const breakdowns = getAllPopulationBreakdowns();
  const { villageId, year, category } = breakdownData;
  
  const existingIndex = breakdowns.findIndex(
    b => b.villageId === villageId && 
         b.year === parseInt(year) && 
         b.category === category
  );

  const totalCount = (breakdownData.maleCount || 0) + (breakdownData.femaleCount || 0);

  if (existingIndex !== -1) {
    breakdowns[existingIndex] = {
      ...breakdowns[existingIndex],
      ...breakdownData,
      totalCount,
      updatedAt: getTimestamp()
    };
  } else {
    const newRecord = {
      id: generateId(),
      villageId,
      year: parseInt(year),
      category,
      maleCount: breakdownData.maleCount || 0,
      femaleCount: breakdownData.femaleCount || 0,
      totalCount,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    breakdowns.push(newRecord);
  }

  localStorage.setItem(STORAGE_KEYS.VILLAGE_POPULATION_BREAKDOWNS, JSON.stringify(breakdowns));
};

export const bulkUpsertPopulationBreakdowns = (breakdownsArray) => {
  breakdownsArray.forEach(data => upsertPopulationBreakdown(data));
};

// ===========================
// VILLAGE GROUPS CRUD
// ===========================

export const getAllVillageGroups = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VILLAGE_GROUPS);
  return data ? JSON.parse(data) : [];
};

export const getGroupsByVillageAndYear = (villageId, year) => {
  const groups = getAllVillageGroups();
  return groups.find(g => g.villageId === villageId && g.year === parseInt(year));
};

export const getGroupsByYear = (year) => {
  const groups = getAllVillageGroups();
  return groups.filter(g => g.year === parseInt(year));
};

export const upsertVillageGroups = (groupsData) => {
  const groups = getAllVillageGroups();
  const { villageId, year } = groupsData;
  
  const existingIndex = groups.findIndex(
    g => g.villageId === villageId && g.year === parseInt(year)
  );

  if (existingIndex !== -1) {
    groups[existingIndex] = {
      ...groups[existingIndex],
      ...groupsData,
      updatedAt: getTimestamp()
    };
  } else {
    const newRecord = {
      id: generateId(),
      villageId,
      year: parseInt(year),
      mahilaBachatGatCount: groupsData.mahilaBachatGatCount || 0,
      yuvakMandalCount: groupsData.yuvakMandalCount || 0,
      kisanGatCount: groupsData.kisanGatCount || 0,
      otherGroupCount: groupsData.otherGroupCount || 0,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    groups.push(newRecord);
  }

  localStorage.setItem(STORAGE_KEYS.VILLAGE_GROUPS, JSON.stringify(groups));
};

export const bulkUpsertVillageGroups = (groupsArray) => {
  groupsArray.forEach(data => upsertVillageGroups(data));
};

// ===========================
// VILLAGE INFRASTRUCTURE CRUD
// ===========================

export const getAllVillageInfrastructure = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VILLAGE_INFRASTRUCTURE);
  return data ? JSON.parse(data) : [];
};

export const getInfrastructureByVillageAndYear = (villageId, year) => {
  const infrastructure = getAllVillageInfrastructure();
  return infrastructure.find(i => i.villageId === villageId && i.year === parseInt(year));
};

export const getInfrastructureByYear = (year) => {
  const infrastructure = getAllVillageInfrastructure();
  return infrastructure.filter(i => i.year === parseInt(year));
};

export const upsertVillageInfrastructure = (infrastructureData) => {
  const infrastructure = getAllVillageInfrastructure();
  const { villageId, year } = infrastructureData;
  
  const existingIndex = infrastructure.findIndex(
    i => i.villageId === villageId && i.year === parseInt(year)
  );

  if (existingIndex !== -1) {
    infrastructure[existingIndex] = {
      ...infrastructure[existingIndex],
      ...infrastructureData,
      updatedAt: getTimestamp()
    };
  } else {
    const newRecord = {
      id: generateId(),
      villageId,
      year: parseInt(year),
      wellsCount: infrastructureData.wellsCount || 0,
      borewellsCount: infrastructureData.borewellsCount || 0,
      handpumpsCount: infrastructureData.handpumpsCount || 0,
      tapConnectionsCount: infrastructureData.tapConnectionsCount || 0,
      notes: infrastructureData.notes || '',
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    infrastructure.push(newRecord);
  }

  localStorage.setItem(STORAGE_KEYS.VILLAGE_INFRASTRUCTURE, JSON.stringify(infrastructure));
};

export const bulkUpsertVillageInfrastructure = (infrastructureArray) => {
  infrastructureArray.forEach(data => upsertVillageInfrastructure(data));
};

// ===========================
// YEARS MANAGEMENT
// ===========================

export const getAllYears = () => {
  const data = localStorage.getItem(STORAGE_KEYS.STATISTICS_YEARS);
  return data ? JSON.parse(data) : [];
};

export const addYear = (year) => {
  const years = getAllYears();
  const yearNum = parseInt(year);
  if (!years.includes(yearNum)) {
    years.push(yearNum);
    years.sort((a, b) => b - a); // Sort descending (newest first)
    localStorage.setItem(STORAGE_KEYS.STATISTICS_YEARS, JSON.stringify(years));
  }
};

export const getLatestYear = () => {
  const years = getAllYears();
  return years.length > 0 ? years[0] : null;
};

export const initializeDefaultYears = () => {
  const existing = getAllYears();
  if (existing.length === 0) {
    const defaultYears = [2025, 2020, 2015, 2011];
    localStorage.setItem(STORAGE_KEYS.STATISTICS_YEARS, JSON.stringify(defaultYears));
  }
};

// ===========================
// REPORTS (PDF Snapshots)
// ===========================

export const getAllReports = () => {
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  return data ? JSON.parse(data) : [];
};

export const getReportsByYear = (year) => {
  const reports = getAllReports();
  return reports.filter(r => r.year === parseInt(year));
};

export const createReport = (reportData) => {
  const reports = getAllReports();
  const newReport = {
    id: generateId(),
    gramPanchayatId: 'default',
    year: parseInt(reportData.year),
    title: reportData.title,
    description: reportData.description || '',
    type: reportData.type || 'FULL',
    fileUrl: reportData.fileUrl || '',
    createdAt: getTimestamp(),
    updatedAt: getTimestamp()
  };
  reports.push(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  return newReport;
};

// ===========================
// STATISTICS SUMMARY
// ===========================

export const getStatisticsSummaryByYear = (year) => {
  const villages = getAllVillages();
  const demographics = getDemographicsByYear(year);
  const breakdowns = getBreakdownsByYear(year);
  const groups = getGroupsByYear(year);
  const infrastructure = getInfrastructureByYear(year);

  return villages.map(village => {
    const demo = demographics.find(d => d.villageId === village.id) || {};
    const villageBreakdowns = breakdowns.filter(b => b.villageId === village.id);
    const villageGroups = groups.find(g => g.villageId === village.id) || {};
    const villageInfra = infrastructure.find(i => i.villageId === village.id) || {};

    return {
      village,
      demographics: demo,
      breakdowns: villageBreakdowns,
      groups: villageGroups,
      infrastructure: villageInfra
    };
  });
};

// ===========================
// INITIALIZATION
// ===========================

export const initializeVillageStatistics = () => {
  initializeDefaultVillages();
  initializeDefaultYears();
};
