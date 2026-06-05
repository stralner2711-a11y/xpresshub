# XpressIntra Professionalization Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make XpressIntra easier to maintain, safer to release, and calmer for older drivers without changing the core product direction.

**Architecture:** Keep the current single-file app working while extracting one responsibility at a time. Add tests before each extraction, keep the public UI stable, and avoid large rewrites that mix refactoring with new features.

**Tech Stack:** Vite, plain JavaScript, CSS, Supabase, Capacitor Android/iOS sync, Node-based smoke tests.

---

## File Structure

- Modify: `src/app.js` for small, behavior-preserving extraction points.
- Modify: `src/styles.css` to introduce reusable UI classes and reduce duplicate card/button styling.
- Create: `src/modules/` only when a module can be moved with tests already covering the behavior.
- Modify: `qa/*.cjs` to keep smoke tests focused on user-visible behavior.
- Create/modify: `tools/run-qa.cjs` as the single local quality command.
- Modify: `package.json` to expose `npm run qa`.
- Modify: `docs/reviews/` for short professional audit notes after each package.

---

### Task 1: Single QA Command

**Files:**
- Create: `tools/run-qa.cjs`
- Modify: `package.json`
- Test: all files in `qa/*.cjs`

- [ ] **Step 1: Add one QA runner**

Create `tools/run-qa.cjs` that runs `npm run build` and every `qa/*.cjs` file alphabetically. It must stop on the first failure and print which check failed.

- [ ] **Step 2: Add package script**

Add this script to `package.json`:

```json
"qa": "node tools/run-qa.cjs"
```

- [ ] **Step 3: Verify**

Run:

```powershell
npm run qa
```

Expected: production build passes and all smoke tests pass.

---

### Task 2: Text And Release Hygiene

**Files:**
- Create: `qa/text-quality-smoke-test.cjs`
- Modify: `tools/opdater-alt.ps1` only if version files drift again
- Test: `npm run qa`

- [ ] **Step 1: Add text quality check**

Create a smoke test that scans `src`, `public`, `docs`, `supabase`, `tools`, and `qa` text files for broken replacement characters and common mojibake patterns.

- [ ] **Step 2: Verify version sync**

Keep `qa/app-update-system-smoke-test.cjs` as the guard that confirms `public/version.json`, `docs/version.json`, and root `version.json` match.

- [ ] **Step 3: Verify**

Run:

```powershell
npm run qa
```

Expected: Danish letters and version files are clean.

---

### Task 3: Split The App Safely

**Files:**
- Create: `src/modules/update-system.js`
- Create: `src/modules/media.js`
- Create: `src/modules/supabase-client.js`
- Modify: `src/app.js`
- Test: `qa/app-update-system-smoke-test.cjs`, `qa/profile-photo-upload-smoke-test.cjs`, `qa/supabase-client-smoke-test.cjs`

- [ ] **Step 1: Extract update helpers first**

Move update constants and pure update helper functions from `src/app.js` into `src/modules/update-system.js`. Keep UI modal rendering in `src/app.js` until tests prove the helpers are stable.

- [ ] **Step 2: Extract image helpers**

Move image type, resize, and file conversion helpers into `src/modules/media.js`.

- [ ] **Step 3: Extract Supabase REST fallback**

Move `createRestSupabaseClient` and Supabase config helpers into `src/modules/supabase-client.js`.

- [ ] **Step 4: Verify after each extraction**

Run the related focused test first, then full QA:

```powershell
node qa/app-update-system-smoke-test.cjs
node qa/profile-photo-upload-smoke-test.cjs
node qa/supabase-client-smoke-test.cjs
npm run qa
```

Expected: behavior remains unchanged.

---

### Task 4: Design System Pass

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app.js`
- Test: `qa/ui-redesign-smoke-test.cjs`, `qa/user-experience-smoke-test.cjs`, `qa/home-dashboard-smoke-test.cjs`

- [ ] **Step 1: Add reusable classes**

Introduce reusable classes for:

```css
.x-card
.x-action-card
.x-primary-action
.x-section-title
.x-status-grid
.x-muted-note
```

- [ ] **Step 2: Replace duplicate homepage/work/info card styling**

Start with the homepage and work screen only. Do not change chat or live map in the same task.

- [ ] **Step 3: Verify older-driver usability**

Check that primary buttons stay at least 44px high, text remains readable, and no screen gets more hidden drawers than before.

- [ ] **Step 4: Verify**

Run:

```powershell
node qa/ui-redesign-smoke-test.cjs
node qa/user-experience-smoke-test.cjs
node qa/home-dashboard-smoke-test.cjs
npm run qa
```

Expected: same features, cleaner shared styling.

---

### Task 5: Real Mobile QA Checklist

**Files:**
- Create: `docs/reviews/MOBILE_QA_CHECKLIST.md`
- Modify: relevant `qa/*.cjs` after manual issues are found

- [ ] **Step 1: Create checklist**

Document manual checks for Android APK, iPhone PWA, and desktop web:

```markdown
- Login
- First-time standard password flow
- Profile photo upload
- Chat text/image
- Direct message
- Live map start/stop
- Workday start/stop
- Information search/contact list
- Creator drift panel
- Update prompt
```

- [ ] **Step 2: Convert repeated bugs into smoke tests**

Every repeated manual bug gets a small `qa/*-smoke-test.cjs` check before it is fixed.

- [ ] **Step 3: Verify**

Run:

```powershell
npm run qa
```

Expected: automated checks match the manual pilot checklist.

---

## Self-Review

Spec coverage:
- Professional codebase: covered by Tasks 1 and 3.
- Better design and older-driver usability: covered by Task 4.
- Stable release and update confidence: covered by Tasks 1 and 2.
- Real mobile behavior: covered by Task 5.

No placeholders:
- Each task names exact files, commands, and expected results.

Type consistency:
- Module names and QA commands are consistent across tasks.
