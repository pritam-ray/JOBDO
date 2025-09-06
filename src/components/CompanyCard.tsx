import React from 'react';
import { MapPin, Phone, Mail, Globe, Star, Clock, Camera } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1 mr-4">{company.name}</h3>
          {company.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700">{company.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {formatCategory(company.category)}
          </span>
          {company.businessStatus && (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBusinessStatusColor(company.businessStatus)}`}>
              {company.businessStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 text-sm leading-relaxed">{company.address}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          {company.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a 
                href={`tel:${company.phone}`}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                {company.phone}
              </a>
            </div>
          )}

          {company.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a 
                href={`mailto:${company.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                {company.email}
              </a>
            </div>
          )}

          {company.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium truncate"
              >
                {company.website}
              </a>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        {company.openingHours && company.openingHours.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Hours</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1 ml-6">
              {company.openingHours.slice(0, 3).map((hours, index) => (
                <div key={index}>{hours}</div>
              ))}
              {company.openingHours.length > 3 && (
                <div className="text-gray-500 italic">... and more</div>
              )}
            </div>
          </div>
        )}

        {/* Photos */}
        {company.photos && company.photos.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Photos</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {company.photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${company.name} - Photo ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Place ID: {company.placeId.slice(0, 15)}...</span>
          <span>{company.lat.toFixed(4)}, {company.lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};