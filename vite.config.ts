import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the site works at nishitaphutane.github.io/my_portfolio/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
