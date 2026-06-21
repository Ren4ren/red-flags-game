// ── 主線試點引擎（Slice 1）──
// 在現有 Julian 篇上 retrofit 主線系統的第一個動詞：「看見」。
// 玩家先選三個角色之一（富家女／普通／單親媽媽）→ 角色的「觀察力」決定起始識人之眼
// → 同一個 Julian，高觀察力的人看得到一堆戳破他的選項，低觀察力的人幾乎全瞎。
// 這支引擎是現有 js/anthology/engine.js 的試點分身，完全不動 Sebastian／Daniel／選集本體。

const EP = EP_JULIAN; // 試點只跑 Julian 一篇

// ── 測試模式（只在試點檔；正式版不會有）──
// instant：關掉打字/擲骰延遲，瞬間出現；force：強制擲骰結果。
const DEBUG = { instant: false, force: 'random' };

// ── 特質定義（沿用選集；試點單篇、起始無傷痕，trait 線多半不出現）──
const TRAITS = {
  seeThrough: { name: '看穿包裝', cls: 'good' },
  silent:     { name: '不敢開口', cls: 'scar' },
  guarded:    { name: '防衛心',   cls: 'edge' },
  jumpy:      { name: '草木皆兵', cls: 'scar' },
  trust:      { name: '重新學會信任', cls: 'good' },
  spoken:     { name: '說得出口', cls: 'good' },
  selfdoubt:  { name: '我是不是想太多', cls: 'scar' },
  holdfast:   { name: '守得住自己', cls: 'good' },
};

// 識人之眼：不顯示數字，只顯示階。
function insightTier(n) {
  if (n >= 6) return { name: '老練', cls: 'good', desc: '你幾乎一眼就讀得出不對勁。' };
  if (n >= 3) return { name: '識人', cls: 'good', desc: '那些不對勁的小地方，你開始看得見了。' };
  if (n >= 1) return { name: '留心', cls: '',     desc: '你比以前多看了一眼。' };
  return            { name: '天真', cls: '',      desc: '你還願意相信大部分人說的話。' };
}

// ── 對話執行（說出口）：SA → 勝算（模式 A・事前透明）──
// 常數集中一處方便調參（規格 §5.2 / §8）。SA 三人相近（27–33）是故意的：
// 「說出口」對誰都不容易；角色差異主要在「看見」與之後的「代價」。
const ODDS_BASE = 48;   // SA=30 時的基準勝算
const ODDS_K = 1.6;     // SA 每偏離 30 一點，勝算的增減
const ODDS_MIN = 25, ODDS_MAX = 88;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function computeSA() { return Math.round((chosen.resources.自信 + chosen.resources.邊界感) / 2); } // SA 合成讀數
function expressiveChance() { return clamp(Math.round(ODDS_BASE + (computeSA() - 30) * ODDS_K), ODDS_MIN, ODDS_MAX); }

// 哪些選項要擲骰（抵抗型・說出口）：用選項的 flag 辨識（不動 julian.js 本體）。
// 「離開」永遠成功（離開鍵按得下去）、「妥協」不用擲；只有「頂回去／護界線」要擲。
// 失敗＝話到嘴邊縮回去、吞下去 → 走「妥協」那條（failReply 沿用妥協分支的內容）。
const DICE = {
  frame: {
    failInner: '「成熟的人不會逃避」⋯⋯\n反駁的話在喉嚨裡轉了一圈，\n最後出口的是——「⋯⋯我喜歡這個說法。」',
    failReply: [
      { him: '我就知道妳懂。', time: '現場' },
      { him: '這種懂，很多人一輩子遇不到一次。', time: '現場' },
    ],
  },
  isolate: {
    failInner: '妳想說「她是為我好」。\n可是話卡住了。\n妳聽見自己說：「⋯⋯你說得對。」',
    failReply: [
      { him: '謝謝妳，站在我這邊。', time: '晚上9:18' },
      { note: '那天之後，妳越來越少跟朋友提到他。\n再後來，連自己的事也很少講了。' },
    ],
  },
};

// ── 試點進行中狀態 ──
let chosen = null;          // 選定的玩家角色
let startInsight = 0;       // 本輪由觀察力決定的起始識人之眼
let traits = [];            // 起始無傷痕（試點單篇）
let beatIdx = 0;
let flags = new Set();
let pendingEnd = null;
let currentChoices = null;
let liveInsight = 0;        // 進行中的識人之眼（從 startInsight 起跳，抓到線索會升）
let spoke = { tries: 0, wins: 0 }; // 本輪「說出口」擲骰統計（結局點題用）
let diceIv = null;          // 擲骰動畫的 interval

function hasTrait(id) { return traits.includes(id); }
function addTrait(id) { if (id && !hasTrait(id)) traits.push(id); }
function removeTrait(id) { traits = traits.filter(t => t !== id); }

// ── 畫面切換 ──
function show(id) {
  document.getElementById('charSelect').classList.toggle('visible', id === 'select');
  document.getElementById('chatWrap').classList.toggle('visible', id === 'chat');
  document.getElementById('endingScreen').classList.toggle('visible', id === 'ending');
}

function pilotStart() {
  const ts = document.getElementById('titleScreen');
  ts.classList.add('hiding');
  setTimeout(() => { ts.style.display = 'none'; }, 600);
  renderCharSelect();
}

// ── 選角畫面 ──
function statBar(label, val, active) {
  return `
    <div class="stat-row ${active ? 'active' : ''}">
      <div class="stat-label">${label}${active ? ' <span class="stat-tag">看見</span>' : ''}</div>
      <div class="stat-bar"><div class="stat-fill" style="width:${val}%"></div></div>
      <div class="stat-val">${val}</div>
    </div>`;
}

function renderCharSelect() {
  show('select');
  const wrap = document.getElementById('charCards');
  wrap.innerHTML = '';
  PILOT_ORDER.forEach((id, i) => {
    const c = PILOT_CHARACTERS[id];
    const r = c.resources;
    const tier = insightTier(observationToInsight(r.觀察力));
    const card = document.createElement('div');
    card.className = 'charsel-card';
    card.style.animationDelay = `${i * 100}ms`;
    card.onclick = () => selectCharacter(id);
    card.innerHTML = `
      <div class="charsel-top">
        <div class="charsel-avatar" style="${c.avatarStyle}">${c.avatarText}</div>
        <div>
          <div class="charsel-arch">${c.archetype}</div>
          <div class="charsel-tag">${c.tagline}</div>
        </div>
      </div>
      <div class="charsel-blurb">${c.blurb}</div>
      <div class="charsel-stats">
        ${statBar('觀察力', r.觀察力, true)}
        ${statBar('自信', r.自信, false)}
        ${statBar('邊界感', r.邊界感, false)}
        ${statBar('韌性', r.韌性, false)}
        ${statBar('壓力', r.壓力, false)}
      </div>
      <div class="charsel-foot">
        <span class="charsel-eye">識人之眼起點：<b class="${tier.cls}">${tier.name}</b></span>
        <span class="charsel-cost">離開代價：${c.leaveCost}</span>
      </div>
      <button class="charsel-btn">選她，去見 Julian →</button>`;
    wrap.appendChild(card);
  });
}

function selectCharacter(id) {
  chosen = PILOT_CHARACTERS[id];
  startInsight = observationToInsight(chosen.resources.觀察力);
  liveInsight = startInsight;
  traits = [];
  spoke = { tries: 0, wins: 0 };
  startEpisode();
}

// ── 故事進行 ──
let renderTimers = [];
function schedule(fn, ms) { renderTimers.push(setTimeout(fn, ms)); }
function clearRenderTimers() {
  renderTimers.forEach(clearTimeout); renderTimers = [];
  if (diceIv) { clearInterval(diceIv); diceIv = null; }
}

function startEpisode() {
  beatIdx = 0;
  flags = new Set();
  pendingEnd = null;
  document.getElementById('chatAvatar').textContent = EP.avatarText;
  document.getElementById('chatAvatar').setAttribute('style', EP.avatarStyle);
  document.getElementById('chatName').textContent = EP.name;
  const tier = insightTier(startInsight);
  document.getElementById('pilotRole').innerHTML =
    `你扮演 <b>${chosen.archetype}</b> · 識人之眼 <b class="${tier.cls}">${tier.name}</b> · 說出口 SA <b>${computeSA()}</b>`;
  show('chat');
  renderBeat();
}

function confirmExit() {
  if (confirm('要放下手機、回到選角嗎？這一輪的進度不會保留。')) {
    clearRenderTimers();
    renderCharSelect();
  }
}

function visibleMessages(list) {
  return list.filter(m => {
    if (m.trait && !hasTrait(m.trait)) return false;
    if (m.skipIfTrait && hasTrait(m.skipIfTrait)) return false;
    if (m.minInsight && liveInsight < m.minInsight) return false; // 觀察力不夠，看不見這條線索
    return true;
  });
}

function appendNote(container, text) {
  const n = document.createElement('div');
  n.className = 'scene-note';
  n.textContent = text;
  container.appendChild(n);
}

function appendInner(container, text) {
  const n = document.createElement('div');
  n.className = 'inner-voice';
  n.textContent = text;
  container.appendChild(n);
}

function appendHim(container, m) {
  let grp = container.querySelector('.msg-group.him-last');
  if (!grp) { appendHimShell(container); grp = container.querySelector('.msg-group.him-last'); }
  const rows = grp.querySelector('.bubble-row');
  const b = document.createElement('div');
  b.className = 'bubble her';
  b.textContent = m.him;
  b.style.animation = 'fadeUp 0.3s ease both';
  const t = document.createElement('div');
  t.className = 'bubble-time';
  t.textContent = m.time || '';
  rows.appendChild(b); rows.appendChild(t);
}

function appendHimShell(container) {
  const grp = document.createElement('div');
  grp.className = 'msg-group him-last';
  const sl = document.createElement('div');
  sl.className = 'msg-sender him';
  sl.textContent = EP.name;
  grp.appendChild(sl);
  const rows = document.createElement('div');
  rows.className = 'bubble-row';
  grp.appendChild(rows);
  container.appendChild(grp);
}

function breakHimGroup(container) {
  const grp = container.querySelector('.msg-group.him-last');
  if (grp) grp.classList.remove('him-last');
}

function scrollMsgs() {
  const msgs = document.getElementById('messages');
  msgs.scrollTop = msgs.scrollHeight;
}

// 逐則播放（沿用選集的節奏邏輯：打字時間與閱讀時間依字數）
function playMessages(list, startDelay, onDone, fast) {
  const msgs = document.getElementById('messages');
  if (DEBUG.instant) { // 測試：瞬間出全部訊息，不打字、不延遲
    visibleMessages(list).forEach(m => {
      if (m.note !== undefined) { breakHimGroup(msgs); appendNote(msgs, m.note); }
      else if (m.inner !== undefined) { breakHimGroup(msgs); appendInner(msgs, m.inner); }
      else { appendHim(msgs, m); }
    });
    scrollMsgs();
    schedule(onDone, 10);
    return;
  }
  let delay = startDelay;
  visibleMessages(list).forEach((m) => {
    if (m.note !== undefined || m.inner !== undefined) {
      schedule(() => {
        breakHimGroup(msgs);
        if (m.note !== undefined) appendNote(msgs, m.note); else appendInner(msgs, m.inner);
        scrollMsgs();
      }, delay);
      delay += fast ? 600 : 900;
      return;
    }
    const typeTime = fast
      ? Math.min(1400, Math.max(500, m.him.length * 30))
      : Math.min(2400, Math.max(800, m.him.length * 45));
    const readTime = fast
      ? Math.min(900, Math.max(350, m.him.length * 18))
      : Math.min(1600, Math.max(500, m.him.length * 28));

    const tDelay = delay;
    schedule(() => {
      const grpExists = msgs.querySelector('.msg-group.him-last');
      if (!grpExists) appendHimShell(msgs);
      const rows = msgs.querySelector('.msg-group.him-last .bubble-row');
      const ind = document.createElement('div');
      ind.className = 'typing-indicator';
      ind.id = `pilot-typing-${tDelay}`;
      ind.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      rows.appendChild(ind);
      scrollMsgs();
    }, tDelay);

    schedule(() => {
      const ind = document.getElementById(`pilot-typing-${tDelay}`);
      if (ind) ind.remove();
      appendHim(msgs, m);
      scrollMsgs();
    }, tDelay + typeTime);

    delay = tDelay + typeTime + readTime;
  });
  schedule(onDone, delay + 300);
}

function renderBeat() {
  clearRenderTimers();
  pendingEnd = null;
  const beat = EP.beats[beatIdx];
  const msgs = document.getElementById('messages');
  msgs.innerHTML = '';
  document.getElementById('chatStatus').textContent = beat.status;
  document.getElementById('navProgress').textContent = `第 ${beatIdx + 1} 拍 / ${EP.beats.length}`;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '繼續 →';
  nextBtn.disabled = true;
  document.getElementById('choicesArea').style.display = 'none';
  renderDebugPanel(); // 測試面板開著的話，刷新即時數值

  playMessages(beat.messages, 400, () => {
    showChoices(beat.choices);
  }, false);
}

function showChoices(choices) {
  // 觀察力不夠的玩家，看不到「需要更利的眼睛才會出現」的觀察選項
  // （只能加、不能鎖：低觀察力玩家仍有其餘選項可玩）
  const shown = choices.filter(c => !c.minInsight || liveInsight >= c.minInsight);
  currentChoices = shown;
  const area = document.getElementById('choicesArea');
  area.querySelectorAll('.choice-btn').forEach(el => el.remove());
  shown.forEach((c, i) => {
    const dice = c.flag && DICE[c.flag];
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (c.minInsight ? ' insight' : '') + (dice ? ' resist' : '');
    if (dice) {
      btn.innerHTML = `<span class="choice-main"></span><span class="odds">說出口・勝算 ${expressiveChance()}%</span>`;
      btn.querySelector('.choice-main').textContent = c.text;
    } else {
      btn.textContent = c.text;
    }
    btn.onclick = () => choose(i);
    area.appendChild(btn);
  });
  area.style.display = 'flex';
  scrollMsgs();
}

function appendYouBubble(text) {
  const msgs = document.getElementById('messages');
  const grp = document.createElement('div');
  grp.className = 'msg-group';
  const yl = document.createElement('div');
  yl.className = 'msg-sender you';
  yl.textContent = '妳';
  grp.appendChild(yl);
  const yr = document.createElement('div');
  yr.className = 'bubble-row you';
  const yb = document.createElement('div');
  yb.className = 'bubble you';
  yb.textContent = text;
  yr.appendChild(yb);
  grp.appendChild(yr);
  msgs.appendChild(grp);
  return yb;
}

// 對話執行：抵抗型選項先擲骰（說出口）。成功＝照常頂回去；失敗＝話縮回去、吞下去走妥協。
function resolveExpressive(c, dice) {
  const msgs = document.getElementById('messages');
  const chance = expressiveChance();
  spoke.tries++;
  const cont = () => { document.getElementById('nextBtn').disabled = false; scrollMsgs(); };

  rollDice(c.text, chance, (success) => {
    if (success) {
      spoke.wins++;
      flags.add(c.flag);
      liveInsight = Math.min(liveInsight + 1, 8);
      appendYouBubble(c.text);
      scrollMsgs();
      if (c.reply && c.reply.length) playMessages(c.reply, 500, cont, true);
      else schedule(cont, 400);
    } else {
      const bubble = appendYouBubble(c.text); // 話打出來……
      scrollMsgs();
      const d1 = DEBUG.instant ? 10 : 500, d2 = DEBUG.instant ? 10 : 950;
      schedule(() => {
        bubble.classList.add('retracting');     // ……又縮了回去
        schedule(() => {
          const grp = bubble.closest('.msg-group');
          if (grp) grp.remove();
          appendInner(msgs, dice.failInner);     // 吞下去的內心話
          scrollMsgs();
          playMessages(dice.failReply || [], DEBUG.instant ? 10 : 700, cont, true); // 走妥協那條
        }, d2);
      }, d1);
    }
  });
}

// 擲骰動畫（模式 A：看得到勝算、看得到骰子落點）
function rollDice(text, chance, cb) {
  const msgs = document.getElementById('messages');
  const panel = document.createElement('div');
  panel.className = 'dice-panel';
  panel.innerHTML = `
    <div class="dice-label">說出口 · 判定</div>
    <div class="dice-say"></div>
    <div class="dice-meter">
      <span class="dice-odds">勝算 ${chance}%</span>
      <span class="dice-roll" id="diceRoll">··</span>
    </div>
    <div class="dice-result" id="diceResult">擲骰中⋯</div>`;
  panel.querySelector('.dice-say').textContent = text;
  msgs.appendChild(panel);
  scrollMsgs();
  const rollEl = panel.querySelector('#diceRoll');
  const resEl = panel.querySelector('#diceResult');
  // 擲骰結果（測試可強制成功/失敗；強制時 final 仍與結果一致）
  let success, final;
  if (DEBUG.force === 'win')  { success = true;  final = Math.floor(Math.random() * chance); }
  else if (DEBUG.force === 'lose') { success = false; final = chance + Math.floor(Math.random() * (100 - chance)); }
  else { final = Math.floor(Math.random() * 100); success = final < chance; } // 0–99，越低越容易成功

  const settle = () => {
    rollEl.textContent = final;
    rollEl.classList.add(success ? 'ok' : 'no');
    resEl.textContent = success ? '✓ 妳說出口了' : '✗ 話又吞了回去';
    resEl.className = 'dice-result ' + (success ? 'ok' : 'no');
    scrollMsgs();
  };

  if (DEBUG.instant) { settle(); schedule(() => cb(success), 10); return; } // 測試：直接揭曉

  let ticks = 0;
  if (diceIv) clearInterval(diceIv);
  diceIv = setInterval(() => {
    rollEl.textContent = Math.floor(Math.random() * 100);
    if (++ticks > 14) {
      clearInterval(diceIv); diceIv = null;
      settle();
      schedule(() => cb(success), 950);
    }
  }, 70);
}

function choose(i) {
  const c = currentChoices[i];
  const dice = c.flag && DICE[c.flag];
  document.getElementById('choicesArea').style.display = 'none';
  const msgs = document.getElementById('messages');
  breakHimGroup(msgs);

  if (dice) { resolveExpressive(c, dice); return; } // 抵抗型 → 擲骰

  if (c.flag) { flags.add(c.flag); liveInsight = Math.min(liveInsight + 1, 8); } // 抓到線索，眼睛更利一點

  // 玩家的動作：括號開頭＝行動敘述，否則是訊息泡泡
  if (c.text.startsWith('（')) {
    appendNote(msgs, c.text.replace(/^（|）$/g, ''));
  } else {
    appendYouBubble(c.text);
  }
  scrollMsgs();

  const after = () => {
    if (c.followup) {
      playMessages(c.followup.reply || [], 500, () => showChoices(c.followup.choices), true);
      return;
    }
    if (c.end) {
      pendingEnd = c.end;
      const nextBtn = document.getElementById('nextBtn');
      nextBtn.textContent = '看下去 →';
      nextBtn.disabled = false;
      return;
    }
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = false;
    scrollMsgs();
  };

  if (c.reply && c.reply.length) {
    playMessages(c.reply, 500, after, true);
  } else {
    schedule(after, 400);
  }
}

function nextBeat() {
  if (pendingEnd) { finish(pendingEnd); return; }
  if (beatIdx < EP.beats.length - 1) {
    beatIdx++;
    renderBeat();
  }
}

// ── 結局與回顧 ──
function finish(endKey) {
  clearRenderTimers();
  const ending = EP.endings[endKey];
  const result = EP.resolveTraits(endKey, flags, hasTrait);

  let traitBlock = null;
  if (result) {
    const before = result.remove && hasTrait(result.remove);
    if (result.remove) removeTrait(result.remove);
    if (result.add) addTrait(result.add);
    traitBlock = result;
    traitBlock.healed = before && result.add && !result.regress;
  }

  const s = document.getElementById('endingScreen');
  s.innerHTML = '';

  const kick = document.createElement('div');
  kick.className = 'ending-kicker';
  kick.textContent = ending.kicker || '結局';
  s.appendChild(kick);

  const title = document.createElement('div');
  title.className = 'ending-title';
  title.textContent = ending.title;
  s.appendChild(title);

  if (ending.dodge) {
    const d = document.createElement('div');
    d.className = 'dodge-block';
    d.innerHTML = `<div class="dodge-label">${ending.dodge.label}</div><div class="dodge-text">${ending.dodge.text.replace(/\n/g, '<br>')}</div>`;
    s.appendChild(d);
  }

  if (ending.anatomy) {
    const a = document.createElement('div');
    a.className = 'anatomy-block';
    a.innerHTML = '<div class="profile-block-label">劇本解剖——他的每一步，都對應劇本的哪一頁</div>';
    ending.anatomy.forEach((row, i) => {
      const r = document.createElement('div');
      r.className = 'anatomy-row';
      r.style.animationDelay = `${i * 90}ms`;
      r.innerHTML = `<div class="anatomy-step">${row[0]}</div><div class="anatomy-text">${row[1]}</div>`;
      a.appendChild(r);
    });
    s.appendChild(a);
  }

  if (ending.absolve) {
    const ab = document.createElement('div');
    ab.className = 'dodge-block';
    ab.innerHTML = `<div class="dodge-label" style="color:var(--text-dim)">給妳的話</div><div class="dodge-text">${ending.absolve.replace(/\n/g, '<br>')}</div>`;
    s.appendChild(ab);
  }

  if (ending.wink) {
    const w = document.createElement('div');
    w.className = 'wink-block';
    w.innerHTML = `<div class="wink-text">${ending.wink.replace(/\n/g, '<br>')}</div>`;
    s.appendChild(w);
  }

  if (ending.showChecklist && EP.telltales) {
    const fc = document.createElement('div');
    fc.className = 'flagcheck-block';
    fc.innerHTML = `<div class="profile-block-label">破綻清單——一直都在那裡的</div>`;
    EP.telltales.forEach((t, i) => {
      const hit = t.flag && flags.has(t.flag);
      const row = document.createElement('div');
      row.className = 'flagcheck-row';
      row.style.animationDelay = `${i * 80}ms`;
      row.innerHTML = `<div class="flagcheck-mark ${hit ? 'hit' : 'miss'}">${hit ? '✓ 妳戳過' : '——'}</div><div class="flagcheck-text">${t.text}</div>`;
      fc.appendChild(row);
    });
    s.appendChild(fc);
  }

  if (traitBlock && (traitBlock.add || traitBlock.text)) {
    const tb = document.createElement('div');
    tb.className = 'trait-award';
    let nameHtml = '';
    if (traitBlock.add) {
      const tr = TRAITS[traitBlock.add];
      const sym = traitBlock.regress ? '↘ ' : (traitBlock.healed ? '✦ ' : '＋ ');
      nameHtml = `<div class="trait-award-name ${tr.cls}">${sym}${tr.name}</div>`;
    }
    const awardLabel = traitBlock.regress ? '妳的卡片，倒退了一格' : ('妳的卡片' + (traitBlock.add ? '被改寫了' : ''));
    tb.innerHTML = `
      <div class="trait-award-label">${awardLabel}</div>
      ${nameHtml}
      <div class="trait-award-desc">${(traitBlock.text || '').replace(/\n/g, '<br>')}</div>`;
    s.appendChild(tb);
  }

  // ── 試點專屬：點破「資源＝選擇權」，引導換角色再玩一次 ──
  const tier = insightTier(startInsight);
  const seen = flags.size;
  const spokeLine = spoke.tries
    ? `你試著當面頂回去 <b>${spoke.tries}</b> 次，真正說出口 <b>${spoke.wins}</b> 次——剩下的，話到嘴邊又吞了回去（SA ${computeSA()}）。<br>`
    : '';
  const pilotNote = document.createElement('div');
  pilotNote.className = 'pilot-note';
  pilotNote.innerHTML = `
    <div class="pilot-note-label">這一輪的你</div>
    <div class="pilot-note-body">
      你是 <b>${chosen.archetype}</b>（觀察力 ${chosen.resources.觀察力}），識人之眼 <b class="${tier.cls}">${tier.name}</b>。<br>
      這一輪你戳破了他 <b>${seen}</b> 個破綻。<br>
      ${spokeLine}
      <span class="pilot-note-dim">看得見，不等於說得出口——這就是「資源＝選擇權」。換一個人來玩，看到的、說得出的，都不一樣。</span>
    </div>`;
  s.appendChild(pilotNote);

  const back = document.createElement('div');
  back.className = 'replay-area';
  back.innerHTML = `<button class="replay-btn" onclick="renderCharSelect()">換一個人，再玩一次</button><div class="replay-note">換單親媽媽（看得最清楚）和富家女（最看不穿）各玩一次，差最多。</div>`;
  s.appendChild(back);

  show('ending');
  s.scrollTop = 0;
}

// ── 測試面板（只在試點檔）──
function toggleDebug() {
  const p = document.getElementById('dbgPanel');
  if (p.classList.toggle('open')) renderDebugPanel();
}
function dbgInstant(on) { DEBUG.instant = on; renderDebugPanel(); }
function dbgForce(mode) { DEBUG.force = mode; renderDebugPanel(); }
function dbgChar(id) { selectCharacter(id); renderDebugPanel(); }
function dbgJump(n) {
  if (!chosen) selectCharacter('everywoman');
  clearRenderTimers();
  beatIdx = Math.max(0, Math.min(EP.beats.length - 1, n));
  show('chat');
  renderBeat();
}
function renderDebugPanel() {
  const p = document.getElementById('dbgPanel');
  if (!p || !p.classList.contains('open')) return;
  const sa = chosen ? computeSA() : '—';
  const odds = chosen ? expressiveChance() + '%' : '—';
  const tier = chosen ? insightTier(liveInsight).name : '—';
  const who = chosen ? chosen.archetype : '（未選角）';
  const beatBtns = EP.beats.map((b, i) => `<button class="dbg-chip" onclick="dbgJump(${i})">${i + 1}</button>`).join('');
  const forceOpts = [['random', '隨機'], ['win', '必成功'], ['lose', '必失敗']]
    .map(([v, t]) => `<button class="dbg-chip ${DEBUG.force === v ? 'on' : ''}" onclick="dbgForce('${v}')">${t}</button>`).join('');
  p.innerHTML = `
    <div class="dbg-title">🛠 測試模式 <button class="dbg-x" onclick="toggleDebug()">✕</button></div>
    <div class="dbg-sect">⏩ 快速模式（關動畫/延遲）
      <label class="dbg-sw"><input type="checkbox" ${DEBUG.instant ? 'checked' : ''} onchange="dbgInstant(this.checked)"> ${DEBUG.instant ? '開' : '關'}</label>
    </div>
    <div class="dbg-sect">🎲 擲骰結果<div class="dbg-row">${forceOpts}</div></div>
    <div class="dbg-sect">⚡ 換角色<div class="dbg-row">
      <button class="dbg-chip" onclick="dbgChar('heiress')">富家女</button>
      <button class="dbg-chip" onclick="dbgChar('everywoman')">普通</button>
      <button class="dbg-chip" onclick="dbgChar('singlemom')">單親媽媽</button>
    </div></div>
    <div class="dbg-sect">➡ 跳到第幾拍<div class="dbg-row">${beatBtns}</div></div>
    <div class="dbg-sect">🔍 隱藏數值（即時）<div class="dbg-state">
      角色：${who}<br>
      SA（說出口）：${sa}　勝算：${odds}<br>
      識人之眼：${tier}（值 ${liveInsight}）<br>
      已戳破：${[...flags].join('、') || '（無）'}<br>
      說出口：${spoke.tries ? spoke.wins + ' / ' + spoke.tries : '—'}
    </div></div>`;
}

// ── INIT ──
// 等待玩家點標題進入選角
