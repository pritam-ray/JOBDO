import React from 'react';
import { Github, Mail, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">InternFinder</h3>
            <p className="text-gray-300 leading-relaxed">
              Helping students and job seekers discover local internship opportunities 
              by connecting them with companies in their area.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Location-based company search</li>
              <li>• Skills-based filtering</li>
              <li>• Comprehensive company data</li>
              <li>• Excel & CSV export</li>
              <li>• Google Maps integration</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@internfinder.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>www.internfinder.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>github.com/internfinder</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> for aspiring interns
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 InternFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};