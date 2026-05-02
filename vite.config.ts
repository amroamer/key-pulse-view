import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Mirror nginx's `/khda → /khda/` redirect so dev and prod behave the
// same. Vite forces a trailing slash on the base path internally; we
// just redirect the bare form for users typing /khda.
const redirectBareBase = () => ({
  name: "redirect-bare-base",
  configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
    type ReqLike = { url?: string };
    type ResLike = {
      writeHead: (status: number, headers: Record<string, string>) => void;
      end: () => void;
    };
    (server.middlewares.use as (
      fn: (req: ReqLike, res: ResLike, next: () => void) => void,
    ) => void)((req, res, next) => {
      if (req.url === "/khda") {
        res.writeHead(301, { Location: "/khda/" });
        res.end();
        return;
      }
      next();
    });
  },
});

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
  plugins: [react(), redirectBareBase()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
