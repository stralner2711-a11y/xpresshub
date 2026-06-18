const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const moduleCode = fs.readFileSync('src/modules/workday-logbook.js', 'utf8');

assert(app.includes('XpressIntraWorkdayLogbook.workdayEndTime'), 'App should delegate Danish workday end time to the workday/logbook module when loaded');
assert(app.includes('XpressIntraWorkdayLogbook.workdayPermissions'), 'App should delegate workday permissions to the module when loaded');
assert(app.includes('XpressIntraWorkdayLogbook.logbookSuggestions'), 'App should delegate smart logbook suggestions to the module when loaded');
assert(app.includes('XpressIntraWorkdayLogbook.draftId'), 'App should delegate stable draft ids to the module when loaded');

assert(moduleCode.includes('export function workdayEndTime'), 'Module should export workday end time helper');
assert(moduleCode.includes('export function workdayPermissions'), 'Module should export workday permission helper');
assert(moduleCode.includes('export function logbookSuggestions'), 'Module should export logbook suggestions');
assert(moduleCode.includes('export function draftId'), 'Module should export stable draft id helper');
assert(moduleCode.includes('globalThis.XpressIntraWorkdayLogbook'), 'Module should expose a browser global for the app wrapper');

console.log('Workday/logbook module smoke test passed');
