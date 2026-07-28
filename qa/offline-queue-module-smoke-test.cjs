const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const moduleUrl = `${pathToFileURL(path.resolve(__dirname, '..', 'offline-queue.js')).href}?qa=${Date.now()}`;
  const queue = await import(moduleUrl);
  const start = Date.parse('2026-07-28T08:00:00.000Z');

  const first = queue.enqueue([], {
    type: 'Chatbesked',
    body: 'Hej fra køen',
    source: 'Beskeder',
    action: 'send-chat-message',
    payload: { conversationId: 'conversation-a', body: 'Hej fra køen' },
    userId: 'driver-a',
    idempotencyKey: 'chat:conversation-a:local-1',
  }, start);

  assert.strictEqual(first.queue.length, 1, 'A new offline change should be queued');
  assert.strictEqual(first.item.status, 'pending', 'New changes should wait for a connection');
  assert.strictEqual(queue.dueItems(first.queue, start).length, 1, 'A new change should be ready for its first attempt');

  const duplicate = queue.enqueue(first.queue, {
    type: 'Chatbesked',
    body: 'Samme besked',
    idempotencyKey: 'chat:conversation-a:local-1',
  }, start + 100);
  assert.strictEqual(duplicate.duplicate, true, 'The same idempotency key must not create duplicate messages');
  assert.strictEqual(duplicate.queue.length, 1, 'Duplicate messages must not grow the queue');

  let retried = queue.markRetry(first.queue, first.item.id, new Error('Failed to fetch'), start);
  assert.strictEqual(retried[0].status, 'retrying', 'Temporary network errors should schedule a retry');
  assert.strictEqual(retried[0].attempts, 1, 'Retry attempts should be counted');
  assert(queue.dueItems(retried, start).length === 0, 'Retry backoff should prevent immediate repeated requests');
  assert(queue.dueItems(retried, start + queue.retryDelayMs(1)).length === 1, 'The item should become due after its backoff');

  for (let attempt = 1; attempt < 5; attempt += 1) {
    retried = queue.markRetry(retried, first.item.id, new Error('Network timeout'), start + attempt * 10 * 60 * 1000);
  }
  assert.strictEqual(retried[0].status, 'failed', 'Repeated failures should stop automatic retries');
  const reset = queue.resetFailed(retried, start + 60 * 60 * 1000);
  assert.strictEqual(reset[0].status, 'pending', 'A manual retry should reset an exhausted item');

  const synced = queue.markSynced(reset, first.item.id, start + 60 * 60 * 1000);
  assert.strictEqual(queue.queueSummary(synced, start + 60 * 60 * 1000).synced, 1, 'Successful items should be marked as sent');
  assert.strictEqual(queue.normalizeQueue(synced, start + 76 * 60 * 1000).length, 0, 'Sent items should be removed after the short confirmation window');

  const expired = queue.normalizeQueue(first.queue, start + 73 * 60 * 60 * 1000);
  assert.strictEqual(expired.length, 0, 'Old unsent data should expire instead of staying forever');
  assert(queue.isRetryableError(new Error('Failed to fetch')), 'Network failures should be retryable');
  assert(!queue.isRetryableError(new Error('Permission denied')), 'Permission errors should not be mistaken for poor coverage');

  console.log('Offline queue module smoke test passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
