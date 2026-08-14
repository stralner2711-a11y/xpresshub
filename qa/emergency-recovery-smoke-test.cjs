const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

(async () => {
  const recovery = await import(`${pathToFileURL(path.join(root, 'src/modules/emergency-recovery.js')).href}?qa=${Date.now()}`);
  const code = 'SikkerNodkode2026';
  const now = Date.UTC(2026, 7, 14, 12, 0, 0);
  const ownerEmail = 'creator@example.com';
  const config = await recovery.createEmergencyRecoveryConfig(code, '00000000-0000-4000-8000-000000000001', { now, ownerEmail });

  assert.equal(recovery.emergencyRecoveryCodeError('for-kort'), 'Nødkoden skal være mindst 12 tegn');
  assert.equal(recovery.emergencyRecoveryStatus(config, now).ready, true);
  assert.equal(await recovery.verifyEmergencyRecoveryCode(code, config, now), true);
  assert.equal(await recovery.verifyEmergencyRecoveryCode('ForkertKode2026', config, now), false);
  assert.equal(await recovery.verifyEmergencyRecoveryOwnerEmail(ownerEmail, config, now), true);
  assert.equal(await recovery.verifyEmergencyRecoveryOwnerEmail('employee@example.com', config, now), false);
  assert.equal(recovery.emergencyRecoveryStatus(config, Date.parse(config.expiresAt) + 1).reason, 'expired');
  assert.equal(Object.hasOwn(config, 'code'), false, 'Nødkoden må ikke gemmes');
  assert.equal(Object.hasOwn(config, 'ownerId'), false, 'Creator-id må ikke gemmes direkte');
  assert.equal(Object.hasOwn(config, 'ownerEmail'), false, 'Creator-mail må ikke gemmes direkte');

  assert.match(indexSource, /src\/modules\/emergency-recovery\.js/);
  assert.match(appSource, /EMERGENCY_RECOVERY_KEY/);
  assert.match(appSource, /PERSISTENT_DEVICE_STORAGE_KEYS[\s\S]*EMERGENCY_RECOVERY_KEY/);
  assert.match(appSource, /isCreatorOwner\(\) \|\| session\?\.mode !== 'supabase'/);
  assert.match(appSource, /emergencyRecoveryActive[\s\S]*renderEmergencyRecovery\(\)/);
  assert.match(appSource, /Ingen lokal creator-adgang/);
  assert.match(appSource, /Du kan ikke læse chat, se GPS, ændre medarbejdere eller skrive til databasen herfra/);
  assert.match(appSource, /EMERGENCY_RECOVERY_MAX_FAILED = 5/);
  assert.match(appSource, /EMERGENCY_RECOVERY_LOCK_MINUTES = 15/);
  assert.match(appSource, /name="ownerEmail"/);
  assert.match(appSource, /verifyEmergencyRecoveryOwnerEmail/);
  assert.match(appSource, /Creator-mail eller nødkode er forkert/);

  const renderStart = appSource.indexOf('function renderEmergencyRecovery()');
  const renderEnd = appSource.indexOf('\nfunction flushEmergencyRecoveryAudit()', renderStart);
  const emergencyView = appSource.slice(renderStart, renderEnd);
  assert.doesNotMatch(emergencyView, /openAdminModal|loadSupabaseData|syncSupabaseCoreSettings|approveAccessRequest/);

  const unlockStart = appSource.indexOf("if (event.target.matches('.emergency-recovery-unlock-form'))");
  const unlockEnd = appSource.indexOf("if (event.target.matches('.standard-signup-password-form'))", unlockStart);
  const unlockHandler = appSource.slice(unlockStart, unlockEnd);
  assert.doesNotMatch(unlockHandler, /session\s*=/, 'Nødberedskab må ikke oprette en rigtig app-session');
  assert.doesNotMatch(unlockHandler, /accessRole\s*=/, 'Nødberedskab må ikke give en rolle');

  console.log('Emergency recovery smoke test passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
