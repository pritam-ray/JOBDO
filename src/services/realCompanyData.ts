import { Company } from '../types';

// Real company data service using public APIs
export class RealCompanyService {
  
  // Search for real companies using multiple public data sources
  static async searchRealCompanies(
    location: string,
    coordinates: { lat: number; lng: number },
    skills: string[],
    radius: number = 25
  ): Promise<Company[]> {
    console.log('🏢 Searching for real companies...');
    
    const allCompanies: Company[] = [];
    
    try {
      // Run multiple real data searches
      const searchPromises = [
        this.searchOpenCorporates(location, skills),
        this.searchCompanyHouse(location, skills),
        this.searchCrunchbasePublic(location, skills),
        this.searchYellowPagesReal(location, skills),
        this.searchGoogleBusinessAPI(coordinates, skills, radius)
      ];
      
      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ Real data source ${index + 1}: ${result.value.length} companies`);
          allCompanies.push(...result.value);
        } else {
          console.warn(`❌ Real data source ${index + 1} failed:`, result.reason);
        }
      });
      
      // Remove duplicates and return
      return this.deduplicateCompanies(allCompanies);
      
    } catch (error) {
      console.error('Real company search error:', error);
      return [];
    }
  }
  
  // 1. OpenCorporates - Public company registry data
  static async searchOpenCorporates(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // OpenCorporates has a free API tier
      const baseUrl = 'https://api.opencorporates.com/v0.4/companies/search';
      
      for (const skill of skills.slice(0, 3)) {
        const searchTerm = encodeURIComponent(`${skill} ${location}`);
        const url = `${baseUrl}?q=${searchTerm}&format=json&order=score&per_page=10`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          
          if (data.results?.companies) {
            data.results.companies.forEach((companyData: any, index: number) => {
              const company = companyData.company;
              if (company && company.name) {
                companies.push({
                  id: `opencorp-${skill}-${index}`,
                  name: company.name,
                  address: `${company.registered_address_in_full || location}`,
                  category: `${skill} Company`,
                  lat: 0,
                  lng: 0,
                  placeId: `opencorp-${company.company_number || Date.now()}`,
                  businessStatus: company.current_status || 'operational',
                  source: 'OpenCorporates',
                  website: company.registry_url
                });
              }
            });
          }
        }
        
        // Rate limiting
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('OpenCorporates search failed:', error);
    }
    
    return companies;
  }
  
  // 2. Companies House (UK) - Real company data
  static async searchCompanyHouse(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Companies House has free API access
      const baseUrl = 'https://api.company-information.service.gov.uk/search/companies';
      
      for (const skill of skills.slice(0, 2)) {
        const searchTerm = encodeURIComponent(`${skill} ${location}`);
        const url = `${baseUrl}?q=${searchTerm}&items_per_page=10`;
        
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            if (data.items) {
              data.items.forEach((company: any, index: number) => {
                if (company.title && company.company_status === 'active') {
                  companies.push({
                    id: `companieshouse-${skill}-${index}`,
                    name: company.title,
                    address: company.address_snippet || location,
                    category: `${skill} Business`,
                    lat: 0,
                    lng: 0,
                    placeId: `ch-${company.company_number}`,
                    businessStatus: 'operational',
                    source: 'Companies House UK'
                  });
                }
              });
            }
          }
        } catch (fetchError) {
          console.warn(`Companies House API not accessible: ${fetchError}`);
        }
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Companies House search failed:', error);
    }
    
    return companies;
  }
  
  // 3. Crunchbase Public Data
  static async searchCrunchbasePublic(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Use public Crunchbase data through web search
      for (const skill of skills.slice(0, 2)) {
        const searchQuery = `site:crunchbase.com "${skill}" companies "${location}"`;
        const searchResults = await this.performWebSearch(searchQuery, 'Crunchbase');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Crunchbase search failed:', error);
    }
    
    return companies;
  }
  
  // 4. Real Yellow Pages scraping
  static async searchYellowPagesReal(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.skillToBusinessCategory(skill);
        
        // Use DuckDuckGo to search Yellow Pages
        const searchQuery = `site:yellowpages.com "${businessCategory}" "${location}"`;
        const searchResults = await this.performWebSearch(searchQuery, 'Yellow Pages');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Yellow Pages search failed:', error);
    }
    
    return companies;
  }
  
  // 5. Google Business API alternative (using public data)
  static async searchGoogleBusinessAPI(
    coordinates: { lat: number; lng: number },
    skills: string[],
    radius: number
  ): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Since we don't have Google API key, use alternative approaches
      for (const skill of skills.slice(0, 2)) {
        const businessType = this.skillToBusinessCategory(skill);
        
        // Search for businesses using web search
        const searchQuery = `"${businessType}" near "${coordinates.lat},${coordinates.lng}" -university -college`;
        const searchResults = await this.performWebSearch(searchQuery, 'Google Business');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Google Business search failed:', error);
    }
    
    return companies;
  }
  
  // Perform web search using DuckDuckGo API
  static async performWebSearch(query: string, source: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(duckUrl);
      const data = await response.json();
      
      // Process search results
      if (data.Results) {
        data.Results.forEach((result: any, index: number) => {
          const companyName = this.extractCompanyName(result.Text);
          if (companyName) {
            companies.push({
              id: `websearch-${source.replace(/\s+/g, '')}-${index}`,
              name: companyName,
              address: 'Web Search Result',
              category: 'Business',
              lat: 0,
              lng: 0,
              placeId: `websearch-${Date.now()}-${index}`,
              businessStatus: 'operational',
              source: source,
              website: result.FirstURL
            });
          }
        });
      }
      
      // Also check RelatedTopics
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            const companyName = this.extractCompanyName(topic.Text);
            if (companyName) {
              companies.push({
                id: `websearch-related-${index}`,
                name: companyName,
                address: 'Web Search Result',
                category: 'Business',
                lat: 0,
                lng: 0,
                placeId: `websearch-related-${Date.now()}-${index}`,
                businessStatus: 'operational',
                source: source,
                website: topic.FirstURL
              });
            }
          }
        });
      }
    } catch (error) {
      console.warn(`Web search failed for ${source}:`, error);
    }
    
    return companies;
  }
  
  // Helper methods
  static skillToBusinessCategory(skill: string): string {
    const categoryMap: { [key: string]: string } = {
      'software development': 'Software Development Companies',
      'web development': 'Web Development Agencies',
      'ai/ml': 'AI Technology Companies',
      'data science': 'Data Analytics Companies',
      'finance': 'Financial Services',
      'marketing': 'Marketing Agencies',
      'design': 'Design Studios',
      'engineering': 'Engineering Firms',
      'consulting': 'Business Consulting',
      'healthcare': 'Healthcare Technology',
      'legal': 'Law Firms',
      'education': 'Educational Technology',
      'retail': 'Retail Companies',
      'automotive': 'Automotive Companies'
    };
    
    return categoryMap[skill.toLowerCase()] || `${skill} Companies`;
  }
  
  static extractCompanyName(text: string): string | null {
    if (!text) return null;
    
    // More sophisticated company name extraction
    const patterns = [
      // Company with legal endings
      /([A-Z][a-zA-Z\s&.,'-]+(?:\s(?:Inc|LLC|Corp|Corporation|Ltd|Limited|Company|Co|Technologies|Tech|Systems|Solutions|Group|Enterprises|Associates|Partners|Consulting|Services)\.?))/g,
      // Tech companies
      /([A-Z][a-zA-Z]+(?:Tech|Labs|Soft|Works|Digital|Data|Cloud|AI|Systems|Solutions))/g,
      // Professional services
      /([A-Z][a-zA-Z\s]+(?:Law|Legal|Consulting|Advisory|Partners|Associates))/g,
      // Simple company names
      /([A-Z][a-zA-Z\s]{3,40}(?=\s(?:is|was|provides|offers|specializes|founded)))/g
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const company = matches[0].trim();
        if (this.isValidCompanyName(company)) {
          return company;
        }
      }
    }
    
    return null;
  }
  
  static isValidCompanyName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 100) return false;
    
    // Exclude obvious non-company terms
    const excludeTerms = [
      'university', 'college', 'school', 'academy', 'institute',
      'wikipedia', 'google', 'facebook', 'linkedin', 'indeed',
      'the best', 'how to', 'what is', 'where to', 'when to'
    ];
    
    const nameLower = name.toLowerCase();
    return !excludeTerms.some(term => nameLower.includes(term));
  }
  
  static deduplicateCompanies(companies: Company[]): Company[] {
    const seen = new Map<string, Company>();
    
    companies.forEach(company => {
      const key = company.name.toLowerCase().trim();
      const existing = seen.get(key);
      
      if (!existing) {
        seen.set(key, company);
      } else {
        // Merge data from duplicates
        if (!existing.website && company.website) {
          existing.website = company.website;
        }
        if (existing.address === 'Web Search Result' && company.address !== 'Web Search Result') {
          existing.address = company.address;
        }
      }
    });
    
    return Array.from(seen.values());
  }
  
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
