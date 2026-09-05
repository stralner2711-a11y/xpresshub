const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('app.js', 'utf8');
const code = source.slice(source.indexOf('let appUpdateInstalling ='), source.indexOf('function openAppUpdateModal('));

function harness(platform, failure = false) {
  const calls = [];
  const context = vm.createContext({
    URL, Date,
    window: {
      location: { href: 'https://test.invalid/?tab=home', replace: url => calls.push(['navigate', url]) },
      Capacitor: { getPlatform: () => platform, Plugins: { UpdateInstaller: {
        install: async () => { calls.push(['install']); if (failure) throw Error('denied'); return { started: true }; },
      } } },
    },
    navigator: { serviceWorker: { getRegistration: async () => ({ update: async () => calls.push(['worker']) }) } },
    fetch: async () => { calls.push(['fetch']); if (failure) throw Error('offline'); return { ok: true }; },
    isAllowedUpdateUrl: () => true,
    openExternalUpdateLink: () => calls.push(['external']),
    showToast: message => calls.push(['toast', message]),
  });
  vm.runInContext(code, context);
  return { context, calls };
}

(async () => {
  for (const platform of ['web', 'android']) {
    for (const failure of [false, true]) {
      const test = harness(platform, failure);
      await test.context.installAppUpdate('https://test.invalid/update.apk');
      const types = test.calls.map(call => call[0]);
      assert(!types.includes('external'), 'Do not silently redirect failed installs to a browser');
      assert.equal(types.includes('install'), platform === 'android');
      assert.equal(types.includes('navigate'), platform === 'web' && !failure);
      if (platform === 'web' && !failure) {
        const target = new URL(test.calls.find(call => call[0] === 'navigate')[1]);
        assert.equal(target.searchParams.get('tab'), 'home');
        assert(target.searchParams.has('app-update'));
        assert(types.indexOf('worker') < types.indexOf('navigate'));
      }
      assert.equal(vm.runInContext('appUpdateInstalling', test.context), false);
    }
  }
  const native = fs.readFileSync('android-active/app/src/main/java/dk/xpressbudet/xpressintra/UpdateInstallerPlugin.java', 'utf8');
  assert(native.includes('startActivityForResult(call, settings, "installPermissionResult")'));
  assert(native.includes('@ActivityCallback'));
  assert(native.includes('install(call);'));
  console.log('Update click regression passed: web reload, offline retry, Android routing and permission continuation contract.');
})().catch(error => { console.error(error); process.exitCode = 1; });
