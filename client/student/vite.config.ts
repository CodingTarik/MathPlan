// Import necessary modules from Vite and Node.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Configuration for Vite
export default defineConfig(({ command }) => {
  // Check if the Vite command is 'serve' (development server)
  // npm run dev
  if (command === 'serve') {
    // Configuration for the development server
    return {
      // Vite plugins to use, in this case, the React plugin
      plugins: [react()],
      // Build configuration
      build: {
        // Rollup options for bundling
        rollupOptions: {
          // Entry points for the application
          input: {
            main: resolve(path.join(__dirname, 'index.html'))
          }
        }
      }
    };
  } else {
    // Configuration for other Vite commands (e.g., 'build' for production)
    // npm run build
    return {
      // Vite plugins to use, in this case, the React plugin
      plugins: [react()],
      // Base URL for the application (empty string for relative paths)
      // This is important because we dont want absolute paths (in html, javascript file for loading other files) in production
      base: '/student',
      // Build configuration
      build: {
        // Rollup options for bundling
        rollupOptions: {
          // Entry points for the application
          input: {
            main: resolve(path.join(__dirname, 'index.html'))
          }
        }
      }
    };
  }
});
