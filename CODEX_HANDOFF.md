# RFD Codex Handoff

Last checked: 2026-06-30

## Current Goal

Keep the Red Flag Dating repo easy to resume without mistaking old experiments for the active path.

## Minimal Startup Reads

Use this file as the short router. Do not load the whole Obsidian project by default.

At the start of a Codex session:

1. Read this handoff.
2. Refresh git state with the commands below.
3. Read only the latest entry in `開發日誌 DEVLOG.md`, unless the user asks for history or recovery.
4. Read `RFD 現況總覽 v1.1.md` only when the task touches design direction, specs, document routing, or project status.
5. Open deeper notes only when the task calls for them.

Task-based routing:

- Content / story / dialogue: read `RFD 文風與倫理守則 v0.1.md`, relevant character cards, and branch maps.
- System / rules / SA / pressure: read `主線系統 — 對話執行 × 壓力 × SA v0.1.md` and `選集 屬性判定系統 v0.1.md`.
- Visual / UI / opening / motion: read `RFD 視覺方向 v0.1.md`; read `RFD city pop 與東亞都市情感記憶備忘錄 v0.1.md` only when judging style philosophy, not for every CSS tweak.
- Technical / release / playtest: stay mostly in repo files, then update the external devlog when done. For build, publishing, copy protection, analytics, or questionnaire planning, read `RFD 技術發布與玩家數據待討論備忘錄 v0.1.md`; it is not a finalized roadmap.
- Cleanup / planning: read `RFD 現況總覽 v1.1.md` and only the directly relevant folder map entries.

## Current Phase

Development / polish on the anthology main line.

The playable main line is the first-person anthology in `pages/anthology.html`. Chloe is a finished side experiment in `pages/chloe.html`. The old Julian pilot has been retired after its mechanics were merged into the anthology line.

## Current Repo State

- Working directory: `C:\AI\red-flags-game`
- Main baseline: `main`
- Last observed git state: `main...origin/main [ahead 1]`
- Existing uncommitted repo-doc changes: `AGENTS.md`, `CLAUDE.md`
- Existing untracked local files: `.claude/settings.local.json`, `CODEX_HANDOFF.md`

Always refresh with:

```powershell
git -c safe.directory=C:/AI/red-flags-game status --short --branch
git -c safe.directory=C:/AI/red-flags-game branch --show-current
```

## Active Entry Points

- `index.html` - city-pop / red-thread opening overlay and main entry menu
- `pages/anthology.html` - active main-line anthology
- `pages/chloe.html` - Chloe side experiment
- `playtest-en/index.html` - isolated English playtest snapshot, may lag behind main line

## Current Design Baseline

- North Star: `C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\RFD 現況總覽 v1.1.md`
- Current spec direction: main line anthology plus Chloe side experiment, with archived system blocks revived only under the newer "resources = choices" philosophy
- Current anthology implementation shows visible role / pressure UI on `lens` episodes and persists resources, traits, and insight across the whole pool
- Old `Red Flags Dating 遊戲企劃 v0.50.md` is archived inspiration, not the active spec
- Visual philosophy: city-pop is the `FATE` layer's East Asian urban romance / hope surface, not generic retro decoration; `PATTERN` and `BOUND` should emerge by making the same language decay or tighten, not by switching to unrelated styles.

## Verified This Session

- `node --check` passed for the main JavaScript files in the previous status pass
- Local HTML references passed in the previous status pass
- This cleanup updated repo-facing instructions so future agents verify branch state instead of trusting stale worktree notes
- Context loading has been trimmed: use this file to route into larger notes instead of reading every memo up front

## Known Risks

- Obsidian DEVLOG and production-thought logs are external to the repo; update them after meaningful repo, design, or workflow changes.
- The city-pop opening is visually ahead of the rest of the UI; the next visual pass should decide whether to extend or simplify that language.
- The English playtest snapshot may not match the latest anthology mechanics.
- Some older external notes may still describe the retired Julian pilot or Chloe-only SA rules as if they were the current main line.

## Next Safest Task

Run a manual or browser playtest pass through `pages/anthology.html` and confirm the current visible SA / pressure presentation is the intended main-line spec.
