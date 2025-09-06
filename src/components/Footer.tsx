import React from 'react';
import { Github, Mail, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Job-Do</h3>
            <p className="text-gray-300 leading-relaxed">
              Empowering job seekers across India to discover amazing career opportunities 
              through comprehensive job search and local business connections.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• India-focused job search</li>
              <li>• Skills-based filtering</li>
              <li>• Multiple job portals integration</li>
              <li>• Excel & CSV export</li>
              <li>• Location-based search</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@job-do.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>www.job-do.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>github.com/pritam-ray/JOBDO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> for job seekers in India
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Job-Do. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};