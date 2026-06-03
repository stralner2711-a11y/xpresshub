const fs = require('fs');
const path = require('path');
const Module = require('module');

function requirePlaywright() {
  const runtimeNodeModules = 'C:\\Users\\Tommy\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
  const pnpmNodeModules = path.join(runtimeNodeModules, '.pnpm', 'node_modules');
  process.env.NODE_PATH = [process.env.NODE_PATH, runtimeNodeModules, pnpmNodeModules].filter(Boolean).join(path.delimiter);
  Module._initPaths();
  const candidates = [
    'playwright',
    'playwright-core',
    path.join(runtimeNodeModules, 'playwright', 'index.js'),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {}
  }
  throw new Error('Playwright blev ikke fundet.');
}

(async () => {
  const { chromium } = requirePlaywright();
  const source = path.resolve('docs/demo-video/xpressintra-demo-video.html');
  const outputDir = path.resolve('docs/demo-video');
  const output = path.join(outputDir, 'xpressintra-demo-video.webm');
  fs.mkdirSync(outputDir, { recursive: true });
  const executablePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find(fs.existsSync);

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`file://${source.replace(/\\/g, '/')}`, { waitUntil: 'load' });
  const bytes = await page.evaluate(() => window.renderDemoVideo());
  await browser.close();
  fs.writeFileSync(output, Buffer.from(bytes));
  console.log(output);
})();
