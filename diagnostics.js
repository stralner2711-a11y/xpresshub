const DIAGNOSTIC_STORAGE_KEY = 'xpressintra:diagnostic-events';
const LAST_REPORT_STORAGE_KEY = 'xpressintra:last-diagnostic-report';
const METRIC_STORAGE_KEY = 'xpressintra:anonymous-app-metrics';
const AUTO_HEALTH_STORAGE_KEY = 'xpressintra:last-automatic-health-check';
const MAX_EVENTS = 80;
const MAX_EVENT_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const SYNC_RETRY_MS = 15 * 60 * 1000;
const METRIC_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const ALLOWED_METRIC_KEYS = new Set(['app_start', 'runtime_error', 'health_check', 'long_task']);
const ALLOWED_METRIC_RESULTS = new Set(['success', 'warning', 'failure', 'offline']);
const ALLOWED_DETAIL_CODES = new Set(['none', 'network', 'timeout', 'permission', 'authentication', 'database', 'javascript', 'unknown']);
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
let metricSyncTimer = null;
let longTaskCount = 0;
let versionLabelPromise = null;
let aggregateMetricSummary = null;
let aggregateMetricLoadPromise = null;

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

function appPlatform() {
  const platform = globalThis.Capacitor?.getPlatform?.();
  if (platform === 'android') return 'android';
  if (platform === 'ios' || /iPhone|iPad|iPod/i.test(navigator.userAgent || '')) return 'ios_pwa';
  return 'web';
}

function durationBucket(durationMs) {
  const duration = Number(durationMs);
  if (!Number.isFinite(duration) || duration < 0) return 'none';
  if (duration < 500) return 'under_500ms';
  if (duration < 1500) return '500_1500ms';
  if (duration < 4000) return '1500_4000ms';
  return 'over_4000ms';
}

function technicalErrorCode(message) {
  const value = String(message || '').toLowerCase();
  if (/offline|network|fetch|forbindelse|internet/.test(value)) return 'network';
  if (/timeout|timed out|tidsgrænse/.test(value)) return 'timeout';
  if (/permission|tilladelse|denied|nægtet/.test(value)) return 'permission';
  if (/auth|login|session|jwt/.test(value)) return 'authentication';
  if (/database|supabase|postgres|pgrst|relation|schema|row level|rls/.test(value)) return 'database';
  if (/javascript|cannot read|undefined|null|syntax|typeerror|referenceerror/.test(value)) return 'javascript';
  return 'unknown';
}

function readMetricQueue() {
  const cutoff = Date.now() - METRIC_RETENTION_MS;
  return readJsonStorage(METRIC_STORAGE_KEY, [])
    .filter(metric => Date.parse(`${metric.metricDate || ''}T00:00:00Z`) >= cutoff)
    .slice(0, 80);
}

function saveMetricQueue(metrics) {
  localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(metrics.slice(0, 80)));
}

function queueAggregateMetric(eventKey, options = {}) {
  if (!ALLOWED_METRIC_KEYS.has(eventKey)) return null;
  const result = ALLOWED_METRIC_RESULTS.has(options.result) ? options.result : 'success';
  const detailCode = ALLOWED_DETAIL_CODES.has(options.detailCode) ? options.detailCode : 'none';
  const metric = {
    metricDate: new Date().toISOString().slice(0, 10),
    eventKey,
    result,
    detailCode,
    platform: appPlatform(),
    durationBucket: durationBucket(options.durationMs),
    count: Math.min(100, Math.max(1, Number(options.count) || 1)),
    lastSyncAttemptAt: null,
  };
  const metrics = readMetricQueue();
  const key = [metric.metricDate, metric.eventKey, metric.result, metric.detailCode, metric.platform, metric.durationBucket].join('|');
  const existing = metrics.find(item => [item.metricDate, item.eventKey, item.result, item.detailCode, item.platform, item.durationBucket].join('|') === key);
  if (existing) existing.count = Math.min(1000, Number(existing.count || 0) + metric.count);
  else metrics.unshift(metric);
  saveMetricQueue(metrics);
  scheduleMetricSync();
  return metric;
}

function scheduleMetricSync(delayMs = 5_000) {
  if (metricSyncTimer || !navigator.onLine) return;
  metricSyncTimer = setTimeout(() => {
    metricSyncTimer = null;
    syncPendingMetrics().catch(() => {});
  }, delayMs);
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
  queueAggregateMetric('runtime_error', {
    result: event.level === 'error' ? 'failure' : 'warning',
    detailCode: technicalErrorCode(message),
  });
  scheduleUiRefresh();
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
    pending: readMetricQueue().length,
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
  return syncPendingMetrics();
}

async function metricVersionLabel() {
  if (!versionLabelPromise) versionLabelPromise = installedVersionLabel().catch(() => 'ukendt');
  return versionLabelPromise;
}

async function syncPendingMetrics() {
  if (!navigator.onLine) return;
  const client = getDiagnosticClient();
  if (!client) return;
  const { data } = await client.auth.getSession();
  if (!data?.session?.user?.id) return;

  const metrics = readMetricQueue();
  const appVersion = await metricVersionLabel();
  let changed = false;
  for (const metric of metrics.slice(0, 8)) {
    const lastAttempt = Date.parse(metric.lastSyncAttemptAt || 0);
    if (lastAttempt && Date.now() - lastAttempt < SYNC_RETRY_MS) continue;
    metric.lastSyncAttemptAt = new Date().toISOString();
    changed = true;
    const { error } = await client.rpc('record_app_metric', {
      p_metric_date: metric.metricDate,
      p_event_key: metric.eventKey,
      p_result: metric.result,
      p_detail_code: metric.detailCode,
      p_event_count: metric.count,
      p_app_version: appVersion,
      p_platform: metric.platform,
      p_duration_bucket: metric.durationBucket,
    });
    if (!error) metrics.splice(metrics.indexOf(metric), 1);
  }
  if (changed) {
    saveMetricQueue(metrics);
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
  queueAggregateMetric('health_check', {
    result: failures.length ? 'failure' : checks.some(check => check.status === 'warning') ? 'warning' : 'success',
    detailCode: failures.length ? technicalErrorCode(failures.map(check => check.detail).join(' ')) : 'none',
  });
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
    <p class="info-intro">Vi tester login, database, live-opdateringer, GPS, notifikationer og update-system. Detaljer bliver på telefonen. Kun anonyme, sammenlagte tekniske tællere sendes til appens drift.</p>
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
      <span data-xpress-telemetry-errors><b>${aggregateMetricSummary?.errors ?? '–'}</b><small>Anonyme fejl · 7 dage</small></span>
      <span data-xpress-telemetry-slow><b>${aggregateMetricSummary?.slowTasks ?? '–'}</b><small>Langsomme hændelser · 7 dage</small></span>
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
      <span class="ok" data-xpress-telemetry-health>
        <b>Anonym driftsstatistik</b>
        <small>Ingen navne, mail, beskedtekst, GPS, billeder eller bruger-id gemmes i statistikken</small>
      </span>
    `);
  }
  loadAggregateMetricSummary().catch(() => {});
}

function updateAggregateMetricUi() {
  if (!aggregateMetricSummary) return;
  const errorValue = document.querySelector('[data-xpress-telemetry-errors] b');
  const slowValue = document.querySelector('[data-xpress-telemetry-slow] b');
  if (errorValue) errorValue.textContent = String(aggregateMetricSummary.errors);
  if (slowValue) slowValue.textContent = String(aggregateMetricSummary.slowTasks);
}

async function loadAggregateMetricSummary() {
  if (aggregateMetricSummary || aggregateMetricLoadPromise) return aggregateMetricLoadPromise;
  const client = getDiagnosticClient();
  if (!client || !document.querySelector('.creator-ops-dashboard')) return null;
  aggregateMetricLoadPromise = (async () => {
    const since = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { data, error } = await client
      .from('app_telemetry_daily')
      .select('event_key,result,event_count,metric_date')
      .gte('metric_date', since)
      .limit(500);
    if (error) return null;
    aggregateMetricSummary = (data || []).reduce((summary, row) => {
      const count = Math.max(0, Number(row.event_count) || 0);
      if (row.event_key === 'runtime_error' && row.result === 'failure') summary.errors += count;
      if (row.event_key === 'long_task') summary.slowTasks += count;
      return summary;
    }, { errors: 0, slowTasks: 0 });
    updateAggregateMetricUi();
    return aggregateMetricSummary;
  })().finally(() => { aggregateMetricLoadPromise = null; });
  return aggregateMetricLoadPromise;
}

async function runAutomaticHealthCheck() {
  const lastCheck = Date.parse(localStorage.getItem(AUTO_HEALTH_STORAGE_KEY) || 0);
  if (lastCheck && Date.now() - lastCheck < 24 * 60 * 60 * 1000) return;
  const client = getDiagnosticClient();
  if (!client || !navigator.onLine) return;
  const { data } = await client.auth.getSession().catch(() => ({ data: null }));
  if (!data?.session?.user?.id) return;
  await runAppDiagnostics();
  localStorage.setItem(AUTO_HEALTH_STORAGE_KEY, new Date().toISOString());
}

function observeLongTasks() {
  if (!('PerformanceObserver' in window)) return;
  try {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (longTaskCount >= 10) break;
        longTaskCount += 1;
        queueAggregateMetric('long_task', { result: 'warning', durationMs: entry.duration });
      }
    });
    observer.observe({ type: 'longtask', buffered: true });
  } catch {
    // Long-task observation is optional and unsupported in some WebViews.
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
  queueAggregateMetric('app_start', {
    result: navigator.onLine ? 'success' : 'offline',
    detailCode: navigator.onLine ? 'none' : 'network',
    durationMs: performance.now?.(),
  });
  observeLongTasks();
  setTimeout(() => runAutomaticHealthCheck().catch(() => {}), 12_000);
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
  syncPendingMetrics().catch(() => {});
  scheduleUiRefresh();
});

window.addEventListener('offline', scheduleUiRefresh);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAppUi, { once: true });
} else {
  observeAppUi();
}

syncPendingMetrics().catch(() => {});

globalThis.XpressIntraAppDiagnostics = {
  redact,
  recordDiagnostic,
  diagnosticSummary,
  runAppDiagnostics,
  syncPendingDiagnostics,
  syncPendingMetrics,
  queueAggregateMetric,
  openDiagnosticModal,
};
