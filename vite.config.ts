import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: [ 'chrome >= 60', 'not IE 11' ],
      additionalModernPolyfills: [ 'regenerator-runtime/runtime' ]
    })
  ],
  build: {
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
})
