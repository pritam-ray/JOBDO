import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '/' for Netlify, '/JOBDO/' for GitHub Pages
  const base = process.env.NETLIFY === 'true' || process.env.CONTEXT === 'production' ? '/' : 
               mode === 'production' ? '/JOBDO/' : '/';
  
  console.log('Vite config - Base path:', base, 'Mode:', mode, 'Netlify:', process.env.NETLIFY);
  
  return {
    plugins: [react()],
    base: base,
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
