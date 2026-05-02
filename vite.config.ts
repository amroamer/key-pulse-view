import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/khda/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Frontend fetches /khda/api/* so the same paths work behind nginx in
      // prod. Strip /khda before forwarding because the FastAPI app mounts
      // routes at /api/*, not /khda/api/*.
      "/khda/api": {
        target: "http://localhost:8765",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/khda/, ""),
      },
      "/api": {
        target: "http://localhost:8765",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
