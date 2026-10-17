# RFD Codex Handoff

Last checked: 2026-10-17

## Current Goal

Keep the Red Flag Dating repo easy to resume without mistaking old experiments for the active path.
**2026-10-04 Milestone:** The previous Visual Novel style Anthology prototype (`pages/anthology.html`) and Chloe branch have been frozen and tagged as `archive-v0.8-vn-anthology`. The project is pivoting from linear dialogue scriptwriting toward an Emergent Narrative Simulator (inspired by RimWorld, CK3, Sultan's Game, and Free Cities: state machines, card-based demand/response pressure, and minimalist action logs leaving room for player imagination).

## Minimal Startup Reads

Use this file as the short router. Do not load the whole Obsidian project by default.

At the start of a Codex session:

1. Read this handoff.
2. Refresh git state with the commands below.
3. Read only the latest entry in `開發日誌 DEVLOG.md`, unless the user asks for history or recovery.
4. Read `RFD 現況總覽 v1.2.md` only when the task touches design direction, specs, document routing, or project status.
5. Open deeper notes only when the task calls for them.

Task-based routing:

- Content / story / action log / card copy: read `RFD 文風與倫理守則 v0.1.md`, `rfd-voice` skill, and relevant character cards.
- System / rules / resources / events: start with `RFD 全面系統圖 v0.1.canvas`、`RFD 湧現式故事沙盒機制心智圖 v0.1.canvas` 與 `四大啟發遊戲機制拆解與 RFD 映射備忘錄 v1.0.md`。
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
Collaboration mode is visual-first and state-driven: use `RFD 全面系統圖 v0.1.canvas` and `RFD 湧現式故事沙盒機制心智圖 v0.1.canvas` as the system whiteboards to define character intimacy scripts, demand cards vs. player hand cards, action-log templates, mental break states, and roguelike inheritance.

## Current Repo State

- Working directory: `C:\AI\red-flags-game`
- Main baseline: `main`
- Tag: `archive-v0.8-vn-anthology` points to commit `7ce2eaf`
- Status: old prototypes frozen; new Emergent Story Simulator prototype not yet built in repo

Always refresh with:

```powershell
git -c safe.directory=C:/AI/red-flags-game status --short --branch
git -c safe.directory=C:/AI/red-flags-game branch --show-current
```

## Active Entry Points

- `index.html` - city-pop / red-thread opening overlay and main entry menu
- `pages/anthology.html` - (Archived Prototype) visual novel anthology with Daniel/Julian/Sebastian
- `pages/chloe.html` - (Archived Prototype) Chloe side experiment

## Current Design Baseline (2026-10 Sandbox Pivot)

- Overview: `C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\RFD 現況總覽 v1.2.md`
- Visual system maps:
  - `規格系統\RFD 全面系統圖 v0.1.canvas`
  - `規格系統\RFD 湧現式故事沙盒機制心智圖 v0.1.canvas`
- Master engine reference: `規格系統\四大啟發遊戲機制拆解與 RFD 映射備忘錄 v1.0.md`
- 5-Layer Sandbox Architecture:
  1. **輸入層（Input）**：玩家人格／雙面刃資源／先天與後天特質（CK3）／行為觸發怪癖（Free Cities） × 掠食者 4 階段親密腳本（偽裝期 → 試探期 → 孤立期 → 反撲）。
  2. **壓力層（Pressure）**：《蘇丹的遊戲》式卡牌博弈——掠食者打出具時效與代價的「要求卡」，玩家投入雙面刃生活手牌（金錢、時間、人際支援、自尊）來滿足、折斷或退讓。
  3. **呈現層（Presentation）**：《RimWorld》式客觀行為日誌（Action Log）留白，拒絕寫死長篇劇本對白與作者說教，給骨架由玩家腦補。
  4. **危機層（Crisis）**：壓力過載觸發玩家 3 種崩潰臨界態（Mental Break）與應激怪癖。
  5. **結算層（Resolution）**：Roguelike 輪迴（一輪＝一段關係，分手即結算），正向繼承「識人之眼悟性」，負向繼承「傷痕特質 Scars」。
- Visual philosophy: city-pop is the `FATE` layer's East Asian urban romance / hope surface, not generic retro decoration; `PATTERN` and `BOUND` should emerge by making the same language decay or tighten, not by switching to unrelated styles.

## Verified Status (2026-10)

- `RFD 湧現式故事沙盒機制心智圖 v0.1.canvas` and `四大啟發遊戲機制拆解與 RFD 映射備忘錄 v1.0.md` are completed and validated.
- `rfd-voice` skill has been updated with `action-log mode` and `card-demand-hand mode` to support the sandbox narrative style alongside legacy chat/UI modes.
- Old VN anthology (`pages/anthology.html`) and Chloe (`pages/chloe.html`) remain playable as frozen prototypes; do not expand their dialogue trees or old SA roll formulas unless explicitly asked.

## Known Risks

- Obsidian DEVLOG and production-thought logs are external to the repo; read only the newest entry by default and update them after meaningful repo, design, or workflow changes.
- The codebase (`C:\AI\red-flags-game`) has not yet created the new sandbox prototype page/engine; avoid over-engineering full system tables before validating a minimal playable loop (1 partner script × a small hand of life cards × action log output).
- Support representation, exact card stats, and mental-break thresholds should be co-designed visually with Ren before writing large data files.

## Next Safest Task

Define the Minimal Viable Loop (MVL) for the Emergent Story Simulator: either sketch the sandbox UI layout (Action Log + Demand/Resource Cards) or draft a 1-character test deck (e.g. Julian or Sebastian's 4-stage intimacy script + 5–8 Action Log templates) to test the feel of the new format.
