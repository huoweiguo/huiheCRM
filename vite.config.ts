import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: './',
  server: {
    port: 8080, //启动端口
    hmr: {
      host: '127.0.0.1',
      port: 8080
    },
    // 设置 https 代理
    proxy: {
      '/terminal': {
        target: 'https://40d758v734.vicp.fun',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/terminal/, '')
      }
    }
  }
})
