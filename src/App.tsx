import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { Footer } from './components/Footer';
import { Company, SearchParams } from './types';
import { searchCompanies } from './services/placesApi';
import { saveSearchResult } from './services/database';

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<SearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Check for required environment variables
  useEffect(() => {
    const requiredEnvVars = {
      'Supabase URL': import.meta.env.VITE_SUPABASE_URL,
      'Supabase Key': import.meta.env.VITE_SUPABASE_ANON_KEY
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      setError(`Missing environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
    }
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchParams(searchParams);

    try {
      const results = await searchCompanies(searchParams);
      setCompanies(results);

      // Save results to database (optional, doesn't block UI if it fails)
      try {
        await saveSearchResult(searchParams, results);
      } catch (dbError) {
        console.warn('Failed to save search results to database:', dbError);
        // Don't show error to user as the main functionality still works
      }

      if (results.length === 0) {
        setError('No companies found. Try expanding your search radius or selecting different skills.');
      }
    } catch (searchError) {
      console.error('Search error:', searchError);
      setError(searchError instanceof Error ? searchError.message : 'Search failed. Please try again.');
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Environment Variables Check */}
        {error && error.includes('Supabase') && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h3 className="text-lg font-semibold text-red-800">Configuration Required</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-red-100 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-red-700 text-sm">
                <li>Copy the <code className="bg-red-200 px-2 py-1 rounded">.env.example</code> file to <code className="bg-red-200 px-2 py-1 rounded">.env</code></li>
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                <li>Add your Supabase credentials to the <code className="bg-red-200 px-2 py-1 rounded">.env</code> file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {error && !error.includes('Supabase') && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <SearchResults
            companies={companies}
            searchLocation={lastSearchParams?.location || ''}
            searchSkills={lastSearchParams?.skills || []}
            isLoading={isLoading}
          />
        )}

        {/* Welcome Message */}
        {!hasSearched && !error && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Find Your Next Internship?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Enter your location and select your skills to discover companies 
                in your area that might offer internship opportunities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📍 Location-Based</h3>
                  <p className="text-sm text-gray-600">
                    Find companies within walking distance or your preferred commute range
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Skills Matching</h3>
                  <p className="text-sm text-gray-600">
                    Filter by your interests and expertise areas for relevant opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;