import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('out');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer(async (req, res) => {
  try {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    let body = await readFile(file);
    const type = types[path.extname(file)] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.setHeader('Vary', 'Accept-Encoding');
    if (/text|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      body = gzipSync(body);
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Cache-Control', file.includes(`${path.sep}_next${path.sep}static${path.sep}`) || file.includes(`${path.sep}responsive${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache');
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(3001, '127.0.0.1', () => console.log('Production preview: http://127.0.0.1:3001'));
