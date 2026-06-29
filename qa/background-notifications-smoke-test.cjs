const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const worker = fs.readFileSync('service-worker.js', 'utf8');
const publicWorker = fs.readFileSync('public/service-worker.js', 'utf8');
const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
const mainActivity = fs.readFileSync('android/app/src/main/java/dk/xpressbudet/xpressintra/MainActivity.java', 'utf8');
const version = JSON.parse(fs.readFileSync('public/version.json', 'utf8'));

assert(app.includes(`const APP_VERSION = '${version.activeVersion}-release-v101'`), 'App should expose the notification release version');
assert(app.includes('function requestSystemNotifications'), 'App should request system notification permission from a user action');
assert(app.includes('function showSystemNotification'), 'App should show system notifications');
assert(app.includes('function safeSystemNotificationBody'), 'App should keep lock-screen chat text private');
assert(app.includes("return 'Åbn XpressIntra for at læse beskeden.'"), 'Chat notifications should not expose message body on the lock screen');
assert(app.includes('notificationPrefs.system'), 'System notification preference should be explicit and opt-in');
assert(app.includes("data-action=\"request-system-notifications\""), 'Settings/notification UI should expose activation action');
assert(app.includes("channel('xpressintra-notifications')"), 'App should subscribe to realtime notification rows');
assert(app.includes("table: 'notifications'"), 'Realtime notifications should listen to the notifications table');
assert(app.includes('addNotification(item, { system: true })'), 'Realtime notifications should trigger local system notification layer');
assert(
  /addNotification\(\{\s*type: 'Chatbesked'/.test(app),
  'Incoming chat messages should create app notifications'
);
assert(app.includes('showSystemNotification(item)'), 'addNotification should be able to trigger system notifications');
assert(app.includes('isQuietHoursNow'), 'System notifications should respect quiet hours');
assert(
  app.includes("if (choice?.outcome === 'accepted')") || app.includes("if (choice.outcome === 'accepted')"),
  'PWA install flow should handle accepted installs'
);
assert(app.includes("await requestSystemNotifications()"), 'PWA install flow should ask for notification permission after install acceptance');
assert(manifest.includes('android.permission.POST_NOTIFICATIONS'), 'Android manifest should request notification permission');
assert(mainActivity.includes('requestNotificationPermissionOnFirstStart'), 'Android app should ask for notification permission on first start');
assert(mainActivity.includes('Build.VERSION_CODES.TIRAMISU'), 'Android notification permission should be requested only on Android 13+');

for (const source of [worker, publicWorker]) {
  assert(source.includes("CACHE_NAME = 'xpressintra-v101-update-detection'"), 'Service worker cache should be bumped for the GitHub release robustness update');
  assert(source.includes("self.addEventListener('notificationclick'"), 'Service worker should handle notification clicks');
  assert(source.includes("clients.openWindow"), 'Service worker should open the app from a notification');
}

assert(/^1\.3\.\d+$/.test(version.activeVersion), 'Release version should be a 1.3.x build');
assert(Number.isInteger(version.activeVersionCode) && version.activeVersionCode >= 54, 'Release build should be incremented');
assert(version.changelog.some(item => item.includes(`build ${version.activeVersionCode}`)), 'Changelog should mention the current build');

console.log('Background notifications smoke test passed');





