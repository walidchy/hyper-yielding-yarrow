
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Adding timeout configuration
    hmr: {
      timeout: 120000, // Increase timeout to 120 seconds
    },
  },
  optimizeDeps: {
    // Pre-bundle these dependencies to avoid timeout issues
    include: [
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod',
      'axios',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-dropdown-menu',
    ],
    // Increase esbuild timeout
    esbuildOptions: {
      target: 'esnext',
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build options to help with large dependencies
  build: {
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split these large dependencies into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers/zod'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-radio-group', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
}));
