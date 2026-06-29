const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const publicServiceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const releaseScript = fs.readFileSync('tools/opdater-alt.ps1', 'utf8');

const supabaseImports = index.match(/@supabase\/supabase-js/g) || [];
assert(supabaseImports.length === 1, 'index.html should load Supabase CDN exactly once');

assert(!index.includes('leaflet@1.9.4'), 'index.html should not preload Leaflet; the app lazy-loads the map library once');
assert(app.includes('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'), 'app should lazy-load Leaflet JS when a real map is shown');
assert(app.includes('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'), 'app should lazy-load Leaflet CSS when a real map is shown');

for (const source of [serviceWorker, publicServiceWorker]) {
  assert(source.includes('./index.html'), 'service worker should cache and fall back to index.html');
  assert(source.includes('./xpressbudet-logo-transparent.png'), 'service worker should cache the real XpressBudet logo');
  assert(!source.includes('indep.html'), 'service worker must not reference old indep.html');
  assert(!source.includes('ppressbudet-logo-transparent.png'), 'service worker must not reference misspelled logo file');
}

assert(gitignore.includes('android/offline-maven/'), 'local Gradle cache should be ignored by Git');
assert(releaseScript.includes("android\\offline-maven"), 'release script should exclude local Gradle cache from GitHub package');
assert(releaseScript.includes("android\\app\\build"), 'release script should exclude Android build output from GitHub package');
assert(releaseScript.includes("ios\\App\\build"), 'release script should exclude iOS build output from GitHub package');

console.log('Release asset hygiene smoke test passed');
