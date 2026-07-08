# CLAUDE.md — Red Flags Game

每次開始工作前請先讀這份文件。

## Context Loading / 讀取策略

Codex / Claude 不需要每次把整個 TOE 企劃資料夾都讀進來。新對話先用 `CODEX_HANDOFF.md` 當短版路由器：確認目前入口、git 狀態、最新開發日誌，以及本次任務該追哪一類文件。

預設只讀：
- 本檔
- `CODEX_HANDOFF.md`
- `開發日誌 DEVLOG.md` 最新一條

只有在任務需要時才追讀：
- `RFD 現況總覽 v1.1.md`：設計方向、文件整理、專案狀態
- 視覺文件：UI、片頭、motion、city-pop 風格判斷
- 系統規格：SA、壓力、資源、選集機制
- 創作理念／製作想法日誌：核心立場、文風、倫理、敏感題材

## ⚠️ 開場必做

每次新對話開始，**依序做以下三件事**：

**第一步：讀開發日誌**，然後報告進度：

> 「📋 我已讀取開發日誌。上次進度：[最後一條記錄的日期與摘要]。」

**第二步：以遊戲開發 PM 的角度，給一條不著痕跡的進度建議。**
根據開發日誌中懸而未決的問題、或最久沒動的區塊，用一句話輕輕點出：

> 「💡 **PM 觀察：** [根據日誌現況給出的具體建議，例如：某個待決定的設計拖太久了、某個區塊可以趁熱推進]」

**第三步：顯示工作選單**，讓用戶選擇今天要用哪種方式推進 RFD。
選單是給 Ren 的低負擔入口；AI 背後可用一人 indie game team 的職位視角切換狀態（編劇、系統設計、美術 / UI、工程、PM / 製作人、行銷測試），但不要把整排職稱丟給 Ren 選。

```
今天想怎麼推進 RFD？

1. 做內容
   寫故事、改對白、角色互動、結局、中文文風

2. 做系統
   沙盒角色、親密腳本、關係成因鏈、SA / 玩家選擇規則

3. 做視覺
   UI、片頭、選單、profile card、宣傳影片感

4. 做技術 / 發布
   HTML / CSS / JS、英文版同步、bug、GitHub Pages / playtest

5. 做整理 / 決策
   下一步、企劃文件、製作想法日誌、成果收斂

6. 其他
   直接說
```

**第四步：用戶選完後，問一句「想做什麼？」**，根據回答判斷是否建議切換模型。

建議切換至 **Opus** 的條件（符合任一即建議）：
- 涉及核心設計決策（SA 系統、結局架構、角色心理設計）
- 涉及敏感題材的劇情設計（家暴、自殺、性暴力相關）
- 問題需要深度推理或比較多種設計方向

其他情況（小改動、查資料、更新日誌）保持 Sonnet，不建議切換。

建議格式：
> 💡 這個討論可能需要比較深的推理，建議切換到 **Opus**。你目前用的是 Sonnet。要切換的話重開對話選模型，還是直接繼續？

這樣用戶就知道你有記憶銜接，不需要重新解釋背景。

---

## 專案說明

這是一個互動故事遊戲，網頁形式（HTML + CSS + JS）。
作者是動畫師，不是程式設計師，請以非技術性語言溝通。

**目前有兩條線（以企劃資料夾 `RFD 現況總覽 v1.1.md` 為準；可再參照《專案定位說明 v1.0》）：**
- **主線＝諷刺選集**——第一人稱滑卡約會，配對池裡有人類掠食者原型也有正常人，玩家自己分辨。**開發中。**
- **Chloe 篇＝旁觀者零回饋實驗，已收尾、定為分支**，現階段不主動開發。

**目錄結構（2026-06-21 整理）：根目錄只留一個 `index.html`，其餘頁面收進 `pages/`。**
子頁的 css/js 路徑都用 `../`（如 `../css/style.css`、`../js/engine.js`）。

**入口：**
- `index.html` — **根目錄唯一的 HTML**，入口選單頁（目前公開入口只連到選集／Chloe）

**主要檔案 — 諷刺選集（主線）：**
- `pages/anthology.html` — 選集入口頁
- `css/anthology.css` — 選集樣式（疊在 `css/style.css` 上）
- `js/anthology/player-archetypes.js` — 玩家起始人生／資源資料
- `js/anthology/engine.js` — 選集引擎（池子即選單、傷痕特質、識人之眼）
- `js/anthology/sebastian.js`、`daniel.js`、`julian.js` — 各篇內容（EP1 愛情騙子、EP2 正常人、EP3 自戀型）

**已退役試驗場：**
- Julian 的主線試點頁與試點引擎已完成任務，主要機制已併回 `pages/anthology.html` / `js/anthology/engine.js`。
- 之後如果在舊討論或舊 commit 看到 `julian-pilot`、`pilot-engine`、`pilot-characters`，把它們視為歷史脈絡，不要再當成現役入口或維護對象。

**主要檔案 — Chloe 篇（分支）：**
- `pages/chloe.html` — Chloe 主頁面（原 index.html，2026-06-17 改名）
- `css/style.css` — 共用視覺樣式
- `js/engine.js` — Chloe 引擎（SA 系統、結局、渲染）
- `js/stories/chloe.js` — Chloe 故事內容
- `js/cases.js` — 結局頁面的參考案例資料庫

**新增角色（將來自己擴充用）：**
- 設定卡模板：企劃資料夾的《選集 角色設定卡 模板 v1》（作者填純文字）
- 轉檔指南：`docs/新增角色-轉檔指南.md`（給 AI：照設定卡產出角色檔並完成註冊）

---

## 開發日誌（必讀）

每次做完任何修改，**一定要更新開發日誌**：

```
C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\開發日誌 DEVLOG.md
```

記錄格式：
- 日期
- 做了什麼
- 為什麼這樣做（設計決策）
- 對應的 git commit hash

---

## 目前設計決策（重要）

**主線選集（目前實作）**
- 玩家先選一種人生／起始資源，再進同一個配對池。
- `資源 → 壓力反應 → 傷痕特質 → 下一篇選擇感` 會跨篇持續，不是單篇重置。
- 有 `lens` 的篇目前會顯示角色條與可見壓力條；角色條內含「識人之眼」與「說出口 SA」。
- `說出口 SA` 是主線裡「自信＋邊界感」的合成讀數，用來決定某些抵抗型選項的勝算。
- 壓力過線後會先演出爆發，再把內在資源往下削，影響後續篇章。

**Chloe 篇（已收尾分支）**
- SA（自我察覺）是 Chloe 看見自己的能力，0–100。
- 遊戲進行中不顯示 SA 數值或任何即時回饋。
- 只在結局畫面揭露（側欄 `.timeline.revealed`）。
- 側欄設計理念是「事後的回頭看」，不是即時追蹤器。

**語言**
- 全介面繁體中文
- 角色名稱（Chloe、Connor）保留英文

---

## 企劃文件位置

```
C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\
```

目前現況基準：企劃資料夾的 `RFD 現況總覽 v1.1.md`。

注意：`Red Flags Dating 遊戲企劃 v0.50.md` 已移入 `archieve/`，是遠期願景／靈感庫，不是目前主規格。現行規格與文件地圖以 `RFD 現況總覽 v1.1.md` 為準。

## Video / Brag Workflow（Hyperframes）

Ren 要做 RFD 的 launch video、trailer、promo clip、`/brag` 風格短片，或提到 Hyperframes 時，優先使用 Hyperframes workflow。

**安全規則：**
- 不要直接讓 Hyperframes 或任何外部影片工具掃描整個 Obsidian vault、Ren vault、或含私密資料的資料夾。
- 先建立乾淨的 public demo sandbox，只放影片需要的公開遊戲檔、素材、文案。
- 不要放入私密企劃筆記、聊天紀錄、健康 / 財務資料、API key、`.env`、未公開敏感內容。

**標準流程：**
1. 先寫 `brag-plan.md`：影片角度、分鏡、必要文案、節奏。
2. 再寫 `composition-brief.md`：給 Hyperframes 的明確素材與構圖要求。
3. 用 Hyperframes 建 HTML composition。
4. 依序跑 `npx hyperframes lint`、`npx hyperframes preview`、確認後再 `npx hyperframes render`。
5. 若環境缺 FFmpeg / Node / Chrome，先回報阻礙，不要硬裝到私密專案裡。

**目前環境備註（2026-06-24）：**
- 已安裝 Hyperframes skills，正本在 `C:\Users\suffi\.agents\bullpen\`，Claude / Codex / project `.agents\skills` 以 junction 指向正本。
- 系統 Node.js LTS 為 v24.18.0；Hyperframes CLI 可用：`npx hyperframes --version` → 0.7.4。
- FFmpeg 8.1.1 已由 winget 安裝，`npx hyperframes doctor` 顯示 Node / FFmpeg / FFprobe / Chrome 通過。
- Docker 與 whisper-cpp 未裝，屬選配；不影響一般本地 preview / render。

---

## Browser / Playtest Workflow

Ren 要 Codex / Claude Code 測 RFD 頁面、像玩家一樣走分支、亂點、截圖、檢查 UI 或回報互動問題時，優先考慮 `agent-browser`。

**工具選擇：**
- `agent-browser`：用於探索式 playtest。適合原型階段快速打開本機 RFD、點選項、走分支、截圖、檢查畫面與互動是否壞掉。
- Playwright / Playwright MCP：用於穩定後的正式回歸測試。適合把固定路線寫成可重複測試，例如每次改版都自動確認某條流程能到結局。
- 一般瀏覽器 / 手動檢查：用於單次視覺確認、localhost 是否啟動、或工具尚未安裝時的低成本檢查。

**安全規則：**
- 不要讓 browser automation 工具掃描 Obsidian vault、Ren vault、私人登入頁、API key、`.env`、健康 / 財務資料或未公開敏感內容。
- 測 RFD 時只開本機遊戲頁、公開 demo、GitHub Pages、itch.io playtest 或乾淨 sandbox。
- 安裝或啟用新瀏覽器工具前，先向 Ren 說明用途與風險；不要把工具直接加進專案依賴，除非 Ren 明確同意。

---

## 合作行為規則（重要）

這些是作者明確要求的工作方式，每次都要遵守：

1. **先說明，再動手** — 任何修改前，先用白話說明打算改什麼、為什麼，等確認再動
2. **設計討論不要急** — 遇到設計問題，先深思熟慮，不要給第一個想到的答案；作者說「你再想想」代表答案不夠深
3. **選項最多三個** — 提供方案時不超過三選一，每個都要說清楚取捨
4. **敏感主題放慢** — 這個遊戲涉及家暴、自殺、性暴力；討論這些議題時放慢節奏，不要輕描淡寫
5. **不自動 commit** — 除非作者明確說「存起來」或「commit」，否則不主動建立 git commit
6. **每次對話結束前更新日誌** — 有任何設計討論或程式修改，都要記錄進開發日誌與製作想法日誌

---

## 製作想法日誌（設計理念）

```
C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\製作想法日誌.md
```

記錄重要設計理念、被否決的方向、哲學立場。
與開發日誌不同——開發日誌記錄「做了什麼」，製作想法日誌記錄「為什麼這樣想」。

---

## Git 工作方式

不要信任文件裡的舊 worktree / 分支名稱；每次開始前先用下面指令確認目前實際狀態：

```powershell
git -c safe.directory=C:/AI/red-flags-game status --short --branch
git -c safe.directory=C:/AI/red-flags-game branch --show-current
```

目前主要開發目標仍以 `main` 為基準；歷史 worktree / 分支如 `claude/sweet-cray`、`claude/anthology-mvp`、`Codex/sweet-cray` 只當作上下文線索，不要直接當成當前工作區。

每次 commit 前確認有更新開發日誌。
