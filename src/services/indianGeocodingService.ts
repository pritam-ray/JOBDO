import { IndianLocationService } from './indianLocationService';

// Enhanced geocoding service specifically for Indian locations
export class IndianGeocodingService {
  
  // Get coordinates for any location, with enhanced Indian support
  static async getCoordinates(location: string): Promise<{ lat: number; lng: number } | null> {
    console.log(`🗺️ Getting coordinates for: ${location}`);
    
    try {
      // Check if this is an Indian location
      const isIndian = IndianLocationService.isIndianLocation(location);
      
      if (isIndian) {
        console.log('🇮🇳 Using Indian geocoding service...');
        return await this.getIndianCoordinates(location);
      } else {
        console.log('🌍 Using international geocoding service...');
        return await this.getInternationalCoordinates(location);
      }
      
    } catch (error) {
      console.error('❌ Geocoding failed:', error);
      return null;
    }
  }
  
  // Enhanced geocoding for Indian locations
  static async getIndianCoordinates(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // First try the Indian location service
      const coords = await IndianLocationService.getIndianCityCoordinates(location);
      if (coords) {
        return coords;
      }
      
      // Fallback to Nominatim with India-specific query
      const normalizedLocation = IndianLocationService.normalizeIndianLocation(location);
      return await this.geocodeWithNominatim(`${normalizedLocation}, India`);
      
    } catch (error) {
      console.warn('Indian geocoding failed:', error);
      return null;
    }
  }
  
  // Geocoding for international locations
  static async getInternationalCoordinates(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      return await this.geocodeWithNominatim(location);
    } catch (error) {
      console.warn('International geocoding failed:', error);
      return null;
    }
  }
  
  // Use Nominatim (OpenStreetMap) for geocoding
  static async geocodeWithNominatim(query: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'JobFinder-India/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Nominatim request failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const coordinates = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
        
        console.log(`📍 Geocoded ${query}: ${coordinates.lat}, ${coordinates.lng}`);
        return coordinates;
      }
      
      return null;
      
    } catch (error) {
      console.warn('Nominatim geocoding failed:', error);
      return null;
    }
  }
  
  // Reverse geocoding to get location from coordinates
  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'JobFinder-India/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const address = data.address;
        const city = address.city || address.town || address.village || address.county;
        const state = address.state;
        const country = address.country;
        
        if (city && state) {
          return `${city}, ${state}, ${country}`;
        } else if (city) {
          return `${city}, ${country}`;
        } else {
          return data.display_name;
        }
      }
      
      return null;
      
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return null;
    }
  }
  
  // Check if coordinates are within India
  static isInIndia(lat: number, lng: number): boolean {
    // Approximate bounds of India
    const minLat = 6.4;    // Southern tip
    const maxLat = 37.6;   // Northern border
    const minLng = 68.7;   // Western border
    const maxLng = 97.25;  // Eastern border
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  }
  
  // Get nearby Indian cities for expanded search
  static async getNearbyIndianCities(
    lat: number, 
    lng: number, 
    radiusKm: number = 100
  ): Promise<string[]> {
    const nearbyCities: string[] = [];
    
    try {
      // Use Overpass API to find nearby cities
      const query = `
        [out:json][timeout:25];
        (
          node["place"~"city|town"]["name"]["population"](around:${radiusKm * 1000},${lat},${lng});
          way["place"~"city|town"]["name"]["population"](around:${radiusKm * 1000},${lat},${lng});
        );
        out center meta;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.elements) {
          data.elements.forEach((element: any) => {
            const tags = element.tags || {};
            if (tags.name && tags.population) {
              const population = parseInt(tags.population);
              if (population > 50000) { // Only cities with reasonable population
                nearbyCities.push(tags.name);
              }
            }
          });
        }
      }
      
    } catch (error) {
      console.warn('Failed to get nearby cities:', error);
    }
    
    return nearbyCities.slice(0, 5); // Return top 5 nearby cities
  }
}
