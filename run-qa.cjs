const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = __dirname;
const qaDir = path.join(root, 'qa');
const preload = path.join(root, 'qa-app-source-redirect.cjs');
const preloadForNode = preload.replace(/\\/g, '/');
const nodeOptions = [process.env.NODE_OPTIONS, `--require="${preloadForNode}"`].filter(Boolean).join(' ');

function run(command, args, label, options = {}) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: Boolean(options.shell),
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
  });
  if (result.status !== 0) {
    console.error(`\nFAILED: ${label}`);
    process.exit(result.status || 1);
  }
}

const buildDir = path.join(os.tmpdir(), `xpressintra-qa-${Date.now()}`);
if (process.platform === 'win32') {
  run(
    'cmd.exe',
    ['/d', '/s', '/c', `npx.cmd vite build --config vite.active.config.js --configLoader runner --outDir ${buildDir}`],
    'Production build'
  );
} else {
  run('npx', ['vite', 'build', '--config', 'vite.active.config.js', '--configLoader', 'runner', '--outDir', buildDir], 'Production build');
}

const tests = fs.readdirSync(qaDir).filter(file => file.endsWith('.cjs')).sort();
for (const test of tests) run(process.execPath, [path.join(qaDir, test)], test);

console.log(`\nAll QA checks passed (${tests.length} smoke tests + build).`);
