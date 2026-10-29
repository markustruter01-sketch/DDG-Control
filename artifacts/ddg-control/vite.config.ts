import path from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig, type Plugin } from 'vite';

// The public DDG website is served at "/". DDG Control lives at a secret path: the folder
// named below. This is the one place that name is set. The website bundle never contains it.
const CONTROL_DIR = 'ctl-3gv376wpguby';
if (!fs.existsSync(path.resolve(import.meta.dirname, CONTROL_DIR, 'index.html'))) {
  throw new Error(`Control entry ${CONTROL_DIR}/index.html is missing`);
}

// Dev server only: deep links inside Control (e.g. /<secret>/ops) load Control, not the website.
const controlDevRewrite = (): Plugin => ({
  name: 'control-dev-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url ?? '';
      if (url.startsWith(`/${CONTROL_DIR}/`) && !url.includes('.') ) req.url = `/${CONTROL_DIR}/index.html`;
      next();
    });
  },
});

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [react(), controlDevRewrite()],
  define: { __CONTROL_BASE__: JSON.stringify(`/${CONTROL_DIR}`) },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        site: path.resolve(import.meta.dirname, 'index.html'),
        control: path.resolve(import.meta.dirname, CONTROL_DIR, 'index.html'),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
