# Scroll smoothness and art-style labels

## Current task (2026-09-08)

- Status: Review; claimed by the current Codex task after verifying no overlapping open PRs.
- Branch: `fix/portfolio-scroll-compositing`, based on released `main` at `002ab745` in the existing assigned worktree.
- Objective: clarify that cel day/evening are the main artwork and improve spring-to-forest rendering smoothness without changing the approved scroll distances or adding input inertia.
- Acceptance: test all four styles; preserve shared pacing, style IDs/URLs, automatic time selection, accessibility and offscreen/reduced-motion behavior; run focused regressions and required app checks.
- Risk: visual/compositing regression and GPU memory. Compare a bounded compositing hint before retaining it; do not permanently promote every scene layer.
- Shared resource: loopback built preview on port 5186; approved standalone preview and dirty main checkout stay untouched.
- Authority: local implementation, verification and PR preparation. The prior merge/deployment approval applied to PR #2; this follow-up has not been approved for publication.
- Non-goals: new images, framework, scroll library, OS mouse changes, expanded visual redesign, or unrelated cleanup.
- Current evidence: 37 local tests and lint pass; production build passes. All four styles pass shared scroll-distance, handoff, reduced-motion and keyboard checks; phone cel layout also passes. Hidden video seeks during the controlled initial scroll fell from 540 (desktop) / 786 (phone emulation) to zero. Water pause/resume passes. See `docs/MOTION-FOLLOWUP.md`.
- Checkpoint: local preview on port 5186 contains the fix and renamed/reordered styles. No scroll-distance or image changes. Follow-up PR prepared for review; publication and subjective physical-input smoothness remain unapproved/unverified.

## Previous release (historical record)

Updated 2026-09-08. This is the single active fallback task; no board provider is active.

## Objective and authority

Integrate the user-approved cel/evening standalone portfolio into the existing React app without redesigning it. Open a PR to `main`, obtain a fresh independent review, resolve blocking findings, verify required checks, merge, and verify the resulting GitHub Pages deployment. The user explicitly approved both merge and automatic publication on September 8.

## Ownership

- Status: Done (local post-release checkpoint; PR #2 is the published review/merge record)
- Owner: current Codex task
- Branch/worktree: existing `feat/forest-depth-redesign` worktree
- Base: `main`, initially `1134e86`
- Risk: visual, browser lifecycle and deployment integration; no stored user data
- PR: https://github.com/lakeczar/portfolio-website/pull/2 (base main)
- Recovery: original dirty main checkout and standalone prototype remain untouched

## Acceptance criteria

1. Approved images, copy, portrait, LinkedIn, studio, hand animation, water and scroll handoff survive integration.
2. Day/evening selection uses local browser time; style swaps retain old artwork on loading/failure and support retry.
3. Native scroll, reduced motion, keyboard access, offscreen animation pause and mobile layout remain usable.
4. React remounts do not duplicate controls/listeners or leave active renderers behind.
5. Routes `/`, `/about`, `/timeline` work from static hosting; home menu omits unfinished secondary pages.
6. Tests, lint, production build and Storybook build pass; CI must not hide test failures.
7. Fresh independent review is tied to the candidate revision. Blocking findings are resolved before merge.
8. Merge targets `main`; deployment is verified at the existing custom domain.

## Non-goals

No new framework, scroll library, backend, analytics, contact form, paid service, model installation, branch rename, or deployment-platform migration. Do not ship experimental galleries, old frame studies, local browser profiles or raw model assets.

## Review and evidence

Preflight (read-only independent agent): explicit `main` base matches ancestry, CI and Pages branch policy. Test-failure masking and missing static deep-link files identified; fixes are included. This is not the final candidate review.

- App checks: 34 local tests passed, lint passed, production and Storybook builds passed. Local test count includes five historical unstaged draft tests; CI verifies the exact committed tree.
- Production browser checks: desktop and throttled phone scroll handoff, native text scrolling, keyboard footer access and reduced motion passed. Style loading, rapid selection, blocked-image retry, water pause/resume, static route entry and client-side route cleanup passed without runtime errors after correction.
- Fresh candidate review: initial reviews requested fixes for cancelled frame loads, removed-DOM teardown, and responsive decode races. All have focused regression coverage; final correction verification is required before merge. Findings, reviewed SHAs and final disposition are recorded on PR #2.
- Merge / deployment: PR #2 merged as `002ab745124ab1f48cb43a99f72c3e0c0480e8a9`. Production run `34272767512` succeeded. Live root, retained routes and selected assets at https://alekracz.dev/ verified HTTP 200; approved copy and studio verified in the live bundle.

## Checkpoint

Release complete. Final independently approved candidate: `358b87089a5444876241d96d9d1676c01abef73c`; 29 tests passed on its exact committed tree. Squash-merged main has the same tree. Publication succeeded and live checks passed. This completion-only checkpoint is saved locally after merge; no post-review application code was changed. The original dirty main checkout and approved standalone prototype remain untouched. Further website work requires a new task.
