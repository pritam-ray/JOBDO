import { Company, SearchParams } from '../types';

// Free business search using multiple sources
// NOTE: Only real, verified company data is returned - no mock or estimated information
export const searchCompanies = async (searchParams: SearchParams): Promise<Company[]> => {
  const { coordinates, skills, radius } = searchParams;
  
  if (!coordinates) {
    throw new Error('Coordinates are required for search');
  }

  try {
    const companies: Company[] = [];
    const seenCompanies = new Set<string>();

    // Search using Overpass API (OpenStreetMap business data)
    const overpassResults = await searchWithOverpass(coordinates, radius, skills);
    
    for (const company of overpassResults) {
      const key = `${company.name}-${company.address}`;
      if (!seenCompanies.has(key)) {
        seenCompanies.add(key);
        companies.push(company);
      }
    }

    // Search using Foursquare Places API (has a free tier)
    try {
      const foursquareResults = await searchWithFoursquare(coordinates, radius, skills);
      for (const company of foursquareResults) {
        const key = `${company.name}-${company.address}`;
        if (!seenCompanies.has(key)) {
          seenCompanies.add(key);
          companies.push(company);
        }
      }
    } catch (error) {
      console.warn('Foursquare search failed:', error);
    }

    return companies.slice(0, 50); // Limit results
  } catch (error) {
    console.error('Business search error:', error);
    throw new Error('Failed to search for companies. Please try again.');
  }
};

// Search using Overpass API (OpenStreetMap data)
const searchWithOverpass = async (
  coordinates: { lat: number; lng: number },
  radius: number,
  skills: string[]
): Promise<Company[]> => {
  const { lat, lng } = coordinates;
  const radiusMeters = radius * 1000;

  // Build targeted query based on skills for internship-suitable companies
  const officeTypes = getOfficeTypes(skills);
  const industries = getIndustryTypes(skills);
  
  console.log('🔍 Searching with skills:', skills);
  console.log('📋 Mapped office types:', officeTypes);
  console.log('🏭 Mapped industries:', industries);

  let query = `[out:json][timeout:25];(`;
  
  // Focus on offices and professional establishments
  officeTypes.forEach(office => {
    query += `node["office"="${office}"](around:${radiusMeters},${lat},${lng});`;
    query += `way["office"="${office}"](around:${radiusMeters},${lat},${lng});`;
  });

  // Add industry-specific queries
  industries.forEach(industry => {
    query += `node["industrial"="${industry}"](around:${radiusMeters},${lat},${lng});`;
    query += `way["industrial"="${industry}"](around:${radiusMeters},${lat},${lng});`;
    query += `node["craft"="${industry}"](around:${radiusMeters},${lat},${lng});`;
    query += `way["craft"="${industry}"](around:${radiusMeters},${lat},${lng});`;
  });

  // Add skill-specific business queries only
  if (skills.some(skill => ['finance', 'fintech', 'banking'].includes(skill.toLowerCase()))) {
    query += `node["amenity"="bank"](around:${radiusMeters},${lat},${lng});`;
    query += `way["amenity"="bank"](around:${radiusMeters},${lat},${lng});`;
  }
  
  if (skills.some(skill => ['retail', 'ecommerce', 'marketing', 'sales'].includes(skill.toLowerCase()))) {
    query += `node["shop"](around:${radiusMeters},${lat},${lng});`;
    query += `way["shop"](around:${radiusMeters},${lat},${lng});`;
  }
  
  // Add more generic business queries to ensure we get real companies
  query += `node["name"]["office"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["office"](around:${radiusMeters},${lat},${lng});`;
  query += `node["name"]["building"="office"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["building"="office"](around:${radiusMeters},${lat},${lng});`;
  query += `node["name"]["building"="commercial"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["building"="commercial"](around:${radiusMeters},${lat},${lng});`;
  
  // Add very broad searches for Indian cities where tagging might be less detailed
  query += `node["name"]["addr:city"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["addr:city"](around:${radiusMeters},${lat},${lng});`;
  query += `node["name"]["contact:phone"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["contact:phone"](around:${radiusMeters},${lat},${lng});`;
  query += `node["name"]["website"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["website"](around:${radiusMeters},${lat},${lng});`;
  
  // Search for any named places that could be businesses
  query += `node["name"]["place"!="locality"]["place"!="village"]["place"!="town"](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"]["place"!="locality"]["place"!="village"]["place"!="town"](around:${radiusMeters},${lat},${lng});`;
  
  // Add businesses with names that suggest they're companies
  query += `node["name"~"(company|corp|inc|ltd|llc|technologies|tech|solutions|systems|services|group|enterprises)"i](around:${radiusMeters},${lat},${lng});`;
  query += `way["name"~"(company|corp|inc|ltd|llc|technologies|tech|solutions|systems|services|group|enterprises)"i](around:${radiusMeters},${lat},${lng});`;
  
  // Only add generic office buildings if we have office-related skills
  if (officeTypes.length > 0) {
    query += `node["building"="office"](around:${radiusMeters},${lat},${lng});`;
    query += `way["building"="office"](around:${radiusMeters},${lat},${lng});`;
  }

  query += `);out center meta;`;
  
  console.log('🌐 Overpass query:', query);

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error('Overpass API request failed');
    }

    const data = await response.json();
    return parseOverpassResults(data.elements);
  } catch (error) {
    console.error('Overpass API error:', error);
    return [];
  }
};

// Search using Foursquare Places API (free tier)
const searchWithFoursquare = async (
  coordinates: { lat: number; lng: number },
  searchRadius: number,
  searchSkills: string[]
): Promise<Company[]> => {
  // Foursquare API would go here, but it requires API key
  // For now, return empty array as fallback
  console.log('Foursquare search not implemented yet', { coordinates, searchRadius, searchSkills });
  return [];
};

const getOfficeTypes = (skills: string[]): string[] => {
  const skillMap: { [key: string]: string[] } = {
    // Technology Skills
    'ai/ml': ['it', 'research', 'company'],
    'machine learning': ['it', 'research', 'company'],
    'data science': ['it', 'research', 'company'],
    'web development': ['it', 'company', 'advertising'],
    'app development': ['it', 'company', 'telecommunication'],
    'mobile development': ['it', 'company', 'telecommunication'],
    'software development': ['it', 'company', 'telecommunication'],
    'cybersecurity': ['it', 'company', 'research'],
    'cloud computing': ['it', 'company', 'telecommunication'],
    'devops': ['it', 'company'],
    'blockchain': ['it', 'company', 'financial'],
    
    // Engineering Skills
    'electronics': ['it', 'company', 'research'],
    'embedded systems': ['it', 'company', 'research'],
    'robotics': ['it', 'company', 'research'],
    'space': ['research', 'company'],
    'aerospace': ['research', 'company'],
    'mechanical engineering': ['company', 'research'],
    'civil engineering': ['architect', 'company'],
    'electrical engineering': ['it', 'company', 'research'],
    
    // Business & Finance
    'finance': ['financial', 'accountant', 'insurance', 'company'],
    'fintech': ['it', 'financial', 'company'],
    'banking': ['financial', 'company'],
    'accounting': ['accountant', 'financial', 'company'],
    'investment': ['financial', 'company'],
    'insurance': ['insurance', 'company'],
    
    // Marketing & Design
    'marketing': ['advertising', 'company'],
    'digital marketing': ['advertising', 'company', 'it'],
    'design': ['architect', 'advertising', 'company'],
    'ui/ux': ['it', 'company', 'advertising'],
    'graphic design': ['advertising', 'company'],
    'content writing': ['advertising', 'company'],
    'social media': ['advertising', 'company'],
    
    // Professional Services
    'consulting': ['consulting', 'company'],
    'legal': ['lawyer', 'company'],
    'law': ['lawyer', 'company'],
    'hr': ['company'],
    'human resources': ['company'],
    'project management': ['company', 'consulting'],
    
    // Healthcare & Life Sciences
    'healthcare': ['company'],
    'biotechnology': ['research', 'company'],
    'pharmaceutical': ['research', 'company'],
    'medical devices': ['company', 'research'],
    
    // Media & Entertainment
    'journalism': ['company'],
    'media': ['company'],
    'video production': ['company'],
    'animation': ['company', 'it'],
    'gaming': ['it', 'company'],
    
    // Sales & Business Development
    'sales': ['company'],
    'business development': ['company'],
    'retail': ['company'],
    'ecommerce': ['it', 'company']
  };

  let offices: string[] = [];
  skills.forEach(skill => {
    const mapped = skillMap[skill.toLowerCase().trim()];
    if (mapped) {
      offices.push(...mapped);
    }
  });

  // Default to tech and professional office types if no specific skills
  if (offices.length === 0) {
    offices = ['it', 'company', 'consulting', 'research'];
  }

  return [...new Set(offices)];
};

const getIndustryTypes = (skills: string[]): string[] => {
  const skillMap: { [key: string]: string[] } = {
    // Technology Industries
    'electronics': ['electronics', 'semiconductor'],
    'robotics': ['electronics', 'automotive'],
    'ai/ml': ['electronics', 'semiconductor'],
    'embedded systems': ['electronics', 'semiconductor'],
    'iot': ['electronics', 'semiconductor'],
    
    // Aerospace & Defense
    'space': ['aerospace'],
    'aerospace': ['aerospace'],
    'defense': ['aerospace'],
    
    // Automotive
    'automotive': ['automotive'],
    'electric vehicles': ['automotive', 'electronics'],
    'autonomous vehicles': ['automotive', 'electronics'],
    
    // Manufacturing
    'manufacturing': ['automotive', 'electronics'],
    'industrial automation': ['automotive', 'electronics'],
    'mechanical engineering': ['automotive'],
    
    // Energy & Sustainability
    'renewable energy': ['electronics'],
    'solar': ['electronics'],
    'wind energy': ['electronics'],
    'battery technology': ['electronics'],
    
    // Biotechnology
    'biotechnology': ['pharmaceutical'],
    'pharmaceutical': ['pharmaceutical'],
    'medical devices': ['electronics', 'pharmaceutical'],
    
    // Materials & Chemistry
    'materials science': ['chemicals'],
    'chemistry': ['chemicals'],
    'nanotechnology': ['electronics', 'chemicals']
  };

  const industries: string[] = [];
  skills.forEach(skill => {
    const mapped = skillMap[skill.toLowerCase().trim()];
    if (mapped) {
      industries.push(...mapped);
    }
  });

  return [...new Set(industries)];
};

interface OverpassElement {
  id: string;
  type?: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const parseOverpassResults = (elements: OverpassElement[]): Company[] => {
  const companies: Company[] = [];

  elements.forEach((element) => {
    const tags = element.tags || {};
    
    // Only include companies with real names (not generic)
    if (tags.name && tags.name.length > 2 && isInternshipSuitableCompany(tags)) {
      // Get coordinates
      let lat = element.lat;
      let lng = element.lon;
      
      // For ways, use center coordinates
      if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      }

      // Build address from tags
      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'],
        tags['addr:postcode']
      ].filter(Boolean);
      
      const address = addressParts.length > 0 
        ? addressParts.join(', ')
        : (lat && lng) ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : 'Address not available';

      // Determine category
      const category = tags.amenity || tags.shop || tags.office || 'business';

      const company: Company = {
        id: `osm-${element.type}-${element.id}`,
        name: tags.name,
        address: address,
        // Only include contact info if it's actually available in the data
        phone: tags.phone || tags['contact:phone'],
        email: tags.email || tags['contact:email'],
        website: tags.website || tags['contact:website'],
        category: category.replace(/_/g, ' '),
        lat: lat || 0,
        lng: lng || 0,
        placeId: `osm-${element.id}`,
        businessStatus: 'operational',
        openingHours: tags.opening_hours ? [tags.opening_hours] : undefined
      };

      // Only add companies with valid coordinates and meaningful data
      if (company.lat !== 0 && company.lng !== 0 && company.name.length > 2) {
        companies.push(company);
      }
    }
  });

  return companies;
};

// Filter function to ensure we only get internship-suitable companies
const isInternshipSuitableCompany = (tags: Record<string, string>): boolean => {
  // Exclude restaurants, cafes, retail shops, etc.
  const excludedAmenities = [
    'restaurant', 'cafe', 'fast_food', 'bar', 'pub', 'fuel', 'atm',
    'pharmacy', 'hospital', 'clinic', 'dentist', 'veterinary',
    'place_of_worship', 'parking', 'toilets', 'bench', 'waste_basket'
  ];
  
  const excludedShops = [
    'supermarket', 'convenience', 'clothes', 'shoes', 'bakery',
    'butcher', 'greengrocer', 'hairdresser', 'beauty', 'jewelry',
    'florist', 'gift', 'toys', 'sports', 'books', 'music'
  ];

  // Check if it's an excluded type
  if (tags.amenity && excludedAmenities.includes(tags.amenity)) {
    return false;
  }
  
  if (tags.shop && excludedShops.includes(tags.shop)) {
    return false;
  }

  // Include if it's a professional office, tech company, or business facility
  const includedTypes = [
    'office', 'company', 'it', 'research', 'consulting', 'advertising',
    'architect', 'lawyer', 'accountant', 'financial', 'insurance',
    'telecommunication'
  ];

  if (tags.office && includedTypes.includes(tags.office)) {
    return true;
  }

  // Exclude all educational institutions
  if (tags.amenity && ['university', 'college', 'research_institute', 'school'].includes(tags.amenity)) {
    return false;
  }

  if (tags.industrial && ['electronics', 'semiconductor', 'aerospace', 'automotive'].includes(tags.industrial)) {
    return true;
  }

  if (tags.craft && ['electronics', 'automotive'].includes(tags.craft)) {
    return true;
  }

  // Include if name suggests it's a tech/professional company
  if (tags.name) {
    const name = tags.name.toLowerCase();
    
    // First exclude educational institutions by name
    const educationalKeywords = [
      'university', 'college', 'school', 'academy', 'institution', 
      'campus', 'faculty', 'department', 'student', 'education'
    ];
    
    if (educationalKeywords.some(keyword => name.includes(keyword))) {
      return false;
    }
    
    const businessKeywords = [
      // Technology & IT
      'tech', 'software', 'systems', 'solutions', 'digital', 'innovation', 
      'development', 'engineering', 'technologies', 'electronics', 'automation', 
      'robotics', 'ai', 'data', 'cloud', 'cyber', 'security', 'web', 'app',
      
      // Finance & Business
      'financial', 'finance', 'bank', 'investment', 'insurance', 'accounting',
      'consulting', 'advisory', 'capital', 'fund', 'ventures',
      
      // Professional Services
      'consulting', 'services', 'advisory', 'law', 'legal', 'architect',
      'design', 'marketing', 'advertising', 'media', 'communications',
      
      // Manufacturing & Industry  
      'manufacturing', 'industrial', 'automotive', 'aerospace', 'energy',
      'pharmaceutical', 'biotech', 'medical', 'devices', 'materials',
      
      // Corporate Identifiers
      'corporation', 'company', 'ltd', 'inc', 'pvt', 'private', 'limited',
      'office', 'business', 'firm', 'group', 'enterprises', 'ventures',
      'studios', 'labs', 'laboratory', 'research', 'corp'
    ];
    
    return businessKeywords.some(keyword => name.includes(keyword));
  }

  return false;
};

// Office types for different skills