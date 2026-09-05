# Self-registration with approval

Status: implemented locally for the next release. Database hardening applied live.

## Flow

- Public login offers self-registration without an invitation.
- Employee enters email, name and a personal password, repeated for confirmation.
- Existing invitation links remain supported and keep their email binding.
- Email confirmation follows the project's existing Supabase Auth settings.
- New profiles always start paused. User-editable metadata cannot grant access.
- Active chef/admin and creator can approve or reject in the existing employee administration and access-request panel.
- Approved employees do not become administrators. Rejected profiles remain blocked.

## Verification

- Production build and all 66 automated checks passed.
- Executed qa/self-registration-rls.sql against the XpressIntra database in a rollback-only transaction.
- Verified trigger-created profile, ignored owner/active metadata, blocked colleague/chat/GPS/admin reads, blocked self-approval, admin approval, employee-only access after approval, and revocation after rejection.
- Confirmed both temporary Auth users were absent after rollback.
- Existing real users were not changed.

## Limits

- The SQL test exercises real triggers and RLS, not email delivery or the public Auth HTTP signup endpoint.
- No confirmation email delivery to an actual inbox was tested in this round.
- Public pages and installed APKs need the next release to show the new registration button.
- Existing paused profiles still share the same approval list as new access requests; this change does not redesign that status model.
