# CLAUDE.md — Red Flags Game

每次開始工作前請先讀這份文件。

## ⚠️ 開場必做

每次新對話開始，**第一件事**是讀開發日誌，然後主動告訴用戶：

> 「📋 我已讀取開發日誌。上次進度：[最後一條記錄的日期與摘要]。可以繼續了。」

這樣用戶就知道你有記憶銜接，不需要重新解釋背景。

---

## 專案說明

這是一個互動故事遊戲，網頁形式（HTML + CSS + JS）。
作者是動畫師，不是程式設計師，請以非技術性語言溝通。

**主要檔案：**
- `index.html` — 遊戲主頁面
- `css/style.css` — 視覺樣式
- `js/engine.js` — 遊戲引擎邏輯（SA 系統、結局、渲染）
- `js/stories/hannah.js` — Hannah 的故事內容（對話、選項、結局）
- `js/cases.js` — 結局頁面的參考案例資料庫

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

**SA 系統**
- SA（自我察覺）是 Hannah 看見自己的能力，0–100
- 遊戲進行中**不顯示** SA 數值或任何回饋
- 只在結局畫面揭露（側欄 `.timeline.revealed`）
- SA delta toast（閃現提示）目前狀態：**待決定是否移除**

**側欄設計**
- 遊戲中隱藏（`.timeline` 預設 `display:none`）
- 結局時才顯示（加上 `.revealed` class）
- 設計理念：側欄是「事後的回頭看」，不是即時追蹤器

**語言**
- 全介面繁體中文
- 角色名稱（Hannah、Marcus）保留英文

---

## 企劃文件位置

```
C:\Users\suffi\OneDrive\Apps\remotely-save\TOE\Project - Red Flag Dating\
```

最新版企劃：`Red Flags Dating 遊戲企劃 v0.50.md`

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

目前在 worktree：`C:\AI\red-flags-game\.claude\worktrees\sweet-cray`
分支：`claude/sweet-cray`
主分支：`main`

每次 commit 前確認有更新開發日誌。
