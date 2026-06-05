const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'docs', 'makeover-preview.html');
const port = Number(process.env.MAKEOVER_PORT || 57411);

http.createServer((req, res) => {
  if (req.url !== '/' && req.url !== '/makeover-preview.html') {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(file));
}).listen(port, '127.0.0.1', () => {
  console.log(`Makeover preview: http://localhost:${port}`);
});
