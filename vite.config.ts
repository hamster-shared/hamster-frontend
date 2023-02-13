import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          "http://34.232.105.81:8080/api",
          // "http://34.232.105.81:8080/api",
        // "http://175.24.179.2:8080/api",
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/nodeService": {
        target:
          "http://34.232.105.81/nodeService",
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/nodeService/, ""),
      },
    },
  },
});
