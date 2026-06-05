const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const qaDir = path.join(root, 'qa');

function run(command, args, label, options = {}) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: Boolean(options.shell),
  });

  if (result.status !== 0) {
    console.error(`\nFAILED: ${label}`);
    process.exit(result.status || 1);
  }
}

if (process.platform === 'win32') {
  run('cmd.exe', ['/d', '/s', '/c', 'npm.cmd run build'], 'Production build');
} else {
  run('npm', ['run', 'build'], 'Production build');
}

const tests = fs
  .readdirSync(qaDir)
  .filter(file => file.endsWith('.cjs'))
  .sort();

for (const test of tests) {
  run(process.execPath, [path.join(qaDir, test)], test);
}

console.log(`\nAll QA checks passed (${tests.length} smoke tests + build).`);
