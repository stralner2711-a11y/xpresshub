const assert = require('assert');
const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');
const releaseScript = fs.readFileSync('opdater-alt.ps1', 'utf8');

assert(index.includes('src="./offline-queue.js"'), 'The offline engine must load before the app');
assert(index.includes('src="./app.js"'), 'The active writable app source must be loaded');
assert(!index.includes('src="./src/app.js"'), 'The locked legacy app source must not run');
assert(app.includes("item.action === 'send-chat-message'"), 'Queued chat messages must have an automatic sender');
assert(app.includes("item.action === 'save-pickup-note'"), 'Queued pickup notes must have an automatic sender');
assert(app.includes('syncOfflineQueue({ force = false, notify = false }'), 'The app must expose controlled queue synchronization');
assert(app.includes("window.addEventListener('online', () => syncOfflineQueue())"), 'The queue must retry when coverage returns');
assert(app.includes("deliveryStatus: 'pending'"), 'Offline chat messages must show a pending delivery state');
assert(app.includes('Ingen stabil forbindelse. Beskeden sendes automatisk senere.'), 'Drivers must receive a clear offline chat message');
assert(app.includes('Ingen stabil forbindelse. Noten sendes automatisk senere.'), 'Drivers must receive a clear offline note message');
assert(styles.includes('.message-delivery.pending'), 'Pending messages must be visually distinguishable');
assert(releaseScript.includes("'app.js'"), 'The release package must include the active app source');
assert(releaseScript.includes("'offline-queue.js'"), 'The release package must include the offline engine');
assert(releaseScript.includes('Fjernet laast legacy-kopi: src/app.js'), 'The release package must exclude the legacy app copy');

console.log('Offline queue integration smoke test passed');
