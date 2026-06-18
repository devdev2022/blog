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
    build: {
      rollupOptions: {
        output: {
          // 모든 페이지가 공통으로 쓰는 vendor를 변경 빈도 기준으로 분리하여 앱 코드 배포 시에도 vendor 청크 해시가 유지
          // 주의: 특정 페이지만 쓰는 라이브러리(tiptap, floating-ui, date-fns 등)는 여기서 반환하지 않아 Rollup이 기존 lazy 청크에 그대로 둠
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (
              /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)
            )
              return "vendor-react";
            if (
              /[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run)[\\/]/.test(
                id,
              )
            )
              return "vendor-router";
            if (
              /[\\/]node_modules[\\/](@tanstack|@reduxjs|redux|react-redux|immer|use-sync-external-store)[\\/]/.test(
                id,
              )
            )
              return "vendor-state";
            if (/[\\/]node_modules[\\/]axios[\\/]/.test(id))
              return "vendor-http";
          },
        },
      },
    },
  };
});
