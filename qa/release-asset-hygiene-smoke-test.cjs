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
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert(!index.includes('unpkg.com/@supabase/supabase-js'), 'index.html should not load Supabase from CDN');
assert(index.includes('src/lib/runtime-deps.js'), 'index.html should bundle Supabase through Vite runtime deps');
assert(packageJson.devDependencies?.['@supabase/supabase-js'], 'package.json should declare bundled Supabase dependency');
assert(packageJson.devDependencies?.leaflet, 'package.json should declare bundled Leaflet dependency');
assert(fs.existsSync('vite.config.js'), 'vite.config.js should exist for bundled dependencies');

assert(!index.includes('leaflet@1.9.4'), 'index.html should not preload Leaflet; the app lazy-loads the map library once');
assert(fs.existsSync('src/modules/leaflet-loader.js'), 'leaflet-loader module should exist for bundled map library');
assert(app.includes('XpressIntraLeaflet?.ensureLeaflet'), 'app should delegate Leaflet loading to the bundled loader module');

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
