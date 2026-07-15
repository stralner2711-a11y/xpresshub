const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = fs.readFileSync('src/app.js', 'utf8');
assert(source.includes('function') || source.includes('const fixMojibakeText'), 'App should include mojibake text cleanup');
assert(source.includes('[0xc3, 0x00b8]') && source.includes("'ø'"), 'App should repair Danish oe mojibake');
assert(source.includes('[0xc3, 0x00a5]') && source.includes("'å'"), 'App should repair Danish aa mojibake');
assert(source.includes('[0xc3, 0x00a6]') && source.includes("'æ'"), 'App should repair Danish ae mojibake');
assert(source.includes('[0xc2, 0x00b7]') && source.includes("'·'"), 'App should repair broken middle-dot role separator');

const snippet = source.slice(source.indexOf('const mojibakeReplacements'), source.indexOf('const mediaName'));
const context = {};
vm.createContext(context);
vm.runInContext(`${snippet}; this.text = text;`, context);

const broken = `Appansvarlig ${String.fromCharCode(0x00c2, 0x00b7)} Lastbilchauff${String.fromCharCode(0x00c3, 0x00b8)}r ${String.fromCharCode(0x00c3, 0x00a5)}ben ${String.fromCharCode(0x00c3, 0x00a6)}ndring`;
const repaired = context.text(broken);
assert(repaired === 'Appansvarlig · Lastbilchauffør åben ændring', 'Visible text should repair common Danish mojibake before escaping');

const escaped = context.text(`<b>${String.fromCharCode(0x00c3, 0x00b8)}</b>`);
assert(escaped === '&lt;b&gt;ø&lt;/b&gt;', 'Text repair should still escape HTML safely');

console.log('Mojibake text smoke test passed');
