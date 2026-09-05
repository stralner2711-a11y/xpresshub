const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

// Real HTTP failures on loopback only. No production requests or publication.
(async () => {
  const module = await import(pathToFileURL(path.resolve('src/modules/update-system.js')));
  const app = fs.readFileSync('app.js', 'utf8').replace(/\r\n/g, '\n');
  const functions = app.slice(app.indexOf('async function fetchVersionInfo()'), app.indexOf('async function checkForAppUpdate('));
  const version = JSON.parse(fs.readFileSync('public/version.json', 'utf8'));
  const build = version.activeVersionCode;
  let mode = 'fallback';
  let requests = 0;
  const server = http.createServer((req, res) => {
    requests++;
    const pathname = new URL(req.url, 'http://localhost').pathname;
    assert(req.url.includes('xpressUpdateCheck='), 'Version checks must bypass stale caches');
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'timeout') return;
    if (mode === 'offline' || pathname === '/primary') { res.writeHead(503); res.end('{}'); return; }
    if (pathname === '/invalid') { res.end('{bad json'); return; }
    res.end(JSON.stringify({ ...version, activeVersionCode: pathname === '/old' ? build - 1 : build }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const context = vm.createContext({
    URL, Date, AbortController,
    setTimeout: callback => setTimeout(callback, mode === 'timeout' ? 25 : 10000),
    clearTimeout,
    appUpdateConfig: { versionUrl: `${origin}/primary`, versionFallbackUrls: [`${origin}/invalid`, `${origin}/old`, `${origin}/current`] },
    window: { location: { href: origin + '/' } },
    isAllowedUpdateUrl: url => new URL(url).origin === origin,
    normalizeVersionInfo: raw => module.normalizeVersionInfo(raw, { currentHref: origin, currentOrigin: origin }),
    fetch: (url, options) => {
      assert.equal(new URL(url).origin, origin, 'Test must never send an external request');
      assert.equal(options.cache, 'no-store');
      return fetch(url, options);
    },
  });
  vm.runInContext(functions, context);
  try {
    const result = await context.fetchVersionInfo();
    assert.equal(result.activeVersionCode, build);
    assert.equal(result.sourceUrl, origin + '/current');
    assert.equal(requests, 4);
    mode = 'offline';
    await assert.rejects(context.fetchVersionInfo());
    mode = 'timeout';
    await assert.rejects(context.fetchVersionInfo());
    const options = { currentHref: origin, currentOrigin: origin };
    for (const url of ['http://github.com/stralner2711-a11y/xpresshub/test.apk', 'https://user:password@github.com/stralner2711-a11y/xpresshub/test.apk', 'https://github.com.evil.invalid/stralner2711-a11y/xpresshub/test.apk']) {
      assert.equal(module.isAllowedUpdateUrl(url, options), false);
    }
    assert.throws(() => module.normalizeVersionInfo({ ...version, activeVersionCode: 72.5 }, options));

    const current = { appVersionCode: build };
    assert.equal(module.shouldShowUpdate(version, current), false);
    const next = { ...version, activeVersionCode: build + 1, forceUpdate: false };
    assert.equal(module.shouldShowUpdate(next, current), true);
    assert.equal(module.shouldShowUpdate(next, { ...current, dismissedVersionCode: build + 1 }), false);
    assert.equal(module.shouldShowUpdate(next, { ...current, dismissedVersionCode: build + 1, manual: true }), true);
    assert.equal(module.shouldShowUpdate({ ...next, forceUpdate: true }, { ...current, dismissedVersionCode: build + 1 }), true);
    assert.equal(module.shouldShowUpdate({ ...version, activeVersionCode: build - 1, rollbackReason: 'Test rollback' }, current), true);
    assert.equal(module.stableRollbackUrl({ ...version, stableApkDownloadUrl: 'https://evil.invalid/test.apk', previousStableApkDownloadUrl: '' }, current), '');
    for (const raw of [null, {}, { ...version, activeVersionCode: 0 }, { ...version, apkDownloadUrl: 'https://evil.invalid/test.apk' }]) {
      assert.throws(() => module.normalizeVersionInfo(raw, { currentHref: origin, currentOrigin: origin }));
    }
    console.log('Closed update test passed: loopback HTTP 503, malformed JSON, stale fallback, current version, complete outage, dismiss/manual/force rules, rollback selection and foreign APK rejection.');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
