import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Globe, Heart, MapPin, Phone, Star, Award, Users, TrendingUp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent)] bg-[length:60px_60px]"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-blue-200 text-sm">Companies Found</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-green-200 text-sm">Job Seekers</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">100+</div>
            <div className="text-purple-200 text-sm">Cities Covered</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">5.0</div>
            <div className="text-amber-200 text-sm">User Rating</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Job-Do
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                India's premier job discovery platform, connecting talented professionals 
                with amazing career opportunities through cutting-edge technology and comprehensive business intelligence.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                ))}
              </div>
              <div>
                <div className="text-white font-semibold">Trusted by 50K+ users</div>
                <div className="text-blue-200 text-sm">Join our growing community</div>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Premium Features</h3>
            <ul className="space-y-4">
              {[
                "🎯 AI-Powered Job Matching",
                "🚀 Skills-Based Filtering",
                "📊 Real-time Analytics",
                "📁 Advanced Export Options",
                "🌍 Pan-India Coverage",
                "⚡ Lightning Fast Search"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-lg">{feature.split(' ')[0]}</span>
                  <span className="font-medium">{feature.split(' ').slice(1).join(' ')}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Get In Touch</h3>
            <div className="space-y-4">
              <motion.a
                href="mailto:support@job-do.com"
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium group-hover:text-blue-200 transition-colors">
                    support@job-do.com
                  </div>
                  <div className="text-gray-400 text-sm">24/7 Support</div>
                </div>
              </motion.a>

              <motion.a
                href="tel:+91-9876543210"
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium group-hover:text-green-200 transition-colors">
                    +91-9876543210
                  </div>
                  <div className="text-gray-400 text-sm">Call Us Anytime</div>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/pritam-ray/JOBDO"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium group-hover:text-purple-200 transition-colors">
                    Open Source
                  </div>
                  <div className="text-gray-400 text-sm">Contribute on GitHub</div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </motion.div>
              <span className="text-gray-300">for job seekers in India</span>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-gray-400 text-sm">
                © 2024 Job-Do. All rights reserved.
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Empowering careers • Building futures
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};