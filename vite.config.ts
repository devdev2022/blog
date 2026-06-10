import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isStg = mode === "stg" || process.env.VERCEL_GIT_COMMIT_REF === "dev";
  const isAnalyze = process.env.ANALYZE === "true";

  return {
    plugins: [
      react(),
      svgr(),

      isAnalyze &&
        visualizer({
          filename: "dist/stats.html", // 결과 파일
          open: true, // 빌드 후 브라우저 자동 오픈
          gzipSize: true, // gzip 후 크기 표시
          brotliSize: true, // brotli 후 크기 표시
          template: "treemap", // treemap | sunburst | network
        }),
    ],
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
        "@pages": "/src/pages",
        "@data": "/src/data",
        "@contexts": "/src/contexts",
        "@constants": "/src/constants",
        ...(isStg && {
          "react-dom$": "react-dom/profiling",
          "react-dom/client": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
      },
    },
    esbuild: {
      keepNames: true,
    },
  };
});
