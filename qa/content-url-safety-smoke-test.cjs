const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');

assert(app.includes('function safeHref(value, options = {})'), 'Dynamic links should use an allowlisted URL helper');
assert(app.includes("allowedProtocols || ['https:', 'http:', 'tel:', 'mailto:']"), 'Only expected link protocols should be allowed');
assert(app.includes('function safeMediaSrc(value)'), 'Dynamic image sources should use a dedicated media URL helper');
assert(app.includes("/^data:image\\/(?:jpeg|png|webp|gif);base64,/i"), 'Only supported image data URLs should be accepted');
assert(!app.includes('href="${text(update.href)}"'), 'Regulatory links must not be inserted without URL validation');
assert(!app.includes('src="${text(message.image.src)}"'), 'Chat image sources must not be inserted without media validation');
assert(app.includes(".filter(key => !key.startsWith('roadlog:restSupabaseSession:'))"), 'Fallback Supabase sessions should survive production storage cleanup');

console.log('Content URL safety smoke test passed');
