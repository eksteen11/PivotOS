# Dashboard readability — iteration 03

Implemented after Drikus approved three priorities: one obvious next action, readable Paper branding, and a focused New work drawer.

## Changes

- Desk leads with a single reviewable work item inside Needs Drikus. Dated plans come first, then the longest time since the last update; this is an explicit ordering rule, not an invented importance score. Remaining reviews stay visible below, with all records available in Work. If the review queue clears, the focus changes to ongoing work or follow-up.
- Equal-weight statistics became a compact summary below the work. In-progress and waiting summaries actually filter the Work table. Business cards are expandable; planned workforce marketing stays on its own screen.
- Calendar focuses the next upcoming saved meeting, or a saved meeting in the selected week. The preparation action opens the real meeting record. Unscheduled meetings retain their separate arrange state. Company scope applies to both scheduled and unscheduled records.
- Paper, dark ink, green and locally hosted Manrope now carry through workspace navigation, forms, tables, board, inboxes, calendar, workforce and work-detail drawers. Company identity remains readable in words rather than depending on coloured dots.
- Main headings are 35–40px, work titles 16px, form fields 16px, and labels 14px. Small provenance/status metadata stays secondary. Phone navigation has labelled 44px+ controls; horizontally wide tables scroll inside their panel.
- New work starts with title, business and workflow. Optional notes/date and actual checklist steps expand on demand. The save action stays visible while content scrolls. Blank titles cannot submit, pending saves disable edits, and Escape cannot accidentally hide the form mid-save.
- Existing origin validation already contained the localhost/bind-host correction when this iteration began. Verified that correction on ports 3000 and 3031. The UI translates an origin rejection into an actionable message, retains fields and reuses the stable capture ID for retry. Authentication and cross-origin restrictions remain enforced.
- Sample meetings lead to sign-in instead of a real meeting route containing a fabricated sample ID.

## Verification

- Dashboard tests cover review ordering, filtered summary navigation, calendar scope, optional detail expansion, visible save footer, rejected-save data retention, stable retry ID, and pending-save Escape handling.
- Existing calendar navigation/draft-preservation and sample approval checks were exercised on desktop and phone Chromium.
- Origin helper and route tests passed on the screenshot's exact local address, http://127.0.0.1:3031. Legitimate anonymous requests reached authentication (401); unrelated origins were rejected (403).
- Actual /preview layouts and sample creation flow checked at 320, 390, 768, 1024 and 1440px. No horizontal document overflow. Visually reviewed desktop desk, phone desk and collapsed/expanded phone drawer.
- Real authenticated database writes were not performed. Save-failure/retry tests use intercepted responses and sample records; existing server authorisation remains in place.

Production build passed. TypeScript and focused ESLint checks passed. The 10 desktop/phone dashboard tests passed, including pending-save dismissal protection; calendar, sample approval and origin checks also passed. Existing Supabase Edge-runtime, Browserslist and Next ESLint-plugin warnings remain outside this design change.
