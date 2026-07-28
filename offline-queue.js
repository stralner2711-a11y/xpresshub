const MAX_ITEMS = 40;
const MAX_ATTEMPTS = 5;
const RETENTION_MS = 72 * 60 * 60 * 1000;
const SYNCED_RETENTION_MS = 15 * 60 * 1000;
const BASE_RETRY_MS = 5 * 1000;
const MAX_RETRY_MS = 5 * 60 * 1000;

function timestamp(value, fallback = Date.now()) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cleanText(value, maxLength = 600) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return {};
  }
}

export function retryDelayMs(attempts = 0) {
  const exponent = Math.max(0, Number(attempts) - 1);
  return Math.min(MAX_RETRY_MS, BASE_RETRY_MS * (2 ** exponent));
}

export function normalizeQueue(queue = [], now = Date.now()) {
  if (!Array.isArray(queue)) return [];
  return queue
    .filter(item => item && typeof item === 'object')
    .map(item => {
      const createdAtMs = timestamp(item.createdAt, now);
      const status = ['pending', 'processing', 'retrying', 'failed', 'synced'].includes(item.status)
        ? item.status
        : 'pending';
      return {
        id: cleanText(item.id, 120) || `offline-${createdAtMs}`,
        type: cleanText(item.type, 80) || 'Lokal ændring',
        body: cleanText(item.body),
        source: cleanText(item.source, 80) || 'XpressIntra',
        action: cleanText(item.action, 80),
        payload: cleanPayload(item.payload),
        userId: cleanText(item.userId, 80),
        idempotencyKey: cleanText(item.idempotencyKey, 160),
        createdAt: new Date(createdAtMs).toISOString(),
        updatedAt: new Date(timestamp(item.updatedAt, createdAtMs)).toISOString(),
        nextRetryAt: new Date(timestamp(item.nextRetryAt, createdAtMs)).toISOString(),
        syncedAt: item.syncedAt ? new Date(timestamp(item.syncedAt, now)).toISOString() : null,
        status: status === 'processing' ? 'retrying' : status,
        attempts: Math.max(0, Number(item.attempts) || 0),
        lastError: cleanText(item.lastError, 240),
      };
    })
    .filter(item => {
      const age = now - timestamp(item.createdAt, now);
      if (item.status === 'synced') {
        return now - timestamp(item.syncedAt || item.updatedAt, now) <= SYNCED_RETENTION_MS;
      }
      return age <= RETENTION_MS;
    })
    .slice(0, MAX_ITEMS);
}

export function enqueue(queue = [], input = {}, now = Date.now()) {
  const normalized = normalizeQueue(queue, now);
  const idempotencyKey = cleanText(input.idempotencyKey, 160);
  const existing = idempotencyKey
    ? normalized.find(item => item.idempotencyKey === idempotencyKey && item.status !== 'synced')
    : null;
  if (existing) return { queue: normalized, item: existing, duplicate: true };

  const item = {
    id: cleanText(input.id, 120) || `offline-${now}-${Math.random().toString(36).slice(2, 8)}`,
    type: cleanText(input.type, 80) || 'Lokal ændring',
    body: cleanText(input.body),
    source: cleanText(input.source, 80) || 'XpressIntra',
    action: cleanText(input.action, 80),
    payload: cleanPayload(input.payload),
    userId: cleanText(input.userId, 80),
    idempotencyKey,
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    nextRetryAt: new Date(now).toISOString(),
    syncedAt: null,
    status: 'pending',
    attempts: 0,
    lastError: '',
  };
  return { queue: [item, ...normalized].slice(0, MAX_ITEMS), item, duplicate: false };
}

function updateItem(queue, id, change, now = Date.now()) {
  return normalizeQueue(queue, now).map(item => (
    item.id === id
      ? { ...item, ...change, updatedAt: new Date(now).toISOString() }
      : item
  ));
}

export function markProcessing(queue, id, now = Date.now()) {
  return updateItem(queue, id, { status: 'processing', lastError: '' }, now);
}

export function markSynced(queue, id, now = Date.now()) {
  return updateItem(queue, id, {
    status: 'synced',
    syncedAt: new Date(now).toISOString(),
    nextRetryAt: new Date(now).toISOString(),
    lastError: '',
  }, now);
}

export function markRetry(queue, id, error, now = Date.now()) {
  const current = normalizeQueue(queue, now).find(item => item.id === id);
  if (!current) return normalizeQueue(queue, now);
  const attempts = current.attempts + 1;
  const exhausted = attempts >= MAX_ATTEMPTS;
  return updateItem(queue, id, {
    status: exhausted ? 'failed' : 'retrying',
    attempts,
    lastError: cleanText(error?.message || error || 'Ukendt forbindelsesfejl', 240),
    nextRetryAt: new Date(now + retryDelayMs(attempts)).toISOString(),
  }, now);
}

export function resetFailed(queue, now = Date.now()) {
  return normalizeQueue(queue, now).map(item => (
    item.status === 'failed'
      ? {
          ...item,
          status: 'pending',
          attempts: 0,
          lastError: '',
          nextRetryAt: new Date(now).toISOString(),
          updatedAt: new Date(now).toISOString(),
        }
      : item
  ));
}

export function dueItems(queue, now = Date.now()) {
  return normalizeQueue(queue, now)
    .filter(item => ['pending', 'retrying'].includes(item.status))
    .filter(item => timestamp(item.nextRetryAt, 0) <= now)
    .sort((a, b) => timestamp(a.createdAt, now) - timestamp(b.createdAt, now));
}

export function queueSummary(queue, now = Date.now()) {
  const normalized = normalizeQueue(queue, now);
  return {
    pending: normalized.filter(item => ['pending', 'processing', 'retrying'].includes(item.status)).length,
    failed: normalized.filter(item => item.status === 'failed').length,
    synced: normalized.filter(item => item.status === 'synced').length,
    total: normalized.length,
  };
}

export function statusLabel(item = {}) {
  if (item.status === 'synced') return 'Sendt';
  if (item.status === 'processing') return 'Sender nu';
  if (item.status === 'retrying') return `Nyt forsøg ${Math.max(1, Number(item.attempts) + 1)}/${MAX_ATTEMPTS}`;
  if (item.status === 'failed') return 'Kræver nyt forsøg';
  return 'Venter på forbindelse';
}

export function isRetryableError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  return /network|fetch|offline|timeout|timed out|connection|forbindelse|load failed|failed to fetch|abort/.test(message);
}

globalThis.XpressIntraOfflineQueue = {
  enqueue,
  normalizeQueue,
  markProcessing,
  markSynced,
  markRetry,
  resetFailed,
  dueItems,
  queueSummary,
  statusLabel,
  isRetryableError,
  retryDelayMs,
};
