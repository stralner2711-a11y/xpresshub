const fs = require('fs');

const source = fs.readFileSync('src/app.js', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const renderedActions = [...source.matchAll(/data-action="([^"$`{}]+)"/g)].map(match => match[1]);
const handledActions = [...source.matchAll(/action === '([^']+)'/g)].map(match => match[1]);
const handled = new Set(handledActions);
const allowedFormSubmitActions = new Set(['signup-invite']);

const missing = [...new Set(renderedActions)]
  .filter(action => !handled.has(action) && !allowedFormSubmitActions.has(action));

assert(!missing.length, `Unhandled data-action values: ${missing.join(', ')}`);
assert(source.includes("data-action=\"open-task-overview\""), 'Task overview should have a dedicated action');
assert(source.includes("if (action === 'open-task-overview') openTaskOverviewModal();"), 'Task overview action should open the task modal');
assert(!source.includes('<button data-action="open-notifications">Se alt</button>'), 'Task "Se alt" should not route directly to notifications');
assert(source.includes("modalReplacingActions"), 'Modal-to-modal navigation should replace the current modal');
assert(source.includes("canPublishOfficePosts() ? '<button data-action=\"new-announcement\">Nyt opslag</button>' : ''"), 'Office post button should only show for office/dispatch roles');

console.log('Navigation action smoke test passed');
