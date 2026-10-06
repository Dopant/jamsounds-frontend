import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "https://backend.jamjournal.com",
      "/uploads": "https://backend.jamjournal.com"
      // "/api": "http://localhost:4000",
      // "/uploads": "http://localhost:4000", // Image/media uploads
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
