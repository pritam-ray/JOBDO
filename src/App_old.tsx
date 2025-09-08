import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import { Company, SearchParams } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        industry: company.industry,
        size: company.size,
        location: `${company.city}, ${company.state}`,
        website: company.website,
        description: company.description,
        founded: company.founded,
        coordinates: {
          lat: company.latitude,
          lng: company.longitude
        },
        skills: company.skills || [],
        openPositions: company.open_positions || 0
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
            <SearchResults companies={companies} isLoading={isLoading} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Auto-detect user location
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError('');
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoordinates({ lat: latitude, lng: longitude });
      
      // Reverse geocoding to get city name
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location details');
      }
      
      const data = await response.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Unknown Location';
      const stateName = data.principalSubdivision || '';
      
      setLocation(`${cityName}${stateName ? `, ${stateName}` : ''}`);
    } catch (error: any) {
      console.error('Location detection error:', error);
      setLocationError(error.message || 'Failed to detect location');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Search companies based on location and skills
  const searchCompanies = () => {
    let filtered = [...allCompanies];

    // Filter by skills if provided
    if (skills.trim()) {
      const skillKeywords = skills.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(company =>
        skillKeywords.some(keyword =>
          company.skills.some(skill => skill.toLowerCase().includes(keyword)) ||
          company.name.toLowerCase().includes(keyword) ||
          company.category.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredCompanies(filtered);
    setShowResults(true);
  };

  // Navigation functions
  const showHome = () => {
    setCurrentView('home');
    setShowResults(false);
  };

  const showCompanies = () => {
    setCurrentView('companies');
    setFilteredCompanies(allCompanies);
    setShowResults(true);
  };

  const showAddCompany = () => {
    setCurrentView('add');
    setShowResults(false);
  };

  useEffect(() => {
    // Don't auto-detect location on mount - let users choose
    // detectLocation();
  }, []);

  // Environment variables check - show error if missing in production
  if (import.meta.env.PROD && (!supabaseUrl || !supabaseKey)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
            <p className="text-gray-600 mb-4">
              Environment variables are missing. Please configure:
            </p>
            <div className="text-left text-sm bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <span>VITE_SUPABASE_URL:</span>
                <span className={supabaseUrl ? 'text-green-600' : 'text-red-600'}>
                  {supabaseUrl ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VITE_SUPABASE_ANON_KEY:</span>
                <span className={supabaseKey ? 'text-green-600' : 'text-red-600'}>
                  {supabaseKey ? '✓' : '✗'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Check your deployment environment variables
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job-Do
              </h1>
            </div>
            <nav className="flex space-x-8">
              <button 
                onClick={showHome}
                className={`font-medium transition-colors duration-200 ${
                  currentView === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={showCompanies}
                className={`font-medium transition-colors duration-200 ${
                  currentView === 'companies' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Companies
              </button>
              <button 
                onClick={showAddCompany}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
              >
                Add Company
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Premium Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Home View - Hero Section and Search Form */}
        {currentView === 'home' && (
          <div>
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Search Jobs Across India
                {location && (
                  <span className="ml-2 text-green-600 flex items-center">
                    • 📍 {location}
                  </span>
                )}
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Next
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Dream Internship
                </span>
                {location && (
                  <span className="text-2xl md:text-3xl text-gray-600 block mt-2">
                    in {location}
                  </span>
                )}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover incredible opportunities at top companies in any city across India. Search by location, skills, or both to find your perfect match.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-500">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2K+</div>
                  <div className="text-sm text-gray-500">Jobs Found</div>
                </div>
              </div>
            </div>

            {/* Premium Search Form */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-16 border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Search Jobs Anywhere</h3>
            <p className="text-gray-600">Find companies in any city that match your skills and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location Input with Auto-Detection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                📍 Search Location
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter any city: Mumbai, Delhi, Bangalore, Pune..."
                    className="w-full px-4 py-3 pr-12 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    title="Use my current location"
                  >
                    {isDetectingLocation ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Type any city name or click the location icon to use your current location
                </p>
              </div>
              {locationError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {locationError}
                </p>
              )}
              
              {/* Quick City Selection */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Popular cities:</p>
                <div className="flex flex-wrap gap-2">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setLocation(city)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors duration-200"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                🎯 Skills & Interests
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, Marketing, Design..."
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              
              {/* Quick Skills Selection */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React', 'JavaScript', 'Python', 'Java', 'Node.js', 'UI/UX',
                    'Digital Marketing', 'SEO', 'Content Writing', 'Data Analytics',
                    'Machine Learning', 'PHP', 'Angular', 'Vue.js', 'SQL',
                    'Graphic Design', 'Social Media', 'Finance', 'Spring Boot'
                  ].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        if (skills) {
                          setSkills(skills + ', ' + skill);
                        } else {
                          setSkills(skill);
                        }
                      }}
                      className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors duration-200"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Click skills to add them, or type your own
                  </span>
                  {skills && (
                    <button
                      onClick={() => setSkills('')}
                      className="text-red-500 hover:text-red-700 text-xs underline"
                    >
                      Clear all
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={searchCompanies}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>Discover Companies</span>
              {location && (
                <span className="text-blue-100 text-sm">
                  in {location}
                </span>
              )}
            </button>
          </div>
        </div>
            {/* Premium Features - only show on home view when no search results */}
            {!showResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Location Search</h3>
                  <p className="text-gray-600 leading-relaxed">Search for companies in any city across India. Use your current location or explore opportunities in other cities.</p>
                </div>
                
                <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Matching</h3>
                  <p className="text-gray-600 leading-relaxed">Advanced algorithms match your skills with company requirements for the most relevant opportunities.</p>
                </div>
                
                <div className="group bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Company Data</h3>
                  <p className="text-gray-600 leading-relaxed">Access verified contact information, company details, and real-time job openings from trusted sources.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Companies View Header */}
        {currentView === 'companies' && !showResults && (
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              All Companies
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Browse through our complete directory of companies across India.
            </p>
          </div>
        )}

        {/* Add Company View Header */}
        {currentView === 'add' && (
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Add Your Company
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our platform and connect with talented students across India.
            </p>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {currentView === 'companies' ? 'All Companies' : 'Search Results'}
              </h3>
              <p className="text-gray-600 text-lg">
                {filteredCompanies.length === 0 
                  ? 'No companies found matching your criteria'
                  : `Found ${filteredCompanies.length} companies`}
                {location && currentView !== 'companies' && (
                  <span> in {location}</span>
                )}
              </p>
            </div>
            
            {filteredCompanies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r from-${company.color}-500 to-${company.color}-600 rounded-xl flex items-center justify-center mr-4`}>
                        <span className="text-white font-bold">
                          {company.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{company.name}</h4>
                        <p className="text-sm text-gray-500">{company.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{company.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{company.location}</span>
                        {userCoordinates && company.coordinates && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {Math.round(calculateDistance(
                              userCoordinates.lat,
                              userCoordinates.lng,
                              company.coordinates.lat,
                              company.coordinates.lng
                            ))} km away
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📞</span>
                        <a href={`tel:${company.phone}`} className="hover:text-blue-600 transition-colors">
                          {company.phone}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">✉️</span>
                        <a href={`mailto:${company.email}`} className="hover:text-blue-600 transition-colors">
                          {company.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.skills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 bg-${company.color}-100 text-${company.color}-700 text-xs font-medium rounded-full`}
                        >
                          {skill}
                        </span>
                      ))}
                      {company.skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          +{company.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open(`tel:${company.phone}`, '_self')}
                        className={`flex-1 bg-gradient-to-r from-${company.color}-500 to-${company.color}-600 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm`}
                      >
                        📞 Call
                      </button>
                      <button 
                        onClick={() => window.open(`mailto:${company.email}`, '_self')}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 text-sm"
                      >
                        ✉️ Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <button 
                  onClick={() => {
                    setSkills('');
                    searchCompanies();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Expand Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Company Form */}
        {currentView === 'add' && (
          <div className="mb-16">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Company</h3>
                <p className="text-gray-600">Help students discover your organization</p>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                alert('Company submission feature will be implemented in the backend!');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      <option>Software Development</option>
                      <option>Marketing & Advertising</option>
                      <option>Financial Technology</option>
                      <option>Design & Creative</option>
                      <option>Data & Analytics</option>
                      <option>E-commerce</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="City, State"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+91-XX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="careers@yourcompany.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills & Technologies
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="React, Python, Marketing, Design... (comma separated)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Brief description of your company and what you do..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    Submit Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Original Company Showcase - only show on home view when no search results */}
        {currentView === 'home' && !showResults && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Companies</h3>
              <p className="text-gray-600 text-lg">Discover opportunities at India's top companies</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCompanies.slice(0, 3).map((company) => (
                <div key={company.id} className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r from-${company.color}-500 to-${company.color}-600 rounded-xl flex items-center justify-center mr-4`}>
                      <span className="text-white font-bold">
                        {company.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-500">{company.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>{company.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✉️</span>
                      <span>{company.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {company.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 bg-${company.color}-100 text-${company.color}-700 text-xs font-medium rounded-full`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => {
                      setCurrentView('companies');
                      setFilteredCompanies([company]);
                      setShowResults(true);
                    }}
                    className={`w-full bg-gradient-to-r from-${company.color}-500 to-${company.color}-600 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h3 className="text-2xl font-bold">Job-Do</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Empowering the next generation of professionals with opportunities that matter. 
              Your dream internship is just a search away.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>&copy; 2025 Job-Do</span>
              <span>•</span>
              <span>Made with ❤️ in India</span>
              <span>•</span>
              <span>Helping dreams come true</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;