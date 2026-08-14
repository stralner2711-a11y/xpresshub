export const EMERGENCY_RECOVERY_VERSION = 2;
export const EMERGENCY_RECOVERY_ITERATIONS = 210_000;
export const EMERGENCY_RECOVERY_VALID_DAYS = 90;

function subtleCrypto() {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Sikker kryptering understøttes ikke på denne enhed');
  return subtle;
}

function bytesToBase64(bytes) {
  if (typeof btoa === 'function') {
    return btoa(String.fromCharCode(...bytes));
  }
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  throw new Error('Base64-kodning understøttes ikke');
}

function base64ToBytes(value) {
  if (typeof atob === 'function') {
    return Uint8Array.from(atob(String(value || '')), character => character.charCodeAt(0));
  }
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(String(value || ''), 'base64'));
  throw new Error('Base64-afkodning understøttes ikke');
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

async function deriveVerifier(code, salt, iterations = EMERGENCY_RECOVERY_ITERATIONS) {
  const subtle = subtleCrypto();
  const keyMaterial = await subtle.importKey(
    'raw',
    new TextEncoder().encode(String(code || '')),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: base64ToBytes(salt),
    iterations,
  }, keyMaterial, 256);
  return bytesToBase64(new Uint8Array(bits));
}

async function fingerprintOwner(ownerId, salt) {
  const bytes = new TextEncoder().encode(`${String(ownerId || '')}|${salt}`);
  const digest = await subtleCrypto().digest('SHA-256', bytes);
  return bytesToBase64(new Uint8Array(digest));
}

async function fingerprintOwnerEmail(ownerEmail, salt) {
  return fingerprintOwner(String(ownerEmail || '').trim().toLowerCase(), salt);
}

function constantTimeEqual(left, right) {
  const a = base64ToBytes(left);
  const b = base64ToBytes(right);
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    mismatch |= (a[index] || 0) ^ (b[index] || 0);
  }
  return mismatch === 0;
}

export function emergencyRecoveryCodeError(code) {
  const value = String(code || '');
  if (value.length < 12) return 'Nødkoden skal være mindst 12 tegn';
  if (!/[a-z]/.test(value)) return 'Nødkoden skal have mindst ét lille bogstav';
  if (!/[A-Z]/.test(value)) return 'Nødkoden skal have mindst ét stort bogstav';
  if (!/[0-9]/.test(value)) return 'Nødkoden skal have mindst ét tal';
  return '';
}

export function emergencyRecoveryStatus(config, now = Date.now()) {
  if (!config?.enabled || config.version !== EMERGENCY_RECOVERY_VERSION || !config.salt || !config.verifier || !config.authorizedEmail) {
    return { ready: false, reason: 'not_configured', label: 'Ikke klargjort' };
  }
  const expiresAt = Date.parse(config.expiresAt || 0);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return { ready: false, reason: 'expired', label: 'Udløbet' };
  }
  return {
    ready: true,
    reason: 'ready',
    label: 'Klar',
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

export async function createEmergencyRecoveryConfig(code, ownerId, options = {}) {
  const validationError = emergencyRecoveryCodeError(code);
  if (validationError) throw new Error(validationError);
  if (!ownerId) throw new Error('Creator-sessionen mangler');
  const ownerEmail = String(options.ownerEmail || '').trim().toLowerCase();
  if (!ownerEmail) throw new Error('Creator-mailen mangler');
  const now = Number(options.now || Date.now());
  const validDays = Math.min(90, Math.max(1, Number(options.validDays || EMERGENCY_RECOVERY_VALID_DAYS)));
  const salt = randomSalt();
  return {
    version: EMERGENCY_RECOVERY_VERSION,
    enabled: true,
    salt,
    verifier: await deriveVerifier(code, salt),
    iterations: EMERGENCY_RECOVERY_ITERATIONS,
    authorizedBy: await fingerprintOwner(ownerId, salt),
    authorizedEmail: await fingerprintOwnerEmail(ownerEmail, salt),
    authorizedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + validDays * 24 * 60 * 60 * 1000).toISOString(),
    lastUsedAt: null,
    pendingAuditAt: null,
  };
}

export async function verifyEmergencyRecoveryOwnerEmail(ownerEmail, config, now = Date.now()) {
  if (!emergencyRecoveryStatus(config, now).ready) return false;
  const fingerprint = await fingerprintOwnerEmail(ownerEmail, config.salt);
  return constantTimeEqual(fingerprint, config.authorizedEmail);
}

export async function verifyEmergencyRecoveryCode(code, config, now = Date.now()) {
  if (!emergencyRecoveryStatus(config, now).ready) return false;
  const verifier = await deriveVerifier(code, config.salt, Number(config.iterations || EMERGENCY_RECOVERY_ITERATIONS));
  return constantTimeEqual(verifier, config.verifier);
}

globalThis.XpressIntraEmergencyRecovery = {
  emergencyRecoveryCodeError,
  emergencyRecoveryStatus,
  createEmergencyRecoveryConfig,
  verifyEmergencyRecoveryOwnerEmail,
  verifyEmergencyRecoveryCode,
};
