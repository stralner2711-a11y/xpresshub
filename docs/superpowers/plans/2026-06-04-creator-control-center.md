# Creator Control Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional creator drift panel with rollback controls for XpressIntra.

**Architecture:** Extend the existing vanilla JavaScript creator operations dashboard in `src/app.js` and reuse the existing modal/action pattern. Add styling in `src/styles.css`, update `public/version.json`, and add focused smoke tests.

**Tech Stack:** Vanilla JavaScript, localStorage, Supabase status helpers, Vite, Capacitor assets, Node-based QA smoke tests.

---

### Task 1: Rollback data model

**Files:**
- Modify: `src/app.js`
- Modify: `public/version.json`

- [x] Add optional stable APK/download fields to normalized version data.
- [x] Compute whether rollback is available and safe.
- [x] Keep update URLs restricted to approved GitHub/GitHub Pages origins.

### Task 2: Creator rollback UI

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [x] Add rollback card to Creator drift dashboard.
- [x] Add rollback center modal with current/stable versions, warning text, and safe action buttons.
- [x] Add creator-only actions for opening rollback center, marking local version as suspect, and installing/opening stable version.

### Task 3: Professional drift improvements

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [x] Improve creator dashboard labels and quick actions.
- [x] Make privacy guard explicit.
- [x] Keep private chat/logbook content out of creator dashboard.

### Task 4: Tests

**Files:**
- Modify: `qa/admin-dashboard-smoke-test.cjs`
- Modify: `qa/app-update-system-smoke-test.cjs`

- [x] Assert rollback controls are visible for creator.
- [x] Assert rollback confirms that employee data is not deleted.
- [x] Assert version metadata supports previous stable APK.

### Task 5: Verification

**Files:**
- No code files.

- [x] Run QA smoke tests.
- [x] Run production build.
- [x] Run native sync when build is green.
