const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const version = JSON.parse(fs.readFileSync('public/version.json', 'utf8'));
const download = fs.readFileSync('public/download.html', 'utf8');
const configExample = fs.readFileSync('public/app-config.example.js', 'utf8');
const serviceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const rootServiceWorker = fs.readFileSync('service-worker.js', 'utf8');
const docs = fs.readFileSync('docs/APP_UPDATE_SYSTEM.md', 'utf8');

assert(app.includes("const APP_DISPLAY_VERSION = '1.2.3'"), 'App should expose human APK version');
assert(app.includes('const APP_VERSION_CODE = 6'), 'App should compare numeric Android version codes');
assert(app.includes('window.XPRESSINTRA_UPDATE'), 'App should read update config from app-config');
assert(app.includes('fetchVersionInfo'), 'App should fetch version.json');
assert(app.includes('normalizeVersionInfo'), 'App should validate version.json');
assert(app.includes('isAllowedUpdateUrl'), 'App should validate update URLs');
assert(app.includes('forceUpdate'), 'App should support forced updates');
assert(app.includes('rollbackReason'), 'App should support rollback messages');
assert(app.includes('openAppUpdateModal'), 'App should show an update dialog');
assert(app.includes('renderUpdateSummary'), 'Settings/creator UI should show update status');
assert(app.includes("data-action=\"check-update\""), 'UI should include manual update check');
assert(app.includes("data-action=\"install-update\""), 'Update dialog should include install action');
assert(app.includes('appUpdateState.required'), 'App should remember known required updates');

assert(styles.includes('.update-summary-card'), 'Update summary should be styled');
assert(styles.includes('.force-update'), 'Forced update modal should be styled');

assert(version.activeVersion === '1.2.3', 'version.json should expose activeVersion');
assert(version.activeVersionCode === 6, 'version.json should expose activeVersionCode');
assert(version.forceUpdate === true, 'Test release should force update visibility');
assert(version.apkDownloadUrl.includes('github.com/stralner2711-a11y/xpresshub'), 'version.json should point to the official GitHub repo');

assert(download.includes('Download XpressIntra'), 'Download page should have a clear download button');
assert(download.includes('Tillad installation fra ukendte kilder'), 'Download page should guide APK installation');
assert(download.includes('github.com/stralner2711-a11y/xpresshub'), 'Download page should point to the official release page');

assert(configExample.includes('XPRESSINTRA_UPDATE'), 'Config example should document update config');
assert(configExample.includes('stralner2711-a11y.github.io/xpresshub/version.json'), 'Config example should show official GitHub Pages version.json URL');
assert(!serviceWorker.includes("'./version.json'"), 'Service worker should not pre-cache version.json');
assert(serviceWorker.includes("url.pathname.endsWith('/version.json')"), 'Service worker should bypass version.json cache');
assert(serviceWorker.includes('./download.html'), 'Service worker should cache download page for fallback');
assert(rootServiceWorker === serviceWorker, 'Root service worker should match public service worker');
assert(docs.includes('Officielt repository'), 'Docs should document official repository');
assert(docs.includes('Rollback'), 'Docs should document rollback workflow');

console.log('App update system smoke test passed');
