const fs = require('fs');
const http = require('http');
const path = require('path');
const Module = require('module');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'docs', 'demo-video', 'screens');
fs.mkdirSync(outputDir, { recursive: true });

function requirePlaywright() {
  const runtimeNodeModules = 'C:\\Users\\Tommy\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
  const pnpmNodeModules = path.join(runtimeNodeModules, '.pnpm', 'node_modules');
  process.env.NODE_PATH = [process.env.NODE_PATH, runtimeNodeModules, pnpmNodeModules].filter(Boolean).join(path.delimiter);
  Module._initPaths();
  try { return require('playwright-core'); } catch {}
  try { return require('playwright'); } catch {}
  throw new Error('Playwright blev ikke fundet.');
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
  }[ext] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
    if (!fs.existsSync(filePath) && urlPath === '/xpressbudet-logo-transparent.png') {
      filePath = path.join(root, 'public', 'xpressbudet-logo-transparent.png');
    }
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('missing');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
    });
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const { chromium } = requirePlaywright();
  const server = await startServer();
  const port = server.address().port;
  const executablePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find(fs.existsSync);

  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const tabs = ['home', 'work', 'map', 'chat', 'info', 'more'];

  await page.addInitScript(() => {
    localStorage.setItem('roadlog:session', JSON.stringify({
      email: 'stralner2711@gmail.com',
      mode: 'demo',
      signedInAt: new Date().toISOString(),
    }));
    localStorage.setItem('roadlog:profile', JSON.stringify({
      name: 'Tommy Hansen',
      phone: '+45 22 44 18 90',
      email: 'stralner2711@gmail.com',
      role: 'Creator',
      accessRole: 'owner',
      vehicleType: 'truck',
      truck: 'TR 42 918',
      department: 'Lastbil',
      license: 'C/E - Creator',
      emergencyContact: 'Anne',
      languages: 'Dansk, engelsk, tysk',
      logbook: true,
    }));
    sessionStorage.setItem('xpressintra:launchSplashSeen', '1');
  });

  for (const tab of tabs) {
    await page.goto(`http://127.0.0.1:${port}/?tab=${tab}&demo=video`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, `${tab}.png`), fullPage: false });
  }

  await browser.close();
  server.close();
  console.log(outputDir);
})();
