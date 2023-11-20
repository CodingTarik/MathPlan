import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild }) => {
  if (command === "serve")
    return {
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            main: resolve(path.join(__dirname, "index.html")),
          },
        },
      },
    };
  else
    return {
      plugins: [react()],
      base: '',
      build: {
        rollupOptions: {
          input: {
            main: resolve(path.join(__dirname, "index.html")),
          },
        },
      },
    };
});
