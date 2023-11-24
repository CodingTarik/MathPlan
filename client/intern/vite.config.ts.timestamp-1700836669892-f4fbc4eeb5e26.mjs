// vite.config.ts
import { defineConfig } from "file:///C:/Users/Tarik/Desktop/Materno/materno/client/intern/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import react from "file:///C:/Users/Tarik/Desktop/Materno/materno/client/intern/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\Tarik\\Desktop\\Materno\\materno\\client\\intern";
var vite_config_default = defineConfig(({ command }) => {
  if (command === "serve")
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            main: resolve(path.join(__vite_injected_original_dirname, "indexx.html"))
          }
        }
      }
    };
  else
    return {
      plugins: [react()],
      base: "",
      build: {
        rollupOptions: {
          input: {
            main: resolve(path.join(__vite_injected_original_dirname, "indexx.html"))
          }
        }
      }
    };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxUYXJpa1xcXFxEZXNrdG9wXFxcXE1hdGVybm9cXFxcbWF0ZXJub1xcXFxjbGllbnRcXFxcaW50ZXJuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxUYXJpa1xcXFxEZXNrdG9wXFxcXE1hdGVybm9cXFxcbWF0ZXJub1xcXFxjbGllbnRcXFxcaW50ZXJuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9UYXJpay9EZXNrdG9wL01hdGVybm8vbWF0ZXJuby9jbGllbnQvaW50ZXJuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcblxuICBpZiAoY29tbWFuZCA9PT0gJ3NlcnZlJylcbiAgICByZXR1cm4ge1xuICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgICAgYnVpbGQ6IHtcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICBtYWluOiByZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICdpbmRleHguaHRtbCcpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIGVsc2VcbiAgICByZXR1cm4ge1xuICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgICAgYmFzZTogJycsXG4gICAgICBidWlsZDoge1xuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICAgIG1haW46IHJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4eC5odG1sJykpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VixTQUFTLG9CQUFvQjtBQUMzWCxTQUFTLGVBQWU7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUUzQyxNQUFJLFlBQVk7QUFDZCxXQUFPO0FBQUEsTUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsTUFDakIsT0FBTztBQUFBLFFBQ0wsZUFBZTtBQUFBLFVBQ2IsT0FBTztBQUFBLFlBQ0wsTUFBTSxRQUFRLEtBQUssS0FBSyxrQ0FBVyxhQUFhLENBQUM7QUFBQSxVQUNuRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBRUEsV0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLE1BQ2pCLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLGVBQWU7QUFBQSxVQUNiLE9BQU87QUFBQSxZQUNMLE1BQU0sUUFBUSxLQUFLLEtBQUssa0NBQVcsYUFBYSxDQUFDO0FBQUEsVUFDbkQ7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
