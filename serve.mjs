// Minimal static server for local preview: node serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const port = Number(process.argv[2] || 5173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };
createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = normalize(join('.', url === '/' ? 'index.html' : url));
  if (file.startsWith('..') || file.startsWith('node_modules')) { res.writeHead(403).end(); return; }
  let body;
  try { body = await readFile(file); } catch { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }).end(body);
}).listen(port, () => console.log(`http://localhost:${port}`));
