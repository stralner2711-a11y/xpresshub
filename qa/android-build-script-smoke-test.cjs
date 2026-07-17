const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of ['Build Android APK.ps1', 'Build Android Release AAB.ps1']) {
  const source = fs.readFileSync(file, 'utf8');
  assert(source.includes('Android Studio2\\jbr'), `${file} should find the installed Android Studio2 JDK`);
  assert(source.includes('bin\\java.exe'), `${file} should verify java.exe before selecting a JDK`);
  assert(source.includes('$env:JAVA_HOME = $jbr'), `${file} should set JAVA_HOME to the verified JDK`);
  assert(source.includes('--no-daemon'), `${file} should avoid depending on stale Gradle daemons`);
  assert(source.includes('$previousErrorActionPreference'), `${file} should capture native stderr without treating warnings as terminating errors`);
  assert(source.includes('if ($exitCode -ne 0)'), `${file} should decide success from the native process exit code`);
}

const apkScript = fs.readFileSync('Build Android APK.ps1', 'utf8');
assert(!apkScript.includes('sandsynligvis ved rapport-generering'), 'APK builds must not accept an arbitrary Gradle error just because an APK file exists');

console.log('Android build script smoke test passed');
