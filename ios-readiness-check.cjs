const fs = require('fs');
const path = require('path');

const root = __dirname;
const issues = [];

function pass(message) {
  console.log(`OK: ${message}`);
}

function fail(message) {
  issues.push(message);
  console.error(`FEJL: ${message}`);
}

function requireFile(relativePath) {
  const filePath = path.join(root, relativePath);
  if (fs.existsSync(filePath)) {
    pass(`${relativePath} findes`);
    return filePath;
  }
  fail(`${relativePath} mangler`);
  return null;
}

const packagePath = requireFile('package.json');
const versionPath = requireFile(path.join('public', 'version.json'));
const configPath = requireFile('capacitor.config.json');
const capacitorConfig = configPath ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
const iosRoot = capacitorConfig.ios?.path || 'ios';
const plistPath = requireFile(path.join(iosRoot, 'App', 'App', 'Info.plist'));
const projectPath = requireFile(path.join(iosRoot, 'App', 'App.xcodeproj', 'project.pbxproj'));

[
  path.join(iosRoot, 'App', 'App.xcworkspace', 'xcshareddata', 'IDEWorkspaceChecks.plist'),
  'Build Apple iOS paa Mac.command',
  path.join('tools', 'build-ios-mac.sh'),
  path.join('docs', 'IPHONE_WEBAPP_GUIDE.md'),
  path.join('docs', 'APPLE_IOS_APP.md'),
  path.join('public', 'icons', 'xpressintra-icon-192.png'),
  path.join('public', 'icons', 'xpressintra-icon-512.png'),
].forEach(requireFile);

const packageJson = packagePath ? JSON.parse(fs.readFileSync(packagePath, 'utf8')) : null;
const versionJson = versionPath ? JSON.parse(fs.readFileSync(versionPath, 'utf8')) : null;

if (packageJson && versionJson) {
  if (packageJson.version === versionJson.activeVersion) {
    pass(`package.json og public/version.json matcher ${packageJson.version}`);
  } else {
    fail(`Versioner matcher ikke: ${packageJson.version} / ${versionJson.activeVersion}`);
  }
}

if (configPath) {
  const config = capacitorConfig;
  if (config.appId === 'dk.xpressbudet.xpressintra') pass('Capacitor appId er korrekt');
  else fail(`Capacitor appId er forkert: ${config.appId}`);

  if (config.webDir === 'web-build') pass('Capacitor webDir er web-build');
  else fail(`Capacitor webDir er forkert: ${config.webDir}`);

  if (config.ios?.path === 'ios-active') pass('Capacitor iOS-sti er ios-active');
  else fail(`Capacitor iOS-sti er forkert: ${config.ios?.path || 'ios'}`);
}

if (plistPath) {
  const plist = fs.readFileSync(plistPath, 'utf8');
  [
    'NSLocationWhenInUseUsageDescription',
    'NSCameraUsageDescription',
    'NSPhotoLibraryUsageDescription',
    'når du selv',
    'vælger et billede',
  ].forEach(needle => {
    if (plist.includes(needle)) pass(`Info.plist indeholder ${needle}`);
    else fail(`Info.plist mangler ${needle}`);
  });
}

if (projectPath && versionJson) {
  const project = fs.readFileSync(projectPath, 'utf8');
  const marketing = `MARKETING_VERSION = ${versionJson.activeVersion};`;
  const build = `CURRENT_PROJECT_VERSION = ${versionJson.activeVersionCode};`;
  if (project.includes(marketing)) pass(`iOS-version matcher ${versionJson.activeVersion}`);
  else fail(`iOS-version matcher ikke ${versionJson.activeVersion}`);
  if (project.includes(build)) pass(`iOS-build matcher ${versionJson.activeVersionCode}`);
  else fail(`iOS-build matcher ikke ${versionJson.activeVersionCode}`);
}

if (issues.length) {
  console.error(`\nRESULTAT: FEJL (${issues.length})`);
  process.exit(1);
}

console.log('\nRESULTAT: OK - iPhone/PWA og native iOS-projektet er klargjort.');
