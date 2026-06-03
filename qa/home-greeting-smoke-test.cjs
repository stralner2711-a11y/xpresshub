const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');

assert(app.includes('function profileGreetingName()'), 'Home greeting should use a dedicated profile greeting helper');
assert(app.includes("!raw.includes('@')"), 'Greeting helper should reject email addresses as display names');
assert(app.includes('Godmorgen, ${text(profileGreetingName())}'), 'Home hero should greet using the full profile display name');
assert(!app.includes("Godmorgen, ${text(profile.name.split(' ')[0])}"), 'Home hero should not use first-name-only split logic');
assert(app.includes("name: row?.full_name || profile.name || ''"), 'Supabase profile fallback should not turn email into display name');

console.log('Home greeting smoke test passed');


