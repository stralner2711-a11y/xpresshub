const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const chatModule = fs.readFileSync('src/modules/chat.js', 'utf8');

assert(app.includes('XpressIntraChat.hasChannelAccess'), 'App should delegate channel access checks to the chat module when loaded');
assert(app.includes('XpressIntraChat.chatFromConversationRow'), 'App should delegate Supabase conversation mapping to the chat module when loaded');
assert(app.includes('XpressIntraChat.messageFromSupabaseRow'), 'App should delegate Supabase message mapping to the chat module when loaded');
assert(app.includes("const emojiChoices = ['\\u{1F44D}', '\\u{1F44C}', '\\u{1F60A}'"), 'Chat emoji choices should use stable unicode escapes instead of broken placeholder text');
assert(app.includes('<div class="emoji-row">'), 'Conversation should render the emoji row');
assert(app.includes('<button type="submit" aria-label="Send besked">'), 'Chat send button should remain the submit button after emoji controls');
assert(app.includes('data-action="start-new-chat"'), 'New direct chat modal should use an explicit mobile-safe start action');
assert(app.includes('<button class="save-btn" type="submit" data-action="start-new-chat">Start samtale</button>'), 'New direct chat start button should submit the form reliably on Android WebView');
assert(app.includes('async function submitNewChatForm(form)'), 'New direct chat flow should share one robust submit handler');
assert(app.includes("form.dataset.submitting === 'true'"), 'New direct chat flow should prevent duplicate submissions');
assert(app.includes('event.preventDefault();\n    await submitNewChatForm'), 'New direct chat click path should prevent native double-submit');
assert(app.includes("if (action === 'start-new-chat')"), 'New direct chat start button should be handled from tap/click events');
assert(!app.includes("form?.addEventListener('submit', async event => {\n    event.preventDefault();\n    await submitNewChatForm(form);"), 'New direct chat modal should not also attach a local submit handler that can double-send');

assert(chatModule.includes('export function hasChannelAccess'), 'Chat module should export channel access logic');
assert(chatModule.includes('export function chatFromConversationRow'), 'Chat module should export conversation mapping');
assert(chatModule.includes('export function messageFromSupabaseRow'), 'Chat module should export message mapping');
assert(chatModule.includes('globalThis.XpressIntraChat'), 'Chat module should expose a browser global for the app wrapper');

console.log('Chat module smoke test passed');
