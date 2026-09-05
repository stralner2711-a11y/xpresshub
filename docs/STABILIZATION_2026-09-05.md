# XpressIntra stabilization, 2026-09-05

## Completed

- `app.js`: Direct-message creation requires a valid conversation UUID returned by the server. Removed display-name, initials and single-conversation fallback. Missing IDs stop before any message INSERT; the compose form remains open.
- `app.js`: Load the latest 500 messages separately for each authorized conversation, in descending server order with ID tie-breaker, then reverse for display. Media-free and REST fallback paths use the same filter/order. Empty authorized conversation lists clear stale chat state.
- `vercel.json`: Permit the two configured update-file hosts in connect-src without allowing arbitrary origins. This is a configuration correction, not proof of a deployed update.
- `supabase/migrations/20260905082019_enforce_media_owner_paths.sql`: Enforce the app bucket and owner UUID folder on media metadata, including future UPDATE operations. Existing rows passed validation. Combined with existing INSERT RLS on media metadata and Storage objects, this prevents claiming another user's file path as owned metadata. No elevated helper function or data deletion was needed.
- Updated `supabase/schema.sql`, `supabase/RUN_THIS_FROM_SCRATCH_IN_SUPABASE.sql` and `supabase/RUN_THIS_IN_SUPABASE.sql` with the same constraint.
- Added `qa/chat-recovery-regression.cjs`: actual-function VM tests for missing/valid RPC IDs, latest-message preservation, quiet conversations, media and REST fallback, stale clearing and CSP origins.
- Corrected `qa/supabase-client-smoke-test.cjs` to use a real UUID format instead of a synthetic non-UUID conversation ID. The previous fixture accidentally depended on the unsafe fallback.
- Added `qa/media-owner-path-rls.sql`: authenticated database test with rollback for foreign paths, foreign buckets and valid own metadata.

## Verification

- `npm run qa`: PASS, 63 tests plus production build.
- Database migration applied only to XpressIntra project `mtfbdoajzmlgqbeiubxe`: PASS.
- Database constraint exists and is validated: PASS.
- Authenticated RLS/constraint test: foreign path and bucket denied; own metadata accepted and readable. All test writes rolled back. No files uploaded or removed.
- `npm run native:sync`: PASS for shared web assets in `android-active` and `ios-active`.
- iOS native compile not run: Windows has neither CocoaPods nor Xcode.

## Release Status

Database protection is live. Frontend and hosting fixes are local and synchronized into native project assets, but have not been deployed to Vercel, pushed to GitHub or packaged into a new APK. Version remains 1.3.55/build 68 until the release step. No physical-device or two-user end-to-end chat test was performed in this round.

## Still Open From Review

### Follow-up: drift panel

- Reproduced the production failure by clicking Mere > Administration > Appens drift. Browser console showed a null `previousStableVersion` access inside the update module. No modal was appended.
- Fixed `src/modules/update-system.js` and the root app wrapper to return an explicit unknown, non-actionable backup status when version data is absent.
- Removed hardcoded quality percentages from the planning list; labels now identify it as an unmeasured review checklist.
- Unverified automatic retention cleanup is no longer marked completed. This does not implement a cleanup scheduler.
- Fixed `src/styles.css` contact preview grid so avatar spans both rows and name/role share the text column.
- Extended `qa/creator-user-test-smoke-test.cjs` to load the actual update module with the full app, open the owner dashboard without version data, and verify the unknown-state and review labels.
- QA rerun: 63 tests plus build passed. Native assets resynchronized. No deployment or new APK release performed; new layout has not been validated on a physical phone.

- History older than 500 messages per conversation still needs pagination. Loading is currently sequential per conversation; measure with larger accounts before optimizing.
- Direct-message display names should be derived from verified conversation membership.
- Admin overview of data-subject requests still needs correction.
- Diagnostic status should use the actual update check rather than only a local version file.
- Layout/contact duplication, readiness indicators, retention scheduling and signed release workflow remain separate work items.
- The media constraint addresses owner/path confusion; this is not a certification of all attachment-parent authorization or all RLS policies.
- The unrelated deployed Edge Function was not deleted in this round.
