# RFD Codex Handoff

Last checked: 2026-10-04

## Current Goal

Keep the Red Flag Dating repo easy to resume without mistaking old experiments for the active path.
**2026-10-04 Milestone:** The previous Visual Novel style Anthology prototype (`pages/anthology.html`) and Chloe branch have been frozen and tagged as `archive-v0.8-vn-anthology`. The project is pivoting from linear dialogue scriptwriting toward an Emergent Narrative Simulator (inspired by RimWorld, CK3, and Free Cities: state machines, weighted event decks, and minimalist action logs leaving room for player imagination).

## Minimal Startup Reads

Use this file as the short router. Do not load the whole Obsidian project by default.

At the start of a Codex session:

1. Read this handoff.
2. Refresh git state with the commands below.
3. Read only the latest entry in `開發日誌 DEVLOG.md`, unless the user asks for history or recovery.
4. Read `RFD 現況總覽 v1.2.md` only when the task touches design direction, specs, document routing, or project status.
5. Open deeper notes only when the task calls for them.

Task-based routing:

- Content / story / dialogue: read `RFD 文風與倫理守則 v0.1.md`, relevant character cards, and branch maps.
- System / rules / resources / events: start with `RFD 全面系統圖 v0.1.canvas` and `界線事件與角色反應系統 v0.1.md`.
- Visual / UI / opening / motion: read `RFD 視覺方向 v0.1.md`; read `RFD city pop 與東亞都市情感記憶備忘錄 v0.1.md` only when judging style philosophy, not for every CSS tweak.
- Technical / release / playtest: stay mostly in repo files, then update the external devlog when done.
- Cleanup / planning: read `RFD 現況總覽 v1.2.md` and only the directly relevant folder map entries.

## Web / GitHub / Drive Handoff Rule

- GitHub is the code and repo-document handoff source. After important code changes, commit and push only with Ren's authorization, then verify the remote contains the intended current state.
- Google Drive `RFD Active` is the planning and log source used by the ChatGPT web Project. When the overview, DEVLOG, production-thought log, system specs, or visual plans change materially, update the matching Drive copy.
- If either sync cannot be completed in the current session, explicitly list the pending source and files before ending the reply.

## Current Phase

Transition from Visual Novel Anthology to Emergent Story Simulator.

The existing anthology in `pages/anthology.html` and Chloe in `pages/chloe.html` are preserved as frozen reference prototypes (tagged `archive-v0.8-vn-anthology`). `playtest-en/` has been removed.
Collaboration mode is visual-first and state-driven: use `RFD 全面系統圖 v0.1.canvas` as the system whiteboard to define character scripts, weighted event decks, boundary reactions, and resource erosion.

## Current Repo State

- Working directory: `C:\AI\red-flags-game`
- Main baseline: `main`
- Tag: `archive-v0.8-vn-anthology` points to commit `7ce2eaf`
- Uncommitted change: deleted `playtest-en/`

Always refresh with:

```powershell
git -c safe.directory=C:/AI/red-flags-game status --short --branch
git -c safe.directory=C:/AI/red-flags-game branch --show-current
```

## Active Entry Points

- `index.html` - city-pop / red-thread opening overlay and main entry menu
- `pages/anthology.html` - (Archived Prototype) visual novel anthology with Daniel/Julian/Sebastian
- `pages/chloe.html` - (Archived Prototype) Chloe side experiment

## Current Design Baseline

- North Star: `C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\RFD 現況總覽 v1.2.md`
- Visual system map: `C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\規格系統\RFD 全面系統圖 v0.1.canvas`
- Next design authority: `規格系統\界線事件與角色反應系統 v0.1.md`; core draft rule is player intent always executes, while pushback is where conditions affect cost, steps, support, and external outcomes
- Current anthology implementation still uses visible SA / pressure on most `lens` choices and persists resources, traits, and insight across the pool. Only the Daniel / Julian awkward-joke choice marked `alwaysSpeak` currently implements "player intent always executes"; do not describe the wider redesign as already implemented.
- `四大資源系統 v0.6.md` and older attribute notes are reference material, not current authority. Their double-edged-resource principle may be selectively carried forward, but the old formulas are not automatically restored.
- Old `Red Flags Dating 遊戲企劃 v0.50.md` is archived inspiration, not the active spec
- Visual philosophy: city-pop is the `FATE` layer's East Asian urban romance / hope surface, not generic retro decoration; `PATTERN` and `BOUND` should emerge by making the same language decay or tighten, not by switching to unrelated styles.

## Verified This Session

- The 2026-07-30 Daniel / Julian scene slice has immediate reactions, after-date messages, later echoes, and per-episode memories, but it is not yet a generalized event deck.
- Browser playtest on 2026-07-31 confirmed that the old 48% SA roll could silently rewrite the selected "I do not like that joke" intent. The two slice choices now use `alwaysSpeak`, keep stress unchanged, and still preserve character-specific replies and later echoes.
- Anthology message playback now trims the longest typing / reading waits by about 25% and exposes `顯示全部 ↓` while a sequence is playing. Browser regression confirmed it works across beat openings, replies, chained followups, and later-memory echoes without duplicate or missing messages.
- The player-response tray now enters with a restrained 220ms fade / 8px rise instead of appearing as a hard cut. `prefers-reduced-motion` removes the transition; browser verification confirmed the reduced-motion fallback still reveals all choices normally.
- The `alwaysSpeak` change is deliberately local: older expressive choices still show and resolve their existing SA odds.
- `RFD 全面系統圖 v0.1.canvas` is the shared visual whiteboard for player resources, double-edged effects, character scripts, weighted events, interaction memory, leaving, and endings.
- External DEVLOG and production-thought logs were split on 2026-07-31; current files keep recent entries, while `archieve/日誌/` is only for historical recovery.

## Known Risks

- Obsidian DEVLOG and production-thought logs are external to the repo; read only the newest entry by default and update them after meaningful repo, design, or workflow changes.
- The first awkward-joke slice passed an automated player-path browser regression, but still needs Ren's own feel check for wording, default pacing, and whether Daniel's quieter positive echo is noticeable beside the next story clue.
- The city-pop opening is visually ahead of the rest of the UI; the next visual pass should decide whether to extend or simplify that language.
- The English playtest snapshot may not match the latest anthology mechanics.
- Some older external notes may still describe the retired Julian pilot or Chloe-only SA rules as if they were the current main line.
- Support representation, pressure representation, event weighting, and the final replacement for overlapping attributes are still open design questions. Do not invent formulas or rewrite the engine before Ren confirms them on the visual map.
- The remaining legacy SA panel uses a roll-under rule (`roll < chance`), so a visible result such as `22` succeeds against `48%`. The math is correct but the raw number is not self-explanatory; decide whether to hide it or relabel the success range before treating this UI as final.

## Next Safest Task

Have Ren manually replay the Daniel / Julian awkward-joke slice with both natural playback and `顯示全部 ↓`, paying attention to the new response-tray entrance. Then decide the presentation of the remaining legacy roll-under result; do not expand `alwaysSpeak` across the old SA engine until the wider rule is confirmed visually.
