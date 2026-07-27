'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'public');

function parseCF(input) {
  if (!input) return null;
  const m = input.toUpperCase().match(/(\d{3,5})\s*([A-Z])/);
  if (!m) return null;

  return {
    contest: m[1],
    problem: m[2]
  };
}

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/go') {
      const q = url.searchParams.get('q');

      if (!q) {
        res.writeHead(301, { Location: "/cf" });
        res.end();
        return;
      }
      const parsed = parseCF(q);
      if (!parsed) {
        return send(res, 400, 'Invalid Codeforces problem');
      }

      const target =
        `https://codeforces.com/contest/${parsed.contest}/problem/${parsed.problem}`;

      res.writeHead(301, { Location: target });
      return res.end();
    }

    // /
    if (url.pathname === '/') {
      const file = path.join(PUBLIC_DIR, 'index.html');
      return send(res, 200, fs.readFileSync(file), 'text/html; charset=utf-8');
    }

    if (url.pathname === '/styles.css') {
      const file = path.join(PUBLIC_DIR, 'styles.css');
      return send(res, 200, fs.readFileSync(file), 'text/css; charset=utf-8');
    }
    if (url.pathname === '/scripts.js') {
      const file = path.join(PUBLIC_DIR, 'scripts.js');
      return send(res, 200, fs.readFileSync(file), 'application/javascript; charset=utf-8');
    }
    send(res, 404, 'Not found');
  } catch {
    send(res, 500, 'Internal error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CF redirect server running on http://${HOST}:${PORT}`);
});

