const DEFAULT_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DEFAULT_PROFILE_PHOTO_MAX_DIMENSION = 512;
const DEFAULT_PROFILE_PHOTO_QUALITY = 0.84;
const DEFAULT_SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const mediaConfig = {
  maxImageBytes: DEFAULT_MAX_IMAGE_BYTES,
  profilePhotoMaxDimension: DEFAULT_PROFILE_PHOTO_MAX_DIMENSION,
  profilePhotoQuality: DEFAULT_PROFILE_PHOTO_QUALITY,
  supportedImageTypes: DEFAULT_SUPPORTED_IMAGE_TYPES,
};

export function isSupportedImageFile(file, supportedTypes = DEFAULT_SUPPORTED_IMAGE_TYPES) {
  if (!file || !file.type.startsWith('image/')) return false;
  return supportedTypes.includes(file.type);
}

export function fileToDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve({ src: reader.result, name: file.name, type: file.type, size: file.size }));
    reader.addEventListener('error', () => resolve(null));
    reader.readAsDataURL(file);
  });
}

export function resizeImageFile(file, options = {}) {
  if (typeof Image === 'undefined' || typeof document.createElement !== 'function') return fileToDataUrl(file);
  if (file.type === 'image/gif') return fileToDataUrl(file);

  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('error', () => resolve(null));
    reader.addEventListener('load', () => {
      const image = new Image();
      image.addEventListener('error', () => resolve(null));
      image.addEventListener('load', () => {
        const maxDimension = options.maxDimension || DEFAULT_PROFILE_PHOTO_MAX_DIMENSION;
        const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement('canvas');

        if (!canvas.getContext) {
          resolve({ src: reader.result, name: file.name, type: file.type, size: file.size });
          return;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const src = canvas.toDataURL(type, options.quality || DEFAULT_PROFILE_PHOTO_QUALITY);
        resolve({ src, name: file.name, type, size: Math.round((src.length * 3) / 4), originalSize: file.size });
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

globalThis.XpressIntraMedia = {
  mediaConfig,
  isSupportedImageFile,
  fileToDataUrl,
  resizeImageFile,
};
