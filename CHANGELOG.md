# speaknote — Changelog

Moved out of the repo-wide `CLAUDE.md` on 2026-09-25 to keep that file focused on rules rather than history. Entries below are transcribed verbatim (substance unchanged) from what was previously in `CLAUDE.md`'s per-version table for this app; only pure markdown table syntax (the row-closing ` |`) was stripped. Newest version first.

---

## v1.5

sw `speaknote-v1-5`; **install fixes, a real logo, and tap-to-refresh.** User could not install SpeakNote as a PWA, noted there was no nice logo, and asked for an app refresh when pressing the icon. The live site could not be fetched from here, so the exact reason the browser withheld "Install" is not confirmed; these are the defects found in the manifest and worker that can block or degrade installs, all fixed:

- **Manifest:** `start_url`/`scope` were absolute `/` (now `./`) and an `id` was added so the install identity is stable. Every icon was declared `"any maskable"`, so Android masked the already-rounded dark tile a second time and shrank/clipped it; icons are now split: the 8 existing tiles are `any`, and two new full-bleed `maskable-192.png`/`maskable-512.png` (mic inside the safe zone) are `maskable`. Icon and manifest URLs carry `?v=1.5` so stale caches cannot serve the old ones.
- **Service worker:** precaching used `cache.addAll()` on absolute paths, which is all-or-nothing, so one missing file failed the whole worker install; files are now cached one by one with relative paths. Page loads are now network-first (offline falls back to the cached page) so updates arrive on the next open instead of being stuck behind the cache.
- **Logo:** the header's emoji tile (🎙️) is replaced by the real app icon image.
- **Tap to refresh:** tapping the logo or name unregisters the service worker, clears all caches and reloads, so the newest version is fetched. Asks first if recording is on. Notes/settings in localStorage are not touched.

**Verification:** new icons viewed; manifest JSON and sw.js reviewed; not tested in a browser or installed on a device. After pushing, check Chrome DevTools, Application, Manifest for any remaining installability message if Install still doesn't show.

---

## v1.4

sw `speaknote-v1-4` (was an unversioned-looking `speaknote-v1-3-20260527-5`); **fixed a real bug**: `manifest.json` declared 8 icon sizes under `icons/` but that folder never existed on disk (0/8 files present) — found via full-repo PWA audit prompted by the QuickTimer incident. Generated the full icon set by rasterizing the app's existing inline-SVG mic glyph (dark `#0f0f23` bg, teal `#00d4aa` mic) at all 8 declared sizes; also added those icons to the service worker's precache list

