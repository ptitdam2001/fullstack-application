import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const ALIASES = {
  '@mui/styled-engine': '@mui/styled-engine-sc',
  '@Auth': path.resolve(__dirname, './src/Auth'),
  '@Layouts': path.resolve(__dirname, './src/Layouts/'),
  '@Pages': path.resolve(__dirname, './src/pages/'),
  '@Theme': path.resolve(__dirname, './src/Theme'),
  '@Common': path.resolve(__dirname, './src/Common'),
  '@Application': path.resolve(__dirname, './src/Application'),
  '@Providers': path.resolve(__dirname, './src/Providers'),
  '@Sdk': path.resolve(__dirname, './src/sdk/generated'),
  "@": path.resolve(__dirname, "./src"),
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...ALIASES,
    },
  },
  server: {
    port: 3000,
  },
})
