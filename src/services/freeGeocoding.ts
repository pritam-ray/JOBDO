// Free geocoding service using enhanced Indian support
import { IndianGeocodingService } from './indianGeocodingService';

export interface Coordinates {
  lat: number;
  lng: number;
}

export const geocodeLocation = async (location: string): Promise<Coordinates> => {
  try {
    console.log('🗺️ Geocoding location:', location);
    
    // Use the enhanced Indian geocoding service
    const coordinates = await IndianGeocodingService.getCoordinates(location);
    
    if (coordinates) {
      console.log('✅ Geocoding successful:', coordinates);
      return coordinates;
    }
    
    throw new Error('Location not found. Please try a more specific address.');
    
  } catch (error) {
    console.error('❌ Geocoding failed:', error);
    throw new Error('Failed to find location. Please check your internet connection and try again.');
  }
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Failed to get current location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    console.log(`🔄 Reverse geocoding: ${lat}, ${lng}`);
    
    // Use the enhanced Indian geocoding service for reverse geocoding
    const location = await IndianGeocodingService.reverseGeocode(lat, lng);
    
    if (location) {
      console.log('✅ Reverse geocoding successful:', location);
      return location;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    
  } catch (error) {
    console.error('❌ Reverse geocoding failed:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};