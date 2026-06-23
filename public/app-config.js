// XpressIntra APK/server configuration.
// Fill in these two values before building an APK if employees should be able to log in immediately.
// Use the public anon/publishable key only. Never put a secret server key in this file.
window.XPRESSINTRA_SUPABASE = {
  url: 'https://mtfbdoajzmlgqbeiubxe.supabase.co',
  anonKey: 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd',
};

window.XPRESSINTRA_UPDATE = {
  versionUrl: 'https://stralner2711-a11y.github.io/xpresshub/version.json',
  versionFallbackUrls: [
    'https://raw.githubusercontent.com/stralner2711-a11y/xpresshub/main/version.json',
    'https://raw.githubusercontent.com/stralner2711-a11y/xpresshub/main/docs/version.json',
  ],
  officialRepo: 'https://github.com/stralner2711-a11y/xpresshub',
  appUrl: 'https://xpresshub-seven.vercel.app/',
  allowLocalVersionFallback: false,
};
