import { fileURLToPath, URL } from "node:url";
import path from 'path';
import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import prismjs from "vite-plugin-prismjs";
import { polyfillNode, PolyfillNodeForDenoOptions } from "esbuild-plugin-polyfill-node";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => defineConfig({
  // define: {
  //   'process.env': {}
  // },
  build: {
    outDir: 'dist', // 打包文件的输出目录
    assetsDir: 'static', // 静态资源的存放目录
    assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
    // minify: 'terser', // 混淆器，terser构建后文件体积更小
    target: ['es2020', 'safari14'],
  },
  plugins: [
    vue(),
    prismjs({
      languages: ["json", "js"],
      //  languages: 'all',
      plugins: ["line-numbers"], //配置显示行号插件
      theme: "solarizedlight", //主题名称
      css: true,
    }),
    viteCompression({
      // threshold: 1024000 // 对大于 1mb 的文件进行压缩
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // 配置文件扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
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
      "/socket.io": {
        // VUE_APP_BASE_RUL = 'ws://172.16.31.68:9898/socket.io'
        target:
          "http://61.172.179.6:30314/socket.io",
        changeOrigin: true, //是否跨域
        ws:true,
        rewrite: (path) => path.replace(/^\/socket.io/, ""),
      },
    },
    host: true,//同一局域网可以访问本地服务
  },
  // 强制预构建插件包
  optimizeDeps: {
    include: ['axios'],
    esbuildOptions: {
      target: ['es2020', 'safari14'],
      plugins: [
        polyfillNode({}),
      ],
    },
  },
});
