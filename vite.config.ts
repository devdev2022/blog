import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: "127.0.0.1",
    open: true,
    port: 3001,
  },
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@components", replacement: "/src/components" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@data", replacement: "/src/data" },
      { find: "@contexts", replacement: "/src/contexts" },
      { find: "@constants", replacement: "/src/constants" },
      { find: /^react-dom$/, replacement: "react-dom/profiling" },
      { find: /^react-dom\/client$/, replacement: "react-dom/profiling" },
      { find: "scheduler/tracing", replacement: "scheduler/tracing-profiling" },
    ],
  },
  esbuild: {
    keepNames: true,
  },
  build: {
    minify: "esbuild",
  },
});
