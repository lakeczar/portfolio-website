# Scroll feel, first load, chapters, SEO and cleanup

## Current task (2026-10-05)

- Status: Review; requested directly by the project owner, who asked for the commit and PR on 2026-10-05.
- PR: https://github.com/lakeczar/portfolio-website/pull/4 (base main)
- Branch: `feat/scroll-feel-and-studio-tabs`, based on `main` at `970af7f`.
- Objective: (1) make scroll-driven motion consistent through the spring → forest → underground transitions; (2) show the scroll cue sooner on load; (3) keep the developer studio heading and tabs visible while its pane scrolls. Follow-up the same day: share/SEO metadata, faster first paint, journey chapter markers, removal of dead code and unused dependencies.
- Changes: pacing extracted to `runtime/journey-pace.js` (log-space zoom, forest speed curve that matches the descent's cruise speed, descent enters at cruise speed with the approved total length preserved); journey height sized against the pinned scene; touch-device resizes from browser bars no longer re-pace mid-scroll; cue revealed when the spring is painted (1 s fallback) and first play no longer waits for the fade; studio panes scroll inside `.studio-body`.
- Evidence: headless Chrome sweep, motion per scrolled pixel (1.0 = native). Desktop 1280×800: peak 1.54 → 1.00, minimum at the forest seam 0.06 → 0.37, low-motion distance 104 px → 0. Phone 390×844: peak 1.76 → 1.11, seam 0.09 → 0.39. Journey length unchanged (2730 / 2702 px); 0 % and 35 % framing pixel-identical in screenshots. Cue shown at ~270 ms vs ~1130 ms (local dev). 38 tests, lint, app build and Storybook build pass.
- Follow-up changes: favicon set, share image (`public/og-image.jpg`, crop of cel spring), Open Graph/Twitter tags, canonical URLs rewritten per route by `scripts/pages-routes.mjs`, JSON-LD Person, robots.txt and sitemap. Blurred thumbnail placeholder from `index.html` (before the bundle) and under the artboard (until the spring element decodes). Chapter markers (Spring / Forest / Underground / About) with native smooth scrolling, instant under reduced motion. Removed master-era Hero, BlurLights, theme system and their tests, plus 11 unused packages (lockfile: 105 packages removed, none added or upgraded).
- Follow-up evidence: throttled phone (1.6 Mbps, 150 ms, 4× CPU) first contentful paint ~1.6 s → ~0.42 s with the scene visible (blurred) instead of blank; sharp art unchanged at ~3.2 s. No brightness dip at the placeholder handoff. Chapter clicks land on 35 % / 100 % / introduction / 0 % on desktop and phone, with and without reduced motion. 25 tests (13 belonged to deleted components), lint, type-check, app build, Storybook build, and `/`, `/about/`, `/timeline/` static loads pass.
- Open decision: AVIF hero images would cut ~34 % (q60, 38 dB PSNR vs shipped WebP) but re-encode approved art; not applied.
- Not verified: physical trackpad/touch feel; iOS address-bar behaviour (reasoned, not device-tested); hand video playback in headless Chromium (no H.264).
- Declined: a time-of-day particle layer (fireflies, pollen, petals) was mocked in the browser only; the owner judged it not embedded in the scene. Not committed. A painted Night art set remains the suggested route for more moods.
- PR review (2026-10-10): Codex review of the PR found three issues, all fixed with regression tests in `50d1c56` and `9df3955`: a style switch failing during the first load left the current artwork unfinished; reduced motion showed the spring for the Forest chapter; the CSS minimum height left a dead scroll stretch on short viewports. A directed re-review of the fixes came back clean. A babysit review (2026-10-10) found that a style switch finishing before the first spring delayed the scroll cue to the 1 s fallback; the switch now cues scrolling too, with a regression test.
- Checkpoint: all changes committed on the branch; 29 tests, lint, type-check, app build and Storybook build pass on the committed tree.
- Next action: owner reviews the PR. Merge and deployment are not approved.

## Previous task (2026-09-08, merged as PR #3)

- Status: Done (merged as PR #3); claimed by the current Codex task after verifying no overlapping open PRs.
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
