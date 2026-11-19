# speaknote — Changelog

Moved out of the repo-wide `CLAUDE.md` on 2026-09-25 to keep that file focused on rules rather than history. Entries below are transcribed verbatim (substance unchanged) from what was previously in `CLAUDE.md`'s per-version table for this app; only pure markdown table syntax (the row-closing ` |`) was stripped. Newest version first.

---


## v1.10

**Live text while speaking** (owner, 2026-11-19: "how can the voice recording be made work best?" → proposal → "go").
- Recognition now asks for interim results (`interimResults: true`, was false). While you speak, the words appear in grey
  italics in a dashed box under "Session notes", with a pulsing dot; when the sentence is final it becomes a normal
  note and the box empties. The box hides on stop, on errors and when a session restarts. New notes go below it.
- Guard against repeated finals (Chrome on Android can report the same final again with interim results on): each
  final result index is handled once per session, and a final identical to the previous one within 3 s is skipped.
- **Compact notes list** (owner, same day, with a phone screenshot: "also make the recording history more compact, to
  avoid scrolling"): each note is one row, text first, then the time as hours:minutes (full time on hover) and the copy
  and delete buttons on the right; the VOICE/NOTE badges are gone (the green or yellow left edge still shows which is
  which). System messages ("Microphone active", "Stopped") are one small grey line without a card. Measured at 412 px:
  a one-line note is 40 px (was about 95), a system line 17 px (was about 75). Typed notes use 16 px so iPhones don't zoom.
- "Stop recording" stays on one line on phones (smaller letter spacing below 440 px); it wrapped onto two lines.
- **Record button and language at the bottom** (owner, same day: "also put the recording button and language selector bar
  at the bottom"): both sit in a fixed bar at the bottom of the screen (safe-area aware), within thumb reach; the
  language menu opens upwards. Note, Undo, Copy, Share and Export stay at the top. The page has bottom padding so the
  last note is never hidden. The install banner now appears above the bar, and is fully hidden (no invisible layer
  catching taps) when not shown.
- Header: below 400 px "All apps" shows only the ⊞ icon, because the wider LISTENING badge pushed it off a 360 px
  screen (also true in v1.9 while recording).
- Tested in Chromium at 360 px with a simulated speech service: interim text shows, the final becomes one note, a
  repeated final is not added twice, the next interim and final work, the box hides on stop; v1.9 checks (greyed
  buttons, language menu) still pass; no errors. Real speech can only be tried on a phone. sw `speaknote-v1-10`.

## v1.9

**"Calm Pass" tweaks** (owner, 2026-11-19, four points to match the rest of the apps):
1. **Font:** the empty-state line and the privacy text use DM Sans (the app's sans-serif) instead of DM Mono.
2. **Disabled buttons:** Copy, Share and Export are greyed out (opacity .35, not clickable) until there is a voice or typed
   note with text; `refreshActions()` runs with every entry change and on typing in a note. Note and Undo stay active.
3. **Privacy text:** 11px, muted grey at lower opacity, narrower, so it no longer dominates the empty screen.
4. **All apps:** the floating button that covered the bottom right corner is now a small pill in the header, next to the
   Idle badge. Header padding slightly tighter below 380px so everything fits on a 360px phone.
5. **Language button** (owner, same day: "the language bar would better turn into a logo button"): the scrolling row of
   16 language chips is gone. A button left of Start Recording shows the current flag and code ("🇺🇸 EN ▾"); tapping it
   opens a 4 × 4 menu of the same chips. It closes on a pick, a tap outside or Escape, and shows the saved language after
   a reload. Saves a full row at the top of the screen.
- Fix: `APP_VERSION` was still '1.7', so v1.8 showed "v1.7" in the header (the script overwrites the badge). Now 1.9.
- Tested in Chromium at 360px: buttons off on the empty screen and with an empty typed note, on once it has text; All
  apps inside the header; no errors. sw `speaknote-v1-9`.

## v1.8

**Cloudflare visit counter** (owner, 2026-10-29: count every app on happybein.com/admin/stats/). The shared `yv-internal` snippet (`_shared/internal.js`, rolled out by `_shared/apply-internal.py`) is inlined before `</head>`: it loads Cloudflare Web Analytics with the yeahvibe.com site token (cookieless, nothing stored on the device, so no consent needed), except on browsers carrying the owner's `?internal` mark (cookie `yv_internal=1` on .yeahvibe.com), which show a small teal dot under the version number instead. Visits now appear under this app's own address in the stats. Service-worker cache bumped.

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

