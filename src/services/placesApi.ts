import { searchCompanies as searchFreeCompanies } from './freeBusinessSearch';
import { RealCompanyService } from './realCompanyData';
import { IndianJobSearchService } from './indianJobSearchService';
import { IndianLocationService } from './indianLocationService';
import { EnhancedIndianBusinessSearch } from './enhancedIndianBusinessSearch';
import type { Company, SearchParams } from '../types';

export const searchCompanies = async (params: SearchParams): Promise<Company[]> => {
  console.log('🚀 Starting comprehensive company search...');
  const { location, skills, radius, coordinates } = params;
  
  if (!coordinates) {
    console.error('❌ No coordinates provided for search');
    return [];
  }

  const skillsArray = Array.isArray(skills) ? skills : [skills];
  
  console.log(`📍 Searching in: ${location}`);
  console.log(`🎯 Skills: ${skillsArray.join(', ')}`);
  console.log(`📏 Radius: ${radius}m`);
  console.log(`🌐 Coordinates: ${coordinates.lat}, ${coordinates.lng}`);

  // Detect if this is an Indian location
  const isIndianLocation = IndianLocationService.isIndianLocation(location);
  console.log(`🇮🇳 Indian location detected: ${isIndianLocation}`);

  const searchPromises: Promise<Company[]>[] = [];
  
  if (isIndianLocation) {
    console.log('🇮🇳 Using comprehensive Indian job search system...');
    
    // Use the comprehensive Indian job search service
    searchPromises.push(
      IndianJobSearchService.searchIndianCompaniesAndJobs(location, skillsArray, coordinates)
    );
    
    // Use enhanced Indian business directory search
    searchPromises.push(
      EnhancedIndianBusinessSearch.searchIndianBusinesses(location, skillsArray, coordinates)
    );
    
    // Also include enhanced OpenStreetMap search for Indian businesses
    searchPromises.push(
      searchFreeCompanies({ location, skills: skillsArray, radius, coordinates })
    );
    
  } else {
    console.log('🌍 Using international search services...');
    
    // For non-Indian locations, use international services
    searchPromises.push(
      searchFreeCompanies({ location, skills: skillsArray, radius, coordinates })
    );
    
    searchPromises.push(
      RealCompanyService.searchRealCompanies(location, coordinates, skillsArray, radius)
    );
  }

  console.log(`🔄 Running ${searchPromises.length} search services...`);
  
  try {
    const results = await Promise.allSettled(searchPromises);
    const allCompanies: Company[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const companies = result.value;
        if (companies && companies.length > 0) {
          console.log(`✅ Service ${index + 1}: Found ${companies.length} companies`);
          allCompanies.push(...companies);
        } else {
          console.log(`⚠️ Service ${index + 1}: No results`);
        }
      } else {
        console.warn(`❌ Service ${index + 1} failed:`, result.reason);
      }
    });

    console.log(`📊 Total companies found: ${allCompanies.length}`);

    if (allCompanies.length === 0) {
      console.log('⚠️ No companies found from primary search, trying fallback...');
      
      if (isIndianLocation) {
        // Try nearby cities search for Indian locations
        const nearbyCities = IndianLocationService.getNearbyTechCities(location);
        if (nearbyCities.length > 0) {
          console.log(`🔄 Searching nearby cities: ${nearbyCities.join(', ')}`);
          
          for (const nearbyCity of nearbyCities.slice(0, 2)) {
            try {
              const nearbyResults = await IndianJobSearchService.searchIndianCompaniesAndJobs(
                nearbyCity, 
                skillsArray.slice(0, 2)
              );
              if (nearbyResults.length > 0) {
                console.log(`✅ Found ${nearbyResults.length} companies in ${nearbyCity}`);
                allCompanies.push(...nearbyResults);
                break; // Stop after first successful result
              }
            } catch (error) {
              console.warn(`Failed to search ${nearbyCity}:`, error);
            }
          }
        }
      }
    }

    // Remove duplicates and return results
    const uniqueCompanies = removeDuplicateCompanies(allCompanies);
    
    console.log(`🎯 Final unique companies: ${uniqueCompanies.length}`);
    
    if (uniqueCompanies.length === 0) {
      console.log('❌ No companies found after all searches');
    }

    return uniqueCompanies;
    
  } catch (error) {
    console.error('❌ Search failed:', error);
    return [];
  }
};

// Company deduplication utility
const removeDuplicateCompanies = (companies: Company[]): Company[] => {
  const seen = new Map<string, Company>();
  
  companies.forEach(company => {
    const key = `${company.name.toLowerCase()}-${company.address.toLowerCase()}`;
    const existing = seen.get(key);
    
    if (!existing) {
      seen.set(key, company);
    } else {
      // Merge data from duplicates - keep the one with more information
      if (!existing.website && company.website) existing.website = company.website;
      if (!existing.phone && company.phone) existing.phone = company.phone;
      if (!existing.email && company.email) existing.email = company.email;
      if (existing.address.length < company.address.length) existing.address = company.address;
    }
  });
  
  return Array.from(seen.values());
};
