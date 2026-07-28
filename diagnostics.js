const DIAGNOSTIC_STORAGE_KEY = 'xpressintra:diagnostic-events';
const LAST_REPORT_STORAGE_KEY = 'xpressintra:last-diagnostic-report';
const MAX_EVENTS = 80;
const MAX_EVENT_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const SYNC_RETRY_MS = 15 * 60 * 1000;
const ERROR_TOAST_PATTERN = /\b(fejl|fejlede|kunne ikke|udløbet|ingen forbindelse|ikke tilgængelig)\b/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{8,}\b/g;
const API_KEY_PATTERN = /\bsb_(?:publishable|secret)_[A-Za-z0-9_-]+\b/g;
const BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._~-]+\b/gi;
const PASSWORD_PATTERN = /\b(password|adgangskode|kodeord)\s*[:=]\s*[^\s,;]+/gi;
const COORDINATE_PATTERN = /\b(?:lat(?:itude)?|lng|lon(?:gitude)?)\s*[:=]\s*-?\d{1,3}(?:[.,]\d+)?/gi;
const URL_QUERY_PATTERN = /(https?:\/\/[^\s?#]+)(?:[?#][^\s]*)?/gi;

let diagnosticClient = null;
let lastObservedToast = '';
let lastObservedToastAt = 0;
let renderScheduled = false;

function redact(value, maxLength = 600) {
  return String(value ?? '')
    .replace(BEARER_PATTERN, 'Bearer [skjult]')
    .replace(JWT_PATTERN, '[token skjult]')
    .replace(API_KEY_PATTERN, '[nøgle skjult]')
    .replace(PASSWORD_PATTERN, '$1=[skjult]')
    .replace(EMAIL_PATTERN, '[mail skjult]')
    .replace(COORDINATE_PATTERN, match => `${match.split(/[:=]/)[0]}=[position skjult]`)
    .replace(URL_QUERY_PATTERN, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function readJsonStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function readEvents() {
  const cutoff = Date.now() - MAX_EVENT_AGE_MS;
  return readJsonStorage(DIAGNOSTIC_STORAGE_KEY, [])
    .filter(event => Date.parse(event.createdAt || 0) >= cutoff)
    .slice(0, MAX_EVENTS);
}

function saveEvents(events) {
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
}

function fingerprint(event) {
  return [event.level, event.area, event.source, event.message].join('|').toLowerCase();
}

function recordDiagnostic(message, options = {}) {
  const safeMessage = redact(message || 'Ukendt teknisk fejl');
  if (!safeMessage) return null;
  const now = new Date();
  const event = {
    id: `diagnostic-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    level: ['info', 'warning', 'error'].includes(options.level) ? options.level : 'error',
    area: redact(options.area || activeArea(), 80),
    source: redact(options.source || 'Appen', 80),
    message: safeMessage,
    route: redact(options.route || activeArea(), 80),
    createdAt: now.toISOString(),
    repeats: 1,
    syncedAt: null,
    lastSyncAttemptAt: null,
  };
  event.fingerprint = fingerprint(event);

  const events = readEvents();
  const duplicateIndex = events.findIndex(item => (
    item.fingerprint === event.fingerprint
    && now.getTime() - Date.parse(item.createdAt || 0) <= 60_000
  ));
  if (duplicateIndex >= 0) {
    const duplicate = events[duplicateIndex];
    event.id = duplicate.id;
    event.repeats = Math.max(1, Number(duplicate.repeats || 1)) + 1;
    events.splice(duplicateIndex, 1);
  }
  events.unshift(event);
  saveEvents(events);
  scheduleUiRefresh();
  syncPendingDiagnostics().catch(() => {});
  return event;
}

function diagnosticSummary() {
  const events = readEvents();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const recent = events.filter(event => Date.parse(event.createdAt || 0) >= cutoff);
  return {
    events,
    errors: recent.filter(event => event.level === 'error').length,
    warnings: recent.filter(event => event.level === 'warning').length,
    pending: events.filter(event => !event.syncedAt).length,
    latest: events[0] || null,
  };
}

function activeArea() {
  const selectedNavigation = document.querySelector('.bottom-nav .active, [aria-current="page"]');
  const heading = document.querySelector('.page-heading h2, main h1, main h2');
  return selectedNavigation?.textContent?.trim() || heading?.textContent?.trim() || location.pathname || 'appen';
}

function publicConfig() {
  const configured = globalThis.XPRESSINTRA_SUPABASE || {};
  return {
    url: String(configured.url || 'https://mtfbdoajzmlgqbeiubxe.supabase.co').trim(),
    anonKey: String(configured.anonKey || configured.key || 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd').trim(),
  };
}

function getDiagnosticClient() {
  const config = publicConfig();
  if (!globalThis.supabase?.createClient || !config.url || !config.anonKey) return null;
  if (!diagnosticClient) {
    diagnosticClient = globalThis.supabase.createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return diagnosticClient;
}

async function syncPendingDiagnostics() {
  if (!navigator.onLine) return;
  const client = getDiagnosticClient();
  if (!client) return;
  const { data } = await client.auth.getSession();
  const userId = data?.session?.user?.id;
  if (!userId) return;

  const events = readEvents();
  let changed = false;
  for (const event of events.filter(item => !item.syncedAt).slice(0, 5)) {
    const lastAttempt = Date.parse(event.lastSyncAttemptAt || 0);
    if (lastAttempt && Date.now() - lastAttempt < SYNC_RETRY_MS) continue;
    event.lastSyncAttemptAt = new Date().toISOString();
    changed = true;
    const { error } = await client.from('support_requests').insert({
      user_id: userId,
      request_type: 'bug',
      area: event.area || 'appen',
      message: `${event.source}: ${event.message}${event.repeats > 1 ? ` · gentaget ${event.repeats} gange` : ''}`,
      app_version: await installedVersionLabel(),
      route: event.route || event.area || 'appen',
      status: 'open',
    });
    if (!error) event.syncedAt = new Date().toISOString();
  }
  if (changed) {
    saveEvents(events);
    scheduleUiRefresh();
  }
}

async function withTimeout(promise, timeoutMs, fallback) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise(resolve => {
        timer = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchVersionData() {
  const urls = [
    '/version.json',
    'https://raw.githubusercontent.com/stralner2711-a11y/xpresshub/main/version.json',
  ];
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}diagnostic=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Versionen kunne ikke hentes');
}

async function installedVersionLabel() {
  const data = await fetchVersionData().catch(() => null);
  const version = data?.activeVersion || data?.version || 'ukendt';
  const build = data?.activeVersionCode || data?.versionCode || 'ukendt';
  return `${version} · build ${build}`;
}

async function realtimeCheck(client, session) {
  if (!session) {
    return { name: 'Live-opdateringer', status: 'warning', detail: 'Testes automatisk efter login' };
  }
  if (!client?.channel || !client?.removeChannel) {
    return { name: 'Live-opdateringer', status: 'warning', detail: 'Realtime-biblioteket er ikke tilgængeligt i denne visning' };
  }
  const channel = client.channel(`diagnostic-${Date.now()}`);
  const result = await withTimeout(new Promise(resolve => {
    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') resolve({ name: 'Live-opdateringer', status: 'ok', detail: 'Realtime-kanalen svarer' });
      if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
        resolve({ name: 'Live-opdateringer', status: 'fail', detail: `Realtime svarede: ${status}` });
      }
    });
  }), 5_000, { name: 'Live-opdateringer', status: 'fail', detail: 'Realtime svarede ikke inden for 5 sekunder' });
  await client.removeChannel(channel).catch(() => {});
  return result;
}

async function permissionState(name) {
  if (!navigator.permissions?.query) return 'ukendt';
  try {
    return (await navigator.permissions.query({ name })).state;
  } catch {
    return 'ukendt';
  }
}

async function runAppDiagnostics() {
  const checks = [];
  const add = (name, status, detail) => checks.push({ name, status, detail: redact(detail) });
  const config = publicConfig();
  const client = getDiagnosticClient();

  add('Internet', navigator.onLine ? 'ok' : 'fail', navigator.onLine ? 'Enheden er online' : 'Enheden er offline');
  add('Sikker appnøgle', config.anonKey && !/service_role|sb_secret_/i.test(config.anonKey) ? 'ok' : 'fail', config.anonKey ? 'Kun offentlig publishable key er i brug' : 'Offentlig nøgle mangler');
  add('Backend-adresse', /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.url) ? 'ok' : 'fail', config.url ? 'Supabase-adressen er sat' : 'Supabase-adressen mangler');

  let session = null;
  if (!client) {
    add('Supabase bibliotek', 'fail', 'Supabase-klienten er ikke indlæst');
  } else {
    const sessionResult = await client.auth.getSession().catch(error => ({ error }));
    session = sessionResult.data?.session || null;
    add('Login-session', session ? 'ok' : 'warning', session ? 'Aktiv XpressIntra-session' : sessionResult.error?.message || 'Log ind for at teste personlige data');

    if (session?.user?.id) {
      const profileResult = await client
        .from('profiles')
        .select('id,employment_status')
        .eq('id', session.user.id)
        .maybeSingle();
      const profileStatus = profileResult.data?.employment_status;
      add('Brugerprofil', !profileResult.error && profileStatus === 'active' ? 'ok' : 'fail', profileResult.error?.message || `Profilstatus: ${profileStatus || 'mangler'}`);
      add('Dataadgang', !profileResult.error ? 'ok' : 'fail', profileResult.error?.message || 'RLS tillader adgang til egen profil');
    }
    checks.push(await realtimeCheck(client, session));
  }

  const versionResult = await fetchVersionData()
    .then(data => ({ ok: true, data }))
    .catch(error => ({ ok: false, error }));
  add(
    'Opdateringssystem',
    versionResult.ok ? 'ok' : 'fail',
    versionResult.ok
      ? `Seneste version: ${versionResult.data.activeVersion || versionResult.data.version || 'ukendt'} · build ${versionResult.data.activeVersionCode || versionResult.data.versionCode || 'ukendt'}`
      : versionResult.error?.message || 'Versionen kunne ikke hentes'
  );

  if ('serviceWorker' in navigator) {
    const registration = await withTimeout(navigator.serviceWorker.ready, 4_000, null);
    add('Offline og opdatering', registration?.active ? 'ok' : 'warning', registration?.active ? 'Service worker er aktiv' : 'Service worker er ikke aktiv endnu');
  } else {
    add('Offline og opdatering', 'warning', 'Service worker understøttes ikke i denne visning');
  }

  const gpsPermission = await permissionState('geolocation');
  add('GPS', navigator.geolocation ? (gpsPermission === 'denied' ? 'warning' : 'ok') : 'fail', navigator.geolocation ? `Tilladelse: ${gpsPermission}` : 'GPS understøttes ikke');
  const notificationPermission = 'Notification' in window ? Notification.permission : 'ikke understøttet';
  add('Notifikationer', notificationPermission === 'denied' ? 'warning' : 'ok', `Tilladelse: ${notificationPermission}`);

  const report = formatReport(checks, versionResult.data);
  localStorage.setItem(LAST_REPORT_STORAGE_KEY, report);
  const failures = checks.filter(check => check.status === 'fail');
  if (failures.length) {
    recordDiagnostic(failures.map(check => `${check.name}: ${check.detail}`).join(' · '), {
      source: 'Automatisk app-tjek',
      area: activeArea(),
    });
  }
  return { checks, report };
}

function formatReport(checks, versionData = {}) {
  const version = versionData.activeVersion || versionData.version || 'ukendt';
  const build = versionData.activeVersionCode || versionData.versionCode || 'ukendt';
  return [
    'XpressIntra app-tjek',
    `Version: ${version} · build ${build}`,
    `Tid: ${new Date().toLocaleString('da-DK')}`,
    `Side: ${redact(activeArea(), 80)}`,
    '',
    ...checks.map(check => `${check.status === 'ok' ? 'OK' : check.status === 'warning' ? 'TJEK' : 'FEJL'} · ${check.name}: ${check.detail}`),
  ].join('\n');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function diagnosticModalHtml() {
  return `<section class="profile-modal xpress-diagnostic-modal" aria-labelledby="xpress-diagnostic-title">
    <button type="button" class="modal-close" data-xpress-diagnostic-close aria-label="Luk">×</button>
    <p class="eyebrow">Appens helbred</p>
    <h3 id="xpress-diagnostic-title">Tjekker XpressIntra</h3>
    <p class="info-intro">Vi tester login, database, live-opdateringer, GPS, notifikationer og update-system. Rapporten skjuler mail, koder, tokens og præcis position.</p>
    <div class="xpress-diagnostic-summary" aria-live="polite">
      <span><b>Tester...</b><small>Det tager normalt få sekunder</small></span>
    </div>
    <section class="diagnostic-list xpress-diagnostic-list"><span>Starter app-tjek...</span></section>
    <div class="xpress-diagnostic-actions">
      <button type="button" data-xpress-copy-report disabled>Kopiér rapport</button>
      <button type="button" data-xpress-rerun-diagnostic>Kør igen</button>
    </div>
  </section>`;
}

async function openDiagnosticModal() {
  document.querySelector('.modal-backdrop.xpress-diagnostic-backdrop')?.remove();
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop xpress-diagnostic-backdrop';
  backdrop.innerHTML = diagnosticModalHtml();
  document.body.append(backdrop);
  await updateDiagnosticModal(backdrop);
}

async function updateDiagnosticModal(backdrop) {
  const list = backdrop.querySelector('.xpress-diagnostic-list');
  const summary = backdrop.querySelector('.xpress-diagnostic-summary');
  const copyButton = backdrop.querySelector('[data-xpress-copy-report]');
  if (!list || !summary) return;
  list.innerHTML = '<span>Tjekker forbindelse og funktioner...</span>';
  summary.innerHTML = '<span><b>Tester...</b><small>Vent et øjeblik</small></span>';

  try {
    const result = await runAppDiagnostics();
    const failures = result.checks.filter(check => check.status === 'fail').length;
    const warnings = result.checks.filter(check => check.status === 'warning').length;
    const passed = result.checks.filter(check => check.status === 'ok').length;
    const status = failures ? 'Kræver handling' : warnings ? 'Bør tjekkes' : 'Alt ser godt ud';
    summary.innerHTML = `
      <span class="${failures ? 'fail' : warnings ? 'warning' : 'ok'}"><b>${escapeHtml(status)}</b><small>${passed} OK · ${warnings} tjek · ${failures} fejl</small></span>
    `;
    list.innerHTML = result.checks.map(check => `
      <article class="${escapeHtml(check.status)}">
        <b>${check.status === 'ok' ? 'OK' : check.status === 'warning' ? 'TJEK' : 'FEJL'} · ${escapeHtml(check.name)}</b>
        <small>${escapeHtml(check.detail)}</small>
      </article>
    `).join('');
    if (copyButton) copyButton.disabled = false;
  } catch (error) {
    recordDiagnostic(error.message, { source: 'App-tjek', area: activeArea() });
    summary.innerHTML = '<span class="fail"><b>App-tjek fejlede</b><small>Fejlen er gemt sikkert</small></span>';
    list.innerHTML = `<article class="fail"><b>FEJL · App-tjek</b><small>${escapeHtml(redact(error.message))}</small></article>`;
  }
}

async function copyLastReport(button) {
  const report = localStorage.getItem(LAST_REPORT_STORAGE_KEY) || '';
  if (!report) return;
  try {
    await navigator.clipboard.writeText(report);
  } catch {
    const field = document.createElement('textarea');
    field.value = report;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.left = '-9999px';
    document.body.append(field);
    field.select();
    document.execCommand?.('copy');
    field.remove();
  }
  const original = button.textContent;
  button.textContent = 'Rapport kopieret';
  setTimeout(() => { button.textContent = original; }, 1800);
}

function diagnosticButtonHtml(className = 'utility-row') {
  return `<button class="${className}" type="button" data-xpress-diagnostic>
    <span class="utility-icon xpress-diagnostic-icon" aria-hidden="true">✓</span>
    <span><b>Tjek min app</b><small>Login, forbindelse, GPS, beskeder og opdatering</small></span>
    <span class="row-arrow" aria-hidden="true">›</span>
  </button>`;
}

function injectControlCenterButton() {
  const dailyGroup = document.querySelector('.utility-list.control-center .control-detail-group');
  if (!dailyGroup || dailyGroup.querySelector('[data-xpress-diagnostic]')) return;
  dailyGroup.insertAdjacentHTML('beforeend', diagnosticButtonHtml());
}

function injectLoginDiagnosticButton() {
  const loginForm = document.querySelector('.login-form');
  if (!loginForm || document.querySelector('.xpress-login-diagnostic')) return;
  loginForm.insertAdjacentHTML('afterend', `
    <button class="xpress-login-diagnostic" type="button" data-xpress-diagnostic>
      <b>Problemer med login?</b>
      <small>Tjek forbindelse og appstatus</small>
    </button>
  `);
}

function injectCreatorHealth() {
  const dashboard = document.querySelector('.creator-ops-dashboard');
  if (!dashboard) return;
  const summary = diagnosticSummary();
  const grid = dashboard.querySelector('.creator-ops-grid');
  if (grid && !grid.querySelector('[data-xpress-diagnostic-stat]')) {
    grid.insertAdjacentHTML('beforeend', `
      <span data-xpress-diagnostic-stat><b>${summary.errors}</b><small>Fejl 24 timer</small></span>
      <span data-xpress-diagnostic-pending><b>${summary.pending}</b><small>Venter på sync</small></span>
    `);
  } else {
    const errorCard = grid?.querySelector('[data-xpress-diagnostic-stat] b');
    const pendingCard = grid?.querySelector('[data-xpress-diagnostic-pending] b');
    if (errorCard) errorCard.textContent = String(summary.errors);
    if (pendingCard) pendingCard.textContent = String(summary.pending);
  }

  const actions = dashboard.querySelector('.creator-ops-actions');
  if (actions && !actions.querySelector('[data-xpress-diagnostic]')) {
    actions.insertAdjacentHTML('afterbegin', '<button type="button" data-xpress-diagnostic>Tjek min app</button>');
  }

  const checks = dashboard.querySelector('.creator-ops-checks');
  if (checks && !checks.querySelector('[data-xpress-diagnostic-health]')) {
    checks.insertAdjacentHTML('beforeend', `
      <span class="${summary.errors ? 'fail' : summary.pending ? 'warn' : 'ok'}" data-xpress-diagnostic-health>
        <b>App-diagnose</b>
        <small>${summary.errors ? `${summary.errors} fejl registreret de seneste 24 timer` : summary.pending ? `${summary.pending} rapport(er) venter på sikker forbindelse` : 'Ingen tekniske fejl registreret de seneste 24 timer'}</small>
      </span>
    `);
  }
}

function refreshInjectedUi() {
  injectLoginDiagnosticButton();
  injectControlCenterButton();
  injectCreatorHealth();
}

function scheduleUiRefresh() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    refreshInjectedUi();
  });
}

function observeAppUi() {
  const root = document.querySelector('#app') || document.body;
  const observer = new MutationObserver(() => {
    scheduleUiRefresh();
    const toast = document.querySelector('.toast.show');
    const message = toast?.textContent?.trim() || '';
    if (!message || !ERROR_TOAST_PATTERN.test(message)) return;
    if (message === lastObservedToast && Date.now() - lastObservedToastAt < 60_000) return;
    lastObservedToast = message;
    lastObservedToastAt = Date.now();
    recordDiagnostic(message, { source: 'Brugerbesked', area: activeArea() });
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
  scheduleUiRefresh();
}

document.addEventListener('click', event => {
  if (event.target.closest('[data-xpress-diagnostic]')) {
    event.preventDefault();
    openDiagnosticModal();
    return;
  }
  if (event.target.closest('[data-xpress-diagnostic-close]')) {
    event.target.closest('.modal-backdrop')?.remove();
    return;
  }
  const copyButton = event.target.closest('[data-xpress-copy-report]');
  if (copyButton) {
    copyLastReport(copyButton);
    return;
  }
  if (event.target.closest('[data-xpress-rerun-diagnostic]')) {
    updateDiagnosticModal(event.target.closest('.modal-backdrop'));
  }
});

window.addEventListener('error', event => {
  recordDiagnostic(event.message || 'Ukendt JavaScript-fejl', { source: 'JavaScript', area: activeArea() });
});

window.addEventListener('unhandledrejection', event => {
  recordDiagnostic(event.reason?.message || String(event.reason || 'Ukendt baggrundsfejl'), { source: 'Baggrundsproces', area: activeArea() });
});

window.addEventListener('online', () => {
  syncPendingDiagnostics().catch(() => {});
  scheduleUiRefresh();
});

window.addEventListener('offline', scheduleUiRefresh);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAppUi, { once: true });
} else {
  observeAppUi();
}

syncPendingDiagnostics().catch(() => {});

globalThis.XpressIntraAppDiagnostics = {
  redact,
  recordDiagnostic,
  diagnosticSummary,
  runAppDiagnostics,
  syncPendingDiagnostics,
  openDiagnosticModal,
};
