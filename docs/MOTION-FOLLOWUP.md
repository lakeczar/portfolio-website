# Spring-to-forest smoothness follow-up

2026-09-08, after PR #2 publication.

## Change

- Main cel choices are first: **Daylight (cel)** and **Evening (cel)**. Alternate choices are **Cinematic study** and **Storybook study**.
- Existing style IDs, media URLs and browser-local automatic schedule are unchanged.
- Cache playback state so scrolling does not repeatedly rewrite unchanged water/status/reduced-motion controls.
- Remove the scroll cue class only when present. An inactive hand now pauses/seeks only when its playback state actually needs changing.
- No new animation loop, scroll interception, artificial inertia, library, GPU promotion or art changes. The approved geometry and scroll distances are unchanged.

## Evidence

Isolated headless Chrome, 4x CPU emulation, controlled 2.4-second spring-to-forest sweep. Instrumentation counted HTMLMediaElement currentTime assignments.

| Scenario | Before | After |
| --- | ---: | ---: |
| Desktop cel hidden-video seeks | 540 | 0 |
| Phone cel hidden-video seeks | 786 | 0 |

All four art styles reached the same 35-percent forest endpoint and passed the existing descent, native text scroll, keyboard footer and reduced-motion assertions. Phone cel also passed. Water visibility test passed: running at spring and partial descent, paused when fully offscreen, resumed on return, paused for reduced motion.

A temporary will-change experiment had mixed frame-timing results across styles and was not retained. Headless frame timings are not a physical-device FPS guarantee. The measured reduction in redundant media work is confirmed; the user's mouse/trackpad feel still needs evaluation in the local preview before publication.

Regression tests cover unchanged playback-state deduplication, visibility changes, main-style ordering and local-clock schedule boundaries. All prior image-race and route-cleanup regressions remain covered.
