import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 使用正確的 Tailwind 插件
// import tailwindcss from '@tailwindcss/vite'
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: '/bo/', 
  plugins: [
    vue(),
    tailwindcss(), // 將 Tailwind 插件放在這裡
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 傳給 dart-sass 的選項
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
