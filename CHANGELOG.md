# speaknote — Changelog

Moved out of the repo-wide `CLAUDE.md` on 2026-09-25 to keep that file focused on rules rather than history. Entries below are transcribed verbatim (substance unchanged) from what was previously in `CLAUDE.md`'s per-version table for this app; only pure markdown table syntax (the row-closing ` |`) was stripped. Newest version first.

---

## v1.7

sw `speaknote-v1-7`; **the language now defaults to the device language on first use.** User asked whether language detection could be automatic. True auto-detection isn't possible with the browser's speech recognition (the language must be set before listening, and wrong-language audio comes out as garbled text), so this is the safe version of it: on a first visit with no saved settings, `detectDeviceLang()` goes through `navigator.languages` in order and picks the first supported language, exact match first (e.g. `nl-NL`), otherwise the same base language (`nl-BE` gives `nl-NL`, `pt-PT` gives `pt-BR`, `en-GB` gives `en-US`). No match keeps English. Anyone with saved settings is unaffected, and the buttons still work as before; whatever is picked is remembered. The sideways-scrolling language bar now also scrolls the active language into view on open (16 languages no longer fit on screen).

Not done: suggesting a switch when the transcript looks like a different language (browser language-detector support is patchy), and server-side auto-detection (needs a cloud service, against the no-account, on-device design).

**Verification:** inline script passes `node --check`; matching logic checked against sample language lists; not run in a browser.

---

## v1.6

sw `speaknote-v1-6`; **notes are now saved, plus the improvements agreed after the v1.5 review.** User asked for "all" of them.

**Correction to v1.5:** its entry and the on-screen refresh said notes were kept across a refresh. They were not: only the language setting was saved and the notes lived in memory, so the new tap-to-refresh (or any reload) wiped them. Fixed below.

- **Notes saved on the device:** voice and typed notes are written to localStorage (`speaknote_entries`, try/catch with a one-time warning toast) on add, edit, undo, delete and clear, and restored on open (validated, at most 200, newest first). System messages are not saved. Restored editable notes no longer grab focus. Because data is now persistent, "Clear all" asks for confirmation.
- **Honest privacy wording:** the app, its meta descriptions and the install banner no longer imply offline/local recognition. An empty-state note says notes stay on the device while speech recognition is done by the browser's service (Google on Chrome, Microsoft on Edge, Apple on Safari), so audio is sent there and a connection is needed. The hub blurbs were reworded too (dailyapp v1.13; the happybein-astro initiatives and FR/ES/NL texts, which are not versioned).
- **Per-note actions:** each voice/typed note has a copy and a delete button.
- **Share:** a Share button (system share sheet) appears only where `navigator.share` exists.
- **Languages:** added Russian, Turkish, Polish, Swedish, Hindi and Arabic (16 total).
- **Tidy-up:** `APP_VERSION` (now `1.6`) is written into the header badge at startup (the static HTML text and `<title>` are fallbacks); the old `1.3.2` constant and "v1.3" comment are gone. The Debug button left the main row: long-press the status pill (~0.7 s) or open the page with `?debug`.

**Verification:** inline script passes `node --check`; not run in a browser or on a device. Worth testing: record or type notes, reload, and confirm they come back; delete one; clear all; the long-press debug panel; Share on a phone.

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

