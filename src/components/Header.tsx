import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Building2, 
  Plus, 
  Home, 
  Sparkles, 
  Target, 
  TrendingUp,
  Users,
  Award,
  Globe,
  Zap
} from 'lucide-react';
import { cn, gradients, shadows } from '../lib/utils';

export const Header: React.FC = () => {
  const location = useLocation();
  const isAddCompanyPage = location.pathname === '/add-company';

  const navItems = [
    { path: '/', icon: Home, label: 'Search Jobs', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/add-company', icon: Plus, label: 'Add Company', gradient: 'from-purple-500 to-pink-500' }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users', color: 'text-blue-400' },
    { icon: Building2, value: '500+', label: 'Companies', color: 'text-emerald-400' },
    { icon: Award, value: '2K+', label: 'Jobs Found', color: 'text-orange-400' },
    { icon: Globe, value: '24+', label: 'Sources', color: 'text-purple-400' }
  ];

  const features = [
    {
      icon: MapPin,
      title: 'AI-Powered Location Search',
      description: 'Intelligent geolocation with radius-based company discovery',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Smart Skills Matching',
      description: 'Advanced algorithms match your skills with perfect opportunities',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Job Analytics',
      description: 'Live data from 24+ premium sources with zero mock data',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <header className="relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-shift bg-300%"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className={cn(
                    "p-3 rounded-xl",
                    gradients.primary,
                    shadows.glow,
                    "group-hover:shadow-blue-500/40 transition-all duration-300"
                  )}>
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                    Job-Do
                  </h1>
                  <p className="text-xs text-blue-200 -mt-1">Premium Edition</p>
                </div>
              </Link>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const isActive = item.path === location.pathname;
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Header Content - Only show on homepage */}
      {!isAddCompanyPage && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">India's #1 Premium Job Discovery Platform</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>

              <motion.h1
                className="text-6xl sm:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Job-Do
                </span>
                <br />
                <span className="text-4xl sm:text-5xl text-white/90">Premium</span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover exceptional job & internship opportunities across India with our 
                <span className="text-emerald-400 font-semibold"> AI-powered platform</span>.
                Connect with real companies through 24+ premium sources.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className={cn("w-8 h-8", stat.color)} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group relative"
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                >
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 h-full overflow-hidden hover:bg-white/15 transition-all duration-300">
                    {/* Gradient overlay on hover */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                      `bg-gradient-to-br ${feature.gradient}`
                    )} />
                    
                    <div className="relative z-10">
                      <div className={cn(
                        "inline-flex p-4 rounded-xl mb-6",
                        `bg-gradient-to-r ${feature.gradient}`,
                        shadows.lg
                      )}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Simplified header for Add Company page */}
      {isAddCompanyPage && (
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="text-white/90 text-sm font-medium">Expand the Job-Do Community</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Add Your <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Company</span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Help job seekers discover amazing opportunities by adding your company to our premium platform
            </p>
          </div>
        </motion.div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </header>
  );
};