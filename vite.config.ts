import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  preview: {
    port: 4173,
    open: true
  }
});
