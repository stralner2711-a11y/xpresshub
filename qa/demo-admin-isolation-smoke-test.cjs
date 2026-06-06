const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');

assert(app.includes('const DEMO_MODE = Boolean(window.XPRESSINTRA_DEMO_MODE)'), 'Demo mode should be explicit and opt-in');
assert(app.includes('DEMO_MODE ? `<button class="save-btn" type="button" data-action="demo-admin"'), 'Demo admin button should be gated by demo mode');
assert(app.includes('if (!DEMO_MODE)'), 'Demo admin elevation should refuse outside demo mode');
assert(app.includes('Lokal test-admin er slået fra'), 'Demo admin refusal should explain itself');

console.log('Demo admin isolation smoke test passed');


