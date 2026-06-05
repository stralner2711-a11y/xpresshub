const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const moduleCode = fs.readFileSync('src/modules/info-center.js', 'utf8');

assert(app.includes('XpressIntraInfoCenter?.buildInfoLinks'), 'App should delegate info link building to the Information module when loaded');
assert(app.includes('XpressIntraInfoCenter?.contactDirectoryEntries'), 'App should delegate contact directory building to the Information module when loaded');
assert(app.includes('XpressIntraInfoCenter?.filterInfoLinks'), 'App should delegate Information filtering to the module when loaded');
assert(app.includes('XpressIntraInfoCenter?.cleanPhone'), 'App should delegate phone cleanup to the module when loaded');

assert(moduleCode.includes('export function buildInfoLinks'), 'Information module should export link building');
assert(moduleCode.includes('export function contactDirectoryEntries'), 'Information module should export contact directory builder');
assert(moduleCode.includes('export function filterInfoLinks'), 'Information module should export filtering');
assert(moduleCode.includes('export function cleanPhone'), 'Information module should export phone cleanup');
assert(moduleCode.includes('globalThis.XpressIntraInfoCenter'), 'Information module should expose a browser global for the app wrapper');

console.log('Information module smoke test passed');
