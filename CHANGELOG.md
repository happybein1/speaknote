# speaknote — Changelog

Moved out of the repo-wide `CLAUDE.md` on 2026-09-25 to keep that file focused on rules rather than history. Entries below are transcribed verbatim (substance unchanged) from what was previously in `CLAUDE.md`'s per-version table for this app; only pure markdown table syntax (the row-closing ` |`) was stripped. Newest version first.

---

## v1.4

sw `speaknote-v1-4` (was an unversioned-looking `speaknote-v1-3-20260527-5`); **fixed a real bug**: `manifest.json` declared 8 icon sizes under `icons/` but that folder never existed on disk (0/8 files present) — found via full-repo PWA audit prompted by the QuickTimer incident. Generated the full icon set by rasterizing the app's existing inline-SVG mic glyph (dark `#0f0f23` bg, teal `#00d4aa` mic) at all 8 declared sizes; also added those icons to the service worker's precache list

