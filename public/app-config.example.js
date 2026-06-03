// Copy this to public/app-config.js and insert values from Supabase:
// Project Settings -> API -> Project URL
// Project Settings -> API -> anon/publishable key
window.XPRESSINTRA_SUPABASE = {
  url: 'https://xxxxx.supabase.co',
  anonKey: 'eyJ...',
};

// GitHub bruges kun til APK-opdateringer, version.json og downloadside.
// Skift placeholderen til dit rigtige repository, før appen deles bredt.
window.XPRESSINTRA_UPDATE = {
  versionUrl: 'https://stralner2711-a11y.github.io/xpresshub/version.json',
  officialRepo: 'https://github.com/stralner2711-a11y/xpresshub',
  allowLocalVersionFallback: false,
};
