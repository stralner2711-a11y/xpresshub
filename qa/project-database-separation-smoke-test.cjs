const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const fullBootstrap = fs.readFileSync('supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql', 'utf8');
const appConfig = fs.readFileSync('public/app-config.js', 'utf8');
const cleanupMigration = fs.readFileSync(
  'supabase/migrations/20260814124449_remove_reintroduced_trucklex_from_xpressintra_20260814.sql',
  'utf8',
);

assert(!/trucklex_/i.test(schema), 'XpressIntra schema.sql must not contain TruckLex database objects');
assert(!/trucklex_/i.test(fullBootstrap), 'XpressIntra full bootstrap must not contain TruckLex database objects');
assert(appConfig.includes('mtfbdoajzmlgqbeiubxe'), 'XpressIntra must keep its own Supabase project reference');
assert(!appConfig.includes('pfhgchcqddequxhhgrla'), 'XpressIntra must not point to the Truckpedia Supabase project');
assert(cleanupMigration.includes('drop schema if exists trucklex_private cascade;'), 'Cleanup migration must remove the private TruckLex role schema');
assert((cleanupMigration.match(/drop table if exists public\.trucklex_/g) || []).length === 13, 'Cleanup migration must remove all 13 migrated TruckLex tables');

console.log('Project database separation smoke test passed');
