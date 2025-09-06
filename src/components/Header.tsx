import React from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
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
            InternFinder
          </h1>
          
          <p className="text-xl sm:text-2xl font-light mb-6 text-blue-100">
            Discover Local Internship Opportunities
          </p>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-blue-50 leading-relaxed">
              Find companies in your area that match your skills and interests. 
              Get comprehensive contact information and export results for easy outreach.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Location-Based Search</h3>
              <p className="text-sm text-blue-100">Find companies within your preferred radius</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <Building2 className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Comprehensive Data</h3>
              <p className="text-sm text-blue-100">Get contact info, ratings, and business details</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <Search className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Export & Save</h3>
              <p className="text-sm text-blue-100">Download results in Excel or CSV format</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};