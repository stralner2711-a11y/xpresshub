const fs = require('fs');
const path = require('path');
const Module = require('module');

const runtimeNodeModules = 'C:\\Users\\Tommy\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const pnpmNodeModules = path.join(runtimeNodeModules, '.pnpm', 'node_modules');
process.env.NODE_PATH = [process.env.NODE_PATH, runtimeNodeModules, pnpmNodeModules].filter(Boolean).join(path.delimiter);
Module._initPaths();

const { PDFDocument } = require('pdf-lib');

(async () => {
  const root = path.resolve(__dirname, '..');
  const pageDir = path.join(root, 'docs', 'demo-video', 'pdf-pages');
  const output = path.join(root, 'docs', 'demo-video', 'SEND-DENNE-XpressIntra-demo.pdf');
  const files = fs.readdirSync(pageDir).filter(name => name.endsWith('.png')).sort();
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = fs.readFileSync(path.join(pageDir, file));
    const image = await pdf.embedPng(bytes);
    const page = pdf.addPage([1920, 1080]);
    page.drawImage(image, { x: 0, y: 0, width: 1920, height: 1080 });
  }

  fs.writeFileSync(output, await pdf.save());
  console.log(output);
})();
