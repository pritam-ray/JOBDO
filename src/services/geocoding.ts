import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.warn('Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
}

let googleMapsLoader: Loader | null = null;

const getGoogleMapsLoader = () => {
  if (!googleMapsLoader) {
    googleMapsLoader = new Loader({
      apiKey: API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }
  return googleMapsLoader;
};

export const geocodeLocation = async (location: string): Promise<{ lat: number; lng: number }> => {
  if (!API_KEY) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    const loader = getGoogleMapsLoader();
    const google = await loader.load();
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode location. Please check your internet connection and try again.');
  }
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
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