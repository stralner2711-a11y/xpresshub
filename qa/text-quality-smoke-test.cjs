const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const scanRoots = ['src', 'public', 'docs', 'supabase', 'tools', 'qa'];
const textExtensions = new Set([
  '.js', '.cjs', '.css', '.html', '.json', '.md', '.txt', '.sql', '.ps1', '.cmd', '.toml',
]);
const ignoredDirs = new Set([
  'node_modules', 'dist', 'android', 'ios', 'arkiv', '.git', '.idea', '.codex', '.npm-cache',
]);
const badPatterns = [
  { label: 'replacement character', pattern: /\uFFFD/ },
  { label: 'common mojibake marker', pattern: /\u00C3[\u0080-\u00BF]/ },
  { label: 'visible mojibake marker', pattern: /[\u00C3\u00C2\u00E2]/ },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
  return files;
}

const files = scanRoots
  .map(name => path.join(root, name))
  .filter(fs.existsSync)
  .flatMap(dir => walk(dir));

const findings = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const { label, pattern } of badPatterns) {
    lines.forEach((line, index) => {
      if (pattern.test(line)) findings.push(`${path.relative(root, file)}:${index + 1} ${label}`);
    });
  }
}

assert.deepStrictEqual(findings, [], `Text quality problems found:\n${findings.join('\n')}`);

console.log(`Text quality smoke test passed (${files.length} files scanned)`);
