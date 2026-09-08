# Portfolio Website

Alek Racz's portfolio: an animated cel-shaded spring, enclosing forest, underground cross-section, and a dark introduction with portrait and LinkedIn contact.

## Stack and ownership

React 19, TypeScript, Vite 6, TanStack Router, existing Tailwind setup. No new runtime dependencies.

- Home route: `src/routes/index.tsx`.
- Approved experience: `src/components/portfolio-journey/`.
- React owns mount/unmount. The small imperative renderer owns only its checked-in HTML island. `runtime/mount.js` releases listeners, observers, timers and GPU resources on unmount.
- `portfolio.html` is trusted repository content, never fetched HTML or user input.
- `portfolio.css` is mounted only on the home route.
- Optimized media: `public/portfolio-assets/`. Experimental generations and models are not shipped.
- Existing `/about` and `/timeline` remain directly accessible but are intentionally absent from the home menu, per user approval.

## Commands

```text
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run build-storybook
```

The deployment builds both the app and Storybook. Production build also writes Pages entry files for existing routes using `scripts/pages-routes.mjs`. Vite preview is not proof of static-host deep-link behavior; check those files with a static server.

## Behavior to preserve

- Day cel shading from 6 AM to 5 PM in the visitor's local clock; evening otherwise. Studio selections are temporary URL overrides.
- Existing spring-to-forest framing. A slower, steady descent with gradual handoff to normal page scrolling. No wheel/touch interception or artificial inertia.
- Water moves while actually visible and pauses offscreen, when the tab is hidden, or for reduced motion.
- Selected hand clip: 1.75x playback, 0.4-second fades, 0.05-second final hold, 1.5-second hidden rest, full opacity, responsive size, initial one-second delay.
- Atomic art swaps: keep current scene until every required replacement is decoded; retain it on failure and offer Retry.
- Half-screen spacing around “There’s more beneath the surface.”; portrait left on wide screens and above text on phones.
- Preserve identity, routes, legal footer and accessibility. No forms, analytics, credentials or remote inference.

## Release

Use the existing `feat/forest-depth-redesign` worktree, targeting `main` explicitly. The repository's default branch is older `master`; Pages workflow and deployment environment intentionally use `main`. Do not rename branches or change environment policies as part of this release.

The user's September 8 approval covers PR, fresh independent review, merge after passing checks, and resulting GitHub Pages deployment. Keep the separate dirty main checkout and approved standalone prototype untouched. Subsequent unrelated deployment or infrastructure changes still require approval.
