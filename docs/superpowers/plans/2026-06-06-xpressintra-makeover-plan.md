# XpressIntra Makeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home screen calmer, clearer, and easier for drivers to use.

**Architecture:** Keep the existing single-page app structure. Change `renderHome()` and related CSS only, then update existing smoke tests so the new layout is protected.

**Tech Stack:** Vanilla JavaScript, Vite, CSS, Node smoke tests.

---

### Task 1: Home Structure

**Files:**
- Modify: `src/app.js`
- Test: `qa/home-dashboard-smoke-test.cjs`

- [ ] Replace the current home layout with: hero, one next action, driver tools, office compact card, pickup card, community hint.
- [ ] Ensure the current next action is not duplicated in the tool grid.
- [ ] Ensure settings/control/admin functions are not promoted on the home screen.

### Task 2: Home Styling

**Files:**
- Modify: `src/styles.css`

- [ ] Add a calmer hero layout with larger primary action.
- [ ] Make driver tool cards large and readable.
- [ ] Make the office/community section compact.
- [ ] Keep the existing dark XpressIntra visual identity.

### Task 3: QA

**Files:**
- Modify: `qa/home-dashboard-smoke-test.cjs`
- Run: `npm.cmd run qa`

- [ ] Confirm the home screen shows one clear next action.
- [ ] Confirm old clutter does not return.
- [ ] Confirm duplicate work/live-map shortcuts do not appear.
- [ ] Confirm production build still passes.
