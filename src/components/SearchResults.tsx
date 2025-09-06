import React from 'react';
import { Download, FileSpreadsheet, FileText, Building2 } from 'lucide-react';
import { Company } from '../types';
import { CompanyCard } from './CompanyCard';
import { exportToExcel, exportToCSV, generateFileName } from '../services/fileExport';

interface SearchResultsProps {
  companies: Company[];
  searchLocation: string;
  searchSkills: string[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  companies, 
  searchLocation, 
  searchSkills,
  isLoading 
}) => {
  const handleExportExcel = () => {
    const filename = generateFileName(searchLocation, searchSkills);
    exportToExcel(companies, filename);
  };

  const handleExportCSV = () => {
    const filename = generateFileName(searchLocation, searchSkills);
    exportToCSV(companies, filename);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg text-gray-600">Searching for companies...</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try expanding your search radius or selecting different skills. Some areas may have limited business listings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Found {companies.length} Companies
            </h2>
            <p className="text-gray-600">
              Results for <span className="font-medium">{searchLocation}</span> • 
              Skills: <span className="font-medium">{searchSkills.join(', ')}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{companies.length}</div>
          <div className="text-gray-600">Total Companies</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-teal-600 mb-1">
            {companies.filter(c => c.phone).length}
          </div>
          <div className="text-gray-600">With Phone Numbers</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {companies.filter(c => c.website).length}
          </div>
          <div className="text-gray-600">With Websites</div>
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {/* Download Reminder */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 text-center">
        <Download className="w-8 h-8 text-blue-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Export Your Results
        </h3>
        <p className="text-gray-600 mb-4">
          Download the complete list with contact information for easy reference
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Download Excel File
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            Download CSV File
          </button>
        </div>
      </div>
    </div>
  );
};