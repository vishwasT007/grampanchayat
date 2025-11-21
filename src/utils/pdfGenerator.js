import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getStatisticsSummaryByYear } from '../services/villageStatisticsService';

// Generate PDF report for village statistics
export const generateVillageStatisticsPDF = async (year, options = {}) => {
  const {
    orientation = 'landscape',
    title = 'Village Statistics Report',
    gramPanchayatName = 'Gram Panchayat'
  } = options;

  // Get data for the year from Firebase
  const summary = await getStatisticsSummaryByYear(year);

  if (summary.length === 0) {
    throw new Error(`No data available for year ${year}`);
  }

  // Create PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add page headers
  const addPageHeader = () => {
    // Indian Flag Colors Header
    doc.setFillColor(255, 107, 0); // Saffron
    doc.rect(0, 0, pageWidth, 3, 'F');
    doc.setFillColor(255, 255, 255); // White
    doc.rect(0, 3, pageWidth, 3, 'F');
    doc.setFillColor(19, 136, 8); // Green
    doc.rect(0, 6, pageWidth, 3, 'F');

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(gramPanchayatName, pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Year: ${year}`, pageWidth / 2, 31, { align: 'center' });

    return 38;
  };

  // Add first page header
  yPosition = addPageHeader();

  // Section 1: Population Demographics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text('1. Population Demographics', 14, yPosition);
  yPosition += 8;

  const demographicsData = summary.map(item => [
    item.village.nameEn || '-',
    (item.demographics.totalPopulation || 0).toLocaleString(),
    (item.demographics.malePopulation || 0).toLocaleString(),
    (item.demographics.femalePopulation || 0).toLocaleString(),
    item.demographics.source || '-'
  ]);

  // Calculate totals
  const totalPop = summary.reduce((sum, item) => sum + (item.demographics.totalPopulation || 0), 0);
  const totalMale = summary.reduce((sum, item) => sum + (item.demographics.malePopulation || 0), 0);
  const totalFemale = summary.reduce((sum, item) => sum + (item.demographics.femalePopulation || 0), 0);

  demographicsData.push(['TOTAL', totalPop.toLocaleString(), totalMale.toLocaleString(), totalFemale.toLocaleString(), '']);

  doc.autoTable({
    startY: yPosition,
    head: [['Village', 'Total Population', 'Male', 'Female', 'Source']],
    body: demographicsData,
    theme: 'grid',
    headStyles: { fillColor: [255, 107, 0], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [252, 248, 245] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Check if new page needed
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = addPageHeader();
  }

  // Section 2: Category-wise Population
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text('2. Category-wise Population Breakdown', 14, yPosition);
  yPosition += 8;

  const categoryData = [];
  summary.forEach(item => {
    const st = item.breakdowns.find(b => b.category === 'ST') || {};
    const sc = item.breakdowns.find(b => b.category === 'SC') || {};
    const obc = item.breakdowns.find(b => b.category === 'OBC') || {};
    const other = item.breakdowns.find(b => b.category === 'OTHER') || {};

    categoryData.push([
      item.village.nameEn || '-',
      (st.maleCount || 0).toLocaleString(),
      (st.femaleCount || 0).toLocaleString(),
      ((st.maleCount || 0) + (st.femaleCount || 0)).toLocaleString(),
      (sc.maleCount || 0).toLocaleString(),
      (sc.femaleCount || 0).toLocaleString(),
      ((sc.maleCount || 0) + (sc.femaleCount || 0)).toLocaleString(),
      (obc.maleCount || 0).toLocaleString(),
      (obc.femaleCount || 0).toLocaleString(),
      ((obc.maleCount || 0) + (obc.femaleCount || 0)).toLocaleString(),
      (other.maleCount || 0).toLocaleString(),
      (other.femaleCount || 0).toLocaleString(),
      ((other.maleCount || 0) + (other.femaleCount || 0)).toLocaleString()
    ]);
  });

  // Calculate category totals
  const stTotal = { male: 0, female: 0 };
  const scTotal = { male: 0, female: 0 };
  const obcTotal = { male: 0, female: 0 };
  const otherTotal = { male: 0, female: 0 };

  summary.forEach(item => {
    item.breakdowns.forEach(b => {
      if (b.category === 'ST') {
        stTotal.male += b.maleCount || 0;
        stTotal.female += b.femaleCount || 0;
      } else if (b.category === 'SC') {
        scTotal.male += b.maleCount || 0;
        scTotal.female += b.femaleCount || 0;
      } else if (b.category === 'OBC') {
        obcTotal.male += b.maleCount || 0;
        obcTotal.female += b.femaleCount || 0;
      } else if (b.category === 'OTHER') {
        otherTotal.male += b.maleCount || 0;
        otherTotal.female += b.femaleCount || 0;
      }
    });
  });

  categoryData.push([
    'TOTAL',
    stTotal.male.toLocaleString(),
    stTotal.female.toLocaleString(),
    (stTotal.male + stTotal.female).toLocaleString(),
    scTotal.male.toLocaleString(),
    scTotal.female.toLocaleString(),
    (scTotal.male + scTotal.female).toLocaleString(),
    obcTotal.male.toLocaleString(),
    obcTotal.female.toLocaleString(),
    (obcTotal.male + obcTotal.female).toLocaleString(),
    otherTotal.male.toLocaleString(),
    otherTotal.female.toLocaleString(),
    (otherTotal.male + otherTotal.female).toLocaleString()
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [[
      'Village',
      { content: 'ST', colSpan: 3 },
      { content: 'SC', colSpan: 3 },
      { content: 'OBC', colSpan: 3 },
      { content: 'OTHER', colSpan: 3 }
    ], [
      '',
      'M', 'F', 'T',
      'M', 'F', 'T',
      'M', 'F', 'T',
      'M', 'F', 'T'
    ]],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: [255, 107, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [252, 248, 245] },
    styles: { fontSize: 7, cellPadding: 2 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Check if new page needed
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = addPageHeader();
  }

  // Section 3: Groups & Committees
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text('3. Groups & Committees', 14, yPosition);
  yPosition += 8;

  const groupsData = summary.map(item => [
    item.village.nameEn || '-',
    (item.groups.mahilaBachatGatCount || 0).toString(),
    (item.groups.yuvakMandalCount || 0).toString(),
    (item.groups.kisanGatCount || 0).toString(),
    (item.groups.otherGroupCount || 0).toString(),
    ((item.groups.mahilaBachatGatCount || 0) + (item.groups.yuvakMandalCount || 0) + 
     (item.groups.kisanGatCount || 0) + (item.groups.otherGroupCount || 0)).toString()
  ]);

  const groupTotals = summary.reduce((totals, item) => ({
    mbg: totals.mbg + (item.groups.mahilaBachatGatCount || 0),
    ym: totals.ym + (item.groups.yuvakMandalCount || 0),
    kg: totals.kg + (item.groups.kisanGatCount || 0),
    og: totals.og + (item.groups.otherGroupCount || 0)
  }), { mbg: 0, ym: 0, kg: 0, og: 0 });

  groupsData.push([
    'TOTAL',
    groupTotals.mbg.toString(),
    groupTotals.ym.toString(),
    groupTotals.kg.toString(),
    groupTotals.og.toString(),
    (groupTotals.mbg + groupTotals.ym + groupTotals.kg + groupTotals.og).toString()
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Village', 'Mahila Bachat Gat', 'Yuvak Mandal', 'Kisan Gat', 'Other Groups', 'Total']],
    body: groupsData,
    theme: 'grid',
    headStyles: { fillColor: [255, 107, 0], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [252, 248, 245] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Check if new page needed
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = addPageHeader();
  }

  // Section 4: Water & Infrastructure
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text('4. Water & Infrastructure', 14, yPosition);
  yPosition += 8;

  const infraData = summary.map(item => [
    item.village.nameEn || '-',
    (item.infrastructure.wellsCount || 0).toString(),
    (item.infrastructure.borewellsCount || 0).toString(),
    (item.infrastructure.handpumpsCount || 0).toString(),
    (item.infrastructure.tapConnectionsCount || 0).toString(),
    ((item.infrastructure.wellsCount || 0) + (item.infrastructure.borewellsCount || 0) + 
     (item.infrastructure.handpumpsCount || 0) + (item.infrastructure.tapConnectionsCount || 0)).toString()
  ]);

  const infraTotals = summary.reduce((totals, item) => ({
    wells: totals.wells + (item.infrastructure.wellsCount || 0),
    bore: totals.bore + (item.infrastructure.borewellsCount || 0),
    hand: totals.hand + (item.infrastructure.handpumpsCount || 0),
    tap: totals.tap + (item.infrastructure.tapConnectionsCount || 0)
  }), { wells: 0, bore: 0, hand: 0, tap: 0 });

  infraData.push([
    'TOTAL',
    infraTotals.wells.toString(),
    infraTotals.bore.toString(),
    infraTotals.hand.toString(),
    infraTotals.tap.toString(),
    (infraTotals.wells + infraTotals.bore + infraTotals.hand + infraTotals.tap).toString()
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Village', 'Wells', 'Borewells', 'Handpumps', 'Tap Connections', 'Total']],
    body: infraData,
    theme: 'grid',
    headStyles: { fillColor: [255, 107, 0], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [252, 248, 245] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // Footer on last page
  const currentDate = new Date().toLocaleDateString('en-IN');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${currentDate}`, 14, pageHeight - 10);
  doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - 30, pageHeight - 10);

  return doc;
};

// Preview PDF in new window
export const previewPDF = async (year, options = {}) => {
  const doc = await generateVillageStatisticsPDF(year, options);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

// Download PDF
export const downloadPDF = async (year, options = {}) => {
  const doc = await generateVillageStatisticsPDF(year, options);
  const fileName = `Village_Statistics_${year}_${Date.now()}.pdf`;
  doc.save(fileName);
};
