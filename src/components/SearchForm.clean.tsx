import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Target, 
  Search, 
  Plus, 
  X, 
  Sparkles, 
  ChevronDown,
  Briefcase,
  Code,
  Palette,
  BarChart,
  Shield,
  Database,
  Smartphone,
  Megaphone,
  Users,
  Lightbulb,
  Camera,
  Globe,
  Heart,
  Building,
  Zap
} from 'lucide-react';

interface SearchFormProps {
  onSearch: (data: any) => void;
  isLoading: boolean;
}

interface FormData {
  location: string;
  radius: number;
  skills: string[];
  customSkill: string;
}

const predefinedSkills = [
  { name: 'JavaScript', icon: '💻', category: 'Programming' },
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Node.js', icon: '🔧', category: 'Backend' },
  { name: 'Python', icon: '🐍', category: 'Programming' },
  { name: 'UI/UX Design', icon: '🎨', category: 'Design' },
  { name: 'Data Analysis', icon: '📊', category: 'Analytics' },
  { name: 'Digital Marketing', icon: '📱', category: 'Marketing' },
  { name: 'Project Management', icon: '📋', category: 'Management' },
  { name: 'Sales', icon: '💼', category: 'Business' },
  { name: 'Customer Service', icon: '🤝', category: 'Support' },
  { name: 'Content Writing', icon: '✍️', category: 'Content' },
  { name: 'SEO', icon: '🔍', category: 'Marketing' },
  { name: 'Cloud Computing', icon: '☁️', category: 'Technology' },
  { name: 'Machine Learning', icon: '🤖', category: 'AI/ML' },
  { name: 'Cybersecurity', icon: '🔒', category: 'Security' },
  { name: 'DevOps', icon: '⚙️', category: 'Operations' },
  { name: 'Mobile Development', icon: '📱', category: 'Mobile' },
  { name: 'Database Management', icon: '🗄️', category: 'Data' },
  { name: 'Quality Assurance', icon: '✅', category: 'Testing' },
  { name: 'Business Analysis', icon: '📈', category: 'Analytics' }
];

const radiusOptions = [
  { value: 5, label: '5km - Nearby', icon: '🚶‍♂️', description: 'Walking distance' },
  { value: 10, label: '10km - Local Area', icon: '🚴‍♂️', description: 'Cycling distance' },
  { value: 15, label: '15km - Extended Area', icon: '🛵', description: 'Short commute' },
  { value: 25, label: '25km - Short Drive', icon: '🚗', description: 'Quick car journey' },
  { value: 50, label: '50km - City Wide', icon: '🏙️', description: 'Full city coverage' }
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      location: '',
      radius: 10,
      customSkill: ''
    }
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  const watchedLocation = watch('location');
  const skillCategories = [...new Set(predefinedSkills.map(skill => skill.category))];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
              const result = data.results[0];
              const city = result.components.city || result.components.town || result.components.village;
              const state = result.components.state;
              const locationString = city && state ? `${city}, ${state}` : result.formatted;
              setValue('location', locationString);
            }
          } catch (error) {
            console.error('Error getting location name:', error);
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your location. Please enter it manually.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const addSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      const newSkills = [...selectedSkills, skillName];
      setSelectedSkills(newSkills);
    }
  };

  const removeSkill = (skillName: string) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillName);
    setSelectedSkills(newSkills);
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill('');
      setValue('customSkill', '');
    }
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const onSubmit = (data: FormData) => {
    if (selectedSkills.length === 0) {
      return;
    }

    const searchData = {
      ...data,
      skills: selectedSkills,
      coordinates: currentLocation
    };

    onSearch(searchData);
  };

  const filteredSkills = showAllSkills ? predefinedSkills : predefinedSkills.slice(0, 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 mb-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg"
        >
          <Search className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Find Your Dream Job</h2>
        <p className="text-blue-100 text-lg">Search for opportunities that match your skills and location</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Location Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <label className="block text-white font-semibold mb-3 text-lg">
            <MapPin className="inline w-5 h-5 mr-2" />
            Location
          </label>
          <div className="relative">
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              placeholder="Enter city, state (e.g., Mumbai, Maharashtra)"
              className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg backdrop-blur-sm"
            />
            <motion.button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locationLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Target className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          {errors.location && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 text-sm mt-2 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              {errors.location.message}
            </motion.p>
          )}
        </motion.div>

        {/* Search Radius */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-white font-semibold mb-3 text-lg">
            <Target className="inline w-5 h-5 mr-2" />
            Search Radius
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {radiusOptions.map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative cursor-pointer"
              >
                <input
                  {...register('radius')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm group">
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-white font-medium text-sm mb-1">{option.label}</div>
                  <div className="text-blue-200 text-xs">{option.description}</div>
                </div>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Skills Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-white font-semibold mb-3 text-lg">
            <Briefcase className="inline w-5 h-5 mr-2" />
            Skills & Expertise
          </label>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4"
            >
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add Custom Skill */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={handleSkillInputKeyPress}
                placeholder="Add a custom skill..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
              <motion.button
                type="button"
                onClick={addCustomSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                disabled={!customSkill.trim()}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Predefined Skills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <motion.button
                    key={skill.name}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isSelected ? removeSkill(skill.name) : addSkill(skill.name)}
                    className={`p-3 rounded-2xl border transition-all duration-300 backdrop-blur-sm text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white shadow-lg'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-white/60'}`}>
                          {skill.category}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          {predefinedSkills.length > 12 && (
            <motion.button
              type="button"
              onClick={() => setShowAllSkills(!showAllSkills)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              {showAllSkills ? 'Show Less' : 'Show More Skills'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllSkills ? 'rotate-180' : ''}`} />
            </motion.button>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <motion.button
            type="submit"
            disabled={isLoading || selectedSkills.length === 0}
            whileHover={{ scale: selectedSkills.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: selectedSkills.length > 0 ? 0.98 : 1 }}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              selectedSkills.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                Search Jobs ({selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''})
              </>
            )}
          </motion.button>

          {/* Validation Message */}
          <AnimatePresence>
            {selectedSkills.length === 0 && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-yellow-300 text-sm mt-3 text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Please select at least one skill to start searching
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SearchForm;
