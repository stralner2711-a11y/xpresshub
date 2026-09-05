# Role visibility audit - 2026-09-05

## Findings fixed locally

1. Update summary showed employees a technical Details button even though its click action was creator-only. Hide it for non-creators and guard the modal function itself.
2. Update summary printed internal fetch errors and placeholder setup reminders to all roles. Non-creators now see a plain retry message.
3. Public login diagnostics displayed backend/key/service-worker terminology and a technical report copy button. Visually confirmed on the live login page. No secret key or employee record was shown. Non-creators now get a limited plain-language status list; technical details and report copying require the creator UI role.

These are frontend visibility controls, not substitutes for RLS. Public APKs, frontend source, publishable keys and release version files cannot be made confidential by hiding buttons.

## Database verification

- Read-only catalog inspection: all 27 public tables have RLS enabled.
- Reviewed admin audit, invitations, aggregate telemetry, notifications, private profile details, support/data requests, profiles, core settings, retention and regulatory update policies.
- Transaction-only fixtures: pending user blocked; admin can approve/reject; active employee cannot promote themselves or read visible admin/invitation/telemetry records or other users' private requests. All fixture changes rolled back.
- Anonymous read assertions passed for profiles, invitations, admin audit, telemetry, private details, support/data requests, messages and locations.
- Fixture cleanup confirmed: zero test Auth users remain.
- No production policies or real employee records were changed.

## Frontend verification and limits

- Local rendering assertions cover employee, dispatcher, admin and owner menus, update details/error text, rollback buttons, direct modal calls and diagnostic report button.
- Public login diagnostics inspected in the live browser before the fix.
- Browser security policy blocked the generated local HTML preview. No workaround attempted. Consequently employee/admin rendered previews were tested programmatically, not visually in a real authenticated employee session.
- Existing action-guard suite passed. Full QA: 70 tests and production build passed before final report update.
- This is a targeted role/visibility audit, not proof that every function, RPC or private-message scenario has been penetration tested.
- Fixes are not published yet. Android/iOS web assets should be synced before the next release; native iOS build remains untested on Windows.
