const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const index = fs.readFileSync('index.html', 'utf8');
const publicManifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
const rootManifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const download = fs.readFileSync('public/download.html', 'utf8');
const docsDownload = fs.readFileSync('docs/download.html', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const publicServiceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');

assert(index.includes('viewport-fit=cover'), 'index should support iPhone safe-area layout');
assert(index.includes('mobile-web-app-capable'), 'index should support mobile web app install metadata');
assert(index.includes('apple-mobile-web-app-capable'), 'index should support iPhone home screen mode');
assert(index.includes('apple-touch-icon'), 'index should expose Apple touch icons');
assert(index.includes('format-detection'), 'index should avoid unwanted phone-number auto formatting');

for (const manifest of [publicManifest, rootManifest]) {
  assert(manifest.display === 'standalone', 'manifest should use standalone display');
  assert(manifest.orientation === 'portrait', 'manifest should prefer portrait on phones');
  assert(Array.isArray(manifest.display_override) && manifest.display_override.includes('standalone'), 'manifest should include display_override');
  assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'manifest should expose useful app shortcuts');
  assert(manifest.shortcuts.some(shortcut => shortcut.name === 'Beskeder'), 'manifest should include message shortcut');
  assert(manifest.shortcuts.some(shortcut => shortcut.name === 'Live-kort'), 'manifest should include live map shortcut');
  assert(manifest.shortcuts.some(shortcut => shortcut.name === 'Arbejde'), 'manifest should include work shortcut');
}

for (const html of [download, docsDownload]) {
  assert(html.includes('Installer XpressIntra'), 'download page should look like an install page');
  assert(html.includes('Åbn appen på iPhone eller pc'), 'download page should clearly open web app for iPhone/PC');
  assert(html.includes('iPhone kan ikke installere APK-filer'), 'download page should stop iPhone users from trying APK');
  assert(html.includes('Føj til hjemmeskærm'), 'download page should show iPhone home screen step');
  assert(html.includes('Brug Safari på iPhone'), 'download page should mention Safari for iPhone');
  assert(html.includes('Tillad installation fra ukendte kilder'), 'download page should still guide Android APK install');
  assert(html.includes('Skriv aldrig adgangskoden andre steder'), 'download page should include safety guidance');
}

assert(serviceWorker === publicServiceWorker, 'root and public service workers should match');
assert(serviceWorker.includes('xpressintra-v109-webapp-polish'), 'service worker cache should be bumped for webapp polish');
assert(serviceWorker.includes('./download.html'), 'service worker should cache the install/download page');
assert(app.includes('På iPhone åbner du siden i Safari'), 'login install card should guide iPhone users clearly');

console.log('PWA webapp smoke test passed');
