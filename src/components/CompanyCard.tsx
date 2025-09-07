import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Star, Clock, Camera, Building2, ExternalLink } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getBusinessStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'closed_temporarily':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed_permanently':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl"></div>
      
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {company.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                    {formatCategory(company.category)}
                  </span>
                  {company.businessStatus && (
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getBusinessStatusColor(company.businessStatus)}`}>
                      {company.businessStatus.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {company.rating && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-xl border border-yellow-200 shadow-sm"
            >
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-700">{company.rating}</span>
            </motion.div>
          )}
        </div>

        {/* Address Section */}
        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed font-medium">{company.address}</p>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid gap-3 mb-6">
          {company.phone && (
            <motion.a
              href={`tel:${company.phone}`}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-700 font-medium group-hover:text-green-800">
                {company.phone}
              </span>
              <ExternalLink className="w-4 h-4 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )}

          {company.email && (
            <motion.a
              href={`mailto:${company.email}`}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-700 font-medium group-hover:text-blue-800 truncate">
                {company.email}
              </span>
              <ExternalLink className="w-4 h-4 text-blue-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )}

          {company.website && (
            <motion.a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-purple-700 font-medium group-hover:text-purple-800 truncate">
                {company.website}
              </span>
              <ExternalLink className="w-4 h-4 text-purple-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )}
        </div>

        {/* Opening Hours */}
        {company.openingHours && company.openingHours.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-800">Business Hours</span>
            </div>
            <div className="text-xs text-amber-700 space-y-1 ml-8">
              {company.openingHours.slice(0, 3).map((hours, index) => (
                <div key={index} className="font-medium">{hours}</div>
              ))}
              {company.openingHours.length > 3 && (
                <div className="text-amber-600 italic">+{company.openingHours.length - 3} more days</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Photos Gallery */}
        {company.photos && company.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Photos</span>
              <span className="text-xs text-gray-500">({company.photos.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {company.photos.slice(0, 4).map((photo, index) => (
                <motion.img
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  src={photo}
                  alt={`${company.name} - Photo ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border-2 border-white shadow-md hover:shadow-lg transition-shadow"
                  loading="lazy"
                />
              ))}
              {company.photos.length > 4 && (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 font-medium border-2 border-white">
                  +{company.photos.length - 4}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>ID: {company.placeId.slice(0, 12)}...</span>
            </div>
            <div className="text-gray-400 font-mono">
              {company.lat.toFixed(4)}, {company.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};