import React, { useState } from 'react';
import { FileText, Download, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { previewPDF, downloadPDF } from '../../../utils/pdfGenerator';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

const ReportsTab = ({ selectedYear }) => {
  const { settings } = useSiteSettings();
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePreview = async () => {
    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const options = {
        title: 'Village Statistics Report',
        gramPanchayatName: settings?.title?.en || 'Gram Panchayat',
        orientation: 'landscape'
      };

      await previewPDF(selectedYear, options);
      
      setMessage({ 
        type: 'success', 
        text: 'PDF opened in new tab successfully!' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to generate PDF. Please ensure data is available for the selected year.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const options = {
        title: 'Village Statistics Report',
        gramPanchayatName: settings?.title?.en || 'Gram Panchayat',
        orientation: 'landscape'
      };

      await downloadPDF(selectedYear, options);
      
      setMessage({ 
        type: 'success', 
        text: `PDF for year ${selectedYear} downloaded successfully!` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to generate PDF. Please ensure data is available for the selected year.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          PDF Reports & Downloads - {selectedYear}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Generate comprehensive PDF reports with all village statistics
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Report Info Card */}
      <div className="bg-gradient-to-br from-orange-50 to-green-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Comprehensive Village Statistics Report
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              This PDF report includes all village statistics data for year <strong>{selectedYear}</strong>:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span><strong>Population Demographics:</strong> Total, Male, Female population per village</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span><strong>Category-wise Breakdown:</strong> ST, SC, OBC, Other population distribution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span><strong>Groups & Committees:</strong> Mahila Bachat Gat, Yuvak Mandal, Kisan Gat counts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span><strong>Water & Infrastructure:</strong> Wells, Borewells, Handpumps, Tap Connections</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preview Button */}
        <button
          onClick={handlePreview}
          disabled={generating}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          <Eye className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Preview PDF</div>
            <div className="text-xs text-blue-100">Open in new tab</div>
          </div>
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          <Download className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Download PDF</div>
            <div className="text-xs text-green-100">Save to computer</div>
          </div>
        </button>
      </div>

      {/* Loading Indicator */}
      {generating && (
        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 font-medium">Generating PDF report...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          Instructions
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">1.</span>
            <span>Ensure all data tabs (Demographics, Category-wise, Groups, Infrastructure) are filled with accurate data for year {selectedYear}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">2.</span>
            <span>Click <strong>"Preview PDF"</strong> to review the report in a new browser tab before downloading.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">3.</span>
            <span>Click <strong>"Download PDF"</strong> to save the report to your computer.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">4.</span>
            <span>The PDF will include all villages with their complete statistics in a government-standard format.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">5.</span>
            <span>If no data is available for the selected year, you'll receive an error message. Please add data first.</span>
          </li>
        </ul>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h5 className="font-semibold text-gray-800">Professional Format</h5>
          </div>
          <p className="text-sm text-gray-600">
            Government-standard layout with Indian flag colors and proper tables
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h5 className="font-semibold text-gray-800">Comprehensive Data</h5>
          </div>
          <p className="text-sm text-gray-600">
            All statistics sections included with totals and subtotals
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h5 className="font-semibold text-gray-800">Easy Sharing</h5>
          </div>
          <p className="text-sm text-gray-600">
            Download and share with officials, stakeholders, or publish online
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
