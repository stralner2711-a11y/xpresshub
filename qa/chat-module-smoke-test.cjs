const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const chatModule = fs.readFileSync('src/modules/chat.js', 'utf8');

assert(app.includes('XpressIntraChat?.hasChannelAccess'), 'App should delegate channel access checks to the chat module when loaded');
assert(app.includes('XpressIntraChat?.chatFromConversationRow'), 'App should delegate Supabase conversation mapping to the chat module when loaded');
assert(app.includes('XpressIntraChat?.messageFromSupabaseRow'), 'App should delegate Supabase message mapping to the chat module when loaded');

assert(chatModule.includes('export function hasChannelAccess'), 'Chat module should export channel access logic');
assert(chatModule.includes('export function chatFromConversationRow'), 'Chat module should export conversation mapping');
assert(chatModule.includes('export function messageFromSupabaseRow'), 'Chat module should export message mapping');
assert(chatModule.includes('globalThis.XpressIntraChat'), 'Chat module should expose a browser global for the app wrapper');

console.log('Chat module smoke test passed');
