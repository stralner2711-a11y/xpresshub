const DEFAULT_OFFICIAL_REPO = 'https://github.com/stralner2711-a11y/xpresshub';

function currentHref() {
  return globalThis.location.href || 'https://xpresshub-seven.vercel.app/';
}

function currentOrigin() {
  if (globalThis.location.origin) return globalThis.location.origin;
  try {
    return new URL(currentHref()).origin;
  } catch {
    return 'https://xpresshub-seven.vercel.app';
  }
}

export function isAllowedUpdateUrl(url, options = {}) {
  try {
    const parsed = new URL(url, options.currentHref || currentHref());
    if (parsed.origin === (options.currentOrigin || currentOrigin())) return true;
    const repo = new URL(options.officialRepo || DEFAULT_OFFICIAL_REPO);
    const repoParts = repo.pathname.replace(/^\/|\/$/g, '').split('/').map(part => part.toLowerCase());
    const repoOwner = repoParts[0];
    const repoName = repoParts[1];
    const pathParts = parsed.pathname.replace(/^\/|\/$/g, '').split('/').map(part => part.toLowerCase());
    const hostname = parsed.hostname.toLowerCase();
    if (!repoOwner || !repoName) return false;
    if (hostname === 'github.com') return pathParts[0] === repoOwner && pathParts[1] === repoName;
    if (hostname === 'raw.githubusercontent.com') return pathParts[0] === repoOwner && pathParts[1] === repoName;
    if (hostname === `${repoOwner}.github.io`) return pathParts[0] === repoName;
    return false;
  } catch {
    return false;
  }
}

export function normalizeVersionInfo(raw, options = {}) {
  if (!raw || typeof raw !== 'object') throw new Error('version.json er ikke gyldig');
  const activeVersionCode = Number(raw.activeVersionCode);
  if (!Number.isFinite(activeVersionCode) || activeVersionCode <= 0) throw new Error('activeVersionCode mangler');

  const allowUrl = options.isAllowedUpdateUrl || (url => isAllowedUpdateUrl(url, options));
  const apkDownloadUrl = String(raw.apkDownloadUrl || '').trim();
  const releasePageUrl = String(raw.releasePageUrl || '').trim();
  if (!apkDownloadUrl || !allowUrl(apkDownloadUrl)) throw new Error('APK-linket er ikke fra godkendt GitHub-kilde');
  if (releasePageUrl && !allowUrl(releasePageUrl)) throw new Error('Release-linket er ikke fra godkendt GitHub-kilde');

  return {
    latestVersion: String(raw.latestVersion || raw.activeVersion || ''),
    stableVersion: String(raw.stableVersion || raw.activeVersion || ''),
    activeVersion: String(raw.activeVersion || raw.latestVersion || ''),
    previousStableVersion: String(raw.previousStableVersion || ''),
    latestVersionCode: Number(raw.latestVersionCode || activeVersionCode),
    stableVersionCode: Number(raw.stableVersionCode || activeVersionCode),
    activeVersionCode,
    apkDownloadUrl,
    stableApkDownloadUrl: String(raw.stableApkDownloadUrl || raw.rollbackApkDownloadUrl || '').trim(),
    previousStableApkDownloadUrl: String(raw.previousStableApkDownloadUrl || '').trim(),
    releasePageUrl,
    stableReleasePageUrl: String(raw.stableReleasePageUrl || '').trim(),
    downloadPageUrl: String(raw.downloadPageUrl || ''),
    changelog: Array.isArray(raw.changelog) ? raw.changelog.map(String).slice(0, 8) : [],
    forceUpdate: Boolean(raw.forceUpdate),
    rollbackReason: String(raw.rollbackReason || ''),
    defectiveVersions: Array.isArray(raw.defectiveVersions) ? raw.defectiveVersions : [],
    updatedAt: String(raw.updatedAt || ''),
  };
}

export function stableRollbackUrl(info, options = {}) {
  if (!info) return '';
  const allowUrl = options.isAllowedUpdateUrl || (url => isAllowedUpdateUrl(url, options));
  const appVersionCode = Number(options.appVersionCode || 0);
  const candidates = [
    info.stableApkDownloadUrl,
    info.previousStableApkDownloadUrl,
    Number(info.activeVersionCode) < appVersionCode ? info.apkDownloadUrl : '',
  ].filter(Boolean);
  return candidates.find(url => allowUrl(url)) || '';
}

export function rollbackReadiness(info, options = {}) {
  const stableUrl = stableRollbackUrl(info, options);
  const hasPrevious = Boolean(info.previousStableVersion || info.stableVersion);
  const appVersionCode = Number(options.appVersionCode || 0);
  const appDisplayVersion = String(options.appDisplayVersion || '');
  const currentMarked = Array.isArray(info.defectiveVersions)
    && info.defectiveVersions.some(version => String(version) === appDisplayVersion || Number(version) === appVersionCode);
  const recommended = Boolean(info.rollbackReason || Number(info.activeVersionCode) < appVersionCode || currentMarked);
  return {
    available: Boolean(info && hasPrevious),
    stableUrl,
    recommended,
    currentMarked,
    label: recommended ? 'Rollback anbefalet' : stableUrl ? 'Backup klar' : 'Klargør backup',
    detail: stableUrl
      ? 'Creator kan åbne eller installere sidste stabile appversion uden at slette Supabase-data.'
      : 'Tilføj stableApkDownloadUrl eller previousStableApkDownloadUrl i version.json for én-tryk rollback.',
  };
}

export function updateStatusLabel(info, options = {}) {
  if (!info) return 'Ikke tjekket endnu';
  const appVersionCode = Number(options.appVersionCode || 0);
  if (Number(info.activeVersionCode) > appVersionCode) return info.forceUpdate ? 'Kritisk opdatering' : 'Ny opdatering';
  if (Number(info.activeVersionCode) < appVersionCode) return 'Rollback anbefalet';
  return 'Appen er opdateret';
}

export function shouldShowUpdate(info, options = {}) {
  if (!info) return false;
  const appVersionCode = Number(options.appVersionCode || 0);
  const manual = Boolean(options.manual);
  const dismissedVersionCode = Number(options.dismissedVersionCode || 0);
  if (info.forceUpdate && Number(info.activeVersionCode) !== appVersionCode) return true;
  if (Number(info.activeVersionCode) > appVersionCode) return manual || dismissedVersionCode !== Number(info.activeVersionCode);
  if (Number(info.activeVersionCode) < appVersionCode && info.rollbackReason) return true;
  return false;
}

globalThis.XpressIntraUpdateSystem = {
  isAllowedUpdateUrl,
  normalizeVersionInfo,
  stableRollbackUrl,
  rollbackReadiness,
  updateStatusLabel,
  shouldShowUpdate,
};
