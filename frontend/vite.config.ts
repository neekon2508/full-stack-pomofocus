import browserslistToEsbuild from "browserslist-to-esbuild";
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from "vite";
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: '/',
    optimizeDeps: {
      include: ['@emotion/styled', '@mui/material/Tooltip'],
    },
    build: {
      target: browserslistToEsbuild(),
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui': ['@mui/material', '@emotion/styled', '@emotion/react']
          }
        }
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api' : {
          target: env.API_BASE_URL || 'http://localhost:7070',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, res) => {
              console.warn('[Vite Proxy] Backend server connection failed:', err.message);
              console.warn('[Vite Proxy] Target:', env.API_BASE_URL || 'http://localhost:7070');
              console.warn('[Vite Proxy] Make sure backend server is running');
              if (res && !res.headersSent) {
                res.writeHead(503, {
                  'Content-Type': 'application/json',
                });
                res.end(
                  JSON.stringify({
                    successOrNot: 'N',
                    statusCode: 'SERVICE_UNAVAILABLE',
                    message: 'Backend server is not available. Please start the backend server.',
                  })
                );
              }
            });
          },
        },
      },
    },
    define: {
      'process.env' : env,
    },

    assetsInclude: ['**/*.xlsx'],

    plugins: [tsconfigPaths(), react(), svgr()]
  });
};