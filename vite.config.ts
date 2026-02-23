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
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
      "@components": "/src/components",
    },
  },
});
