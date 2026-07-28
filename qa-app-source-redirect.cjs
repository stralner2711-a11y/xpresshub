const fs = require('fs');
const path = require('path');

const originalReadFileSync = fs.readFileSync.bind(fs);
const projectRoot = __dirname;
const legacyAppPath = path.normalize(path.join(projectRoot, 'src', 'app.js')).toLowerCase();
const activeAppPath = path.join(projectRoot, 'app.js');

fs.readFileSync = function readActiveApp(file, ...args) {
  const resolved = path.normalize(path.resolve(projectRoot, String(file))).toLowerCase();
  if (resolved === legacyAppPath) return originalReadFileSync(activeAppPath, ...args);
  return originalReadFileSync(file, ...args);
};
