import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Building2, Plus, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const isAddCompanyPage = location.pathname === '/add-company';

  return (
    <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
            <Building2 className="w-6 h-6" />
            <span className="text-xl font-bold">Job-Do</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                !isAddCompanyPage 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Search Jobs</span>
            </Link>
            
            <Link
              to="/add-company"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAddCompanyPage 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Header Content - Only show on homepage */}
      {!isAddCompanyPage && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <Building2 className="w-12 h-12" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Search className="w-5 h-5 text-yellow-900" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Job-Do
            </h1>
            
            <p className="text-xl sm:text-2xl font-light mb-6 text-blue-100">
              Discover Job & Internship Opportunities Across India
            </p>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-blue-50 leading-relaxed">
                Find real companies across India that match your skills and interests. 
                Get comprehensive contact information from 24+ sources and export results for easy outreach.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">India-Wide Search</h3>
                <p className="text-sm text-blue-100">Find companies across all Indian cities and tech hubs</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <Building2 className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Real Company Data</h3>
                <p className="text-sm text-blue-100">Get contact info from 24+ sources with zero mock data</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <Search className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Smart Job Search</h3>
                <p className="text-sm text-blue-100">AI-powered matching with Indian job portals & directories</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simplified header for Add Company page */}
      {isAddCompanyPage && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Add a Company</h2>
            <p className="text-blue-100 mt-2">Help job seekers discover great companies in India</p>
          </div>
        </div>
      )}
    </header>
  );
};