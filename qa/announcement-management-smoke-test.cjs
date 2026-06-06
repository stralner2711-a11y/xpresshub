const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('src/app.js', 'utf8');
const storage = new Map([['roadlog:session', JSON.stringify({ email: 'driver@example.com', mode: 'demo', userId: 'driver-1' })]]);
const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
const toast = { textContent: '', classList: { add() {}, remove() {} } };
const modalNodes = [];

function makeNode() {
  return {
    className: '',
    innerHTML: '',
    dataset: {},
    removed: false,
    classList: { add() {}, remove() {}, contains() { return false; } },
    append() {},
    remove() { this.removed = true; },
    addEventListener() {},
    querySelector() { return null; },
    closest() { return null; },
  };
}

const document = {
  createElement() { return makeNode(); },
  head: { append() {} },
  body: {
    append(node) { modalNodes.push(node); },
    insertAdjacentHTML() {},
  },
  querySelector(selector) {
    if (selector === '#app') return appElement;
    if (selector === '.toast') return toast;
    return null;
  },
  querySelectorAll() { return []; },
  addEventListener() {},
};

const context = {
  console,
  document,
  window: {
    document,
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, String(value)); },
      removeItem(key) { storage.delete(key); },
    },
    addEventListener() {},
    scrollTo() {},
    confirm() { return true; },
    matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
  },
  navigator: { geolocation: null, serviceWorker: { register() { return Promise.resolve(); } } },
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
  },
  setTimeout() { return 1; },
  clearTimeout() {},
  setInterval() { return 2; },
  clearInterval() {},
  FormData: class {},
  FileReader: class {},
};

vm.createContext(context);
vm.runInContext(code, context, { filename: 'app.js' });

function run(script) {
  return vm.runInContext(script, context);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

run(`
session = { email: 'driver@example.com', mode: 'demo', userId: 'driver-1' };
profile = { ...profile, name: 'Almindelig Chauffør', email: 'driver@example.com', accessRole: 'employee', role: 'Chauffør', vehicleType: 'truck' };
`);

const otherPost = run(`renderFeedPost({ id: 'post-other', authorId: 'office-1', author: 'Kontoret', initials: 'XB', title: 'Drift', body: 'Test', time: 'Nu', audience: 'Alle medarbejdere', kind: 'office', likes: 0, comments: [] })`);
assert(!otherPost.includes('edit-announcement'), 'Employee should not see edit action for posts they did not create');
assert(!otherPost.includes('delete-announcement'), 'Employee should not see delete action for posts they did not create');

const ownPost = run(`renderFeedPost({ id: 'post-own', authorId: 'driver-1', author: 'Almindelig Chauffør', initials: 'AC', title: 'Eget opslag', body: 'Test', time: 'Nu', audience: 'Alle medarbejdere', kind: 'colleague', likes: 0, comments: [] })`);
assert(ownPost.includes('edit-announcement'), 'Post author should see edit action on own post');
assert(ownPost.includes('delete-announcement'), 'Post author should see delete action on own post');

run(`profile = { ...profile, name: 'Chef Test', email: 'chef@example.com', accessRole: 'admin', role: 'Chef', vehicleType: 'dispatch' };`);
const adminPost = run(`renderFeedPost({ id: 'post-admin', authorId: 'office-1', author: 'Kontoret', initials: 'XB', title: 'Drift', body: 'Test', time: 'Nu', audience: 'Alle medarbejdere', kind: 'office', likes: 0, comments: [] })`);
assert(adminPost.includes('edit-announcement'), 'Admin should see edit action for office posts');
assert(adminPost.includes('delete-announcement'), 'Admin should see delete action for office posts');

run(`announcements = [{ id: 'post-admin', authorId: 'office-1', author: 'Kontoret', initials: 'XB', title: 'Drift', body: 'Test', time: 'Nu', audience: 'Alle medarbejdere', kind: 'office', likes: 0, comments: [] }]; openAnnouncementModal('post-admin');`);
assert(modalNodes.at(-1).innerHTML.includes('Rediger opslag'), 'Edit modal should open with edit title');
assert(modalNodes.at(-1).innerHTML.includes('Gem ændringer'), 'Edit modal should save changes instead of sharing a new post');

run(`activeTab = 'home'; render();`);
assert(appElement.innerHTML.includes('home-office-highlight'), 'Home should render office post as a manageable highlight');
assert(appElement.innerHTML.includes('edit-announcement'), 'Admin should be able to edit office posts directly from the home office card');
assert(appElement.innerHTML.includes('delete-announcement'), 'Admin should be able to delete office posts directly from the home office card');

const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const fullSetup = fs.readFileSync('supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql', 'utf8');
assert(schema.includes('authors and admins can update announcements'), 'Schema should allow only authors/admins to update announcements');
assert(schema.includes('authors and admins can delete announcements'), 'Schema should allow only authors/admins to delete announcements');
assert(fullSetup.includes('authors and admins can update announcements'), 'Full SQL should include update announcement policy');
assert(fullSetup.includes('authors and admins can delete announcements'), 'Full SQL should include delete announcement policy');

console.log('Announcement management smoke test passed');
