# PivotOS Design Rules

## Purpose
This file is the non-negotiable design system and UX quality gate for PivotOS.
Every new screen, component, and refactor must follow these rules.

---

## 1) Product Feel (Always)
- Calm, premium, fast, trustworthy.
- Mobile-first, desktop-powerful.
- Clear in 3 seconds.
- One primary action per section.
- No visual noise.

---

## 2) Global UX Anchors
- Global Command Centre is the default signed-in home.
- A dedicated marketing Landing Page exists for signed-out users.
- Users can move between:
  - Signed-out Landing Page
  - Auth
  - Signed-in Command Centre
  - Back to public Home/How-it-Works pages
- Navigation should never feel like a dead-end.

---

## 3) Information Hierarchy Rules
- Cards first, tables second.
- Progressive disclosure:
  - Level 1: summary cards
  - Level 2: filtered lists/views
  - Level 3: record detail + history
- Show what matters now:
  - urgent
  - waiting
  - revenue-impact
  - risk

---

## 4) Layout System Rules
- 8px spacing rhythm.
- Consistent container widths and gutters.
- Rounded card language (8/12/16 radius family).
- Stable visual rhythm:
  - title
  - short context line
  - primary action
  - secondary actions
- No over-dense blocks on first view.

---

## 5) Typography & Color Rules
- Primary type family: Manrope.
- Strong heading hierarchy, readable body copy.
- Color usage:
  - green = primary progress/action
  - blue = secondary/info
  - neutral = structure
  - red/amber = risk and warnings
- Maintain WCAG-friendly contrast.

---

## 6) Component Rules
- Buttons:
  - one clearly dominant primary CTA
  - secondary and ghost actions visually subordinate
- Inputs:
  - clear labels
  - obvious focus state
  - no ambiguous placeholders-only forms
- Status chips:
  - short, explicit labels
  - consistent color semantics
- Empty states:
  - one-line explanation
  - one primary next action

---

## 7) Mobile + PWA Rules
- Thumb-friendly actions.
- Sticky quick access for key actions.
- Offline-safe for critical flows:
  - capture
  - tasks
  - meetings
  - inbox triage
- Always show sync state clearly.

---

## 8) AI UX Rules
- AI suggests first, executes risky actions only with approval.
- AI outputs must be concise and actionable.
- Always show:
  - why AI suggested it
  - what data it used (high-level)
  - what action will happen
- No gimmick AI copy or fake intelligence effects.

---

## 9) Continuous Improvement Loop (Mandatory)
For every completed build slice:
1. Run the screen and test real flows.
2. Ask: Is this simpler? clearer? faster?
3. Apply at least one UX improvement if obvious.
4. Re-test.
5. Log what improved.

Cursor prompt pattern to use repeatedly:
- "Improve this screen using DESIGN_RULES.md: reduce cognitive load, strengthen hierarchy, and keep one primary action."
- "Apply a premium mobile-first polish pass per DESIGN_RULES.md without changing business logic."
- "Critique and improve this workflow for clarity and speed using DESIGN_RULES.md."

---

## 10) UI Definition of Done
A screen is done only if:
- Core task can be completed without explanation.
- Visual hierarchy is obvious.
- Primary action stands out.
- Empty/loading/error states are present.
- Mobile layout is validated.
- No cross-entity confusion.
- Lint/build pass.

---

## 11) Anti-Patterns (Do Not Ship)
- Too many equally strong buttons.
- Long unstructured forms on first interaction.
- Hidden critical status.
- Unlabeled icons.
- Mixed entity context without clear boundary.
- AI actions that bypass approval rules.
- Feature-heavy screen with no clear next action.

