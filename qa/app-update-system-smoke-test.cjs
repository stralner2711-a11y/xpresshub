const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const updateSystem = fs.readFileSync('src/modules/update-system.js', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const version = JSON.parse(fs.readFileSync('public/version.json', 'utf8'));
const docsVersion = JSON.parse(fs.readFileSync('docs/version.json', 'utf8'));
const rootVersion = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const download = fs.readFileSync('public/download.html', 'utf8');
const configExample = fs.readFileSync('public/app-config.example.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const rootServiceWorker = fs.readFileSync('service-worker.js', 'utf8');
const docs = fs.readFileSync('docs/APP_UPDATE_SYSTEM.md', 'utf8');
const androidManifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
const mainActivity = fs.readFileSync('android/app/src/main/java/dk/xpressbudet/xpressintra/MainActivity.java', 'utf8');
const updateInstallerPlugin = fs.readFileSync('android/app/src/main/java/dk/xpressbudet/xpressintra/UpdateInstallerPlugin.java', 'utf8');

assert(app.includes(`const APP_DISPLAY_VERSION = '${version.activeVersion}'`), 'App should expose human APK version');
assert(app.includes(`const APP_VERSION_CODE = ${version.activeVersionCode}`), 'App should compare numeric Android version codes');
assert(app.includes('window.XPRESSINTRA_UPDATE'), 'App should read update config from app-config');
assert(app.includes('fetchVersionInfo'), 'App should fetch version.json');
assert(app.includes('normalizeVersionInfo'), 'App should validate version.json');
assert(app.includes('isAllowedUpdateUrl'), 'App should validate update URLs');
assert(app.includes('forceUpdate'), 'App should support forced updates');
assert(app.includes('rollbackReason'), 'App should support rollback messages');
assert(app.includes('stableRollbackUrl'), 'App should resolve a stable rollback URL');
assert(app.includes('openRollbackCenterModal'), 'Creator should have a rollback center');
assert(app.includes("data-action=\"open-rollback-center\""), 'Creator UI should include rollback/backup action');
assert(app.includes("data-action=\"install-stable-rollback\""), 'Rollback center should include install stable action');
assert(app.includes('openAppUpdateModal'), 'App should show an update dialog');
assert(app.includes('installAppUpdate'), 'App should use native update installation when available');
assert(app.includes('UpdateInstaller'), 'App should call the Android update installer plugin');
assert(app.includes('renderUpdateSummary'), 'Settings/creator UI should show update status');
assert(app.includes("data-action=\"check-update\""), 'UI should include manual update check');
assert(app.includes("data-action=\"install-update\""), 'Update dialog should include install action');
assert(app.includes('appUpdateState.required'), 'App should remember known required updates');
assert(app.includes('XpressIntraUpdateSystem.normalizeVersionInfo'), 'App should delegate version validation to the update module when loaded');
assert(app.includes('XpressIntraUpdateSystem.shouldShowUpdate'), 'App should delegate update visibility rules to the update module when loaded');
assert(updateSystem.includes('export function normalizeVersionInfo'), 'Update module should export version validation');
assert(updateSystem.includes('export function shouldShowUpdate'), 'Update module should export update visibility rules');
assert(updateSystem.includes('globalThis.XpressIntraUpdateSystem'), 'Update module should expose a browser global for the app wrapper');

assert(styles.includes('.update-summary-card'), 'Update summary should be styled');
assert(styles.includes('.force-update'), 'Forced update modal should be styled');

assert(version.activeVersion === '1.3.32', 'version.json should expose activeVersion');
assert(version.activeVersionCode === 45, 'version.json should expose activeVersionCode');
assert(version.forceUpdate === true, 'Test release should force update visibility');
assert(version.apkDownloadUrl.includes('github.com/stralner2711-a11y/xpresshub'), 'version.json should point to the official GitHub repo');
assert(version.previousStableVersion === '1.3.31', 'version.json should keep the previous stable version for rollback');
assert(version.previousStableApkDownloadUrl.includes('/v1.3.31/'), 'version.json should expose previous stable APK for rollback');
assert(version.changelog.some(item => item.includes('build 45')), 'version.json should explain why this update is detected by phones');
assert(docsVersion.activeVersion === version.activeVersion, 'docs/version.json should match public version for GitHub Pages');
assert(docsVersion.activeVersionCode === version.activeVersionCode, 'docs/version.json should match public build code');
assert(rootVersion.activeVersion === version.activeVersion, 'root version.json should match public version for root-hosted Pages');
assert(rootVersion.activeVersionCode === version.activeVersionCode, 'root version.json should match public build code');

assert(download.includes('iPhone eller pc'), 'Download page should guide iPhone and PC users to the web app');
assert(download.includes('Download Android APK'), 'Download page should still have a clear Android APK button');
assert(download.includes('F?j til hjemmesk?rm'), 'Download page should guide iPhone home screen installation');
assert(download.includes('Tillad installation fra ukendte kilder'), 'Download page should guide APK installation');
assert(download.includes('Skriv aldrig adgangskoden andre steder'), 'Download page should include plain safety guidance');
assert(download.includes(`/releases/download/v${version.activeVersion}/xpressintra.apk`), 'Download page should point directly to the latest APK');

assert(configExample.includes('XPRESSINTRA_UPDATE'), 'Config example should document update config');
assert(configExample.includes('stralner2711-a11y.github.io/xpresshub/version.json'), 'Config example should show official GitHub Pages version.json URL');
assert(!serviceWorker.includes("'./version.json'"), 'Service worker should not pre-cache version.json');
assert(serviceWorker.includes("url.pathname.endsWith('/version.json')"), 'Service worker should bypass version.json cache');
assert(serviceWorker.includes("'./index.html'"), 'Service worker should pre-cache index.html');
assert(!serviceWorker.includes('indep.html'), 'Service worker should not reference old indep.html fallback');
assert(!serviceWorker.includes('ppressbudet'), 'Service worker should not reference misspelled logo file');
assert(serviceWorker.includes("caches.match('./index.html')"), 'Service worker should use index.html as offline navigation fallback');
assert(serviceWorker.includes('./download.html'), 'Service worker should cache download page for fallback');
assert(rootServiceWorker === serviceWorker, 'Root service worker should match public service worker');
assert((indexHtml.match(/@supabase\/supabase-js@2/g) || []).length === 1, 'Index should only load Supabase CDN once');
assert(docs.includes('Officielt repository'), 'Docs should document official repository');
assert(docs.includes('Rollback'), 'Docs should document rollback workflow');
assert(androidManifest.includes('REQUEST_INSTALL_PACKAGES'), 'Android app should request install packages permission');
assert(mainActivity.includes('registerPlugin(UpdateInstallerPlugin.class)'), 'MainActivity should register the update installer plugin');
assert(updateInstallerPlugin.includes('@CapacitorPlugin(name = "UpdateInstaller")'), 'Android update installer plugin should be registered for Capacitor');
assert(updateInstallerPlugin.includes('ACTION_MANAGE_UNKNOWN_APP_SOURCES'), 'Update installer should guide users to unknown app source settings');
assert(updateInstallerPlugin.includes('application/vnd.android.package-archive'), 'Update installer should launch the Android APK installer');

console.log('App update system smoke test passed');











