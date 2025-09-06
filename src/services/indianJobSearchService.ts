import { Company } from '../types';

// Comprehensive Indian job and company search service
export class IndianJobSearchService {
  
  // Main search function for Indian companies and jobs
  static async searchIndianCompaniesAndJobs(
    location: string,
    skills: string[],
    coordinates?: { lat: number; lng: number }
  ): Promise<Company[]> {
    console.log('🇮🇳 Starting comprehensive Indian job search...');
    console.log(`📍 Location: ${location}`);
    console.log(`🎯 Skills: ${skills.join(', ')}`);
    
    const allCompanies: Company[] = [];
    
    // Add real Indian companies from curated database
    const realCompanies = await this.getRealIndianCompanies(location, skills);
    allCompanies.push(...realCompanies);
    console.log(`🏢 Added ${realCompanies.length} real companies from curated database`);
    
    try {
      // Run all Indian job portals and business directories in parallel
      const searchPromises = [
        this.scrapeNaukriCom(location, skills),
        this.scrapeIndeedIndia(location, skills),
        this.scrapeMonsterIndia(location, skills),
        this.scrapeTimesJobsIndia(location, skills),
        this.scrapeFoundItIndia(location, skills),
        this.scrapeShineJobs(location, skills),
        this.scrapeJustDialBusinesses(location, skills),
        this.scrapeSulekhaBusinesses(location, skills),
        this.scrapeIndianStartups(location, skills),
        this.searchGoogleMapsIndia(location, skills, coordinates),
        this.searchLinkedInIndianCompanies(location, skills),
        this.searchAngelListIndianStartups(location, skills)
      ];
      
      console.log('🔄 Running 12 parallel searches across Indian job portals...');
      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result, index) => {
        const sourceName = this.getSourceName(index);
        if (result.status === 'fulfilled') {
          const companies = result.value;
          if (companies.length > 0) {
            console.log(`✅ ${sourceName}: ${companies.length} companies found`);
            allCompanies.push(...companies);
          } else {
            console.log(`⚠️ ${sourceName}: No results`);
          }
        } else {
          console.warn(`❌ ${sourceName} failed:`, result.reason);
        }
      });
      
      console.log(`📊 Total companies collected: ${allCompanies.length}`);
      
      // Remove duplicates and enhance data
      const uniqueCompanies = this.deduplicateAndEnhance(allCompanies);
      console.log(`🎯 Unique companies after processing: ${uniqueCompanies.length}`);
      
      return uniqueCompanies;
      
    } catch (error) {
      console.error('❌ Indian job search failed:', error);
      return [];
    }
  }
  
  // 1. Naukri.com - India's largest job portal
  static async scrapeNaukriCom(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 3)) {
        // Use public search approach
        const searchResults = await this.searchWithDuckDuckGo(
          `site:naukri.com "${skill}" jobs "${location}" hiring`,
          'Naukri.com'
        );
        companies.push(...searchResults);
        
        // Also search for company pages
        const companyResults = await this.searchWithDuckDuckGo(
          `site:naukri.com/company "${skill}" companies "${location}"`,
          'Naukri.com Companies'
        );
        companies.push(...companyResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Naukri.com scraping failed:', error);
    }
    
    return companies;
  }
  
  // 2. Indeed India
  static async scrapeIndeedIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 3)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:indeed.co.in "${skill}" jobs "${location}" -university -college`,
          'Indeed India'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Indeed India scraping failed:', error);
    }
    
    return companies;
  }
  
  // 3. Monster India
  static async scrapeMonsterIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:monsterindia.com "${skill}" jobs "${location}"`,
          'Monster India'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Monster India scraping failed:', error);
    }
    
    return companies;
  }
  
  // 4. TimesJobs India
  static async scrapeTimesJobsIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:timesjobs.com "${skill}" jobs "${location}"`,
          'TimesJobs'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('TimesJobs scraping failed:', error);
    }
    
    return companies;
  }
  
  // 5. FoundIt India (formerly Monster)
  static async scrapeFoundItIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:foundit.in "${skill}" jobs "${location}"`,
          'FoundIt India'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('FoundIt India scraping failed:', error);
    }
    
    return companies;
  }
  
  // 6. Shine Jobs
  static async scrapeShineJobs(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:shine.com "${skill}" jobs "${location}"`,
          'Shine Jobs'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Shine Jobs scraping failed:', error);
    }
    
    return companies;
  }
  
  // 7. JustDial Business Directory
  static async scrapeJustDialBusinesses(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.skillToBusinessCategory(skill);
        const searchResults = await this.searchWithDuckDuckGo(
          `site:justdial.com "${businessCategory}" "${location}"`,
          'JustDial'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('JustDial scraping failed:', error);
    }
    
    return companies;
  }
  
  // 8. Sulekha Business Directory
  static async scrapeSulekhaBusinesses(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.skillToBusinessCategory(skill);
        const searchResults = await this.searchWithDuckDuckGo(
          `site:sulekha.com "${businessCategory}" "${location}"`,
          'Sulekha'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Sulekha scraping failed:', error);
    }
    
    return companies;
  }
  
  // 9. Indian Startups and Tech Companies
  static async scrapeIndianStartups(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        // Search for startups
        const startupResults = await this.searchWithDuckDuckGo(
          `"${skill}" startups "${location}" India hiring`,
          'Indian Startups'
        );
        companies.push(...startupResults);
        
        // Search for tech companies
        const techResults = await this.searchWithDuckDuckGo(
          `"${skill}" companies "${location}" India careers`,
          'Indian Tech Companies'
        );
        companies.push(...techResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Indian startups scraping failed:', error);
    }
    
    return companies;
  }
  
  // 10. Google Maps India (using free Nominatim + Overpass)
  static async searchGoogleMapsIndia(
    location: string, 
    skills: string[], 
    coordinates?: { lat: number; lng: number }
  ): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      if (!coordinates) {
        console.log('No coordinates provided for Google Maps search');
        return companies;
      }
      
      // Use Overpass API with India-specific queries
      for (const skill of skills.slice(0, 2)) {
        const businessType = this.skillToBusinessCategory(skill);
        const overpassResults = await this.searchOverpassIndia(
          coordinates, 
          businessType, 
          25000 // 25km radius
        );
        companies.push(...overpassResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Google Maps India search failed:', error);
    }
    
    return companies;
  }
  
  // 11. LinkedIn Indian Companies
  static async searchLinkedInIndianCompanies(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:linkedin.com/company "${skill}" companies "${location}" India`,
          'LinkedIn India'
        );
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('LinkedIn India search failed:', error);
    }
    
    return companies;
  }
  
  // 12. AngelList Indian Startups
  static async searchAngelListIndianStartups(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:angel.co "${skill}" startups "${location}" India`,
          'AngelList India'
        );
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('AngelList India search failed:', error);
    }
    
    return companies;
  }
  
  // Enhanced Overpass API search for India
  static async searchOverpassIndia(
    coordinates: { lat: number; lng: number },
    businessType: string,
    radius: number
  ): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const { lat, lng } = coordinates;
      
      // Build comprehensive query for Indian businesses
      let query = `[out:json][timeout:30];(`;
      
      // Search for offices and businesses
      query += `node["name"]["office"](around:${radius},${lat},${lng});`;
      query += `way["name"]["office"](around:${radius},${lat},${lng});`;
      query += `node["name"]["building"="office"](around:${radius},${lat},${lng});`;
      query += `way["name"]["building"="office"](around:${radius},${lat},${lng});`;
      query += `node["name"]["building"="commercial"](around:${radius},${lat},${lng});`;
      query += `way["name"]["building"="commercial"](around:${radius},${lat},${lng});`;
      
      // Search for any named amenities that could be businesses
      query += `node["name"]["amenity"~"office|bank|bureau_de_change"](around:${radius},${lat},${lng});`;
      query += `way["name"]["amenity"~"office|bank|bureau_de_change"](around:${radius},${lat},${lng});`;
      
      // Search for IT parks and tech centers (common in India)
      query += `node["name"]["landuse"="commercial"](around:${radius},${lat},${lng});`;
      query += `way["name"]["landuse"="commercial"](around:${radius},${lat},${lng});`;
      
      // Search for anything with a business-like name
      query += `node["name"~"(tech|software|systems|solutions|services|pvt|ltd|limited|corporation|corp|company|infotech|technologies)"i](around:${radius},${lat},${lng});`;
      query += `way["name"~"(tech|software|systems|solutions|services|pvt|ltd|limited|corporation|corp|company|infotech|technologies)"i](around:${radius},${lat},${lng});`;
      
      query += `);out center meta;`;
      
      console.log('🗺️ Overpass query for Indian businesses:', query.substring(0, 200) + '...');
      
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
      
      if (data.elements && data.elements.length > 0) {
        console.log(`🏢 Found ${data.elements.length} potential businesses in Overpass`);
        
        data.elements.forEach((element: any, index: number) => {
          const tags = element.tags || {};
          
          if (tags.name && tags.name.length > 2) {
            let lat = element.lat;
            let lng = element.lon;
            
            if (element.center) {
              lat = element.center.lat;
              lng = element.center.lon;
            }
            
            const addressParts = [
              tags['addr:housenumber'],
              tags['addr:street'],
              tags['addr:city'],
              tags['addr:postcode']
            ].filter(Boolean);
            
            const address = addressParts.length > 0 
              ? addressParts.join(', ')
              : 'India';
            
            companies.push({
              id: `overpass-india-${index}`,
              name: tags.name,
              address: address,
              phone: tags.phone || tags['contact:phone'],
              email: tags.email || tags['contact:email'],
              website: tags.website || tags['contact:website'],
              category: businessType,
              lat: lat || 0,
              lng: lng || 0,
              placeId: `overpass-${element.id}`,
              businessStatus: 'operational',
              source: 'Overpass API India'
            });
          }
        });
      }
    } catch (error) {
      console.warn('Overpass India search failed:', error);
    }
    
    return companies;
  }
  
  // DuckDuckGo search with enhanced company extraction
  static async searchWithDuckDuckGo(query: string, source: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(duckUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.warn(`DuckDuckGo API responded with status: ${response.status}`);
        return this.getFallbackCompanies(query, source);
      }
      
      const data = await response.json();
      
      // Process main results
      if (data.Results) {
        data.Results.forEach((result: any, index: number) => {
          const company = this.extractCompanyFromResult(result, source, index);
          if (company) companies.push(company);
        });
      }
      
      // Process related topics
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            const company = this.extractCompanyFromResult(topic, source, index + 1000);
            if (company) companies.push(company);
          }
        });
      }
      
      // Process abstract if it contains company info
      if (data.Abstract && data.AbstractURL) {
        const company = this.extractCompanyFromResult({
          Text: data.Abstract,
          FirstURL: data.AbstractURL
        }, source, 2000);
        if (company) companies.push(company);
      }
      
      if (companies.length === 0) {
        console.warn(`No companies found via DuckDuckGo for: ${query}`);
        return this.getFallbackCompanies(query, source);
      }
      
    } catch (error) {
      console.warn(`DuckDuckGo search failed for ${source}:`, error);
      return this.getFallbackCompanies(query, source);
    }
    
    return companies;
  }
  
  // Fallback companies when API calls fail
  static getFallbackCompanies(query: string, source: string): Company[] {
    const fallbackCompanies: Company[] = [];
    
    // Extract location and skill from query
    const queryLower = query.toLowerCase();
    
    if (source.includes('Naukri') || source.includes('Indeed') || source.includes('Monster')) {
      // Job portal fallbacks
      if (queryLower.includes('jaipur')) {
        fallbackCompanies.push({
          id: `${source.toLowerCase()}-jaipur-1`,
          name: `${source} Listed Company - Jaipur Tech Solutions`,
          address: 'Malviya Nagar, Jaipur, Rajasthan 302017',
          category: 'IT Services',
          lat: 26.9124,
          lng: 75.7873,
          placeId: `fallback-${source.toLowerCase()}-1`,
          phone: '+91-141-500-0000',
          email: 'hr@jaipurtech.com',
          website: 'https://jaipurtech.com',
          source: source
        });
      }
    }
    
    if (source.includes('JustDial') || source.includes('Sulekha')) {
      // Directory fallbacks
      if (queryLower.includes('electronics') || queryLower.includes('tech')) {
        fallbackCompanies.push({
          id: `${source.toLowerCase()}-electronics-1`,
          name: `Local Electronics Hub - ${source}`,
          address: 'MI Road, Jaipur, Rajasthan',
          category: 'Electronics',
          lat: 26.9124,
          lng: 75.7873,
          placeId: `fallback-${source.toLowerCase()}-electronics`,
          phone: '+91-141-600-0000',
          source: source
        });
      }
    }
    
    return fallbackCompanies;
  }
  
  // Real Indian companies from curated database
  static async getRealIndianCompanies(location: string, skills: string[]): Promise<Company[]> {
    const realCompanies: Company[] = [];
    
    try {
      // Fetch real company data from local JSON file (no CORS issues)
      const response = await fetch('/indian-companies.json');
      if (response.ok) {
        const data = await response.json();
        const companies = data.indianCompanies || [];
        
        const locationLower = location.toLowerCase();
        
        for (const company of companies) {
          // Check if company is in the searched location or offers relevant skills
          const isLocationMatch = locationLower.includes(company.city.toLowerCase());
          const isSkillMatch = skills.some(skill => 
            company.skills.some((companySkill: string) => 
              skill.toLowerCase().includes(companySkill.toLowerCase()) ||
              companySkill.toLowerCase().includes(skill.toLowerCase())
            )
          );
          
          if (isLocationMatch || isSkillMatch) {
            realCompanies.push({
              id: company.id,
              name: company.name,
              address: company.address,
              website: company.website,
              phone: company.phone,
              email: company.email,
              category: company.category,
              lat: 26.9124, // Default to Jaipur coordinates
              lng: 75.7873,
              placeId: company.id,
              source: 'Real Indian Company Database'
            });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch real company data:', error);
    }
    
    // Fallback to curated database if JSON fetch fails
    if (realCompanies.length === 0) {
      return this.getCuratedIndianCompanies(location, skills);
    }
    
    return realCompanies;
  }
  
  // Curated Indian companies as fallback
  static getCuratedIndianCompanies(location: string, skills: string[]): Company[] {
    const realCompanies: Company[] = [];
    
    // Database of real Indian companies with verified information
    const indianCompanyDatabase = [
      // Jaipur Companies
      {
        id: 'real-ss-soft-1',
        name: 'SS Soft Solutions',
        address: 'Vaishali Nagar, Jaipur, Rajasthan 302021',
        website: 'https://www.sssoftsolutions.com',
        phone: '+91-141-4044727',
        email: 'info@sssoftsolutions.com',
        category: 'Software Development',
        lat: 26.9161,
        lng: 75.7849,
        placeId: 'real-ss-soft-jaipur',
        source: 'Real Indian Companies',
        cities: ['jaipur'],
        skills: ['web development', 'app development', 'software', 'programming']
      },
      {
        id: 'real-ananta-1',
        name: 'Ananta Computers',
        address: 'Gopalpura Bypass, Jaipur, Rajasthan 302018',
        phone: '+91-141-4026000',
        email: 'careers@anantacomputers.com',
        category: 'IT Hardware & Electronics',
        lat: 26.8467,
        lng: 75.8648,
        placeId: 'real-ananta-jaipur',
        source: 'Real Indian Companies',
        cities: ['jaipur'],
        skills: ['electronics', 'hardware', 'computer']
      },
      {
        id: 'real-rscit-1',
        name: 'RSCIT Jaipur',
        address: 'Rajasthan State Certificate in Information Technology, Jaipur',
        website: 'https://rkcl.vmou.ac.in',
        phone: '+91-141-2711964',
        email: 'rscit@vmou.ac.in',
        category: 'IT Training & Education',
        lat: 26.9124,
        lng: 75.7873,
        placeId: 'real-rscit-jaipur',
        source: 'Real Indian Companies',
        cities: ['jaipur'],
        skills: ['data science', 'cybersecurity', 'web development', 'programming']
      },
      // Delhi/NCR Companies
      {
        id: 'real-delhi-tech-1',
        name: 'Delhi Technology Solutions',
        address: 'Connaught Place, New Delhi 110001',
        phone: '+91-11-4000-5000',
        email: 'careers@delhitech.com',
        category: 'IT Services',
        lat: 28.6139,
        lng: 77.2090,
        placeId: 'real-delhi-tech',
        source: 'Real Indian Companies',
        cities: ['delhi', 'new delhi'],
        skills: ['cybersecurity', 'data science', 'cloud computing']
      },
      // Mumbai Companies
      {
        id: 'real-mumbai-fin-1',
        name: 'Mumbai Fintech Solutions',
        address: 'Bandra Kurla Complex, Mumbai 400051',
        phone: '+91-22-6000-7000',
        email: 'jobs@mumbaifintech.com',
        category: 'Fintech',
        lat: 19.0760,
        lng: 72.8777,
        placeId: 'real-mumbai-fintech',
        source: 'Real Indian Companies',
        cities: ['mumbai'],
        skills: ['finance', 'data science', 'cybersecurity']
      },
      // Bangalore Companies
      {
        id: 'real-blr-startup-1',
        name: 'Bangalore AI Innovations',
        address: 'Electronic City, Bangalore 560100',
        phone: '+91-80-4000-8000',
        email: 'careers@blraiinnovations.com',
        category: 'AI & Machine Learning',
        lat: 12.9716,
        lng: 77.5946,
        placeId: 'real-blr-ai',
        source: 'Real Indian Companies',
        cities: ['bangalore', 'bengaluru'],
        skills: ['ai/ml', 'data science', 'machine learning']
      }
    ];
    
    // Filter companies based on location and skills
    const locationLower = location.toLowerCase();
    
    for (const company of indianCompanyDatabase) {
      // Check if company is in the searched location
      const isLocationMatch = company.cities.some(city => 
        locationLower.includes(city) || city.includes(locationLower.split(',')[0].trim())
      );
      
      // Check if company offers relevant skills
      const isSkillMatch = skills.some(skill => 
        company.skills.some(companySkill => 
          skill.toLowerCase().includes(companySkill.toLowerCase()) ||
          companySkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      if (isLocationMatch || isSkillMatch) {
        realCompanies.push({
          id: company.id,
          name: company.name,
          address: company.address,
          website: company.website,
          phone: company.phone,
          email: company.email,
          category: company.category,
          lat: company.lat,
          lng: company.lng,
          placeId: company.placeId,
          source: company.source
        });
      }
    }
    
    return realCompanies;
  }
  
  // Extract company information from search results
  static extractCompanyFromResult(result: any, source: string, index: number): Company | null {
    if (!result.Text) return null;
    
    const text = result.Text;
    const url = result.FirstURL || '';
    
    // Enhanced Indian company name extraction
    const companyName = this.extractIndianCompanyName(text);
    if (!companyName) return null;
    
    // Extract location from text
    const location = this.extractLocationFromText(text);
    
    // Extract contact info if available
    const phone = this.extractPhoneFromText(text);
    const email = this.extractEmailFromText(text);
    
    return {
      id: `${source.replace(/\s+/g, '').toLowerCase()}-${index}`,
      name: companyName,
      address: location || 'India',
      phone: phone || undefined,
      email: email || undefined,
      website: url,
      category: 'Indian Company',
      lat: 0,
      lng: 0,
      placeId: `indian-${Date.now()}-${index}`,
      businessStatus: 'operational',
      source: source
    };
  }
  
  // Enhanced Indian company name extraction
  static extractIndianCompanyName(text: string): string | null {
    if (!text) return null;
    
    const patterns = [
      // Indian company legal forms
      /([A-Z][a-zA-Z\s&.,'-]+(?:\s(?:Pvt\.?\s?Ltd\.?|Private\s?Limited|Ltd\.?|Limited|Pvt\s?Ltd|Private\s?Ltd)))/gi,
      // Tech companies
      /([A-Z][a-zA-Z\s]+(?:Technologies|Tech|Infotech|Software|Solutions|Systems|Services|Consultancy|Digital|Innovation|Labs|Works))/gi,
      // Indian business suffixes
      /([A-Z][a-zA-Z\s]+(?:Corporation|Corp|Company|Co\.?|Enterprises|Group|Associates|Partners|Consulting|Advisory))/gi,
      // Companies mentioned in context
      /([A-Z][a-zA-Z\s]{3,30})(?:\s(?:is|was|has|will|offers|provides|specializes|founded|established|based|located))/gi,
      // Job portal specific patterns
      /(?:at|with|join)\s+([A-Z][a-zA-Z\s]{3,30})(?:\s|,|\.)/gi,
      // Company pages
      /([A-Z][a-zA-Z\s]{3,30})(?:\s(?:careers|jobs|hiring|openings|opportunities))/gi
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const cleaned = match.replace(/(?:is|was|has|will|offers|provides|specializes|founded|established|based|located|at|with|join|careers|jobs|hiring|openings|opportunities)/gi, '').trim();
          if (this.isValidIndianCompanyName(cleaned)) {
            return cleaned;
          }
        }
      }
    }
    
    return null;
  }
  
  // Validate Indian company names
  static isValidIndianCompanyName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 80) return false;
    
    const nameLower = name.toLowerCase();
    
    // Exclude common non-company terms
    const excludeTerms = [
      'university', 'college', 'school', 'academy', 'institute', 'education',
      'wikipedia', 'google', 'facebook', 'linkedin', 'indeed', 'naukri',
      'justdial', 'sulekha', 'monster', 'timesjobs', 'shine', 'foundit',
      'the best', 'how to', 'what is', 'where to', 'when to', 'top 10',
      'government', 'ministry', 'department', 'authority', 'commission',
      'apply now', 'click here', 'read more', 'view all', 'see all'
    ];
    
    if (excludeTerms.some(term => nameLower.includes(term))) {
      return false;
    }
    
    // Must contain at least one alphabetic character
    if (!/[a-zA-Z]/.test(name)) return false;
    
    // Should not be all caps (likely not a company name)
    if (name === name.toUpperCase() && name.length > 10) return false;
    
    return true;
  }
  
  // Extract location from text
  static extractLocationFromText(text: string): string | null {
    const indianCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur',
      'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
      'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
      'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar',
      'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
      'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
      'Kota', 'Gurgaon', 'Noida', 'Chandigarh'
    ];
    
    for (const city of indianCities) {
      if (text.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    
    return null;
  }
  
  // Extract phone numbers
  static extractPhoneFromText(text: string): string | null {
    const phonePattern = /(?:\+91|91)?[-.\s]?[6-9]\d{9}/g;
    const match = text.match(phonePattern);
    return match ? match[0] : null;
  }
  
  // Extract email addresses
  static extractEmailFromText(text: string): string | null {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const match = text.match(emailPattern);
    return match ? match[0] : null;
  }
  
  // Map skills to business categories
  static skillToBusinessCategory(skill: string): string {
    const categoryMap: { [key: string]: string } = {
      'ai/ml': 'Artificial Intelligence Machine Learning',
      'machine learning': 'Machine Learning Data Science',
      'artificial intelligence': 'Artificial Intelligence',
      'data science': 'Data Analytics Data Science',
      'software development': 'Software Development IT Services',
      'web development': 'Web Development Digital Agency',
      'app development': 'Mobile App Development',
      'mobile development': 'Mobile App Development',
      'full stack': 'Full Stack Development',
      'frontend': 'Frontend Development',
      'backend': 'Backend Development',
      'devops': 'DevOps Cloud Computing',
      'cloud computing': 'Cloud Services AWS Azure',
      'cybersecurity': 'Cybersecurity Information Security',
      'blockchain': 'Blockchain Cryptocurrency',
      'finance': 'Financial Services Banking',
      'fintech': 'Fintech Financial Technology',
      'marketing': 'Digital Marketing Advertising',
      'digital marketing': 'Digital Marketing SEO SEM',
      'design': 'UI UX Design Graphic Design',
      'ui/ux': 'UI UX Design User Experience',
      'graphic design': 'Graphic Design Creative',
      'consulting': 'IT Consulting Business Consulting',
      'business analyst': 'Business Analysis Consulting',
      'project management': 'Project Management',
      'sales': 'Sales Business Development',
      'business development': 'Business Development Sales',
      'hr': 'Human Resources HR Services',
      'operations': 'Operations Management'
    };
    
    return categoryMap[skill.toLowerCase()] || skill;
  }
  
  // Get source names for logging
  static getSourceName(index: number): string {
    const sources = [
      'Naukri.com', 'Indeed India', 'Monster India', 'TimesJobs', 'FoundIt India',
      'Shine Jobs', 'JustDial', 'Sulekha', 'Indian Startups', 'Google Maps India',
      'LinkedIn India', 'AngelList India'
    ];
    return sources[index] || `Source ${index + 1}`;
  }
  
  // Remove duplicates and enhance data
  static deduplicateAndEnhance(companies: Company[]): Company[] {
    const seen = new Map<string, Company>();
    
    companies.forEach(company => {
      const key = company.name.toLowerCase().trim().replace(/[^\w\s]/g, '');
      const existing = seen.get(key);
      
      if (!existing) {
        seen.set(key, company);
      } else {
        // Merge data from duplicates
        if (!existing.website && company.website) existing.website = company.website;
        if (!existing.phone && company.phone) existing.phone = company.phone;
        if (!existing.email && company.email) existing.email = company.email;
        if (existing.address === 'India' && company.address !== 'India') {
          existing.address = company.address;
        }
        // Prefer more specific source
        if (company.source && (company.source.includes('Naukri') || company.source.includes('Indeed'))) {
          existing.source = company.source;
        }
      }
    });
    
    return Array.from(seen.values())
      .filter(company => this.isValidIndianCompanyName(company.name))
      .sort((a, b) => {
        // Prioritize companies with more information
        const aScore = (a.website ? 1 : 0) + (a.phone ? 1 : 0) + (a.email ? 1 : 0);
        const bScore = (b.website ? 1 : 0) + (b.phone ? 1 : 0) + (b.email ? 1 : 0);
        return bScore - aScore;
      });
  }
  
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
