import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, FileText, Building2 } from 'lucide-react';
import { Company } from '../types';
import { CompanyCard } from './CompanyCard';
import { exportToExcel, exportToCSV } from '../services/fileExport';

interface SearchResultsProps {
  companies: Company[];
  searchLocation: string;
  searchSkills: string[];
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  companies,
  searchLocation,
  searchSkills,
  isLoading = false,
}) => {
  const handleExportExcel = () => {
    exportToExcel(companies, `companies_${searchLocation.replace(/\s+/g, '_')}`);
  };

  const handleExportCSV = () => {
    exportToCSV(companies, `companies_${searchLocation.replace(/\s+/g, '_')}`);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-blue-600">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Searching for companies...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (companies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">
            Try expanding your search radius or selecting different skills.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Background with glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg"></div>
        
        <div className="relative z-10 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Found {companies.length} Companies
                  </h2>
                  <p className="text-gray-600">
                    in <span className="font-semibold text-blue-600">{searchLocation}</span> • 
                    {searchSkills.length} skills selected
                  </p>
                </div>
              </div>
              
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {searchSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
                {searchSkills.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    +{searchSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Export Excel</span>
              </motion.button>
              
              <motion.button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-5 h-5" />
                <span>Export CSV</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
                <div className="text-sm text-gray-600">Total Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {companies.filter(c => c.phone || c.email).length}
                </div>
                <div className="text-sm text-gray-600">With Contact Info</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {companies.filter(c => c.website).length}
                </div>
                <div className="text-sm text-gray-600">With Website</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(companies.map(c => c.address.split(',').pop()?.trim())).size}
                </div>
                <div className="text-sm text-gray-600">Unique Areas</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6"
      >
        {companies.map((company, index) => (
          <motion.div
            key={`${company.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index % 10) }}
          >
            <CompanyCard company={company} />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More / Pagination could go here */}
      {companies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>End of results • Showing all {companies.length} companies</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
