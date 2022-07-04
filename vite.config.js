import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    watch: process.env.NODE_ENV === 'development' ? {} : undefined,
    lib: {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'Popup',
      fileName: format => `popup.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver()
    }),
    Icons()
  ]
})
