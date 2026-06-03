const fs = require('fs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = fs.readFileSync('src/app.js', 'utf8');
const styles = fs.readFileSync('src/styles.css', 'utf8');

assert(app.includes('const IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024'), 'Image helper should allow normal phone photos up to 10 MB');
assert(app.includes('const PROFILE_PHOTO_MAX_DIMENSION = 512'), 'Profile photos should be downscaled to an avatar-friendly size');
assert(app.includes('function isSupportedImageFile(file)'), 'Image helper should validate supported image types');
assert(app.includes('function resizeImageFile(file, options = {})'), 'Image helper should resize large profile photos');
assert(app.includes("readImageFile(data.get('photo'), { kind: 'profile' })"), 'Profile save should use profile-specific image handling');
assert(app.includes('class="profile-photo-field"'), 'Profile form should show a clear photo upload area');
assert(app.includes('data-profile-photo-preview'), 'Profile form should include a preview target');
assert(app.includes("input.matches('input[name=\"photo\"]')"), 'Profile photo input should preview immediately when changed');
assert(app.includes('JPG, PNG, WebP eller GIF'), 'Profile form should explain accepted image file types');

assert(styles.includes('.profile-photo-field'), 'Profile photo upload area should be styled');
assert(styles.includes('.profile-photo-preview.is-empty'), 'Empty profile photo preview should be styled');

console.log('Profile photo upload smoke test passed');


