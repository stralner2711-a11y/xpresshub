const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const worker = fs.readFileSync('public/service-worker.js', 'utf8');
const rootWorker = fs.readFileSync('service-worker.js', 'utf8');
const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');

for (const source of [worker, rootWorker]) {
assert(source.includes("CACHE_NAME = 'xpressintra-v72-reactivate-employees'"), 'Service worker cache version should be bumped');
  assert(source.includes('shouldBypassCache'), 'Service worker should have an explicit cache bypass');
  assert(source.includes("url.hostname === 'supabase.co' || url.hostname.endsWith('.supabase.co')"), 'Service worker must not cache Supabase API traffic');
  assert(source.includes("url.pathname.endsWith('/app-config.js')"), 'Service worker must not cache runtime backend config');
  assert(source.includes("url.pathname.startsWith('/auth/')"), 'Service worker must bypass auth routes');
  assert(source.includes("url.pathname.startsWith('/rest/')"), 'Service worker must bypass REST routes');
  assert(source.includes("url.pathname.startsWith('/storage/')"), 'Service worker must bypass storage routes');
  assert(!source.includes("cache.put(event.request, copy);\n        return response;"), 'Service worker should not blindly cache every GET response');
}

assert(manifest.includes('android:allowBackup="false"'), 'Android backup should be disabled for private app data');
assert(manifest.includes('android:fullBackupContent="false"'), 'Android full backup content should be disabled');
assert(manifest.includes('android.hardware.location.gps" android:required="false"'), 'GPS hardware should not be required for installation');
assert(manifest.includes('android.hardware.camera" android:required="false"'), 'Camera hardware should not be required for installation');
assert(!manifest.includes('READ_EXTERNAL_STORAGE'), 'Legacy broad external storage permission should not be requested');
assert(!manifest.includes('WRITE_EXTERNAL_STORAGE'), 'Legacy write storage permission should not be requested');

assert(app.includes("const APP_VERSION = '1.3.11-release-v72'"), 'App version should be visible in code');
assert(app.includes("const APP_DISPLAY_VERSION = '1.3.11'"), 'APK display version should be visible in code');
assert(app.includes('const APP_VERSION_CODE = 24'), 'APK version code should be visible in code');
assert(app.includes('!hasSupabaseConfigForMode && storedSessionForMode'), 'Demo mode should not override a configured production backend');

console.log('Professional readiness smoke test passed');




