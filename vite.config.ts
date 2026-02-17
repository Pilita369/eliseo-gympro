import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Yo ajusto el base para GitHub Pages (tiene que coincidir con el nombre del repo)
const repoName = "/eliseo-gympro/";

export default defineConfig(({ mode }) => ({
  base: `/${repoName}/`,
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
