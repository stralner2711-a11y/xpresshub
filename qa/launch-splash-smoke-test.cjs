const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');

assert(app.includes('function renderLaunchSplash()'), 'Launch splash renderer should exist');
assert(app.includes('xpressbudet-logo-transparent.png?v=50'), 'Launch splash should show XpressBudet logo');
assert(app.includes('launch-fleet'), 'Launch splash should include the vehicle fleet');
assert(app.includes('launch-truck'), 'Launch splash should include a truck');
assert(app.includes('launch-lift'), 'Launch splash should include a lift/box vehicle');
assert(app.includes('launch-van'), 'Launch splash should include a van');
assert(app.includes('}, 5000);'), 'Launch splash should stay visible for 5 seconds');
assert(app.includes('XpressBudet præsenterer'), 'Launch splash should keep Danish æ correctly');
assert(app.includes('Indlæser ruter, køretøjer og dagens drift'), 'Launch splash should keep Danish æ/ø correctly');
assert(app.includes('<span>Chauffører</span>'), 'Launch splash should keep Danish ø correctly');
assert(!app.match(/pr(&aelig;|\u00C3|\u00C2).*senterer|Indl(&aelig;|\u00C3|\u00C2)/), 'Launch splash should not contain mojibake or HTML entities for Danish text');

assert(css.includes('.launch-vehicle'), 'Launch vehicle styling should exist');
assert(css.includes('@keyframes launchDriveOut'), 'Vehicle drive-out animation should exist');
assert(css.includes('animation: launchDriveOut 5s'), 'Drive-out animation should run for 5 seconds');

console.log('Launch splash smoke test passed');


