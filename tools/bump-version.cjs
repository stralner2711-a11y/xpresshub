const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

function usage() {
  console.log(`Usage:
  node tools/bump-version.cjs <displayVersion> <versionCode> [cacheLabel]

Examples:
  node tools/bump-version.cjs 1.3.50 63
  node tools/bump-version.cjs 1.3.50 63 bundled-deps-v110

Updates:
  - src/app.js (APP_VERSION, APP_DISPLAY_VERSION, APP_VERSION_CODE)
  - android/app/build.gradle (versionName, versionCode)
  - service-worker.js, public/service-worker.js (CACHE_NAME)
`);
}

const displayVersion = String(process.argv[2] || '').trim();
const versionCode = Number(process.argv[3]);
const cacheLabel = String(process.argv[4] || `v${versionCode}`).trim();

if (!/^\d+\.\d+\.\d+$/.test(displayVersion) || !Number.isFinite(versionCode) || versionCode <= 0) {
  usage();
  process.exit(1);
}

const releaseTag = `${displayVersion}-release-v${versionCode}`;
const cacheName = `xpressintra-${cacheLabel}`;

let app = read('src/app.js');
app = app.replace(/const APP_VERSION = '[^']+';/, `const APP_VERSION = '${releaseTag}';`);
app = app.replace(/const APP_DISPLAY_VERSION = '[^']+';/, `const APP_DISPLAY_VERSION = '${displayVersion}';`);
app = app.replace(/const APP_VERSION_CODE = \d+;/, `const APP_VERSION_CODE = ${versionCode};`);
write('src/app.js', app);

let gradle = read('android/app/build.gradle');
gradle = gradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName "[^"]+"/, `versionName "${displayVersion}"`);
write('android/app/build.gradle', gradle);

for (const file of ['service-worker.js', 'public/service-worker.js']) {
  let source = read(file);
  source = source.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${cacheName}';`);
  write(file, source);
}

console.log(`Version bumped to ${displayVersion} (build ${versionCode})`);
console.log(`Release tag: ${releaseTag}`);
console.log(`Service worker cache: ${cacheName}`);
console.log('');
console.log('Remember to update version.json and changelog before release.');
