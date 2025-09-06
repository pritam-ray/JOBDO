import { Company } from '../types';

// Real web scraping service for job and business data
export class WebScrapingService {
  
  // Main function to scrape companies from multiple sources
  static async scrapeCompanies(
    location: string,
    skills: string[],
    coordinates?: { lat: number; lng: number }
  ): Promise<Company[]> {
    console.log('🕷️ Starting web scraping for real companies...');
    
    const allCompanies: Company[] = [];
    
    // Run scrapers in parallel
    const scrapingPromises = [
      this.scrapeIndeedCompanies(location, skills),
      this.scrapeLinkedInJobs(location, skills),
      this.scrapeGlassdoorCompanies(location, skills),
      this.scrapeAngelListStartups(location, skills),
      this.scrapeRemoteOKCompanies(skills),
      this.scrapeStackOverflowJobs(location, skills),
      this.scrapeWellfoundStartups(location, skills),
      this.scrapeCompanyWebsites(location, skills)
    ];
    
    try {
      const results = await Promise.allSettled(scrapingPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allCompanies.push(...result.value);
        } else {
          console.warn(`Scraper ${index + 1} failed:`, result.reason);
        }
      });
      
      return this.deduplicateAndEnhance(allCompanies);
    } catch (error) {
      console.error('Web scraping error:', error);
      return [];
    }
  }
  
  // 1. Scrape Indeed for company data from job listings
  static async scrapeIndeedCompanies(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 3)) { // Limit to avoid rate limiting
        const searchQuery = encodeURIComponent(`${skill} jobs`);
        const locationQuery = encodeURIComponent(location);
        
        // Use a CORS proxy to scrape Indeed
        const indeedUrl = `https://www.indeed.com/jobs?q=${searchQuery}&l=${locationQuery}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(indeedUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
          const companies_found = this.parseIndeedHTML(data.contents, skill);
          companies.push(...companies_found);
        }
        
        // Add delay to avoid rate limiting
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Indeed scraping failed:', error);
    }
    
    return companies;
  }
  
  // 2. Scrape LinkedIn job postings for company data
  static async scrapeLinkedInJobs(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        // LinkedIn job search URL
        const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`;
        
        // Use alternative scraping approach
        const companies_found = await this.scrapeWithSearchEngine('linkedin.com/jobs', skill, location);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('LinkedIn scraping failed:', error);
    }
    
    return companies;
  }
  
  // 3. Scrape Glassdoor for company information
  static async scrapeGlassdoorCompanies(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const companies_found = await this.scrapeWithSearchEngine('glassdoor.com/Jobs', skill, location);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Glassdoor scraping failed:', error);
    }
    
    return companies;
  }
  
  // 4. Scrape AngelList/Wellfound for startups
  static async scrapeAngelListStartups(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const companies_found = await this.scrapeWithSearchEngine('angel.co', skill, location);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('AngelList scraping failed:', error);
    }
    
    return companies;
  }
  
  // 5. Scrape RemoteOK for remote companies
  static async scrapeRemoteOKCompanies(skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const remoteUrl = `https://remoteok.io/remote-${encodeURIComponent(skill.replace(/\s+/g, '-'))}-jobs`;
        
        // Try direct access or use proxy
        try {
          const response = await fetch(remoteUrl);
          if (response.ok) {
            const html = await response.text();
            const companies_found = this.parseRemoteOKHTML(html, skill);
            companies.push(...companies_found);
          }
        } catch {
          // Fallback to search engine approach
          const companies_found = await this.scrapeWithSearchEngine('remoteok.io', skill, 'remote');
          companies.push(...companies_found);
        }
        
        await this.delay(1500);
      }
    } catch (error) {
      console.warn('RemoteOK scraping failed:', error);
    }
    
    return companies;
  }
  
  // 6. Scrape StackOverflow Jobs
  static async scrapeStackOverflowJobs(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const companies_found = await this.scrapeWithSearchEngine('stackoverflow.com/jobs', skill, location);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('StackOverflow scraping failed:', error);
    }
    
    return companies;
  }
  
  // 7. Scrape Wellfound (formerly AngelList)
  static async scrapeWellfoundStartups(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      for (const skill of skills.slice(0, 2)) {
        const companies_found = await this.scrapeWithSearchEngine('wellfound.com', skill, location);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Wellfound scraping failed:', error);
    }
    
    return companies;
  }
  
  // 8. Scrape company websites directly
  static async scrapeCompanyWebsites(location: string, skills: string[]): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Use web search to find company websites
      for (const skill of skills.slice(0, 2)) {
        const searchTerms = `"${skill}" companies ${location} -university -college -school`;
        const companies_found = await this.searchCompanyWebsites(searchTerms);
        companies.push(...companies_found);
        
        await this.delay(2000);
      }
    } catch (error) {
      console.warn('Company website scraping failed:', error);
    }
    
    return companies;
  }
  
  // Helper methods for parsing HTML and extracting company data
  static parseIndeedHTML(html: string, skill: string): Company[] {
    const companies: Company[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Indeed job card selectors (these may change)
      const jobCards = doc.querySelectorAll('[data-testid="job-tile"]') || 
                      doc.querySelectorAll('.jobsearch-SerpJobCard') ||
                      doc.querySelectorAll('.slider_container .slider_item');
      
      jobCards.forEach((card, index) => {
        const companyEl = card.querySelector('[data-testid="company-name"]') ||
                         card.querySelector('.companyName') ||
                         card.querySelector('span[title]');
        
        const locationEl = card.querySelector('[data-testid="job-location"]') ||
                          card.querySelector('.companyLocation');
        
        if (companyEl?.textContent) {
          const companyName = companyEl.textContent.trim();
          if (companyName && companyName.length > 2) {
            companies.push({
              id: `indeed-${skill}-${index}`,
              name: companyName,
              address: locationEl?.textContent?.trim() || 'Location not specified',
              category: `${skill} Employer`,
              lat: 0,
              lng: 0,
              placeId: `indeed-${Date.now()}-${index}`,
              businessStatus: 'operational',
              source: 'Indeed Jobs'
            });
          }
        }
      });
    } catch (error) {
      console.warn('Error parsing Indeed HTML:', error);
    }
    
    return companies;
  }
  
  static parseRemoteOKHTML(html: string, skill: string): Company[] {
    const companies: Company[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const jobRows = doc.querySelectorAll('tr.job') || doc.querySelectorAll('.job');
      
      jobRows.forEach((row, index) => {
        const companyEl = row.querySelector('.company') || 
                         row.querySelector('[class*="company"]') ||
                         row.querySelector('td:nth-child(2)');
        
        if (companyEl?.textContent) {
          const companyName = companyEl.textContent.trim();
          if (companyName && companyName.length > 2) {
            companies.push({
              id: `remoteok-${skill}-${index}`,
              name: companyName,
              address: 'Remote Company',
              category: `Remote ${skill}`,
              lat: 0,
              lng: 0,
              placeId: `remoteok-${Date.now()}-${index}`,
              businessStatus: 'operational',
              source: 'RemoteOK'
            });
          }
        }
      });
    } catch (error) {
      console.warn('Error parsing RemoteOK HTML:', error);
    }
    
    return companies;
  }
  
  // Use search engines to find companies
  static async scrapeWithSearchEngine(site: string, skill: string, location: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Use DuckDuckGo search API (no API key required)
      const searchQuery = `site:${site} "${skill}" ${location} jobs OR careers OR hiring`;
      const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(duckUrl);
      const data = await response.json();
      
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            const companyName = this.extractCompanyFromText(topic.Text);
            if (companyName) {
              companies.push({
                id: `search-${site}-${index}`,
                name: companyName,
                address: location,
                category: skill,
                lat: 0,
                lng: 0,
                placeId: `search-${Date.now()}-${index}`,
                businessStatus: 'operational',
                source: `Search Engine (${site})`,
                website: topic.FirstURL
              });
            }
          }
        });
      }
    } catch (error) {
      console.warn(`Search engine scraping failed for ${site}:`, error);
    }
    
    return companies;
  }
  
  static async searchCompanyWebsites(searchTerms: string): Promise<Company[]> {
    const companies: Company[] = [];
    
    try {
      // Use multiple search approaches
      const searchEngines = [
        `https://api.duckduckgo.com/?q=${encodeURIComponent(searchTerms)}&format=json`,
        // Could add more search APIs here
      ];
      
      for (const searchUrl of searchEngines) {
        try {
          const response = await fetch(searchUrl);
          const data = await response.json();
          
          if (data.Results) {
            data.Results.forEach((result: any, index: number) => {
              const companyName = this.extractCompanyFromText(result.Text || '');
              if (companyName && result.FirstURL) {
                companies.push({
                  id: `web-search-${index}`,
                  name: companyName,
                  address: 'Web Search Result',
                  category: 'Technology Company',
                  lat: 0,
                  lng: 0,
                  placeId: `web-${Date.now()}-${index}`,
                  businessStatus: 'operational',
                  source: 'Web Search',
                  website: result.FirstURL
                });
              }
            });
          }
        } catch (error) {
          console.warn('Search engine request failed:', error);
        }
        
        await this.delay(1000);
      }
    } catch (error) {
      console.warn('Web search failed:', error);
    }
    
    return companies;
  }
  
  // Extract company names from text
  static extractCompanyFromText(text: string): string | null {
    if (!text) return null;
    
    // Look for company patterns
    const companyPatterns = [
      /([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Corporation|Ltd|Limited|Company|Co|Technologies|Tech|Systems|Solutions|Group|Enterprises))/g,
      /([A-Z][a-zA-Z\s&]{2,30}(?:\s(?:Inc|LLC|Corp|Ltd|Co|Tech|Labs)))/g,
      /([A-Z][a-zA-Z]+(?:Tech|Labs|Systems|Solutions|Software|Digital|Innovation|Dynamics))/g
    ];
    
    for (const pattern of companyPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const company = matches[0].trim();
        if (company.length > 3 && company.length < 50) {
          return company;
        }
      }
    }
    
    return null;
  }
  
  // Remove duplicates and enhance data
  static deduplicateAndEnhance(companies: Company[]): Company[] {
    const seen = new Map<string, Company>();
    
    companies.forEach(company => {
      const key = company.name.toLowerCase().trim();
      const existingCompany = seen.get(key);
      
      if (!existingCompany) {
        seen.set(key, company);
      } else {
        // Merge data from duplicate entries
        if (!existingCompany.website && company.website) {
          existingCompany.website = company.website;
        }
        if (!existingCompany.phone && company.phone) {
          existingCompany.phone = company.phone;
        }
        if (!existingCompany.email && company.email) {
          existingCompany.email = company.email;
        }
        if (existingCompany.address === 'Location not specified' && company.address !== 'Location not specified') {
          existingCompany.address = company.address;
        }
      }
    });
    
    return Array.from(seen.values());
  }
  
  // Utility function for delays
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Validate company data
  static isValidCompany(company: Company): boolean {
    return company.name.length > 2 && 
           company.name.length < 100 &&
           !company.name.toLowerCase().includes('university') &&
           !company.name.toLowerCase().includes('college') &&
           !company.name.toLowerCase().includes('school');
  }
}
