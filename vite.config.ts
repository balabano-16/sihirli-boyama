import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel build sırasında process.env.API_KEY'i yakalar ve kodun içine gömer
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});