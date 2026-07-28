import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'web-build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@supabase')) return 'supabase';
          if (id.includes('node_modules/leaflet')) return 'leaflet';
        },
      },
    },
  },
});
