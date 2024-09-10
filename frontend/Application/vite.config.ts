import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const ALIASES = {
  '@Auth': path.resolve(__dirname, './src/Auth'),
  '@Hooks': path.resolve(__dirname, './src/hooks'),
  '@Layouts': path.resolve(__dirname, './src/Layouts/'),
  '@Pages': path.resolve(__dirname, './src/pages/'),
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...ALIASES,
    },
  },
})
