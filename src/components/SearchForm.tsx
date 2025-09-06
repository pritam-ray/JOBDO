import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Target, Search, Plus, X } from 'lucide-react';
import { SearchParams } from '../types';
import { getCurrentLocation, geocodeLocation, reverseGeocode } from '../services/freeGeocoding';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

interface FormData {
  location: string;
  radius: number;
  customSkill: string;
}

const predefinedSkills = [
  'AI/ML',
  'Web Development',
  'App Development',
  'Electronics',
  'Space',
  'Robotics',
  'Finance',
  'Marketing',
  'Design',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing'
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      location: '',
      radius: 10,
      customSkill: ''
    }
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const customSkillInput = document.querySelector<HTMLInputElement>('input[name="customSkill"]');
    if (customSkillInput && customSkillInput.value.trim()) {
      const skill = customSkillInput.value.trim();
      if (!selectedSkills.includes(skill)) {
        setSelectedSkills(prev => [...prev, skill]);
      }
      customSkillInput.value = '';
      setValue('customSkill', '');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    try {
      const coords = await getCurrentLocation();
      
      // Reverse geocode to get readable address
      const address = await reverseGeocode(coords.lat, coords.lng);
      setValue('location', address);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Failed to get location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill or interest area.');
      return;
    }

    try {
      setLocationError(null);
      const coordinates = await geocodeLocation(data.location);
      
      const searchParams: SearchParams = {
        location: data.location,
        skills: selectedSkills,
        radius: data.radius,
        coordinates
      };

      onSearch(searchParams);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Failed to process location');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Internship Opportunities</h2>
        <p className="text-gray-600">Discover local companies based on your location and interests</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                {...register('location', { 
                  required: 'Location is required',
                  minLength: { value: 3, message: 'Location must be at least 3 characters' }
                })}
                type="text"
                placeholder="Enter city, address, or area"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
              {locationError && (
                <p className="text-red-500 text-sm mt-1">{locationError}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isGettingLocation}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {isGettingLocation ? 'Getting...' : 'Use Current'}
            </button>
          </div>
        </div>

        {/* Search Radius */}
        <div>
          <label htmlFor="radius" className="block text-sm font-semibold text-gray-700 mb-2">
            Search Radius: {watch('radius')} km
          </label>
          <input
            {...register('radius', { 
              required: 'Radius is required',
              min: { value: 1, message: 'Minimum radius is 1 km' },
              max: { value: 50, message: 'Maximum radius is 50 km' }
            })}
            type="range"
            min="1"
            max="50"
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Skills Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Skills & Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {predefinedSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            <input
              {...register('customSkill')}
              type="text"
              placeholder="Add custom skill..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || selectedSkills.length === 0}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Searching Companies...' : 'Find Companies'}
        </button>
      </form>
    </div>
  );
};