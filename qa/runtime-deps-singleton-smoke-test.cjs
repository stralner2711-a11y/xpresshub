const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src', 'lib', 'runtime-deps.js'), 'utf8');

assert(
  source.includes('const clients = new Map()'),
  'Supabase clients must be cached to avoid multiple auth clients'
);
assert(
  source.includes('clients.get(cacheKey)'),
  'The runtime dependency loader must reuse an existing Supabase client'
);
assert(
  source.includes('clients.set(cacheKey, createClient(url, key, options))'),
  'New Supabase clients must be stored in the shared cache'
);

console.log('Runtime dependency singleton smoke test passed');
