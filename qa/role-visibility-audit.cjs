const fs = require('node:fs');
const vm = require('node:vm');
const harness = fs.readFileSync('qa/employee-action-guard-smoke-test.cjs', 'utf8')
  .split("assert(typeof listeners.click")[0].replace("'src/app.js'", "'app.js'");
const checks = `
const pages = [];
const diagnosticSource = fs.readFileSync('diagnostics.js', 'utf8');
const diagnosticView = diagnosticSource.slice(diagnosticSource.indexOf('function diagnosticModalHtml()'), diagnosticSource.indexOf('async function openDiagnosticModal()'));
for (const creator of [false, true]) {
  const view = vm.createContext({ XpressIntraCanViewTechnicalDetails: () => creator });
  vm.runInContext(diagnosticView, view);
  const html = vm.runInContext('diagnosticModalHtml()', view);
  assert(html.includes('data-xpress-copy-report') === creator, 'Only creator should see report copy');
  assert(!html.includes('publishable') && !html.includes('Supabase'), 'Public diagnostic heading should be plain language');
}
for (const role of ['employee', 'dispatcher', 'admin', 'owner']) {
  vm.runInContext("session = { mode: 'supabase', userId: 'qa-only' }; profile = { ...profile, name: 'Testperson', email: 'qa@example.invalid', accessRole: '" + role + "', employmentStatus: 'active', role: 'Chauffør', vehicleType: 'truck' }; appUpdateState.latest = { activeVersion: APP_DISPLAY_VERSION, activeVersionCode: APP_VERSION_CODE }; appUpdateState.lastError = 'INTERNAL_DIAGNOSTIC_SENTINEL';", context);
  const more = vm.runInContext('renderMore()', context);
  const updates = vm.runInContext('renderUpdateSummary()', context);
  const admin = ['admin', 'owner'].includes(role);
  assert(more.includes('data-action="open-admin"') === admin, role + ': admin menu visibility');
  assert(more.includes('data-action="open-launch-checklist"') === admin, role + ': launch checklist visibility');
  assert(updates.includes('data-action="show-update-status"') === (role === 'owner'), role + ': technical update button');
  assert(updates.includes('INTERNAL_DIAGNOSTIC_SENTINEL') === (role === 'owner'), role + ': internal errors');
  assert(updates.includes('data-action="open-rollback-center"') === (role === 'owner'), role + ': rollback controls');
  modalNodes.length = 0;
  vm.runInContext('openUpdateStatusModal()', context);
  assert(modalNodes.length === (role === 'owner' ? 1 : 0), role + ': direct technical modal guard');
  pages.push('<h1>' + role + ' - isolated role preview</h1><main>' + more + updates + '</main>');
}
if (process.env.XPRESS_ROLE_PREVIEW === '1') {
  const path = require('node:path');
  const url = require('node:url');
  const file = path.join(require('node:os').tmpdir(), 'xpressintra-role-audit.html');
  const css = url.pathToFileURL(path.resolve('src/styles.css')).href;
  fs.writeFileSync(file, '<!doctype html><html lang="da"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="' + css + '"><style>body{padding:24px}main{max-width:440px;margin:auto}h1{font-size:20px;text-align:center;margin:40px}svg{width:24px;height:24px}</style>' + pages.join('<hr>') + '</html>');
  console.log(file);
}
console.log('Role visibility audit passed: employee, dispatcher, admin and owner. Local rendering only; no authentication claims changed.');
`;
vm.runInNewContext(harness + checks, { require, console, process });
