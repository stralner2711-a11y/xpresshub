const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

const capacitor = JSON.parse(read('capacitor.config.json'));
const packageJson = JSON.parse(read('package.json'));
const publicVersion = JSON.parse(read(path.join('public', 'version.json')));
const updateScript = read('opdater-alt.ps1');
const apkScript = read('Build Android APK.ps1');
const browserPreview = read(path.join('qa', 'browser-preview.html'));

assert.strictEqual(capacitor.webDir, 'web-build', 'Capacitor skal bruge den rene web-build mappe');
assert.strictEqual(capacitor.android?.path, 'android-active', 'Capacitor skal bruge android-active');
assert.strictEqual(capacitor.ios?.path, 'ios-active', 'Capacitor skal bruge ios-active');
assert(packageJson.scripts.build.includes('vite.active.config.js'), 'Build skal bruge den aktive Vite-konfiguration');
assert(updateScript.includes("Join-Path $project 'android-active'"), 'Releasepakken skal kopiere android-active');
assert(updateScript.includes("Join-Path $project 'ios-active'"), 'Releasepakken skal kopiere ios-active');
assert(apkScript.includes('Find-OrInstallJdk17'), 'APK-build skal kunne klargøre JDK 17 automatisk');
assert(apkScript.includes('$capacitorConfig.android.path'), 'APK-build skal følge Capacitors Android-sti');
assert(browserPreview.includes('src="/app.js"'), 'Visuel QA skal bruge den samme aktive app-kilde som produktionen');
assert(!browserPreview.includes('src="/src/app.js"'), 'Visuel QA må ikke bruge den låste legacy-kopi');

for (const relativePath of [
  path.join('web-build', 'index.html'),
  path.join('android-active', 'app', 'src', 'main', 'assets', 'public', 'version.json'),
  path.join('ios-active', 'App', 'App', 'public', 'version.json'),
]) {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} skal findes efter native sync`);
}

const androidVersion = JSON.parse(read(path.join('android-active', 'app', 'src', 'main', 'assets', 'public', 'version.json')));
const iosVersion = JSON.parse(read(path.join('ios-active', 'App', 'App', 'public', 'version.json')));
assert.strictEqual(androidVersion.activeVersion, publicVersion.activeVersion, 'Android skal have samme version som web');
assert.strictEqual(iosVersion.activeVersion, publicVersion.activeVersion, 'iOS skal have samme version som web');

console.log('Native project path smoke test passed');
