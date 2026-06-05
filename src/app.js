const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 20a4 4 0 0 0-8 0"/><circle cx="12" cy="9" r="3"/><path d="M19 20a3 3 0 0 0-2-2.83M17 6.13a3 3 0 0 1 0 5.74M5 20a3 3 0 0 1 2-2.83M7 6.13a3 3 0 0 0 0 5.74"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z"/><path d="M9 3v15m6-12v15"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M20 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zm11 4h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="m15 5 4 4M4 20l4-1 11-11a2.8 2.8 0 0 0-4-4L4 15z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6v.08h-4V20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1H3.9v-4H4a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.06 4.2l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6v-.1h4V4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1h.1v4H20a1.7 1.7 0 0 0-.6 1z"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M12 3 2 20h20z"/><path d="M12 9v4M12 17h.01"/></svg>',
  van: '<svg viewBox="0 0 24 24"><path d="M3 7h11v10H3zM14 10h4l3 4v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9z"/></svg>',
  document: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M20 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-5-5L5 19"/></svg>',
  smile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 19h16"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
};

const APP_VERSION = '1.3.23-release-v84';
const APP_DISPLAY_VERSION = '1.3.23';
const APP_VERSION_CODE = 36;
const TEMPORARY_EMPLOYEE_PASSWORD = 'xpress';
const IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const PROFILE_PHOTO_MAX_DIMENSION = 512;
const PROFILE_PHOTO_QUALITY = 0.84;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const UPDATE_CONFIG_KEY = 'appUpdateState';
const defaultUpdateConfig = {
  versionUrl: 'https://stralner2711-a11y.github.io/xpresshub/version.json',
  officialRepo: 'https://github.com/stralner2711-a11y/xpresshub',
  appUrl: 'https://xpresshub-seven.vercel.app/',
  allowLocalVersionFallback: false,
};
const appUpdateConfig = { ...defaultUpdateConfig, ...(window.XPRESSINTRA_UPDATE || {}) };
const SUPABASE_CONFIG_KEY = 'supabaseConfig';
const defaultSupabaseConfig = {
  url: 'https://mtfbdoajzmlgqbeiubxe.supabase.co',
  anonKey: 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd',
};
const injectedSupabaseForMode = typeof window !== 'undefined'
  ? { ...defaultSupabaseConfig, ...(window.XPRESSINTRA_SUPABASE || {}) }
  : defaultSupabaseConfig;
const storedSupabaseConfigForMode = (() => {
  try { return JSON.parse(localStorage.getItem(`roadlog:${SUPABASE_CONFIG_KEY}`)); } catch { return null; }
})();
const hasSupabaseConfigForMode = Boolean(
  String(injectedSupabaseForMode.url || storedSupabaseConfigForMode?.url || '').trim()
  && String(injectedSupabaseForMode.anonKey || injectedSupabaseForMode.key || storedSupabaseConfigForMode?.anonKey || storedSupabaseConfigForMode?.key || '').trim()
);
const storedSessionForMode = (() => {
  try { return JSON.parse(localStorage.getItem('roadlog:session')); } catch { return null; }
})();
const DEMO_MODE = Boolean(window.XPRESSINTRA_DEMO_MODE)
  || Boolean(storedSessionForMode?.mode === 'demo')
  || Boolean(!hasSupabaseConfigForMode && storedSessionForMode && storedSessionForMode.mode !== 'supabase');
let launchSplashVisible = typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('xpressintra:launchSplashSeen');
let launchSplashScheduled = false;
const SUPABASE_PUBLIC_CHATS = {
  all: '00000000-0000-4000-8000-000000000001',
  trucks: '00000000-0000-4000-8000-000000000002',
  vans: '00000000-0000-4000-8000-000000000003',
};

const seedEmployees = [
  { id: 'th', name: 'Tommy Hansen', initials: 'TH', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck', truck: 'TR 42 918', status: 'Appansvarlig · tester appen', location: 'Flensburg', phone: '+45 22 44 18 90', email: 'stralner2711@gmail.com', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis', emergencyContact: 'Anne · +45 22 11 90 90', languages: 'Dansk, engelsk, tysk', employmentStatus: 'active', online: true, sharing: false, coords: [54.7833, 9.4333] },
  { id: 'ma', name: 'Mads Andersen', initials: 'MA', role: 'Chauffør', accessRole: 'employee', vehicleType: 'van', truck: 'VB 51 204', status: 'Pause til 14:10', location: 'Kolding', phone: '+45 20 11 40 44', email: 'mads@xpressbudet.local', department: 'Varebil', license: 'B · varebilsuddannelse', emergencyContact: 'Sofie · +45 20 20 20 20', languages: 'Dansk, engelsk', employmentStatus: 'active', online: true, sharing: true, coords: [55.4904, 9.4722] },
  { id: 'ls', name: 'Line Sørensen', initials: 'LS', role: 'Disponent', accessRole: 'dispatcher', vehicleType: 'dispatch', truck: 'Kontoret', status: 'Tilgængelig', location: 'Hasselager', phone: '+45 40 55 31 31', email: 'line@xpressbudet.local', department: 'Drift', license: 'Kontor', emergencyContact: 'Kontoret', languages: 'Dansk, engelsk, tysk', employmentStatus: 'active', online: true, sharing: false, coords: [56.1055, 10.0065] },
  { id: 'hb', name: 'Henrik Bossen', initials: 'HB', role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse', status: 'Admin · kan styre roller', location: 'Hasselager', phone: '+45 40 87 31 31', email: 'chef@xpressbudet.local', department: 'Ledelse', license: 'Administrator', emergencyContact: 'Kontoret', languages: 'Dansk, engelsk', employmentStatus: 'active', online: true, sharing: false, coords: [56.1055, 10.0065] },
  { id: 'pn', name: 'Peter Nielsen', initials: 'PN', role: 'Chauffør', accessRole: 'employee', vehicleType: 'truck', truck: 'TR 38 771', status: 'Levering afsluttet', location: 'Bremen', phone: '+45 23 44 55 66', email: 'peter@xpressbudet.local', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis', emergencyContact: 'Mette · +45 23 23 23 23', languages: 'Dansk, tysk', employmentStatus: 'active', online: false, sharing: true, coords: [53.0793, 8.8017] },
  { id: 'jk', name: 'Julie Kristensen', initials: 'JK', role: 'Chauffør', accessRole: 'employee', vehicleType: 'van', truck: 'VB 20 447', status: 'Klar til ny opgave', location: 'Odense', phone: '+45 24 55 66 77', email: 'julie@xpressbudet.local', department: 'Varebil', license: 'B · varebilsuddannelse', emergencyContact: 'Jonas · +45 24 24 24 24', languages: 'Dansk, engelsk', employmentStatus: 'active', online: true, sharing: true, coords: [55.4038, 10.4024] },
];

const seedVehicles = [
  { id: 'tr-42918', unit: 'TR 42 918', type: 'Lastbil', plate: 'TR42918', driverId: 'th', status: 'På tur', equipment: 'Trækker · pallegods', nextCheck: 'Syn tjekkes 18. juni' },
  { id: 'vb-51204', unit: 'VB 51 204', type: 'Varebil', plate: 'VB51204', driverId: 'ma', status: 'Pause', equipment: 'Varebil · ekspres', nextCheck: 'Service om 2.400 km' },
  { id: 'tr-38771', unit: 'TR 38 771', type: 'Lastbil', plate: 'TR38771', driverId: 'pn', status: 'Ledig efter levering', equipment: 'Liftbil · stykgods', nextCheck: 'Udstyr OK' },
  { id: 'vb-20447', unit: 'VB 20 447', type: 'Varebil', plate: 'VB20447', driverId: 'jk', status: 'Klar', equipment: 'Varebil · bydistribution', nextCheck: 'Dæk tjekkes fredag' },
  { id: 'fleet-spare', unit: 'Reserve', type: 'Køretøj', plate: 'Ikke tildelt', driverId: null, status: 'På værksted', equipment: 'Reserveenhed', nextCheck: 'Afventer service' },
];

const seedNotifications = [
  { id: 'direct-line', type: 'Direkte besked', title: 'Line har skrevet til dig', body: 'Ring når du er tom i Hamburg.', time: '13:04', level: 'message', unread: true },
  { id: 'office-docs', type: 'Kontoropslag', title: 'Husk dokumentation', body: 'CMR-billede kræves på udvalgte internationale leveringer.', time: 'I går', level: 'office', unread: true },
  { id: 'rule-van-2026', type: 'Regelnyt', title: 'Varebilkrav fra 1. juli 2026', body: 'Takograf og køre-/hviletid bliver relevant for internationale varebiler over 2,5 ton.', time: '31. maj', level: 'rule', unread: false },
];

const defaultNotificationPrefs = { office: true, rules: true, chat: true, dailyBrief: true, quietHours: true, system: false };
const productionProfile = { name: 'Medarbejder', phone: '', email: '', role: 'Chauffør', accessRole: 'employee', vehicleType: 'truck', truck: '', department: '', license: '', emergencyContact: '', languages: '', logbook: true };

const seedChats = [
  { id: 'dispatch', name: 'Drift og planlægning', initials: 'DP', preview: 'Line: Ring når du er tom i Hamburg.', time: '13:04', unread: 2 },
  { id: 'ma', name: 'Mads Andersen', initials: 'MA', preview: 'Jeg holder ved Cirkle K i Kolding.', time: '12:42', unread: 0 },
  { id: 'all', name: 'Fælleschat · Alle medarbejdere', initials: 'FC', preview: 'Peter: Kø ved Bremen, vælg A1.', time: '11:18', unread: 1, community: true },
  { id: 'trucks', name: 'Lastbilchat', initials: 'LB', preview: 'Peter: Kø ved Bremen, vælg A1.', time: '11:18', unread: 1, channel: 'truck' },
  { id: 'vans', name: 'Varebilchat', initials: 'VB', preview: 'Julie: Jeg er fri i Odense om 20 min.', time: '12:56', unread: 2, channel: 'van' },
];

const seedAnnouncements = [
  { id: 'bremen', title: 'Vejarbejde ved Bremen', body: 'Forvent ekstra kø i eftermiddag. Brug A1 hvis ruten tillader det.', time: 'I dag · 11:18', tone: 'amber', kind: 'office', author: 'Kontoret', initials: 'XB', audience: 'Alle medarbejdere', pinned: true, likes: 6, comments: ['Tak for info', 'A1 glider fint lige nu.'] },
  { id: 'documentation', title: 'Husk dokumentation', body: 'Send et billede af CMR efter levering, når opgaven kræver det.', time: 'I går · Line', tone: 'green', kind: 'office', author: 'Line · Kontoret', initials: 'LS', audience: 'Alle medarbejdere', likes: 4, comments: [] },
  { id: 'kolding', title: 'God holdeplads ved Kolding', body: 'Der er plads ved Circle K lige nu, hvis nogen mangler en hurtig pause.', time: 'I dag · 12:42', tone: 'green', kind: 'colleague', author: 'Mads Andersen', initials: 'MA', audience: 'Kollegaer', likes: 9, comments: ['Tak Mads, jeg er der om 20 min.'] },
];

const ruleUpdates = [
  {
    audience: 'Varebil · international kørsel',
    title: 'Nye krav fra 1. juli 2026',
    body: 'Internationale varebiler over 2,5 ton bliver omfattet af takograf samt køre-/hviletidsregler i relevante tilfælde.',
    source: 'Færdselsstyrelsen',
    checked: 'Nyhed 27. marts 2026',
    href: 'https://www.fstyr.dk/nyheder/2026/mar/varebiler-bliver-en-del-af-koere-og-hviletidskontrollen',
    severity: 'important',
    status: 'approved',
    effectiveDate: '1. juli 2026',
    whyItMatters: 'Varebiler i international godskørsel skal kende kravene i god tid og afklare, om bilen bliver omfattet.',
  },
  {
    audience: 'Varebil og lastbil · Danmark',
    title: 'Nye arbejdstidsregler fra 1. juli 2026',
    body: 'Færdselsstyrelsen meldte i februar 2026 ud, at arbejdstidsreglerne ændres for kørsel efter nationale undtagelser til køre- og hviletidsreglerne.',
    source: 'Færdselsstyrelsen',
    checked: 'Nyhed 9. februar 2026',
    href: 'https://www.fstyr.dk/nyheder/2026/feb/aendring-af-bekendtgoerelsen-om-koere-og-hviletidsbestemmelserne-i-vejtransport-og-kontrol-med-arbejdstid-pr-1-juli-2026',
    severity: 'important',
    status: 'approved',
    effectiveDate: '1. juli 2026',
    whyItMatters: 'Drift og chauffører skal vide, hvornår kontrollen ligger hos Færdselsstyrelsen og Politiet, og hvilke kørsler der er omfattet.',
  },
  {
    audience: 'Lastbil · Danmark',
    title: 'Vejafgift samlet ét sted',
    body: 'Brug den officielle portal til kilometerbaseret vejafgift og aktuelle driftsmeddelelser.',
    source: 'Vejafgifter.dk',
    checked: 'Overvåget kilde',
    href: 'https://vejafgifter.dk/',
    severity: 'watch',
    status: 'approved',
    effectiveDate: 'Løbende',
    whyItMatters: 'Lastbiler på relevante afgiftspligtige veje skal have styr på betaling og driftsmeddelelser.',
  },
  {
    audience: 'Lastbil · Danmark',
    title: 'ITD: bødemodel for vejafgift er stadig ikke afklaret',
    body: 'ITD skrev 29. maj 2026, at arbejdet med en ny bødemodel fortsat ikke er afsluttet, og at bødeudstedelsen i praksis fortsat er sat på pause bortset fra åbenlyst snyd.',
    source: 'ITD',
    checked: 'Nyhed 29. maj 2026',
    href: 'https://itd.dk/nyheder/itd-nyt/2026/international-transport-danmark-accepterer-ny-udsaettelse-af-vejafgiftsstaevning/',
    severity: 'watch',
    status: 'approved',
    effectiveDate: 'Gældende status',
    whyItMatters: 'Det er vigtigt driftsstof, men det er en branchekilde og erstatter ikke den officielle vejafgiftsportal.',
  },
  {
    audience: 'Lastbil · virksomhedskontrol',
    title: 'Virksomhedskontrol kører nu over længere periode',
    body: 'Færdselsstyrelsen har opdateret virksomhedskontrollen, så kontrolperioden er udvidet og vejledningerne er samlet tydeligere.',
    source: 'Færdselsstyrelsen',
    checked: 'Kontrolleret 3. juni 2026',
    href: 'https://www.fstyr.dk/nyheder/2025/apr/-aendringer-i-virksomhedskontrollen-fra-april-2025',
    severity: 'important',
    status: 'approved',
    effectiveDate: '1. april 2025',
    whyItMatters: 'Driften skal kunne finde den officielle kontrolramme, hvis virksomheden bliver bedt om at indsende data.',
  },
];

const quickGuides = [
  { title: 'Uheld eller skade', audience: 'Alle', body: 'Sikr stedet, ring 112 ved fare, tag billeder og kontakt driften.', action: 'Ring til drift', href: 'tel:+4540553131', icon: 'alert' },
  { title: 'Forsinkelse', audience: 'Alle', body: 'Skriv kort årsag, forventet tid og om kunden skal kontaktes.', action: 'Åbn fælleschat', chat: 'all', icon: 'send' },
  { title: 'CMR og billeder', audience: 'Lastbil', body: 'Tag tydelige billeder ved afvigelser, skader eller når opgaven kræver dokumentation.', action: 'Se dokumenter', category: 'documents', icon: 'document' },
  { title: 'Miljøzoner', audience: 'Varebil og lastbil', body: 'Tjek krav før kørsel i byzoner, især ved ældre dieselkøretøjer.', action: 'Åbn kilde', href: 'https://miljoezoner.dk/', icon: 'map' },
];

const fastAnswers = [
  { title: 'Forsinket?', body: 'Skriv årsag, ny ETA og om kunden skal kontaktes. Ring til drift ved større afvigelser.', audience: 'Alle' },
  { title: 'Uheld eller skade?', body: 'Sikr stedet først, ring 112 ved fare, tag billeder og kontakt kontoret bagefter.', audience: 'Alle' },
  { title: 'CMR eller billede?', body: 'Tag tydeligt billede ved skade, afvigelse eller når opgaven kræver dokumentation.', audience: 'Lastbil' },
];

const countryGuides = [
  { country: 'Danmark', body: 'Hold øje med miljøzoner, vejafgift for relevante lastbiler og interne CMR-krav.', audience: 'Alle' },
  { country: 'Tyskland', body: 'Tjek rute, kø, miljøzoner og dokumentation før levering. Brug kontoret ved tvivl.', audience: 'Lastbil' },
  { country: 'Holland', body: 'Vær ekstra opmærksom på byzoner, aflæsningstider og kundens adgangsforhold.', audience: 'Varebil og lastbil' },
];

const infoChecklists = [
  { title: 'Før afgang', items: ['Opgave og adresse', 'Kontaktperson', 'Dokumenter', 'Bil og udstyr'] },
  { title: 'Ved levering', items: ['Parker sikkert', 'Tjek gods', 'Tag billede ved afvigelse', 'Meld status'] },
];

const emojiChoices = ['👍', '😂', '🚚', '📦', '☕', '✅', '🙏', '⚠️'];

const infoSections = [
  { id: 'operations', icon: 'alert', title: 'Akut & drift', subtitle: 'Kontakter, terminal og hjælp til alle' },
  { id: 'trucks', icon: 'truck', title: 'Lastbil', subtitle: 'Køre-/hviletid, vejafgift og miljøzoner' },
  { id: 'vans', icon: 'van', title: 'Varebil', subtitle: 'Tilladelser, miljøzoner og nye EU-regler' },
  { id: 'documents', icon: 'document', title: 'Dokumenter', subtitle: 'CMR, vilkår og relevante arbejdslinks' },
  { id: 'rules', icon: 'info', title: 'Regler', subtitle: 'Officielle regelkilder samlet ét sted' },
];

const companyContacts = [
  { id: 'drift', name: 'Drift / budkørsel', role: 'Hurtig hjælp til opgaver, forsinkelser og akutte ændringer', group: 'Drift', phone: '+4540553131', email: '', initials: 'DR', priority: true },
  { id: 'lastbil-drift', name: 'Lastbil / liftbil / trækker', role: 'Kontakt ved lastbil, liftbil, trækker og større opgaver', group: 'Lastbil', phone: '+4540873131', email: '', initials: 'LB', priority: true },
  { id: 'alarm', name: 'Akut fare eller personskade', role: 'Ring 112 først. Kontakt derefter driften.', group: 'Akut', phone: '112', email: '', initials: '112', priority: true },
  { id: 'kontor', name: 'Terminal og kontor', role: 'Ved Milepælen 2, 8361 Hasselager', group: 'Kontor', phone: '+4540553131', email: '', initials: 'XB', priority: false },
];

const infoDetails = {
  operations: {
    title: 'Fælles drift og hjælp',
    intro: 'Hurtig adgang til de vigtigste kontaktpunkter. Interne procedurer for uheld, forsinkelse og dokumentation skal kvalitetssikres med driften og lægges ind her.',
    rows: [
      ['Budkørsel og transport', '40 55 31 31', 'tel:+4540553131'],
      ['Lastbil · liftbil · trækker', '40 87 31 31', 'tel:+4540873131'],
      ['Terminal og kontor', 'Ved Milepælen 2, 8361 Hasselager'],
      ['Akut fare eller personskade', 'Ring 112 først. Kontakt derefter driften.'],
      ['Ved skade eller forsinkelse', 'Kontakt altid driften med det samme.'],
      ['Dokumentation efter levering', 'Tilføj intern tjekliste: CMR, billeder og eventuelle afvigelser.'],
      ['Lastsikring', 'Åbn Færdselsstyrelsens vejledning', 'https://www.fstyr.dk/Media/638245854599779929/Lastsikring%20-%20nye%20bestemmelser%20og%20metoder.pdf'],
    ],
  },
  vans: {
    title: 'Varebil',
    intro: 'Information til varebilschauffører. Brug altid de officielle links ved tvivl, da krav afhænger af vægt, gods og om kørslen er national eller international.',
    rows: [
      ['Vigtigt fra 1. juli 2026', 'Internationale varebiler over 2,5 ton bliver omfattet af takograf samt køre-/hviletidsregler i relevante tilfælde.', 'https://www.fstyr.dk/nyheder/2026/mar/varebiler-bliver-en-del-af-koere-og-hviletidskontrollen'],
      ['Varebilsregler hos Færdselsstyrelsen', 'Samlet indgang til tilladelser, varebilskørsel og branchekrav', 'https://www.fstyr.dk/erhverv/varebil'],
      ['Varebilsuddannelser', 'Se krav til varebilschaufføruddannelsesbevis', 'https://www.fstyr.dk/privat/chauffoeruddannelser/varebilsuddannelser'],
      ['Takograf', 'Færdselsstyrelsens takografside', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/takograf'],
      ['Miljøzoner for varebiler', 'Tjek gældende danske krav før kørsel i miljøzoner', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-varebiler/'],
      ['EU-overblik for varebiler', 'European Labour Authority om internationale varebiler', 'https://www.ela.europa.eu/en/light-commercial-vehicles'],
      ['EU-kampagne om nye varebilsregler', 'ELA samler materiale om de store ændringer i 2026', 'https://www.ela.europa.eu/en/news/ela-launches-light-vehicles-big-changes-campaign-ahead-2026-rules'],
    ],
  },
  trucks: {
    title: 'Lastbil',
    intro: 'Information til lastbilchauffører. Oversigten peger på officielle kilder til de regler, der løbende kan ændre sig.',
    rows: [
      ['Køre- og hviletid', 'Færdselsstyrelsens vejledning', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/vejledning-om-reglerne'],
      ['Arbejdstidsregler', 'Færdselsstyrelsens oversigt over arbejdstid i vejtransport', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/arbejdstidsregler'],
      ['Virksomhedskontrol', 'Sådan foregår kontrol af køre- og hviletidsreglerne', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/virksomhedskontrol'],
      ['EU-regler for arbejdstid', 'Køretid, pauser og hvil', 'https://europa.eu/youreurope/citizens/work/work-abroad/rules-working-road-transport/index_en.htm'],
      ['Vejafgift i Danmark', 'Kilometerbaseret afgift for relevante lastbiler', 'https://www.vejafgifter.dk/'],
      ['Afgiftspligtige veje', 'Se vejafgiftens officielle kort', 'https://vejafgifter.dk/hvilke-veje/'],
      ['Miljøzoner for lastbiler', 'Tjek de gældende danske krav', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-lastbiler-busser/'],
      ['Lastsikring', 'Færdselsstyrelsens vejledning', 'https://www.fstyr.dk/Media/638245854599779929/Lastsikring%20-%20nye%20bestemmelser%20og%20metoder.pdf'],
      ['ITD om køre- og hviletid', 'Brancheguide og værktøjer som supplement til myndighedsreglerne', 'https://itd.dk/vaerktoej/koere-og-hviletid/'],
      ['EU-kampagne for vejtransport', 'ELA samler materiale om takograf, posting og køre-/hviletid', 'https://www.ela.europa.eu/en/campaign/road-fair-transport'],
    ],
  },
  documents: {
    title: 'Dokumenter',
    intro: 'Links til XpressBudets offentlige dokumenter. Interne vejledninger kan tilføjes, når systemet kobles online.',
    rows: [
      ['CMR-loven', 'Åbn dokument', 'https://xpressbudet.dk/wp-content/uploads/2017/03/3_cmr-loven.pdf'],
      ['NSAB 2015', 'Åbn via XpressBudet.dk', 'https://www.xpressbudet.dk/'],
      ['Forretningsbetingelser', 'Åbn XpressBudet.dk', 'https://www.xpressbudet.dk/forretningsbetingelser/'],
      ['Vejtransport hos XpressBudet', 'Ydelser og transporttyper', 'https://www.xpressbudet.dk/vejtransport/'],
    ],
  },
  rules: {
    title: 'Regler',
    intro: 'Samlede officielle kilder til regler, som kan ændre sig. Brug dem ved tvivl og få interne procedurer godkendt af driften.',
    rows: [
      ['Køre- og hviletid', 'Færdselsstyrelsens vejledning', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/vejledning-om-reglerne'],
      ['Arbejdstidsregler', 'Færdselsstyrelsens side om arbejdstid i vejtransport', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/arbejdstidsregler'],
      ['Virksomhedskontrol', 'Færdselsstyrelsens kontrolside for køre- og hviletid', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/koere-og-hviletid/virksomhedskontrol'],
      ['Varebilsregler', 'Færdselsstyrelsens indgang til varebilskørsel og tilladelser', 'https://www.fstyr.dk/erhverv/varebil'],
      ['Takograf', 'Færdselsstyrelsens takografside', 'https://www.fstyr.dk/erhverv/gods-bus-og-varebil/takograf'],
      ['Miljøzoner for varebiler', 'Tjek gældende danske krav for varebiler', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-varebiler/'],
      ['Miljøzoner for lastbiler', 'Tjek gældende danske krav for lastbiler og busser', 'https://miljoezoner.dk/regler-og-koretojer/regler-for-lastbiler-busser/'],
      ['Vejafgift', 'Kilometerbaseret afgift og afgiftspligtige veje', 'https://www.vejafgifter.dk/'],
      ['ITD om køre- og hviletid', 'Branchekilde med praktiske forklaringer og værktøjer', 'https://itd.dk/vaerktoej/koere-og-hviletid/'],
      ['EU-regler for vejtransport', 'Køretid, pauser, hvil og arbejde i udlandet', 'https://europa.eu/youreurope/citizens/work/work-abroad/rules-working-road-transport/index_en.htm'],
      ['ELA vejtransportkampagne', 'Officielt EU-materiale om takograf, posting og sociale regler', 'https://www.ela.europa.eu/en/campaign/road-fair-transport'],
    ],
  },
};

const fallbackBuildInfoLinks = (details = infoDetails, sections = infoSections) => Object.entries(details).flatMap(([category, section]) =>
  section.rows.map(([title, description, href]) => ({
    id: `${category}-${title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')}`,
    category,
    title,
    description,
    href,
    icon: sections.find(item => item.id === category)?.icon || 'info',
    source: href?.includes('fstyr.dk') ? 'Færdselsstyrelsen'
      : href?.includes('miljoezoner.dk') ? 'Miljøzoner'
      : href?.includes('vejafgifter.dk') ? 'Vejafgifter'
      : href?.includes('ela.europa.eu') ? 'European Labour Authority'
      : href?.includes('itd.dk') ? 'ITD'
      : href?.includes('at.dk') ? 'Arbejdstilsynet'
      : href?.includes('virk.dk') ? 'Virk'
      : href?.includes('xpressbudet.dk') ? 'XpressBudet'
      : href?.includes('europa.eu') ? 'EU'
      : href?.startsWith('tel:') ? 'Telefon'
      : 'Intern',
  }))
);
const infoLinks = globalThis.XpressIntraInfoCenter?.buildInfoLinks
  ? globalThis.XpressIntraInfoCenter.buildInfoLinks(infoDetails, infoSections)
  : fallbackBuildInfoLinks(infoDetails, infoSections);

const WORKDAY_TIMEZONE = 'Europe/Copenhagen';
const GDPR_POLICY_VERSION = '2026-06-02';

const gdprRetentionPlan = [
  { key: 'live_gps', label: 'Live GPS', days: 1, area: 'GPS', description: 'Seneste position overskrives løbende. Undgå historik i normal drift.' },
  { key: 'pickup_location', label: 'Afhentningsdeling', days: 1, area: 'GPS', description: 'Midlertidig deling slettes efter udløb eller færdigmelding.' },
  { key: 'chat_messages', label: 'Chatbeskeder', days: 730, area: 'Chat', description: 'Intern chat bevares efter aftalt arbejdsformål og slettes/arkiveres efter frist.' },
  { key: 'media', label: 'Billeder', days: 365, area: 'Billeder', description: 'Billeder gemmes kun så længe dokumentationsformålet kræver det.' },
  { key: 'audit_log', label: 'Audit-log', days: 730, area: 'Sikkerhed', description: 'Adminhandlinger bevares for ansvarlighed uden privat chatindhold.' },
];

const gdprDataAreas = [
  { area: 'Profiler', purpose: 'Kontakt, rolle, køretøj, beviser og sikker drift.', basis: 'Aftales af virksomheden', employeeControl: 'Medarbejder kan se og rette via profil/dataanmodning.' },
  { area: 'GPS', purpose: 'Frivillig lokationsdeling ved arbejdsdag, afhentning og hjælp mellem kollegaer.', basis: 'Aftales af virksomheden', employeeControl: 'Kan slås fra, begrænses til hold og skjule fart/bil/status.' },
  { area: 'Chat', purpose: 'Intern koordinering mellem medarbejdere og hold.', basis: 'Aftales af virksomheden', employeeControl: 'Direkte samtaler og rollekanaler er adgangsstyrede.' },
  { area: 'Logbog', purpose: 'Privat personlig arbejdslog og minder fra turen.', basis: 'Frivillig funktion', employeeControl: 'Kan slås fra og slettes som egne data.' },
  { area: 'Billeder', purpose: 'Dokumentation i chat, opslag, profil, logbog og opgaver.', basis: 'Aftales efter formål', employeeControl: 'Upload er valgfrit og bør begrænses til relevante billeder.' },
  { area: 'Adminlog', purpose: 'Sikkerhed, ændringsspor og ansvarlighed.', basis: 'Legitim drift/sikkerhed vurderes af virksomheden', employeeControl: 'Indgår i indsigt uden privat chatindhold.' },
];

const seedMessages = {
  dispatch: [
    ['them', 'Godmorgen Tommy. Din næste aflæsning er port 4.', '08:12'],
    ['me', 'Modtaget. Jeg er fremme omkring 16:40.', '08:15'],
    ['them', 'Perfekt. Ring når du er tom i Hamburg.', '13:04'],
  ],
  ma: [
    ['them', 'Hvordan ser trafikken ud sydpå?', '12:30'],
    ['me', 'Den glider fint ved grænsen lige nu.', '12:35'],
    ['them', 'Super. Jeg holder ved Circle K i Kolding.', '12:42'],
  ],
  all: [
    ['them', 'Husk vejarbejde ved Bremen i eftermiddag.', '10:44'],
    ['them', 'Kø ved Bremen, vælg A1 hvis I kan.', '11:18'],
  ],
  trucks: [
    ['them', 'Peter: Kø ved Bremen, vælg A1 hvis I kan.', '11:18'],
    ['them', 'Line: Husk CMR-billede på internationale leveringer.', '11:32'],
  ],
  vans: [
    ['them', 'Julie: Jeg er fri i Odense om 20 min.', '12:56'],
    ['them', 'Line: Er der nogen tæt på Kolding?', '13:01'],
  ],
};

const stored = key => {
  try { return JSON.parse(localStorage.getItem(`roadlog:${key}`)); } catch { return null; }
};
const save = (key, value) => localStorage.setItem(`roadlog:${key}`, JSON.stringify(value));
const clone = value => JSON.parse(JSON.stringify(value));
const text = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const mediaName = value => String(value || 'xpressintra-billede.jpg').replace(/[^\wæøåÆØÅ.-]+/g, '-');

let supabaseClientInstance = null;
let supabaseChatSubscription = null;
let supabaseLocationSubscription = null;
let supabasePickupSubscription = null;
let supabaseNotificationSubscription = null;
let supabaseSchemaState = { missingLocationShares: false, locationWarningShown: false };
let deferredPwaInstallPrompt = null;
let pwaInstallAvailable = false;
let pwaInstalled = false;
const DESKTOP_VIEW_MODES = new Set(['compact', 'large', 'full']);

function desktopViewMode() {
  const mode = stored('desktopViewMode') || 'full';
  return DESKTOP_VIEW_MODES.has(mode) ? mode : 'full';
}

function desktopViewModeOption(value, label) {
  return `<option value="${value}" ${desktopViewMode() === value ? 'selected' : ''}>${label}</option>`;
}

function isPwaStandalone() {
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator?.standalone);
}

function pwaInstallLabel() {
  if (pwaInstalled || isPwaStandalone()) return 'IntraBudet er installeret på denne enhed';
  if (pwaInstallAvailable) return 'Installer IntraBudet som app';
  return 'Klargør IntraBudet som app';
}

async function installPwaApp() {
  if (pwaInstalled || isPwaStandalone()) {
    showToast('IntraBudet er allerede åbnet som app');
    return;
  }
  if (!deferredPwaInstallPrompt) {
    openPwaInstallHelpModal();
    return;
  }
  deferredPwaInstallPrompt.prompt();
  const choice = await deferredPwaInstallPrompt.userChoice.catch(() => null);
  deferredPwaInstallPrompt = null;
  pwaInstallAvailable = false;
  if (choice?.outcome === 'accepted') {
    pwaInstalled = true;
    showToast('IntraBudet er installeret og klar');
    if (systemNotificationPermission() === 'default') await requestSystemNotifications();
  } else {
    showToast('Installationen blev ikke gennemført endnu');
  }
  render();
}

function openPwaInstallHelpModal() {
  document.querySelector('.modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal install-help-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <h3>Installer IntraBudet</h3>
    <p>Browseren er ikke helt klar med installationsboksen endnu. Prøv først at genindlæse siden. Kommer boksen ikke, kan appen installeres direkte fra browserens menu.</p>
    <div class="install-help-steps">
      <span><b>Chrome eller Edge</b><small>Klik på installer-ikonet i adresselinjen, eller brug menuen med tre prikker og vælg Installer app.</small></span>
      <span><b>iPhone</b><small>Åbn appen i Safari, tryk Del, vælg Føj til hjemmeskærm og åbn derefter IntraBudet fra hjemmeskærmen.</small></span>
      <span><b>Windows</b><small>Når installationen er godkendt, ligger IntraBudet i Start-menuen som en almindelig app.</small></span>
    </div>
    <button type="button" data-action="reload-for-install">Genindlæs og prøv igen</button>
  </section>`;
  document.body.append(modal);
}

function supabaseConfig() {
  const injected = typeof window !== 'undefined' ? (window.XPRESSINTRA_SUPABASE || {}) : {};
  const local = stored(SUPABASE_CONFIG_KEY) || {};
  if (globalThis.XpressIntraSupabaseClient?.resolveSupabaseConfig) {
    return globalThis.XpressIntraSupabaseClient.resolveSupabaseConfig({
      injected,
      local,
      defaults: defaultSupabaseConfig,
    });
  }
  return {
    url: String(injected.url || local.url || defaultSupabaseConfig.url || '').trim(),
    anonKey: String(injected.anonKey || injected.key || local.anonKey || local.key || defaultSupabaseConfig.anonKey || '').trim(),
  };
}

function supabaseStatus() {
  const config = supabaseConfig();
  if (globalThis.XpressIntraSupabaseClient?.supabaseStatusFromConfig) {
    return globalThis.XpressIntraSupabaseClient.supabaseStatusFromConfig(config, Boolean(window.supabase?.createClient));
  }
  if (!config.url || !config.anonKey) return { ready: false, label: 'Demo', detail: 'Supabase mangler URL og offentlig anon key' };
  if (!window.supabase?.createClient) return { ready: true, label: 'Online', detail: 'Klar via indbygget Supabase-login' };
  return { ready: true, label: 'Online', detail: 'Klar til Supabase Auth og database' };
}

async function runSupabaseDiagnostics() {
  const config = supabaseConfig();
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  add('URL', Boolean(config.url), config.url || 'Mangler Supabase URL');
  add('Publishable key', Boolean(config.anonKey), config.anonKey ? `${config.anonKey.slice(0, 16)}...` : 'Mangler offentlig nøgle');
  add('Supabase bibliotek', Boolean(window.supabase?.createClient), window.supabase?.createClient ? 'Indlæst i appen' : 'Biblioteket kunne ikke hentes fra CDN');

  if (!config.url || !config.anonKey) return checks;

  const headers = { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` };
  if (typeof fetch !== 'function') {
    add('Netværkstest', false, 'Denne enhed/browser understøtter ikke fetch-testen');
    return checks;
  }

  try {
    const authResponse = await fetch(`${config.url}/auth/v1/settings`, { headers: { apikey: config.anonKey } });
    add('Auth endpoint', authResponse.ok, `HTTP ${authResponse.status}`);
  } catch (error) {
    add('Auth endpoint', false, error.message);
  }

  try {
    const profileResponse = await fetch(`${config.url}/rest/v1/profiles?select=id&limit=1`, { headers });
    const body = await profileResponse.text();
    const existsButNeedsLogin = [401, 403].includes(profileResponse.status);
    add('Profiles Data API', profileResponse.ok || existsButNeedsLogin, `HTTP ${profileResponse.status}${body ? ` · ${body.slice(0, 120)}` : ''}`);
  } catch (error) {
    add('Profiles Data API', false, error.message);
  }

  const client = getSupabaseClient();
  if (!client) return checks;

  try {
    const { data } = await client.auth.getSession();
    add('Session', Boolean(data?.session), data?.session ? `Logget ind som ${data.session.user.email}` : 'Ingen aktiv Supabase-session endnu');
  } catch (error) {
    add('Session', false, error.message);
  }

  if (session?.userId) {
    try {
      const { error } = await client.from('profiles').select('id,email,full_name').limit(1);
      add('Profilforespørgsel', !error, error ? error.message : 'OK');
    } catch (error) {
      add('Profilforespørgsel', false, error.message);
    }
  }

  return checks;
}

function restSupabaseStorageKey(url) {
  return `roadlog:restSupabaseSession:${url}`;
}

function createRestSupabaseClient(config) {
  const sessionKey = restSupabaseStorageKey(config.url);
  const readSession = () => {
    try { return JSON.parse(localStorage.getItem(sessionKey)); } catch { return null; }
  };
  const saveSession = value => {
    if (value) localStorage.setItem(sessionKey, JSON.stringify(value));
    else localStorage.removeItem(sessionKey);
  };
  const authHeaders = (sessionValue = readSession()) => ({
    apikey: config.anonKey,
    Authorization: `Bearer ${sessionValue?.access_token || config.anonKey}`,
  });
  const jsonHeaders = sessionValue => ({
    ...authHeaders(sessionValue),
    'Content-Type': 'application/json',
  });
  const parseJsonResponse = async response => {
    const body = await response.text();
    let data = null;
    if (body) {
      try {
        data = JSON.parse(body);
      } catch {
        data = body;
      }
    }
    if (!response.ok) return { data: null, error: { message: data?.msg || data?.message || body || `HTTP ${response.status}`, status: response.status } };
    return { data, error: null };
  };
  const normalizeAuthSession = data => data?.access_token ? {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    user: data.user,
  } : null;

  class RestQuery {
    constructor(table) {
      this.table = table;
      this.params = new URLSearchParams();
      this.headers = {};
      this.method = 'GET';
      this.body = null;
      this.single = false;
    }
    select(columns = '*') {
      this.params.set('select', columns);
      if (this.method === 'POST') this.headers.Prefer = `${this.headers.Prefer ? `${this.headers.Prefer},` : ''}return=representation`;
      return this;
    }
    eq(column, value) {
      this.params.set(column, `eq.${value}`);
      return this;
    }
    order(column, options = {}) {
      this.params.set('order', `${column}.${options.ascending === false ? 'desc' : 'asc'}`);
      return this;
    }
    limit(value) {
      this.params.set('limit', String(value));
      return this;
    }
    maybeSingle() {
      this.single = true;
      return this.execute();
    }
    insert(row) {
      this.method = 'POST';
      this.body = row;
      this.headers.Prefer = 'return=representation';
      return this;
    }
    upsert(row) {
      this.method = 'POST';
      this.body = row;
      this.headers.Prefer = 'resolution=merge-duplicates,return=representation';
      return this;
    }
    update(row) {
      this.method = 'PATCH';
      this.body = row;
      this.headers.Prefer = 'return=representation';
      return this;
    }
    delete() {
      this.method = 'DELETE';
      this.headers.Prefer = 'return=representation';
      return this;
    }
    async execute() {
      const query = this.params.toString();
      const response = await fetch(`${config.url}/rest/v1/${this.table}${query ? `?${query}` : ''}`, {
        method: this.method,
        headers: { ...jsonHeaders(), ...this.headers },
        body: this.body ? JSON.stringify(this.body) : undefined,
      });
      const result = await parseJsonResponse(response);
      if (result.error) return result;
      if (this.single) return { data: Array.isArray(result.data) ? result.data[0] || null : result.data, error: null };
      return result;
    }
    then(resolve, reject) {
      return this.execute().then(resolve, reject);
    }
  }

  return {
    __fallbackRest: true,
    auth: {
      async getSession() {
        const sessionValue = readSession();
        return { data: { session: sessionValue }, error: null };
      },
      async signInWithPassword({ email, password }) {
        const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: jsonHeaders(null),
          body: JSON.stringify({ email, password }),
        });
        const result = await parseJsonResponse(response);
        if (result.error) return result;
        const authSession = normalizeAuthSession(result.data);
        saveSession(authSession);
        return { data: { session: authSession, user: authSession?.user }, error: null };
      },
      async signUp({ email, password, options }) {
        const response = await fetch(`${config.url}/auth/v1/signup`, {
          method: 'POST',
          headers: jsonHeaders(null),
          body: JSON.stringify({
            email,
            password,
            data: options?.data || {},
            redirect_to: options?.emailRedirectTo || officialAppUrl(),
          }),
        });
        const result = await parseJsonResponse(response);
        if (result.error) return result;
        const authSession = normalizeAuthSession(result.data);
        if (authSession) saveSession(authSession);
        return { data: { session: authSession, user: result.data?.user || authSession?.user }, error: null };
      },
      async resend({ type, email, options }) {
        const response = await fetch(`${config.url}/auth/v1/resend`, {
          method: 'POST',
          headers: jsonHeaders(null),
          body: JSON.stringify({
            type,
            email,
            options: options?.emailRedirectTo ? { email_redirect_to: options.emailRedirectTo } : undefined,
          }),
        });
        return parseJsonResponse(response);
      },
      async updateUser(attributes) {
        const sessionValue = readSession();
        const response = await fetch(`${config.url}/auth/v1/user`, {
          method: 'PUT',
          headers: jsonHeaders(sessionValue),
          body: JSON.stringify(attributes || {}),
        });
        const result = await parseJsonResponse(response);
        if (result.error) return result;
        if (result.data?.user && sessionValue) saveSession({ ...sessionValue, user: result.data.user });
        return { data: { user: result.data?.user || sessionValue?.user }, error: null };
      },
      async signOut() {
        saveSession(null);
        return { error: null };
      },
    },
    from(table) {
      return new RestQuery(table);
    },
    async rpc(name, args) {
      const response = await fetch(`${config.url}/rest/v1/rpc/${name}`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(args || {}),
      });
      return parseJsonResponse(response);
    },
    storage: {
      from(bucket) {
        return {
          async upload(path, file) {
            const response = await fetch(`${config.url}/storage/v1/object/${bucket}/${path}`, {
              method: 'POST',
              headers: authHeaders(),
              body: file,
            });
            const result = await parseJsonResponse(response);
            return result.error ? result : { data: { path }, error: null };
          },
          async createSignedUrl(path, expiresIn = 600) {
            const response = await fetch(`${config.url}/storage/v1/object/sign/${bucket}/${path}`, {
              method: 'POST',
              headers: jsonHeaders(),
              body: JSON.stringify({ expiresIn }),
            });
            const result = await parseJsonResponse(response);
            if (result.error) return result;
            const signedUrl = result.data?.signedURL || result.data?.signedUrl || '';
            return { data: { signedUrl: signedUrl.startsWith('http') ? signedUrl : `${config.url}/storage/v1${signedUrl}` }, error: null };
          },
        };
      },
    },
  };
}

function getSupabaseClient() {
  const status = supabaseStatus();
  if (!status.ready) return null;
  const config = supabaseConfig();
  if (!supabaseClientInstance) {
    supabaseClientInstance = window.supabase?.createClient
      ? window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
      : createRestSupabaseClient(config);
  }
  return supabaseClientInstance;
}

function onlineBackendActive() {
  return Boolean(getSupabaseClient());
}

function isSupportedImageFile(file) {
  if (globalThis.XpressIntraMedia?.isSupportedImageFile) {
    return globalThis.XpressIntraMedia.isSupportedImageFile(file, SUPPORTED_IMAGE_TYPES);
  }
  if (!file || !file.type?.startsWith('image/')) return false;
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

function fileToDataUrl(file) {
  if (globalThis.XpressIntraMedia?.fileToDataUrl) {
    return globalThis.XpressIntraMedia.fileToDataUrl(file);
  }
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve({ src: reader.result, name: file.name, type: file.type, size: file.size }));
    reader.addEventListener('error', () => resolve(null));
    reader.readAsDataURL(file);
  });
}

function resizeImageFile(file, options = {}) {
  if (globalThis.XpressIntraMedia?.resizeImageFile) {
    return globalThis.XpressIntraMedia.resizeImageFile(file, {
      maxDimension: PROFILE_PHOTO_MAX_DIMENSION,
      quality: PROFILE_PHOTO_QUALITY,
      ...options,
    });
  }
  if (typeof Image === 'undefined' || typeof document?.createElement !== 'function') return fileToDataUrl(file);
  if (file.type === 'image/gif') return fileToDataUrl(file);
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('error', () => resolve(null));
    reader.addEventListener('load', () => {
      const image = new Image();
      image.addEventListener('error', () => resolve(null));
      image.addEventListener('load', () => {
        const maxDimension = options.maxDimension || PROFILE_PHOTO_MAX_DIMENSION;
        const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement('canvas');
        if (!canvas?.getContext) {
          resolve({ src: reader.result, name: file.name, type: file.type, size: file.size });
          return;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const src = canvas.toDataURL(type, options.quality || PROFILE_PHOTO_QUALITY);
        resolve({ src, name: file.name, type, size: Math.round((src.length * 3) / 4), originalSize: file.size });
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

function legacyReadImageFile(file) {
  if (!coreSettings.media) {
    showToast('Billeder er midlertidigt slået fra af chef/admin');
    return Promise.resolve(null);
  }
  if (!file || !file.type?.startsWith('image/')) return Promise.resolve(null);
  if (file.size > 2 * 1024 * 1024) {
    showToast('Billedet er for stort i demoen. Vælg max 2 MB.');
    return Promise.resolve(null);
  }
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve({ src: reader.result, name: file.name, type: file.type, size: file.size }));
    reader.addEventListener('error', () => resolve(null));
    reader.readAsDataURL(file);
  });
}

async function readImageFile(file, options = {}) {
  if (!coreSettings.media) {
    showToast('Billeder er midlertidigt slået fra af chef/admin');
    return null;
  }
  if (!file || !file.size) return null;
  if (!isSupportedImageFile(file)) {
    showToast('Vælg et billede som JPG, PNG, WebP eller GIF');
    return null;
  }
  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    showToast('Billedet er for stort. Vælg max 10 MB.');
    return null;
  }
  if (options.kind === 'profile') {
    const resized = await resizeImageFile(file, { maxDimension: PROFILE_PHOTO_MAX_DIMENSION, quality: PROFILE_PHOTO_QUALITY });
    if (resized) return resized;
  }
  return fileToDataUrl(file);
}

function normalizeMessage(message) {
  const raw = Array.isArray(message)
    ? { side: message[0], body: message[1], time: message[2] }
    : { ...message };
  const sender = messageSender(raw);
  return {
    side: raw.side || (raw.senderId === session?.userId ? 'me' : 'them'),
    body: raw.body || '',
    time: raw.time || '',
    createdAt: raw.createdAt || raw.created_at || null,
    image: raw.image || null,
    senderId: raw.senderId || sender.id,
    senderName: raw.senderName || sender.name,
    senderInitials: raw.senderInitials || sender.initials,
    senderRole: raw.senderRole || sender.role,
    senderVehicle: raw.senderVehicle || sender.truck,
  };
}

let employees = stored('employees') || (DEMO_MODE ? clone(seedEmployees) : []);
let chats = stored('chats') || (DEMO_MODE ? clone(seedChats) : []);
let messages = stored('messages') || (DEMO_MODE ? clone(seedMessages) : {});
let announcements = stored('announcements') || (DEMO_MODE ? clone(seedAnnouncements) : []);
let vehicles = stored('vehicles') || (DEMO_MODE ? clone(seedVehicles) : []);
let notifications = stored('notifications') || (DEMO_MODE ? clone(seedNotifications) : []);
let dataRequests = stored('dataRequests') || [];
let supportRequests = stored('supportRequests') || [];
let adminAuditEvents = stored('adminAuditEvents') || [];
let feedLikes = stored('feedLikes') || {};
let appUpdateState = stored(UPDATE_CONFIG_KEY) || { lastCheckedAt: null, latest: null, required: null, lastError: null, dismissedVersionCode: null };
let notificationPrefs = { ...defaultNotificationPrefs, ...stored('notificationPrefs') };
let workdayPrivacy = {
  gps: true,
  logbook: true,
  notifications: true,
  audience: 'all',
  showSpeed: false,
  showVehicle: true,
  showStatus: true,
  ...stored('workdayPrivacy'),
};
let coreSettings = stored('coreSettings') || { gps: true, logbook: true, media: true, employeePosts: true, ruleApproval: true };
let legalAcceptance = stored('legalAcceptance') || null;
let workday = stored('workday') || {
  active: false,
  startedAt: null,
  endsAt: null,
  permissions: { gps: true, logbook: true, notifications: true },
};
const initialTab = (() => {
  try {
    const tab = new URL(window.location.href).searchParams.get('tab');
    return ['home', 'work', 'team', 'map', 'chat', 'more', 'info'].includes(tab) ? tab : 'home';
  } catch {
    return 'home';
  }
})();
let activeTab = initialTab;
let activeChat = null;
let teamQuery = '';
let infoQuery = '';
let globalQuery = '';
let chatQuery = '';
let activeInfoCategory = 'all';
let infoFavorites = stored('infoFavorites') || [];
let session = hasSupabaseConfigForMode && !DEMO_MODE ? null : stored('session');
let pendingStandardSignupEmail = '';
let pendingStandardSignupInvitationId = '';
let creatorRoleTester = stored('creatorRoleTester') || { active: false, originalProfile: null, currentRole: null };
let profile = stored('profile') || (DEMO_MODE ? { name: 'Tommy Hansen', phone: '+45 22 44 18 90', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck', truck: 'TR 42 918', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis', emergencyContact: 'Anne · +45 22 11 90 90', languages: 'Dansk, engelsk, tysk', logbook: true } : clone(productionProfile));
let location = { sharing: false, demo: false, speed: 0, points: 0, watchId: null, timer: null, coords: null, startedAt: null, expiresAt: null, lastUpdatedAt: null, shareMode: null };
let activePickup = stored('activePickup');
let pickupHistory = stored('pickupHistory') || [];
let mapZoom = 1;
let mapFilter = stored('mapFilter') || 'all';
let logEntries = stored('logEntries') || (DEMO_MODE ? [
  { place: 'Flensburg', note: 'God kaffe og en rolig pause ved grænsen.', date: '28. maj' },
  { place: 'Hamburg', note: 'Solnedgang ved havnen efter aflæsning.', date: '25. maj' },
] : []);
let logbookDrafts = stored('logbookDrafts') || [];
let logbookAutomation = {
  smartLogbook: true,
  autoDrafts: true,
  autoPlace: true,
  autoStops: true,
  autoPickup: true,
  autoVehicle: true,
  autoMilestones: false,
  ...stored('logbookAutomation'),
};

if (DEMO_MODE) {
  for (const seedEmployee of seedEmployees) {
    const employee = employees.find(item => item.id === seedEmployee.id);
    if (employee && !employee.vehicleType) employee.vehicleType = seedEmployee.vehicleType;
    if (employee) {
      Object.entries(seedEmployee).forEach(([key, value]) => {
        if (employee[key] === undefined) employee[key] = value;
      });
    }
    if (!employee) employees.push(clone(seedEmployee));
  }
  for (const seedChat of seedChats) {
    if (!chats.some(chat => chat.id === seedChat.id)) chats.push(clone(seedChat));
  }
  for (const [chatId, seedThread] of Object.entries(seedMessages)) {
    if (!messages[chatId]) messages[chatId] = clone(seedThread);
  }
}
if (!profile.vehicleType) profile.vehicleType = 'truck';
if (!profile.accessRole) profile.accessRole = 'employee';
if ((profile.email === 'stralner2711@gmail.com' || (DEMO_MODE && profile.name === 'Tommy Hansen')) && !creatorRoleTester.active) {
  profile = {
    ...profile,
    email: 'stralner2711@gmail.com',
    role: 'Appansvarlig · Lastbilchauffør',
    accessRole: 'owner',
    vehicleType: 'truck',
    truck: profile.truck && profile.truck !== 'Ledelse' && profile.truck !== 'Kontoret' ? profile.truck : 'TR 42 918',
    department: 'Lastbil',
    license: profile.license || 'C/E · EU kvalifikationsbevis',
  };
}
announcements = announcements.map((item, index) => ({
  id: item.id || `post-${index}-${item.title.toLowerCase().replace(/\W+/g, '-')}`,
  initials: item.initials || (item.author || 'Kollega').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(),
  audience: item.audience || 'Alle medarbejdere',
  likes: item.likes || 0,
  comments: item.comments || [],
  ...item,
}));
save('employees', employees);
save('chats', chats);
save('messages', messages);
save('announcements', announcements);
save('vehicles', vehicles);
save('notifications', notifications);
save('dataRequests', dataRequests);
save('supportRequests', supportRequests);
save('profile', profile);

function icon(name, className = '') {
  return `<span class="icon ${className}">${icons[name] || icons.info}</span>`;
}

function brandLogo() {
  return `<span class="brand-lockup"><img class="brand-logo" src="/xpressbudet-logo-transparent.png?v=46" alt="XpressBudet A/S" /></span>`;
}

function renderLaunchSplash() {
  return `<section class="launch-splash" aria-label="XpressIntra starter">
    <div class="launch-skyline" aria-hidden="true"></div>
    <div class="launch-road">
      <span></span><span></span><span></span>
    </div>
    <div class="launch-core">
      <span class="launch-ring"></span>
      <span class="launch-ring launch-ring-two"></span>
      <img src="/xpressbudet-logo-transparent.png?v=50" alt="XpressBudet" />
    </div>
    <div class="launch-fleet" aria-hidden="true">
      <span class="launch-vehicle launch-truck">
        <b class="cab"></b><b class="box"></b><i></i><i></i><em></em>
      </span>
      <span class="launch-vehicle launch-lift">
        <b class="cab"></b><b class="box"></b><i></i><i></i><em></em>
      </span>
      <span class="launch-vehicle launch-van">
        <b class="cab"></b><b class="box"></b><i></i><i></i><em></em>
      </span>
    </div>
    <div class="launch-title">
      <small>XpressBudet præsenterer</small>
      <h1>Xpress<span>Intra</span></h1>
      <p>Indlæser ruter, køretøjer og dagens drift</p>
    </div>
    <div class="launch-status">
      <span>Chauffører</span>
      <span>Kontor</span>
      <span>Live drift</span>
    </div>
  </section>`;
}

function ensureLaunchSplash() {
  if (!launchSplashVisible || document.querySelector('.launch-splash')) return;
  document.body.insertAdjacentHTML('beforeend', renderLaunchSplash());
}

function scheduleLaunchSplashExit() {
  if (!launchSplashVisible || launchSplashScheduled) return;
  launchSplashScheduled = true;
  window.setTimeout(() => {
    launchSplashVisible = false;
    sessionStorage.setItem('xpressintra:launchSplashSeen', '1');
    document.querySelector('.launch-splash')?.classList.add('hide');
    window.setTimeout(() => document.querySelector('.launch-splash')?.remove(), 560);
  }, 5000);
}

function avatar(employee, className = '') {
  const photo = employee?.photo || (employee?.id === 'th' ? profile.photo : null);
  const initials = employee?.initials || initialsFromName(employee?.name || profile.name || 'Medarbejder');
  return `<span class="person-avatar ${employee?.online ? 'is-online' : ''} ${className}">${photo ? `<img src="${text(photo.src)}" alt="${text(employee?.name || 'Profil')}" />` : text(initials)}</span>`;
}

function showToast(text) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    document.body.insertAdjacentHTML('beforeend', '<div class="toast"></div>');
    toast = document.querySelector('.toast');
  }
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function systemNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission || 'default';
}

function systemNotificationStatus() {
  const permission = systemNotificationPermission();
  if (permission === 'granted' && notificationPrefs.system) return { label: 'Til', detail: 'Telefonen kan vise beskeder fra XpressIntra.' };
  if (permission === 'granted') return { label: 'Klar', detail: 'Tilladelse er givet. Slå systembeskeder til herunder.' };
  if (permission === 'denied') return { label: 'Blokeret', detail: 'Tilladelse er blokeret i telefonens eller browserens indstillinger.' };
  if (permission === 'unsupported') return { label: 'Ikke understøttet', detail: 'Denne browser kan ikke vise systembeskeder.' };
  return { label: 'Ikke aktiveret', detail: 'Tryk aktiver for at få besked ved nye chatbeskeder.' };
}

function isQuietHoursNow() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6;
}

function shouldShowSystemNotification(notification = {}) {
  if (!notificationPrefs.system || !workdayPrivacy.notifications) return false;
  if (systemNotificationPermission() !== 'granted') return false;
  if (!shouldKeepNotification(notification)) return false;
  if (notificationPrefs.quietHours && isQuietHoursNow() && notification.level !== 'urgent') return false;
  return true;
}

function safeSystemNotificationBody(notification = {}) {
  if (notificationCategory(notification) === 'chat') return 'Åbn XpressIntra for at læse beskeden.';
  return notification.body || 'Åbn XpressIntra for detaljer.';
}

function notificationTargetUrl(notification = {}) {
  const tab = notification.chatId ? 'chat' : 'more';
  const url = new URL('./', window.location.href);
  url.searchParams.set('tab', tab);
  if (notification.chatId) url.searchParams.set('chat', notification.chatId);
  return url.toString();
}

async function showSystemNotification(notification = {}) {
  if (!shouldShowSystemNotification(notification)) return false;
  const title = notification.title || 'Ny besked i XpressIntra';
  const options = {
    body: safeSystemNotificationBody(notification),
    badge: './xpressbudet-logo-transparent.png',
    icon: './xpressbudet-logo-transparent.png',
    tag: notification.tag || notification.chatId || notification.id || 'xpressintra',
    renotify: Boolean(notification.level === 'urgent'),
    data: { url: notificationTargetUrl(notification) },
  };
  try {
    const registration = await navigator.serviceWorker?.ready;
    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return true;
    }
  } catch {}
  try {
    if (typeof Notification !== 'undefined') {
      const systemNotice = new Notification(title, options);
      systemNotice.onclick = () => window.focus?.();
      return true;
    }
  } catch {}
  return false;
}

async function requestSystemNotifications() {
  if (typeof Notification === 'undefined') {
    showToast('Denne browser kan ikke vise systembeskeder');
    return false;
  }
  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;
  if (permission !== 'granted') {
    notificationPrefs.system = false;
    save('notificationPrefs', notificationPrefs);
    showToast(permission === 'denied' ? 'Systembeskeder er blokeret i telefonen' : 'Systembeskeder blev ikke aktiveret');
    return false;
  }
  notificationPrefs.system = true;
  save('notificationPrefs', notificationPrefs);
  if (onlineBackendActive()) {
    syncSupabaseNotificationPrefs().catch(error => showToast(`Valget er gemt lokalt, men ikke online: ${error.message}`));
  }
  showToast('Systembeskeder er slået til');
  await showSystemNotification({
    id: 'notification-test',
    type: 'XpressIntra',
    title: 'Systembeskeder er klar',
    body: 'Du får nu besked ved nye chatbeskeder, når appen er åben eller ligger i baggrunden.',
    level: 'office',
  });
  return true;
}

function saveAppUpdateState() {
  save(UPDATE_CONFIG_KEY, appUpdateState);
}

function isPlaceholderUpdateConfig() {
  const versionUrl = String(appUpdateConfig.versionUrl || '').toLowerCase();
  const officialRepo = String(appUpdateConfig.officialRepo || '').toLowerCase();
  return versionUrl.includes('your-username')
    || officialRepo.includes('your-username')
    || versionUrl.includes('example.com')
    || officialRepo.includes('example.com');
}

function isAllowedUpdateUrl(url) {
  if (globalThis.XpressIntraUpdateSystem?.isAllowedUpdateUrl) {
    return globalThis.XpressIntraUpdateSystem.isAllowedUpdateUrl(url, {
      currentHref: window.location.href,
      currentOrigin: window.location.origin,
      officialRepo: appUpdateConfig.officialRepo || defaultUpdateConfig.officialRepo,
    });
  }
  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.origin === window.location.origin) return true;
    const repo = new URL(appUpdateConfig.officialRepo || defaultUpdateConfig.officialRepo);
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

function normalizeVersionInfo(raw) {
  if (globalThis.XpressIntraUpdateSystem?.normalizeVersionInfo) {
    return globalThis.XpressIntraUpdateSystem.normalizeVersionInfo(raw, {
      currentHref: window.location.href,
      currentOrigin: window.location.origin,
      officialRepo: appUpdateConfig.officialRepo || defaultUpdateConfig.officialRepo,
    });
  }
  if (!raw || typeof raw !== 'object') throw new Error('version.json er ikke gyldig');
  const activeVersionCode = Number(raw.activeVersionCode);
  if (!Number.isFinite(activeVersionCode) || activeVersionCode <= 0) throw new Error('activeVersionCode mangler');
  const apkDownloadUrl = String(raw.apkDownloadUrl || '').trim();
  const releasePageUrl = String(raw.releasePageUrl || '').trim();
  if (!apkDownloadUrl || !isAllowedUpdateUrl(apkDownloadUrl)) throw new Error('APK-linket er ikke fra godkendt GitHub-kilde');
  if (releasePageUrl && !isAllowedUpdateUrl(releasePageUrl)) throw new Error('Release-linket er ikke fra godkendt GitHub-kilde');
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

function stableRollbackUrl(info = appUpdateState.latest) {
  if (globalThis.XpressIntraUpdateSystem?.stableRollbackUrl) {
    return globalThis.XpressIntraUpdateSystem.stableRollbackUrl(info, {
      appVersionCode: APP_VERSION_CODE,
      isAllowedUpdateUrl,
    });
  }
  if (!info) return '';
  const candidates = [
    info.stableApkDownloadUrl,
    info.previousStableApkDownloadUrl,
    info.activeVersionCode < APP_VERSION_CODE ? info.apkDownloadUrl : '',
  ].filter(Boolean);
  return candidates.find(url => isAllowedUpdateUrl(url)) || '';
}

function rollbackReadiness(info = appUpdateState.latest) {
  if (globalThis.XpressIntraUpdateSystem?.rollbackReadiness) {
    return globalThis.XpressIntraUpdateSystem.rollbackReadiness(info, {
      appVersionCode: APP_VERSION_CODE,
      appDisplayVersion: APP_DISPLAY_VERSION,
      isAllowedUpdateUrl,
    });
  }
  const stableUrl = stableRollbackUrl(info);
  const hasPrevious = Boolean(info?.previousStableVersion || info?.stableVersion);
  const currentMarked = Array.isArray(info?.defectiveVersions)
    && info.defectiveVersions.some(version => String(version) === APP_DISPLAY_VERSION || Number(version) === APP_VERSION_CODE);
  const recommended = Boolean(info?.rollbackReason || info?.activeVersionCode < APP_VERSION_CODE || currentMarked);
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

function updateStatusLabel(info = appUpdateState.latest) {
  if (globalThis.XpressIntraUpdateSystem?.updateStatusLabel) {
    return globalThis.XpressIntraUpdateSystem.updateStatusLabel(info, {
      appVersionCode: APP_VERSION_CODE,
    });
  }
  if (!info) return 'Ikke tjekket endnu';
  if (info.activeVersionCode > APP_VERSION_CODE) return info.forceUpdate ? 'Kritisk opdatering' : 'Ny opdatering';
  if (info.activeVersionCode < APP_VERSION_CODE) return 'Rollback anbefalet';
  return 'Appen er opdateret';
}

function shouldShowUpdate(info, manual = false) {
  if (globalThis.XpressIntraUpdateSystem?.shouldShowUpdate) {
    return globalThis.XpressIntraUpdateSystem.shouldShowUpdate(info, {
      appVersionCode: APP_VERSION_CODE,
      dismissedVersionCode: appUpdateState.dismissedVersionCode,
      manual,
    });
  }
  if (!info) return false;
  if (info.forceUpdate && info.activeVersionCode !== APP_VERSION_CODE) return true;
  if (info.activeVersionCode > APP_VERSION_CODE) return manual || appUpdateState.dismissedVersionCode !== info.activeVersionCode;
  if (info.activeVersionCode < APP_VERSION_CODE && info.rollbackReason) return true;
  return false;
}

async function fetchVersionInfo() {
  const urls = [appUpdateConfig.versionUrl || './version.json'];
  if (appUpdateConfig.allowLocalVersionFallback && !urls.includes('./version.json')) urls.push('./version.json');
  let lastError = null;
  for (const url of urls) {
    try {
      if (!isAllowedUpdateUrl(url)) throw new Error('version.json ligger ikke på en godkendt kilde');
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Kunne ikke hente version.json (${response.status})`);
      return normalizeVersionInfo(await response.json());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Opdateringstjek fejlede');
}

async function checkForAppUpdate({ manual = false, silent = false } = {}) {
  try {
    const info = await fetchVersionInfo();
    appUpdateState = { ...appUpdateState, latest: info, lastCheckedAt: new Date().toISOString(), lastError: null };
    if (info.forceUpdate && info.activeVersionCode !== APP_VERSION_CODE) appUpdateState.required = info;
    else if (appUpdateState.required?.activeVersionCode === APP_VERSION_CODE) appUpdateState.required = null;
    saveAppUpdateState();
    if (shouldShowUpdate(info, manual)) openAppUpdateModal(info, { force: info.forceUpdate || info.activeVersionCode < APP_VERSION_CODE });
    else if (manual) showToast('Appen er opdateret');
    return info;
  } catch (error) {
    appUpdateState = { ...appUpdateState, lastCheckedAt: new Date().toISOString(), lastError: error.message };
    saveAppUpdateState();
    if (appUpdateState.required && appUpdateState.required.activeVersionCode !== APP_VERSION_CODE) {
      openAppUpdateModal(appUpdateState.required, { force: true, offline: true });
      return appUpdateState.required;
    }
    if (manual || !silent) showToast(isCreatorOwner() ? `Opdateringstjek fejlede: ${error.message}` : 'Opdateringstjek fejlede. Appen fortsætter normalt.');
    return null;
  }
}

function openExternalUpdateLink(url) {
  if (!url || !isAllowedUpdateUrl(url)) {
    showToast('Downloadlinket er ikke godkendt');
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function installAppUpdate(url) {
  if (!url || !isAllowedUpdateUrl(url)) {
    showToast('Downloadlinket er ikke godkendt');
    return;
  }

  const updateInstaller = window.Capacitor?.Plugins?.UpdateInstaller;
  if (!updateInstaller?.install) {
    openExternalUpdateLink(url);
    return;
  }

  showToast('Henter opdatering...');
  try {
    const result = await updateInstaller.install({ url });
    if (result?.needsPermission) {
      showToast('Slå "Tillad fra denne kilde" til og tryk Opdater igen');
    } else {
      showToast('Åbner Android-installation...');
    }
  } catch (error) {
    showToast(`Kunne ikke starte opdatering: ${error.message || error}`);
    openExternalUpdateLink(url);
  }
}

function openAppUpdateModal(info = appUpdateState.latest, options = {}) {
  if (!info) {
    showToast('Der er ingen versionsdata endnu');
    return;
  }
  document.querySelector('.modal-backdrop')?.remove();
  const force = Boolean(options.force || info.forceUpdate || appUpdateState.required);
  const rollback = info.activeVersionCode < APP_VERSION_CODE || Boolean(info.rollbackReason);
  const title = rollback ? 'Skift til stabil version' : force ? 'Vigtig opdatering klar' : 'Ny version klar';
  const subtitle = rollback
    ? 'Vi anbefaler den stabile version, så appen kører roligt igen.'
    : force
      ? 'Den nye version retter vigtige ting og holder alle på samme app.'
      : 'Der er en forbedret version af XpressIntra klar til dig.';
  const actionLabel = rollback ? 'Installer stabil version' : force ? 'Opdater XpressIntra' : 'Opdater nu';
  const badge = rollback ? 'Stabil version' : force ? 'Anbefalet nu' : 'Ny opdatering';
  const changelog = info.changelog.length
    ? info.changelog.map(item => `<li>${text(item)}</li>`).join('')
    : '<li>Små forbedringer og opdateret stabilitet.</li>';
  const modal = document.createElement('div');
  modal.className = `modal-backdrop ${force ? 'force-update' : ''}`;
  modal.innerHTML = `<section class="profile-modal update-modal update-modal-pro">
    ${force ? '' : `<button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>`}
    <section class="update-hero">
      <span class="update-hero-icon">${icon('download')}</span>
      <div>
        <p class="eyebrow">${badge}</p>
        <h3>${title}</h3>
        <small>${subtitle}</small>
      </div>
    </section>
    <p class="update-reassurance">Det tager normalt kun et øjeblik. Dine beskeder, profil og indstillinger bliver liggende.</p>
    <section class="update-version-card">
      <span><b>Installeret</b><strong>${text(APP_DISPLAY_VERSION)}</strong><small>Build ${APP_VERSION_CODE}</small></span>
      <span><b>Aktiv</b><strong>${text(info.activeVersion)}</strong><small>Build ${info.activeVersionCode}</small></span>
    </section>
    ${options.offline ? '<p class="update-warning">Appen kunne ikke hente ny versionsfil, men en tidligere kendt tvangsopdatering er stadig aktiv.</p>' : ''}
    ${rollback && info.rollbackReason ? `<p class="update-warning"><b>Årsag:</b> ${text(info.rollbackReason)}</p>` : ''}
    <section class="update-quick-guide">
      <span><b>Android</b><small>Tryk opdater, installer APK'en og åbn XpressIntra igen.</small></span>
      <span><b>iPhone</b><small>Åbn webappen fra hjemmeskærmen. Safari henter automatisk den nyeste webversion.</small></span>
    </section>
    <section class="update-changelog">
      <h4>Det får du med</h4>
      <ul>${changelog}</ul>
    </section>
    ${isPlaceholderUpdateConfig() ? '<p class="update-warning">Creator: GitHub-placeholderen skal skiftes til det rigtige repository, før medarbejdere bruger opdateringslinket.</p>' : ''}
    <p class="update-helper"><b>Rolig opdatering:</b> Appen forklarer kun det vigtige. Android kan stadig vise Google Play Protect, fordi appen er intern og ikke fra Play Butik.</p>
    <details class="install-help">
      <summary>Hjælp til Google Play Protect og installation</summary>
      <div>
        <span><b>1</b><strong>Tryk fortsæt eller installer</strong><small>Android kan vise en sikkerhedsboks, fordi appen er en intern APK og ikke fra Play Butik.</small></span>
        <span><b>2</b><strong>Tillad XpressIntra første gang</strong><small>Hvis telefonen spørger om ukendte apps, vælg indstillinger og tillad installation fra XpressIntra.</small></span>
        <span><b>3</b><strong>Åbn appen igen</strong><small>Når installationen er færdig, åbner du XpressIntra og logger ind som normalt.</small></span>
      </div>
    </details>
    <div class="update-actions">
      <button type="button" data-action="install-update">${actionLabel}</button>
      ${force ? '' : '<button type="button" class="secondary" data-action="dismiss-update">Senere</button>'}
    </div>
  </section>`;
  document.body.append(modal);
}

function markCurrentVersionSuspect() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan markere en version som mistænkt');
    return;
  }
  const fallbackInfo = {
    activeVersion: APP_DISPLAY_VERSION,
    activeVersionCode: APP_VERSION_CODE,
    apkDownloadUrl: 'https://github.com/stralner2711-a11y/xpresshub/releases/download/v1.3.23/xpressintra.apk',
  };
  const info = appUpdateState.latest || normalizeVersionInfo(fallbackInfo);
  const defective = new Set([...(info.defectiveVersions || []).map(String), APP_DISPLAY_VERSION, String(APP_VERSION_CODE)]);
  appUpdateState.latest = {
    ...info,
    defectiveVersions: [...defective],
    rollbackReason: info.rollbackReason || 'Creator har markeret den installerede version til ekstra kontrol.',
  };
  saveAppUpdateState();
  recordAdminAudit('Version markeret til kontrol', `${APP_DISPLAY_VERSION} · build ${APP_VERSION_CODE}`);
  document.querySelector('.modal-backdrop')?.remove();
  openRollbackCenterModal();
  showToast('Versionen er markeret til kontrol lokalt');
}

async function installStableRollbackVersion() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan starte rollback');
    return;
  }
  const checkbox = document.querySelector('.rollback-confirm input[name="rollbackConfirm"]');
  if (checkbox && !checkbox.checked) {
    showToast('Bekræft først at du forstår rollback');
    return;
  }
  const info = appUpdateState.latest;
  const stableUrl = stableRollbackUrl(info);
  if (!stableUrl) {
    showToast('Der mangler et godkendt link til stabil APK i version.json');
    return;
  }
  recordAdminAudit('Rollback startet', `${APP_DISPLAY_VERSION} -> ${info?.stableVersion || info?.previousStableVersion || 'stabil version'}`);
  await installAppUpdate(stableUrl);
}

function openRollbackCenterModal() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan åbne rollback-center');
    return;
  }
  const info = appUpdateState.latest;
  const rollback = rollbackReadiness(info);
  const stableLabel = info ? `${info.stableVersion || info.previousStableVersion || 'Ukendt'} · build ${info.stableVersionCode || 'ukendt'}` : 'Ikke hentet endnu';
  const previousLabel = info?.previousStableVersion || 'Ikke angivet';
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal rollback-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Creator / backup</p><h3>Gå tilbage til stabil version</h3>
    <section class="rollback-hero ${rollback.recommended ? 'risk' : 'ready'}">
      <span>${icon('download')}</span>
      <div><b>${text(rollback.label)}</b><small>${text(rollback.detail)}</small></div>
    </section>
    <section class="rollback-grid">
      <span><b>Installeret nu</b><strong>${text(APP_DISPLAY_VERSION)}</strong><small>Build ${APP_VERSION_CODE}</small></span>
      <span><b>Stabil version</b><strong>${text(stableLabel)}</strong><small>Sidste stabile: ${text(previousLabel)}</small></span>
      <span><b>Seneste tjek</b><strong>${appUpdateState.lastCheckedAt ? text(new Date(appUpdateState.lastCheckedAt).toLocaleString('da-DK')) : 'Ikke tjekket'}</strong><small>${text(appUpdateState.lastError || 'Ingen kendt fejl')}</small></span>
      <span><b>Data</b><strong>Beholdes</strong><small>Rollback sletter ikke profiler, chats, GPS, billeder eller logbog i Supabase.</small></span>
    </section>
    ${info?.rollbackReason ? `<p class="rollback-warning"><b>Årsag:</b> ${text(info.rollbackReason)}</p>` : ''}
    <section class="rollback-note">
      <b>Vigtigt før rollback</b>
      <span>Brug rollback når en appversion driller. Hvis fejlen skyldes manglende Supabase-tabeller eller forkert SQL, skal databasen repareres i stedet for kun at installere en ældre APK.</span>
    </section>
    <label class="rollback-confirm"><input type="checkbox" name="rollbackConfirm" /> <span>Jeg forstår at appen går tilbage til stabil version, men medarbejderdata beholdes.</span></label>
    <div class="rollback-actions">
      <button type="button" data-action="check-update">Tjek version</button>
      <button type="button" data-action="mark-current-version-suspect">Marker nuværende</button>
      <button type="button" data-action="install-stable-rollback" ${rollback.stableUrl ? '' : 'disabled'}>Installer stabil</button>
      <button type="button" data-action="open-download-page">Downloadside</button>
    </div>
  </section>`;
  document.body.append(modal);
}

function renderUpdateSummary() {
  const info = appUpdateState.latest;
  const rollback = rollbackReadiness(info);
  return `<section class="update-summary-card">
    <div>
      <b>App-opdateringer</b>
      <span>${text(updateStatusLabel(info))}</span>
      <small>Installeret ${text(APP_DISPLAY_VERSION)} · build ${APP_VERSION_CODE}${appUpdateState.lastCheckedAt ? ` · tjekket ${new Date(appUpdateState.lastCheckedAt).toLocaleString('da-DK')}` : ''}</small>
    </div>
    <div class="update-summary-actions">
      <button type="button" data-action="check-update">Tjek</button>
      ${info ? '<button type="button" data-action="show-update-status">Detaljer</button>' : ''}
      ${isCreatorOwner() ? '<button type="button" data-action="open-rollback-center">Backup</button>' : ''}
    </div>
    ${isCreatorOwner() ? `<em class="${rollback.recommended ? 'warn' : ''}">${text(rollback.label)} · ${text(rollback.detail)}</em>` : ''}
    ${isPlaceholderUpdateConfig() ? '<em>Husk: GitHub-placeholder skal skiftes.</em>' : ''}
    ${appUpdateState.lastError ? `<em class="warn">${text(appUpdateState.lastError)}</em>` : ''}
  </section>`;
}

function openUpdateStatusModal() {
  const info = appUpdateState.latest;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal update-status-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Creator / distribution</p><h3>Opdateringssystem</h3>
    ${renderUpdateSummary()}
    <section class="update-detail-list">
      <span><b>Version URL</b><small>${text(appUpdateConfig.versionUrl)}</small></span>
      <span><b>Officielt repository</b><small>${text(appUpdateConfig.officialRepo)}</small></span>
      <span><b>Seneste aktive version</b><small>${info ? `${text(info.activeVersion)} · build ${info.activeVersionCode}` : 'Ikke hentet endnu'}</small></span>
      <span><b>Stabil version</b><small>${info ? `${text(info.stableVersion)} · build ${info.stableVersionCode}` : 'Ikke hentet endnu'}</small></span>
      <span><b>Tvangsopdatering</b><small>${info?.forceUpdate ? 'Ja' : 'Nej'}</small></span>
      <span><b>Rollback</b><small>${info?.rollbackReason || 'Ingen aktiv rollback'}</small></span>
    </section>
    <div class="launch-actions">
      <button type="button" data-action="check-update">Tjek igen</button>
      <button type="button" data-action="open-download-page">Downloadside</button>
      <button type="button" data-action="open-version-json">version.json</button>
    </div>
  </section>`;
  document.body.append(modal);
}

function isMissingSupabaseTableError(error, tableName) {
  const message = String(error?.message || error?.details || error || '').toLowerCase();
  const code = String(error?.code || '').toUpperCase();
  return (
    message.includes(tableName.toLowerCase())
    && (message.includes('schema cache') || message.includes('could not find the table') || message.includes('relation') || code === 'PGRST205' || code === '42P01')
  );
}

function isMissingSupabaseColumnError(error, columnName) {
  const message = String(error?.message || error?.details || error || '').toLowerCase();
  const code = String(error?.code || '').toUpperCase();
  return message.includes(String(columnName).toLowerCase()) && (message.includes('column') || code === '42703' || code === 'PGRST204');
}

function handleLocationShareSchemaError(error) {
  if (!isMissingSupabaseTableError(error, 'location_shares')) return false;
  supabaseSchemaState.missingLocationShares = true;
  if (!supabaseSchemaState.locationWarningShown) {
    supabaseSchemaState.locationWarningShown = true;
    showToast('GPS er kun aktiv på denne telefon. Online-deling mangler opsætning i XpressIntra.');
  }
  return true;
}

function officialAppUrl() {
  const configured = String(appUpdateConfig.appUrl || '').trim();
  try {
    const url = new URL(configured || defaultUpdateConfig.appUrl);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return defaultUpdateConfig.appUrl;
  }
}

function inviteLink(employee, invitationId = '') {
  const url = new URL(officialAppUrl());
  const email = normalizeEmployeeEmail(employee?.email || employee?.invitationEmail || '');
  url.searchParams.set('invite', String(invitationId || employee?.invitationId || localInvitationId()).trim());
  if (email) url.searchParams.set('email', email);
  return url.toString();
}

function inviteMessage(employee, invitationId = '') {
  const invitationUrl = inviteLink(employee, invitationId || employee?.invitationId || '');
  const downloadUrl = employeeDownloadPageUrl();
  return {
    subject: 'XpressIntra konto',
    invitationUrl,
    downloadUrl,
    body: `Hej ${employee?.name || ''}\n\nDin XpressIntra-konto er klar.\n\nÅbn dit invitationslink her:\n${invitationUrl}\n\nDownloadside ved behov:\n${downloadUrl}\n\n1. Åbn invitationslinket.\n2. Brug standardkoden ${TEMPORARY_EMPLOYEE_PASSWORD}.\n3. Lav din egen personlige kode med det samme.\n\nHilsen XpressBudet`,
  };
}

function loginInviteContext() {
  try {
    const url = new URL(window.location.href);
    const invite = String(url.searchParams.get('invite') || '').trim();
    const email = normalizeEmployeeEmail(url.searchParams.get('email') || '');
    return { invite, email, valid: Boolean(invite && email) };
  } catch {
    return { invite: '', email: '', valid: false };
  }
}

function employeeDownloadPageUrl() {
  const url = appUpdateState.latest?.downloadPageUrl
    || 'https://stralner2711-a11y.github.io/xpresshub/download.html';
  return isAllowedUpdateUrl(url) ? url : 'https://stralner2711-a11y.github.io/xpresshub/download.html';
}

async function shareEmployeeInvite(employee, invitationId = '') {
  const { subject, body } = inviteMessage(employee, invitationId || employee.invitationId || '');
  if (navigator.share) {
    await navigator.share({ title: subject, text: body });
    return;
  }
  window.location.href = `mailto:${encodeURIComponent(employee.email || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function copyTextToClipboard(value, successMessage = 'Kopieret') {
  const textValue = String(value || '').trim();
  if (!textValue) {
    showToast('Der er ikke noget at kopiere');
    return false;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(textValue);
      showToast(successMessage);
      return true;
    }
  } catch {}
  const input = document.createElement('textarea');
  input.value = textValue;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.append(input);
  input.select();
  let copied = false;
  try {
    copied = document.execCommand?.('copy') || false;
  } catch {}
  input.remove();
  showToast(copied ? successMessage : 'Markér teksten og kopiér den manuelt');
  return copied;
}

function canAccessChat(chat) {
  if (globalThis.XpressIntraChat?.canAccessChat) {
    return globalThis.XpressIntraChat.canAccessChat(chat, profile, { searchable });
  }
  if (!chat?.channel) return true;
  return hasChannelAccess(chat.channel);
}

function visibleChats() {
  return chats.filter(canAccessChat);
}

function hasChannelAccess(channel) {
  if (globalThis.XpressIntraChat?.hasChannelAccess) {
    return globalThis.XpressIntraChat.hasChannelAccess(channel, profile, { searchable });
  }
  if (['admin', 'owner'].includes(profile.accessRole)) return true;
  if (channel === 'truck') return profile.vehicleType === 'truck';
  if (channel === 'van') return profile.vehicleType === 'van';
  return true;
}

function canReadAudience(audience = 'Alle medarbejdere') {
  if (globalThis.XpressIntraChat?.canReadAudience) {
    return globalThis.XpressIntraChat.canReadAudience(audience, profile, { searchable });
  }
  const normalized = audience.toLowerCase();
  if (normalized === 'all' || normalized.includes('alle')) return true;
  if (normalized === 'truck' || normalized.includes('lastbil')) return hasChannelAccess('truck');
  if (normalized === 'van' || normalized.includes('varebil')) return hasChannelAccess('van');
  return true;
}

function currentEmployee() {
  const currentId = session?.userId || 'th';
  const employee = employees.find(item => item.id === currentId) || employees.find(item => item.id === 'th') || employees[0];
  if (employee) {
    return {
      ...employee,
      name: profile.name || employee.name,
      initials: initialsFromName(profile.name || employee.name),
      role: profile.role || employee.role,
      accessRole: profile.accessRole || employee.accessRole,
      vehicleType: profile.vehicleType || employee.vehicleType,
      truck: profile.truck || employee.truck,
      department: profile.department || employee.department,
      license: profile.license || employee.license,
      phone: profile.phone || employee.phone,
      email: profile.email || employee.email,
      languages: profile.languages || employee.languages,
    };
  }
  return {
    id: currentId,
    name: profile.name || 'Medarbejder',
    initials: initialsFromName(profile.name || 'Medarbejder'),
    role: profile.role || 'Chauffør',
    accessRole: profile.accessRole || 'employee',
    vehicleType: profile.vehicleType || 'truck',
    truck: profile.truck || '',
    status: session ? 'Online' : 'Ikke logget ind',
    location: profile.department || '',
    phone: profile.phone || '',
    email: profile.email || session?.email || '',
    department: profile.department || '',
    license: profile.license || '',
    languages: profile.languages || '',
    employmentStatus: 'active',
    online: Boolean(session),
    sharing: false,
  };
}

function employeeById(id) {
  if (!id) return null;
  return employees.find(employee => employee.id === id) || null;
}

function inferMessageSender(message = {}) {
  if (message.side === 'me') return currentEmployee();
  if (message.senderId) return employeeById(message.senderId);
  if (activeChat && !['all', 'trucks', 'vans'].includes(activeChat)) {
    const direct = employeeById(activeChat);
    if (direct) return direct;
  }
  const prefix = String(message.body || '').match(/^([\p{L}\s.-]{2,24}):/u)?.[1]?.trim().toLowerCase();
  if (prefix) {
    return employees.find(employee => employee.name.toLowerCase().startsWith(prefix));
  }
  if (activeChat === 'dispatch') return employees.find(employee => employee.accessRole === 'dispatcher') || null;
  return null;
}

function messageSender(message = {}) {
  const fallback = message.side === 'me'
    ? currentEmployee()
    : { id: 'unknown', name: 'Kollega', initials: 'KO', role: 'Medarbejder', truck: '' };
  const sender = inferMessageSender(message) || fallback;
  return {
    id: sender.id,
    name: sender.name || 'Kollega',
    initials: sender.initials || initialsFromName(sender.name || 'Kollega'),
    role: sender.role || accessRoleLabel(sender.accessRole) || 'Medarbejder',
    truck: sender.truck || vehicleLabel(sender.vehicleType),
  };
}

function messageTimestamp(message = {}) {
  if (!message.createdAt) return message.time || '';
  return new Date(message.createdAt).toLocaleString('da-DK', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function initialsFromName(name = '') {
  return String(name || 'XB').split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'XB';
}

function profileGreetingName() {
  const raw = String(profile.name || '').trim();
  if (raw && !raw.includes('@') && raw.toLowerCase() !== 'medarbejder') return raw;
  const employeeName = currentEmployee()?.name || '';
  if (employeeName && !employeeName.includes('@') && employeeName.toLowerCase() !== 'medarbejder') return employeeName;
  return 'kollega';
}

function profileFromSupabase(row, user, privateDetails) {
  if (globalThis.XpressIntraSupabaseClient?.profileFromSupabaseRow) {
    return globalThis.XpressIntraSupabaseClient.profileFromSupabaseRow(row, user, privateDetails, profile);
  }
  return {
    name: row?.full_name || profile.name || '',
    phone: row?.phone || profile.phone || '',
    email: row?.email || user?.email || profile.email || '',
    role: row?.role || profile.role || 'Chauffør',
    accessRole: row?.access_role || profile.accessRole || 'employee',
    vehicleType: row?.vehicle_type || profile.vehicleType || 'truck',
    truck: row?.truck || profile.truck || '',
    department: row?.department || profile.department || '',
    license: row?.license_summary || profile.license || '',
    emergencyContact: privateDetails?.emergency_contact || profile.emergencyContact || '',
    languages: row?.languages || profile.languages || '',
    logbook: Boolean(row?.logbook_enabled ?? profile.logbook),
    passwordResetRequired: Boolean(row?.password_reset_required),
  };
}

function employeeFromSupabase(row, userId) {
  if (globalThis.XpressIntraSupabaseClient?.employeeFromSupabaseRow) {
    return globalThis.XpressIntraSupabaseClient.employeeFromSupabaseRow(row, userId, initialsFromName);
  }
  return {
    id: row.id,
    name: row.full_name || row.email || 'Medarbejder',
    initials: initialsFromName(row.full_name || row.email),
    role: row.role || 'Chauffør',
    accessRole: row.access_role || 'employee',
    vehicleType: row.vehicle_type || 'van',
    truck: row.truck || '',
    status: row.id === userId ? 'Online' : 'Medarbejder',
    location: row.department || '',
    phone: row.phone || '',
    email: row.email || '',
    department: row.department || '',
    license: row.license_summary || '',
    languages: row.languages || '',
    employmentStatus: row.employment_status || 'active',
    passwordResetRequired: Boolean(row.password_reset_required),
    online: row.id === userId,
    sharing: false,
  };
}

function chatFromConversation(row, latestMessage = null) {
  if (globalThis.XpressIntraChat?.chatFromConversationRow) {
    return globalThis.XpressIntraChat.chatFromConversationRow(row, latestMessage, { initialsFromName });
  }
  const isAll = row.channel_type === 'all';
  const isTruck = row.channel_type === 'truck';
  const isVan = row.channel_type === 'van';
  const title = row.title || (row.channel_type === 'direct' ? 'Direkte samtale' : 'Samtale');
  return {
    id: row.id,
    name: title,
    initials: isAll ? 'FC' : isTruck ? 'LB' : isVan ? 'VB' : initialsFromName(title),
    preview: latestMessage?.body || 'Ingen beskeder endnu',
    time: latestMessage?.created_at ? new Date(latestMessage.created_at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '',
    unread: 0,
    community: isAll,
    channel: isTruck ? 'truck' : isVan ? 'van' : null,
    online: true,
  };
}

function supabaseAuthSession() {
  if (!session?.userId) return null;
  return { user: { id: session.userId, email: session.email } };
}

function messageFromSupabase(row, userId) {
  if (globalThis.XpressIntraChat?.messageFromSupabaseRow) {
    return globalThis.XpressIntraChat.messageFromSupabaseRow(row, userId, {
      employeeById,
      currentEmployee,
      initialsFromName,
    });
  }
  const attachment = Array.isArray(row.media_attachments) ? row.media_attachments[0] : null;
  const sender = employeeById(row.sender_id) || (row.sender_id === userId ? currentEmployee() : null);
  return {
    id: row.id,
    senderId: row.sender_id,
    side: row.sender_id === userId ? 'me' : 'them',
    senderName: sender?.name || 'Kollega',
    senderInitials: sender?.initials || initialsFromName(sender?.name || 'Kollega'),
    senderRole: sender?.role || '',
    senderVehicle: sender?.truck || '',
    body: row.body,
    time: row.created_at ? new Date(row.created_at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '',
    createdAt: row.created_at,
    image: attachment ? {
      src: attachment.signedUrl || '',
      name: attachment.file_name,
      storagePath: attachment.storage_path,
      type: attachment.mime_type,
      size: attachment.size_bytes,
    } : null,
  };
}

async function attachSignedMediaUrls(rows = []) {
  const client = getSupabaseClient();
  const attachments = rows.flatMap(row => Array.isArray(row.media_attachments) ? row.media_attachments : []);
  await Promise.all(attachments.map(async attachment => {
    const { data } = await client.storage.from(attachment.bucket || 'xpressintra-media').createSignedUrl(attachment.storage_path, 60 * 10);
    attachment.signedUrl = data?.signedUrl || '';
  }));
  return rows;
}

async function loadSupabaseChats(authSession) {
  const client = getSupabaseClient();
  const userId = authSession?.user?.id;
  if (!client || !userId) return;
  const [conversationsResult, messagesResult] = await Promise.all([
    client.from('conversations').select('*').order('created_at', { ascending: true }),
    client.from('messages').select('*, media_attachments(*)').order('created_at', { ascending: true }).limit(500),
  ]);
  if (conversationsResult.error) throw conversationsResult.error;
  if (messagesResult.error) throw messagesResult.error;
  const messageRows = await attachSignedMediaUrls(messagesResult.data || []);

  const nextMessages = {};
  for (const row of messageRows) {
    nextMessages[row.conversation_id] = nextMessages[row.conversation_id] || [];
    nextMessages[row.conversation_id].push(messageFromSupabase(row, userId));
  }

  const nextChats = (conversationsResult.data || []).map(row => {
    const thread = nextMessages[row.id] || [];
    return chatFromConversation(row, thread[thread.length - 1]);
  });

  if (nextChats.length) {
    chats = nextChats;
    messages = nextMessages;
    save('chats', chats);
    save('messages', messages);
  }
}

async function uploadSupabaseChatImage(file, messageId) {
  const client = getSupabaseClient();
  if (!client || !file || !messageId) return null;
  if (!file.type?.startsWith('image/')) throw new Error('Kun billeder kan uploades i chatten');
  if (file.size > 10 * 1024 * 1024) throw new Error('Billedet må højst være 10 MB');
  const extension = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = mediaName(file.name || `chat-${messageId}.${extension}`);
  const storagePath = `${session.userId}/chat/${activeChat}/${messageId}-${Date.now()}-${safeName}`;
  const bucket = 'xpressintra-media';
  const { error: uploadError } = await client.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: attachment, error: attachmentError } = await client.from('media_attachments')
    .insert({
      owner_id: session.userId,
      message_id: messageId,
      bucket,
      storage_path: storagePath,
      file_name: file.name || safeName,
      mime_type: file.type,
      size_bytes: file.size,
      visibility: 'conversation',
    })
    .select('*')
    .maybeSingle();
  if (attachmentError) throw attachmentError;

  const { data: signed } = await client.storage.from(bucket).createSignedUrl(storagePath, 60 * 10);
  return {
    src: signed?.signedUrl || '',
    name: attachment?.file_name || file.name,
    storagePath,
    type: file.type,
    size: file.size,
  };
}

function audienceToSupabase(audience = 'Alle medarbejdere') {
  const normalized = String(audience || '').toLowerCase();
  if (normalized.includes('lastbil') || normalized === 'truck') return 'truck';
  if (normalized.includes('varebil') || normalized === 'van') return 'van';
  return 'all';
}

function audienceFromSupabase(audience = 'all') {
  return audience === 'truck' ? 'Lastbilchauffører' : audience === 'van' ? 'Varebilschauffører' : 'Alle medarbejdere';
}

function announcementFromSupabase(row) {
  const comments = Array.isArray(row.announcement_comments) ? row.announcement_comments : [];
  const reactions = Array.isArray(row.announcement_reactions) ? row.announcement_reactions : [];
  const attachment = Array.isArray(row.media_attachments) ? row.media_attachments[0] : null;
  return {
    id: String(row.id),
    title: row.title,
    body: row.body,
    image: attachment ? { src: attachment.signedUrl || '', name: attachment.file_name, storagePath: attachment.storage_path } : null,
    time: row.created_at ? new Date(row.created_at).toLocaleString('da-DK', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Nu',
    tone: row.kind === 'office' ? 'amber' : 'green',
    kind: row.kind,
    author: row.kind === 'office' ? 'Kontoret' : 'Kollega',
    initials: row.kind === 'office' ? 'XB' : 'KO',
    audience: audienceFromSupabase(row.audience),
    pinned: row.pinned,
    likes: reactions.length,
    comments: comments.map(comment => comment.body),
  };
}

async function attachSignedAnnouncementImages(rows = []) {
  const client = getSupabaseClient();
  const attachments = rows.flatMap(row => Array.isArray(row.media_attachments) ? row.media_attachments : []);
  await Promise.all(attachments.map(async attachment => {
    const { data } = await client.storage.from(attachment.bucket || 'xpressintra-media').createSignedUrl(attachment.storage_path, 60 * 10);
    attachment.signedUrl = data?.signedUrl || '';
  }));
  return rows;
}

async function uploadSupabaseAnnouncementImage(file, announcementId) {
  const client = getSupabaseClient();
  if (!client || !file || !announcementId) return null;
  if (!file.type?.startsWith('image/')) throw new Error('Kun billeder kan uploades til opslag');
  if (file.size > 10 * 1024 * 1024) throw new Error('Billedet må højst være 10 MB');
  const safeName = mediaName(file.name || `opslag-${announcementId}.jpg`);
  const bucket = 'xpressintra-media';
  const storagePath = `${session.userId}/announcements/${announcementId}-${Date.now()}-${safeName}`;
  const { error: uploadError } = await client.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { error: attachmentError } = await client.from('media_attachments').insert({
    owner_id: session.userId,
    announcement_id: announcementId,
    bucket,
    storage_path: storagePath,
    file_name: file.name || safeName,
    mime_type: file.type,
    size_bytes: file.size,
    visibility: 'announcement',
  });
  if (attachmentError) throw attachmentError;
  const { data: signed } = await client.storage.from(bucket).createSignedUrl(storagePath, 60 * 10);
  return { src: signed?.signedUrl || '', name: file.name || safeName, storagePath };
}

async function createSupabaseAnnouncement(post, file = null) {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return null;
  const { data, error } = await client.from('announcements').insert({
    author_id: session.userId,
    title: post.title,
    body: post.body,
    kind: post.kind,
    audience: audienceToSupabase(post.audience),
    pinned: Boolean(post.pinned),
  }).select('*').maybeSingle();
  if (error) throw error;
  if (file && data?.id) post.image = await uploadSupabaseAnnouncementImage(file, data.id);
  if (data?.id) post.id = String(data.id);
  return data;
}

async function syncSupabaseAnnouncementReaction(postId, liked) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !/^\d+$/.test(String(postId))) return;
  if (liked) {
    const { error } = await client.from('announcement_reactions').insert({ announcement_id: Number(postId), user_id: session.userId });
    if (error) throw error;
    return;
  }
  await client.from('announcement_reactions').delete().eq('announcement_id', Number(postId)).eq('user_id', session.userId);
}

async function createSupabaseAnnouncementComment(postId, body) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !/^\d+$/.test(String(postId))) return;
  const { error } = await client.from('announcement_comments').insert({
    announcement_id: Number(postId),
    author_id: session.userId,
    body,
  });
  if (error) throw error;
}

async function notifySupabaseAudience(post) {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const audience = audienceToSupabase(post.audience);
  const targets = employees.filter(employee => {
    if (employee.id === session.userId) return false;
    if (audience === 'all') return employee.employmentStatus !== 'offboarded';
    return employee.vehicleType === audience && employee.employmentStatus !== 'offboarded';
  });
  const rows = targets.map(employee => ({
    user_id: employee.id,
    type: post.kind === 'office' ? 'Kontoropslag' : 'Opslag',
    title: post.title,
    body: post.body,
    level: post.kind === 'office' ? 'office' : 'message',
    priority: post.kind === 'office' ? 'medium' : 'normal',
    category: 'office',
  }));
  if (!rows.length) return;
  const { error } = await client.from('notifications').insert(rows);
  if (error) throw error;
}

async function startSupabaseDirectChat(employee, firstMessage = '') {
  const client = getSupabaseClient();
  if (!client || !employee?.id) return null;
  const { data: conversationId, error } = await client.rpc('start_direct_conversation', { target_user_id: employee.id });
  if (error) throw error;

  await loadSupabaseChats(supabaseAuthSession());
  let chat = chats.find(item => item.id === conversationId);
  if (!chat) {
    chat = {
      id: conversationId,
      name: employee.name,
      initials: employee.initials || initialsFromName(employee.name),
      preview: 'Start en intern samtale',
      time: 'Nu',
      unread: 0,
    };
    chats.unshift(chat);
  } else if (chat.name === 'Direkte samtale') {
    chat.name = employee.name;
    chat.initials = employee.initials || initialsFromName(employee.name);
  }
  messages[conversationId] = messages[conversationId] || [];
  save('chats', chats);
  save('messages', messages);

  if (firstMessage.trim()) {
    const { error: messageError } = await client.from('messages').insert({
      conversation_id: conversationId,
      sender_id: session.userId,
      body: firstMessage.trim(),
    });
    if (messageError) throw messageError;
  }
  return conversationId;
}

function locationShareFromSupabase(row) {
  const person = employees.find(employee => employee.id === row.user_id);
  if (!person) return null;
  return {
    ...person,
    sharing: true,
    online: true,
    coords: [row.latitude, row.longitude],
    speed: row.show_speed === false || row.speed_kmh === null ? null : Math.round(Number(row.speed_kmh || 0)),
    shareMode: row.share_mode,
    expiresAt: row.expires_at,
    lastUpdatedAt: row.last_updated_at,
    truck: row.show_vehicle === false ? 'Bil skjult' : person.truck,
    status: row.show_status === false ? 'Deler position' : row.status === 'driving' ? 'Kører' : row.status === 'pause' ? 'Pause' : row.status === 'pickup' ? 'Afhentning' : 'Deler position',
  };
}

async function loadSupabaseLocations() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { data, error } = await client.from('location_shares').select('*').order('last_updated_at', { ascending: false });
  if (error) {
    if (handleLocationShareSchemaError(error)) return;
    throw error;
  }
  const shared = (data || []).map(locationShareFromSupabase).filter(Boolean);
  const sharedIds = new Set(shared.map(person => person.id));
  employees = employees.map(employee => {
    const onlineShare = shared.find(person => person.id === employee.id);
    if (onlineShare) return { ...employee, ...onlineShare };
    if (employee.id === session.userId || employee.id === currentEmployee().id) return employee;
    return sharedIds.has(employee.id) ? employee : { ...employee, sharing: false };
  });
  for (const person of shared) {
    if (!employees.some(employee => employee.id === person.id)) employees.push(person);
  }
  save('employees', employees);
}

function locationStatusForSupabase() {
  if (activePickup) return 'pickup';
  if (location.speed > 5) return 'driving';
  return 'sharing';
}

function locationPrivacyForSupabase(visibility = 'team') {
  const permissions = { ...(workday.permissions || {}), ...workdayPrivacy };
  const audience = visibility === 'pickup'
    ? 'all'
    : ['all', 'truck', 'van', 'none'].includes(permissions.audience) ? permissions.audience : 'all';
  return {
    audience,
    showSpeed: Boolean(permissions.showSpeed),
    showVehicle: Boolean(permissions.showVehicle ?? true),
    showStatus: Boolean(permissions.showStatus ?? true),
  };
}

async function syncSupabaseLocation() {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !location.sharing) return;
  const coords = location.coords || currentEmployee().coords;
  if (!coords) return;
  const visibility = activePickup?.employeeId ? 'pickup' : 'team';
  const shareMode = activePickup ? 'pickup' : location.shareMode || (workday.active ? 'workday' : 'manual');
  const privacy = locationPrivacyForSupabase(visibility);
  const { error } = await client.from('location_shares').upsert({
    user_id: session.userId,
    latitude: coords[0],
    longitude: coords[1],
    speed_kmh: privacy.showSpeed ? Number(location.speed || 0) : null,
    visibility,
    visible_to_user_id: visibility === 'pickup' ? activePickup.employeeId : null,
    audience: privacy.audience,
    show_speed: privacy.showSpeed,
    show_vehicle: privacy.showVehicle,
    show_status: privacy.showStatus,
    status: locationStatusForSupabase(),
    share_mode: shareMode,
    expires_at: location.expiresAt,
    last_updated_at: new Date().toISOString(),
  });
  if (error) {
    if (handleLocationShareSchemaError(error)) return;
    throw error;
  }
}

async function stopSupabaseLocation() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { error } = await client.from('location_shares').delete().eq('user_id', session.userId);
  if (error && !handleLocationShareSchemaError(error)) throw error;
}

function workdayFromSupabase(row) {
  return {
    id: row.id,
    active: row.status === 'active',
    startedAt: row.started_at,
    endsAt: row.ends_at,
    endedAt: row.ended_at,
    endLabel: '19.00',
    permissions: row.permissions || { gps: true, logbook: true, notifications: true },
    mode: 'supabase',
  };
}

function pickupFromSupabase(row) {
  return {
    id: row.id,
    driverId: row.driver_id,
    employeeId: row.colleague_id,
    note: row.note || '',
    pickupPlace: row.pickup_place || '',
    dropoffPlace: row.dropoff_place || '',
    reference: row.reference || '',
    priority: row.priority || 'Normal',
    status: row.status || 'started',
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
    steps: Array.isArray(row.steps) ? row.steps : [],
    expiresAt: row.expires_at || null,
    startedAt: row.started_at,
    completedAt: row.completed_at || null,
    startedLocationSharing: Boolean(row.started_location_sharing),
    mode: 'supabase',
  };
}

function pickupPayloadForSupabase(task = activePickup) {
  return {
    driver_id: task.driverId || session.userId,
    colleague_id: task.employeeId,
    note: task.note || null,
    pickup_place: task.pickupPlace || null,
    dropoff_place: task.dropoffPlace || null,
    reference: task.reference || null,
    priority: task.priority || 'Normal',
    status: task.status || 'started',
    checklist: ensurePickupChecklist(task),
    steps: task.steps || [],
    started_location_sharing: Boolean(task.startedLocationSharing),
    expires_at: task.expiresAt || null,
    completed_at: task.completedAt || null,
  };
}

function isOpenPickupStatus(status) {
  return !['delivered', 'cancelled'].includes(status);
}

async function loadSupabasePickupTasks() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { data, error } = await client.from('pickup_tasks')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  const openTask = (data || []).find(row => isOpenPickupStatus(row.status));
  if (openTask) {
    activePickup = pickupFromSupabase(openTask);
    save('activePickup', activePickup);
  }
}

async function loadOptionalSupabaseArea(label, loader) {
  try {
    await loader();
  } catch (error) {
    console.warn(`Supabase ${label} kunne ikke hentes`, error);
    showToast(`${label} blev ikke hentet online endnu. Resten af appen virker.`);
  }
}

async function createSupabasePickupTask() {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !activePickup) return;
  activePickup.driverId = session.userId;
  const { data, error } = await client.from('pickup_tasks')
    .insert(pickupPayloadForSupabase(activePickup))
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (data) {
    activePickup = { ...activePickup, id: data.id, mode: 'supabase', startedAt: data.started_at || activePickup.startedAt };
    save('activePickup', activePickup);
  }
}

async function updateSupabasePickupTask(extra = {}) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !activePickup?.id) return;
  const { error } = await client.from('pickup_tasks')
    .update({ ...pickupPayloadForSupabase(activePickup), ...extra })
    .eq('id', activePickup.id);
  if (error) throw error;
}

async function loadSupabaseWorkday() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { data, error } = await client.from('workday_sessions')
    .select('*')
    .eq('user_id', session.userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (data) {
    workday = workdayFromSupabase(data);
    save('workday', workday);
  }
}

async function startSupabaseWorkday() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { data, error } = await client.from('workday_sessions')
    .insert({
      user_id: session.userId,
      ends_at: workday.endsAt,
      permissions: workday.permissions,
      status: 'active',
    })
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (data) {
    workday = { ...workday, id: data.id, mode: 'supabase' };
    save('workday', workday);
  }
}

async function endSupabaseWorkday(status = 'ended') {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !workday.id) return;
  await client.from('workday_sessions')
    .update({ ended_at: new Date().toISOString(), status })
    .eq('id', workday.id)
    .eq('user_id', session.userId);
}

function handleSupabaseLocation(payload) {
  const row = payload.new || payload.old;
  if (!row?.user_id) return;
  const isOwnLocationUpdate = row.user_id === session?.userId || row.user_id === currentEmployee().id;
  if (payload.eventType === 'DELETE') {
    employees = employees.map(employee => employee.id === row.user_id ? { ...employee, sharing: false } : employee);
  } else {
    const person = locationShareFromSupabase(row);
    if (person) {
      const index = employees.findIndex(employee => employee.id === person.id);
      if (index >= 0) employees[index] = { ...employees[index], ...person };
      else employees.push(person);
    }
  }
  save('employees', employees);
  if (activeTab === 'map' && !isOwnLocationUpdate) render({ preserveScroll: true });
}

function handleSupabasePickupTask(payload) {
  const row = payload.new || payload.old;
  if (!row?.id) return;
  const isParticipant = row.driver_id === session?.userId || row.colleague_id === session?.userId;
  if (!isParticipant) return;

  if (payload.eventType === 'DELETE' || !isOpenPickupStatus(row.status)) {
    if (activePickup?.id === row.id) {
      activePickup = null;
      save('activePickup', null);
      render();
    }
    return;
  }

  activePickup = pickupFromSupabase(row);
  save('activePickup', activePickup);
  if (activeTab === 'home' || activeTab === 'map') render({ preserveScroll: activeTab === 'map' });
}

function notificationFromSupabase(row = {}) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    time: row.created_at ? new Date(row.created_at).toLocaleString('da-DK', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Nu',
    level: row.level,
    priority: row.priority,
    unread: !row.read_at,
  };
}

async function handleSupabaseMessage(row) {
  if (!row?.conversation_id || messages[row.conversation_id]?.some(message => message.id === row.id)) return;
  const rows = await attachSignedMediaUrls([row]);
  messages[row.conversation_id] = messages[row.conversation_id] || [];
  const nextMessage = messageFromSupabase(rows[0], session?.userId);
  messages[row.conversation_id].push(nextMessage);
  const chat = chats.find(item => item.id === row.conversation_id);
  if (chat) {
    chat.preview = nextMessage.body;
    chat.time = nextMessage.time;
    if (activeChat !== row.conversation_id && nextMessage.side !== 'me') chat.unread = (chat.unread || 0) + 1;
  }
  if (nextMessage.side !== 'me' && activeChat !== row.conversation_id) {
    const heading = chat ? conversationHeading(chat) : { title: 'Besked' };
    addNotification({
      type: 'Chatbesked',
      title: `${nextMessage.senderName || 'Kollega'} skrev`,
      body: `${heading.title || 'Samtale'} · ${nextMessage.body || 'Ny besked'}`,
      level: 'message',
      chatId: row.conversation_id,
      tag: `chat-${row.conversation_id}`,
    }, { system: true });
  }
  save('messages', messages);
  save('chats', chats);
  if (activeTab === 'chat' || activeTab === 'home' || activeTab === 'more') render({ preserveScroll: activeTab !== 'chat' });
}

function handleSupabaseNotification(row) {
  if (!row?.id || (row.user_id && row.user_id !== session?.userId)) return;
  if (notifications.some(item => String(item.id) === String(row.id))) return;
  const item = notificationFromSupabase(row);
  if (!item.unread) return;
  addNotification(item, { system: true });
  if (activeTab === 'home' || activeTab === 'more') render({ preserveScroll: true });
}

function subscribeSupabaseChat() {
  const client = getSupabaseClient();
  if (!client?.channel || supabaseChatSubscription) return;
  supabaseChatSubscription = client
    .channel('xpressintra-chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => handleSupabaseMessage(payload.new))
    .subscribe();
}

function subscribeSupabaseNotifications() {
  const client = getSupabaseClient();
  if (!client?.channel || supabaseNotificationSubscription) return;
  supabaseNotificationSubscription = client
    .channel('xpressintra-notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => handleSupabaseNotification(payload.new))
    .subscribe();
}

function subscribeSupabaseLocations() {
  const client = getSupabaseClient();
  if (!client?.channel || supabaseLocationSubscription) return;
  supabaseLocationSubscription = client
    .channel('xpressintra-locations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'location_shares' }, payload => handleSupabaseLocation(payload))
    .subscribe();
}

function subscribeSupabasePickupTasks() {
  const client = getSupabaseClient();
  if (!client?.channel || supabasePickupSubscription) return;
  supabasePickupSubscription = client
    .channel('xpressintra-pickups')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_tasks' }, payload => handleSupabasePickupTask(payload))
    .subscribe();
}

async function loadSupabaseData(authSession) {
  const client = getSupabaseClient();
  const user = authSession?.user;
  if (!client || !user) return;

  const [
    profileResult,
    privateResult,
    employeesResult,
    vehiclesResult,
    notificationsResult,
    notificationPrefsResult,
    legalAcceptanceResult,
    dataRequestsResult,
    coreSettingsResult,
    logbookResult,
    automationResult,
    announcementsResult,
  ] = await Promise.all([
    client.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    client.from('profile_private_details').select('*').eq('user_id', user.id).maybeSingle(),
    client.from('profiles').select('*').eq('employment_status', 'active').order('full_name'),
    client.from('vehicles').select('*').order('unit'),
    client.from('notifications').select('*').order('created_at', { ascending: false }).limit(40),
    client.from('notification_preferences').select('*').eq('user_id', user.id).maybeSingle(),
    client.from('legal_acceptances').select('*').eq('user_id', user.id).order('accepted_at', { ascending: false }).limit(1).maybeSingle(),
    client.from('data_subject_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    client.from('core_settings').select('*'),
    client.from('private_log_entries').select('*').order('created_at', { ascending: false }).limit(50),
    client.from('logbook_automation_settings').select('*').eq('user_id', user.id).maybeSingle(),
    client.from('announcements').select('*, announcement_reactions(*), announcement_comments(*), media_attachments(*)').order('created_at', { ascending: false }).limit(50),
  ]);

  if (profileResult.error) throw profileResult.error;
  profile = profileFromSupabase(profileResult.data, user, privateResult.data);
  save('profile', profile);

  if (employeesResult.data?.length) {
    employees = employeesResult.data.map(row => employeeFromSupabase(row, user.id));
    save('employees', employees);
  }
  if (vehiclesResult.data?.length) {
    vehicles = vehiclesResult.data.map(row => ({
      id: row.id,
      unit: row.unit,
      type: row.vehicle_type === 'truck' ? 'Lastbil' : row.vehicle_type === 'van' ? 'Varebil' : 'Køretøj',
      plate: row.plate || '',
      driverId: row.assigned_driver_id,
      status: row.status || 'Klar',
      equipment: row.equipment || '',
      nextCheck: row.next_check || '',
    }));
    save('vehicles', vehicles);
  }
  if (notificationsResult.data) {
    notifications = notificationsResult.data.map(notificationFromSupabase);
    save('notifications', notifications);
  }
  if (notificationPrefsResult.data) {
    notificationPrefs = {
      office: notificationPrefsResult.data.office,
      rules: notificationPrefsResult.data.rules,
      chat: notificationPrefsResult.data.chat,
      dailyBrief: notificationPrefsResult.data.daily_brief,
      quietHours: notificationPrefsResult.data.quiet_hours,
      system: Boolean(notificationPrefs.system),
    };
    save('notificationPrefs', notificationPrefs);
  }
  if (legalAcceptanceResult.data) {
    legalAcceptance = {
      date: legalAcceptanceResult.data.accepted_at ? new Date(legalAcceptanceResult.data.accepted_at).toLocaleDateString('da-DK') : 'Online',
      version: legalAcceptanceResult.data.policy_version,
    };
    save('legalAcceptance', legalAcceptance);
  }
  if (dataRequestsResult.data) {
    const labels = { access: 'Indsigt', rectification: 'Rettelse', erasure: 'Sletning', export: 'Eksport', restriction: 'Begrænsning', objection: 'Indsigelse' };
    dataRequests = dataRequestsResult.data.map(row => ({
      id: row.id,
      requestType: row.request_type,
      label: labels[row.request_type] || 'Dataanmodning',
      message: row.message || '',
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString('da-DK') : '',
    }));
    save('dataRequests', dataRequests);
  }
  if (coreSettingsResult.data?.length) {
    const mapped = Object.fromEntries(coreSettingsResult.data.map(row => [row.key, row.enabled]));
    coreSettings = {
      gps: mapped.gps ?? coreSettings.gps,
      media: mapped.media ?? coreSettings.media,
      logbook: mapped.logbook ?? coreSettings.logbook,
      employeePosts: mapped.employee_posts ?? coreSettings.employeePosts,
      ruleApproval: mapped.rule_approval ?? coreSettings.ruleApproval,
    };
    save('coreSettings', coreSettings);
  }
  if (logbookResult.data) {
    logEntries = logbookResult.data.map(row => ({
      id: row.id,
      place: row.place,
      note: row.note,
      category: row.category,
      source: row.source,
      favorite: row.favorite,
      date: row.created_at ? new Date(row.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' }) : 'I dag',
    }));
    save('logEntries', logEntries);
  }
  if (automationResult.data) {
    logbookAutomation = {
      smartLogbook: automationResult.data.smart_logbook,
      autoDrafts: automationResult.data.auto_drafts,
      autoPlace: automationResult.data.auto_place,
      autoStops: automationResult.data.auto_stops,
      autoPickup: automationResult.data.auto_pickup,
      autoVehicle: automationResult.data.auto_vehicle,
      autoMilestones: automationResult.data.auto_milestones,
    };
    save('logbookAutomation', logbookAutomation);
  }
  if (announcementsResult.data) {
    const rows = await attachSignedAnnouncementImages(announcementsResult.data);
    announcements = rows.map(announcementFromSupabase);
    save('announcements', announcements);
  }
  await loadOptionalSupabaseArea('Chat', () => loadSupabaseChats(authSession));
  await loadOptionalSupabaseArea('GPS', loadSupabaseLocations);
  await loadOptionalSupabaseArea('Arbejdsdag', loadSupabaseWorkday);
  await loadOptionalSupabaseArea('Afhentningshjælp', loadSupabasePickupTasks);
  await loadOptionalSupabaseArea('Adminlog', loadSupabaseAdminAudit);
}

async function applySupabaseSession(authSession) {
  session = { email: authSession.user.email, userId: authSession.user.id, mode: 'supabase', signedInAt: new Date().toISOString() };
  save('session', session);
  await loadSupabaseData(authSession);
  sanitizeCreatorRoleTester();
  subscribeSupabaseChat();
  subscribeSupabaseNotifications();
  subscribeSupabaseLocations();
  subscribeSupabasePickupTasks();
  render();
  if (profile.passwordResetRequired) openTemporaryPasswordModal();
}

async function restoreSupabaseSession() {
  if (session?.mode === 'demo') return;
  const client = getSupabaseClient();
  if (!client) return;
  const { data, error } = await client.auth.getSession();
  if (error || !data.session) {
    localStorage.removeItem('roadlog:session');
    session = null;
    render();
    return;
  }
  try {
    await applySupabaseSession(data.session);
  } catch (error) {
    localStorage.removeItem('roadlog:session');
    session = null;
    render();
    showToast(`XpressIntra er online, men dine data kunne ikke hentes: ${error.message}`);
  }
}

async function signInSupabase(email, password) {
  const client = getSupabaseClient();
  if (!client) throw new Error('XpressIntra-onlineforbindelsen er ikke sat op endnu');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('Login lykkedes ikke. Tjek mail og adgangskode.');
  await applySupabaseSession(data.session);
  if (String(password || '') === TEMPORARY_EMPLOYEE_PASSWORD || profile.passwordResetRequired) openTemporaryPasswordModal();
}

function personalPasswordError(password) {
  if (String(password || '').length < 8) return 'Din personlige kode skal være mindst 8 tegn';
  if (!/[a-z]/.test(password)) return 'Din personlige kode skal have mindst ét lille bogstav';
  if (!/[A-Z]/.test(password)) return 'Din personlige kode skal have mindst ét stort bogstav';
  if (!/[0-9]/.test(password)) return 'Din personlige kode skal have mindst ét tal';
  if (password === TEMPORARY_EMPLOYEE_PASSWORD) return 'Vælg en personlig kode - ikke standardkoden';
  return '';
}

async function markSupabasePasswordReady() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { error } = await client.from('profiles').update({ password_reset_required: false }).eq('id', session.userId);
  if (error && !isMissingSupabaseColumnError(error, 'password_reset_required')) throw error;
  profile = { ...profile, passwordResetRequired: false };
  save('profile', profile);
}

async function signUpSupabase(email, password, options = {}) {
  const client = getSupabaseClient();
  if (!client) throw new Error('XpressIntra-onlineforbindelsen er ikke sat op endnu');
  const normalizedEmail = normalizeEmployeeEmail(email);
  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: officialAppUrl(),
      data: {
        invited_to_xpressintra: true,
        invitation_id: String(options.invitationId || '').trim(),
        temporary_password_flow: !options.personalPasswordReady,
        first_personal_password: Boolean(options.personalPasswordReady),
      },
    },
  });
  if (error) throw error;
  if (data.session) {
    await applySupabaseSession(data.session);
    if (options.personalPasswordReady) {
      await markSupabasePasswordReady();
      return 'Kontoen er oprettet. Du er logget ind med din personlige kode.';
    }
    openTemporaryPasswordModal();
    return 'Kontoen er oprettet. Lav din personlige kode nu.';
  }
  openEmailConfirmationModal(normalizedEmail);
  return options.personalPasswordReady
    ? 'Bekræftelsesmail er sendt. Tjek mailen og log derefter ind med din personlige kode.'
    : 'Bekræftelsesmail er sendt. Tjek mailen og log derefter ind.';
}

async function resendSupabaseSignupConfirmation(email) {
  const client = getSupabaseClient();
  const normalizedEmail = normalizeEmployeeEmail(email);
  if (!client) throw new Error('XpressIntra-onlineforbindelsen er ikke sat op endnu');
  if (!normalizedEmail) throw new Error('Der mangler en arbejdsmail');
  if (!client.auth?.resend) throw new Error('Denne Supabase-klient kan ikke gensende bekræftelsesmail endnu');
  const { error } = await client.auth.resend({
    type: 'signup',
    email: normalizedEmail,
    options: { emailRedirectTo: officialAppUrl() },
  });
  if (error) throw error;
  return normalizedEmail;
}

function isEmailConfirmationError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  return message.includes('email not confirmed')
    || message.includes('not confirmed')
    || message.includes('confirm')
    || message.includes('bekræft');
}

function openEmailConfirmationModal(email) {
  const normalizedEmail = normalizeEmployeeEmail(email);
  if (!normalizedEmail) return;
  document.querySelector('.modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal invite-result-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Mailbekræftelse</p>
    <h3>Tjek din mail</h3>
    <section class="invite-help">
      <b>Bekræftelsesmail er sendt</b>
      <span>Åbn mailen fra XpressIntra og tryk bekræft. Derefter kan du logge ind med din personlige kode.</span>
      <span>Mail: <strong>${text(normalizedEmail)}</strong></span>
    </section>
    <div class="invite-actions">
      <button type="button" data-action="resend-pending-confirmation">Gensend bekræftelsesmail</button>
      <button type="button" data-action="close-modal">OK</button>
    </div>
  </section>`;
  modal.dataset.confirmationEmail = normalizedEmail;
  document.body.append(modal);
}

async function updateSupabasePassword(newPassword) {
  const client = getSupabaseClient();
  if (!client || !session?.userId) throw new Error('Du skal være logget ind for at ændre kode');
  const { error } = await client.auth.updateUser({ password: newPassword });
  if (error) throw error;
  const { error: profileError } = await client.from('profiles').update({ password_reset_required: false }).eq('id', session.userId);
  if (profileError) throw profileError;
  profile = { ...profile, passwordResetRequired: false };
  save('profile', profile);
}

async function signOut() {
  const client = getSupabaseClient();
  if (client && supabaseChatSubscription) {
    client.removeChannel?.(supabaseChatSubscription);
    supabaseChatSubscription = null;
  }
  if (client && supabaseNotificationSubscription) {
    client.removeChannel?.(supabaseNotificationSubscription);
    supabaseNotificationSubscription = null;
  }
  if (client && supabaseLocationSubscription) {
    client.removeChannel?.(supabaseLocationSubscription);
    supabaseLocationSubscription = null;
  }
  if (client && supabasePickupSubscription) {
    client.removeChannel?.(supabasePickupSubscription);
    supabasePickupSubscription = null;
  }
  if (client && session?.mode === 'supabase') await client.auth.signOut();
  localStorage.removeItem('roadlog:session');
  localStorage.removeItem('roadlog:creatorRoleTester');
  creatorRoleTester = { active: false, originalProfile: null, currentRole: null };
  session = null;
  render();
}

function isAdmin() {
  return ['admin', 'owner'].includes(profile.accessRole);
}

function isDispatcher() {
  return ['dispatcher', 'admin', 'owner'].includes(profile.accessRole);
}

function canManageEmployees() {
  return isAdmin();
}

function canPublishOfficePosts() {
  return isDispatcher();
}

function canUseInternalAction(action) {
  if (!action) return true;
  const creatorOnlyActions = new Set([
    'test-supabase',
    'open-security-center',
    'show-update-status',
    'open-rollback-center',
    'mark-current-version-suspect',
    'install-stable-rollback',
  ]);
  const adminActions = new Set([
    'open-admin',
    'new-employee',
    'open-launch-checklist',
    'open-gdpr-go-live',
    'open-rule-updates',
  ]);
  const dispatcherActions = new Set([
    'new-announcement',
    'open-dispatch',
  ]);
  if (creatorOnlyActions.has(action)) return isCreatorOwner();
  if (adminActions.has(action)) return canManageEmployees() || isCreatorOwner();
  if (dispatcherActions.has(action)) return isDispatcher();
  if (action === 'demo-admin' || action === 'reset-demo') return DEMO_MODE;
  return true;
}

function blockInternalAction(action) {
  if (canUseInternalAction(action)) return false;
  showToast('Den funktion er kun for creator, chef/admin eller drift');
  return true;
}

const creatorRolePresets = {
  creator: { label: 'Appansvarlig', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck', truck: 'TR 42 918', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis' },
  truck: { label: 'Lastbilchauffor', role: 'Lastbilchauffor', accessRole: 'employee', vehicleType: 'truck', truck: 'TR 42 918', department: 'Lastbil', license: 'C/E - EU kvalifikation' },
  van: { label: 'Varebilchauffor', role: 'Varebilchauffor', accessRole: 'employee', vehicleType: 'van', truck: 'VB 51 204', department: 'Varebil', license: 'B - varebil' },
  dispatcher: { label: 'Disponent', role: 'Disponent', accessRole: 'dispatcher', vehicleType: 'dispatch', truck: 'Kontoret', department: 'Drift', license: 'Kontor' },
  admin: { label: 'Chef/admin', role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse', department: 'Ledelse', license: 'Administrator' },
};

function canUseCreatorRoleTester() {
  const original = creatorRoleTester.originalProfile || {};
  return profile.accessRole === 'owner'
    || (creatorRoleTester.active && original.accessRole === 'owner' && original.email === profile.email);
}

function sanitizeCreatorRoleTester() {
  const original = creatorRoleTester.originalProfile || {};
  const sameUser = !original.email || original.email === profile.email;
  if (profile.accessRole === 'owner' || (creatorRoleTester.active && original.accessRole === 'owner' && sameUser)) return;
  creatorRoleTester = { active: false, originalProfile: null, currentRole: null };
  save('creatorRoleTester', creatorRoleTester);
}

function creatorPerspectiveLabel() {
  return creatorRolePresets[creatorRoleTester.currentRole]?.label || accessRoleLabel(profile.accessRole);
}

function applyCreatorPerspective(roleId) {
  if (!canUseCreatorRoleTester() || !creatorRolePresets[roleId]) {
    showToast('Kun creator kan bruge rolleskift');
    return;
  }
  const originalProfile = creatorRoleTester.originalProfile || clone(profile);
  const preset = creatorRolePresets[roleId];
  profile = {
    ...profile,
    ...preset,
    name: originalProfile.name || profile.name,
    email: originalProfile.email || profile.email,
    phone: originalProfile.phone || profile.phone,
    emergencyContact: originalProfile.emergencyContact || profile.emergencyContact,
    languages: originalProfile.languages || profile.languages,
    logbook: true,
  };
  creatorRoleTester = { active: roleId !== 'creator', originalProfile, currentRole: roleId };
  save('profile', profile);
  save('creatorRoleTester', creatorRoleTester);
  showToast(`Viser appen som ${preset.label}`);
  render();
}

function recordAdminAudit(title, body) {
  const event = {
    id: `audit-${Date.now()}`,
    title,
    body,
    actor: profile.name,
    time: new Date().toLocaleString('da-DK', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
  };
  adminAuditEvents.unshift(event);
  adminAuditEvents = adminAuditEvents.slice(0, 20);
  save('adminAuditEvents', adminAuditEvents);
  syncSupabaseAdminAudit(title, body).catch(error => showToast(`Adminloggen blev gemt lokalt, men ikke online: ${error.message}`));
}

function adminAuditFromSupabase(row) {
  const details = row.details || {};
  return {
    id: row.id,
    title: row.action === 'profile_security_change' ? 'Medarbejderprofil ændret' : (details.title || row.action),
    body: details.body || details.summary || 'Adminhandling gemt online',
    actor: details.actor_name || 'Chef/admin',
    time: row.created_at ? new Date(row.created_at).toLocaleString('da-DK', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '',
  };
}

async function syncSupabaseAdminAudit(title, body, targetUserId = null) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !canManageEmployees()) return;
  const { error } = await client.from('admin_audit_log').insert({
    actor_id: session.userId,
    target_user_id: targetUserId,
    action: title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '') || 'admin_action',
    details: { title, body, actor_name: profile.name },
  });
  if (error) throw error;
}

async function loadSupabaseAdminAudit() {
  const client = getSupabaseClient();
  if (!client || !canManageEmployees()) return;
  const { data, error } = await client.from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  if (data) {
    adminAuditEvents = data.map(adminAuditFromSupabase);
    save('adminAuditEvents', adminAuditEvents);
  }
}

async function syncSupabaseNotificationPrefs() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { error } = await client.from('notification_preferences').upsert({
    user_id: session.userId,
    office: notificationPrefs.office,
    rules: notificationPrefs.rules,
    chat: notificationPrefs.chat,
    daily_brief: notificationPrefs.dailyBrief,
    quiet_hours: notificationPrefs.quietHours,
  });
  if (error) throw error;
}

async function markSupabaseNotificationsRead() {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { error } = await client.from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', session.userId);
  if (error) throw error;
}

async function createSupabaseDataRequest(request) {
  const client = getSupabaseClient();
  if (!client || !session?.userId) return;
  const { error } = await client.from('data_subject_requests').insert({
    user_id: session.userId,
    request_type: request.requestType,
    message: request.message,
    status: 'open',
  });
  if (error) throw error;
}

async function updateSupabaseDataRequest(request) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !canManageEmployees()) return;
  const { error } = await client.from('data_subject_requests')
    .update({
      status: request.status === 'completed' ? 'completed' : 'in_review',
      handled_by: session.userId,
      handled_note: request.handledNote || `Behandlet af ${profile.name}`,
      handled_at: new Date().toISOString(),
    })
    .eq('id', request.id);
  if (error) throw error;
}

async function acceptSupabaseLegal() {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !legalAcceptance) return;
  const { error } = await client.from('legal_acceptances').insert({
    user_id: session.userId,
    policy_version: legalAcceptance.version,
    accepted_at: new Date().toISOString(),
  });
  if (error) throw error;
}

function profilePayloadForSupabase(employee) {
  return {
    full_name: employee.name,
    phone: employee.phone || null,
    email: employee.email || null,
    department: employee.department || null,
    license_summary: employee.license || null,
    languages: employee.languages || null,
    role: employee.role || 'Chauffør',
    access_role: employee.accessRole || 'employee',
    vehicle_type: employee.vehicleType || 'van',
    truck: employee.truck || null,
    employment_status: employee.employmentStatus || 'active',
    logbook_enabled: Boolean(employee.logbook),
  };
}

async function updateSupabaseEmployeeProfile(employee) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !employee?.id || employee.id === 'th') return;
  const { error } = await client.from('profiles').update(profilePayloadForSupabase(employee)).eq('id', employee.id);
  if (error) throw error;
  await client.from('profile_private_details').upsert({
    user_id: employee.id,
    emergency_contact: employee.emergencyContact || null,
  });
}

async function createSupabaseEmployeeInvitation(employee) {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !canManageEmployees()) return;
  const payload = {
    created_by: session.userId,
    full_name: employee.name,
    email: employee.email,
    phone: employee.phone || null,
    role: employee.role || 'Chauffør',
    access_role: employee.accessRole || 'employee',
    vehicle_type: employee.vehicleType || 'van',
    truck: employee.truck || null,
    department: employee.department || null,
    license_summary: employee.license || null,
    languages: employee.languages || null,
    emergency_contact: employee.emergencyContact || null,
    logbook_enabled: Boolean(employee.logbook),
    onboarding_method: 'standard_password',
    password_reset_required: true,
  };
  let { data, error } = await client.from('employee_invitations').insert(payload).select('id').maybeSingle();
  if (error && (isMissingSupabaseColumnError(error, 'onboarding_method') || isMissingSupabaseColumnError(error, 'password_reset_required'))) {
    const legacyPayload = { ...payload };
    delete legacyPayload.onboarding_method;
    delete legacyPayload.password_reset_required;
    ({ data, error } = await client.from('employee_invitations').insert(legacyPayload).select('id').maybeSingle());
  }
  if (error) throw error;
  return data?.id || null;
}

function normalizeEmployeeEmail(value = '') {
  return String(value || '').trim().toLowerCase();
}

function localInvitationId() {
  return `local-${Date.now()}`;
}

function employeeFromProfileForm(data) {
  const name = String(data.get('name') || '').trim();
  const email = normalizeEmployeeEmail(data.get('email'));
  return {
    id: `employee-${Date.now()}`,
    name,
    initials: name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || '+',
    role: data.get('role') || 'Chauffør',
    accessRole: data.get('accessRole') || 'employee',
    vehicleType: data.get('vehicleType') || 'truck',
    truck: data.get('truck') || 'Ingen bil',
    phone: data.get('phone') || '',
    email,
    department: data.get('department') || '',
    license: data.get('license') || '',
    emergencyContact: data.get('emergencyContact') || '',
    languages: data.get('languages') || '',
    employmentStatus: 'active',
    status: 'Invitation klar',
    location: 'Ikke delt',
    online: false,
    sharing: false,
    logbook: data.has('logbook'),
    invitationId: localInvitationId(),
    invitationEmail: email,
    invitationStatus: 'local',
    onboardingMethod: 'standard_password',
    passwordResetRequired: true,
    invitationCreatedAt: new Date().toISOString(),
  };
}

async function prepareEmployeeInvitation(employee) {
  employee.email = normalizeEmployeeEmail(employee.email);
  employee.invitationEmail = employee.email;
  employee.invitationCreatedAt = employee.invitationCreatedAt || new Date().toISOString();
  employee.invitationId = employee.invitationId || localInvitationId();
  employee.invitationStatus = 'local';
  if (!onlineBackendActive()) return { onlineCreated: false };
  try {
    const supabaseInvitationId = await createSupabaseEmployeeInvitation(employee);
    if (supabaseInvitationId) employee.invitationId = supabaseInvitationId;
    employee.invitationStatus = 'online';
    employee.status = 'Invitation online';
    return { onlineCreated: Boolean(supabaseInvitationId) };
  } catch (error) {
    return { onlineCreated: false, error };
  }
}

async function syncSupabaseCoreSettings() {
  const client = getSupabaseClient();
  if (!client || !session?.userId || !canManageEmployees()) return;
  const rows = [
    ['gps', coreSettings.gps, 'Frivillig live-position'],
    ['media', coreSettings.media, 'Billeder i chat, opslag, profil og logbog'],
    ['logbook', coreSettings.logbook, 'Personlig privat logbog'],
    ['employee_posts', coreSettings.employeePosts, 'Kollegaopslag på forsiden'],
    ['rule_approval', coreSettings.ruleApproval, 'Regelnyt kræver godkendelse før publicering'],
  ].map(([key, enabled, description]) => ({ key, enabled, description, updated_by: session.userId, updated_at: new Date().toISOString() }));
  const { error } = await client.from('core_settings').upsert(rows);
  if (error) throw error;
}

function adminDashboardStats() {
  const activeEmployees = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const visibleGps = visibleMapPeople();
  const vehicleIssues = vehicles.filter(vehicle => /værksted|service|afventer|tjek/i.test(vehicle.status || vehicle.nextCheck || '')).length;
  const unreadOffice = notifications.filter(item => item.unread && notificationCategory(item) === 'office').length;
  return {
    activeEmployees: activeEmployees.length,
    checkedIn: workday.active ? 1 : 0,
    visibleGps: visibleGps.length,
    activePickups: activePickup ? 1 : 0,
    vehicleIssues,
    unreadOffice,
    pendingRules: ruleUpdates.filter(update => update.status !== 'approved').length,
    offboarded: employees.filter(employee => employee.employmentStatus === 'offboarded').length,
  };
}

function adminDashboardAlerts(stats = adminDashboardStats()) {
  const alerts = [];
  if (activePickup) {
    const helper = employees.find(employee => employee.id === activePickup.employeeId);
    alerts.push({
      tone: activePickup.status === 'blocked' ? 'urgent' : 'task',
      title: `Afhentning: ${pickupStatusLabel(activePickup.status)}`,
      body: `${helper?.name || 'Kollega'} · ${activePickup.pickupPlace || 'sted mangler'} → ${activePickup.dropoffPlace || 'aflevering mangler'}`,
      action: 'open-pickup',
    });
  }
  if (!coreSettings.gps) alerts.push({ tone: 'privacy', title: 'GPS er slået fra', body: 'Medarbejdere kan ikke dele liveposition, før chef/admin aktiverer funktionen igen.', action: 'open-admin' });
  if (!coreSettings.media) alerts.push({ tone: 'privacy', title: 'Billeder er slået fra', body: 'Chatbilleder, dokumentation og profilbilleder er midlertidigt lukket.', action: 'open-admin' });
  if (stats.vehicleIssues) alerts.push({ tone: 'task', title: 'Køretøj kræver opmærksomhed', body: `${stats.vehicleIssues} bil/enhed har service, værksted eller tjek i status.`, action: 'open-vehicles' });
  if (!legalAcceptance) alerts.push({ tone: 'privacy', title: 'Jura mangler accept', body: 'Sikkerhed og persondata bør gennemgås, før appen bruges rigtigt.', action: 'open-legal' });
  return alerts;
}

function launchChecklistItems() {
  const backend = supabaseStatus();
  return [
    { id: 'schema', title: 'Supabase schema er kørt', body: 'Kør supabase/schema.sql i Supabase SQL editoren, inkl. RLS, Storage og realtime.', done: backend.ready },
    { id: 'keys', title: 'URL og offentlig nøgle er sat', body: 'Indsæt Supabase URL og anon/publishable key i Indstillinger. Brug aldrig service-role i appen.', done: backend.ready },
    { id: 'security', title: 'Sikkerhedspakke er gennemgået', body: 'Tjek hacking-beskyttelse, mistet telefon, admin-adgang, upload, audit-log og Supabase Security Advisor.', done: securityReadiness().percent >= 60 },
    { id: 'admin', title: 'Første chef/admin er oprettet', body: 'Opret brugeren i Supabase Auth og kør supabase/first-admin.sql med brugerens email.', done: canManageEmployees() && session?.mode === 'supabase' },
    { id: 'legal', title: 'Jura og persondata er accepteret', body: 'GPS-formål, billeder, chat, slettefrister og databehandleraftale skal være besluttet.', done: Boolean(legalAcceptance) },
    { id: 'gdpr_package', title: 'GDPR go-live pakke er gennemgået', body: 'Medarbejderinfo, dataanmodninger, slettefrister og sikkerhedsbrud er samlet og gennemgået.', done: gdprGoLiveReadiness().percent >= 60 },
    { id: 'mobile', title: 'Testet på telefon', body: 'Test login, mød ind, GPS, livekort, chat, billeder, opslag og afhentning på mindst to telefoner.', done: false },
    { id: 'team', title: 'Medarbejdere er inviteret', body: 'Chef/admin opretter invitationer, og medarbejdere logger ind med egne Supabase Auth-brugere.', done: employees.some(employee => employee.id !== 'th' && employee.id !== session?.userId) },
  ];
}

function launchReadiness() {
  const items = launchChecklistItems();
  const done = items.filter(item => item.done).length;
  return { done, total: items.length, percent: Math.round((done / items.length) * 100), items };
}

function isCreatorOwner() {
  return profile.accessRole === 'owner';
}

function securityReadinessItems() {
  const backend = supabaseStatus();
  return [
    { id: 'public_key_only', title: 'Ingen service-role i appen', body: 'Frontend må kun bruge offentlig publishable/anon key. Service-role hører aldrig hjemme i appen eller APK.', done: true },
    { id: 'supabase_online', title: 'Supabase-forbindelse testet', body: backend.detail, done: backend.ready },
    { id: 'rls_storage', title: 'RLS og privat storage', body: 'SQL-pakken indeholder RLS på tabeller og privat bucket til billeder med bruger-mappe-regel.', done: true },
    { id: 'security_headers', title: 'Browser-beskyttelse', body: 'Hosting er sat op med CSP, clickjacking-beskyttelse, nosniff, referrer-policy og permissions-policy.', done: true },
    { id: 'admin_audit', title: 'Adminhandlinger logges', body: 'Kritiske adminhandlinger gemmes i audit-log uden privat chat- eller logbogsindhold.', done: adminAuditEvents.length > 0 || canManageEmployees() },
    { id: 'lost_phone', title: 'Mistet telefon-procedure', body: 'Virksomheden skal have en kort procedure: deaktiver bruger, skift kode, log ud/revoker session og tjek aktivitet.', done: false },
    { id: 'mfa', title: 'MFA på ejer/admin', body: 'Supabase owner/admin-konti bør have 2-faktor login før rigtig drift.', done: false },
    { id: 'advisor', title: 'Supabase Security Advisor', body: 'Kør Security Advisor i Supabase dashboard og ret eventuelle advarsler før medarbejdere inviteres bredt.', done: false },
    { id: 'dependencies', title: 'Eksterne biblioteker', body: 'Leaflet og Supabase-js bør på sigt pakkes ind i buildet i stedet for at hentes fra CDN.', done: false },
  ];
}

function securityReadiness() {
  const items = securityReadinessItems();
  const done = items.filter(item => item.done).length;
  return { items, done, total: items.length, percent: Math.round((done / items.length) * 100) };
}

function employeeOnboardingState(employee = {}) {
  const isSelf = employee.id === (session?.userId || 'th') || employee.id === 'th';
  const hasInvite = Boolean(employee.invitationId || employee.invitationEmail || employee.invitationStatus);
  const email = normalizeEmployeeEmail(employee.email || employee.invitationEmail);
  if (employee.employmentStatus === 'offboarded') {
    return { key: 'offboarded', label: 'Deaktiveret', tone: 'neutral', step: 'Brugeren er lukket i appen.', next: 'Aktivér igen hvis personen skal tilbage.' };
  }
  if (isSelf && session?.mode === 'supabase') {
    return { key: 'ready', label: 'Aktiv', tone: 'good', step: 'Du er logget ind i online-appen.', next: 'Ingen handling.' };
  }
  if (!email) {
    return { key: 'missing-email', label: 'Mangler mail', tone: 'risk', step: 'Profilen mangler arbejdsmail.', next: 'Åbn profilen og tilføj mail før invitation.' };
  }
  if (!hasInvite) {
    return { key: 'missing-invite', label: 'Mangler invitation', tone: 'risk', step: 'Der er ikke gemt en invitation på profilen.', next: 'Åbn invitation og send linket til kollegaen.' };
  }
  if (employee.invitationStatus === 'local') {
    return { key: 'local-only', label: 'Kun lokalt', tone: 'warn', step: 'Invitationen er klar på denne enhed, men ikke bekræftet online.', next: 'Tjek Supabase og opret invitationen igen hvis nødvendigt.' };
  }
  if (employee.passwordResetRequired) {
    return { key: 'needs-password', label: 'Mangler personlig kode', tone: 'warn', step: 'Kollegaen skal logge ind via invitationslink og vælge egen kode.', next: 'Send invitation eller gensend bekræftelsesmail.' };
  }
  if (employee.online) {
    return { key: 'ready', label: 'I brug', tone: 'good', step: 'Kollegaen er aktiv i appen.', next: 'Ingen handling.' };
  }
  return { key: 'invited', label: 'Inviteret', tone: 'warn', step: 'Invitationen er klar, men første brug er ikke tydeligt registreret her.', next: 'Send linket igen hvis kollegaen ikke kan komme ind.' };
}

function onboardingOverviewStats() {
  const managed = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const states = managed.map(employeeOnboardingState);
  const needsAttention = states.filter(state => ['missing-email', 'missing-invite', 'local-only', 'needs-password', 'invited'].includes(state.key)).length;
  return {
    total: managed.length,
    ready: states.filter(state => state.key === 'ready').length,
    invited: states.filter(state => state.key === 'invited').length,
    needsPassword: states.filter(state => state.key === 'needs-password').length,
    localOnly: states.filter(state => state.key === 'local-only').length,
    missing: states.filter(state => ['missing-email', 'missing-invite'].includes(state.key)).length,
    needsAttention,
  };
}

function renderOnboardingControlPanel({ compact = false } = {}) {
  if (!canManageEmployees()) return '';
  const stats = onboardingOverviewStats();
  const rows = employees
    .filter(employee => employee.employmentStatus !== 'offboarded')
    .map(employee => ({ employee, state: employeeOnboardingState(employee) }))
    .sort((a, b) => {
      const order = { risk: 0, warn: 1, neutral: 2, good: 3 };
      return (order[a.state.tone] ?? 2) - (order[b.state.tone] ?? 2) || String(a.employee.name).localeCompare(String(b.employee.name), 'da');
    });
  return `<section class="onboarding-control-panel ${compact ? 'compact' : ''}">
    <div class="onboarding-head">
      <div><p class="eyebrow">Onboarding</p><h4>Medarbejdere ind i appen</h4><span>Følg invitation, første login og personlig kode uden at vise private beskeder.</span></div>
      <button type="button" data-action="new-employee">Ny medarbejder</button>
    </div>
    <div class="onboarding-kpis">
      <span><b>${stats.total}</b><small>Profiler</small></span>
      <span><b>${stats.ready}</b><small>Klar</small></span>
      <span><b>${stats.needsPassword}</b><small>Mangler kode</small></span>
      <span><b>${stats.needsAttention}</b><small>Skal følges op</small></span>
    </div>
    <div class="onboarding-flow">
      <span class="${stats.missing ? 'warn' : 'ok'}"><b>1</b><small>Profil + mail</small></span>
      <span class="${stats.localOnly ? 'warn' : 'ok'}"><b>2</b><small>Invitation online</small></span>
      <span class="${stats.needsPassword || stats.invited ? 'warn' : 'ok'}"><b>3</b><small>Første login</small></span>
      <span class="${stats.ready === stats.total && stats.total ? 'ok' : 'warn'}"><b>4</b><small>Klar i drift</small></span>
    </div>
    <div class="onboarding-list">
      ${rows.map(({ employee, state }) => `<article class="${text(state.tone)}">
        <span class="person-avatar">${text(employee.initials || initialsFromName(employee.name))}</span>
        <div><b>${text(employee.name)}</b><small>${text(employee.email || 'Mail mangler')} · ${text(vehicleLabel(employee.vehicleType))}</small><em>${text(state.step)}</em></div>
        <strong>${text(state.label)}</strong>
        <nav>
          <button type="button" data-open-employee-invite="${text(employee.id)}">Invitation</button>
          ${employee.email ? `<button type="button" data-resend-confirmation="${text(employee.email)}">Mail</button>` : ''}
          <button type="button" data-employee="${text(employee.id)}">Profil</button>
        </nav>
      </article>`).join('')}
    </div>
    <p class="onboarding-note">Bemærk: Supabase skjuler bekræftet mail-status for den almindelige app af sikkerhedsgrunde. Hvis vi senere vil se “mail bekræftet” 100%, skal det laves via en sikker admin/Edge Function.</p>
  </section>`;
}

function creatorOperationsStats() {
  const backend = supabaseStatus();
  const readiness = launchReadiness();
  const onboarding = onboardingOverviewStats();
  const activeEmployees = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const directChats = chats.filter(chat => !chat.channel).length;
  const channelChats = chats.filter(chat => chat.channel).length;
  const unreadNotifications = notifications.filter(item => item.unread).length;
  const disabledCore = Object.entries(coreSettings).filter(([, enabled]) => !enabled).length;
  const pendingDataRequests = dataRequests.filter(request => !/closed|done|afsluttet/i.test(request.status || '')).length;
  const security = securityReadiness();
  const managedDataAreas = [employees, chats, notifications, vehicles, ruleUpdates, announcements, dataRequests]
    .filter(list => Array.isArray(list) && list.length).length;
  const risks = [
    !backend.ready,
    readiness.percent < 100,
    security.percent < 75,
    !legalAcceptance,
    disabledCore > 0,
    pendingDataRequests > 0,
    appUpdateState.required,
    isPlaceholderUpdateConfig(),
  ].filter(Boolean).length;
  return {
    version: APP_DISPLAY_VERSION,
    versionCode: APP_VERSION_CODE,
    updateStatus: updateStatusLabel(),
    backend,
    readiness,
    onboarding,
    activeEmployees: activeEmployees.length,
    directChats,
    channelChats,
    unreadNotifications,
    disabledCore,
    pendingDataRequests,
    security,
    managedDataAreas,
    risks,
  };
}

function creatorOperationsActionItems(stats = creatorOperationsStats()) {
  const items = [];
  if (appUpdateState.required) items.push({ tone: 'risk', title: 'App-opdatering kræves', body: `${appUpdateState.required.activeVersion} er markeret som påkrævet.`, action: 'show-update-status' });
  if (isPlaceholderUpdateConfig()) items.push({ tone: 'warn', title: 'GitHub placeholder', body: 'Skift GitHub-placeholder før medarbejdere får opdateringslink.', action: 'show-update-status' });
  if (!stats.backend.ready) items.push({ tone: 'risk', title: 'Supabase skal tjekkes', body: stats.backend.detail, action: 'test-supabase' });
  if (stats.onboarding.needsAttention) items.push({ tone: 'warn', title: 'Onboarding kræver opfølgning', body: `${stats.onboarding.needsAttention} medarbejder(e) mangler invitation, første login eller personlig kode.`, action: 'open-admin' });
  if (stats.readiness.percent < 100) items.push({ tone: 'warn', title: 'Go-live er ikke helt klar', body: `${stats.readiness.done}/${stats.readiness.total} punkter er klar til professionel brug.`, action: 'open-launch-checklist' });
  if (stats.security.percent < 75) items.push({ tone: 'risk', title: 'Sikkerhedspakken mangler', body: `${stats.security.done}/${stats.security.total} sikkerhedspunkter er markeret klar.`, action: 'open-security-center' });
  if (!legalAcceptance) items.push({ tone: 'risk', title: 'Jura og persondata mangler', body: 'Godkend interne regler for GPS, billeder, chat, logbog og slettefrister.', action: 'open-legal' });
  if (stats.disabledCore) items.push({ tone: 'warn', title: 'Kernefunktioner er slukket', body: `${stats.disabledCore} funktion(er) er midlertidigt lukket for medarbejderne.`, action: 'open-admin' });
  if (stats.pendingDataRequests) items.push({ tone: 'warn', title: 'Persondata skal behandles', body: `${stats.pendingDataRequests} dataanmodning(er) ligger aabne.`, action: 'open-my-data' });
  if (!items.length) items.push({ tone: 'good', title: 'Ingen akutte driftspunkter', body: 'Appen ser rolig ud lige nu. Hold stadig oeje med go-live og telefon-test.', action: 'open-launch-checklist' });
  return items.slice(0, 5);
}

function creatorOperationsMissingItems(stats = creatorOperationsStats()) {
  const missingProfiles = employees.filter(employee => employee.employmentStatus !== 'offboarded' && (!employee.phone || !employee.email || !employee.department)).length;
  const vehicleMissingStatus = vehicles.filter(vehicle => !vehicle.status || !vehicle.nextCheck).length;
  const pendingRules = ruleUpdates.filter(update => update.status !== 'approved').length;
  return [
    { label: 'Profiler', value: missingProfiles, detail: missingProfiles ? 'mangler telefon, mail eller afdeling' : 'ser udfyldte ud' },
    { label: 'Koeretoejer', value: vehicleMissingStatus, detail: vehicleMissingStatus ? 'mangler status eller naeste tjek' : 'har status og tjek' },
    { label: 'Regelnyt', value: pendingRules, detail: pendingRules ? 'kladder/godkendelser venter' : 'intet venter' },
    { label: 'Supabase', value: stats.backend.ready ? 0 : 1, detail: stats.backend.ready ? 'online status er sat' : 'backend skal tjekkes' },
  ];
}

function creatorProfessionalPlanItems() {
  return [
    { phase: 'Design', score: 72, title: 'Ens sider og roligere layout', body: 'Samme kort, spacing, knapper og tekstniveau paa forside, chat, kort, profiler og drift.' },
    { phase: 'Chauffoerflow', score: 68, title: 'Hverdagsopgaver skal vaere hurtigere', body: 'Moed ind, del position, hent for kollega, CMR/billeder og beskeder skal kunne klares med faa tryk.' },
    { phase: 'Funktioner', score: 64, title: 'Mangler de sidste arbejdsfunktioner', body: 'Opgaver, dokumentation, koeretoejstjek, opslag og logbog skal samles bedre og fjerne dubletter.' },
    { phase: 'Drift', score: 76, title: 'Creator og chef skal kunne styre appen', body: 'Versionsstatus, fejlcenter, brugerroller, kernefunktioner og go-live skal ligge samlet i drift.' },
    { phase: 'Data', score: 70, title: 'Supabase skal valideres i rigtig brug', body: 'RLS, upload, chat, profiler, invitationer og livekort skal testes med rigtige brugere.' },
    { phase: 'Udgivelse', score: 58, title: 'APK og medarbejderudrulning mangler finish', body: 'Ren release-build, telefon-test, installationsguide, opdateringsflow og supportvejledning.' },
  ];
}

function gdprGoLiveItems() {
  const backend = supabaseStatus();
  return [
    { id: 'employee_info', title: 'Medarbejderinformation', body: 'Forklar formål, GPS, chat, billeder, logbog, rettigheder og hvem der kan se hvad.', done: Boolean(legalAcceptance) },
    { id: 'supabase_rls', title: 'Supabase og RLS', body: 'Backend er sat, RLS er slået til, og appen bruger kun offentlig anon/publishable key.', done: backend.ready },
    { id: 'retention', title: 'Slettefrister', body: 'Live GPS, billeder, chat og audit-log har konkrete frister og oprydningsfunktion i SQL.', done: true },
    { id: 'data_requests', title: 'Dataanmodninger', body: 'Medarbejdere kan sende indsigt, rettelse, sletning, eksport, begrænsning og indsigelse.', done: true },
    { id: 'admin_process', title: 'Admin-proces', body: 'Creator/chef kan se åbne persondatasager uden at læse private chats eller logbøger.', done: canManageEmployees() || isCreatorOwner() },
    { id: 'supplier_docs', title: 'Databehandleraftaler', body: 'Supabase, hosting, kort og mail skal dokumenteres af virksomheden før rigtig drift.', done: false },
    { id: 'risk_review', title: 'Risikovurdering/DPIA', body: 'GPS og medarbejderkontrol skal risikovurderes og godkendes internt.', done: false },
    { id: 'breach_process', title: 'Sikkerhedsbrud', body: 'Aftal ansvarlig, intern log og vurdering af anmeldelse til Datatilsynet ved brud.', done: false },
  ];
}

function gdprGoLiveReadiness() {
  const items = gdprGoLiveItems();
  const done = items.filter(item => item.done).length;
  return { items, done, total: items.length, percent: Math.round((done / items.length) * 100) };
}

function openDataRequestsCount() {
  return dataRequests.filter(request => !/completed|closed|done|afsluttet|rejected/i.test(request.status || '')).length;
}

function renderGdprGoLivePanel({ compact = false } = {}) {
  const readiness = gdprGoLiveReadiness();
  return `<section class="gdpr-go-live-panel ${compact ? 'compact' : ''}">
    <div class="gdpr-score">
      <span><b>${readiness.percent}%</b><small>GDPR go-live</small></span>
      <em><i style="width:${readiness.percent}%"></i></em>
      <p>${readiness.done}/${readiness.total} punkter markeret klar. Juridisk godkendelse skal stadig ske i virksomheden.</p>
    </div>
    <div class="gdpr-check-grid">
      ${readiness.items.map(item => `<span class="${item.done ? 'done' : 'todo'}"><b>${item.done ? '✓' : '○'} ${text(item.title)}</b><small>${text(item.body)}</small></span>`).join('')}
    </div>
  </section>`;
}

function completeDataRequest(requestId) {
  if (!canManageEmployees() && !isCreatorOwner()) {
    showToast('Kun chef/admin kan afslutte dataanmodninger');
    return;
  }
  const request = dataRequests.find(item => item.id === requestId);
  if (!request) return;
  request.status = 'completed';
  request.handledAt = new Date().toLocaleDateString('da-DK');
  request.handledBy = profile.name;
  save('dataRequests', dataRequests);
  recordAdminAudit('Dataanmodning afsluttet', `${request.label || request.requestType} blev markeret som behandlet`);
  updateSupabaseDataRequest(request).catch(error => showToast(`Dataanmodningen blev opdateret lokalt, men ikke online: ${error.message}`));
  document.querySelector('.modal-backdrop')?.remove();
  openGdprGoLiveModal();
  showToast('Dataanmodningen er markeret som behandlet');
}

function creatorUserTestItems() {
  const backend = supabaseStatus();
  const activeEmployees = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const hasTruckProfile = activeEmployees.some(employee => employee.vehicleType === 'truck');
  const hasVanProfile = activeEmployees.some(employee => employee.vehicleType === 'van');
  const canUseAsEmployee = action => {
    const previousProfile = profile;
    profile = { ...profile, email: 'employee-test@example.com', accessRole: 'employee', role: 'Chauffør', vehicleType: 'truck' };
    const allowed = canUseInternalAction(action);
    profile = previousProfile;
    return allowed;
  };
  const employeeCanSeeAdmin = canUseAsEmployee('open-admin');
  const employeeCanSeeCreator = canUseAsEmployee('test-supabase') || canUseAsEmployee('open-rollback-center');
  const truckChat = chats.find(chat => chat.channel === 'truck');
  const vanChat = chats.find(chat => chat.channel === 'van');
  const publicChat = chats.find(chat => chat.community);
  const data = [
    {
      area: 'Forside',
      title: 'Chaufførens startside er enkel',
      body: 'Forsiden har hverdagsstatus, hurtige handlinger og skjuler ekstra driftsting for medarbejdere.',
      done: true,
      warn: false,
      action: 'home',
    },
    {
      area: 'Adgang',
      title: 'Employee ser ikke admin/creator',
      body: employeeCanSeeAdmin || employeeCanSeeCreator
        ? 'Medarbejderrollen kan stadig åbne en beskyttet handling. Det skal undersøges før bred test.'
        : 'Medarbejderrollen er blokeret fra admin, creator-test og rollback.',
      done: !employeeCanSeeAdmin && !employeeCanSeeCreator,
      warn: false,
      action: 'more',
    },
    {
      area: 'Roller',
      title: 'Creator kan teste perspektiver',
      body: 'Lastbil, varebil, disponent og chef/admin kan vælges lokalt uden at ændre rigtige roller.',
      done: canUseCreatorRoleTester() && Object.keys(creatorRolePresets).length >= 5,
      warn: false,
      action: 'more',
    },
    {
      area: 'Chat',
      title: 'Fælles og interne chats er adskilt',
      body: publicChat && truckChat && vanChat
        ? 'Fælles, lastbil og varebil findes som separate kanaler.'
        : 'En eller flere standardkanaler mangler i appens lokale chatliste.',
      done: Boolean(publicChat && truckChat && vanChat),
      warn: false,
      action: 'chat',
    },
    {
      area: 'Livekort',
      title: 'Livekort har kort og GPS-status',
      body: coreSettings.gps
        ? 'GPS-funktionen er slået til, og livekortet kan vise aktive delinger.'
        : 'GPS er slået fra i kernefunktioner. Det er ok, hvis det er et bevidst valg.',
      done: true,
      warn: !coreSettings.gps,
      action: 'map',
    },
    {
      area: 'Information',
      title: 'Information er samlet for ældre brugere',
      body: 'Kontaktliste, akut hjælp, søgning og emner ligger samlet i informationspanelet.',
      done: companyContacts.length >= 3 && infoSections.length >= 4,
      warn: false,
      action: 'info',
    },
    {
      area: 'Onboarding',
      title: 'Medarbejderoprettelse kan følges op',
      body: onboardingOverviewStats().needsAttention
        ? `${onboardingOverviewStats().needsAttention} medarbejder(e) kræver opfølgning på invitation/login.`
        : 'Aktive profiler ser klarere ud i onboarding-overblikket.',
      done: onboardingOverviewStats().needsAttention === 0,
      warn: onboardingOverviewStats().needsAttention > 0,
      action: 'open-admin',
    },
    {
      area: 'Billeder',
      title: 'Billeder og profilfoto er slået til',
      body: coreSettings.media
        ? 'Upload er åben for profilfoto, chatbilleder og dokumentation.'
        : 'Billeder er slået fra af chef/admin.',
      done: coreSettings.media,
      warn: !coreSettings.media,
      action: 'open-settings',
    },
    {
      area: 'Backend',
      title: 'Onlineforbindelse er klar',
      body: backend.detail,
      done: backend.ready,
      warn: !backend.ready,
      action: 'test-supabase',
    },
    {
      area: 'Telefon-test',
      title: 'Rigtig test med flere telefoner mangler',
      body: hasTruckProfile && hasVanProfile
        ? 'Der findes både lastbil- og varebilprofiler, men rigtig live-test skal stadig gøres på telefoner.'
        : 'Opret mindst én lastbil- og én varebilprofil før den bedste realtest.',
      done: false,
      warn: true,
      action: 'open-admin',
    },
  ];
  return data.map(item => ({
    ...item,
    status: item.done ? 'Bestået' : item.warn ? 'Bør tjekkes' : 'Fejl',
    tone: item.done ? 'ok' : item.warn ? 'warn' : 'fail',
  }));
}

function creatorUserTestReadiness() {
  const items = creatorUserTestItems();
  const passed = items.filter(item => item.done).length;
  const warnings = items.filter(item => !item.done && item.warn).length;
  const failures = items.filter(item => !item.done && !item.warn).length;
  const score = Math.round((passed / items.length) * 100);
  const label = failures ? 'Fejl skal rettes' : warnings ? 'Klar til kontrolleret test' : 'Ser klar ud';
  return { items, passed, warnings, failures, total: items.length, score, label };
}

function renderCreatorUserTestPanel({ compact = false } = {}) {
  if (!isCreatorOwner()) return '';
  const test = creatorUserTestReadiness();
  return `<section class="creator-user-test-panel ${compact ? 'compact' : ''}">
    <div class="creator-user-test-head">
      <div><p class="eyebrow">Brugertest</p><h4>Kør appen igennem som medarbejder</h4><span>Samler de vigtigste brugerrejser uden at åbne private beskeder eller logbøger.</span></div>
      <strong class="${test.failures ? 'risk' : test.warnings ? 'warn' : 'good'}">${test.score}%</strong>
    </div>
    <div class="creator-user-test-kpis">
      <span><b>${test.passed}</b><small>Bestået</small></span>
      <span><b>${test.warnings}</b><small>Bør tjekkes</small></span>
      <span><b>${test.failures}</b><small>Fejl</small></span>
    </div>
    <div class="creator-user-test-list">
      ${test.items.map(item => `<button type="button" class="${text(item.tone)}" ${['home', 'work', 'team', 'map', 'chat', 'more', 'info'].includes(item.action) ? `data-tab="${text(item.action)}"` : `data-action="${text(item.action)}"`}>
        <span><b>${text(item.area)}</b><strong>${text(item.status)}</strong></span>
        <em>${text(item.title)}</em>
        <small>${text(item.body)}</small>
      </button>`).join('')}
    </div>
  </section>`;
}

function openCreatorUserTestModal() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan køre samlet brugertest');
    return;
  }
  const test = creatorUserTestReadiness();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal creator-user-test-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Creator QA</p>
    <h3>${text(test.label)}</h3>
    <p class="info-intro">Denne rapport tester appens vigtigste brugerrejser ud fra den aktuelle konfiguration. Den erstatter ikke en rigtig test på telefon, men den finder hurtigt oplagte fejl før opdatering.</p>
    ${renderCreatorUserTestPanel({ compact: true })}
    <section class="creator-ops-privacy">
      <b>Privatlivsvagt</b>
      <span>Rapporten bruger kun status, roller og antal. Den viser ikke indhold fra direkte beskeder, private logbøger eller billeder.</span>
    </section>
  </section>`;
  document.body.append(modal);
}

function renderCreatorOperationsDashboard() {
  if (!isCreatorOwner()) return '';
  const stats = creatorOperationsStats();
  const actionItems = creatorOperationsActionItems(stats);
  const missingItems = creatorOperationsMissingItems(stats);
  const professionalPlan = creatorProfessionalPlanItems();
  const healthLabel = stats.risks === 0 ? 'Stabil' : stats.risks <= 2 ? 'Tjek anbefales' : 'Kraever fokus';
  const healthClass = stats.risks === 0 ? 'good' : stats.risks <= 2 ? 'warn' : 'risk';
  return `<section class="creator-ops-dashboard">
    <div class="creator-ops-hero">
      <div><p class="eyebrow">Creator drift</p><h4>Appens drift</h4><span>Teknik, sikkerhed, data og kernefunktioner samlet uden at vise privat chatindhold.</span></div>
      <strong class="${healthClass}">${text(healthLabel)}</strong>
    </div>
    <div class="creator-ops-grid">
      <span><b>${text(stats.backend.label)}</b><small>Supabase</small></span>
      <span><b>${stats.readiness.percent}%</b><small>Klar til drift</small></span>
      <span><b>${stats.onboarding.needsAttention}</b><small>Onboarding</small></span>
      <span><b>${stats.activeEmployees}</b><small>Aktive profiler</small></span>
      <span><b>${stats.channelChats}/${stats.directChats}</b><small>Kanaler / direkte</small></span>
      <span><b>${stats.unreadNotifications}</b><small>Ulaeste beskeder</small></span>
      <span><b>${stats.disabledCore}</b><small>Funktioner slukket</small></span>
      <span><b>${stats.pendingDataRequests}</b><small>Dataanmodninger</small></span>
      <span><b>${stats.security.percent}%</b><small>Sikkerhed</small></span>
    </div>
    <div class="creator-ops-actions">
      <button type="button" data-action="open-creator-user-test">Kør brugertest</button>
      <button type="button" data-action="test-supabase">Test Supabase</button>
      <button type="button" data-action="check-update">Tjek update</button>
      <button type="button" data-action="open-rollback-center">Backup</button>
      <button type="button" data-action="open-launch-checklist">Go-live tjek</button>
      <button type="button" data-action="open-security-center">Sikkerhed</button>
      <button type="button" data-action="open-settings">Backend</button>
    </div>
    ${renderUpdateSummary()}
    ${renderCreatorUserTestPanel({ compact: true })}
    <section class="creator-ops-checks">
      <span class="${stats.backend.ready ? 'ok' : 'fail'}"><b>Forbindelse</b><small>${text(stats.backend.detail)}</small></span>
      <span class="${stats.onboarding.needsAttention ? 'warn' : 'ok'}"><b>Onboarding</b><small>${stats.onboarding.needsAttention ? `${stats.onboarding.needsAttention} medarbejder(e) skal følges op` : 'Alle aktive profiler ser klarere ud'}</small></span>
      <span class="${stats.security.percent >= 75 ? 'ok' : 'warn'}"><b>Sikkerhed</b><small>${stats.security.done}/${stats.security.total} punkter klar mod hacking og misbrug</small></span>
      <span class="${legalAcceptance ? 'ok' : 'warn'}"><b>Jura</b><small>${text(legalStatusText())}</small></span>
      <span class="${stats.disabledCore ? 'warn' : 'ok'}"><b>Kernefunktioner</b><small>${stats.disabledCore ? `${stats.disabledCore} funktion(er) er slaaet fra` : 'Alle kernefunktioner er aabne'}</small></span>
      <span class="${stats.pendingDataRequests ? 'warn' : 'ok'}"><b>Persondata</b><small>${stats.pendingDataRequests ? `${stats.pendingDataRequests} anmodning(er) boer behandles` : 'Ingen aabne dataanmodninger'}</small></span>
    </section>
    <details class="creator-ops-details" open>
      <summary>Onboarding kontrol</summary>
      <section class="creator-ops-panel">
        ${renderOnboardingControlPanel({ compact: true })}
      </section>
    </details>
    <details class="creator-ops-details" open>
      <summary>Hvad skal du holde øje med?</summary>
      <section class="creator-ops-panel">
      ${actionItems.map(item => `<button type="button" class="${text(item.tone)}" data-action="${text(item.action)}"><b>${text(item.title)}</b><small>${text(item.body)}</small></button>`).join('')}
      </section>
    </details>
    <details class="creator-ops-details" open>
      <summary>Creator genveje</summary>
      <section class="creator-ops-panel">
      <div class="creator-ops-shortcuts">
        <button type="button" data-action="new-employee">Registrer kollega</button>
        <button type="button" data-action="open-security-center">Sikkerhedscenter</button>
        <button type="button" data-action="open-gdpr-go-live">GDPR pakke</button>
        <button type="button" data-action="new-announcement">Nyt opslag</button>
        <button type="button" data-action="open-rule-updates">Regelnyt</button>
        <button type="button" data-action="open-vehicles">Koeretoejer</button>
        <button type="button" data-tab="map">Livekort</button>
        <button type="button" data-tab="chat">Beskeder</button>
      </div>
      </section>
    </details>
    <details class="creator-ops-details">
      <summary>Test appen som</summary>
      <section class="creator-ops-panel">
      <div class="creator-ops-role-test">
        <button type="button" data-creator-role="truck">Lastbil</button>
        <button type="button" data-creator-role="van">Varebil</button>
        <button type="button" data-creator-role="dispatcher">Disponent</button>
        <button type="button" data-creator-role="admin">Chef/admin</button>
      </div>
      <p>Skifter kun dit lokale perspektiv, saa du kan se om menuer, chat og rettigheder giver mening.</p>
      </section>
    </details>
    <details class="creator-ops-details">
      <summary>Mangler og kvalitet</summary>
      <section class="creator-ops-panel">
      <div class="creator-ops-missing">
        ${missingItems.map(item => `<span class="${item.value ? 'warn' : 'ok'}"><b>${text(item.label)}</b><strong>${text(item.value)}</strong><small>${text(item.detail)}</small></span>`).join('')}
      </div>
      </section>
    </details>
    <details class="creator-ops-details">
      <summary>Professionel færdiggørelse</summary>
      <section class="creator-ops-panel creator-pro-plan">
      <p>De pakker der stadig skal loeftes, foer appen foeles helt faerdig til medarbejdere i drift.</p>
      <div class="creator-pro-list">
        ${professionalPlan.map(item => `<article>
          <div><b>${text(item.phase)}</b><strong>${item.score}%</strong></div>
          <em><i style="width:${item.score}%"></i></em>
          <span><b>${text(item.title)}</b><small>${text(item.body)}</small></span>
        </article>`).join('')}
      </div>
      </section>
    </details>
    <section class="creator-ops-privacy">
      <b>Privatlivsvagt</b>
      <span>Creator kan styre drift, sikkerhed og kvalitet. Panelet viser tal og status, men ikke indhold fra direkte beskeder eller private logboeger. Åbne dataanmodninger: ${openDataRequestsCount()}.</span>
    </section>
  </section>`;
}

function renderAdminDashboard() {
  const stats = adminDashboardStats();
  const alerts = adminDashboardAlerts(stats);
  const activeEmployees = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const visibleGps = visibleMapPeople();
  const latestAudit = adminAuditEvents.slice(0, 4);
  const readiness = launchReadiness();
  return `<section class="admin-dashboard">
    ${renderCreatorOperationsDashboard()}
    <div class="admin-dashboard-hero">
      <div><p class="eyebrow">Chef-dashboard</p><h4>Kontrol uden at læse privat chat</h4><span>Drift, medarbejdere, opgaver og kernefunktioner samlet et sted.</span></div>
      <button type="button" data-action="open-dispatch">Åbn drift</button>
    </div>
    <button type="button" class="launch-readiness-card" data-action="open-launch-checklist">
      <span><b>${readiness.percent}%</b><small>Klar til drift</small></span>
      <em><i style="width:${readiness.percent}%"></i></em>
      <strong>${readiness.done}/${readiness.total} punkter klar · åbn tjekliste</strong>
    </button>
    <button type="button" class="launch-readiness-card gdpr-card" data-action="open-gdpr-go-live">
      <span><b>${gdprGoLiveReadiness().percent}%</b><small>GDPR pakke</small></span>
      <em><i style="width:${gdprGoLiveReadiness().percent}%"></i></em>
      <strong>${openDataRequestsCount()} åbne dataanmodninger · åbn persondata</strong>
    </button>
    <div class="admin-kpi-grid">
      <span><b>${stats.activeEmployees}</b><small>aktive medarbejdere</small></span>
      <span><b>${stats.checkedIn}</b><small>mødt ind i dag</small></span>
      <span><b>${stats.visibleGps}</b><small>synlige GPS</small></span>
      <span><b>${stats.activePickups}</b><small>aktive afhentninger</small></span>
      <span><b>${stats.vehicleIssues}</b><small>bil-tjek</small></span>
      <span><b>${stats.unreadOffice}</b><small>ulæst kontor</small></span>
    </div>
    ${isCreatorOwner() ? '' : `<div class="admin-command-row">
      <button type="button" data-action="new-employee">Registrér kollega</button>
      <button type="button" data-action="new-announcement">Kontoropslag</button>
      <button type="button" data-action="open-rule-updates">Regelnyt</button>
      <button type="button" data-action="open-vehicles">Køretøjer</button>
    </div>`}
    <section class="admin-alert-list">
      <h4>Kræver opmærksomhed</h4>
      ${alerts.length ? alerts.map(alert => `<button type="button" class="${text(alert.tone)}" data-action="${text(alert.action)}"><b>${text(alert.title)}</b><small>${text(alert.body)}</small></button>`).join('') : '<p class="empty-state">Ingen kritiske ting lige nu.</p>'}
    </section>
    <section class="admin-live-list">
      <h4>Live status</h4>
      ${activeEmployees.slice(0, 6).map(employee => `<article><span>${avatar(employee)}</span><div><b>${text(employee.name)}</b><small>${text(vehicleLabel(employee.vehicleType))} · ${text(employee.status)} · ${visibleGps.some(person => person.id === employee.id) ? 'GPS synlig' : 'GPS skjult'}</small></div><button type="button" data-employee="${text(employee.id)}">Profil</button></article>`).join('')}
    </section>
    <section class="admin-audit-list">
      <h4>Seneste adminhandlinger</h4>
      ${latestAudit.length ? latestAudit.map(item => `<span><b>${text(item.title)}</b><small>${text(item.time)} · ${text(item.actor)} · ${text(item.body)}</small></span>`).join('') : '<p class="empty-state">Ingen adminhandlinger i demoen endnu.</p>'}
    </section>
  </section>`;
}

function legalStatusText() {
  return legalAcceptance ? `Accepteret ${legalAcceptance.date}` : 'Mangler gennemgang';
}

function accessRoleLabel(accessRole) {
  return {
    employee: 'Medarbejder',
    dispatcher: 'Disponent',
    admin: 'Chef/admin',
    owner: 'Creator',
  }[accessRole] || 'Medarbejder';
}

function profileCompletion(employee = currentEmployee()) {
  const fields = ['phone', 'email', 'department', 'license', 'emergencyContact', 'languages'];
  return Math.round((fields.filter(field => employee[field]).length / fields.length) * 100);
}

function searchable(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function globalSearchResults() {
  const query = globalQuery.trim().toLowerCase();
  if (query.length < 2) return [];
  const matches = value => searchable(value).includes(query);
  const resultSets = [
    employees.map(employee => ({
      type: 'Kollega',
      title: employee.name,
      body: `${employee.role} · ${employee.truck} · ${employee.location}`,
      targetTab: 'team',
    })),
    visibleChats().map(chat => ({
      type: chat.channel ? 'Kanal' : chat.community ? 'Fælleschat' : 'Chat',
      title: chat.name,
      body: chat.preview,
      targetTab: 'chat',
      chatId: chat.id,
    })),
    announcements.filter(item => canReadAudience(item.audience)).map(item => ({
      type: item.kind === 'office' ? 'Kontoropslag' : 'Opslag',
      title: item.title,
      body: `${item.author} · ${item.body}`,
      targetTab: 'home',
    })),
    infoLinks.map(item => ({
      type: 'Information',
      title: item.title,
      body: `${item.source} · ${item.description}`,
      targetTab: 'info',
      infoCategory: item.category,
    })),
    vehicles.map(vehicle => ({
      type: 'Køretøj',
      title: vehicle.unit,
      body: `${vehicle.type} · ${vehicle.status} · ${vehicle.plate}`,
      targetTab: 'more',
      action: 'open-vehicles',
    })),
    logEntries.map(entry => ({
      type: 'Privat logbog',
      title: entry.place,
      body: `${entry.date || 'Logbog'} · ${entry.note}`,
      targetTab: 'more',
      action: 'open-logbook',
    })),
  ];
  return resultSets.flat()
    .filter(item => matches(`${item.type} ${item.title} ${item.body}`))
    .slice(0, 8);
}

function renderGlobalSearch() {
  const results = globalSearchResults();
  return `<section class="global-search">
    <label><span>${icon('search')}</span><input data-global-search placeholder="Søg i appen..." value="${text(globalQuery)}" autocomplete="off" /></label>
    ${globalQuery.trim().length >= 2 ? `<div class="global-search-results">
      ${results.length ? results.map(item => `<button data-search-target="${text(item.targetTab)}" ${item.chatId ? `data-search-chat="${text(item.chatId)}"` : ''} ${item.infoCategory ? `data-search-info="${text(item.infoCategory)}"` : ''} ${item.action ? `data-search-action="${text(item.action)}"` : ''}>
        <small>${text(item.type)}</small><b>${text(item.title)}</b><span>${text(item.body)}</span>
      </button>`).join('') : '<p>Ingen resultater. Prøv navn, bil, by, CMR, GPS eller regel.</p>'}
    </div>` : ''}
  </section>`;
}

function workStatusCounts() {
  return {
    active: workday.active ? 1 : employees.filter(employee => employee.online).length,
    pause: employees.filter(employee => searchable(employee.status).includes('pause')).length,
    help: employees.filter(employee => employee.online && employee.vehicleType !== 'dispatch').length,
    pickup: activePickup ? 1 : 0,
  };
}

function dailyLogbookSummary(stats) {
  const latest = logEntries[0];
  return {
    title: latest ? `${latest.place || 'Dagens tur'}` : 'Ingen minder endnu',
    body: latest ? `${latest.date || 'Seneste'} · ${latest.note}` : 'Når du gemmer steder, billeder eller afhentninger, samler appen dagen her.',
    meta: `${stats.total} minder · ${logbookDrafts.length} kladder · ${stats.places} steder`,
  };
}

function vehicleLabel(vehicleType) {
  if (vehicleType === 'truck') return 'Lastbil';
  if (vehicleType === 'van') return 'Varebil';
  return 'Kontor';
}

function cleanPhone(phone = '') {
  if (globalThis.XpressIntraInfoCenter?.cleanPhone) {
    return globalThis.XpressIntraInfoCenter.cleanPhone(phone);
  }
  return String(phone).replace(/[^\d+]/g, '');
}

function contactDirectoryEntries() {
  if (globalThis.XpressIntraInfoCenter?.contactDirectoryEntries) {
    return globalThis.XpressIntraInfoCenter.contactDirectoryEntries({
      companyContacts,
      employees,
      vehicleLabel,
      initialsFromName,
    });
  }
  const employeeContacts = employees
    .filter(employee => employee.employmentStatus !== 'offboarded')
    .map(employee => ({
      id: `employee-${employee.id}`,
      name: employee.name || 'Kollega',
      role: `${employee.role || vehicleLabel(employee.vehicleType)} · ${employee.truck || employee.department || 'XpressBudet'}`,
      group: employee.department || vehicleLabel(employee.vehicleType),
      phone: employee.phone || '',
      email: employee.email || '',
      initials: employee.initials || initialsFromName(employee.name),
      priority: false,
      employeeId: employee.id,
    }));
  return [...companyContacts, ...employeeContacts];
}

function renderContactDirectory({ limit = null, compact = false } = {}) {
  const contacts = contactDirectoryEntries();
  const visible = limit ? contacts.slice(0, limit) : contacts;
  return `<section class="${compact ? 'contact-directory compact' : 'contact-directory'}">
    ${visible.map(contact => {
      const phone = cleanPhone(contact.phone);
      return `<article class="${contact.priority ? 'priority' : ''}">
        <span class="contact-avatar">${text(contact.initials)}</span>
        <div><b>${text(contact.name)}</b><small>${text(contact.role)}</small><em>${text(contact.group)}</em></div>
        <nav>
          ${phone ? `<a href="tel:${text(phone)}" aria-label="Ring til ${text(contact.name)}">${icon('phone')} Ring</a>` : ''}
          ${contact.email ? `<a href="mailto:${text(contact.email)}" aria-label="Send mail til ${text(contact.name)}">${icon('send')} Mail</a>` : ''}
          ${contact.employeeId ? `<button type="button" data-employee="${text(contact.employeeId)}">Profil</button>` : ''}
        </nav>
      </article>`;
    }).join('')}
  </section>`;
}

function vehicleDriver(vehicle) {
  return employees.find(employee => employee.id === vehicle.driverId);
}

function pickupStatusLabel(status = 'started') {
  return {
    started: 'Startet',
    found: 'Fundet',
    picked_up: 'Hentet',
    delivered: 'Afleveret',
    blocked: 'Kan ikke finde',
    note: 'Note',
  }[status] || 'Startet';
}

function pickupLiveNotes(task = activePickup) {
  return (task?.steps || []).filter(step => step.type === 'note' || step.note);
}

function pickupChecklistItems() {
  return [
    { id: 'route', label: 'Rute og sted tjekket' },
    { id: 'photo', label: 'Billede / dokumentation' },
    { id: 'message', label: 'Kollega opdateret' },
  ];
}

function ensurePickupChecklist(task = activePickup) {
  const existing = task?.checklist || [];
  return pickupChecklistItems().map(item => ({
    ...item,
    done: Boolean(existing.find(saved => saved.id === item.id)?.done),
  }));
}

async function togglePickupChecklist(id) {
  if (!activePickup) return;
  activePickup.checklist = ensurePickupChecklist(activePickup).map(item =>
    item.id === id ? { ...item, done: !item.done } : item
  );
  save('activePickup', activePickup);
  if (onlineBackendActive()) {
    updateSupabasePickupTask().catch(error => showToast(`Tjeklisten blev gemt lokalt, men ikke online: ${error.message}`));
  }
  render();
}

async function addPickupLiveNote(note) {
  if (!activePickup || !note.trim()) return;
  const author = currentEmployee();
  activePickup.steps = activePickup.steps || [];
  activePickup.steps.push({
    status: 'note',
    type: 'note',
    note: note.trim(),
    authorId: session?.userId || author.id,
    authorName: author.name || profile.name || 'Kollega',
    at: new Date().toISOString(),
  });
  save('activePickup', activePickup);
  if (onlineBackendActive()) {
    updateSupabasePickupTask().catch(error => showToast(`Noten blev gemt lokalt, men ikke online: ${error.message}`));
  }
  render({ preserveScroll: true });
  showToast('Live note er tilføjet');
}

function addNotification(notification, options = {}) {
  if (!shouldKeepNotification(notification)) return;
  const item = {
    id: `notification-${Date.now()}`,
    time: 'Nu',
    unread: true,
    priority: notification.level === 'urgent' ? 'high' : notification.level === 'rule' ? 'medium' : 'normal',
    ...notification,
  };
  notifications.unshift(item);
  save('notifications', notifications);
  if (options.system) showSystemNotification(item);
  return item;
}

function notificationCategory(notification) {
  const type = `${notification.type || ''} ${notification.level || ''}`.toLowerCase();
  if (type.includes('regel') || type.includes('rule')) return 'rules';
  if (type.includes('chat') || type.includes('besked') || type.includes('message')) return 'chat';
  if (type.includes('kontor') || type.includes('drift') || type.includes('office') || type.includes('urgent')) return 'office';
  return 'office';
}

function shouldKeepNotification(notification) {
  if (notification.level === 'urgent') return true;
  return notificationPrefs[notificationCategory(notification)] !== false;
}

function notificationSummary() {
  const unread = notifications.filter(item => item.unread).length;
  const urgent = notifications.filter(item => item.unread && item.level === 'urgent').length;
  return {
    unread,
    urgent,
    quietText: notificationPrefs.quietHours ? 'Stille tid 19.00-06.00' : 'Stille tid slået fra',
    dailyBrief: Boolean(notificationPrefs.dailyBrief),
  };
}

function dailyReminders() {
  const reminders = [];
  reminders.push({ title: 'Dokumentation', body: 'Husk billede eller CMR ved skade, afvigelse eller krav fra opgaven.', action: 'open-logbook' });
  if (notifications.some(item => item.unread)) reminders.push({ title: 'Ulæste beskeder', body: `${notifications.filter(item => item.unread).length} ting venter i notifikationer.`, action: 'open-notifications' });
  if (workday.active) reminders.push({ title: 'Automatisk ro', body: 'GPS og arbejdsdag slukker kl. 19.00 dansk tid.', action: 'open-my-data' });
  return reminders.slice(0, 3);
}

function renderReminderPanel() {
  const summary = notificationSummary();
  if (!summary.dailyBrief) return '';
  const reminders = dailyReminders();
  return `<section class="reminder-panel">
    <div><span>Husk i dag</span><small>${text(summary.quietText)}</small></div>
    ${reminders.map(reminder => `<button data-action="${text(reminder.action)}"><b>${text(reminder.title)}</b><small>${text(reminder.body)}</small></button>`).join('')}
  </section>`;
}

function markAllNotificationsRead() {
  notifications = notifications.map(item => ({ ...item, unread: false }));
  save('notifications', notifications);
  if (onlineBackendActive()) {
    markSupabaseNotificationsRead().catch(error => showToast(`Notifikationer blev markeret lokalt, men ikke online: ${error.message}`));
  }
}

function toggleInfoFavorite(id) {
  infoFavorites = infoFavorites.includes(id)
    ? infoFavorites.filter(item => item !== id)
    : [...infoFavorites, id];
  save('infoFavorites', infoFavorites);
}

function myDataSummary() {
  return [
    ['Profil', profile.name, profile.email || 'Mail mangler'],
    ['Rettighed', accessRoleLabel(profile.accessRole), vehicleLabel(profile.vehicleType)],
    ['Arbejdsdag', workday.active ? 'Mødt ind' : 'Ikke aktiv', workday.active ? 'Slukker automatisk kl. 19.00' : 'Tryk Mød ind på forsiden'],
    ['GPS', location.sharing ? 'Deler live' : 'Skjult', location.sharing ? `${location.speed} km/t vises lokalt` : 'Ingen live-deling'],
    ['Logbog', profile.logbook ? 'Aktiv og privat' : 'Fravalgt', `${logEntries.length} private indlæg i demoen`],
    ['Billeder', coreSettings.media ? 'Tilladt' : 'Slået fra', 'Profil, chat, opslag og logbog'],
    ['Dataanmodninger', `${dataRequests.length} i demoen`, 'Indsigt, rettelse, sletning eller eksport'],
  ];
}

function zonedParts(date, timeZone = WORKDAY_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function timezoneOffsetMinutes(date, timeZone = WORKDAY_TIMEZONE) {
  const parts = zonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

function zonedTimeToDate(year, month, day, hour, minute, timeZone = WORKDAY_TIMEZONE) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = timezoneOffsetMinutes(utcGuess, timeZone);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offset * 60000);
}

function workdayEndTime(date = new Date()) {
  if (globalThis.XpressIntraWorkdayLogbook?.workdayEndTime) {
    return globalThis.XpressIntraWorkdayLogbook.workdayEndTime(date, WORKDAY_TIMEZONE);
  }
  const today = zonedParts(date, WORKDAY_TIMEZONE);
  let end = zonedTimeToDate(today.year, today.month, today.day, 19, 0, WORKDAY_TIMEZONE);
  if (date >= end) {
    const tomorrow = zonedParts(new Date(end.getTime() + 24 * 60 * 60 * 1000), WORKDAY_TIMEZONE);
    end = zonedTimeToDate(tomorrow.year, tomorrow.month, tomorrow.day, 19, 0, WORKDAY_TIMEZONE);
  }
  return end;
}

function workdayPermissions() {
  if (globalThis.XpressIntraWorkdayLogbook?.workdayPermissions) {
    return globalThis.XpressIntraWorkdayLogbook.workdayPermissions({
      coreSettings,
      profile,
      workdayPrivacy,
      notificationPrefs,
    });
  }
  return {
    gps: Boolean(coreSettings.gps && workdayPrivacy.gps && workdayPrivacy.audience !== 'none'),
    logbook: Boolean(coreSettings.logbook && profile.logbook && workdayPrivacy.logbook),
    notifications: Boolean(workdayPrivacy.notifications && (notificationPrefs.office || notificationPrefs.rules || notificationPrefs.chat)),
    audience: workdayPrivacy.audience,
    showSpeed: Boolean(workdayPrivacy.showSpeed),
    showVehicle: Boolean(workdayPrivacy.showVehicle),
    showStatus: Boolean(workdayPrivacy.showStatus),
  };
}

async function startWorkday() {
  const permissions = workdayPermissions();
  workday = {
    active: true,
    startedAt: new Date().toISOString(),
    endsAt: workdayEndTime().toISOString(),
    endLabel: '19.00',
    permissions,
  };
  save('workday', workday);
  if (onlineBackendActive()) {
    try {
      await startSupabaseWorkday();
    } catch (error) {
      showToast(`Du er mødt ind på telefonen, men online-synkronisering fejlede: ${error.message}`);
    }
  }
  if (permissions.gps) startLocationSharing('Du er mødt ind, og din position deles efter dine tilladelser');
  if (permissions.logbook) syncLogbookDrafts();
  render();
  showToast('Du er mødt ind. Alt slukker automatisk kl. 19.00');
}

async function endWorkday(message = 'Du er meldt fri, og dagens deling er slukket', status = 'ended') {
  if (onlineBackendActive()) {
    try {
      await endSupabaseWorkday(status);
    } catch (error) {
      showToast(`Arbejdsdagen er stoppet på telefonen, men online-synkronisering fejlede: ${error.message}`);
    }
  }
  workday = { ...workday, active: false, endedAt: new Date().toISOString() };
  save('workday', workday);
  if (location.sharing) {
    stopLocationSharing(message);
    return;
  }
  render();
  showToast(message);
}

function enforceWorkdayExpiry(now = new Date()) {
  if (!workday.active || !workday.endsAt) return;
  if (now < new Date(workday.endsAt)) return;
  endWorkday('Klokken er over 19.00, så arbejdsdagen og deling er slukket automatisk', 'auto_ended');
}

function logbookStats() {
  if (globalThis.XpressIntraWorkdayLogbook?.logbookStats) {
    return globalThis.XpressIntraWorkdayLogbook.logbookStats(logEntries);
  }
  const places = new Set(logEntries.map(entry => entry.place).filter(Boolean));
  return {
    total: logEntries.length,
    places: places.size,
    images: logEntries.filter(entry => entry.image).length,
    auto: logEntries.filter(entry => entry.source === 'auto').length,
    favorites: logEntries.filter(entry => entry.favorite).length,
  };
}

function currentLogbookPlace() {
  const employee = currentEmployee();
  if (globalThis.XpressIntraWorkdayLogbook?.currentLogbookPlace) {
    return globalThis.XpressIntraWorkdayLogbook.currentLogbookPlace({ employee, profile, location });
  }
  const place = location.sharing
    ? employee.location || 'Aktuel GPS-position'
    : employee.location || profile.department || 'Min lokation';
  return location.sharing ? `Min lokation · ${place}` : place;
}

function logbookSuggestions() {
  if (globalThis.XpressIntraWorkdayLogbook?.logbookSuggestions) {
    return globalThis.XpressIntraWorkdayLogbook.logbookSuggestions({
      logbookAutomation,
      employee: currentEmployee(),
      profile,
      location,
      activePickup,
      employees,
      vehicles,
      pickupStatusLabel,
    });
  }
  if (!logbookAutomation.smartLogbook) return [];
  const employee = currentEmployee();
  const suggestions = [];
  if (logbookAutomation.autoPlace) {
    suggestions.push({
      kind: 'current-location',
      title: 'Gem aktuel lokation',
      place: location.sharing ? (employee.location || 'Live-position') : (employee.location || profile.department || 'Dagens sted'),
      note: location.sharing
        ? `Live GPS var aktiv med cirka ${location.speed || 0} km/t og ${location.points || 0} punkter.`
        : `Forslag fra din profil: ${employee.status || 'arbejdsdag på vejen'}.`,
    });
  }
  if (logbookAutomation.autoPickup && activePickup) {
    const helper = employees.find(employeeItem => employeeItem.id === activePickup.employeeId);
    suggestions.push({
      kind: 'pickup-task',
      title: 'Gem afhentningsopgave',
      place: helper?.location || 'Afhentning',
      note: `${pickupStatusLabel(activePickup.status)}: ${activePickup.note || 'Kollegahjælp'}${helper ? ` for ${helper.name}` : ''}.`,
    });
  }
  if (logbookAutomation.autoStops && location.sharing && location.speed < 6 && location.points > 0) {
    suggestions.push({
      kind: 'pause-stop',
      title: 'Gem pause eller stop',
      place: employee.location || 'Pause på ruten',
      note: `Du har holdt stille ved ${employee.location || 'ruten'}. God kandidat til en privat pause-note.`,
    });
  }
  if (logbookAutomation.autoVehicle) {
    const vehicle = vehicles.find(item => item.unit === profile.truck || item.driverId === employee.id);
    suggestions.push({
      kind: 'vehicle-day',
      title: 'Gem dagens køretøj',
      place: employee.location || profile.department || 'På tur',
      note: `${vehicle?.unit || profile.truck || 'Køretøj'} · ${vehicle?.status || employee.status || 'klar til arbejde'}.`,
    });
  }
  if (logbookAutomation.autoMilestones) {
    suggestions.push({
      kind: 'milestone',
      title: 'Gem milepæl',
      place: employee.location || 'Dagens rute',
      note: `Dagens lille note: ${employee.status || 'en tur der er værd at huske'}.`,
    });
  }
  return suggestions;
}

function draftId(kind, place) {
  if (globalThis.XpressIntraWorkdayLogbook?.draftId) {
    return globalThis.XpressIntraWorkdayLogbook.draftId(kind, place);
  }
  return `${kind}-${String(place || 'sted').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')}`;
}

function syncLogbookDrafts() {
  if (!logbookAutomation.smartLogbook || !logbookAutomation.autoDrafts) return logbookDrafts;
  const existingIds = new Set(logbookDrafts.map(draft => draft.id));
  for (const suggestion of logbookSuggestions()) {
    const id = draftId(suggestion.kind, suggestion.place);
    if (existingIds.has(id)) continue;
    const draft = globalThis.XpressIntraWorkdayLogbook?.draftFromSuggestion
      ? globalThis.XpressIntraWorkdayLogbook.draftFromSuggestion(suggestion)
      : {
        id,
        ...suggestion,
        date: 'I dag',
        category: suggestion.kind === 'pause-stop' ? 'Pause' : suggestion.kind === 'pickup-task' ? 'Afhentning' : suggestion.kind === 'vehicle-day' ? 'Køretøj' : 'Automatik',
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
    logbookDrafts.unshift(draft);
  }
  save('logbookDrafts', logbookDrafts);
  return logbookDrafts;
}

function createAutoLogEntry(kind) {
  const suggestion = logbookSuggestions().find(item => item.kind === kind);
  if (!suggestion) return null;
  const entry = {
    place: suggestion.place,
    note: suggestion.note,
    date: 'I dag',
    category: kind === 'pickup-task' ? 'Afhentning' : kind === 'vehicle-day' ? 'Køretøj' : 'Automatik',
    source: 'auto',
    kind,
    favorite: false,
    metadata: {
      speed: location.speed || 0,
      sharing: Boolean(location.sharing),
      vehicle: profile.truck || '',
      createdFrom: suggestion.title,
    },
  };
  logEntries.unshift(entry);
  save('logEntries', logEntries);
  return entry;
}

function approveLogbookDraft(id) {
  const draft = logbookDrafts.find(item => item.id === id);
  if (!draft) return null;
  const entry = {
    place: draft.place,
    note: draft.note,
    date: draft.date || 'I dag',
    category: draft.category || 'Automatik',
    source: 'auto',
    kind: draft.kind,
    favorite: false,
    status: 'approved',
    metadata: { createdFrom: draft.title, draftId: draft.id },
  };
  logEntries.unshift(entry);
  logbookDrafts = logbookDrafts.filter(item => item.id !== id);
  save('logEntries', logEntries);
  save('logbookDrafts', logbookDrafts);
  return entry;
}

function deleteLogbookDraft(id) {
  logbookDrafts = logbookDrafts.filter(item => item.id !== id);
  save('logbookDrafts', logbookDrafts);
}

function clearLogbookDrafts() {
  logbookDrafts = [];
  save('logbookDrafts', logbookDrafts);
}

function toggleLogbookAutomation(key) {
  if (!(key in logbookAutomation)) return;
  logbookAutomation = { ...logbookAutomation, [key]: !logbookAutomation[key] };
  save('logbookAutomation', logbookAutomation);
}

function renderLogbookEntry(entry) {
  return `<article class="${entry.favorite ? 'favorite' : ''}">
    <p>${text(entry.date || 'I dag')} · ${text(entry.place)} ${entry.source === 'auto' ? '· Automatisk forslag' : '· Manuel'}</p>
    <b>${text(entry.category || 'Logbog')}</b>
    <span>${text(entry.note)}</span>
    ${entry.image ? `<figure class="logbook-image"><img src="${text(entry.image.src)}" alt="${text(entry.image.name || entry.place)}" /><a href="${text(entry.image.src)}" download="${text(mediaName(entry.image.name))}">${icon('download')} Download</a></figure>` : ''}
  </article>`;
}

function visibleMapPeople() {
  const sharedPeople = employees.filter(person => person.sharing && person.coords);
  const currentId = session?.userId || currentEmployee().id;
  const workPermissions = { ...(workday.permissions || {}), ...workdayPrivacy };
  const selfVisible = location.sharing && (workPermissions.audience || workdayPrivacy.audience) !== 'none';
  const selfStatusParts = ['Deler GPS'];
  if (workPermissions.showSpeed) selfStatusParts.push(`${location.speed} km/t`);
  const people = location.sharing
    ? [
        ...sharedPeople.filter(person => person.id !== currentId && person.id !== currentEmployee().id),
        ...(selfVisible ? [{
          ...currentEmployee(),
          id: currentId,
          location: 'Dig',
          coords: location.coords || currentEmployee().coords,
          sharing: true,
          truck: workPermissions.showVehicle ? currentEmployee().truck : 'Bil skjult',
          status: workPermissions.showStatus ? selfStatusParts.join(' · ') : 'Deler GPS',
        }] : []),
      ]
    : sharedPeople;
  return people.filter(person => mapFilter === 'all' || mapFilter === 'sharing' || person.vehicleType === mapFilter);
}

function formatClock(isoValue) {
  if (!isoValue) return 'ukendt tid';
  return new Date(isoValue).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
}

function locationExpiryText() {
  if (!location.sharing) return 'Du bestemmer selv, hvornår kollegaerne kan se dig';
  if (location.expiresAt) return `Stopper kl. ${formatClock(location.expiresAt)}`;
  if (workday.active && workday.endsAt) return 'Stopper kl. 19.00 dansk tid';
  return 'Kører indtil du selv stopper delingen';
}

function mapPersonStatus(person) {
  if ((person.id === currentEmployee().id || person.id === session?.userId) && location.sharing) {
    if (location.speed > 5) return 'Kører';
    if (location.demo) return 'Demo GPS';
    return 'Deler';
  }
  if (!person.online) return 'Offline';
  if ((person.status || '').toLowerCase().includes('pause')) return 'Pause';
  return person.sharing ? 'Deler' : 'Skjult';
}

function mapLastUpdatedLabel(person) {
  if ((person.id === currentEmployee().id || person.id === session?.userId) && location.lastUpdatedAt) return `Sidst opdateret ${formatClock(location.lastUpdatedAt)}`;
  if (person.lastUpdatedAt) return `Sidst opdateret ${formatClock(person.lastUpdatedAt)}`;
  return 'Sidst opdateret for få min. siden';
}

async function ensureDirectChat(employee) {
  if (onlineBackendActive()) {
    return startSupabaseDirectChat(employee);
  }
  let chat = chats.find(item => item.id === employee.id);
  if (!chat) {
    chat = { id: employee.id, name: employee.name, initials: employee.initials, preview: 'Start en intern samtale', time: 'Nu', unread: 0 };
    chats.unshift(chat);
    messages[employee.id] = [];
    save('chats', chats);
    save('messages', messages);
  }
  return chat.id;
}

function postAvatar(item) {
  return `<span class="feed-avatar ${item.kind === 'office' ? 'office' : ''}">${text(item.initials || 'XB')}</span>`;
}

function renderFeedPost(item) {
  const liked = Boolean(feedLikes[item.id]);
  const likeCount = Number(item.likes || 0) + (liked ? 1 : 0);
  return `<article class="social-post ${item.kind === 'rule' ? 'rule-post' : ''}">
    <header>${postAvatar(item)}<div><b>${text(item.author)}</b><span>${text(item.time)} · ${text(item.audience)}</span></div>${item.pinned ? '<em>Fastgjort</em>' : ''}</header>
    <div class="social-post-body">${item.title ? `<h3>${text(item.title)}</h3>` : ''}<p>${text(item.body)}</p>
      ${item.image ? `<figure class="post-image"><img src="${text(item.image.src)}" alt="${text(item.image.name || item.title || 'Opslagsbillede')}" /><a href="${text(item.image.src)}" download="${text(mediaName(item.image.name))}">${icon('download')} Download</a></figure>` : ''}
      ${item.kind === 'rule' ? `<button class="source-link" data-action="open-rule-updates">${text(item.source)} · Se officiel kilde</button>` : ''}
    </div>
    <footer>
      <button class="${liked ? 'liked' : ''}" data-action="toggle-like" data-post="${text(item.id)}">${icon('heart')}<span>${likeCount || 'Synes godt om'}</span></button>
      ${item.kind === 'rule'
        ? `<button data-action="open-rule-updates">${icon('document')}<span>Læs mere</span></button>`
        : `<button data-action="open-comments" data-post="${text(item.id)}">${icon('comment')}<span>${item.comments?.length || 0} kommentarer</span></button>`}
    </footer>
  </article>`;
}

function updateLocation(position) {
  location.speed = Math.max(0, Math.round((position.coords.speed || 0) * 3.6));
  location.coords = [position.coords.latitude, position.coords.longitude];
  location.points += 1;
  location.lastUpdatedAt = new Date().toISOString();
  syncLogbookDrafts();
  syncSupabaseLocation().catch(error => showToast(`GPS kunne ikke opdateres online: ${error.message}`));
}

function startDemoLocation() {
  if (location.timer) return;
  location.demo = true;
  location.timer = setInterval(() => {
    location.speed = Math.max(0, Math.round(78 + Math.sin(Date.now() / 2500) * 7));
    location.coords = currentEmployee().coords;
    location.points += 1;
    location.lastUpdatedAt = new Date().toISOString();
    syncLogbookDrafts();
    syncSupabaseLocation().catch(() => {});
  }, 1000);
}

function startLocationSharing(message = 'Din live-position deles nu med kolleger', durationMinutes = null) {
  if (!coreSettings.gps) {
    showToast('GPS-deling er midlertidigt slået fra af chef/admin');
    return;
  }
  const now = new Date();
  const expiresAt = durationMinutes
    ? new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString()
    : workday.active ? workday.endsAt : null;
  location.expiresAt = expiresAt;
  location.startedAt = location.startedAt || now.toISOString();
  location.lastUpdatedAt = now.toISOString();
  location.shareMode = durationMinutes ? `${durationMinutes} min` : workday.active ? 'workday' : 'manual';
  if (location.sharing) {
    syncSupabaseLocation().catch(error => showToast(`GPS kunne ikke opdateres online: ${error.message}`));
    render({ preserveScroll: true });
    showToast(message);
    return;
  }
  location.sharing = true;
  if (!navigator.geolocation) {
    startDemoLocation();
  } else {
    location.watchId = navigator.geolocation.watchPosition(updateLocation, startDemoLocation, {
      enableHighAccuracy: true, maximumAge: 3000, timeout: 5000,
    });
  }
  syncSupabaseLocation().catch(error => showToast(`GPS kunne ikke deles online: ${error.message}`));
  render();
  showToast(message);
}

function stopLocationSharing(message = 'Din position er ikke længere synlig for kolleger') {
  if (!location.sharing) return;
  navigator.geolocation?.clearWatch(location.watchId);
  clearInterval(location.timer);
  stopSupabaseLocation().catch(() => {});
  location = { sharing: false, demo: false, speed: 0, points: 0, watchId: null, timer: null, coords: null, startedAt: null, expiresAt: null, lastUpdatedAt: null, shareMode: null };
  render();
  showToast(message);
}

function startTimedLocationSharing(minutes) {
  startLocationSharing(`Din position deles i ${minutes} minutter`, minutes);
}

function enforceLocationExpiry(now = new Date()) {
  if (!location.sharing || !location.expiresAt) return;
  if (new Date(location.expiresAt) <= now) stopLocationSharing('GPS-delingen stoppede automatisk');
}

function toggleLocation() {
  if (location.sharing) {
    if (activePickup) {
      activePickup = null;
      save('activePickup', null);
      stopLocationSharing('Afhentningen er afsluttet, og GPS-delingen er stoppet');
      return;
    }
    stopLocationSharing();
    return;
  }
  startLocationSharing();
}

function renderScreenGuide() {
  if (activeTab === 'chat' && activeChat) return '';
  const guides = {
    home: { title: 'Start her', body: 'Se dagens vigtigste beskeder, opgaver og hurtige handlinger.', action: 'open-notifications', label: 'Tjek beskeder' },
    work: { title: 'Arbejde og tur', body: 'Mød ind, del tur, hent for kollega og gem logbog fra ét roligt sted.', action: workday.active ? 'end-workday' : 'start-workday', label: workday.active ? 'Slut dag' : 'Mød ind' },
    team: { title: 'Find en kollega', body: 'Søg efter navn, bil eller rolle. Profiler viser kun det, kollegaen må dele.', action: 'new-employee', label: 'Registrer kollega', adminOnly: true },
    map: { title: 'Livekort med frivillig GPS', body: 'Del kun din position når det giver mening. Stop deling når du er færdig.', action: 'toggle-location', label: location.sharing ? 'Stop deling' : 'Del position' },
    chat: { title: 'Beskeder samlet', body: 'Brug fælleschat, din køretøjskanal eller direkte beskeder uden at blande opslag ind.', action: 'new-chat', label: 'Ny besked' },
    info: { title: 'Hurtig information', body: 'Find drift, telefonnumre, regler, dokumenter og praktiske svar fra vejen.', action: 'open-info', label: 'Nød og drift', info: 'operations' },
    more: { title: isCreatorOwner() ? 'Styr appen professionelt' : 'Din konto og privatliv', body: isCreatorOwner() ? 'Tjek drift, rettigheder, Supabase, sikkerhed og de vigtigste styringer.' : 'Ret profil, privatliv, notifikationer og dine egne data.', action: isCreatorOwner() ? 'open-admin' : 'open-profile', label: isCreatorOwner() ? 'Appens drift' : 'Min profil' },
  };
  const guide = guides[activeTab] || guides.home;
  const hidden = guide.adminOnly && !canManageEmployees();
  return `<section class="screen-guide">
    <div><b>${text(guide.title)}</b><span>${text(guide.body)}</span></div>
    ${hidden ? '' : `<button type="button" data-action="${text(guide.action)}" ${guide.info ? `data-info="${text(guide.info)}"` : ''}>${text(guide.label)}</button>`}
  </section>`;
}

function appShell(content) {
  return `
    <section class="phone-shell desktop-view-${desktopViewMode()}">
      <header class="topbar">
        <div class="brand-row">
          <div>${brandLogo()}<p class="date">XpressIntra · kun medarbejdere</p></div>
          <button class="avatar" data-action="open-profile" aria-label="Åbn din profil">${text(currentEmployee().initials)}</button>
        </div>
      </header>
      <section class="content">${renderGlobalSearch()}${renderScreenGuide()}${content}</section>
      <nav class="bottom-nav" aria-label="Hovedmenu">
        ${[
          ['home', 'home', 'Forside'],
          ['work', 'check', 'Arbejde'],
          ['map', 'map', 'Live-kort'],
          ['chat', 'chat', 'Beskeder'],
          ['more', 'more', 'Kontrol'],
        ].map(([id, iconName, label]) => `
          <button class="nav-item ${activeTab === id ? 'active' : ''}" data-tab="${id}">
            ${icon(iconName)}<span>${label}</span>
          </button>`).join('')}
      </nav>
    </section>
    <section class="desktop-note">
      ${brandLogo()}
      <h1>Hold kontakten,<br />mens hjulene ruller.</h1>
      <p>XpressBudets interne medarbejdersystem til chauffører, kurérer og disponenter. Del position, find vigtig information og hold kontakten fra mobilen.</p>
      <div class="desktop-list"><span>01</span> Fælles drift og chat <span>02</span> Frivillig live-position <span>03</span> Chaufførinfo samlet ét sted</div>
    </section>`;
}

function renderLogin() {
  const backend = supabaseStatus();
  const demoCredentials = DEMO_MODE && !backend.ready;
  const inviteContext = loginInviteContext();
  const invitedEmail = inviteContext.email;
  const canUseStandardSignup = Boolean(backend.ready && inviteContext.valid);
  return `<section class="login-shell">
    <div class="login-brand">${brandLogo()}<small>XpressIntra · internt medarbejdersystem</small></div>
    <div class="login-copy"><h1>Godt at se dig.</h1><p>Log ind for at finde kollegaer, dele din position og skrive med holdet.</p></div>
    <div class="pwa-install-card">
      <b>Brug den som app</b>
      <span>På pc kan browseren installere appen direkte. På iPhone åbner du siden i Safari og vælger Føj til hjemmeskærm.</span>
      <button type="button" data-action="install-pwa">${text(pwaInstallLabel())}</button>
    </div>
    <form class="login-form">
      <label>Arbejdsmail<input name="email" type="email" value="${text(invitedEmail || (demoCredentials ? 'demo@xpressintra.local' : ''))}" ${inviteContext.valid ? 'readonly' : ''} required /></label>
      <label>Adgangskode<input name="password" type="password" value="${demoCredentials ? 'demo1234' : ''}" minlength="6" required /></label>
      <button>Log ind</button>
      ${canUseStandardSignup ? '<button class="login-secondary" data-action="signup-standard-password">Opret konto med standardkode</button>' : ''}
      <span>${text(canUseStandardSignup ? 'Du er åbnet via invitationslink. Skriv standardkoden xpress og lav derefter din egen kode. Har du allerede oprettet kontoen, skal du logge ind med din personlige kode.' : backend.ready ? 'Ny medarbejder? Brug det personlige invitationslink fra chef eller creator. Standardkode-oprettelse vises kun første gang via link. Har du allerede oprettet konto, logger du ind med din personlige kode.' : 'Har du ikke adgang endnu, skal din chef eller creator oprette dig først.')}</span>
    </form>
  </section>`;
}

function renderHome() {
  const feed = [
    ...announcements.filter(item => canReadAudience(item.audience)),
    { id: 'rule-vans-july-2026', title: ruleUpdates[0].title, body: ruleUpdates[0].body, time: ruleUpdates[0].checked, kind: 'rule', author: 'Regelnyt', initials: 'RN', audience: ruleUpdates[0].audience, source: ruleUpdates[0].source, likes: 2, comments: [] },
  ];
  const onlineEmployees = employees.filter(employee => employee.online);
  const unreadNotifications = notifications.filter(item => item.unread).length;
  const officePosts = announcements.filter(item => item.kind === 'office' && canReadAudience(item.audience)).slice(0, 3);
  const nowStatus = workday.active ? 'Arbejdsdag aktiv' : location.sharing ? 'Position deles' : 'Klar til dagen';
  const locationText = location.sharing ? locationExpiryText() : 'GPS er skjult';
  const nextAction = activePickup
    ? { title: 'Afhentning i gang', body: activePickup.note || 'Følg status og live noter', action: 'open-pickup', icon: 'pin' }
    : !workday.active
      ? { title: 'Åbn Arbejde', body: 'Mød ind, del tur og gem logbog samlet ét sted', action: 'open-work', icon: 'check' }
      : unreadNotifications
      ? { title: 'Tjek beskeder', body: `${unreadNotifications} ulæste ting venter`, action: 'open-notifications', icon: 'chat' }
      : { title: 'Se live-kort', body: location.sharing ? locationExpiryText() : 'Se hvem der deler position', action: 'open-map', icon: 'map' };
  const todayActions = [
    ...(nextAction.action !== 'open-notifications' ? [{ label: 'Beskeder', hint: `${unreadNotifications} ulæst`, chat: 'all', icon: 'chat' }] : []),
    { label: 'Information', hint: 'Regler og kontakter', tab: 'info', icon: 'info' },
    { label: 'Meld fejl', hint: 'Send ønske eller problem', action: 'open-support-request', icon: 'alert' },
  ];
  const shortcutActions = [
    { label: 'Kollegaer', hint: `${onlineEmployees.length} online`, tab: 'team', iconName: 'users' },
    nextAction.action === 'open-map'
      ? { label: 'Mine data', hint: 'Privatliv og adgang', action: 'open-my-data', iconName: 'document' }
      : { label: 'Live-kort', hint: `${onlineEmployees.filter(employee => employee.sharing).length} deler position`, tab: 'map', iconName: 'map' },
    { label: 'Kontrol', hint: 'Profil, privatliv og indstillinger', tab: 'more', iconName: 'more' },
  ];
  return `
    <section class="home-clean-hero surface-card">
      <div>
        <p class="eyebrow">Forside</p>
        <h2>Godmorgen, ${text(profileGreetingName())}</h2>
        <span>${text(nowStatus)} · ${text(profile.truck || vehicleLabel(profile.vehicleType))} · ${text(locationText)}</span>
      </div>
      <button class="home-next-action" data-action="${text(nextAction.action)}">
        <span>${icon(nextAction.icon)}</span>
        <b>${text(nextAction.title)}</b>
        <small>${text(nextAction.body)}</small>
      </button>
      <div class="home-status-strip">
        <span><b>${workday.active ? 'Aktiv' : 'Ikke mødt ind'}</b><small>Arbejde</small></span>
        <span><b>${location.sharing ? 'Live' : 'Skjult'}</b><small>GPS</small></span>
        <span><b>${unreadNotifications}</b><small>Ulæst</small></span>
      </div>
    </section>
    <section class="home-day-tools screen-section" aria-label="Dagens værktøjer">
      <div class="screen-section-head"><span>Dagens værktøjer</span></div>
      <div>
        ${todayActions.map(item => `<button class="${item.primary ? 'primary' : ''}" ${item.tab ? `data-tab="${text(item.tab)}"` : item.chat ? `data-chat="${text(item.chat)}"` : `data-action="${text(item.action)}"`}>
          <span>${icon(item.icon)}</span><b>${text(item.label)}</b><small>${text(item.hint)}</small>
        </button>`).join('')}
      </div>
    </section>
    <section class="home-office-board screen-section">
      <div class="screen-section-head"><span>Vigtigt fra kontoret</span><small>Drift og beskeder</small>${canPublishOfficePosts() ? '<button data-action="new-announcement">Nyt opslag</button>' : ''}</div>
      ${officePosts.length ? officePosts.map(item => `<button data-action="open-notifications"><b>${text(item.title)}</b><small>${text(item.time)} · ${text(item.author)}</small><span>${text(item.body)}</span></button>`).join('') : '<article><b>Ingen fastgjorte beskeder</b><span>Kontoret kan lægge de vigtigste ting her.</span></article>'}
    </section>
    ${renderPickupCard()}
    <section class="home-simple-actions" aria-label="Vigtigste genveje">
      ${shortcutActions.map(item => `<button ${item.tab ? `data-tab="${text(item.tab)}"` : `data-action="${text(item.action)}"`}><span>${icon(item.iconName)}</span><b>${text(item.label)}</b><small>${text(item.hint)}</small></button>`).join('')}
    </section>
    <section class="home-community-preview screen-section">
      <div class="screen-section-head"><span>Fællesskab</span><small>${onlineEmployees.length} online</small><button data-chat="all">Åbn chat</button></div>
      <section class="story-rail" aria-label="Kollegaer online">
        ${onlineEmployees.slice(0, 8).map(employee => `<button data-employee="${text(employee.id)}">${avatar(employee)}<span>${text(employee.id === 'th' ? 'Dig' : employee.name.split(' ')[0])}</span></button>`).join('')}
      </section>
      <section class="social-feed compact-feed">${feed.slice(0, 2).map(renderFeedPost).join('')}</section>
    </section>`;
}

function renderWork() {
  const audienceText = workdayPrivacy.audience === 'all' ? 'Alle kollegaer'
    : workdayPrivacy.audience === 'truck' ? 'Lastbilholdet'
    : workdayPrivacy.audience === 'van' ? 'Varebilholdet'
    : 'Ingen';
  return `
    <div class="page-heading"><div><p class="eyebrow">Din tur</p><h2>Arbejde</h2></div><button class="round-btn" data-action="open-settings" aria-label="Arbejdstilladelser">${icon('settings')}</button></div>
    <section class="work-hero surface-card ${workday.active ? 'active' : ''}">
      <div>
        <p class="eyebrow">Arbejdsdag</p>
        <h3>${workday.active ? 'Du er mødt ind' : 'Start dagens tur'}</h3>
        <span>${workday.active ? `Slukker automatisk kl. ${text(workday.endLabel || '19.00')} dansk tid` : 'Start dagen her. Tilladelser styres i Indstillinger.'}</span>
      </div>
      <button data-action="${workday.active ? 'end-workday' : 'start-workday'}">${workday.active ? 'Slut dag' : 'Mød ind'}</button>
    </section>
    <section class="work-primary-grid">
      <button data-action="toggle-location"><span>${icon(location.sharing ? 'check' : 'map')}</span><b>${location.sharing ? 'Stop GPS' : 'Del tur'}</b><small>${location.sharing ? locationExpiryText() : 'Bruger dine valg fra Indstillinger'}</small></button>
      <button data-action="open-pickup"><span>${icon('pin')}</span><b>Hent for kollega</b><small>${activePickup ? pickupStatusLabel(activePickup.status) : 'Start hurtig opgave'}</small></button>
      <button data-action="open-logbook"><span>${icon('truck')}</span><b>Gem logbog</b><small>${logbookDrafts.length ? `${logbookDrafts.length} kladder venter` : 'Gem sted, pause eller minde'}</small></button>
    </section>
    <button class="work-settings-link" data-action="open-settings">${icon('settings')} Indstil hvad der deles, og med hvem</button>
    ${renderPickupCard()}
    <details class="work-more-section">
      <summary>Flere arbejdsgenveje</summary>
      <section class="quick-action-rail simplified">
        <button data-tab="map"><span>${icon('map')}</span><b>Live-kort</b><small>Se kollegaer der deler</small></button>
        <button data-tab="team"><span>${icon('users')}</span><b>Kollegaer</b><small>Søg navn, bil eller rolle</small></button>
        <button data-action="open-notifications"><span>${icon('alert')}</span><b>Beskeder</b><small>${notifications.filter(item => item.unread).length} ulæste</small></button>
        <button data-action="open-task-overview"><span>${icon('check')}</span><b>Opgaver</b><small>Kladder og aktive ting</small></button>
        <button data-tab="info"><span>${icon('info')}</span><b>Information</b><small>Regler og kontakter</small></button>
      </section>
    </details>`;
}

function renderPickupCard() {
  if (!activePickup) return '';
  const colleague = employees.find(employee => employee.id === activePickup.employeeId);
  const status = pickupStatusLabel(activePickup.status);
  const expiryText = activePickup.expiresAt
    ? `Stopper automatisk ${new Date(activePickup.expiresAt).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}`
    : 'Stopper når du markerer opgaven færdig';
  const checklist = ensurePickupChecklist(activePickup);
  const steps = activePickup.steps || [];
  const liveNotes = pickupLiveNotes(activePickup);
  return `<section class="pickup-card">
    <div class="pickup-icon">${icon('pin')}</div>
    <div><p>Afhentning for ${text(colleague?.name || 'kollega')}</p><span><b>${text(status)}</b> · ${text(activePickup.note || 'Kollegaen kan følge dig, mens opgaven er aktiv.')}</span><small>${text(expiryText)}</small></div>
    <div class="pickup-task-meta">
      <span><b>Afhentningssted</b><small>${text(activePickup.pickupPlace || colleague?.location || 'Ikke angivet')}</small></span>
      <span><b>Afleveringssted</b><small>${text(activePickup.dropoffPlace || currentEmployee().location || 'Ikke angivet')}</small></span>
      <span><b>Reference</b><small>${text(activePickup.reference || 'Ingen reference')}</small></span>
      <span><b>Prioritet</b><small>${text(activePickup.priority || 'Normal')}</small></span>
    </div>
    <div class="pickup-checklist"><b>Tjekliste</b>${checklist.map(item => `<button class="${item.done ? 'done' : ''}" data-pickup-check="${text(item.id)}">${item.done ? '✓' : '○'} ${text(item.label)}</button>`).join('')}</div>
    <div class="pickup-live-notes"><b>Live noter</b>
      ${liveNotes.length ? liveNotes.slice(-5).map(step => `<span><strong>${text(step.authorName || 'Kollega')}</strong><small>${new Date(step.at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</small>${text(step.note)}</span>`).join('') : '<span>Ingen noter endnu. Begge parter kan skrive korte opdateringer her.</span>'}
      <form class="pickup-note-form"><input name="note" placeholder="Skriv live note..." autocomplete="off" /><button>Send</button></form>
    </div>
    <div class="pickup-timeline"><b>Tidslinje</b>${steps.filter(step => step.type !== 'note').length ? steps.filter(step => step.type !== 'note').map(step => `<span>${text(pickupStatusLabel(step.status))} · ${new Date(step.at).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</span>`).join('') : '<span>Opgaven er startet</span>'}</div>
    <div class="pickup-status-actions">
      <button data-pickup-status="found">Fundet</button>
      <button data-pickup-status="picked_up">Hentet</button>
      <button data-pickup-status="blocked">Kan ikke finde</button>
      <button data-action="finish-pickup">Afleveret</button>
    </div>
  </section>`;
}

function employeeRow(employee) {
  return `<button class="employee-row" data-employee="${employee.id}">
    ${avatar(employee)}
    <span class="employee-copy"><b>${text(employee.name)}</b><small>${text(employee.status)} · ${employee.vehicleType === 'truck' ? 'Lastbil' : employee.vehicleType === 'van' ? 'Varebil' : 'Disponent'}</small></span>
    <span class="employee-place">${text(employee.location)}</span>${icon('arrow', 'row-arrow')}
  </button>`;
}

function renderTeam() {
  const filteredEmployees = employees.filter(employee =>
    `${employee.name} ${employee.truck} ${employee.role}`.toLowerCase().includes(teamQuery.toLowerCase())
  );
  return `
    <div class="page-heading"><div><p class="eyebrow">Medarbejdere</p><h2>Kollegaer</h2></div>${canManageEmployees() ? `<button class="round-btn" data-action="new-employee" aria-label="Registrér kollega">${icon('plus')}</button>` : ''}</div>
    <label class="search-box"><input data-team-search placeholder="Søg efter navn eller bil..." value="${text(teamQuery)}" /><span>${filteredEmployees.length} profiler</span></label>
    <section class="employee-list">${filteredEmployees.length ? filteredEmployees.map(employeeRow).join('') : '<p class="empty-state">Ingen kollegaer matcher din søgning.</p>'}</section>
    <section class="privacy-note"><b>Privatliv først</b><span>Placering vises kun for medarbejdere, der aktivt har slået deling til.</span></section>`;
}

function teamMap(large = true) {
  const id = large ? 'live-map-full' : 'live-map-home';
  return `<div class="leaflet-map ${large ? 'leaflet-map-large' : ''}" id="${id}" data-large="${large ? 'true' : 'false'}">
    <div class="map-loading">${icon('map')}<b>Indlæser live-kort</b><span>OpenStreetMap med live-markører</span></div>
  </div>`;
}

const leafletInstances = {};
let leafletLoadPromise = null;

function loadExternalAsset(tagName, attributes) {
  return new Promise((resolve, reject) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.addEventListener('load', resolve, { once: true });
    element.addEventListener('error', reject, { once: true });
    document.head.append(element);
  });
}

function ensureLeaflet() {
  if (globalThis.L) return Promise.resolve(globalThis.L);
  if (!leafletLoadPromise) {
    leafletLoadPromise = Promise.all([
      loadExternalAsset('link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css' }),
      loadExternalAsset('script', { src: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js' }),
    ]).then(() => globalThis.L);
  }
  return leafletLoadPromise;
}

function markerClass(person) {
  if (person.id === currentEmployee().id && location.sharing) return 'self';
  if (person.vehicleType === 'truck') return 'truck';
  if (person.vehicleType === 'van') return 'van';
  return 'dispatch';
}

function markerPosition(coords) {
  const [lat, lng] = coords;
  const minLat = 53.0;
  const maxLat = 57.2;
  const minLng = 7.4;
  const maxLng = 11.4;
  const left = Math.min(88, Math.max(8, ((lng - minLng) / (maxLng - minLng)) * 100));
  const top = Math.min(88, Math.max(8, (1 - ((lat - minLat) / (maxLat - minLat))) * 100));
  return `left:${left}%;top:${top}%`;
}

function fallbackLiveMap(container, people) {
  container.innerHTML = `<div class="fallback-live-map">
    <div class="fallback-map-grid"></div>
    <span class="fallback-city city-aarhus">Aarhus</span><span class="fallback-city city-kolding">Kolding</span><span class="fallback-city city-hamburg">Hamburg</span>
    ${people.map(person => `<button class="fallback-marker ${markerClass(person)}" style="${markerPosition(person.coords)}" title="${text(person.name)}"><b>${text(person.initials)}</b></button>`).join('')}
    <div class="fallback-map-note">${icon('alert')}<b>Backup-kort aktivt</b><span>Det rigtige OpenStreetMap-kort kunne ikke hentes. Markører og Google Maps-links virker stadig.</span></div>
  </div>`;
}

async function initializeMaps() {
  if (!document.querySelectorAll) return;
  const containers = [...document.querySelectorAll('.leaflet-map')];
  if (!containers.length) return;
  const people = visibleMapPeople();
  let leaflet;
  try {
    leaflet = await ensureLeaflet();
  } catch {
    leaflet = null;
  }
  containers.forEach(container => {
    if (!leaflet) {
      fallbackLiveMap(container, people);
      return;
    }
    if (leafletInstances[container.id]) leafletInstances[container.id].remove();
    const large = container.dataset.large === 'true';
    const map = leaflet.map(container, { zoomControl: true, attributionControl: true, scrollWheelZoom: large }).setView([55.25, 9.6], large ? 6 : 5);
    leafletInstances[container.id] = map;
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    people.forEach(person => {
      const marker = leaflet.marker(person.coords, {
        icon: leaflet.divIcon({
          className: `live-leaflet-marker ${markerClass(person)}`,
          html: `<b>${text(person.initials)}</b>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(map);
      marker.bindPopup(`<strong>${text(person.name)}</strong><br>${text(vehicleLabel(person.vehicleType))} · ${text(person.status)}<br>${text(person.truck)}`);
    });
    if (large && people.length) map.fitBounds(people.map(person => person.coords), { padding: [34, 34], maxZoom: 9 });
    setTimeout(() => map.invalidateSize(), 80);
  });
}

function renderMap() {
  const visiblePeople = visibleMapPeople();
  const statuses = workStatusCounts();
  return `
    <div class="page-heading"><div><p class="eyebrow">Frivillig positionsdeling</p><h2>Live-kort</h2></div></div>
    <section class="map-hero-card surface-card">
      <div>
        <p class="eyebrow">GPS status</p>
        <h3>${location.sharing ? 'Du deler position' : 'Du er skjult'}</h3>
        <span>${visiblePeople.length} synlige på kortet · ${location.sharing ? `${location.speed} km/t` : 'GPS er slukket'}</span>
      </div>
      <button data-action="toggle-location">${location.sharing ? 'Stop deling' : 'Del position'}</button>
    </section>
    <section class="map-filter-row" aria-label="Kortfilter">
      ${[
        ['all', 'Alle'],
        ['sharing', 'Deler nu'],
        ['truck', 'Lastbil'],
        ['van', 'Varebil'],
      ].map(([id, label]) => `<button class="${mapFilter === id ? 'active' : ''}" data-map-filter="${id}">${label}</button>`).join('')}
    </section>
    <section class="map-share-timer screen-section">
      <div class="screen-section-head"><span>Deling</span><small>Start og stop hurtigt</small></div>
      <div><b>Hurtig deling</b><span>Start GPS i en fast periode, fx når du henter noget for en kollega.</span></div>
      <button data-location-duration="15">Del i 15 min</button>
      <button data-location-duration="30">Del i 30 min</button>
      <button data-location-duration="60">Del i 60 min</button>
    </section>
    <div class="screen-section-head map-section-head"><span>Rigtigt kort</span><small>OpenStreetMap med Google Maps-links</small></div>
    <section class="map-legend-panel">
      <span><i class="legend-dot self"></i>Dig</span>
      <span><i class="legend-dot truck"></i>Lastbil</span>
      <span><i class="legend-dot van"></i>Varebil</span>
      <span><i class="legend-dot dispatch"></i>Kontor</span>
      <small>Kun kollegaer med aktiv deling vises. Brug "Deler nu" hvis kortet skal være helt rent.</small>
    </section>
    ${teamMap(true)}
    <section class="map-actions">
      <p class="map-expiry-line">${locationExpiryText()}</p>
      <div><b>${location.sharing ? 'Din position er synlig' : 'Du er skjult på kortet'}</b><span>${location.sharing ? (location.demo ? 'Demo-position bruges i denne prototype' : 'Opdateres automatisk fra din GPS') : 'Du bestemmer selv, hvornår kollegaerne kan se dig'}</span></div>
      <button data-action="toggle-location">${location.sharing ? 'Stop deling' : 'Del position'}</button>
      <small class="map-person-legend">Status · Sidst opdateret</small>
    </section>
    <details class="map-more-section">
      <summary>Arbejdsstatus og detaljer</summary>
      <section class="work-status-strip">
        <div><span>Arbejdsstatus</span><b>${statuses.active}</b><small>mødt ind/online</small></div>
        <div><span>Pause</span><b>${statuses.pause}</b><small>holder stille</small></div>
        <div><span>Kan hjælpe</span><b>${statuses.help}</b><small>kollegaer online</small></div>
        <div><span>Afhentning</span><b>${statuses.pickup}</b><small>aktiv opgave</small></div>
      </section>
    </details>
    <section class="map-people screen-section"><div class="section-title"><h3>Synlige kollegaer</h3><span>${visiblePeople.length} personer</span></div>
      ${visiblePeople.length ? visiblePeople.map(person => `<div class="map-person-card">${employeeRow(person)}<div class="map-person-meta"><span>Status · ${text(mapPersonStatus(person))}</span><span>${text(mapLastUpdatedLabel(person))}</span></div><a class="map-open-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.coords.join(','))}" target="_blank" rel="noreferrer">Åbn i Google Maps</a></div>`).join('') : '<p class="empty-state">Ingen deler position i dette filter lige nu.</p>'}
    </section>`;
}

function renderChat() {
  if (activeChat) return renderConversation();
  const community = chats.find(chat => chat.community);
  const channels = chats.filter(chat => chat.channel && canAccessChat(chat));
  const chatSearch = searchable(chatQuery.trim());
  const directChats = chats.filter(chat => !chat.community && !chat.channel)
    .filter(chat => !chatSearch || searchable(`${chat.name} ${chat.preview}`).includes(chatSearch));
  const pinnedChat = community || channels[0] || directChats[0];
  const communityCard = community
    ? `<button class="community-chat" data-chat="${text(community.id)}">
      <span class="community-icon">${icon('users')}</span>
      <span><small>Hele holdet</small><b>Fælleschat</b><em>${text(community.preview)}</em></span>
      ${community.unread ? `<i>${text(community.unread)}</i>` : icon('arrow', 'row-arrow')}
    </button>`
    : '<section class="important-message"><span>Fælleschat</span><b>Ikke oprettet endnu</b><small>Kør Supabase schema igen for at oprette standardkanalerne.</small></section>';
  return `
    <div class="page-heading"><div><p class="eyebrow">XpressBudet internt</p><h2>Fællesskab</h2></div><button class="round-btn" data-action="new-chat" aria-label="Ny besked">${icon('plus')}</button></div>
    ${communityCard}
    <label class="search-box chat-search"><input data-chat-search placeholder="Søg i beskeder..." value="${text(chatQuery)}" /><span>${directChats.length} hits</span></label>
    <section class="channel-section screen-section">
      <div class="section-title"><h3>Kanaler</h3><span>${channels.length} synlige</span></div>
      ${channels.map(chat => `<button class="channel-card ${chat.channel}" data-chat="${chat.id}">
        <span class="channel-icon">${icon(chat.channel === 'truck' ? 'truck' : 'van')}</span>
        <span><b>${text(chat.name)}</b><small>${text(chat.preview)}</small></span>
        ${chat.unread ? `<i>${text(chat.unread)}</i>` : icon('arrow', 'row-arrow')}
      </button>`).join('')}
    </section>
    <div class="section-title chat-title"><h3>Direkte</h3></div>
    <section class="chat-list screen-section">${directChats.map(chat => `
      <button class="chat-row" data-chat="${chat.id}">
        <span class="person-avatar">${text(chat.initials)}</span>
      <span class="chat-copy"><b>${text(chat.name)}</b><small>${text(chat.preview)}</small></span>
      <span class="chat-meta"><time>${text(chat.time)}</time>${chat.unread ? `<i>${text(chat.unread)}</i>` : ''}</span>
      </button>`).join('')}
    </section>
    <details class="chat-more-section">
      <summary>Overblik og fastgjort besked</summary>
      <section class="chat-overview-panel surface-card">
        <div><span>Drift</span><b>${announcements.filter(item => canReadAudience(item.audience)).length}</b><small>opslag</small></div>
        <div><span>Kanaler</span><b>${channels.length}</b><small>for din gruppe</small></div>
        <div><span>Direkte</span><b>${chats.filter(chat => !chat.community && !chat.channel).length}</b><small>samtaler</small></div>
      </section>
      <section class="important-message">
        <span>Vigtig besked</span><b>${text(pinnedChat?.name || 'Ingen fastgjort besked')}</b><small>${text(pinnedChat?.preview || 'Fastgjorte chatbeskeder kan vises her uden at blande nyheder ind i beskederne.')}</small>
      </section>
    </details>`;
}

function conversationHeading(chat) {
  if (chat.community) return { title: 'Fælleschat', subtitle: 'Alle medarbejdere' };
  if (chat.channel === 'truck') return { title: 'Lastbilchat', subtitle: 'Kun lastbilholdet' };
  if (chat.channel === 'van') return { title: 'Varebilchat', subtitle: 'Kun varebilholdet' };
  return { title: chat.name, subtitle: 'Direkte besked' };
}

function renderConversation() {
  const chat = chats.find(item => item.id === activeChat);
  if (!chat) {
    activeChat = null;
    return renderChat();
  }
  const thread = (messages[activeChat] || []).map(normalizeMessage);
  const heading = conversationHeading(chat);
  return `
    <div class="conversation-head">
      <button data-action="back-chats" aria-label="Tilbage til beskeder">${icon('arrow', 'back-arrow')}</button>
      <span class="person-avatar">${text(chat.initials)}</span>
      <div><b>${text(heading.title)}</b><small>${text(heading.subtitle)}</small></div>
    </div>
    <section class="messages">${thread.map(renderMessageBubble).join('')}</section>
    <form class="message-form">
      <div class="emoji-row">${emojiChoices.map(emoji => `<button type="button" data-emoji="${text(emoji)}">${text(emoji)}</button>`).join('')}</div>
      <div class="message-compose">
        <label class="image-picker" title="Tilføj billede">${icon('image')}<input name="image" type="file" accept="image/*" /></label>
        <input name="message" autocomplete="off" placeholder="Skriv en besked eller emoji..." />
        <button aria-label="Send besked">${icon('send')}</button>
      </div>
    </form>`;
}

function renderMessageBubble(message) {
  const own = message.side === 'me';
  const meta = [message.senderRole, message.senderVehicle].filter(Boolean).join(' · ');
  return `<article class="message-row ${own ? 'own' : 'other'}">
    ${own ? '' : `<span class="person-avatar message-avatar">${text(message.senderInitials)}</span>`}
    <div class="bubble ${text(message.side)}">
      <header><b>${own ? 'Dig' : text(message.senderName)}</b>${meta ? `<small>${text(meta)}</small>` : ''}</header>
      ${message.body ? `<p>${text(message.body)}</p>` : ''}
      ${message.image ? `<figure class="chat-image"><img src="${text(message.image.src)}" alt="${text(message.image.name || 'Chatbillede')}" /><a href="${text(message.image.src)}" download="${text(mediaName(message.image.name))}">${icon('download')} Download</a></figure>` : ''}
      <time>${text(messageTimestamp(message))}</time>
    </div>
  </article>`;
}

function renderCreatorRoleTester() {
  if (!canUseCreatorRoleTester()) return '';
  const roleButtons = Object.entries(creatorRolePresets).map(([id, preset]) => (
    `<button class="${creatorRoleTester.currentRole === id ? 'active' : ''}" data-creator-role="${text(id)}">${text(preset.label)}</button>`
  )).join('');
  return `<section class="creator-role-tester">
    <div><span>Creator test</span><small>Kun synlig for creator</small></div>
    <p>Skift perspektiv lokalt og se appen som medarbejder, disponent eller chef uden at ændre rigtige rettigheder.</p>
    <strong>Viser lige nu: ${text(creatorPerspectiveLabel())}</strong>
    <nav>${roleButtons}</nav>
  </section>`;
}

function renderMore() {
  const completion = profileCompletion({ ...currentEmployee(), ...profile });
  return `
    <div class="page-heading"><div><p class="eyebrow">Din konto</p><h2>Kontrolcenter</h2></div></div>
    <button class="profile-card" data-action="open-profile">${avatar(currentEmployee(), 'large-avatar')}<span><b>${text(profile.name)}</b><small>${text(profile.role)} · ${text(accessRoleLabel(profile.accessRole))} · ${completion}% udfyldt</small></span>${icon('edit', 'row-arrow')}</button>
    ${legalAcceptance ? '' : `<section class="legal-alert">
      <b>Sikkerhed & jura</b>
      <span>${text(legalStatusText())}. GPS, billeder, chat og profiler er persondata og skal bruges efter klare interne regler.</span>
      <button data-action="open-legal">Åbn</button>
    </section>`}
    <section class="control-tabs" aria-label="Kontrolcenter overblik">
      <span>Daglig brug</span><span>Privatliv</span><span>${canManageEmployees() || isDispatcher() || isCreatorOwner() ? 'Administration' : 'Konto'}</span>
    </section>
    <section class="utility-list control-center">
      <details class="control-detail-group" open>
        <summary>Daglig brug</summary>
        <button class="utility-row" data-action="open-profile"><span class="utility-icon">${icon('edit')}</span><span><b>Rediger profil</b><small>Navn, telefon og tilknyttet lastbil</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="open-notifications"><span class="utility-icon">${icon('alert')}</span><span><b>Notifikationer</b><small>${notifications.filter(item => item.unread).length} ulæste · direkte beskeder og regelnyt</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="open-support-request"><span class="utility-icon">${icon('comment')}</span><span><b>Meld fejl eller ønske</b><small>${supportRequests.length ? `${supportRequests.length} lokale meldinger` : 'Send hurtigt hvad der driller eller mangler'}</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="open-vehicles"><span class="utility-icon">${icon('truck')}</span><span><b>Køretøjer</b><small>Register over biler, status og chaufførtilknytning</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-tab="info"><span class="utility-icon">${icon('info')}</span><span><b>Information</b><small>Kontakter, guides og dokumenter</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="${profile.logbook ? 'open-logbook' : 'open-profile'}"><span class="utility-icon">${icon('truck')}</span><span><b>Personlig logbog</b><small>${profile.logbook ? `${logEntries.length} private minder · kun synlige for dig` : 'Fravalgt · kan slås til på din profil'}</small></span>${icon('arrow', 'row-arrow')}</button>
      </details>
      <details class="control-detail-group">
        <summary>Sikkerhed og privatliv</summary>
        <button class="utility-row" data-action="open-my-data"><span class="utility-icon">${icon('document')}</span><span><b>Mine data</b><small>Indsigt, eksport, sletning og privatlivsvalg</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="open-legal"><span class="utility-icon">${icon('alert')}</span><span><b>Sikkerhed & jura</b><small>Privatliv, GPS, billeder og slettefrister</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="toggle-location"><span class="utility-icon">${icon('pin')}</span><span><b>Lokationsdeling</b><small>${location.sharing ? 'Aktiv · tryk for at stoppe' : 'Slået fra · tryk for at dele'}</small></span>${icon('arrow', 'row-arrow')}</button>
        <button class="utility-row" data-action="open-settings"><span class="utility-icon">${icon('settings')}</span><span><b>Indstillinger</b><small>Notifikationer og privatliv</small></span>${icon('arrow', 'row-arrow')}</button>
      </details>
      <details class="control-detail-group">
        <summary>${canManageEmployees() || isDispatcher() || isCreatorOwner() ? 'Administration' : 'Konto'}</summary>
        ${isDispatcher() ? `<button class="utility-row" data-action="open-dispatch"><span class="utility-icon">${icon('alert')}</span><span><b>Driftsoverblik</b><small>Hold, positioner og driftsopslag</small></span>${icon('arrow', 'row-arrow')}</button>` : ''}
        ${canManageEmployees() || isCreatorOwner() ? `<button class="utility-row" data-action="open-admin"><span class="utility-icon">${icon('settings')}</span><span><b>${isCreatorOwner() ? 'Appens drift' : 'Chef/admin'}</b><small>${isCreatorOwner() ? 'Status, sikkerhed, Supabase og vigtige styringer' : 'Rettigheder, sikkerhed og medarbejdere'}</small></span>${icon('arrow', 'row-arrow')}</button>` : ''}
        ${canManageEmployees() ? `<button class="utility-row" data-action="open-launch-checklist"><span class="utility-icon">${icon('check')}</span><span><b>Klar til drift</b><small>Supabase, første admin, telefon-test og jura</small></span>${icon('arrow', 'row-arrow')}</button>` : ''}
        ${renderCreatorRoleTester()}
        ${DEMO_MODE ? `<button class="utility-row" data-action="reset-demo"><span class="utility-icon">${icon('settings')}</span><span><b>Nulstil demo</b><small>Gendan de oprindelige eksempeldata</small></span>${icon('arrow', 'row-arrow')}</button>` : ''}
        <button class="utility-row" data-action="logout"><span class="utility-icon">${icon('close')}</span><span><b>Log ud</b><small>Afslut din session på denne enhed</small></span>${icon('arrow', 'row-arrow')}</button>
      </details>
    </section>`;
}

function renderInfo() {
  const query = searchable(infoQuery.trim());
  const filteredLinks = globalThis.XpressIntraInfoCenter?.filterInfoLinks
    ? globalThis.XpressIntraInfoCenter.filterInfoLinks({
      links: infoLinks,
      activeCategory: activeInfoCategory,
      query: infoQuery,
      favorites: infoFavorites,
      searchable,
    })
    : infoLinks.filter(item =>
      (activeInfoCategory === 'all' || item.category === activeInfoCategory || (activeInfoCategory === 'favorites' && infoFavorites.includes(item.id)))
      && searchable(`${item.title} ${item.description} ${item.source} ${item.category}`).includes(query)
    );
  const favoriteLinks = infoLinks.filter(item => infoFavorites.includes(item.id));
  const isDefaultInfo = !query && activeInfoCategory === 'all';
  const visibleLinks = isDefaultInfo ? [] : filteredLinks;
  const resultTitle = globalThis.XpressIntraInfoCenter?.resultTitle
    ? globalThis.XpressIntraInfoCenter.resultTitle(activeInfoCategory, infoSections)
    : activeInfoCategory === 'favorites' ? 'Dine favoritter'
      : activeInfoCategory === 'all' ? 'Søgeresultater'
        : infoSections.find(section => section.id === activeInfoCategory)?.title || 'Resultater';
  const featuredSections = [
    { id: 'operations', label: 'Akut og drift', hint: 'Ring, forsinkelse, skade' },
    { id: 'trucks', label: 'Lastbil', hint: 'Køre-/hviletid, vejafgift' },
    { id: 'vans', label: 'Varebil', hint: 'Regler, tilladelser, miljøzoner' },
    { id: 'documents', label: 'Dokumenter', hint: 'CMR, billeder, vilkår' },
  ].map(item => ({ ...item, section: infoSections.find(section => section.id === item.id) })).filter(item => item.section);
  const activeSection = infoSections.find(section => section.id === activeInfoCategory);
  const priorityContacts = contactDirectoryEntries().filter(contact => contact.priority).slice(0, 3);
  return `
    <div class="page-heading info-heading"><div><p class="eyebrow">Hjælpecentral</p><h2>Information</h2><small>Ring, find regler eller åbn dokumenter uden at lede.</small></div><button class="round-btn" data-action="open-contact-list" aria-label="Åbn kontaktliste">${icon('phone')}</button></div>
    <section class="info-command-card">
      <div>
        <p class="section-kicker">Første valg</p>
        <h3>Hvad har du brug for?</h3>
        <p>Store knapper, få valg og de vigtigste telefonnumre øverst.</p>
      </div>
      <nav class="info-emergency-strip" aria-label="Hurtige opkald">
        <a href="tel:+4540553131">${icon('phone')}<span><b>Drift</b><small>40 55 31 31</small></span></a>
        <a href="tel:+4540873131">${icon('truck')}<span><b>Lastbil</b><small>40 87 31 31</small></span></a>
        <a class="danger" href="tel:112">${icon('alert')}<span><b>112</b><small>Akut fare</small></span></a>
      </nav>
    </section>
    <section class="info-choice-grid screen-section" aria-label="Vælg informationstype">
      ${featuredSections.map(item => `<button class="${activeInfoCategory === item.id ? 'active' : ''}" data-info-category="${text(item.id)}">
        <span>${icon(item.section.icon)}</span>
        <b>${text(item.label)}</b>
        <small>${text(item.hint)}</small>
      </button>`).join('')}
    </section>
    <section class="info-contact-preview screen-section">
      <div class="screen-section-head"><span>Kontakt hurtigt</span><small>Ring direkte</small><button type="button" data-action="open-contact-list">Kontaktliste</button></div>
      <div>
        ${priorityContacts.map(contact => {
          const phone = cleanPhone(contact.phone);
          return `<a href="tel:${text(phone)}"><span class="contact-avatar">${text(contact.initials)}</span><b>${text(contact.name)}</b><small>${text(contact.role)}</small></a>`;
        }).join('')}
      </div>
    </section>
    <section class="info-search-panel screen-section">
      <div class="screen-section-head"><span>Søg i håndbogen</span><small>${filteredLinks.length} fundet</small></div>
      <label class="search-box info-search simple"><input data-info-search placeholder="Søg fx CMR, miljøzone, hviletid..." value="${text(infoQuery)}" /><span>${query ? 'Søgning' : 'Skriv her'}</span></label>
    </section>
    <details class="info-topic-list screen-section">
      <summary><span>Flere emner</span><small>${activeSection ? activeSection.title : 'Alle kilder'}</small></summary>
      ${infoSections.map(section => `<button class="${activeInfoCategory === section.id ? 'active' : ''}" data-info-category="${section.id}">
        <span>${icon(section.icon)}</span><b>${text(section.title)}</b><small>${text(section.subtitle)}</small>${icon('arrow', 'row-arrow')}
      </button>`).join('')}
    </details>
    ${isDefaultInfo ? `<section class="info-empty-start">
      <span>${icon('info')}</span>
      <b>Vælg et kort eller søg efter noget</b>
      <small>De lange regler og links vises først, når du beder om dem.</small>
    </section>` : `<section class="info-result-panel screen-section">
      <div class="screen-section-head info-results-head"><span>${text(resultTitle)}</span><small>${visibleLinks.length} resultater</small><button type="button" data-info-category="all">Ryd</button></div>
      <section class="info-card-list">${visibleLinks.length ? visibleLinks.map(item => `
      <article class="info-card-link ${item.href ? '' : 'no-link'}">
        <span class="utility-icon">${icon(item.icon)}</span>
        <span><em>${text(item.source)}</em><b>${text(item.title)}</b><small>${text(item.description)}</small></span>
        <button type="button" class="favorite-info-btn ${infoFavorites.includes(item.id) ? 'active' : ''}" data-info-favorite="${text(item.id)}">${infoFavorites.includes(item.id) ? '★' : '☆'}</button>
        ${item.href ? `<a class="open-info-link" href="${text(item.href)}" target="${item.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">Åbn</a>` : '<strong>Info</strong>'}
      </article>` ).join('') : '<p class="empty-state">Ingen information matcher din søgning.</p>'}
      </section>
    </section>`}
    <details class="info-more-section">
      <summary>Flere guides og favoritter</summary>
      <section class="fast-answer-panel screen-section">
        <div><span>Hurtige svar</span><small>20 sekunder</small><button data-action="open-rule-updates">Regelnyt</button></div>
        ${fastAnswers.map(answer => `<article><b>${text(answer.title)}</b><small>${text(answer.audience)}</small><p>${text(answer.body)}</p></article>`).join('')}
      </section>
      <section class="favorite-info-panel screen-section">
        <div><span>Favoritter</span><small>${favoriteLinks.length} gemt</small></div>
        ${favoriteLinks.length ? favoriteLinks.slice(0, 3).map(item => `<button data-info-category="${text(item.category)}"><b>${text(item.title)}</b><small>${text(item.source)} · ${text(item.description)}</small></button>`).join('') : '<p>Tryk på stjernen ved et link for at gemme det her.</p>'}
      </section>
      <section class="quick-guide-grid">
        ${quickGuides.map((guide, index) => guide.href
          ? `<a class="quick-guide-card" href="${text(guide.href)}" target="${guide.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer"><span>${icon(guide.icon)}</span><em>${text(guide.audience)}</em><b>${text(guide.title)}</b><small>${text(guide.body)}</small><strong>${text(guide.action)}</strong></a>`
          : `<button class="quick-guide-card" data-guide="${index}"><span>${icon(guide.icon)}</span><em>${text(guide.audience)}</em><b>${text(guide.title)}</b><small>${text(guide.body)}</small><strong>${text(guide.action)}</strong></button>`
        ).join('')}
      </section>
      <section class="country-guide-panel screen-section">
        <div><span>Landeguider</span><small>Hurtige noter</small></div>
        ${countryGuides.map(guide => `<article><b>${text(guide.country)}</b><small>${text(guide.audience)}</small><p>${text(guide.body)}</p></article>`).join('')}
      </section>
      <section class="checklist-panel screen-section">
        <div><span>Checkliste</span><small>To tryk og videre</small></div>
        ${infoChecklists.map(list => `<article><b>${text(list.title)}</b>${list.items.map(item => `<small>${icon('check')} ${text(item)}</small>`).join('')}</article>`).join('')}
      </section>
    </details>
    <section class="terminal-note"><b>Terminal og kontor</b><span>Ved Milepælen 2 · 8361 Hasselager</span></section>
    <section class="source-note">Regler kan ændre sig. Brug links til de officielle kilder ved tvivl, og få virksomhedens interne procedurer kvalitetssikret af driften.</section>`;
}

const routes = { home: renderHome, work: renderWork, team: renderTeam, map: renderMap, chat: renderChat, info: renderInfo, more: renderMore };

function openProfileModal(employee = currentEmployee(), isNew = false) {
  const ownId = session?.userId || 'th';
  const isOwnProfile = employee.id === ownId || employee.id === 'th';
  const editable = isOwnProfile || isNew || canManageEmployees();
  const canEditRights = canManageEmployees();
  const canEditAdminFields = isNew || canEditRights;
  const source = isNew ? {} : (isOwnProfile ? { ...employee, ...profile } : employee);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    ${avatar(employee, 'modal-avatar')}
    <p class="eyebrow">${isNew ? 'Registrér kollega' : 'Medarbejderprofil'}</p>
    <h3>${isNew ? 'Opret invitation' : text(employee.name)}</h3>
    ${isNew ? '<section class="invite-help"><b>Sådan virker det</b><span>Skriv kollegaens arbejdsmail. Appen opretter automatisk invitationen på den mail og viser linket, når profilen er gemt.</span></section>' : ''}
    ${!isNew ? `<section class="profile-completion"><span><b style="width:${profileCompletion(source)}%"></b></span><small>${profileCompletion(source)}% udfyldt · ${text(accessRoleLabel(source.accessRole))}</small></section>` : ''}
    ${!isNew ? `<section class="profile-summary-grid">
      <span><b>${text(source.role || 'Rolle mangler')}</b><small>Titel</small></span>
      <span><b>${text(vehicleLabel(source.vehicleType))}</b><small>Funktion</small></span>
      <span><b>${text(source.truck || 'Ingen bil')}</b><small>Bil/enhed</small></span>
      <span><b>${text(source.department || 'Ikke sat')}</b><small>Afdeling</small></span>
    </section>` : ''}
    ${editable ? `
      <section class="profile-form-section"><h4>Kontakt</h4>
        <label>Navn<input name="name" value="${text(source.name || '')}" required /></label>
        <label>Telefon<input name="phone" value="${text(source.phone || '')}" /></label>
        <label>Arbejdsmail<input name="email" type="email" value="${text(source.email || '')}" ${isNew ? 'required' : ''} /></label>
        <label class="profile-photo-field">Profilbillede
          <span class="profile-photo-preview ${source.photo ? '' : 'is-empty'}" data-profile-photo-preview>
            ${source.photo ? `<img src="${text(source.photo.src)}" alt="${text(source.name || 'Profilbillede')}" />` : '<b>+</b><small>Vælg billede</small>'}
          </span>
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          <small>JPG, PNG, WebP eller GIF · max 10 MB. Store billeder skaleres ned til profilvisning.</small>
        </label>
      </section>
      <section class="profile-form-section"><h4>Arbejde</h4>
        <label>Afdeling<input name="department" value="${text(source.department || '')}" placeholder="Lastbil, varebil, drift..." ${canEditAdminFields ? '' : 'disabled'} /></label>
        <input type="hidden" name="department" value="${text(source.department || '')}" ${canEditAdminFields ? 'disabled' : ''} />
        <label>Kørekort / beviser<input name="license" value="${text(source.license || '')}" placeholder="Fx C/E, EU kvalifikationsbevis" ${canEditAdminFields ? '' : 'disabled'} /></label>
        <input type="hidden" name="license" value="${text(source.license || '')}" ${canEditAdminFields ? 'disabled' : ''} />
        <label>Nødkontakt<input name="emergencyContact" value="${text(source.emergencyContact || '')}" placeholder="Navn og telefon" /></label>
        <label>Sprog<input name="languages" value="${text(source.languages || '')}" placeholder="Dansk, engelsk, tysk..." /></label>
      </section>
      <section class="profile-form-section"><h4>Rettigheder</h4>
        <label>Titel / rolle<select name="role" ${canEditAdminFields ? '' : 'disabled'}><option ${source.role === 'Chauffør' ? 'selected' : ''}>Chauffør</option><option ${source.role === 'Lastbilchauffør' ? 'selected' : ''}>Lastbilchauffør</option><option ${source.role === 'Varebilschauffør' ? 'selected' : ''}>Varebilschauffør</option><option ${source.role === 'Disponent' ? 'selected' : ''}>Disponent</option><option ${source.role === 'Chef' ? 'selected' : ''}>Chef</option><option ${source.role === 'Creator' ? 'selected' : ''}>Creator</option></select></label>
        <input type="hidden" name="role" value="${text(source.role || 'Chauffør')}" ${canEditAdminFields ? 'disabled' : ''} />
        <label>Rettighed<select name="accessRole" ${canEditAdminFields ? '' : 'disabled'}><option value="employee" ${source.accessRole === 'employee' ? 'selected' : ''}>Medarbejder</option><option value="dispatcher" ${source.accessRole === 'dispatcher' ? 'selected' : ''}>Disponent</option><option value="admin" ${source.accessRole === 'admin' ? 'selected' : ''}>Chef/admin</option><option value="owner" ${source.accessRole === 'owner' ? 'selected' : ''}>Creator</option></select></label>
        <input type="hidden" name="accessRole" value="${text(source.accessRole || 'employee')}" ${canEditAdminFields ? 'disabled' : ''} />
        <label>Køretøjstype<select name="vehicleType" ${canEditAdminFields ? '' : 'disabled'}><option value="truck" ${source.vehicleType === 'truck' ? 'selected' : ''}>Lastbil</option><option value="van" ${source.vehicleType === 'van' ? 'selected' : ''}>Varebil</option><option value="dispatch" ${source.vehicleType === 'dispatch' ? 'selected' : ''}>Kontor / disponent</option></select></label>
        <input type="hidden" name="vehicleType" value="${text(source.vehicleType || 'truck')}" ${canEditAdminFields ? 'disabled' : ''} />
        <label>Bil / enhed<input name="truck" value="${text(source.truck || '')}" ${canEditAdminFields ? '' : 'disabled'} /></label>
        <input type="hidden" name="truck" value="${text(source.truck || '')}" ${canEditAdminFields ? 'disabled' : ''} />
      </section>
      <section class="profile-form-section"><h4>Privat</h4>
        <label class="check-row"><input type="checkbox" name="logbook" ${!isNew && profile.logbook ? 'checked' : ''} /><span>Aktivér personlig logbog <small>Private minder og noter fra vejen</small></span></label>
      </section>
      ${canEditAdminFields ? '<p class="security-inline-note">Chef/admin kan ændre titel, rettighed, afdeling, beviser og køretøj. Almindelige medarbejdere kan kun ændre egne kontakt- og profiloplysninger.</p>' : '<p class="security-inline-note">Titel, rettighed, afdeling, beviser og køretøj er låst og skal ændres af chef/admin.</p>'}
      ${canEditAdminFields && !isNew && source.email ? `<section class="invite-help"><b>Mailbekræftelse</b><span>Hvis kollegaen har trykket opret konto, men ikke har fået bekræftelsesmailen, kan admin gensende den her.</span><button type="button" data-resend-confirmation="${text(source.email)}">Gensend bekræftelsesmail</button></section>` : ''}
      <button class="save-btn">${isNew ? 'Registrér og lav invitation' : 'Gem profil'}</button>` : `
      <div class="profile-details">${employee.photo ? `<img class="profile-photo-preview" src="${text(employee.photo.src)}" alt="${text(employee.name)}" />` : ''}<span><b>Rolle</b>${text(employee.role)} · ${text(accessRoleLabel(employee.accessRole))}</span><span><b>Bil</b>${text(employee.truck)}</span><span><b>Status</b>${text(employee.status)}</span><span><b>Telefon</b>${text(employee.phone || 'Telefon mangler')}</span><span><b>Mail</b>${text(employee.email || 'Mail mangler')}</span><span><b>Beviser</b>${text(employee.license || 'Beviser ikke udfyldt')}</span><span><b>GPS</b>${employee.sharing ? `${text(employee.location)} · deler position` : 'Deler ikke position'}</span></div>
      <button type="button" class="save-btn" data-direct-chat="${text(employee.id)}">Skriv en besked</button>`}
  </form>`;
  document.body.append(modal);
  modal.addEventListener('submit', async event => {
    event.preventDefault();
    if (isNew) {
      const data = new FormData(modal.querySelector('form'));
      const newEmployee = employeeFromProfileForm(data);
      if (!newEmployee.name) {
        showToast('Skriv kollegaens navn først');
        return;
      }
      if (!newEmployee.email) {
        showToast('Skriv kollegaens arbejdsmail, så invitationen kan bindes til den rigtige bruger');
        return;
      }
      const inviteResult = await prepareEmployeeInvitation(newEmployee);
      employees.push(newEmployee);
      save('employees', employees);
      recordAdminAudit('Medarbejder oprettet', `${newEmployee.name} blev oprettet som ${accessRoleLabel(newEmployee.accessRole)} med invitation til ${newEmployee.email}`);
      if (inviteResult.error) {
        showToast(`Invitationen er klar lokalt, men kom ikke online endnu: ${inviteResult.error.message}`);
      }
      modal.remove(); render(); showToast(inviteResult.onlineCreated ? 'Medarbejderen er oprettet, og invitationen er online' : 'Medarbejderen er oprettet, og invitationen er klar');
      openEmployeeInviteResultModal(newEmployee, newEmployee.invitationId || '');
      return;
    }
    const data = new FormData(modal.querySelector('form'));
    const photo = await readImageFile(data.get('photo'), { kind: 'profile' });
    const targetIndex = employees.findIndex(item => item.id === employee.id);
    const previous = isOwnProfile ? { ...currentEmployee(), ...profile } : employees[targetIndex];
    const updated = {
      ...previous,
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email'),
      emergencyContact: data.get('emergencyContact'),
      languages: data.get('languages'),
      department: canEditAdminFields ? data.get('department') : previous.department,
      license: canEditAdminFields ? data.get('license') : previous.license,
      role: canEditAdminFields ? data.get('role') : previous.role,
      accessRole: canEditAdminFields ? data.get('accessRole') : previous.accessRole,
      vehicleType: canEditAdminFields ? data.get('vehicleType') : previous.vehicleType,
      truck: canEditAdminFields ? data.get('truck') : previous.truck,
      photo: photo || previous.photo || null,
      logbook: isOwnProfile ? data.has('logbook') : previous.logbook,
    };
    if (isOwnProfile) {
      profile = { ...profile, ...updated };
      const ownIndex = employees.findIndex(item => item.id === ownId || item.id === 'th');
      if (ownIndex >= 0) employees[ownIndex] = { ...employees[ownIndex], ...updated };
      else employees.unshift({ ...currentEmployee(), ...updated, id: ownId });
      save('profile', profile);
    } else if (targetIndex >= 0 && canEditAdminFields) {
      employees[targetIndex] = { ...employees[targetIndex], ...updated };
      recordAdminAudit('Medarbejderprofil ændret', `${updated.name} · ${updated.role} · ${accessRoleLabel(updated.accessRole)}`);
      if (onlineBackendActive()) {
        try {
          await updateSupabaseEmployeeProfile(updated);
        } catch (error) {
          showToast(`Profilen er gemt lokalt, men ikke online: ${error.message}`);
        }
      }
    }
    save('employees', employees);
    modal.remove(); render(); showToast(isOwnProfile ? 'Din profil er opdateret' : 'Medarbejderprofilen er opdateret');
  });
}

function openEmployeeInviteResultModal(employee, invitationId = '') {
  const inviteState = employee.invitationStatus === 'online'
    ? 'Online invitation gemt i Supabase'
    : 'Medarbejderen er oprettet lokalt - synkroniser når Supabase er online';
  const invite = inviteMessage(employee, invitationId || employee.invitationId || '');
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal invite-result-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Invitationsgenerator</p>
    <h3>${text(employee.name)} kan oprette sig</h3>
    <section class="invite-help">
      <b>${text(inviteState)}</b>
      <span>Kollegaen skal åbne invitationslinket. Standardkode-knappen vises ikke på den almindelige login-side.</span>
      <span>Invitationslink: <strong>${text(invite.invitationUrl)}</strong></span>
      <span>Downloadside ved behov: <strong>${text(invite.downloadUrl)}</strong></span>
    </section>
    <label>Link der virker<input readonly value="${text(invite.invitationUrl)}" /></label>
    <label>Besked til kollegaen<textarea readonly rows="7">${text(invite.body)}</textarea></label>
    <div class="invite-actions">
      <button type="button" data-action="copy-last-invite-link">Kopiér link</button>
      <button type="button" data-action="copy-last-invite-message">Kopiér besked</button>
      <button type="button" data-action="share-last-invite">Send/dele besked</button>
      <button type="button" data-action="resend-last-confirmation">Gensend bekræftelsesmail</button>
      <button type="button" data-action="close-modal">Færdig</button>
    </div>
  </section>`;
  modal.dataset.inviteEmployee = employee.id;
  modal.dataset.inviteId = invitationId;
  modal.dataset.inviteUrl = invite.invitationUrl;
  modal.dataset.inviteMessage = invite.body;
  modal.dataset.inviteEmail = employee.email || employee.invitationEmail || '';
  document.body.append(modal);
}

function openStandardSignupPasswordModal(email, invitationId = '') {
  pendingStandardSignupEmail = String(email || '').trim().toLowerCase();
  pendingStandardSignupInvitationId = String(invitationId || '').trim();
  if (!pendingStandardSignupEmail) {
    showToast('Skriv arbejdsmailen først');
    return;
  }
  document.querySelector('.standard-signup-password-modal')?.closest('.modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal standard-signup-password-modal standard-signup-password-form">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Opret konto</p>
    <h3>Lav din personlige kode</h3>
    <section class="invite-help">
      <b>Standardkoden er godkendt</b>
      <span>Du opretter kontoen for <strong>${text(pendingStandardSignupEmail)}</strong>. Vælg nu din egen adgangskode, så Supabase ikke skal gemme standardkoden.</span>
    </section>
    <label>Ny adgangskode<input name="newPassword" type="password" minlength="8" autocomplete="new-password" required /></label>
    <label>Gentag ny adgangskode<input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required /></label>
    <p class="security-inline-note">Brug mindst 8 tegn, små bogstaver, store bogstaver og tal. Vælg ikke standardkoden igen.</p>
    <button class="save-btn">Opret konto</button>
  </form>`;
  document.body.append(modal);
}

function openTemporaryPasswordModal() {
  if (!session?.userId) return;
  document.querySelector('.temporary-password-modal')?.closest('.modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal temporary-password-modal temporary-password-form">
    <p class="eyebrow">Første login</p>
    <h3>Lav din personlige kode</h3>
    <section class="invite-help">
      <b>Standardkoden er kun til oprettelse</b>
      <span>Du er logget ind med den midlertidige kode. Vælg nu din egen adgangskode, før du bruger appen videre.</span>
    </section>
    <label>Ny adgangskode<input name="newPassword" type="password" minlength="8" autocomplete="new-password" required /></label>
    <label>Gentag ny adgangskode<input name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required /></label>
    <p class="security-inline-note">Brug mindst 8 tegn, små bogstaver, store bogstaver og tal. Vælg ikke standardkoden igen, og del aldrig din personlige kode med andre.</p>
    <button class="save-btn">Gem personlig kode</button>
  </form>`;
  document.body.append(modal);
}

function openLogbookModal() {
  if (!coreSettings.logbook) {
    showToast('Logbogen er midlertidigt slået fra af chef/admin');
    return;
  }
  syncLogbookDrafts();
  const stats = logbookStats();
  const suggestions = logbookSuggestions();
  const summary = dailyLogbookSummary(stats);
  const automationRows = [
    ['smartLogbook', 'Smart logbog', 'Hovedkontakt: appen laver kun private kladder, når denne er slået til.'],
    ['autoPlace', 'Steder jeg besøger', 'Foreslår nye byer, lande og favoritsteder.'],
    ['autoStops', 'Pauser og stop', 'Foreslår en pause-note, når du holder stille.'],
    ['autoPickup', 'Afhentninger', 'Logger hjælper-opgaver, status og aflevering som private kladder.'],
    ['autoVehicle', 'Køretøj og arbejdsdag', 'Foreslår dagens bil, rute og arbejdsdag.'],
  ];
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal logbook-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Kun synlig for dig</p><h3>Personlig logbog</h3>
    <p class="privacy-note">Privat område: chef, disponenter og kollegaer skal ikke kunne læse dine personlige minder. Automatikken laver forslag, du godkender selv.</p>
    <div class="logbook-stats">
      <span><b>${stats.total}</b><small>Indlæg</small></span>
      <span><b>${stats.places}</b><small>Mine steder</small></span>
      <span><b>${stats.auto}</b><small>Automatik</small></span>
      <span><b>${stats.images}</b><small>Billeder</small></span>
    </div>
    <section class="daily-logbook-summary">
      <div><span>Dagens opsamling</span><b>${text(summary.title)}</b><small>${text(summary.meta)}</small><p>${text(summary.body)}</p></div>
      <button type="button" data-logbook-suggestion="workday">Gem dagen som minde</button>
    </section>
    <section class="logbook-automation">
      <h4>Logbog Automation</h4>
      ${automationRows.map(([key, title, description]) => `<button type="button" class="${logbookAutomation[key] ? 'active' : ''}" data-logbook-toggle="${text(key)}"><span><b>${text(title)}</b><small>${text(description)}</small></span><em>${logbookAutomation[key] ? 'Til' : 'Fra'}</em></button>`).join('')}
    </section>
    <section class="logbook-drafts">
      <div><h4>Private kladder</h4>${logbookDrafts.length ? '<button type="button" data-action="clear-logbook-drafts">Ryd kladder</button>' : ''}</div>
      ${logbookDrafts.length ? logbookDrafts.map(draft => `<article>
        <p>${text(draft.date || 'I dag')} · ${text(draft.place)}</p>
        <b>${text(draft.title)}</b>
        <span>${text(draft.note)}</span>
        <footer><button type="button" data-approve-logbook-draft="${text(draft.id)}">Gem</button><button type="button" data-delete-logbook-draft="${text(draft.id)}">Slet</button></footer>
      </article>`).join('') : '<p class="empty-state">Ingen private kladder endnu. Når appen opdager et sted, en pause, en afhentning eller dagens køretøj, lander forslaget her.</p>'}
    </section>
    <section class="logbook-suggestions">
      <h4>Automatiske forslag</h4>
      ${logbookAutomation.autoDrafts && suggestions.length ? suggestions.map(item => `<button type="button" data-logbook-suggestion="${text(item.kind)}"><span><b>${text(item.title)}</b><small>${text(item.place)} · ${text(item.note)}</small></span>${icon('plus')}</button>`).join('') : '<p class="empty-state">Slå automatiske kladder til for at få hurtige forslag fra GPS, afhentninger og køretøj.</p>'}
    </section>
    <div class="logbook-entries">${logEntries.map(renderLogbookEntry).join('')}</div>
    <form class="log-entry-form">
      <label>Kategori<select name="category"><option>Pause</option><option>Levering</option><option>Grænse</option><option>Godt sted</option><option>Afhentning</option><option>Andet</option></select></label>
      <label>Sted<span class="place-picker"><input name="place" placeholder="Hvor er du?" required /><button type="button" data-action="use-current-logbook-place">Brug min lokation</button></span><small>${text(currentLogbookPlace())}</small></label>
      <label>Note<input name="note" placeholder="Hvad vil du huske?" required /></label>
      <label>Billede<input name="image" type="file" accept="image/*" /></label>
      <label class="check-row"><input type="checkbox" name="favorite" /><span>Marker som favorit <small>Gør mindet nemt at finde senere</small></span></label>
      <button class="save-btn">Gem privat minde</button>
    </form>
  </section>`;
  document.body.append(modal);
}

function openPickupModal() {
  const quickColleague = employees.find(employee => employee.id !== currentEmployee().id && employee.id !== session?.userId);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal pickup-form">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Midlertidig GPS-deling</p><h3>Hent for en kollega</h3>
    <p class="info-intro">Vælg kollegaen, sted og prioritet. Når du markerer opgaven som færdig, stopper den opgaverelaterede GPS-deling igen.</p>
    ${quickColleague ? `<section class="pickup-quick-start">
      <b>Hurtig start</b><span>Start med ét tryk, og skriv flere detaljer senere i live noter.</span>
      <button type="button" data-quick-pickup="15">15 min for ${text(quickColleague.name.split(' ')[0])}</button>
      <button type="button" data-quick-pickup="30">30 min for ${text(quickColleague.name.split(' ')[0])}</button>
    </section>` : ''}
    <label>Kollega<select name="employee">${employees.filter(employee => employee.id !== currentEmployee().id && employee.id !== session?.userId).map(employee => `<option value="${text(employee.id)}">${text(employee.name)} · ${text(employee.truck)}</option>`).join('')}</select></label>
    <label>Afhentningssted<input name="pickupPlace" placeholder="Fx Kolding terminal eller kundens port" /></label>
    <label>Afleveringssted<input name="dropoffPlace" placeholder="Fx Hasselager kontor eller kollegaens bil" /></label>
    <label>Reference<input name="reference" placeholder="Fx ordrenr., port eller kontaktperson" /></label>
    <label>Prioritet<select name="priority"><option>Normal</option><option>Haster</option><option>Kan vente</option></select></label>
    <label>Delingstid<select name="duration"><option value="15">15 minutter</option><option value="30" selected>30 minutter</option><option value="60">60 minutter</option><option value="until-done">Indtil færdig</option></select></label>
    <label>Kort note<input name="note" placeholder="Fx Jeg henter pallen i Kolding" /></label>
    <div class="pickup-form-checklist"><b>Tjekliste</b>${pickupChecklistItems().map(item => `<span>${text(item.label)}</span>`).join('')}</div>
    <label>Billede / dokumentation<input name="image" type="file" accept="image/*" /></label>
    <button class="save-btn">Start opgave og del position</button>
  </form>`;
  document.body.append(modal);
}

async function updatePickupStatus(status) {
  if (!activePickup) return;
  activePickup.status = status;
  activePickup.checklist = ensurePickupChecklist(activePickup);
  activePickup.steps = activePickup.steps || [];
  activePickup.steps.push({ status, at: new Date().toISOString() });
  save('activePickup', activePickup);
  if (onlineBackendActive()) {
    updateSupabasePickupTask().catch(error => showToast(`Status blev gemt lokalt, men ikke online: ${error.message}`));
  }
  addNotification({
    type: 'Afhentning',
    title: `Afhentning: ${pickupStatusLabel(status)}`,
    body: activePickup.note || 'Status er opdateret på opgaven.',
    level: status === 'blocked' ? 'urgent' : 'task',
  });
  syncLogbookDrafts();
  render();
  showToast(`Afhentning markeret: ${pickupStatusLabel(status)}`);
}

function enforcePickupExpiry() {
  if (!activePickup?.expiresAt) return;
  if (Date.now() < new Date(activePickup.expiresAt).getTime()) return;
  const shouldStopLocationSharing = activePickup.startedLocationSharing;
  const expiredPickup = {
    ...activePickup,
    status: 'cancelled',
    completedAt: new Date().toISOString(),
    steps: [...(activePickup.steps || []), { status: 'cancelled', at: new Date().toISOString(), reason: 'expired' }],
  };
  if (onlineBackendActive() && activePickup.id) {
    activePickup = expiredPickup;
    updateSupabasePickupTask({ status: 'cancelled', completed_at: expiredPickup.completedAt }).catch(error => showToast(`Afhentningen udløb lokalt, men ikke online: ${error.message}`));
  }
  activePickup = null;
  save('activePickup', null);
  if (shouldStopLocationSharing && location.sharing) {
    stopLocationSharing('Afhentningsdelingen udløb automatisk');
    return;
  }
  showToast('Afhentningsdelingen udløb automatisk');
}

async function finishPickup() {
  if (!activePickup) return;
  const stopTaskSharing = activePickup.startedLocationSharing;
  activePickup.status = 'delivered';
  activePickup.completedAt = new Date().toISOString();
  activePickup.checklist = ensurePickupChecklist(activePickup);
  activePickup.steps = [...(activePickup.steps || []), { status: 'delivered', at: activePickup.completedAt }];
  if (onlineBackendActive()) {
    updateSupabasePickupTask({ status: 'delivered', completed_at: activePickup.completedAt }).catch(error => showToast(`Afhentningen blev lukket lokalt, men ikke online: ${error.message}`));
  }
  addNotification({
    type: 'Afhentning',
    title: 'Afhentning afleveret',
    body: activePickup.note || 'Opgaven er afsluttet.',
    level: 'task',
  });
  pickupHistory.unshift({
    ...activePickup,
    status: 'delivered',
    completedAt: activePickup.completedAt,
    checklist: activePickup.checklist,
  });
  save('pickupHistory', pickupHistory.slice(0, 20));
  activePickup = null;
  save('activePickup', null);
  if (stopTaskSharing) {
    stopLocationSharing('Afhentningen er afsluttet, og GPS-delingen er stoppet');
    return;
  }
  render();
  showToast('Afhentningen er afsluttet');
}

function openNewChatModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal new-chat-form">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Intern besked</p><h3>Start ny samtale</h3>
    <label>Vælg kollega<select name="employee">${employees.filter(employee => employee.id !== currentEmployee().id && employee.id !== session?.userId).map(employee => `<option value="${text(employee.id)}">${text(employee.name)}</option>`).join('')}</select></label>
    <label>Besked<input name="message" placeholder="Skriv din første besked..." required /></label>
    <button class="save-btn">Start samtale</button>
  </form>`;
  document.body.append(modal);
}

function openSettingsModal() {
  const config = supabaseConfig();
  const backend = supabaseStatus();
  const systemStatus = systemNotificationStatus();
  const backendSettings = isCreatorOwner() ? `<section class="backend-settings ${backend.ready ? 'online' : 'demo'}">
      <b>Online backend: ${text(backend.label)}</b>
      <small>${text(backend.detail)}</small>
      <label>Supabase URL<input name="supabaseUrl" placeholder="https://xxxxx.supabase.co" value="${text(config.url)}" /></label>
      <label>Offentlig anon key<input name="supabaseAnonKey" placeholder="eyJ..." value="${text(config.anonKey)}" /></label>
      <small>Brug kun den offentlige anon/publishable key her. Service-role nøgler må aldrig ind i appen.</small>
      <button type="button" data-action="test-supabase">Test Supabase-forbindelse</button>
    </section>` : '';
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal settings-form">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">XpressIntra</p><h3>Indstillinger</h3>
    ${backendSettings}
    ${renderUpdateSummary()}
    <div class="settings-switches">
      <h4>Når jeg møder ind</h4>
      <label><span><b>Pc-visning</b><small>Vælg hvor meget appen skal fylde på en stor skærm</small></span><select name="desktopViewMode">${desktopViewModeOption('full', 'Fuld skærm')}${desktopViewModeOption('large', 'Stor')}${desktopViewModeOption('compact', 'Kompakt')}</select></label>
      <label><span><b>Start GPS</b><small>Del tur automatisk ved Mød ind</small></span><input type="checkbox" name="workGps" ${workdayPrivacy.gps ? 'checked' : ''} /></label>
      <label><span><b>Automatisk logbog</b><small>Lav private kladder fra dagens tur</small></span><input type="checkbox" name="workLogbook" ${workdayPrivacy.logbook ? 'checked' : ''} /></label>
      <label><span><b>Arbejdsnotifikationer</b><small>Beskeder og regelnyt under arbejdsdag</small></span><input type="checkbox" name="workNotifications" ${workdayPrivacy.notifications ? 'checked' : ''} /></label>
      <label><span><b>Hvem må se min position?</b><small>Gælder når du møder ind eller deler tur</small></span><select name="workAudience"><option value="all" ${workdayPrivacy.audience === 'all' ? 'selected' : ''}>Alle kollegaer</option><option value="truck" ${workdayPrivacy.audience === 'truck' ? 'selected' : ''}>Kun lastbilholdet</option><option value="van" ${workdayPrivacy.audience === 'van' ? 'selected' : ''}>Kun varebilholdet</option><option value="none" ${workdayPrivacy.audience === 'none' ? 'selected' : ''}>Ingen automatisk deling</option></select></label>
      <label><span><b>Vis fart</b><small>Kollegaer kan se km/t fra GPS</small></span><input type="checkbox" name="showSpeed" ${workdayPrivacy.showSpeed ? 'checked' : ''} /></label>
      <label><span><b>Vis bil og status</b><small>Vis køretøj og kort status på kortet</small></span><input type="checkbox" name="showVehicle" ${workdayPrivacy.showVehicle ? 'checked' : ''} /></label>
      <label><span><b>Vis arbejdstatus</b><small>Fx deler GPS, pause eller aktiv</small></span><input type="checkbox" name="showStatus" ${workdayPrivacy.showStatus ? 'checked' : ''} /></label>
      <h4>Notifikationer</h4>
      <label><span><b>Kontoropslag</b><small>Vigtige beskeder fra driften</small></span><input type="checkbox" name="office" ${notificationPrefs.office ? 'checked' : ''} /></label>
      <label><span><b>Regelnyt</b><small>Godkendte ændringer til din kørsel</small></span><input type="checkbox" name="rules" ${notificationPrefs.rules ? 'checked' : ''} /></label>
      <label><span><b>Chatbeskeder</b><small>Direkte beskeder og dine kanaler</small></span><input type="checkbox" name="chat" ${notificationPrefs.chat ? 'checked' : ''} /></label>
      <label><span><b>Systembeskeder på telefonen</b><small>${text(systemStatus.label)} · ${text(systemStatus.detail)}</small></span><input type="checkbox" name="system" ${notificationPrefs.system ? 'checked' : ''} /></label>
      <label><span><b>Daglige påmindelser</b><small>Dagens tjekliste på forsiden</small></span><input type="checkbox" name="dailyBrief" ${notificationPrefs.dailyBrief ? 'checked' : ''} /></label>
      <label><span><b>Stille tid</b><small>Kun vigtige beskeder efter kl. 19.00</small></span><input type="checkbox" name="quietHours" ${notificationPrefs.quietHours ? 'checked' : ''} /></label>
    </div>
    <button type="button" class="ghost-btn" data-action="request-system-notifications">Aktivér systembeskeder</button>
    <p class="settings-help">Når Supabase forbindes, kan login, beskeder og profiler deles sikkert mellem medarbejderne.</p>
    <button class="save-btn">Gem indstillinger</button>
  </form>`;
  document.body.append(modal);
}

async function startPickupTask(task, modalElement = null) {
  const startedLocationSharing = !location.sharing;
  activePickup = {
    driverId: session?.userId || currentEmployee().id,
    image: null,
    priority: 'Normal',
    status: 'started',
    checklist: pickupChecklistItems().map(item => ({ ...item, done: item.id === 'route' })),
    steps: [{ status: 'started', at: new Date().toISOString() }],
    startedAt: new Date().toISOString(),
    startedLocationSharing,
    ...task,
    expiresAt: task.duration === 'until-done' ? null : new Date(Date.now() + Number(task.duration || 30) * 60 * 1000).toISOString(),
  };
  save('activePickup', activePickup);
  if (onlineBackendActive()) {
    try {
      await createSupabasePickupTask();
    } catch (error) {
      showToast(`Afhentningen er startet på telefonen, men online-synkronisering fejlede: ${error.message}`);
    }
  }
  addNotification({ type: 'Afhentning', title: 'Afhentning startet', body: activePickup.note || 'Midlertidig opgave er startet.', level: 'task' });
  modalElement?.remove();
  if (startedLocationSharing) {
    startLocationSharing('Afhentningen er startet, og din position deles midlertidigt');
  } else {
    render();
    showToast('Afhentningen er startet');
  }
}

async function openSupabaseDiagnosticsModal() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan teste Supabase-forbindelsen');
    return;
  }
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal supabase-diagnostics-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Supabase</p><h3>Tester forbindelse</h3>
    <p class="info-intro">Appen tester URL, nøgle, Auth og Data API fra denne enhed.</p>
    <section class="diagnostic-list"><span>Tester...</span></section>
  </section>`;
  document.body.append(modal);
  const list = modal.querySelector('.diagnostic-list');
  try {
    const checks = await runSupabaseDiagnostics();
    list.innerHTML = checks.map(check => `<article class="${check.ok ? 'ok' : 'fail'}"><b>${check.ok ? '✓' : '!' } ${text(check.name)}</b><small>${text(check.detail)}</small></article>`).join('');
  } catch (error) {
    list.innerHTML = `<article class="fail"><b>! Test fejlede</b><small>${text(error.message)}</small></article>`;
  }
}

function openMyDataModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal my-data-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Personbeskyttelse</p><h3>Mine data</h3>
    <p class="info-intro">Her kan medarbejderen se de vigtigste oplysninger, der findes i appen, og sende en intern dataanmodning. I online-versionen gemmes anmodningen i databasen.</p>
    <section class="employee-privacy-notice compact">
      <b>Dine vigtigste valg</b>
      <span>GPS er frivillig og kan begrænses i Indstillinger. Din personlige logbog er privat. Du kan bede om indsigt, rettelse, sletning, eksport, begrænsning eller indsigelse herfra.</span>
    </section>
    <div class="data-summary-grid">
      ${myDataSummary().map(([label, value, detail]) => `<span><b>${text(label)}</b><strong>${text(value)}</strong><small>${text(detail)}</small></span>`).join('')}
    </div>
    <form class="data-request-form">
      <h4>Send dataanmodning</h4>
      <label>Type<select name="requestType"><option value="access">Indsigt</option><option value="rectification">Rettelse</option><option value="erasure">Sletning</option><option value="export">Eksport</option><option value="restriction">Begrænsning</option><option value="objection">Indsigelse</option></select></label>
      <label>Kort besked<input name="message" placeholder="Skriv hvad du ønsker hjælp til..." required /></label>
      <button class="save-btn">Send anmodning</button>
    </form>
    <div class="request-list">
      <h4>Tidligere anmodninger</h4>
      ${dataRequests.length ? dataRequests.map(request => `<span><b>${text(request.label)}</b><small>${text(request.message)} · ${text(request.status)} · ${text(request.createdAt)}</small></span>`).join('') : '<p class="empty-state">Ingen dataanmodninger i demoen endnu.</p>'}
    </div>
  </section>`;
  document.body.append(modal);
}

function tabLabel(tab) {
  return {
    home: 'Forside',
    work: 'Arbejde',
    team: 'Kollegaer',
    map: 'Live-kort',
    chat: 'Beskeder',
    info: 'Information',
    more: 'Kontrolcenter',
  }[tab] || 'Appen';
}

function openSupportRequestModal() {
  const recent = supportRequests.slice(0, 5);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal support-request-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Hjælp appen frem</p><h3>Meld fejl eller ønske</h3>
    <p class="info-intro">Skriv kort hvad der driller, eller hvad du mangler. Meldingen gemmes med side, appversion og tidspunkt, så creator kan følge op uden lange forklaringer.</p>
    <form class="support-request-form">
      <label>Hvad handler det om?<select name="type">
        <option value="bug">Noget virker ikke</option>
        <option value="idea">Ønske til forbedring</option>
        <option value="design">Design/overskuelighed</option>
        <option value="content">Information mangler</option>
      </select></label>
      <label>Hvor i appen?<select name="area">
        <option value="${text(activeTab)}">${text(tabLabel(activeTab))}</option>
        <option value="home">Forside</option>
        <option value="work">Arbejde</option>
        <option value="chat">Beskeder</option>
        <option value="map">Live-kort</option>
        <option value="info">Information</option>
        <option value="more">Kontrolcenter</option>
      </select></label>
      <label>Beskrivelse<textarea name="message" rows="4" placeholder="Skriv fx: Jeg kan ikke finde lastbilchatten, eller knappen er svær at læse..." required></textarea></label>
      <button class="save-btn">Gem melding</button>
    </form>
    <section class="support-request-list">
      <h4>Seneste meldinger på denne enhed</h4>
      ${recent.length ? recent.map(request => `<article><b>${text(supportRequestTypeLabel(request.type))}</b><small>${text(request.areaLabel)} · ${text(request.createdAt)} · ${text(request.version)}</small><span>${text(request.message)}</span></article>`).join('') : '<p class="empty-state">Ingen meldinger endnu.</p>'}
    </section>
  </section>`;
  document.body.append(modal);
}

function supportRequestTypeLabel(type) {
  return {
    bug: 'Fejl',
    idea: 'Ønske',
    design: 'Design',
    content: 'Information',
  }[type] || 'Melding';
}

function saveSupportRequest(data) {
  const request = {
    id: `support-${Date.now()}`,
    type: String(data.get('type') || 'bug'),
    area: String(data.get('area') || activeTab),
    areaLabel: tabLabel(String(data.get('area') || activeTab)),
    message: String(data.get('message') || '').trim(),
    userName: profile.name,
    userEmail: profile.email,
    version: `${APP_DISPLAY_VERSION} · build ${APP_VERSION_CODE}`,
    createdAt: new Date().toLocaleString('da-DK', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: 'local',
  };
  if (!request.message) return false;
  supportRequests.unshift(request);
  supportRequests = supportRequests.slice(0, 50);
  save('supportRequests', supportRequests);
  addNotification({ type: 'App-feedback', title: 'Melding gemt', body: `${supportRequestTypeLabel(request.type)} er gemt lokalt til creator.`, level: 'message' });
  return true;
}

function openVehiclesModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal vehicles-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Flåde og status</p><h3>Køretøjsregister</h3>
    <p class="info-intro">Demo-register over biler og enheder. I online-versionen bør det kobles til rigtige køretøjsdata, service, skade og chaufførtilknytning.</p>
    <div class="vehicle-list">
      ${vehicles.map(vehicle => {
        const driver = vehicleDriver(vehicle);
        return `<article>
          <span class="vehicle-icon">${icon(vehicle.type === 'Varebil' ? 'van' : 'truck')}</span>
          <div><b>${text(vehicle.unit)}</b><small>${text(vehicle.type)} · ${text(vehicle.plate)}</small><em>${text(vehicle.equipment)}</em></div>
          <strong>${text(vehicle.status)}</strong>
          <small>${text(driver?.name || 'Ingen chauffør')} · ${text(vehicle.nextCheck)}</small>
        </article>`;
      }).join('')}
    </div>
  </section>`;
  document.body.append(modal);
}

function openNotificationsModal() {
  const summary = notificationSummary();
  const systemStatus = systemNotificationStatus();
  const priorityNotifications = notifications.filter(item => item.level === 'urgent' || item.priority === 'high');
  const unread = notifications.filter(item => item.unread);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal notifications-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Rolige beskeder</p><h3>Notifikationer</h3>
    <p class="info-intro">Rolige standarder: vigtige beskeder prioriteres, stille tid kan være slået til, og du vælger selv hvilke typer der må larme.</p>
    <div class="notification-digest">
      <span><b>${summary.unread}</b><small>ulæste</small></span>
      <span><b>${summary.urgent}</b><small>haster</small></span>
      <span><b>${notificationPrefs.quietHours ? 'Til' : 'Fra'}</b><small>Stille tid</small></span>
    </div>
    <article class="notification-permission-card">
      <b>Systembeskeder: ${text(systemStatus.label)}</b>
      <span>${text(systemStatus.detail)}</span>
      <button type="button" data-action="request-system-notifications">Aktivér på telefonen</button>
    </article>
    <div class="section-title"><h3>Prioritet</h3><button data-action="mark-notifications-read">Marker alt som læst</button></div>
    ${priorityNotifications.length ? `<div class="notification-list priority">${priorityNotifications.map(item => `<article class="${text(item.level)}"><small>${text(item.type)} · ${text(item.time)}</small><b>${text(item.title)}</b><span>${text(item.body)}</span></article>`).join('')}</div>` : '<p class="empty-state">Ingen hastebeskeder lige nu.</p>'}
    <div class="section-title"><h3>Ulæst</h3><span>${unread.length} stk.</span></div>
    ${unread.length ? `<div class="notification-list unread">${unread.map(item => `<article class="${text(item.level)}"><small>${text(item.type)} · ${text(item.time)}</small><b>${text(item.title)}</b><span>${text(item.body)}</span></article>`).join('')}</div>` : '<p class="empty-state">Du er ajour.</p>'}
    <div class="section-title"><h3>Alle beskeder</h3><span>${notifications.length} total</span></div>
    <div class="notification-list">
      ${notifications.map(item => `<article class="${text(item.level)}">
        <small>${text(item.type)} · ${text(item.time)}</small>
        <b>${text(item.title)}</b>
        <span>${text(item.body)}</span>
      </article>`).join('')}
    </div>
  </section>`;
  document.body.append(modal);
}

function openTaskOverviewModal() {
  const tasks = [
    ...(activePickup ? [{
      title: 'Afhentning for kollega',
      body: activePickup.note || 'Midlertidig hjælpeopgave er aktiv',
      action: 'open-pickup',
      status: pickupStatusLabel(activePickup.status),
    }] : []),
    ...logbookDrafts.map(draft => ({
      title: draft.title,
      body: `${draft.place} · ${draft.note}`,
      action: 'open-logbook',
      status: 'Logbogskladde',
    })),
    ...notifications.filter(item => item.unread).map(item => ({
      title: item.title,
      body: item.body,
      action: 'open-notifications',
      status: item.type || 'Ulæst',
    })),
  ];
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal task-overview-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Overblik</p><h3>Opgaver og kladder</h3>
    <p class="info-intro">Her samles det, der kræver handling fra dig. Tryk på en linje for at gå direkte til det rigtige sted.</p>
    <div class="request-list">
      ${tasks.length ? tasks.map(task => `<button type="button" data-action="${text(task.action)}"><b>${text(task.title)}</b><small>${text(task.status)} · ${text(task.body)}</small></button>`).join('') : '<p class="empty-state">Ingen aktive opgaver eller kladder lige nu.</p>'}
    </div>
  </section>`;
  document.body.append(modal);
}

function openCommentsModal(postId) {
  const post = announcements.find(item => item.id === postId);
  if (!post) return;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal comments-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Internt opslag</p><h3>Kommentarer</h3>
    <div class="comment-list">${post.comments.length ? post.comments.map(comment => `<span><b>Kollega</b><small>${text(comment)}</small></span>`).join('') : '<p class="empty-state">Ingen kommentarer endnu.</p>'}</div>
    <form class="comment-form" data-post="${text(post.id)}"><label>Skriv kommentar<input name="comment" placeholder="Skriv en kort kommentar..." required /></label><button class="save-btn">Tilføj kommentar</button></form>
  </section>`;
  document.body.append(modal);
}

function openContactListModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal contact-list-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Information</p><h3>Kontaktliste</h3>
    <p class="info-intro">Hurtig adgang til drift, akut hjælp og kollegaer. Brug kun listen til arbejdsrelateret kontakt.</p>
    ${renderContactDirectory()}
    <p class="source-note">Ved fare eller personskade: ring 112 først. Kontakt derefter driften.</p>
  </section>`;
  document.body.append(modal);
}

function openInfoModal(id) {
  const section = infoDetails[id];
  if (!section) return;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal info-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Intern information</p><h3>${text(section.title)}</h3>
    <p class="info-intro">${text(section.intro)}</p>
    <div class="info-detail-list">${section.rows.map(([title, description, href]) => href
      ? `<a href="${text(href)}" target="${href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer"><b>${text(title)}</b><small>${text(description)}</small>${icon('arrow', 'row-arrow')}</a>`
      : `<span><b>${text(title)}</b><small>${text(description)}</small></span>`
    ).join('')}</div>
  </section>`;
  document.body.append(modal);
}

function openRuleUpdatesModal() {
  const canSeeDrafts = canManageEmployees() || isCreatorOwner();
  const visibleRuleUpdates = canSeeDrafts ? ruleUpdates : ruleUpdates.filter(update => update.status === 'approved');
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal rule-updates-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Overvågede kilder</p><h3>Regelnyt</h3>
    <p class="info-intro">${canSeeDrafts ? 'Når appen forbindes online, kan den kontrollere udvalgte officielle kilder automatisk. Nye tekster bør godkendes internt, før medarbejderne får en besked.' : 'Her vises kun godkendte regelopdateringer, så medarbejderne får enkel og sikker information.'}</p>
    <div class="rule-update-list">${visibleRuleUpdates.map(update => `
      <a href="${text(update.href)}" target="_blank" rel="noreferrer">
        <div class="rule-meta"><small>${text(update.audience)}</small>${canSeeDrafts ? `<i class="approval-pill ${text(update.status)}">${text(update.status === 'approved' ? 'Godkendt' : 'Kladde')}</i>` : ''}</div>
        <b>${text(update.title)}</b>
        <span>${text(update.body)}</span><em>${text(update.source)} · ${text(update.checked)}</em>
        <strong>${text(update.effectiveDate)} · ${text(update.whyItMatters)}</strong>
      </a>`).join('') || '<p class="empty-state">Der er ingen godkendte regelopdateringer lige nu.</p>'}</div>
    <p class="source-note">Planlagt kontrol: dagligt. Notifikation: kun ved godkendte ændringer, så medarbejderne ikke bliver støjbelastet.</p>
  </section>`;
  document.body.append(modal);
}

function openAnnouncementModal() {
  if (!coreSettings.employeePosts && !canPublishOfficePosts()) {
    showToast('Kollegaopslag er midlertidigt slået fra');
    return;
  }
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<form class="profile-modal announcement-form">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Internt opslag</p><h3>Del med holdet</h3>
    <label>Overskrift<input name="title" placeholder="Hvad skal holdet vide?" required /></label>
    <label>Besked<input name="body" placeholder="Skriv en kort besked..." required /></label>
    <label>Billede<input name="image" type="file" accept="image/*" /></label>
    <label>Vis til<select name="audience"><option>Alle medarbejdere</option><option>Lastbilchauffører</option><option>Varebilschauffører</option></select></label>
    <button class="save-btn">Del opslag</button>
  </form>`;
  document.body.append(modal);
}

function openDispatchModal() {
  if (!isDispatcher()) {
    showToast('Kun drift/disponent kan åbne driftsoverblik');
    return;
  }
  const online = employees.filter(employee => employee.online);
  const sharing = employees.filter(employee => employee.sharing);
  const trucks = employees.filter(employee => employee.vehicleType === 'truck');
  const vans = employees.filter(employee => employee.vehicleType === 'van');
  const visiblePeople = visibleMapPeople();
  const activePickupCount = activePickup ? 1 : 0;
  const pendingRuleDrafts = ruleUpdates.filter(update => update.status !== 'approved').length;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal dispatch-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Kun disponenter</p><h3>Driftsoverblik</h3>
    <div class="dispatch-stats"><span><b>${online.length}</b><small>online</small></span><span><b>${visiblePeople.length}</b><small>synlige GPS</small></span><span><b>${trucks.length}</b><small>lastbiler</small></span><span><b>${vans.length}</b><small>varebiler</small></span><span><b>${activePickupCount}</b><small>afhentning</small></span><span><b>${pendingRuleDrafts}</b><small>regelkladder</small></span></div>
    <div class="dispatch-actions">
      <button data-action="new-announcement">Nyt opslag</button>
      <button data-action="open-rule-updates">Regelnyt</button>
      <button data-tab="map">Live-kort</button>
      <button data-tab="info">Information</button>
    </div>
    <div class="dispatch-privacy-box"><b>Privat chaufførchat er lukket</b><span>Disponentoverblikket viser drift, status og frivillig GPS. Det viser ikke indhold fra lastbilchatten eller varebilchatten.</span></div>
    <div class="dispatch-driver-list">${employees.map(employee => `<span><b>${text(employee.name)}</b><small>${text(vehicleLabel(employee.vehicleType))} · ${text(employee.status)} · ${employee.sharing ? 'deler GPS' : 'skjult'}</small></span>`).join('')}</div>
  </section>`;
  document.body.append(modal);
}

function openAdminModal() {
  if (!canManageEmployees() && !isCreatorOwner()) {
    showToast('Du har ikke adgang til chef/admin eller creator-drift');
    return;
  }
  const admins = employees.filter(employee => ['admin', 'owner'].includes(employee.accessRole));
  const dispatchers = employees.filter(employee => employee.accessRole === 'dispatcher');
  const lockedChannels = chats.filter(chat => chat.channel).length;
  const activeEmployees = employees.filter(employee => employee.employmentStatus !== 'offboarded');
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal admin-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">${canManageEmployees() ? 'Chef/admin' : 'Sikkerhedsmodel'}</p><h3>Rettigheder og sikkerhed</h3>
    <section class="admin-stats">
      <span><b>${admins.length}</b><small>chef/admin</small></span>
      <span><b>${dispatchers.length}</b><small>disponenter</small></span>
      <span><b>${lockedChannels}</b><small>låste kanaler</small></span>
      <span><b>${activeEmployees.length}</b><small>aktive profiler</small></span>
    </section>
    <section class="permission-grid">
      <span><b>Medarbejder</b><small>Kan redigere egne kontaktoplysninger, logbog og GPS-deling. Kan ikke ændre egen rettighed.</small></span>
      <span><b>Disponent</b><small>Kan oprette driftsopslag og se driftsoverblik, men ikke læse lastbil- eller varebilchatten.</small></span>
      <span><b>Chef/admin</b><small>Kan oprette medarbejdere, ændre roller, godkende regelnyt og styre sikkerhedsindstillinger.</small></span>
      <span><b>Privat data</b><small>Logbog er privat. GPS er frivillig. Historik bør slettes efter aftalt periode i online-versionen.</small></span>
    </section>
    ${canManageEmployees() ? `${renderAdminDashboard()}${isCreatorOwner() ? '' : `${renderOnboardingControlPanel()}<div class="admin-actions"><button data-action="new-employee">Registrér kollega</button><button data-action="open-rule-updates">Godkend regelnyt</button><button data-action="open-dispatch">Driftsoverblik</button></div>`}
    <form class="core-settings-form">
      <h4>Kernefunktioner</h4>
      <label><span><b>GPS-deling</b><small>Medarbejdere kan dele liveposition frivilligt</small></span><input type="checkbox" name="gps" ${coreSettings.gps ? 'checked' : ''} /></label>
      <label><span><b>Billeder</b><small>Upload til chat, opslag, profil og logbog</small></span><input type="checkbox" name="media" ${coreSettings.media ? 'checked' : ''} /></label>
      <label><span><b>Personlig logbog</b><small>Private noter og billeder fra vejen</small></span><input type="checkbox" name="logbook" ${coreSettings.logbook ? 'checked' : ''} /></label>
      <label><span><b>Kollegaopslag</b><small>Medarbejdere kan skrive opslag på forsiden</small></span><input type="checkbox" name="employeePosts" ${coreSettings.employeePosts ? 'checked' : ''} /></label>
      <label><span><b>Regelgodkendelse</b><small>Regelnyt skal godkendes før udsendelse</small></span><input type="checkbox" name="ruleApproval" ${coreSettings.ruleApproval ? 'checked' : ''} /></label>
      <button class="save-btn">Gem kernefunktioner</button>
    </form>
    <section class="admin-employee-list">
      <h4>Medarbejdere</h4>
      ${employees.map(employee => {
        const onboarding = employeeOnboardingState(employee);
        return `<article class="${employee.employmentStatus === 'offboarded' ? 'offboarded' : ''}">
        <span><b>${text(employee.name)}</b><small>${text(employee.role)} · ${text(accessRoleLabel(employee.accessRole))} · ${text(employee.employmentStatus || 'active')}</small><i class="onboarding-pill ${text(onboarding.tone)}">${text(onboarding.label)}</i></span>
        ${employee.id === 'th' ? '<em>Dig</em>' : employee.employmentStatus === 'offboarded' ? `<div class="employee-action-pair"><button class="restore" data-reactivate-employee="${text(employee.id)}">Aktivér igen</button><button class="danger" data-remove-employee="${text(employee.id)}">Slet helt</button></div>` : `<div class="employee-action-pair"><button class="restore" data-open-employee-invite="${text(employee.id)}">Invitation</button><button data-remove-employee="${text(employee.id)}">Deaktivér</button></div>`}
      </article>`;
      }).join('')}
    </section>` : (DEMO_MODE ? `<button class="save-btn" type="button" data-action="demo-admin">Prøv chefvisning i demo</button>` : '<p class="security-inline-note">Chefvisning kan kun gives af en eksisterende chef/admin.</p>')}
    <section class="admin-audit">
      <b>Chef/admin kan styre drift, ikke læse alt</b>
      <small>Chefrollen kan oprette/deaktivere medarbejdere og styre kernefunktioner. Lastbil- og varebilchat følger arbejdsfunktion, mens direkte samtaler kun er for deltagerne. Supabase håndhæver dette med RLS.</small>
    </section>
  </section>`;
  document.body.append(modal);
}

function openLaunchChecklistModal() {
  if (!canManageEmployees() && !isCreatorOwner()) {
    showToast('Kun chef/admin kan åbne go-live tjek');
    return;
  }
  const readiness = launchReadiness();
  const backend = supabaseStatus();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal launch-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Go-live</p><h3>Klar til drift</h3>
    <section class="launch-score">
      <span><b>${readiness.percent}%</b><small>${readiness.done}/${readiness.total} punkter klar</small></span>
      <em><i style="width:${readiness.percent}%"></i></em>
      <p>${text(backend.ready ? 'Supabase-forbindelsen er sat. Test nu med rigtige brugere og telefoner.' : 'Appen kører stadig som demo, indtil Supabase URL og offentlig nøgle er sat.')}</p>
    </section>
    <div class="launch-checklist">
      ${readiness.items.map(item => `<article class="${item.done ? 'done' : ''}">
        <b>${item.done ? '✓' : '○'} ${text(item.title)}</b>
        <small>${text(item.body)}</small>
      </article>`).join('')}
    </div>
    <section class="launch-next-steps">
      <h4>Praktisk rækkefølge</h4>
      <span>1. Opret Supabase-projekt og kør <b>supabase/schema.sql</b>.</span>
      <span>2. Opret første bruger i Supabase Auth og kør <b>supabase/first-admin.sql</b>.</span>
      <span>3. Sæt URL og offentlig nøgle under Indstillinger.</span>
      <span>4. Test to medarbejdere samtidig: chat, opslag, mød ind, GPS, livekort, billeder og afhentning.</span>
      <span>5. Godkend jura, slettefrister og databehandleraftale før rigtig drift.</span>
    </section>
    <div class="launch-actions">
      <button type="button" data-action="open-settings">Indstillinger</button>
      <button type="button" data-action="open-legal">Jura</button>
      <button type="button" data-action="open-admin">Chef/admin</button>
    </div>
  </section>`;
  document.body.append(modal);
}

function openGdprGoLiveModal() {
  if (!canManageEmployees() && !isCreatorOwner()) {
    showToast('Kun chef/admin kan åbne GDPR go-live pakken');
    return;
  }
  const readiness = gdprGoLiveReadiness();
  const pendingRequests = dataRequests.filter(request => !/completed|closed|done|afsluttet|rejected/i.test(request.status || ''));
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal gdpr-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">GDPR go-live</p><h3>Persondata klar til drift</h3>
    <p class="info-intro">Samlet pakke til medarbejderinformation, slettefrister, dataanmodninger og intern risikovurdering. Den hjælper jer tættere på GDPR, men virksomheden skal stadig godkende det juridisk.</p>
    ${renderGdprGoLivePanel()}
    <section class="employee-privacy-notice">
      <h4>Medarbejderinformation i klart sprog</h4>
      <p>XpressIntra bruges til intern drift: beskeder, kollegaoverblik, frivillig live-position, dokumentation, profiloplysninger og privat logbog. GPS kan stoppes, begrænses til hold og skjule fart, bil og status. Chef/admin kan styre drift og medarbejdere, men må ikke læse private direkte beskeder eller private logbøger.</p>
      <p>Medarbejderen kan bede om indsigt, rettelse, sletning, eksport, begrænsning eller indsigelse under Mine data.</p>
    </section>
    <section class="gdpr-data-areas">
      <h4>Dataområder og formål</h4>
      ${gdprDataAreas.map(item => `<article><b>${text(item.area)}</b><span>${text(item.purpose)}</span><small>${text(item.employeeControl)}</small></article>`).join('')}
    </section>
    <section class="gdpr-retention">
      <h4>Slettefrister</h4>
      ${gdprRetentionPlan.map(item => `<span><b>${text(item.label)}</b><strong>${item.days} dag${item.days === 1 ? '' : 'e'}</strong><small>${text(item.description)}</small></span>`).join('')}
    </section>
    <section class="gdpr-request-admin">
      <div class="section-title"><h3>Dataanmodninger</h3><span>${pendingRequests.length} åben</span></div>
      ${dataRequests.length ? dataRequests.map(request => `<article>
        <span><b>${text(request.label || request.requestType)}</b><small>${text(request.message || 'Ingen besked')} · ${text(request.status || 'open')} · ${text(request.createdAt || '')}</small></span>
        ${(canManageEmployees() || isCreatorOwner()) && !/completed|closed|done|afsluttet|rejected/i.test(request.status || '') ? `<button data-complete-data-request="${text(request.id)}">Marker behandlet</button>` : ''}
      </article>`).join('') : '<p class="empty-state">Ingen dataanmodninger endnu.</p>'}
    </section>
    <section class="gdpr-next-steps">
      <h4>Skal stadig besluttes uden for appen</h4>
      <span>Databehandleraftaler med Supabase, hosting, kort og mail.</span>
      <span>Lovligt grundlag for hvert dataområde.</span>
      <span>Risikovurdering/DPIA for GPS og medarbejderkontrol.</span>
      <span>Procedure for sikkerhedsbrud og 72-timers vurdering.</span>
    </section>
    <div class="launch-actions">
      <button type="button" data-action="open-my-data">Mine data</button>
      <button type="button" data-action="open-legal">Jura-accept</button>
      <button type="button" data-action="open-launch-checklist">Go-live tjek</button>
    </div>
  </section>`;
  document.body.append(modal);
}

function openSecurityCenterModal() {
  if (!isCreatorOwner()) {
    showToast('Kun creator kan åbne sikkerhedscenter');
    return;
  }
  const readiness = securityReadiness();
  const backend = supabaseStatus();
  const criticalOpen = readiness.items.filter(item => !item.done).slice(0, 4);
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal security-center-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Creator / sikkerhed</p><h3>Sikkerhedscenter</h3>
    <p class="info-intro">Her samles hacking-beskyttelse, admin-adgang, mistet telefon, upload, audit-log og de Supabase-ting der skal kontrolleres før appen bruges bredt.</p>
    <section class="security-score-card">
      <span><b>${readiness.percent}%</b><small>${readiness.done}/${readiness.total} punkter klar</small></span>
      <em><i style="width:${readiness.percent}%"></i></em>
      <p>${text(backend.ready ? 'Supabase er sat. Kør stadig Security Advisor og test med rigtige brugere.' : 'Supabase mangler stadig live-test, før sikkerheden kan vurderes færdig.')}</p>
    </section>
    <section class="security-check-list">
      ${readiness.items.map(item => `<article class="${item.done ? 'done' : 'todo'}">
        <b>${item.done ? '✓' : '•'} ${text(item.title)}</b>
        <small>${text(item.body)}</small>
      </article>`).join('')}
    </section>
    <section class="security-incident-plan">
      <h4>Hvis noget går galt</h4>
      <span><b>1. Stop adgang</b><small>Deaktiver brugeren, skift adgangskode og log/revoker sessioner i Supabase.</small></span>
      <span><b>2. Begræns skade</b><small>Slå GPS, billeder eller opslag fra under kernefunktioner hvis fejlen vedrører data.</small></span>
      <span><b>3. Spor hændelsen</b><small>Gem tidspunkt, bruger, handling og hvad der kan være set eller delt.</small></span>
      <span><b>4. Vurder GDPR</b><small>Ved persondata-brud skal virksomheden vurdere Datatilsynet og medarbejderinformation hurtigt.</small></span>
    </section>
    <section class="security-next-actions">
      <h4>Næste praktiske handlinger</h4>
      ${criticalOpen.length ? criticalOpen.map(item => `<span>${text(item.title)}: ${text(item.body)}</span>`).join('') : '<span>Ingen åbne sikkerhedspunkter i appens interne tjek lige nu.</span>'}
    </section>
    <div class="launch-actions">
      <button type="button" data-action="test-supabase">Test Supabase</button>
      <button type="button" data-action="open-admin">Kernefunktioner</button>
      <button type="button" data-action="open-gdpr-go-live">GDPR pakke</button>
    </div>
  </section>`;
  document.body.append(modal);
}

function openLegalModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="profile-modal legal-modal">
    <button type="button" class="modal-close" data-action="close-modal">${icon('close')}</button>
    <p class="eyebrow">Intern politik</p><h3>Sikkerhed & jura</h3>
    <section class="legal-status-card">
      <b>${text(legalStatusText())}</b>
      <span>Alle medarbejdere bør gennemgå denne side før rigtig drift. Demo-accept gemmes kun lokalt.</span>
    </section>
    ${renderGdprGoLivePanel({ compact: true })}
    ${canManageEmployees() || isCreatorOwner() ? '<button class="save-btn secondary" type="button" data-action="open-gdpr-go-live">Åbn GDPR go-live pakke</button>' : ''}
    <div class="legal-grid">
      <article><b>GPS</b><span>GPS er frivillig, synlig og kan stoppes. Chef/admin må ikke bruge appen som skjult overvågning.</span></article>
      <article><b>Chats</b><span>Fælleschat er intern. Lastbil- og varebilchat følger arbejdsfunktion. Chef/admin kan kun se kanalchat, hvis profilen også er sat som lastbil- eller varebilsfunktion.</span></article>
      <article><b>Billeder</b><span>Billeder kan være persondata. Undgå kunder, uvedkommende personer og følsomme dokumenter i delte billeder.</span></article>
      <article><b>Logbog</b><span>Personlig logbog er privat som standard og må ikke bruges som kontrolværktøj.</span></article>
      <article><b>Profiler</b><span>Kontaktoplysninger, beviser, sprog og nødkontakt skal kun bruges til drift og sikkerhed.</span></article>
      <article><b>Sletning</b><span>GPS bør gemmes kort. Chat, billeder og audit-log skal have aftalte slettefrister før online drift.</span></article>
    </div>
    <section class="privacy-rights">
      <h4>Personbeskyttelse</h4>
      <p>Appen skal bygges efter privatliv som standard: mindst mulig data, tydelig adgang, og medarbejderen skal kunne forstå og styre egne oplysninger.</p>
      <div>
        <span><b>Indsigt</b><small>Medarbejderen skal kunne se hvilke data appen gemmer om personen.</small></span>
        <span><b>Rettelse</b><small>Forkerte profiloplysninger skal kunne rettes hurtigt.</small></span>
        <span><b>Sletning</b><small>Data skal slettes når formålet er væk eller fristen er udløbet.</small></span>
        <span><b>Eksport</b><small>Egne data boer kunne hentes ud i et laesbart format.</small></span>
        <span><b>Begrænsning</b><small>Frivillige ting som profilbillede, logbog og GPS skal kunne slås fra.</small></span>
        <span><b>Adgangsspor</b><small>Adminhandlinger logges, men private chats og logboeger maa ikke indgaa.</small></span>
      </div>
    </section>
    <section class="gdpr-readiness">
      <h4>GDPR-driftstjek før rigtig brug</h4>
      <span><b>Formål</b><small>Skriv kort hvorfor appen bruger profil, chat, GPS, billeder, logbog og dokumenter.</small></span>
      <span><b>Lovligt grundlag</b><small>Aftal med virksomheden hvilket grundlag der bruges for hvert dataområde. GPS bør være frivillig og tydelig.</small></span>
      <span><b>Dataminimering</b><small>Slå ting fra som ikke er nødvendige. Fart, bil og status skal kun deles hvis medarbejderen har valgt det.</small></span>
      <span><b>Databehandler</b><small>Supabase, hosting og eventuelle kort-/mailtjenester kræver aftaler og dokumenteret opsætning.</small></span>
      <span><b>Risikovurdering</b><small>Lav en enkel DPIA/risikovurdering især for GPS, medarbejderkontrol og billeder.</small></span>
      <span><b>Sikkerhedsbrud</b><small>Aftal hvem der reagerer ved læk, forkert adgang, mistet telefon eller delte billeder med persondata.</small></span>
    </section>
    <section class="retention-list">
      <h4>Foreslåede slettefrister</h4>
      <span><b>Live GPS</b><small>Seneste position, overskrives løbende</small></span>
      <span><b>Afhentningsdeling</b><small>Udløber automatisk eller ved færdigmelding</small></span>
      <span><b>Chat</b><small>12-24 måneder, besluttes internt</small></span>
      <span><b>Billeder</b><small>3-12 måneder afhængigt af dokumentationsformål</small></span>
      <span><b>Audit-log</b><small>24 måneder</small></span>
    </section>
    <section class="legal-decision-list">
      <h4>Skal besluttes af virksomheden</h4>
      <span>Hvem er dataansvarlig?</span>
      <span>Hvem må være chef/admin?</span>
      <span>Skal GPS kun være live, eller må der gemmes historik?</span>
      <span>Hvilke billeder må deles?</span>
      <span>Hvordan håndteres fratrådte medarbejdere?</span>
    </section>
    <button class="save-btn" type="button" data-action="accept-legal">Jeg har læst og forstået</button>
  </section>`;
  document.body.append(modal);
}

function acceptLegal() {
  legalAcceptance = { date: new Date().toLocaleDateString('da-DK'), version: GDPR_POLICY_VERSION };
  save('legalAcceptance', legalAcceptance);
  if (onlineBackendActive()) {
    acceptSupabaseLegal().catch(error => showToast(`Accepten blev gemt lokalt, men ikke online: ${error.message}`));
  }
  document.querySelector('.modal-backdrop')?.remove();
  render();
  showToast('Sikkerhed & jura er markeret som læst');
}

function removeEmployee(employeeId) {
  if (!canManageEmployees()) {
    showToast('Kun chef/admin kan fjerne medarbejdere');
    return;
  }
  const employee = employees.find(item => item.id === employeeId);
  if (!employee || employee.id === 'th') return;
  if (employee.employmentStatus === 'offboarded') {
    employees = employees.filter(item => item.id !== employeeId);
    chats = chats.filter(chat => chat.id !== employeeId);
    delete messages[employeeId];
    recordAdminAudit('Medarbejder fjernet', `${employee.name} blev fjernet fra demoen`);
    showToast('Medarbejderen er fjernet fra demoen');
  } else {
    employee.employmentStatus = 'offboarded';
    employee.online = false;
    employee.sharing = false;
    employee.status = 'Deaktiveret';
    recordAdminAudit('Medarbejder deaktiveret', `${employee.name} blev deaktiveret`);
    if (onlineBackendActive()) {
      updateSupabaseEmployeeProfile(employee).catch(error => showToast(`Medarbejderen er deaktiveret lokalt, men ikke online: ${error.message}`));
    }
    showToast('Medarbejderen er deaktiveret');
  }
  save('employees', employees);
  save('chats', chats);
  save('messages', messages);
  document.querySelector('.modal-backdrop')?.remove();
  render();
  openAdminModal();
}

function reactivateEmployee(employeeId) {
  if (!canManageEmployees()) {
    showToast('Kun chef/admin kan aktivere medarbejdere');
    return;
  }
  const employee = employees.find(item => item.id === employeeId);
  if (!employee || employee.id === 'th') return;
  employee.employmentStatus = 'active';
  employee.status = 'Aktiv igen';
  employee.online = false;
  employee.sharing = false;
  recordAdminAudit('Medarbejder aktiveret', `${employee.name} blev aktiveret igen`);
  if (onlineBackendActive()) {
    updateSupabaseEmployeeProfile(employee).catch(error => showToast(`Medarbejderen er aktiveret lokalt, men ikke online: ${error.message}`));
  }
  save('employees', employees);
  document.querySelector('.modal-backdrop')?.remove();
  render();
  openAdminModal();
  showToast('Medarbejderen er aktiveret igen');
}

function enableDemoAdmin() {
  if (!DEMO_MODE) {
    showToast('Demo-admin er slået fra i denne version');
    return;
  }
  profile = { ...profile, role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse' };
  if (!employees.length) employees.unshift(currentEmployee());
  employees[0] = { ...employees[0], role: 'Chef', accessRole: 'admin', vehicleType: 'dispatch', truck: 'Ledelse', status: 'Demo: chef/admin' };
  save('profile', profile);
  save('employees', employees);
  document.querySelector('.modal-backdrop')?.remove();
  render();
  showToast('Demoen viser nu chef/admin-rettigheder');
}

function resetDemo() {
  if (!DEMO_MODE) {
    showToast('Demo-data er slået fra i produktionsappen');
    return;
  }
  navigator.geolocation?.clearWatch(location.watchId);
  clearInterval(location.timer);
  location = { sharing: false, demo: false, speed: 0, points: 0, watchId: null, timer: null, coords: null, startedAt: null, expiresAt: null, lastUpdatedAt: null, shareMode: null };
  Object.keys(localStorage).filter(key => key.startsWith('roadlog:') && key !== 'roadlog:session').forEach(key => localStorage.removeItem(key));
  employees = clone(seedEmployees);
  chats = clone(seedChats);
  messages = clone(seedMessages);
  announcements = clone(seedAnnouncements);
  feedLikes = {};
  infoFavorites = [];
  notificationPrefs = { ...defaultNotificationPrefs };
  workdayPrivacy = { gps: true, logbook: true, notifications: true, audience: 'all', showSpeed: false, showVehicle: true, showStatus: true };
  coreSettings = { gps: true, logbook: true, media: true, employeePosts: true, ruleApproval: true };
  workday = { active: false, startedAt: null, endsAt: null, permissions: { gps: true, logbook: true, notifications: true } };
  vehicles = clone(seedVehicles);
  notifications = clone(seedNotifications);
  dataRequests = [];
  adminAuditEvents = [];
  activePickup = null;
  pickupHistory = [];
  creatorRoleTester = { active: false, originalProfile: null, currentRole: null };
  profile = { name: 'Tommy Hansen', phone: '+45 22 44 18 90', email: 'stralner2711@gmail.com', role: 'Appansvarlig · Lastbilchauffør', accessRole: 'owner', vehicleType: 'truck', truck: 'TR 42 918', department: 'Lastbil', license: 'C/E · EU kvalifikationsbevis', emergencyContact: 'Anne · +45 22 11 90 90', languages: 'Dansk, engelsk, tysk', logbook: true };
  logEntries = [
    { place: 'Flensburg', note: 'God kaffe og en rolig pause ved grænsen.', date: '28. maj' },
    { place: 'Hamburg', note: 'Solnedgang ved havnen efter aflæsning.', date: '25. maj' },
  ];
  logbookDrafts = [];
  logbookAutomation = { smartLogbook: true, autoDrafts: true, autoPlace: true, autoStops: true, autoPickup: true, autoVehicle: true, autoMilestones: false };
  render();
  showToast('Demoen er nulstillet');
}

function currentScrollState() {
  const content = document.querySelector('.content');
  return {
    top: content ? content.scrollTop : window.scrollY,
    left: content ? content.scrollLeft : window.scrollX,
  };
}

function restoreScrollState(state) {
  const content = document.querySelector('.content');
  if (content) {
    content.scrollTop = state.top;
    content.scrollLeft = state.left;
    return;
  }
  window.scrollTo(state.left, state.top);
}

function render(options = {}) {
  const scrollState = options.preserveScroll ? currentScrollState() : null;
  enforceLocationExpiry();
  enforceWorkdayExpiry();
  enforcePickupExpiry();
  document.querySelector('#app').innerHTML = session ? appShell(routes[activeTab]()) : renderLogin();
  if (!document.querySelector('.toast')) document.body.insertAdjacentHTML('beforeend', '<div class="toast"></div>');
  if (scrollState) {
    const nextFrame = window.requestAnimationFrame || (callback => setTimeout(callback, 0));
    nextFrame(() => restoreScrollState(scrollState));
    setTimeout(() => restoreScrollState(scrollState), 0);
  }
  ensureLaunchSplash();
  scheduleLaunchSplashExit();
  setTimeout(initializeMaps, 0);
}

function handleSearchInput(event, selector, updateValue) {
  if (!event.target.matches(selector)) return false;
  const cursorStart = event.target.selectionStart;
  const cursorEnd = event.target.selectionEnd;
  updateValue(event.target.value);
  render({ preserveScroll: true });
  const restoreInput = () => {
    const input = document.querySelector(selector);
    if (!input) return;
    input.focus({ preventScroll: true });
    if (typeof cursorStart === 'number' && typeof cursorEnd === 'number' && input.setSelectionRange) {
      try {
        input.setSelectionRange(cursorStart, cursorEnd);
      } catch (error) {
        console.warn('Søgefeltets cursor kunne ikke genskabes', error);
      }
    }
  };
  const nextFrame = window.requestAnimationFrame || (callback => setTimeout(callback, 0));
  nextFrame(restoreInput);
  setTimeout(restoreInput, 0);
  return true;
}

document.addEventListener('click', async event => {
  const tab = event.target.closest('[data-tab]')?.dataset.tab;
  const action = event.target.closest('[data-action]')?.dataset.action;
  const employeeId = event.target.closest('[data-employee]')?.dataset.employee;
  let chatId = event.target.closest('[data-chat]')?.dataset.chat;
  const directChatEmployeeId = event.target.closest('[data-direct-chat]')?.dataset.directChat;
  const postId = event.target.closest('[data-post]')?.dataset.post;
  const nextMapFilter = event.target.closest('[data-map-filter]')?.dataset.mapFilter;
  const quickGuideIndex = event.target.closest('[data-guide]')?.dataset.guide;
  const emoji = event.target.closest('[data-emoji]')?.dataset.emoji;
  const removeEmployeeId = event.target.closest('[data-remove-employee]')?.dataset.removeEmployee;
  const reactivateEmployeeId = event.target.closest('[data-reactivate-employee]')?.dataset.reactivateEmployee;
  const pickupStatus = event.target.closest('[data-pickup-status]')?.dataset.pickupStatus;
  const pickupCheck = event.target.closest('[data-pickup-check]')?.dataset.pickupCheck;
  const logbookSuggestion = event.target.closest('[data-logbook-suggestion]')?.dataset.logbookSuggestion;
  const logbookToggle = event.target.closest('[data-logbook-toggle]')?.dataset.logbookToggle;
  const approveDraftId = event.target.closest('[data-approve-logbook-draft]')?.dataset.approveLogbookDraft;
  const deleteDraftId = event.target.closest('[data-delete-logbook-draft]')?.dataset.deleteLogbookDraft;
  const infoFavoriteId = event.target.closest('[data-info-favorite]')?.dataset.infoFavorite;
  const locationDuration = event.target.closest('[data-location-duration]')?.dataset.locationDuration;
  const creatorRole = event.target.closest('[data-creator-role]')?.dataset.creatorRole;
  const quickPickupDuration = event.target.closest('[data-quick-pickup]')?.dataset.quickPickup;
  const completeDataRequestId = event.target.closest('[data-complete-data-request]')?.dataset.completeDataRequest;
  const resendConfirmationEmail = event.target.closest('[data-resend-confirmation]')?.dataset.resendConfirmation;
  const openEmployeeInviteId = event.target.closest('[data-open-employee-invite]')?.dataset.openEmployeeInvite;
  const searchResult = event.target.closest('[data-search-target]');
  if (blockInternalAction(action)) return;
  if (searchResult) {
    activeTab = searchResult.dataset.searchTarget;
    activeChat = searchResult.dataset.searchChat || null;
    if (searchResult.dataset.searchInfo) activeInfoCategory = searchResult.dataset.searchInfo;
    globalQuery = '';
    event.target.closest('.modal-backdrop')?.remove();
    render();
    if (searchResult.dataset.searchAction === 'open-vehicles') openVehiclesModal();
    if (searchResult.dataset.searchAction === 'open-logbook') openLogbookModal();
    return;
  }
  if (removeEmployeeId) {
    removeEmployee(removeEmployeeId);
    return;
  }
  if (reactivateEmployeeId) {
    reactivateEmployee(reactivateEmployeeId);
    return;
  }
  if (resendConfirmationEmail) {
    if (!canManageEmployees()) {
      showToast('Kun chef/admin kan gensende bekræftelsesmail');
      return;
    }
    try {
      const email = await resendSupabaseSignupConfirmation(resendConfirmationEmail);
      recordAdminAudit('Bekræftelsesmail gensendt', email);
      showToast(`Bekræftelsesmail er sendt til ${email}`);
    } catch (error) {
      showToast(`Kunne ikke gensende bekræftelsesmail: ${error.message}`);
    }
    return;
  }
  if (openEmployeeInviteId) {
    if (!canManageEmployees()) {
      showToast('Kun chef/admin kan åbne invitationer');
      return;
    }
    const employee = employees.find(item => item.id === openEmployeeInviteId);
    if (!employee) return;
    event.target.closest('.modal-backdrop')?.remove();
    openEmployeeInviteResultModal(employee, employee.invitationId || '');
    return;
  }
  if (completeDataRequestId) {
    completeDataRequest(completeDataRequestId);
    return;
  }
  if (emoji) {
    const input = document.querySelector('.message-form input[name="message"]');
    if (input) {
      input.value = `${input.value}${emoji}`;
      input.focus();
    }
    return;
  }
  if (tab) { activeTab = tab; activeChat = null; event.target.closest('.modal-backdrop')?.remove(); render(); }
  if (nextMapFilter) {
    mapFilter = nextMapFilter;
    save('mapFilter', mapFilter);
    render();
  }
  if (pickupStatus) await updatePickupStatus(pickupStatus);
  if (quickPickupDuration) {
    const form = event.target.closest('.pickup-form');
    const selectedEmployee = form?.querySelector('select[name="employee"]')?.value || employees.find(employee => employee.id !== currentEmployee().id && employee.id !== session?.userId)?.id;
    const colleague = employees.find(employee => employee.id === selectedEmployee);
    await startPickupTask({
      employeeId: selectedEmployee,
      duration: quickPickupDuration,
      pickupPlace: colleague?.location || 'Aftales i live noter',
      dropoffPlace: currentEmployee().location || profile.department || 'Min position',
      reference: 'Hurtig opgave',
      note: `Hurtig afhentning for ${colleague?.name || 'kollega'}`,
    }, event.target.closest('.modal-backdrop'));
    return;
  }
  if (pickupCheck) {
    await togglePickupChecklist(pickupCheck);
    return;
  }
  if (approveDraftId) {
    approveLogbookDraft(approveDraftId);
    event.target.closest('.modal-backdrop')?.remove();
    openLogbookModal();
    render();
    showToast('Kladden er gemt i din private logbog');
    return;
  }
  if (deleteDraftId) {
    deleteLogbookDraft(deleteDraftId);
    event.target.closest('.modal-backdrop')?.remove();
    openLogbookModal();
    showToast('Kladden er slettet');
    return;
  }
  if (logbookSuggestion) {
    createAutoLogEntry(logbookSuggestion);
    event.target.closest('.modal-backdrop')?.remove();
    openLogbookModal();
    render();
    showToast('Forslaget er gemt i din private logbog');
    return;
  }
  if (logbookToggle) {
    toggleLogbookAutomation(logbookToggle);
    event.target.closest('.modal-backdrop')?.remove();
    openLogbookModal();
    showToast('Logbogens automatik er opdateret');
    return;
  }
  if (infoFavoriteId) {
    event.preventDefault();
    toggleInfoFavorite(infoFavoriteId);
    render();
    showToast(infoFavorites.includes(infoFavoriteId) ? 'Gemt som favorit' : 'Fjernet fra favoritter');
    return;
  }
  if (locationDuration) {
    startTimedLocationSharing(Number(locationDuration));
    return;
  }
  if (creatorRole) {
    applyCreatorPerspective(creatorRole);
    return;
  }
  if (chatId) {
    if (chatId === 'all') chatId = chats.find(item => item.community)?.id || chatId;
    activeTab = 'chat';
    activeChat = chatId;
    const chat = chats.find(item => item.id === chatId);
    if (!canAccessChat(chat)) { showToast('Du har ikke adgang til denne kanal'); return; }
    if (chat) chat.unread = 0;
    save('chats', chats);
    event.target.closest('.modal-backdrop')?.remove();
    render();
  }
  if (employeeId) {
    event.target.closest('.modal-backdrop')?.remove();
    openProfileModal(employees.find(employee => employee.id === employeeId));
  }
  if (directChatEmployeeId) {
    const employee = employees.find(item => item.id === directChatEmployeeId);
    if (employee) {
      const chatId = await ensureDirectChat(employee);
      if (!chatId) return;
      activeTab = 'chat';
      activeChat = chatId;
      event.target.closest('.modal-backdrop')?.remove();
      render();
    }
  }
  const modalReplacingActions = [
    'open-pickup',
    'open-profile',
    'open-logbook',
    'open-my-data',
    'open-vehicles',
    'open-notifications',
    'open-support-request',
    'open-task-overview',
    'request-system-notifications',
    'new-chat',
    'open-settings',
    'test-supabase',
    'show-update-status',
    'open-rollback-center',
    'open-creator-user-test',
    'open-admin',
    'open-launch-checklist',
    'open-gdpr-go-live',
    'open-legal',
    'open-contact-list',
    'open-info',
    'open-rule-updates',
    'new-announcement',
    'open-dispatch',
  ];
  if (action && modalReplacingActions.includes(action)) {
    event.target.closest('.modal-backdrop')?.remove();
  }
  if (action === 'toggle-location') toggleLocation();
  if (action === 'start-workday') await startWorkday();
  if (action === 'end-workday') await endWorkday();
  if (action === 'open-pickup') openPickupModal();
  if (action === 'finish-pickup') await finishPickup();
  if (action === 'open-profile') openProfileModal();
  if (action === 'open-logbook') openLogbookModal();
  if (action === 'open-my-data') openMyDataModal();
  if (action === 'open-vehicles') openVehiclesModal();
  if (action === 'open-notifications') openNotificationsModal();
  if (action === 'open-support-request') openSupportRequestModal();
  if (action === 'open-task-overview') openTaskOverviewModal();
  if (action === 'open-map') { activeTab = 'map'; activeChat = null; render(); }
  if (action === 'mark-notifications-read') {
    markAllNotificationsRead();
    event.target.closest('.modal-backdrop')?.remove();
    openNotificationsModal();
    render();
  }
  if (action === 'new-chat') openNewChatModal();
  if (action === 'open-settings') openSettingsModal();
  if (action === 'request-system-notifications') {
    await requestSystemNotifications();
    event.target.closest('.modal-backdrop')?.remove();
    openSettingsModal();
  }
  if (action === 'test-supabase') openSupabaseDiagnosticsModal();
  if (action === 'check-update') await checkForAppUpdate({ manual: true });
  if (action === 'show-update-status') openUpdateStatusModal();
  if (action === 'open-rollback-center') openRollbackCenterModal();
  if (action === 'open-creator-user-test') openCreatorUserTestModal();
  if (action === 'install-pwa') await installPwaApp();
  if (action === 'reload-for-install') window.location.reload();
  if (action === 'install-update') await installAppUpdate(appUpdateState.required?.apkDownloadUrl || appUpdateState.latest?.apkDownloadUrl);
  if (action === 'install-stable-rollback') await installStableRollbackVersion();
  if (action === 'mark-current-version-suspect') markCurrentVersionSuspect();
  if (action === 'dismiss-update') {
    if (appUpdateState.latest) appUpdateState.dismissedVersionCode = appUpdateState.latest.activeVersionCode;
    saveAppUpdateState();
    event.target.closest('.modal-backdrop')?.remove();
    showToast('Opdateringen vises igen senere');
  }
  if (action === 'open-download-page') openExternalUpdateLink(appUpdateState.latest?.downloadPageUrl || './download.html');
  if (action === 'open-version-json') openExternalUpdateLink(appUpdateConfig.versionUrl || './version.json');
  if (action === 'open-admin') openAdminModal();
  if (action === 'open-security-center') openSecurityCenterModal();
  if (action === 'open-launch-checklist') openLaunchChecklistModal();
  if (action === 'open-gdpr-go-live') openGdprGoLiveModal();
  if (action === 'open-legal') openLegalModal();
  if (action === 'open-contact-list') openContactListModal();
  if (action === 'accept-legal') acceptLegal();
  if (action === 'demo-admin') enableDemoAdmin();
  if (action === 'share-last-invite') {
    const modal = event.target.closest('.modal-backdrop');
    const employee = employees.find(item => item.id === modal?.dataset.inviteEmployee);
    if (employee) {
      shareEmployeeInvite(employee, modal?.dataset.inviteId || employee.invitationId || '').catch(error => showToast(`Invitationen kunne ikke deles: ${error.message}`));
    }
  }
  if (action === 'copy-last-invite-link') {
    const modal = event.target.closest('.modal-backdrop');
    await copyTextToClipboard(modal?.dataset.inviteUrl, 'Invitationslink kopieret');
  }
  if (action === 'copy-last-invite-message') {
    const modal = event.target.closest('.modal-backdrop');
    await copyTextToClipboard(modal?.dataset.inviteMessage, 'Invitationsbesked kopieret');
  }
  if (action === 'resend-last-confirmation') {
    if (!canManageEmployees()) {
      showToast('Kun chef/admin kan gensende bekræftelsesmail');
      return;
    }
    const modal = event.target.closest('.modal-backdrop');
    try {
      const email = await resendSupabaseSignupConfirmation(modal?.dataset.inviteEmail);
      recordAdminAudit('Bekræftelsesmail gensendt', email);
      showToast(`Bekræftelsesmail er sendt til ${email}`);
    } catch (error) {
      showToast(`Kunne ikke gensende bekræftelsesmail: ${error.message}`);
    }
  }
  if (action === 'resend-pending-confirmation') {
    const modal = event.target.closest('.modal-backdrop');
    try {
      const email = await resendSupabaseSignupConfirmation(modal?.dataset.confirmationEmail);
      showToast(`Bekræftelsesmail er sendt til ${email}`);
    } catch (error) {
      showToast(`Kunne ikke gensende bekræftelsesmail: ${error.message}`);
    }
  }
  if (action === 'open-info') openInfoModal(event.target.closest('[data-info]')?.dataset.info);
  if (action === 'open-work') { activeTab = 'work'; activeChat = null; render(); }
  if (quickGuideIndex) {
    const guide = quickGuides[Number(quickGuideIndex)];
    if (guide?.chat) {
      activeTab = 'chat';
      activeChat = guide.chat;
      render();
    } else if (guide?.category) {
      activeTab = 'info';
      activeInfoCategory = guide.category;
      render();
    }
  }
  if (action === 'open-rule-updates') openRuleUpdatesModal();
  if (action === 'use-current-logbook-place') {
    const input = event.target.closest('.log-entry-form')?.querySelector('input[name="place"]');
    if (input) {
      input.value = currentLogbookPlace();
      input.focus();
      showToast('Din lokation er sat som sted');
    }
  }
  if (action === 'clear-logbook-drafts') {
    clearLogbookDrafts();
    event.target.closest('.modal-backdrop')?.remove();
    openLogbookModal();
    showToast('Private kladder er ryddet');
  }
  if (action === 'open-comments') openCommentsModal(postId);
  if (action === 'toggle-like' && postId) {
    feedLikes[postId] = !feedLikes[postId];
    save('feedLikes', feedLikes);
    if (onlineBackendActive()) {
      syncSupabaseAnnouncementReaction(postId, feedLikes[postId]).catch(error => showToast(`Reaktionen blev gemt lokalt, men ikke online: ${error.message}`));
    }
    render();
  }
  if (action === 'zoom-in') { mapZoom = Math.min(2, mapZoom + 1); render(); }
  if (action === 'zoom-out') { mapZoom = Math.max(0, mapZoom - 1); render(); }
  const infoCategory = event.target.closest('[data-info-category]')?.dataset.infoCategory;
  if (infoCategory) { activeInfoCategory = infoCategory; render(); }
  if (action === 'new-announcement') openAnnouncementModal();
  if (action === 'open-dispatch') openDispatchModal();
  if (action === 'new-employee') {
    event.target.closest('.modal-backdrop')?.remove();
    openProfileModal({ id: 'new', initials: '+', online: false, accessRole: 'employee', vehicleType: 'truck' }, true);
  }
  if (action === 'close-modal') event.target.closest('.modal-backdrop').remove();
  if (action === 'back-chats') { activeChat = null; render(); }
  if (action === 'logout') await signOut();
  if (action === 'reset-demo') resetDemo();
});

document.addEventListener('input', event => {
  if (handleSearchInput(event, '[data-global-search]', value => { globalQuery = value; })) return;
  if (handleSearchInput(event, '[data-team-search]', value => { teamQuery = value; })) return;
  if (handleSearchInput(event, '[data-info-search]', value => { infoQuery = value; })) return;
  if (handleSearchInput(event, '[data-chat-search]', value => { chatQuery = value; })) return;
});

document.addEventListener('change', async event => {
  const input = event.target;
  if (!input.matches('input[name="photo"]')) return;
  const preview = input.closest('.profile-photo-field')?.querySelector('[data-profile-photo-preview]');
  const image = await readImageFile(input.files?.[0], { kind: 'profile' });
  if (!preview || !image) return;
  preview.classList.remove('is-empty');
  preview.innerHTML = `<img src="${text(image.src)}" alt="Valgt profilbillede" />`;
});

document.addEventListener('submit', async event => {
  if (event.target.matches('.standard-signup-password-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextPassword = String(data.get('newPassword') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');
    const validationError = personalPasswordError(nextPassword);
    if (validationError) {
      showToast(validationError);
      return;
    }
    if (nextPassword !== confirmPassword) {
      showToast('De to koder er ikke ens');
      return;
    }
    try {
      const message = await signUpSupabase(pendingStandardSignupEmail, nextPassword, {
        personalPasswordReady: true,
        invitationId: pendingStandardSignupInvitationId,
      });
      pendingStandardSignupEmail = '';
      pendingStandardSignupInvitationId = '';
      event.target.closest('.modal-backdrop')?.remove();
      render();
      showToast(message);
    } catch (error) {
      showToast(`Kontoen kunne ikke oprettes: ${error.message}`);
    }
    return;
  }
  if (event.target.matches('.temporary-password-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextPassword = String(data.get('newPassword') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');
    const validationError = personalPasswordError(nextPassword);
    if (validationError) {
      showToast(validationError);
      return;
    }
    if (nextPassword !== confirmPassword) {
      showToast('De to koder er ikke ens');
      return;
    }
    try {
      await updateSupabasePassword(nextPassword);
      event.target.closest('.modal-backdrop')?.remove();
      render();
      showToast('Din personlige kode er gemt');
    } catch (error) {
      showToast(`Koden kunne ikke ændres: ${error.message}`);
    }
    return;
  }
  if (event.target.matches('.login-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    if (onlineBackendActive()) {
      try {
        if (event.submitter?.dataset.action === 'signup-standard-password') {
          const inviteContext = loginInviteContext();
          const email = String(data.get('email') || '').trim().toLowerCase();
          const standardPassword = String(data.get('password') || '');
          if (!inviteContext.valid) {
            showToast('Opret konto kræver et invitationslink fra chef eller creator');
            return;
          }
          if (!email) {
            showToast('Skriv arbejdsmailen først');
            return;
          }
          if (email !== inviteContext.email) {
            showToast('Arbejdsmailen skal matche invitationslinket');
            return;
          }
          if (standardPassword !== TEMPORARY_EMPLOYEE_PASSWORD) {
            showToast('Skriv standardkoden xpress for at oprette kontoen');
            return;
          }
          openStandardSignupPasswordModal(email, inviteContext.invite);
        } else {
          if (String(data.get('password') || '') === TEMPORARY_EMPLOYEE_PASSWORD) {
            showToast('Standardkoden bruges kun til første oprettelse via invitationslink. Har du allerede oprettet konto, skal du bruge din personlige kode.');
            return;
          }
          await signInSupabase(data.get('email'), data.get('password'));
          showToast('Du er logget ind på XpressIntra');
        }
      } catch (error) {
        if (isEmailConfirmationError(error)) {
          openEmailConfirmationModal(data.get('email'));
          showToast('Bekræft mailen før du logger ind');
          return;
        }
        showToast(`Login fejlede: ${error.message}`);
      }
      return;
    }
    if (!DEMO_MODE) {
      showToast('XpressIntra-onlineforbindelsen skal sættes op før login virker');
      return;
    }
    session = { email: data.get('email'), signedInAt: new Date().toISOString(), mode: 'demo' };
    save('session', session);
    render();
    showToast('Du er logget ind');
    return;
  }
  if (event.target.matches('.log-entry-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const image = await readImageFile(data.get('image'));
    logEntries.unshift({
      place: data.get('place'),
      note: data.get('note'),
      image,
      date: 'I dag',
      category: data.get('category') || 'Andet',
      source: 'manual',
      favorite: data.has('favorite'),
    });
    save('logEntries', logEntries);
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Dit private minde er gemt');
    return;
  }
  if (event.target.matches('.new-chat-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const employee = employees.find(item => item.id === data.get('employee'));
    if (onlineBackendActive()) {
      try {
        const chatId = await startSupabaseDirectChat(employee, data.get('message'));
        activeTab = 'chat';
        activeChat = chatId;
        event.target.closest('.modal-backdrop').remove();
        render();
        showToast('Direkte samtale er startet');
      } catch (error) {
        showToast(`Samtalen kunne ikke startes: ${error.message}`);
      }
      return;
    }
    const chatId = employee.id;
    if (!chats.some(chat => chat.id === chatId)) chats.unshift({ id: chatId, name: employee.name, initials: employee.initials, preview: data.get('message'), time: 'Nu', unread: 0 });
    save('chats', chats);
    messages[chatId] = messages[chatId] || [];
    messages[chatId].push({
      side: 'me',
      senderId: session?.userId || currentEmployee().id,
      senderName: currentEmployee().name,
      senderInitials: currentEmployee().initials,
      senderRole: currentEmployee().role,
      senderVehicle: currentEmployee().truck,
      body: data.get('message'),
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }),
    });
    save('messages', messages);
    activeTab = 'chat';
    activeChat = chatId;
    event.target.closest('.modal-backdrop').remove();
    render();
    return;
  }
  if (event.target.matches('.pickup-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const image = await readImageFile(data.get('image'));
    await startPickupTask({
      employeeId: data.get('employee'),
      note: data.get('note'),
      image,
      duration: data.get('duration'),
      pickupPlace: data.get('pickupPlace'),
      dropoffPlace: data.get('dropoffPlace'),
      reference: data.get('reference'),
      priority: data.get('priority') || 'Normal',
    }, event.target.closest('.modal-backdrop'));
    return;
  }
  if (event.target.matches('.pickup-note-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    await addPickupLiveNote(String(data.get('note') || ''));
    return;
  }
  if (event.target.matches('.data-request-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const labels = {
      access: 'Indsigt',
      rectification: 'Rettelse',
      erasure: 'Sletning',
      export: 'Eksport',
      restriction: 'Begrænsning',
      objection: 'Indsigelse',
    };
    const requestType = data.get('requestType');
    dataRequests.unshift({
      id: `data-request-${Date.now()}`,
      requestType,
      label: labels[requestType] || 'Dataanmodning',
      message: data.get('message'),
      status: 'Sendt i demo',
      createdAt: new Date().toLocaleDateString('da-DK'),
    });
    save('dataRequests', dataRequests);
    if (onlineBackendActive()) {
      try {
        await createSupabaseDataRequest(dataRequests[0]);
      } catch (error) {
        showToast(`Dataanmodningen er gemt lokalt, men ikke online: ${error.message}`);
      }
    }
    addNotification({ type: 'Persondata', title: 'Dataanmodning sendt', body: `${labels[requestType] || 'Dataanmodning'} er registreret i demoen.`, level: 'privacy' });
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Dataanmodningen er gemt i demoen');
    return;
  }
  if (event.target.matches('.support-request-form')) {
    event.preventDefault();
    const saved = saveSupportRequest(new FormData(event.target));
    if (!saved) {
      showToast('Skriv kort hvad meldingen handler om');
      return;
    }
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Meldingen er gemt');
    return;
  }
  if (event.target.matches('.announcement-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const imageFile = data.get('image');
    const image = await readImageFile(imageFile);
    const post = { id: `post-${Date.now()}`, title: data.get('title'), body: data.get('body'), image, time: 'Nu', tone: 'green', kind: canPublishOfficePosts() ? 'office' : 'colleague', author: profile.name, initials: currentEmployee().initials, audience: data.get('audience'), likes: 0, comments: [] };
    if (onlineBackendActive()) {
      try {
        await createSupabaseAnnouncement(post, imageFile);
        await notifySupabaseAudience(post);
      } catch (error) {
        showToast(`Opslaget er gemt lokalt, men ikke online: ${error.message}`);
      }
    }
    announcements.unshift(post);
    save('announcements', announcements);
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Opslaget er delt med holdet');
    return;
  }
  if (event.target.matches('.comment-form')) {
    event.preventDefault();
    const post = announcements.find(item => item.id === event.target.dataset.post);
    const data = new FormData(event.target);
    if (!post) return;
    post.comments.push(data.get('comment'));
    save('announcements', announcements);
    if (onlineBackendActive()) {
      try {
        await createSupabaseAnnouncementComment(post.id, data.get('comment'));
      } catch (error) {
        showToast(`Kommentaren er gemt lokalt, men ikke online: ${error.message}`);
      }
    }
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Kommentaren er tilføjet');
    return;
  }
  if (event.target.matches('.settings-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    const nextConfig = {
      url: String(data.get('supabaseUrl') || '').trim(),
      anonKey: String(data.get('supabaseAnonKey') || '').trim(),
    };
    if (isCreatorOwner()) {
      if (nextConfig.url || nextConfig.anonKey) {
        save(SUPABASE_CONFIG_KEY, nextConfig);
      } else {
        localStorage.removeItem(`roadlog:${SUPABASE_CONFIG_KEY}`);
      }
      supabaseClientInstance = null;
    }
    workdayPrivacy = {
      gps: data.has('workGps'),
      logbook: data.has('workLogbook'),
      notifications: data.has('workNotifications'),
      audience: data.get('workAudience') || 'all',
      showSpeed: data.has('showSpeed'),
      showVehicle: data.has('showVehicle'),
      showStatus: data.has('showStatus'),
    };
    save('workdayPrivacy', workdayPrivacy);
    notificationPrefs = { office: data.has('office'), rules: data.has('rules'), chat: data.has('chat'), dailyBrief: data.has('dailyBrief'), quietHours: data.has('quietHours'), system: data.has('system') && systemNotificationPermission() === 'granted' };
    save('notificationPrefs', notificationPrefs);
    if (data.has('system') && systemNotificationPermission() === 'default') await requestSystemNotifications();
    const nextDesktopViewMode = String(data.get('desktopViewMode') || 'full');
    save('desktopViewMode', DESKTOP_VIEW_MODES.has(nextDesktopViewMode) ? nextDesktopViewMode : 'full');
    save('workdayPrivacy', workdayPrivacy);
    if (onlineBackendActive()) {
      try {
        await syncSupabaseNotificationPrefs();
      } catch (error) {
        showToast(`Notifikationsvalg er gemt lokalt, men ikke online: ${error.message}`);
      }
    }
    event.target.closest('.modal-backdrop').remove();
    showToast(isCreatorOwner() && nextConfig.url && nextConfig.anonKey ? 'Indstillinger og Supabase-forbindelse er gemt' : 'Dine indstillinger er gemt');
    return;
  }
  if (event.target.matches('.core-settings-form')) {
    event.preventDefault();
    const data = new FormData(event.target);
    coreSettings = {
      gps: data.has('gps'),
      media: data.has('media'),
      logbook: data.has('logbook'),
      employeePosts: data.has('employeePosts'),
      ruleApproval: data.has('ruleApproval'),
    };
    save('coreSettings', coreSettings);
    recordAdminAudit('Kernefunktioner opdateret', `GPS ${coreSettings.gps ? 'til' : 'fra'} · billeder ${coreSettings.media ? 'til' : 'fra'} · logbog ${coreSettings.logbook ? 'til' : 'fra'}`);
    if (onlineBackendActive()) {
      try {
        await syncSupabaseCoreSettings();
      } catch (error) {
        showToast(`Kernefunktionerne er gemt lokalt, men ikke online: ${error.message}`);
      }
    }
    event.target.closest('.modal-backdrop').remove();
    render();
    showToast('Kernefunktioner er opdateret');
    return;
  }
  if (!event.target.matches('.message-form')) return;
  event.preventDefault();
  const input = event.target.elements.message;
  if (onlineBackendActive()) {
    const file = event.target.elements.image.files[0];
    if (!input.value.trim() && !file) return;
    const client = getSupabaseClient();
    const { data: inserted, error } = await client.from('messages').insert({
      conversation_id: activeChat,
      sender_id: session.userId,
      body: input.value.trim() || 'Sendte et billede',
    }).select('*').maybeSingle();
    if (error) {
      showToast(`Beskeden kunne ikke sendes: ${error.message}`);
      return;
    }
    if (file) {
      try {
        const uploadedImage = await uploadSupabaseChatImage(file, inserted.id);
        messages[activeChat] = messages[activeChat] || [];
        const localMessage = messages[activeChat].find(message => message.id === inserted.id) || messageFromSupabase(inserted, session.userId);
        localMessage.image = uploadedImage;
        if (!messages[activeChat].some(message => message.id === inserted.id)) messages[activeChat].push(localMessage);
        save('messages', messages);
      } catch (uploadError) {
        showToast(`Beskeden blev sendt, men billedet fejlede: ${uploadError.message}`);
        return;
      }
    }
    input.value = '';
    event.target.elements.image.value = '';
    render();
    return;
  }
  const image = await readImageFile(event.target.elements.image.files[0]);
  if (!input.value.trim() && !image) return;
  messages[activeChat].push({
    side: 'me',
    senderId: session?.userId || currentEmployee().id,
    senderName: currentEmployee().name,
    senderInitials: currentEmployee().initials,
    senderRole: currentEmployee().role,
    senderVehicle: currentEmployee().truck,
    body: input.value.trim(),
    image,
    createdAt: new Date().toISOString(),
    time: new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }),
  });
  const chat = chats.find(item => item.id === activeChat);
  if (chat) {
    chat.preview = image && !input.value.trim() ? 'Tommy: sendte et billede' : `Tommy: ${input.value.trim()}`;
    chat.time = 'Nu';
    chat.unread = 0;
    save('chats', chats);
  }
  save('messages', messages);
  render();
});

render();
restoreSupabaseSession().catch(() => {});
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPwaInstallPrompt = event;
  pwaInstallAvailable = true;
  render();
});
window.addEventListener('appinstalled', () => {
  deferredPwaInstallPrompt = null;
  pwaInstallAvailable = false;
  pwaInstalled = true;
  showToast(systemNotificationPermission() === 'granted'
    ? 'IntraBudet er installeret og beskeder er klar'
    : 'IntraBudet er installeret. Aktivér beskeder i Indstillinger.');
  render();
});
setTimeout(() => {
  if (appUpdateState.required && appUpdateState.required.activeVersionCode !== APP_VERSION_CODE) {
    openAppUpdateModal(appUpdateState.required, { force: true, offline: true });
  }
  checkForAppUpdate({ silent: true });
}, 900);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => {});







