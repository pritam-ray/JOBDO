import { Company } from '../types';

// Enhanced business search service specifically optimized for Indian markets
export class EnhancedIndianBusinessSearch {
  
  // Main search function for Indian businesses and job opportunities
  static async searchIndianBusinesses(
    location: string,
    skills: string[],
    coordinates?: { lat: number; lng: number }
  ): Promise<Company[]> {
    console.log('🏢 Starting enhanced Indian business search...');
    console.log(`📍 Location: ${location}`);
    console.log(`🎯 Skills: ${skills.join(', ')}`);
    
    const allCompanies: Company[] = [];
    
    try {
      // Run multiple Indian business directory searches in parallel
      const searchPromises = [
        this.searchJustDialBusinessDirectory(location, skills),
        this.searchSulekhaBusinessDirectory(location, skills),
        this.searchIndiaMART(location, skills),
        this.searchYellowPagesIndia(location, skills),
        this.searchTradeIndiaBusinesses(location, skills),
        this.searchIndianChamberOfCommerce(location, skills),
        this.searchStartupIndiaDatabase(location, skills),
        this.searchInvestIndiaBusinesses(location, skills),
        this.searchTechParksAndSEZs(location, skills),
        this.searchGoogleBusinessIndia(location, skills),
        this.searchLinkedInCompanyPagesIndia(location, skills),
        this.searchIndianJobPortalCompanies(location, skills)
      ];
      
      console.log('🔄 Running 12 parallel Indian business searches...');
      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result, index) => {
        const sourceName = this.getSearchSourceName(index);
        if (result.status === 'fulfilled') {
          const companies = result.value;
          if (companies.length > 0) {
            console.log(`✅ ${sourceName}: ${companies.length} businesses found`);
            allCompanies.push(...companies);
          } else {
            console.log(`⚠️ ${sourceName}: No results`);
          }
        } else {
          console.warn(`❌ ${sourceName} failed:`, result.reason);
        }
      });
      
      console.log(`📊 Total businesses collected: ${allCompanies.length}`);
      
      // Enhanced Overpass API search for physical businesses
      if (coordinates) {
        const overpassResults = await this.searchIndianOverpassBusinesses(coordinates, skills);
        allCompanies.push(...overpassResults);
      }
      
      // Remove duplicates and enhance data
      const uniqueCompanies = this.deduplicateAndEnhanceIndianData(allCompanies);
      console.log(`🎯 Unique businesses after processing: ${uniqueCompanies.length}`);
      
      return uniqueCompanies;
      
    } catch (error) {
      console.error('❌ Enhanced Indian business search failed:', error);
      return [];
    }
  }
  
  // 1. JustDial Business Directory (Major Indian business directory)
  static async searchJustDialBusinessDirectory(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 3)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        // Search using DuckDuckGo for JustDial listings
        const searchResults = await this.searchWithDuckDuckGo(
          `site:justdial.com "${businessCategory}" "${location}" -job -jobs -career -recruitment`,
          'JustDial Directory'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('JustDial search failed:', error);
    }
    
    return companies;
  }
  
  // 2. Sulekha Business Directory
  static async searchSulekhaBusinessDirectory(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        const searchResults = await this.searchWithDuckDuckGo(
          `site:sulekha.com "${businessCategory}" "${location}" business -matrimonial -classifieds`,
          'Sulekha Directory'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Sulekha search failed:', error);
    }
    
    return companies;
  }
  
  // 3. IndiaMART Business Directory
  static async searchIndiaMART(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        const searchResults = await this.searchWithDuckDuckGo(
          `site:indiamart.com "${businessCategory}" suppliers "${location}" -product -buy`,
          'IndiaMART'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('IndiaMART search failed:', error);
    }
    
    return companies;
  }
  
  // 4. Yellow Pages India
  static async searchYellowPagesIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        const searchResults = await this.searchWithDuckDuckGo(
          `site:yellowpages.co.in "${businessCategory}" "${location}"`,
          'Yellow Pages India'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Yellow Pages India search failed:', error);
    }
    
    return companies;
  }
  
  // 5. TradeIndia Business Directory
  static async searchTradeIndiaBusinesses(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        const searchResults = await this.searchWithDuckDuckGo(
          `site:tradeindia.com "${businessCategory}" companies "${location}"`,
          'TradeIndia'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('TradeIndia search failed:', error);
    }
    
    return companies;
  }
  
  // 6. Indian Chamber of Commerce and Industry associations
  static async searchIndianChamberOfCommerce(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `"${skill}" companies "${location}" site:indianchamber.org OR site:cii.in OR site:ficci.in OR site:assocham.org`,
          'Chamber of Commerce'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Chamber of Commerce search failed:', error);
    }
    
    return companies;
  }
  
  // 7. Startup India Database
  static async searchStartupIndiaDatabase(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:startupindia.gov.in "${skill}" startups "${location}"`,
          'Startup India'
        );
        companies.push(...searchResults);
        
        // Also search startup ecosystems
        const ecosystemResults = await this.searchWithDuckDuckGo(
          `"${skill}" startups "${location}" India incubator accelerator`,
          'Startup Ecosystem'
        );
        companies.push(...ecosystemResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Startup India search failed:', error);
    }
    
    return companies;
  }
  
  // 8. Invest India Business Database
  static async searchInvestIndiaBusinesses(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:investindia.gov.in "${skill}" companies "${location}"`,
          'Invest India'
        );
        companies.push(...searchResults);
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Invest India search failed:', error);
    }
    
    return companies;
  }
  
  // 9. Tech Parks and SEZs (Special Economic Zones)
  static async searchTechParksAndSEZs(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        // Search for tech parks and IT hubs
        const techParkResults = await this.searchWithDuckDuckGo(
          `"${skill}" companies "${location}" tech park IT park SEZ "cyber city" "IT hub"`,
          'Tech Parks'
        );
        companies.push(...techParkResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Tech Parks search failed:', error);
    }
    
    return companies;
  }
  
  // 10. Google Business India
  static async searchGoogleBusinessIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.mapSkillToIndianBusinessCategory(skill);
        
        const searchResults = await this.searchWithDuckDuckGo(
          `"${businessCategory}" companies "${location}" India contact phone email`,
          'Google Business India'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('Google Business India search failed:', error);
    }
    
    return companies;
  }
  
  // 11. LinkedIn Company Pages India
  static async searchLinkedInCompanyPagesIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchResults = await this.searchWithDuckDuckGo(
          `site:linkedin.com/company "${skill}" companies "${location}" India`,
          'LinkedIn India'
        );
        companies.push(...searchResults);
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('LinkedIn India search failed:', error);
    }
    
    return companies;
  }
  
  // 12. Indian Job Portal Companies
  static async searchIndianJobPortalCompanies(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        // Extract companies from job postings
        const naukriResults = await this.searchWithDuckDuckGo(
          `site:naukri.com "${skill}" "${location}" company profile`,
          'Naukri Companies'
        );
        companies.push(...naukriResults);
        
        const indeedResults = await this.searchWithDuckDuckGo(
          `site:indeed.co.in "${skill}" "${location}" company`,
          'Indeed India Companies'
        );
        companies.push(...indeedResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Job portal companies search failed:', error);
    }
    
    return companies;
  }
  
  // Enhanced Overpass API search for Indian businesses
  static async searchIndianOverpassBusinesses(
    coordinates: { lat: number; lng: number },
    skills: string[]
  ): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const { lat, lng } = coordinates;
      
      // Build comprehensive query for Indian businesses
      let query = `[out:json][timeout:30];(`;
      
      // Search for IT companies and offices (common in India)
      query += `node["name"]["office"~"IT|software|tech|computer|system|solution|service|digital|web|app|data|analytics|consulting|development"i](around:15000,${lat},${lng});`;
      query += `way["name"]["office"~"IT|software|tech|computer|system|solution|service|digital|web|app|data|analytics|consulting|development"i](around:15000,${lat},${lng});`;
      
      // Search for buildings with business names
      query += `node["name"]["building"="office"](around:15000,${lat},${lng});`;
      query += `way["name"]["building"="office"](around:15000,${lat},${lng});`;
      query += `node["name"]["building"="commercial"](around:15000,${lat},${lng});`;
      query += `way["name"]["building"="commercial"](around:15000,${lat},${lng});`;
      
      // Search for Indian business name patterns
      query += `node["name"~"(pvt|ltd|limited|private|corporation|corp|company|enterprises|group|associates|partners|consulting|advisory|technologies|infotech|solutions|systems|services)"i](around:15000,${lat},${lng});`;
      query += `way["name"~"(pvt|ltd|limited|private|corporation|corp|company|enterprises|group|associates|partners|consulting|advisory|technologies|infotech|solutions|systems|services)"i](around:15000,${lat},${lng});`;
      
      query += `);out center meta;`;
      
      console.log('🗺️ Enhanced Overpass query for Indian businesses');
      
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
          
          if (tags.name && this.isValidIndianBusinessName(tags.name)) {
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
              id: `enhanced-overpass-${index}`,
              name: tags.name,
              address: address,
              phone: tags.phone || tags['contact:phone'] || undefined,
              email: tags.email || tags['contact:email'] || undefined,
              website: tags.website || tags['contact:website'] || undefined,
              category: 'Indian Business',
              lat: lat || 0,
              lng: lng || 0,
              placeId: `enhanced-overpass-${element.id}`,
              businessStatus: 'operational',
              source: 'Enhanced Overpass API'
            });
          }
        });
      }
    } catch (error) {
      console.warn('Enhanced Overpass search failed:', error);
    }
    
    return companies;
  }
  
  // Enhanced DuckDuckGo search with better company extraction
  static async searchWithDuckDuckGo(query: string, source: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(duckUrl);
      const data = await response.json();
      
      // Process main results with enhanced extraction
      if (data.Results) {
        data.Results.forEach((result: any, index: number) => {
          const company = this.extractEnhancedCompanyInfo(result, source, index);
          if (company) companies.push(company);
        });
      }
      
      // Process related topics
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            const company = this.extractEnhancedCompanyInfo(topic, source, index + 1000);
            if (company) companies.push(company);
          }
        });
      }
      
    } catch (error) {
      console.warn(`Enhanced DuckDuckGo search failed for ${source}:`, error);
    }
    
    return companies;
  }
  
  // Enhanced company information extraction
  static extractEnhancedCompanyInfo(result: any, source: string, index: number): Company | null {
    if (!result.Text) return null;
    
    const text = result.Text;
    const url = result.FirstURL || '';
    
    // Enhanced company name extraction for Indian businesses
    const companyName = this.extractEnhancedIndianCompanyName(text);
    if (!companyName) return null;
    
    // Extract enhanced location information
    const location = this.extractEnhancedLocationInfo(text);
    
    // Extract contact information
    const phone = this.extractIndianPhoneNumber(text);
    const email = this.extractEmailAddress(text);
    const website = this.extractWebsiteUrl(text, url);
    
    return {
      id: `${source.replace(/\s+/g, '').toLowerCase()}-enhanced-${index}`,
      name: companyName,
      address: location || 'India',
      phone: phone || undefined,
      email: email || undefined,
      website: website || undefined,
      category: 'Indian Business Enhanced',
      lat: 0,
      lng: 0,
      placeId: `enhanced-indian-${Date.now()}-${index}`,
      businessStatus: 'operational',
      source: source
    };
  }
  
  // Enhanced Indian company name extraction
  static extractEnhancedIndianCompanyName(text: string): string | null {
    if (!text) return null;
    
    const patterns = [
      // Indian legal entities with better context
      /([A-Z][a-zA-Z\s&.,'-]{2,40}(?:\s(?:Pvt\.?\s?Ltd\.?|Private\s?Limited|Ltd\.?|Limited|Pvt\s?Ltd|Private\s?Ltd)))(?=[\s.,!?]|$)/gi,
      // Technology and service companies
      /([A-Z][a-zA-Z\s&.,'-]{2,40}(?:\s(?:Technologies|Tech|Infotech|Software|Solutions|Systems|Services|Consultancy|Digital|Innovation|Labs|Works|Studios|Dynamics|Analytics|Intelligence)))(?=[\s.,!?]|$)/gi,
      // Business entities
      /([A-Z][a-zA-Z\s&.,'-]{2,40}(?:\s(?:Corporation|Corp|Company|Co\.?|Enterprises|Group|Associates|Partners|Consulting|Advisory|Holdings|Ventures)))(?=[\s.,!?]|$)/gi,
      // Context-based extraction (company mentioned in business context)
      /(?:at|with|join|founded|established|based|located)\s+([A-Z][a-zA-Z\s&.,'-]{3,40})(?:\s(?:is|was|has|will|offers|provides|specializes))/gi,
      // Job posting context
      /([A-Z][a-zA-Z\s&.,'-]{3,40})(?:\s(?:is\s)?(?:hiring|recruiting|looking\s+for|seeking|inviting|offering))/gi
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const cleaned = match
            .replace(/(?:at|with|join|founded|established|based|located|is|was|has|will|offers|provides|specializes|hiring|recruiting|looking\s+for|seeking|inviting|offering)/gi, '')
            .trim();
          
          if (this.isValidIndianBusinessName(cleaned)) {
            return cleaned;
          }
        }
      }
    }
    
    return null;
  }
  
  // Enhanced validation for Indian business names
  static isValidIndianBusinessName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 80) return false;
    
    const nameLower = name.toLowerCase();
    
    // Enhanced exclusion list
    const excludeTerms = [
      'university', 'college', 'school', 'academy', 'institute', 'education',
      'wikipedia', 'google', 'facebook', 'linkedin', 'indeed', 'naukri',
      'justdial', 'sulekha', 'monster', 'timesjobs', 'shine', 'foundit',
      'the best', 'how to', 'what is', 'where to', 'when to', 'top 10',
      'government', 'ministry', 'department', 'authority', 'commission',
      'apply now', 'click here', 'read more', 'view all', 'see all',
      'bank of', 'reserve bank', 'state bank', 'central bank',
      'hospital', 'medical', 'clinic', 'healthcare', 'pharmacy'
    ];
    
    if (excludeTerms.some(term => nameLower.includes(term))) {
      return false;
    }
    
    // Must contain at least one alphabetic character
    if (!/[a-zA-Z]/.test(name)) return false;
    
    // Should not be all caps unless it's a short acronym
    if (name === name.toUpperCase() && name.length > 6) return false;
    
    // Should contain typical business indicators
    const businessIndicators = [
      'pvt', 'ltd', 'limited', 'private', 'corporation', 'corp', 'company',
      'enterprises', 'group', 'associates', 'partners', 'consulting',
      'technologies', 'tech', 'infotech', 'software', 'solutions',
      'systems', 'services', 'digital', 'innovation'
    ];
    
    const hasBusinessIndicator = businessIndicators.some(indicator => 
      nameLower.includes(indicator)
    );
    
    return hasBusinessIndicator || name.length <= 30;
  }
  
  // Enhanced location extraction for Indian addresses
  static extractEnhancedLocationInfo(text: string): string | null {
    const indianLocationPatterns = [
      // City, State pattern
      /([A-Z][a-zA-Z\s]+),\s*([A-Z][a-zA-Z\s]+),?\s*India/gi,
      // Indian cities with pin codes
      /([A-Z][a-zA-Z\s]+)\s*-?\s*(\d{6})/gi,
      // Major Indian cities
      /(Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Chennai|Kolkata|Pune|Jaipur|Ahmedabad|Surat|Lucknow|Kanpur|Nagpur|Indore|Thane|Bhopal|Visakhapatnam|Patna|Vadodara|Ghaziabad|Ludhiana|Agra|Nashik|Faridabad|Meerut|Rajkot|Varanasi|Srinagar|Aurangabad|Dhanbad|Amritsar|Allahabad|Ranchi|Howrah|Coimbatore|Jabalpur|Gwalior|Vijayawada|Jodhpur|Madurai|Raipur|Kota|Gurgaon|Gurugram|Noida|Chandigarh)/gi
    ];
    
    for (const pattern of indianLocationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return null;
  }
  
  // Extract Indian phone numbers
  static extractIndianPhoneNumber(text: string): string | null {
    const phonePatterns = [
      /\+91[-.\s]?[6-9]\d{9}/g,
      /91[-.\s]?[6-9]\d{9}/g,
      /[6-9]\d{9}/g,
      /0\d{2,4}[-.\s]?\d{6,8}/g  // Landline numbers
    ];
    
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return null;
  }
  
  // Extract email addresses
  static extractEmailAddress(text: string): string | null {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const match = text.match(emailPattern);
    return match ? match[0] : null;
  }
  
  // Extract website URLs
  static extractWebsiteUrl(text: string, fallbackUrl: string): string | null {
    const urlPattern = /https?:\/\/[^\s<>"']+/g;
    const match = text.match(urlPattern);
    return match ? match[0] : (fallbackUrl || null);
  }
  
  // Map skills to Indian business categories
  static mapSkillToIndianBusinessCategory(skill: string): string {
    const categoryMap: { [key: string]: string } = {
      'ai/ml': 'Artificial Intelligence Machine Learning Data Science',
      'machine learning': 'Machine Learning Data Analytics AI',
      'artificial intelligence': 'AI Artificial Intelligence ML',
      'data science': 'Data Science Analytics Big Data',
      'software development': 'Software Development IT Services Programming',
      'web development': 'Web Development Digital Services Website Design',
      'app development': 'Mobile App Development iOS Android',
      'mobile development': 'Mobile Development App Development',
      'full stack': 'Full Stack Development Web Development',
      'frontend': 'Frontend Development UI Development',
      'backend': 'Backend Development Server Development',
      'devops': 'DevOps Cloud Computing Infrastructure',
      'cloud computing': 'Cloud Services AWS Azure Google Cloud',
      'cybersecurity': 'Cybersecurity Information Security',
      'blockchain': 'Blockchain Cryptocurrency FinTech',
      'finance': 'Financial Services Banking Investment',
      'fintech': 'FinTech Financial Technology Banking',
      'marketing': 'Digital Marketing Advertising Brand',
      'digital marketing': 'Digital Marketing SEO SEM Social Media',
      'design': 'Design UI UX Graphic Design Creative',
      'ui/ux': 'UI UX Design User Experience Interface',
      'graphic design': 'Graphic Design Creative Visual Design',
      'consulting': 'IT Consulting Business Consulting Advisory',
      'business analyst': 'Business Analysis Consulting Strategy',
      'project management': 'Project Management Program Management',
      'sales': 'Sales Business Development Marketing',
      'business development': 'Business Development Sales Growth',
      'hr': 'Human Resources HR Services Recruitment',
      'operations': 'Operations Management Supply Chain'
    };
    
    return categoryMap[skill.toLowerCase()] || skill;
  }
  
  // Get search source names
  static getSearchSourceName(index: number): string {
    const sources = [
      'JustDial Directory', 'Sulekha Directory', 'IndiaMART', 'Yellow Pages India',
      'TradeIndia', 'Chamber of Commerce', 'Startup India', 'Invest India',
      'Tech Parks & SEZs', 'Google Business India', 'LinkedIn India', 'Job Portal Companies'
    ];
    return sources[index] || `Enhanced Source ${index + 1}`;
  }
  
  // Advanced deduplication and data enhancement
  static deduplicateAndEnhanceIndianData(companies: Company[]): Company[] {
    const seen = new Map<string, Company>();
    
    companies.forEach(company => {
      // Create a normalized key for deduplication
      const normalizedName = company.name
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const key = normalizedName;
      const existing = seen.get(key);
      
      if (!existing) {
        seen.set(key, company);
      } else {
        // Merge information from duplicates
        if (!existing.website && company.website) existing.website = company.website;
        if (!existing.phone && company.phone) existing.phone = company.phone;
        if (!existing.email && company.email) existing.email = company.email;
        if (existing.address === 'India' && company.address !== 'India') {
          existing.address = company.address;
        }
        
        // Prefer sources with more detailed information
        const sourcePreference = [
          'JustDial Directory', 'LinkedIn India', 'Google Business India',
          'Sulekha Directory', 'Chamber of Commerce', 'Startup India'
        ];
        
        if (company.source && sourcePreference.includes(company.source)) {
          existing.source = company.source;
        }
      }
    });
    
    return Array.from(seen.values())
      .filter(company => this.isValidIndianBusinessName(company.name))
      .sort((a, b) => {
        // Sort by completeness of information
        const aScore = 
          (a.website ? 2 : 0) + 
          (a.phone ? 2 : 0) + 
          (a.email ? 2 : 0) + 
          (a.address !== 'India' ? 1 : 0);
        
        const bScore = 
          (b.website ? 2 : 0) + 
          (b.phone ? 2 : 0) + 
          (b.email ? 2 : 0) + 
          (b.address !== 'India' ? 1 : 0);
        
        return bScore - aScore;
      })
      .slice(0, 50); // Return top 50 most complete results
  }
  
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
