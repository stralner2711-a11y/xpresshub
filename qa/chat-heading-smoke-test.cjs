const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
assert(app.includes('function conversationHeading(chat)'), 'Chat heading helper should exist');
assert(app.includes("return { title: 'Fælleschat', subtitle: 'Alle medarbejdere' }"), 'Community chat should have a clean title and subtitle');
assert(app.includes("return { title: 'Lastbilchat', subtitle: 'Kun lastbilholdet' }"), 'Truck channel should have a clean title and subtitle');
assert(app.includes("return { title: 'Varebilchat', subtitle: 'Kun varebilholdet' }"), 'Van channel should have a clean title and subtitle');
assert(app.includes('<b>${text(heading.title)}</b><small>${text(heading.subtitle)}</small>'), 'Conversation header should render the cleaned heading');

console.log('Chat heading smoke test passed');
