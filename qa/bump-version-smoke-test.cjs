const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const scriptPath = path.join('tools', 'bump-version.cjs');
assert(fs.existsSync(scriptPath), 'bump-version script should exist');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert(packageJson.scripts?.bump === 'node tools/bump-version.cjs', 'package.json should expose npm run bump');

const app = fs.readFileSync('src/app.js', 'utf8');
const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
const iosProject = fs.readFileSync('ios/App/App.xcodeproj/project.pbxproj', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');

const displayMatch = app.match(/const APP_DISPLAY_VERSION = '([^']+)';/);
const codeMatch = app.match(/const APP_VERSION_CODE = (\d+);/);
assert(displayMatch && codeMatch, 'app.js should expose display version and version code constants');

const gradleCodeMatch = gradle.match(/versionCode (\d+)/);
const gradleNameMatch = gradle.match(/versionName "([^"]+)"/);
assert(gradleCodeMatch && gradleNameMatch, 'Android build.gradle should expose versionCode and versionName');
assert(gradleCodeMatch[1] === codeMatch[1], 'Android versionCode should match app.js APP_VERSION_CODE');
assert(gradleNameMatch[1] === displayMatch[1], 'Android versionName should match app.js APP_DISPLAY_VERSION');
assert(packageJson.version === displayMatch[1], 'package.json version should match app.js APP_DISPLAY_VERSION');
assert(iosProject.includes(`CURRENT_PROJECT_VERSION = ${codeMatch[1]};`), 'iOS build number should match app.js APP_VERSION_CODE');
assert(iosProject.includes(`MARKETING_VERSION = ${displayMatch[1]};`), 'iOS version should match app.js APP_DISPLAY_VERSION');
assert(serviceWorker.includes('const CACHE_NAME = '), 'service worker should declare a cache name');

console.log('Bump version smoke test passed');
