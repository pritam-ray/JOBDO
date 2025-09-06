import { Company } from '../types';

// Indian company search service
export class IndianCompanyService {
  
  // Search for companies in Indian cities using India-specific sources
  static async searchIndianCompanies(
    location: string,
    skills: string[],
    coordinates?: { lat: number; lng: number }
  ): Promise<Company[]> {
    console.log('🇮🇳 Searching Indian companies...');
    
    const allCompanies: Company[] = [];
    
    try {
      // Run India-specific searches
      const searchPromises = [
        this.searchNaukriCom(location, skills),
        this.searchIndeedIndia(location, skills),
        this.searchJustDialIndia(location, skills),
        this.searchLinkedInIndia(location, skills),
        this.searchStartupIndiaDatabase(location, skills),
        this.searchIndiaMART(location, skills)
      ];
      
      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ Indian source ${index + 1}: ${result.value.length} companies`);
          allCompanies.push(...result.value);
        } else {
          console.warn(`❌ Indian source ${index + 1} failed:`, result.reason);
        }
      });
      
      return this.deduplicateCompanies(allCompanies);
      
    } catch (error) {
      console.error('Indian company search error:', error);
      return this.getFallbackIndianCompanies(location, skills);
    }
  }
  
  // 1. Naukri.com - India's largest job portal
  static async searchNaukriCom(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchQuery = `site:naukri.com "${skill}" jobs "${location}" -university -college`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'Naukri.com');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Naukri.com search failed:', error);
    }
    
    return companies;
  }
  
  // 2. Indeed India
  static async searchIndeedIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchQuery = `site:indeed.co.in "${skill}" jobs "${location}" -university -college`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'Indeed India');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Indeed India search failed:', error);
    }
    
    return companies;
  }
  
  // 3. JustDial - Indian business directory
  static async searchJustDialIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.skillToIndianBusinessCategory(skill);
        const searchQuery = `site:justdial.com "${businessCategory}" "${location}"`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'JustDial');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('JustDial search failed:', error);
    }
    
    return companies;
  }
  
  // 4. LinkedIn India
  static async searchLinkedInIndia(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchQuery = `site:linkedin.com/company "${skill}" "${location}" India -university -college`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'LinkedIn India');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('LinkedIn India search failed:', error);
    }
    
    return companies;
  }
  
  // 5. Startup India Database
  static async searchStartupIndiaDatabase(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const searchQuery = `"${skill}" startups "${location}" India -university -college`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'Indian Startups');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Startup India search failed:', error);
    }
    
    return companies;
  }
  
  // 6. IndiaMART - B2B marketplace
  static async searchIndiaMART(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const businessCategory = this.skillToIndianBusinessCategory(skill);
        const searchQuery = `site:indiamart.com "${businessCategory}" "${location}"`;
        const searchResults = await this.performIndianWebSearch(searchQuery, 'IndiaMART');
        companies.push(...searchResults);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('IndiaMART search failed:', error);
    }
    
    return companies;
  }
  
  // Perform web search using DuckDuckGo with India-specific terms
  static async performIndianWebSearch(query: string, source: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(duckUrl);
      const data = await response.json();
      
      // Process search results
      if (data.Results) {
        data.Results.forEach((result: any, index: number) => {
          const companyName = this.extractIndianCompanyName(result.Text);
          if (companyName) {
            companies.push({
              id: `indian-${source.replace(/\s+/g, '')}-${index}`,
              name: companyName,
              address: 'India',
              category: 'Indian Company',
              lat: 0,
              lng: 0,
              placeId: `indian-${Date.now()}-${index}`,
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
            const companyName = this.extractIndianCompanyName(topic.Text);
            if (companyName) {
              companies.push({
                id: `indian-related-${index}`,
                name: companyName,
                address: 'India',
                category: 'Indian Company',
                lat: 0,
                lng: 0,
                placeId: `indian-related-${Date.now()}-${index}`,
                businessStatus: 'operational',
                source: source,
                website: topic.FirstURL
              });
            }
          }
        });
      }
    } catch (error) {
      console.warn(`Indian web search failed for ${source}:`, error);
    }
    
    return companies;
  }
  
  // Helper methods
  static skillToIndianBusinessCategory(skill: string): string {
    const categoryMap: { [key: string]: string } = {
      'ai/ml': 'Artificial Intelligence Companies',
      'machine learning': 'Machine Learning Companies',
      'software development': 'Software Development Companies',
      'web development': 'Web Development Companies',
      'app development': 'Mobile App Development',
      'data science': 'Data Analytics Companies',
      'finance': 'Financial Services',
      'fintech': 'Fintech Companies',
      'marketing': 'Digital Marketing Agencies',
      'design': 'Design Studios',
      'consulting': 'IT Consulting',
      'cybersecurity': 'Cybersecurity Companies',
      'cloud computing': 'Cloud Services',
      'blockchain': 'Blockchain Companies'
    };
    
    return categoryMap[skill.toLowerCase()] || `${skill} Companies`;
  }
  
  static extractIndianCompanyName(text: string): string | null {
    if (!text) return null;
    
    // Indian company name patterns
    const patterns = [
      // Indian company suffixes
      /([A-Z][a-zA-Z\s&.,'-]+(?:\s(?:Pvt\.?\s?Ltd\.?|Private\s?Limited|Ltd\.?|Limited|Technologies|Tech|Solutions|Systems|Services|Consultancy|Consulting|Software|Infotech|Corporation|Corp|Company|Co\.?)))/gi,
      // Indian tech companies
      /([A-Z][a-zA-Z\s]+(?:Technologies|Tech|Infotech|Software|Solutions|Systems|Services|Consultancy|Digital|Innovation))/gi,
      // Generic patterns
      /([A-Z][a-zA-Z\s]{3,40}(?=\s(?:is|was|provides|offers|based|located|founded|established)))/gi
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const company = matches[0].trim();
        if (this.isValidIndianCompanyName(company)) {
          return company;
        }
      }
    }
    
    return null;
  }
  
  static isValidIndianCompanyName(name: string): boolean {
    if (!name || name.length < 3 || name.length > 100) return false;
    
    // Exclude obvious non-company terms
    const excludeTerms = [
      'university', 'college', 'school', 'academy', 'institute',
      'wikipedia', 'google', 'facebook', 'linkedin', 'indeed',
      'naukri', 'justdial', 'indiamart',
      'the best', 'how to', 'what is', 'where to', 'when to',
      'government', 'ministry', 'department'
    ];
    
    const nameLower = name.toLowerCase();
    return !excludeTerms.some(term => nameLower.includes(term));
  }
  
  // Fallback: Known Indian companies for different skills
  static getFallbackIndianCompanies(location: string, skills: string[]): Company[] {
    const companies: Company[] = [];
    
    const indianCompanies = this.getKnownIndianCompanies();
    
    skills.forEach(skill => {
      const skillCompanies = indianCompanies[skill.toLowerCase()] || [];
      skillCompanies.forEach((companyName, index) => {
        companies.push({
          id: `fallback-${skill}-${index}`,
          name: companyName,
          address: `${location}, India`,
          category: `${skill} Company`,
          lat: 0,
          lng: 0,
          placeId: `fallback-${Date.now()}-${index}`,
          businessStatus: 'operational',
          source: 'Known Indian Companies'
        });
      });
    });
    
    return companies.slice(0, 20); // Limit fallback results
  }
  
  static getKnownIndianCompanies(): { [key: string]: string[] } {
    return {
      'ai/ml': [
        'Fractal Analytics',
        'Mu Sigma',
        'Tredence',
        'LatentView Analytics',
        'Tiger Analytics',
        'Sigmoid Analytics',
        'Crayon Data',
        'Mad Street Den',
        'Flutura Decision Sciences',
        'Haptik (Jio Haptik)'
      ],
      'software development': [
        'Infosys',
        'TCS (Tata Consultancy Services)',
        'Wipro',
        'HCL Technologies',
        'Tech Mahindra',
        'Mindtree',
        'Mphasis',
        'L&T Infotech',
        'Cyient',
        'Persistent Systems'
      ],
      'web development': [
        'Zomato',
        'Swiggy',
        'Paytm',
        'Flipkart',
        'MakeMyTrip',
        'OYO',
        'Freshworks',
        'Zoho',
        'InMobi',
        'Razorpay'
      ],
      'fintech': [
        'Paytm',
        'Razorpay',
        'PhonePe',
        'PolicyBazaar',
        'Zerodha',
        'CRED',
        'BharatPe',
        'Mobikwik',
        'Pine Labs',
        'Lendingkart'
      ],
      'data science': [
        'Fractal Analytics',
        'Mu Sigma',
        'LatentView Analytics',
        'Tiger Analytics',
        'Tredence',
        'Sigmoid Analytics',
        'Bridgei2i',
        'Course5 Intelligence',
        'Absolutdata',
        'Praxis Global Alliance'
      ]
    };
  }
  
  static deduplicateCompanies(companies: Company[]): Company[] {
    const seen = new Map<string, Company>();
    
    companies.forEach(company => {
      const key = company.name.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.set(key, company);
      }
    });
    
    return Array.from(seen.values());
  }
  
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
