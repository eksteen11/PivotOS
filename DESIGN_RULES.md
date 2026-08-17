# PivotOS Design Rules

**Authority:** Follows `CONSTITUTION.md` (approved 2026-08-14).

## Purpose
Non-negotiable UX quality gate for the Founder Operating System rebuild.

---

## 1) Product Feel
- Calm executive clarity with bold modern confidence.
- Fast, trustworthy, uncluttered.
- Phone-first, with the same core capability adapted cleanly for desktop and tablet.
- Clear in 3 seconds.
- One primary action per section.
- **Clear Horizon** is the approved visual direction: cinematic key moments, calm operational screens.
- Approved Stitch references: Cinematic Login, Living Home, Clear Horizon Inbox, Decision Theater Approvals, Living Agent Gallery.

---

## 2) Global UX Anchors
- Command Centre is the signed-in home.
- Founder-first product with permission-scoped collaborator views.
- Navigation exposes only real spine + active commercial lane.
- Never show fake-complete workspaces.
- Never dead-end the founder.

---

## 3) Information Hierarchy
- Cards first, tables second.
- Progressive disclosure: summary → list → record detail/history.
- Surface now: urgent, waiting, revenue-impact, risk.
- Keep daily screens simple; place structural complexity in a dedicated **Operating Map** view.
- Operating Map hierarchy: tenant/group → company → team/function → system → process → agent/tool.
- The map is permission-filtered, supports drill-down, and shows status and flow without exposing hidden nodes or data.

---

## 4) Layout
- 8px spacing rhythm.
- Consistent gutters and widths.
- Title → short context → primary action → secondary actions.
- No over-dense first view.

---

## 5) Typography & Colour
- Manrope.
- Strong hierarchy.
- Warm cream surfaces, deep ink typography, and one verdant green accent.
- Purple is retired.
- Semantic colour:
  - accent/progress = action
  - amber/red = risk
  - neutral = structure
- WCAG-friendly contrast.

---

## 6) Components
- One dominant primary CTA.
- Labels on inputs (not placeholders alone).
- Short status chips with consistent meaning.
- Empty states: one-line truth + one next action.
- Simulated integrations must say “simulated”.

---

## 7) Responsive
- Full workflow parity across breakpoints.
- First release is an installable web app.
- Phone uses a simple five-item bottom navigation.
- Desktop uses a labelled left sidebar.
- Thumb-friendly actions.
- Sync/auth/connection state always visible when relevant.

---

## 8) AI UX
- Suggest first; approve risky actions.
- Always show why, what data, what happens next.
- No fake “sent” unless it really sent.

---

## 9) Anti-Patterns
- Nine workspace skins with no depth
- Equally strong button clutter
- Hidden entity context
- Approval bypass
- Feature-heavy screens with no clear next action

---

## 10) UI Definition of Done
- Task completable without explanation
- Hierarchy obvious
- Primary action clear
- Empty/loading/error present
- Mobile checked
- No cross-entity confusion
- Build passes
