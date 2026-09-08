# Approved portfolio release

Updated 2026-09-08. This is the single active fallback task; no board provider is active.

## Objective and authority

Integrate the user-approved cel/evening standalone portfolio into the existing React app without redesigning it. Open a PR to `main`, obtain a fresh independent review, resolve blocking findings, verify required checks, merge, and verify the resulting GitHub Pages deployment. The user explicitly approved both merge and automatic publication on September 8.

## Ownership

- Status: Review
- Owner: current Codex task
- Branch/worktree: existing `feat/forest-depth-redesign` worktree
- Base: `main`, initially `1134e86`
- Risk: visual, browser lifecycle and deployment integration; no stored user data
- PR: not yet created
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

- App checks: 30 local tests passed, lint passed, production and Storybook builds passed. Local test count includes historical unstaged draft tests; CI will verify the exact committed tree.
- Production browser checks: desktop and throttled phone scroll handoff, native text scrolling, keyboard footer access and reduced motion passed without runtime errors. Additional route/style lifecycle checks pending.
- Fresh candidate review: pending
- Merge / deployment: pending

## Checkpoint

The selected renderer has been connected to the React home route with scoped lifecycle cleanup and only optimized selected media. CI now propagates test failures and the production build emits direct-route files. Next: open the PR, complete fresh candidate review and route/style lifecycle checks, then merge only after passing CI and verify publication.
