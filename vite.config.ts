import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { syncSpotifyData, syncYouTubeData, fetchSmartLinkMetadata } from './src/server/syncApi';

function mediaSyncApiPlugin(): Plugin {
  return {
    name: 'media-sync-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const parsedUrl = new URL(req.url, 'http://localhost:3000');

        if (parsedUrl.pathname === '/api/smartlink/fetch') {
          try {
            let input = parsedUrl.searchParams.get('url') || '';
            if (req.method === 'POST') {
              const body = await new Promise<string>((resolve) => {
                let data = '';
                req.on('data', chunk => { data += chunk; });
                req.on('end', () => resolve(data));
              });
              try {
                const parsed = JSON.parse(body);
                if (parsed.url) input = parsed.url;
              } catch {}
            }
            const result = await fetchSmartLinkMetadata(input);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        if (parsedUrl.pathname === '/api/spotify/sync') {
          try {
            let input = parsedUrl.searchParams.get('url') || parsedUrl.searchParams.get('id') || '';
            if (req.method === 'POST') {
              const body = await new Promise<string>((resolve) => {
                let data = '';
                req.on('data', chunk => { data += chunk; });
                req.on('end', () => resolve(data));
              });
              try {
                const parsed = JSON.parse(body);
                if (parsed.url || parsed.id) input = parsed.url || parsed.id;
              } catch {}
            }
            const result = await syncSpotifyData(input);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        if (parsedUrl.pathname === '/api/youtube/sync') {
          try {
            let input = parsedUrl.searchParams.get('channel') || parsedUrl.searchParams.get('url') || '';
            if (req.method === 'POST') {
              const body = await new Promise<string>((resolve) => {
                let data = '';
                req.on('data', chunk => { data += chunk; });
                req.on('end', () => resolve(data));
              });
              try {
                const parsed = JSON.parse(body);
                if (parsed.channel || parsed.url) input = parsed.channel || parsed.url;
              } catch {}
            }
            const result = await syncYouTubeData(input);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mediaSyncApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
