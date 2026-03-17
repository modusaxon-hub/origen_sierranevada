import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const assetsPath = path.resolve(__dirname, '../../assets');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-lucide': ['lucide-react'],
          }
        }
      }
    },
    server: {
      port: 5000,
      host: '127.0.0.1',
      allowedHosts: true,
      strictPort: true,
      cors: true,
      fs: {
        allow: [
          path.resolve(__dirname, './'),
          assetsPath,
        ],
      },
    },
    plugins: [
      react(),
      svgr(),
      {
        name: 'watch-assets',
        configureServer(server) {
          server.watcher.add(assetsPath);
        },
      },
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': assetsPath,
      }
    }
  };
});
