import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Yo fijo el nombre exacto del repo (sin barras).
const repoName = "eliseo-gympro";

export default defineConfig(({ mode }) => ({
  // Yo uso base solo en producción (GitHub Pages).
  base: mode === "production" ? `/${repoName}/` : "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 8080,
    hmr: { overlay: false },
  },
}));
