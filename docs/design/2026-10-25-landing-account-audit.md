# Landing and account design audit — iteration 02

25 October 2026 · Implemented proposal for Drikus to reassess, not a final design lock.

## Brief and baseline

Drikus requested a full landing/header/type/brand/account review, followed by implementation: big bold modern type, less but more descriptive copy, animation that explains the work, and a well-organised account area. The supplied Google Account screenshots informed settings grouping and navigation only; no personal account data was copied.

Reviewed against `DESIGN_RULES.md`, confirmed founder decisions in `plan/interviews/SHARED.md`, `plan/PRODUCT_BLUEPRINT.md`, the existing landing, authentication pages, account components, and current route/catalogue behaviour. These plans remain subject to change.

## Findings and implemented changes

| Area | Finding | Change |
| --- | --- | --- |
| Brand | Landing and account CSS contradicted Paper/green/Manrope with white/purple/Arial. | Warm paper, near-black ink, restrained green. Locally hosted licensed Manrope; consistent logo treatment across these screens. |
| Hierarchy | Large headline worked, but body and preview text became tiny, with repeated explanatory sections. | Retained “Your whole world. One clear desk.” Bold type, shorter section copy and a more legible sample. |
| Product explanation | Mostly static cards and an abstract floating AI symbol. | Four-stage interactive workflow. Business switching changes the actual sample context. Animated transitions and a coordination diagram explain the model. |
| Motion | Decorative float animation did little to explain the product. | Controlled workflow playback, pause/play/next, direct step selection, reduced-motion support. Playback stops offscreen and when the browser document is hidden. |
| Header | Sticky/mobile behaviour was fixed in iteration 01, but signed-in visitors lacked their account menu. | Kept sticky header and mobile navigation; real server-authenticated identity powers profile/security/business-access menu links. |
| Primary action | “Founder access” led to closed registration, competing with exploration. | Anonymous visitors explore the preview or sign in. Signed-in visitors open their desk and account. Registration stays private. |
| Accuracy | “Eleven connected systems” implied more readiness than the available product supported. | Explicit sample-data label and concept status; vision marked planned; no fabricated sends, approvals or completed integrations. |
| Business context | System-name lists were long and dense. | Four concise company cards with meaningful examples. Personal remains separate. |
| Login/recovery | Small, disconnected single-card presentation. | Shared brand and clearer form hierarchy; desktop story panel, focused phone form, persistent preview/home access. Existing authentication handlers retained. |
| Account structure | Generic heading, small text, verbose planned team material. | Contextual headings, profile/email-verification/access overview, grouped editable settings, larger fields, future roles collapsed by default. |
| Mobile/accessibility | Wide content and small embedded text competed for space. | Adaptive business picker, legible workflow, two-column/single-column cards, keyboard dismissal, focus indicators, skip link, 44px+ principal controls. |
| Semantics | Marketing route wrapped a component main inside another main. | One main landmark, with header/footer outside it. |

## Product judgement

A premium product should make the next action obvious, preserve context, and earn trust through accurate status and dependable behaviour. Visual polish cannot establish a business valuation. This iteration makes the product easier to understand without inventing customer counts, automation success, testimonials or delivery claims.

The signed-in operational workspace remains a separate design pass; it still has legacy purple styles. The current work updates the landing, account menu, account settings and shared authentication shell. Some operations, connections and meeting features are changing concurrently, so the landing deliberately avoids a hard-coded connection inventory.

## Reassessment prompts

- Is the type confident enough while still comfortable for daily use?
- Does the sample explain the product faster than the previous static preview?
- Does warm paper/green feel like Pivot OS across the landing and account?
- Are the four business examples representative of the work Drikus wants to prioritise?
- Next iteration: apply the accepted tokens and hierarchy to the real desk, inboxes and work records.

## Verification

- 24/24 Playwright tests passed across desktop Chromium and iPhone-sized Chromium: landing navigation, business context through the workflow, reduced motion, private registration, login errors, recovery and account-menu keyboard dismissal. Auth writes were intercepted; no account was created or reset email sent.
- Browser layout checks passed at 320, 390, 768, 1024 and 1440px for the actual landing and login routes. No horizontal page overflow; sticky header and section offsets verified; local Manrope loaded successfully.
- Sample-data rendering of the actual account and signed-in landing components passed at 320, 390, 768 and 1440px: profile, security and business-access navigation, account-menu positioning and keyboard dismissal. Next navigation was adapted in this isolated fixture. Real profile/password writes and authenticated database reads were not exercised.
- Visually inspected desktop and phone landing, desktop login, phone profile, desktop security and phone account-menu screenshots.
- TypeScript and focused ESLint checks passed. Production build passed. Existing Supabase Edge-runtime compatibility, Browserslist freshness and Next ESLint-plugin warnings remain outside this visual pass.
- React review: effect listeners/timers clean up; animation uses CSS without a new animation library; automatic playback respects reduced motion, viewport visibility and hidden documents; no new API mutation was introduced. Confirmed founder initials DJ are used for Drikus Eksteen.
