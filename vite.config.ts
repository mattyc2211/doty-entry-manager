import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// The `lovable-tagger` plugin is gone along with the rest of the Lovable
// tooling. It only ran in development, but it was the last thing tying the
// build to that platform.
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split the two large, rarely-changing dependencies out of the app bundle.
    // Exhibitors open this on a phone, often on show-ground reception, and a
    // single 528 kB chunk made them wait for React and the Supabase client
    // before anything appeared. These two also cache across deploys.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
