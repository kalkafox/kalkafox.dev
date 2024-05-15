import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx(/* jsxImportSource: …, otherOptions… */) },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-helmet-async'],
          'react-router': ['@tanstack/react-router'],
          three: ['three'],
          //'react-fiber': ['@react-three/fiber'],
          'react-spring': ['@react-spring/web', '@react-spring/three'],
          // shadcn: ['lucide-react'],
          // iconify: ['@iconify/react'],
          // lodash: ['lodash'],
          // radix: [
          //   'alert-dialog',
          //   'slot',
          //   'dropdown-menu',
          //   'scroll-area',
          //   'icons',
          // ].map((s) => `@radix-ui/react-${s}`),
          // sonner: ['sonner'],
          // jotai: ['jotai'],
          // tailwind: ['tailwind-merge'],
        },
      },
    },
  },
})
