import { fileURLToPath, URL } from "node:url";
import path from 'path';
import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from 'vite';
import vue from "@vitejs/plugin-vue";
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import prismjs from "vite-plugin-prismjs";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import nodePolyfills from "rollup-plugin-node-polyfills";

import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => defineConfig({
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    outDir: 'dist', // 打包文件的输出目录
    assetsDir: 'static', // 静态资源的存放目录
    assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
    // minify: 'terser', // 混淆器，terser构建后文件体积更小
    target: ['es2020', 'safari14'],
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
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
    // mock 配置
    viteMockServe({
      // default
      mockPath: 'mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      'rpc-websockets/dist/lib/client': 'rpc-websockets/build-ts/lib/client',
      'near-api-js': 'near-api-js/dist/near-api-js.js',
    },
    // 配置文件扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    proxy: {
      "/api/v2/zan": {
        target: "http://61.172.179.6:30301/api/v2/zan",
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/api\/v2\/zan/, ""),
      },
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
          "http://61.172.179.6/nodeService",
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
      "/agent": {
        target: "https://gpt.lonic.tech/api/v1/chat/completions",
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/agent/, ""),
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
        polyfillNode({ })
      ],
    },
  },
});
