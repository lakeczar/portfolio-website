# Portfolio release review, 2026-09-08

PR: https://github.com/lakeczar/portfolio-website/pull/2

## Independent findings and disposition

The independent reviewer started with no design-conversation history and reviewed immutable commits against main. The primary agent separately exercised the built artifact, not the standalone prototype.

| Finding | Disposition | Regression evidence |
| --- | --- | --- |
| Initial forest request invalidated by selecting another style then returning | Fixed: mark only decoded and committed sources as cached | Controlled deferred-image test |
| React route removal could throw during UI cleanup before releasing resources | Fixed: cleanup no longer writes UI; disposed observers become no-ops | Removed-DOM unit test plus production client-side navigation checks |
| Portrait request could overwrite desktop after resizing back | Fixed: invalidate request before same-source early return | Desktop to portrait to desktop deferred-image test |
| Atomic style swap could commit an outdated orientation after decoding | Fixed: revalidate orientation after each awaited forest decode | Style-swap plus two orientation changes deferred-image test |
| CI hid all test failures | Fixed: propagate npm test failure | GitHub checks on exact candidate |
| Static Pages host could not load retained deep routes | Fixed: emit route entry files | Static /about/ and /timeline/ browser loads |

Original review: 845d64d7773f2a20b0b38c7251034664a5c4e06a. First correction: f851f695819e4d737b32964275f51af5f2c56118. The final correction SHA and reviewer decision are recorded in the PR conversation to avoid a self-referential commit hash.

## Remaining non-blocking limits

- Physical-device performance has not been measured; phone verification uses emulation, including 1.6 Mbps / 150 ms / 4x CPU slowdown.
- The artwork loader can retain an unmounted pending request until its 45-second timeout; it cannot commit into a replacement scene. Cancelling that bounded retention is optional follow-up.
- Existing historical styles and local untracked experiments were not removed as release cleanup. Experimental media, galleries, skills and model files are excluded from this PR.
- This is a public portfolio with no forms, private data store, analytics or inference service. No new dependencies or hosting-platform changes were introduced.

Merge requires the final independent correction review and passing GitHub checks. Publication is separately authorized by the owner and must be verified after merge.
