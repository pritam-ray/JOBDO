import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { Footer } from './components/Footer';
import { Company, SearchParams } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams>({ 
    location: '', 
    skills: [], 
    radius: 10 
  });

  // Debug environment variables
  const debugEnv = () => {
    console.log('Environment Debug:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('BASE_URL:', import.meta.env.BASE_URL);
    console.log('DEV:', import.meta.env.DEV);
    console.log('PROD:', import.meta.env.PROD);
    console.log('MODE:', import.meta.env.MODE);
  };

  useEffect(() => {
    debugEnv();
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    setIsLoading(true);
    setIsSearched(true);
    setError(null);
    setLastSearchParams(searchParams);
    
    try {
      // Build the query based on search parameters
      let query = supabase
        .from('companies')
        .select('*');

      // Filter by skills if provided
      if (searchParams.skills && searchParams.skills.length > 0) {
        query = query.overlaps('skills', searchParams.skills);
      }

      // Filter by location if provided
      if (searchParams.location && searchParams.location.trim() !== '') {
        const location = searchParams.location.toLowerCase();
        query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,country.ilike.%${location}%`);
      }

      // Execute the query
      const { data, error: queryError } = await query.limit(50);

      if (queryError) {
        throw queryError;
      }

      // Transform the data to match our Company interface
      const transformedCompanies: Company[] = (data || []).map(company => ({
        id: company.id,
        name: company.name,
        address: `${company.city}, ${company.state}, ${company.country}`,
        phone: company.phone,
        email: company.email,
        website: company.website,
        category: company.industry,
        rating: 4.5, // Default rating
        lat: company.latitude,
        lng: company.longitude,
        placeId: `company_${company.id}`,
        businessStatus: 'OPERATIONAL',
        source: 'supabase'
      }));

      setCompanies(transformedCompanies);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while searching');
      setCompanies([]);
      setIsLoading(false);
    }
  };

  // Show environment debugging screen in production if missing variables
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-4">🔧 Configuration Required</h1>
            <p className="text-white/80 mb-6">
              Supabase environment variables are not configured. Please set up your environment variables.
            </p>
            <div className="bg-black/20 rounded-lg p-4 text-left">
              <pre className="text-green-400 text-sm">
{`# Add these to your .env file:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
              </pre>
            </div>
            <p className="text-white/60 text-sm mt-4">
              Current: URL={import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'} | 
              KEY={import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover opportunities at top companies across India. Search by skills, location, and preferences.
            </p>
          </div>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="mt-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-red-400 font-semibold mb-2">Search Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {isSearched && !isLoading && !error && (
            <SearchResults 
              companies={companies} 
              searchLocation={lastSearchParams.location} 
              searchSkills={lastSearchParams.skills} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
