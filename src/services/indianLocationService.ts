// Indian location detection and geocoding service
export class IndianLocationService {
  
  // Comprehensive list of Indian cities, states, and regions
  static readonly INDIAN_CITIES = [
    // Tier 1 cities
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    
    // Tier 2 cities
    'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi',
    'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi',
    'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
    'Raipur', 'Kota', 'Gurgaon', 'Gurugram', 'Noida', 'Chandigarh', 'Mysore', 'Mysuru',
    
    // IT/Tech hubs
    'Electronic City', 'Whitefield', 'Koramangala', 'HSR Layout', 'Marathahalli',
    'Bandra Kurla Complex', 'Powai', 'Andheri', 'Lower Parel', 'Worli',
    'Cyber City', 'DLF Phase', 'Sector', 'Hinjewadi', 'Magarpatta', 'Kharadi',
    'HITEC City', 'Madhapur', 'Gachibowli', 'Kondapur', 'Miyapur',
    'Thoraipakkam', 'Sholinganallur', 'OMR', 'Perungudi', 'Taramani',
    'Salt Lake', 'Rajarhat', 'New Town', 'Sector V'
  ];
  
  static readonly INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli', 'Daman and Diu',
    'Lakshadweep', 'Jammu and Kashmir', 'Ladakh'
  ];
  
  // Detect if a location is in India
  static isIndianLocation(location: string): boolean {
    if (!location) return false;
    
    const locationLower = location.toLowerCase();
    
    // Check if explicitly mentions India
    if (locationLower.includes('india') || locationLower.includes('bharath') || locationLower.includes('bharat')) {
      return true;
    }
    
    // Check if matches any Indian city
    return this.INDIAN_CITIES.some(city => 
      locationLower.includes(city.toLowerCase())
    ) || this.INDIAN_STATES.some(state => 
      locationLower.includes(state.toLowerCase())
    );
  }
  
  // Normalize Indian location names
  static normalizeIndianLocation(location: string): string {
    if (!location) return location;
    
    const normalizations: { [key: string]: string } = {
      'bengaluru': 'Bangalore',
      'kolkatta': 'Kolkata',
      'mumbai': 'Mumbai',
      'delhi': 'Delhi',
      'new delhi': 'Delhi',
      'gurgaon': 'Gurugram',
      'mysore': 'Mysuru',
      'allahabad': 'Prayagraj',
      'bombay': 'Mumbai',
      'calcutta': 'Kolkata',
      'madras': 'Chennai',
      'poona': 'Pune'
    };
    
    const locationLower = location.toLowerCase();
    for (const [old, newName] of Object.entries(normalizations)) {
      if (locationLower.includes(old)) {
        return location.replace(new RegExp(old, 'gi'), newName);
      }
    }
    
    return location;
  }
  
  // Get coordinates for Indian cities using free geocoding
  static async getIndianCityCoordinates(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const normalizedLocation = this.normalizeIndianLocation(location);
      
      // Use Nominatim (free OpenStreetMap geocoding)
      const query = `${normalizedLocation}, India`;
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`;
      
      console.log(`🗺️ Geocoding: ${query}`);
      
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
        
        console.log(`📍 Found coordinates for ${query}: ${coordinates.lat}, ${coordinates.lng}`);
        return coordinates;
      }
      
      // Fallback to known coordinates for major cities
      return this.getFallbackCoordinates(normalizedLocation);
      
    } catch (error) {
      console.warn('Geocoding failed:', error);
      return this.getFallbackCoordinates(location);
    }
  }
  
  // Fallback coordinates for major Indian cities
  static getFallbackCoordinates(location: string): { lat: number; lng: number } | null {
    const locationLower = location.toLowerCase();
    
    const knownCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'delhi': { lat: 28.7041, lng: 77.1025 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'bengaluru': { lat: 12.9716, lng: 77.5946 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'surat': { lat: 21.1702, lng: 72.8311 },
      'lucknow': { lat: 26.8467, lng: 80.9462 },
      'kanpur': { lat: 26.4499, lng: 80.3319 },
      'nagpur': { lat: 21.1458, lng: 79.0882 },
      'indore': { lat: 22.7196, lng: 75.8577 },
      'thane': { lat: 19.2183, lng: 72.9781 },
      'bhopal': { lat: 23.2599, lng: 77.4126 },
      'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
      'patna': { lat: 25.5941, lng: 85.1376 },
      'vadodara': { lat: 22.3072, lng: 73.1812 },
      'ghaziabad': { lat: 28.6692, lng: 77.4538 },
      'ludhiana': { lat: 30.9010, lng: 75.8573 },
      'agra': { lat: 27.1767, lng: 78.0081 },
      'nashik': { lat: 19.9975, lng: 73.7898 },
      'faridabad': { lat: 28.4089, lng: 77.3178 },
      'meerut': { lat: 28.9845, lng: 77.7064 },
      'rajkot': { lat: 22.3039, lng: 70.8022 },
      'varanasi': { lat: 25.3176, lng: 82.9739 },
      'srinagar': { lat: 34.0837, lng: 74.7973 },
      'aurangabad': { lat: 19.8762, lng: 75.3433 },
      'dhanbad': { lat: 23.7957, lng: 86.4304 },
      'amritsar': { lat: 31.6340, lng: 74.8723 },
      'allahabad': { lat: 25.4358, lng: 81.8463 },
      'ranchi': { lat: 23.3441, lng: 85.3096 },
      'howrah': { lat: 22.5958, lng: 88.2636 },
      'coimbatore': { lat: 11.0168, lng: 76.9558 },
      'jabalpur': { lat: 23.1815, lng: 79.9864 },
      'gwalior': { lat: 26.2183, lng: 78.1828 },
      'vijayawada': { lat: 16.5062, lng: 80.6480 },
      'jodhpur': { lat: 26.2389, lng: 73.0243 },
      'madurai': { lat: 9.9252, lng: 78.1198 },
      'raipur': { lat: 21.2514, lng: 81.6296 },
      'kota': { lat: 25.2138, lng: 75.8648 },
      'gurgaon': { lat: 28.4595, lng: 77.0266 },
      'gurugram': { lat: 28.4595, lng: 77.0266 },
      'noida': { lat: 28.5355, lng: 77.3910 },
      'chandigarh': { lat: 30.7333, lng: 76.7794 },
      'mysore': { lat: 12.2958, lng: 76.6394 },
      'mysuru': { lat: 12.2958, lng: 76.6394 }
    };
    
    for (const [city, coords] of Object.entries(knownCoordinates)) {
      if (locationLower.includes(city)) {
        console.log(`📍 Using fallback coordinates for ${city}: ${coords.lat}, ${coords.lng}`);
        return coords;
      }
    }
    
    return null;
  }
  
  // Get business-friendly location string for searches
  static getSearchFriendlyLocation(location: string): string {
    const normalized = this.normalizeIndianLocation(location);
    
    // Extract main city name
    const locationLower = normalized.toLowerCase();
    for (const city of this.INDIAN_CITIES) {
      if (locationLower.includes(city.toLowerCase())) {
        return city;
      }
    }
    
    return normalized;
  }
  
  // Check if location is a major tech hub
  static isTechHub(location: string): boolean {
    const locationLower = location.toLowerCase();
    const techHubs = [
      'bangalore', 'bengaluru', 'mumbai', 'pune', 'hyderabad', 'delhi', 'gurgaon',
      'gurugram', 'noida', 'chennai', 'kolkata', 'ahmedabad', 'kochi', 'thiruvananthapuram',
      'coimbatore', 'bhubaneswar', 'indore', 'jaipur', 'nagpur', 'vadodara'
    ];
    
    return techHubs.some(hub => locationLower.includes(hub));
  }
  
  // Get nearby tech cities for expanded search
  static getNearbyTechCities(location: string): string[] {
    const locationLower = location.toLowerCase();
    
    const nearbyMap: { [key: string]: string[] } = {
      'bangalore': ['Mysuru', 'Mangalore', 'Hubli'],
      'bengaluru': ['Mysuru', 'Mangalore', 'Hubli'],
      'mumbai': ['Pune', 'Nashik', 'Aurangabad', 'Thane', 'Navi Mumbai'],
      'delhi': ['Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
      'pune': ['Mumbai', 'Nashik', 'Kolhapur'],
      'hyderabad': ['Warangal', 'Nizamabad', 'Karimnagar'],
      'chennai': ['Coimbatore', 'Madurai', 'Tiruchirappalli'],
      'kolkata': ['Durgapur', 'Asansol', 'Siliguri'],
      'ahmedabad': ['Vadodara', 'Surat', 'Rajkot'],
      'jaipur': ['Jodhpur', 'Udaipur', 'Kota']
    };
    
    for (const [city, nearby] of Object.entries(nearbyMap)) {
      if (locationLower.includes(city)) {
        return nearby;
      }
    }
    
    return [];
  }
}
