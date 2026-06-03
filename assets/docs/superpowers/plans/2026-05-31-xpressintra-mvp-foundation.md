# XpressIntra MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first practical improvement round from `docs/reviews/IMPROVEMENT_REVIEW.md`: better GPS/live map, safer pickup sharing, stronger information/regulation UX, and a useful office/admin overview without exposing private vehicle chats.

**Architecture:** Keep the current static PWA structure and improve the existing local demo first. Store new demo state in localStorage, keep all UI in `src/app.js`, and add focused styling in `src/styles.css`. Update Supabase schema/docs where backend-readiness has clear gaps.

**Tech Stack:** Static HTML, vanilla JavaScript, localStorage, Leaflet/OpenStreetMap, Supabase SQL schema, PWA service worker.

---

### Task 1: Stabilize Official Links And Regulation Data

**Files:**
- Modify: `src/app.js`
- Modify: `supabase/schema.sql`
- Modify: `README.md`

- [ ] **Step 1: Fix the wrong demo rule URL**

Change the first `ruleUpdates` URL in `src/app.js` to:

```js
href: 'https://www.fstyr.dk/nyheder/2026/mar/varebiler-bliver-en-del-af-koere-og-hviletidskontrollen',
```

- [ ] **Step 2: Add rule metadata for UI badges**

Add `severity`, `status`, `effectiveDate`, and `whyItMatters` fields to each rule update:

```js
{
  severity: 'important',
  status: 'approved',
  effectiveDate: '1. juli 2026',
  whyItMatters: 'Varebiler i international godskørsel skal kende kravene i god tid.',
}
```

- [ ] **Step 3: Fix Supabase seed source URLs**

In `supabase/schema.sql`, replace `godsbus-og-varebil` with `gods-bus-og-varebil` in seeded Færdselsstyrelsen URLs.

- [ ] **Step 4: Verify source links exist in the UI**

Run:

```powershell
rg -n "varebiler-bliver-en-del|gods-bus-og-varebil|vejafgifter.dk|miljoezoner.dk" src\app.js supabase\schema.sql
```

Expected: all official URLs use the current visible paths.

### Task 2: Improve Live Map And GPS Sharing

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add map filter state**

Add:

```js
let mapFilter = stored('mapFilter') || 'all';
```

- [ ] **Step 2: Add helper functions**

Add helpers:

```js
function vehicleLabel(vehicleType) {
  if (vehicleType === 'truck') return 'Lastbil';
  if (vehicleType === 'van') return 'Varebil';
  return 'Kontor';
}

function visibleMapPeople() {
  const people = employees.filter(person => person.sharing && person.coords);
  const withCurrent = location.sharing
    ? [...people.filter(person => person.id !== currentEmployee().id), { ...currentEmployee(), location: 'Dig', coords: location.coords || currentEmployee().coords, sharing: true, status: `Deler GPS · ${location.speed} km/t` }]
    : people;
  return withCurrent.filter(person => mapFilter === 'all' || person.vehicleType === mapFilter);
}
```

- [ ] **Step 3: Store current GPS coordinates**

In `updateLocation`, save `location.coords = [position.coords.latitude, position.coords.longitude]`.

- [ ] **Step 4: Render map filters and open-in-maps actions**

Add filter buttons to `renderMap()` and use `visibleMapPeople()` for counts and list rendering. Add a link:

```html
<a class="map-open-link" href="https://www.google.com/maps/search/?api=1&query=LAT,LNG" target="_blank" rel="noreferrer">Åbn i Google Maps</a>
```

- [ ] **Step 5: Use filtered markers in Leaflet**

Change `initializeMaps()` to use `visibleMapPeople()` instead of rebuilding its own unfiltered list.

- [ ] **Step 6: Add map UI styles**

Add styles for `.map-filter-row`, `.map-status-card`, `.map-open-link`, and filtered status chips.

- [ ] **Step 7: Verify**

Run:

```powershell
node --check src\app.js
```

Expected: no syntax errors.

### Task 3: Make Pickup Sharing Safer And Faster

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add pickup duration choice**

In `openPickupModal()`, add a select field:

```html
<label>Delingstid<select name="duration"><option value="15">15 minutter</option><option value="30" selected>30 minutter</option><option value="60">60 minutter</option><option value="until-done">Indtil færdig</option></select></label>
```

- [ ] **Step 2: Store expiry metadata**

When submitting `.pickup-form`, store:

```js
duration: data.get('duration'),
expiresAt: data.get('duration') === 'until-done' ? null : new Date(Date.now() + Number(data.get('duration')) * 60 * 1000).toISOString(),
```

- [ ] **Step 3: Show expiry in active pickup card**

Render text like:

```js
const expiryText = activePickup.expiresAt ? `Stopper automatisk ${new Date(activePickup.expiresAt).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}` : 'Stopper når du markerer opgaven færdig';
```

- [ ] **Step 4: Add automatic expiry check**

Add:

```js
function enforcePickupExpiry() {
  if (!activePickup?.expiresAt) return;
  if (Date.now() < new Date(activePickup.expiresAt).getTime()) return;
  activePickup = null;
  save('activePickup', null);
  if (location.sharing) stopLocationSharing('Afhentningsdelingen udløb automatisk');
}
```

Call it at the start of `render()`.

- [ ] **Step 5: Verify**

Run:

```powershell
node --check src\app.js
```

Expected: no syntax errors.

### Task 4: Upgrade Information And Rule News UX

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add guide cards**

Add a `quickGuides` array with guide titles for accident, delay, CMR, load securing, tolls, environmental zones, van rules, and tachograph.

- [ ] **Step 2: Add "what does this mean?" cards**

In `renderInfo()`, add a section before the link list that shows three practical cards:

```html
<section class="quick-guide-grid">...</section>
```

- [ ] **Step 3: Improve rule modal**

Update `openRuleUpdatesModal()` so each rule shows audience, effective date, status, why it matters, source, and official link.

- [ ] **Step 4: Add styles**

Style `.quick-guide-grid`, `.quick-guide-card`, `.rule-meta`, and `.approval-pill`.

- [ ] **Step 5: Verify**

Run:

```powershell
node --check src\app.js
```

Expected: no syntax errors.

### Task 5: Add Office/Admin Overview Without Private Chat Access

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add office insights in dispatch modal**

Enhance `openDispatchModal()` with:

- active pickup count
- visible GPS count
- pending rule drafts count
- reminder that private vehicle channels stay closed

- [ ] **Step 2: Add quick admin actions**

Add buttons to open:

- new announcement
- rule updates
- information center
- live map

- [ ] **Step 3: Add status lists**

Show rows for visible employees with status, vehicle type, and GPS sharing state. Do not show any private chat messages.

- [ ] **Step 4: Add styles**

Style `.dispatch-actions`, `.dispatch-driver-list`, and `.dispatch-privacy-box`.

- [ ] **Step 5: Verify**

Run:

```powershell
node --check src\app.js
```

Expected: no syntax errors.

### Task 6: Final Verification

**Files:**
- Check: `src/app.js`
- Check: `src/styles.css`
- Check: `supabase/schema.sql`
- Check: `README.md`

- [ ] **Step 1: Run syntax check**

Run:

```powershell
node --check src\app.js
```

Expected: no syntax errors.

- [ ] **Step 2: Run static content check**

Serve the app locally and confirm `/`, `/src/app.js`, `/src/styles.css`, and `/service-worker.js` respond with expected content.

- [ ] **Step 3: Run text search checks**

Run:

```powershell
rg -n "mapFilter|visibleMapPeople|expiresAt|quickGuides|dispatch-actions|varebiler-bliver-en-del" src\app.js src\styles.css supabase\schema.sql
```

Expected: all new feature anchors are present.

- [ ] **Step 4: Update README**

Mention:

- map filters
- pickup sharing duration
- improved rule cards
- stronger office overview
