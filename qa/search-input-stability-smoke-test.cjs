const fs = require('fs');
const vm = require('vm');

function createHarness() {
  const code = fs.readFileSync('src/app.js', 'utf8');
  const storage = new Map([['roadlog:session', JSON.stringify({ email: 'demo@xpressintra.local', mode: 'demo' })]]);
  const listeners = {};
  const appElement = { innerHTML: '', classList: { add() {}, remove() {} } };
  const contentElement = { scrollTop: 42, scrollLeft: 0 };
  const focusableInputs = new Map();

  function makeInput(selector) {
    const input = {
      focusCalls: 0,
      rangeCalls: [],
      focus() { this.focusCalls += 1; },
      setSelectionRange(start, end) { this.rangeCalls.push([start, end]); },
    };
    focusableInputs.set(selector, input);
    return input;
  }

  function makeNode() {
    return {
      className: '',
      innerHTML: '',
      classList: { add() {}, remove() {}, contains() { return false; } },
      append() {},
      remove() {},
      addEventListener() {},
      querySelector() { return null; },
      closest() { return null; },
    };
  }

  const document = {
    createElement() { return makeNode(); },
    head: { append() {} },
    body: { append() {}, insertAdjacentHTML() {} },
    querySelector(selector) {
      if (selector === '#app') return appElement;
      if (selector === '.content') return contentElement;
      if (selector === '.toast') return { textContent: '', classList: { add() {}, remove() {} } };
      if (selector.startsWith('[data-') && selector.endsWith('-search]')) {
        return focusableInputs.get(selector) || makeInput(selector);
      }
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener(type, handler) { listeners[type] = handler; },
  };

  const context = {
    console,
    document,
    window: {
      addEventListener() {},
      requestAnimationFrame(callback) { callback(); return 1; },
      scrollTo() {},
      matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
    },
    navigator: {
      geolocation: null,
      serviceWorker: { register() { return Promise.resolve(); } },
    },
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

  context.window.document = document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'app.js' });

  return {
    listeners,
    focusableInputs,
    run: script => vm.runInContext(script, context),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const harness = createHarness();
assert(typeof harness.listeners.input === 'function', 'Input listener should be registered');

const cases = [
  { selector: '[data-global-search]', state: 'globalQuery', value: 'CMR' },
  { selector: '[data-team-search]', state: 'teamQuery', value: 'Tommy' },
  { selector: '[data-info-search]', state: 'infoQuery', value: 'miljøzone' },
  { selector: '[data-chat-search]', state: 'chatQuery', value: 'fragtbrev' },
];

for (const testCase of cases) {
  harness.listeners.input({
    target: {
      value: testCase.value,
      selectionStart: testCase.value.length,
      selectionEnd: testCase.value.length,
      matches(selector) { return selector === testCase.selector; },
    },
  });
  assert(harness.run(testCase.state) === testCase.value, `${testCase.state} should update while typing`);
  const input = harness.focusableInputs.get(testCase.selector);
  assert(input && input.focusCalls > 0, `${testCase.selector} should regain focus`);
  assert(input.rangeCalls.some(([start, end]) => start === testCase.value.length && end === testCase.value.length), `${testCase.selector} should keep cursor position`);
}

console.log('Search input stability smoke test passed');
