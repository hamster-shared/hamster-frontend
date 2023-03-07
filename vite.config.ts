import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import type {ConfigEnv} from 'vite';
import vue from "@vitejs/plugin-vue";
import viteCompression from 'vite-plugin-compression'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'

// https://vitejs.dev/config/
export default ({ mode }:ConfigEnv) => defineConfig({
  build: {
    outDir: 'dist', // 打包文件的输出目录
    assetsDir: 'static', // 静态资源的存放目录
    assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
    // minify: 'terser', // 混淆器，terser构建后文件体积更小
  },
  plugins: [
    vue(),
    viteCompression({
      // threshold: 1024000 // 对大于 1mb 的文件进行压缩
    }),
    OptimizationPersist(),//预构建
    PkgConfig(),//从包依赖中读取预构建项
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          loadEnv(mode, process.cwd()).VITE_BASE_API,
        // "http://34.232.105.81:8088/api", //测试
        // "http://34.232.105.81:8080/api", //生产
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
    host:true,//同一局域网可以访问本地服务
  },
  // 强制预构建插件包
  // optimizeDeps: {
  //   include: ['axios'],
  // },
});
