// ── 諷刺選集引擎 ──
// 池子即選單：一張卡＝一篇。零回饋：遊戲中不顯示任何數值；
// 特質只在回顧揭曉，只改味道、永不鎖內容。

const EPISODES = { sebastian: EP_SEBASTIAN, daniel: EP_DANIEL, julian: EP_JULIAN };
const POOL_ORDER = ['sebastian', 'daniel', 'julian'];

// ── 特質定義 ──
const TRAITS = {
  seeThrough: { name: '看穿包裝', cls: 'good', desc: '太完美的細節，妳現在會多看一眼。' },
  silent:     { name: '不敢開口', cls: 'scar', desc: '說出自己的困境，變得很難。' },
  guarded:    { name: '防衛心',   cls: 'edge', desc: '對掠食者是盔甲。對好人，是凶器。' },
  jumpy:      { name: '草木皆兵', cls: 'scar', desc: '警覺第一次傷到人——傷到的是妳自己。' },
  trust:      { name: '重新學會信任', cls: 'good', desc: '傷會好。需要時間，和一個好的人。' },
  spoken:     { name: '說得出口', cls: 'good', desc: '妳把不安說出口，世界沒有塌。' },
  selfdoubt:  { name: '我是不是想太多', cls: 'scar', desc: '他讓妳習慣懷疑自己的感覺。連生氣，都要先問是不是自己的錯。' },
  holdfast:   { name: '守得住自己', cls: 'good', desc: '他想替妳重寫妳是誰。妳沒讓他。' },
};

// ── 存檔 ──
// archetype/resources：人生只有一次——你是誰、帶著什麼資源，跟著整池走、會被約會改寫。
const ANTH_KEY = 'rfd_anthology_v1';
let state = { archetype: null, resources: null, traits: [], insight: 0, episodes: {} };
let liveInsight = 0; // 本篇進行中的識人之眼（從存檔起跳，抓到線索會升）
try {
  const raw = localStorage.getItem(ANTH_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* 壞檔就重來 */ }

function saveAnth() { localStorage.setItem(ANTH_KEY, JSON.stringify(state)); }
function hasTrait(id) { return state.traits.includes(id); }
function addTrait(id) { if (id && !hasTrait(id)) state.traits.push(id); }
function removeTrait(id) { state.traits = state.traits.filter(t => t !== id); }

// 識人之眼：不顯示數字，只顯示階。高階＝注意到的線索更多。
function insightTier(n) {
  if (n >= 6) return { name: '老練', cls: 'good', desc: '你幾乎一眼就讀得出不對勁。' };
  if (n >= 3) return { name: '識人', cls: 'good', desc: '你開始看得見那些不對勁的小地方。' };
  if (n >= 1) return { name: '留心', cls: '',     desc: '你比以前多看了一眼。' };
  return            { name: '天真', cls: '',      desc: '你還願意相信大部分人說的話。' };
}

// ── 資源機制（從 Julian 試點併入；只在當篇有 ep.lens 時啟用）──
// 測試模式：?debug 時可由 console 開（DEBUG.instant 關動畫、DEBUG.force 強制擲骰）
const DEBUG = { instant: false, force: 'random' };
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// 說出口：SA（自信＋邊界感的合成讀數）→ 勝算（模式 A・事前透明）。讀持久化資源＝會被前面約會改寫。
const ODDS_BASE = 48, ODDS_K = 1.6, ODDS_MIN = 25, ODDS_MAX = 88;
function computeSA() {
  const r = state.resources || { 自信: 30, 邊界感: 30 };
  return Math.round(((r.自信 || 0) + (r.邊界感 || 0)) / 2);
}
function expressiveChance() { return clamp(Math.round(ODDS_BASE + (computeSA() - 30) * ODDS_K), ODDS_MIN, ODDS_MAX); }

// 壓力：違背自己→累積→爆發。藏起來會讓爆發顯得莫名其妙，所以看得見（模式 A 一致）。
const STRESS_SWALLOW = 22;        // 想抗拒卻吞回去（擲骰失敗）
const STRESS_COMPLY  = 12;        // 有抵抗選項卻主動選妥協
const DRIFT_AFTER_BREAKDOWN = 8;  // 爆發後內在資源往下漂（持久化→下一場更說不出口）
function breakdownThreshold() { return ((state.resources && state.resources.韌性) || 50) + 30; }

// 獵物價值分級（他多想留住妳）。公式由各篇鏡片 ep.lens.preyValue 決定。
function clingTier(v) { return v >= 60 ? 'high' : (v >= 38 ? 'mid' : 'low'); }

// ── 單篇進行中的狀態 ──
let ep = null;
let beatIdx = 0;
let flags = new Set();
let memories = new Set();
let pendingEnd = null;
let currentChoices = null;
// 機制（只在 ep.lens 篇用）：壓力為單篇變數、爆發削的資源寫回 state.resources（持久化）
let stress = 0;
let stressMax = 100;
let brokeDown = false;
let breakdownPending = false;
let diceIv = null;
let spoke = { tries: 0, wins: 0 };
let charPreview = null;
let charStatHelp = null;

// ── 畫面切換 ──
function show(id) {
  document.getElementById('charSelect').classList.toggle('visible', id === 'select');
  document.getElementById('poolScreen').classList.toggle('visible', id === 'pool');
  document.getElementById('profileView').classList.toggle('visible', id === 'profile');
  document.getElementById('chatWrap').classList.toggle('visible', id === 'chat');
  document.getElementById('endingScreen').classList.toggle('visible', id === 'ending');
}

function anthStart() {
  const ts = document.getElementById('titleScreen');
  ts.classList.add('hiding');
  setTimeout(() => { ts.style.display = 'none'; }, 600);
  // 已選過人生＝直接進池子；第一次＝先選你是誰
  if (state.archetype && PLAYER_ARCHETYPES[state.archetype]) renderPool();
  else renderCharSelect();
}

function returnToTitle() {
  charPreview = null;
  charStatHelp = null;
  show(null);
  const ts = document.getElementById('titleScreen');
  ts.style.display = 'flex';
  ts.classList.remove('hiding');
}

// ── 選角（人生只有一次）──
function statBar(id, label, val, active, tip) {
  const key = `${id}:${label}`;
  const open = charStatHelp === key;
  return `
    <div class="stat-row ${active ? 'active' : ''}">
      <div class="stat-mainline">
        <div class="stat-name">
          <span class="stat-label">${label}</span>
          <button class="stat-help" type="button" data-stat-help="${key}" aria-label="${label}說明" aria-expanded="${open ? 'true' : 'false'}">?</button>
        </div>
        <div class="stat-bar"><div class="stat-fill" style="width:${val}%"></div></div>
        <div class="stat-val">${val}</div>
      </div>
      ${open ? `<div class="stat-copy">${tip}</div>` : ''}
    </div>`;
}

function setCharPreview(id) {
  charPreview = charPreview === id ? null : id;
  charStatHelp = null;
  renderCharSelect();
}

function renderCharSelect() {
  show('select');
  const wrap = document.getElementById('charCards');
  wrap.innerHTML = '';
  if (!charPreview || !PLAYER_ARCHETYPES[charPreview]) charPreview = null;
  PLAYER_ARCHETYPE_ORDER.forEach((id, i) => {
    const c = PLAYER_ARCHETYPES[id];
    const r = c.resources;
    const tier = insightTier(observationToInsight(r.觀察力));
    const isActive = charPreview === id;
    const card = document.createElement('div');
    card.className = 'charsel-card' + (isActive ? ' is-active' : '');
    card.style.animationDelay = `${i * 100}ms`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    card.onclick = () => setCharPreview(id);
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCharPreview(id);
      }
    };
    card.innerHTML = `
      <div class="charsel-top">
        <div class="charsel-main">
          <div class="charsel-avatar" style="${c.avatarStyle}">${c.avatarText}</div>
          <div class="charsel-copy">
            <div class="charsel-arch">${c.archetype}</div>
            <div class="charsel-tag">${c.tagline}</div>
          </div>
        </div>
        <div class="charsel-state">${isActive ? '再點收起' : '點開看細節'}</div>
      </div>
      <div class="charsel-blurb">${c.blurb}</div>
      <div class="charsel-details">
        <div class="charsel-summary">
          <span class="charsel-chip">一開始的察覺：<strong class="${tier.cls}">${tier.name}</strong></span>
          <span class="charsel-chip">離開難度：<strong>${c.leaveCost}</strong></span>
        </div>
        <div class="charsel-stats">
          ${statBar(id, '察覺', r.觀察力, true, '數字越高就越早注意到對方話裡不太對勁的地方。')}
          ${statBar(id, '開口', r.自信, false, '影響妳能不能把不舒服說出來。')}
          ${statBar(id, '界線', r.邊界感, false, '影響妳能不能守住自己的節奏。')}
          ${statBar(id, '警戒', r.警戒 || 0, false, '影響妳一開始會不會先多看一眼。')}
          ${statBar(id, '承受', r.韌性, false, '影響妳在壓力爆發前能撐多久。')}
        </div>
        <div class="charsel-actions">
          <button class="charsel-btn" type="button">選這一種人生 →</button>
        </div>
      </div>
      `;
    const selectBtn = card.querySelector('.charsel-btn');
    if (selectBtn) {
      selectBtn.onclick = (e) => {
        e.stopPropagation();
        selectArchetype(id);
      };
    }
    card.querySelectorAll('.stat-help').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        charStatHelp = charStatHelp === btn.dataset.statHelp ? null : btn.dataset.statHelp;
        renderCharSelect();
      };
    });
    wrap.appendChild(card);
  });
}

function selectArchetype(id) {
  state.archetype = id;
  state.resources = JSON.parse(JSON.stringify(PLAYER_ARCHETYPES[id].resources)); // 深拷貝：資源會被約會改寫，不污染母資料
  state.insight = Math.max(state.insight, observationToInsight(state.resources.觀察力)); // 觀察力＝識人之眼的起點
  saveAnth();
  renderPool();
}

function resetLife() {
  if (confirm('換一個人生？目前的特質、識人之眼和進度都會清空，重新選一個你。')) {
    state = { archetype: null, resources: null, traits: [], insight: 0, episodes: {} };
    liveInsight = 0;
    saveAnth();
    renderCharSelect();
  }
}

// ── 池子 ──
function renderPool() {
  show('pool');
  const wrap = document.getElementById('poolCards');
  wrap.innerHTML = '';

  // 玩家自己的卡
  const me = document.createElement('div');
  me.className = 'pool-card is-player';
  let traitHtml;
  if (state.traits.length) {
    traitHtml = '<div class="trait-row">' + state.traits.map(t => {
      const tr = TRAITS[t];
      return `<span class="trait-chip ${tr.cls}" title="${tr.desc}">${tr.name}</span>`;
    }).join('') + '</div>';
  } else {
    traitHtml = '<div class="trait-empty">（還是新的。暫時。）</div>';
  }
  const tier = insightTier(state.insight);
  const meChar = state.archetype ? PLAYER_ARCHETYPES[state.archetype] : null;
  const meAvatar = meChar ? meChar.avatarStyle : 'background:linear-gradient(135deg,#4a3f6b,#2d3a5a)';
  const meSub = meChar ? `${meChar.archetype} · 識人之眼 ${tier.name}` : `識人之眼 · ${tier.name}`;
  me.innerHTML = `
    <div class="pool-card-top">
      <div class="pool-avatar" style="${meAvatar}">妳</div>
      <div>
        <div class="pool-card-name">妳</div>
        <div class="pool-card-sub">${meSub}</div>
      </div>
    </div>${traitHtml}`;
  wrap.appendChild(me);

  // 池子裡的人
  POOL_ORDER.forEach((id, i) => {
    const e = EPISODES[id];
    const st = state.episodes[id] || {};
    const card = document.createElement('div');
    card.className = 'pool-card' + (st.done ? ' done' : '');
    card.style.animationDelay = `${(i + 1) * 90}ms`;
    let stateLine = '';
    if (st.done) {
      const endTitle = e.endings[st.ending] ? e.endings[st.ending].title : '';
      stateLine = `<div class="pool-card-state"><span class="done-tag">已讀完</span> · ${endTitle} · 點擊可重讀</div>`;
    } else if (st.skipped) {
      stateLine = '<div class="pool-card-state"><span class="skip-tag">妳滑掉過他 · 他還會再出現</span></div>';
    }
    card.innerHTML = `
      <div class="pool-card-top">
        <div class="pool-avatar" style="${e.avatarStyle}">${e.avatarText}</div>
        <div>
          <div class="pool-card-name">${e.name}</div>
          <div class="pool-card-sub">${e.cardSub}</div>
        </div>
      </div>
      <div class="pool-card-quote">${e.quote}</div>${stateLine}`;
    card.onclick = () => openProfile(id);
    wrap.appendChild(card);
  });

  const foot = document.getElementById('poolFoot');
  const allDone = POOL_ORDER.every(id => state.episodes[id] && state.episodes[id].done);
  const footLine = allDone
    ? '這一輪快結束了。<br>……更後面，還有人正在輸入。'
    : '先看仔細，再決定。<br>離開永遠是選項之一。';
  foot.innerHTML = footLine +
    '<div class="pool-reset"><button class="pool-reset-btn" onclick="resetLife()">換一個人生 ↺</button></div>';
  renderDebugPanel();
}

// ── 個人檔案 ──
function openProfile(id) {
  const e = EPISODES[id];
  const st = state.episodes[id] || {};
  const v = document.getElementById('profileView');
  v.innerHTML = `
    <div class="profile-top">
      <div class="profile-avatar" style="${e.avatarStyle}">${e.avatarText}</div>
      <div>
        <div class="profile-name">${e.name}</div>
        <div class="profile-sub">${e.profile.sub}</div>
      </div>
    </div>
    <div class="profile-quote">${e.quote}</div>
    <div class="profile-photos">
      <div class="profile-block-label">照片</div>
      ${e.profile.photos.map(p => `<div class="profile-photo-item">${p}</div>`).join('')}
    </div>
    <div class="profile-block-label">自我介紹</div>
    <div class="profile-bio">${e.profile.bio}</div>
    <div class="profile-actions">
      <button class="profile-btn back" onclick="renderPool()">←</button>
      <button class="profile-btn" onclick="skipProfile('${id}')">✕ 略過</button>
      <button class="profile-btn match" onclick="startEpisode('${id}')">${st.done ? '↻ 再讀一次' : '♥ 配對'}</button>
    </div>`;
  show('profile');
}

function skipProfile(id) {
  state.episodes[id] = Object.assign({}, state.episodes[id], { skipped: true });
  saveAnth();
  renderPool();
}

// ── 故事進行 ──
let renderTimers = [];
let activePlayback = null;
let playbackSerial = 0;
function schedule(fn, ms) { renderTimers.push(setTimeout(fn, ms)); }
function clearRenderTimers() {
  renderTimers.forEach(clearTimeout); renderTimers = [];
  activePlayback = null;
  document.querySelectorAll('.typing-indicator').forEach(el => el.remove());
  if (diceIv) { clearInterval(diceIv); diceIv = null; }
}

function startEpisode(id) {
  ep = EPISODES[id];
  beatIdx = 0;
  flags = new Set();
  memories = new Set();
  pendingEnd = null;
  liveInsight = state.insight;
  document.getElementById('chatAvatar').textContent = ep.avatarText;
  document.getElementById('chatAvatar').setAttribute('style', ep.avatarStyle);
  document.getElementById('chatName').textContent = ep.name;

  // 機制初始化（只有有鏡片的篇才顯示壓力條／角色條、才跑擲骰）
  const roleBar = document.getElementById('roleBar');
  const stressWrap = document.getElementById('stressWrap');
  spoke = { tries: 0, wins: 0 };
  if (ep.lens && state.resources) {
    stress = state.resources.壓力 || 0;
    stressMax = breakdownThreshold();
    brokeDown = false;
    breakdownPending = false;
    const tier = insightTier(liveInsight);
    const who = state.archetype ? PLAYER_ARCHETYPES[state.archetype].archetype : '妳';
    roleBar.innerHTML = `你扮演 <b>${who}</b> · 識人之眼 <b class="${tier.cls}">${tier.name}</b> · 說出口 SA <b>${computeSA()}</b>`;
    roleBar.style.display = 'block';
    stressWrap.style.display = 'flex';
    updateStressBar();
  } else {
    roleBar.style.display = 'none';
    stressWrap.style.display = 'none';
  }

  show('chat');
  renderBeat();
}

// ── 壓力（看得見的條）──
function updateStressBar() {
  const fill = document.getElementById('stressFill');
  const num = document.getElementById('stressNum');
  if (!fill) return;
  const pct = Math.min(100, Math.round(stress / stressMax * 100));
  fill.style.width = pct + '%';
  fill.classList.toggle('high', stress >= stressMax * 0.75);
  num.textContent = `${stress} / ${stressMax}`;
}

function addStress(n) {
  stress += n;
  if (!brokeDown && stress >= stressMax) breakdownPending = true; // 過線：下一拍演出爆發
  updateStressBar();
  renderDebugPanel();
}

// 爆發效果：留下「自責」傷痕、內在資源往下漂——寫回 state.resources 並存檔（持久化＝改寫下一場）
function applyBreakdownEffects() {
  brokeDown = true;
  breakdownPending = false;
  addTrait('selfdoubt');
  state.resources.自信 = Math.max(0, (state.resources.自信 || 0) - DRIFT_AFTER_BREAKDOWN);
  state.resources.邊界感 = Math.max(0, (state.resources.邊界感 || 0) - DRIFT_AFTER_BREAKDOWN);
  saveAnth();
  updateStressBar();
  renderDebugPanel();
}

// 糾纏：離開時依獵物價值分級（純演出、不阻擋）
function playClinging(onDone) {
  const tier = clingTier(ep.lens.preyValue(state.resources));
  const set = (ep.lens.clinging && ep.lens.clinging[tier]) || (ep.lens.clinging && ep.lens.clinging.mid) || [];
  breakHimGroup(document.getElementById('messages'));
  playMessages(set, 600, onDone, true);
}

function confirmExit() {
  if (confirm('要放下手機、回到配對列表嗎？這一篇的進度不會保留。')) {
    clearRenderTimers();
    renderPool();
  }
}

function visibleMessages(list) {
  return list.filter(m => {
    if (m.trait && !hasTrait(m.trait)) return false;
    if (m.skipIfTrait && hasTrait(m.skipIfTrait)) return false;
    if (m.memory && !memories.has(m.memory)) return false;
    if (m.skipIfMemory && memories.has(m.skipIfMemory)) return false;
    if (m.minInsight && liveInsight < m.minInsight) return false; // 識人之眼不夠，看不見這條線索
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
  if (!grp) {
    grp = document.createElement('div');
    grp.className = 'msg-group him-last';
    const sl = document.createElement('div');
    sl.className = 'msg-sender him';
    sl.textContent = ep.name;
    grp.appendChild(sl);
    const rows = document.createElement('div');
    rows.className = 'bubble-row';
    grp.appendChild(rows);
    container.appendChild(grp);
  }
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

function breakHimGroup(container) {
  const grp = container.querySelector('.msg-group.him-last');
  if (grp) grp.classList.remove('him-last');
}

function scrollMsgs() {
  const msgs = document.getElementById('messages');
  msgs.scrollTop = msgs.scrollHeight;
}

const MESSAGE_PACE = {
  normal: { note: 675, typeMin: 600, typeMax: 1800, typePerChar: 34, readMin: 375, readMax: 1200, readPerChar: 21 },
  fast: { note: 450, typeMin: 380, typeMax: 1050, typePerChar: 23, readMin: 260, readMax: 675, readPerChar: 14 },
};

function appendMessageItem(container, m) {
  if (m.note !== undefined) { breakHimGroup(container); appendNote(container, m.note); }
  else if (m.inner !== undefined) { breakHimGroup(container); appendInner(container, m.inner); }
  else appendHim(container, m);
}

function finishPlayback(playback) {
  if (!playback || activePlayback !== playback || playback.finished) return;
  playback.finished = true;
  activePlayback = null;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '繼續 →';
  nextBtn.disabled = true;
  playback.onDone();
}

function revealAllMessages() {
  const playback = activePlayback;
  if (!playback || playback.finished) return;
  renderTimers.forEach(clearTimeout); renderTimers = [];
  playback.container.querySelectorAll('.typing-indicator').forEach(el => el.remove());
  playback.items.forEach((m, i) => {
    if (playback.shown.has(i)) return;
    playback.shown.add(i);
    appendMessageItem(playback.container, m);
  });
  scrollMsgs();
  finishPlayback(playback);
}

// 逐則播放：保留聊天呼吸，也允許玩家用「顯示全部」跳過等待。
function playMessages(list, startDelay, onDone, fast) {
  const msgs = document.getElementById('messages');
  const items = visibleMessages(list);
  if (DEBUG.instant) { // 測試：瞬間出全部訊息，不打字、不延遲
    items.forEach(m => appendMessageItem(msgs, m));
    scrollMsgs();
    schedule(onDone, 10);
    return;
  }
  const pace = fast ? MESSAGE_PACE.fast : MESSAGE_PACE.normal;
  const playback = {
    id: ++playbackSerial,
    container: msgs,
    items,
    shown: new Set(),
    onDone,
    finished: false,
  };
  activePlayback = playback;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '顯示全部 ↓';
  nextBtn.disabled = false;
  let delay = startDelay;
  items.forEach((m, i) => {
    if (m.note !== undefined || m.inner !== undefined) {
      schedule(() => {
        if (activePlayback !== playback || playback.shown.has(i)) return;
        playback.shown.add(i);
        appendMessageItem(msgs, m);
        scrollMsgs();
      }, delay);
      delay += pace.note;
      return;
    }
    const typeTime = Math.min(pace.typeMax, Math.max(pace.typeMin, m.him.length * pace.typePerChar));
    const readTime = Math.min(pace.readMax, Math.max(pace.readMin, m.him.length * pace.readPerChar));

    const tDelay = delay;
    const indicatorId = `anth-typing-${playback.id}-${i}`;
    schedule(() => {
      if (activePlayback !== playback || playback.shown.has(i)) return;
      const grpExists = msgs.querySelector('.msg-group.him-last');
      if (!grpExists) appendHimShell(msgs);
      const rows = msgs.querySelector('.msg-group.him-last .bubble-row');
      const ind = document.createElement('div');
      ind.className = 'typing-indicator';
      ind.id = indicatorId;
      ind.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      rows.appendChild(ind);
      scrollMsgs();
    }, tDelay);

    schedule(() => {
      if (activePlayback !== playback || playback.shown.has(i)) return;
      const ind = document.getElementById(indicatorId);
      if (ind) ind.remove();
      playback.shown.add(i);
      appendMessageItem(msgs, m);
      scrollMsgs();
    }, tDelay + typeTime);

    delay = tDelay + typeTime + readTime;
  });
  schedule(() => finishPlayback(playback), delay + 225);
}

function appendHimShell(container) {
  const grp = document.createElement('div');
  grp.className = 'msg-group him-last';
  const sl = document.createElement('div');
  sl.className = 'msg-sender him';
  sl.textContent = ep.name;
  grp.appendChild(sl);
  const rows = document.createElement('div');
  rows.className = 'bubble-row';
  grp.appendChild(rows);
  container.appendChild(grp);
}

function renderBeat() {
  clearRenderTimers();
  pendingEnd = null;
  const beat = ep.beats[beatIdx];
  const msgs = document.getElementById('messages');
  msgs.innerHTML = '';
  document.getElementById('chatStatus').textContent = beat.status;
  document.getElementById('navProgress').textContent = `第 ${beatIdx + 1} 拍 / ${ep.beats.length}`;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '繼續 →';
  nextBtn.disabled = true;
  clearChoicesArea();
  renderDebugPanel(); // 測試面板開著的話，刷新即時數值

  // 壓力過線（有鏡片的篇）：先演自責螺旋爆發，再進本拍
  if (breakdownPending && ep.lens && ep.lens.breakdown) {
    playMessages(ep.lens.breakdown.messages, 400, () => {
      applyBreakdownEffects();
      refreshRoleBar();
      playMessages(beat.messages, 700, () => showChoices(beat.choices), false);
    }, false);
  } else {
    playMessages(beat.messages, 400, () => showChoices(beat.choices), false);
  }
}

// 角色條即時刷新（SA 會因爆發而降）
function refreshRoleBar() {
  const roleBar = document.getElementById('roleBar');
  if (!ep.lens || roleBar.style.display === 'none') return;
  const tier = insightTier(liveInsight);
  const who = state.archetype ? PLAYER_ARCHETYPES[state.archetype].archetype : '妳';
  roleBar.innerHTML = `你扮演 <b>${who}</b> · 識人之眼 <b class="${tier.cls}">${tier.name}</b> · 說出口 SA <b>${computeSA()}</b>`;
}

function clearChoicesArea() {
  const area = document.getElementById('choicesArea');
  area.classList.remove('is-visible');
  area.querySelectorAll('.choice-btn').forEach(el => el.remove());
  area.style.display = 'none';
  return area;
}

function showChoices(choices) {
  // 識人之眼不夠的玩家，看不到「需要更利的眼睛才會出現」的觀察選項（只能加、不能鎖：天真玩家仍有其餘選項可玩）
  const shown = choices.filter(c => !c.minInsight || liveInsight >= c.minInsight);
  currentChoices = shown;
  const area = clearChoicesArea();
  shown.forEach((c, i) => {
    const dice = !c.alwaysSpeak && ep.lens && c.flag && ep.lens.dice && ep.lens.dice[c.flag]; // 舊抵抗型＝說出口擲骰
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
  requestAnimationFrame(() => area.classList.add('is-visible'));
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
      if (c.memory) memories.add(c.memory);
      liveInsight = Math.min(liveInsight + 1, 8);
      appendYouBubble(c.text);
      scrollMsgs();
      if (c.reply && c.reply.length) playMessages(c.reply, 500, cont, true);
      else schedule(cont, 400);
    } else {
      addStress(STRESS_SWALLOW); // 想抗拒卻吞回去 → 壓力累積
      if (c.failMemory) memories.add(c.failMemory);
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

  if (DEBUG.instant) { settle(); schedule(() => cb(success), 10); return; }

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
  const dice = !c.alwaysSpeak && ep.lens && c.flag && ep.lens.dice && ep.lens.dice[c.flag];
  clearChoicesArea();
  const msgs = document.getElementById('messages');
  breakHimGroup(msgs);

  if (dice) { resolveExpressive(c, dice); return; } // 抵抗型 → 擲骰

  // 這一拍本來有「抵抗」選項，妳卻選了妥協退讓 → 也是違背自己，累積壓力
  if (ep.lens) {
    const beatHadResist = currentChoices.some(x => ep.lens.dice && x.flag && ep.lens.dice[x.flag]);
    if (beatHadResist && !c.end && !c.followup && !c.flag && !c.noStress) addStress(STRESS_COMPLY);
  }

  if (c.flag) { flags.add(c.flag); liveInsight = Math.min(liveInsight + 1, 8); } // 抓到一條線索，眼睛更利一點
  if (c.memory) memories.add(c.memory);

  // 玩家的動作：括號開頭＝行動敘述，否則是訊息泡泡
  if (c.text.startsWith('（')) {
    appendNote(msgs, c.text.replace(/^（|）$/g, ''));
  } else {
    appendYouBubble(c.text);
  }
  scrollMsgs();

  const armEnd = () => {
    pendingEnd = c.end;
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = '看下去 →';
    nextBtn.disabled = false;
  };

  const after = () => {
    if (c.followup) {
      playMessages(c.followup.reply || [], 500, () => showChoices(c.followup.choices), true);
      return;
    }
    if (c.end) {
      // 當面拒絕／封鎖他：有鏡片的篇改用依獵物價值分級的糾纏
      if (ep.lens && ep.lens.clingEnds && ep.lens.clingEnds.includes(c.end)) playClinging(armEnd);
      else armEnd();
      return;
    }
    document.getElementById('nextBtn').disabled = false;
    scrollMsgs();
  };

  // 糾纏結局：跳過原本通用回覆，改演分級糾纏；其餘照舊播放選項回覆
  if (c.end && ep.lens && ep.lens.clingEnds && ep.lens.clingEnds.includes(c.end)) {
    schedule(after, 300);
  } else if (c.reply && c.reply.length) {
    playMessages(c.reply, 500, after, true);
  } else {
    schedule(after, 400);
  }
}

function nextBeat() {
  if (activePlayback) { revealAllMessages(); return; }
  if (pendingEnd) { finish(pendingEnd); return; }
  if (beatIdx < ep.beats.length - 1) {
    beatIdx++;
    renderBeat();
  }
}

// ── 結局與回顧 ──
function finish(endKey) {
  clearRenderTimers();
  const ending = ep.endings[endKey];
  const result = ep.resolveTraits(endKey, flags, hasTrait);

  // 套用特質（先移除再加入）
  let traitBlock = null;
  if (result) {
    const before = result.remove && hasTrait(result.remove);
    if (result.remove) removeTrait(result.remove);
    if (result.add) addTrait(result.add);
    traitBlock = result;
    traitBlock.healed = before && result.add && !result.regress;
  }

  const tierBefore = insightTier(state.insight);
  state.insight = Math.max(state.insight, liveInsight);
  const tierAfter = insightTier(state.insight);
  const insightRose = tierAfter.name !== tierBefore.name;

  state.episodes[ep.id] = { done: true, ending: endKey };
  saveAnth();

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
    a.innerHTML = '<div class="profile-block-label">劇本解剖——他的每一步都對應劇本的哪一頁</div>';
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

  if (ending.showChecklist && ep.telltales) {
    const fc = document.createElement('div');
    fc.className = 'flagcheck-block';
    fc.innerHTML = `<div class="profile-block-label">${ep.id === 'daniel' ? '偽破綻——看起來像紅旗但其實是' : '破綻清單——一直都在那裡的'}</div>`;
    ep.telltales.forEach((t, i) => {
      const hit = t.flag && flags.has(t.flag);
      const row = document.createElement('div');
      row.className = 'flagcheck-row';
      row.style.animationDelay = `${i * 80}ms`;
      const body = t.q
        ? `${t.q}<br><span class="answer">→ ${t.a}</span>`
        : t.text;
      row.innerHTML = `<div class="flagcheck-mark ${hit ? 'hit' : 'miss'}">${hit ? '✓ 妳戳過' : '——'}</div><div class="flagcheck-text">${body}</div>`;
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
    const awardLabel = traitBlock.regress ? '妳的卡片倒退了一格' : ('妳的卡片' + (traitBlock.add ? '被改寫了' : ''));
    tb.innerHTML = `
      <div class="trait-award-label">${awardLabel}</div>
      ${nameHtml}
      <div class="trait-award-desc">${(traitBlock.text || '').replace(/\n/g, '<br>')}</div>`;
    s.appendChild(tb);
  }

  if (insightRose) {
    const ib = document.createElement('div');
    ib.className = 'trait-award';
    ib.innerHTML = `
      <div class="trait-award-label">識人之眼</div>
      <div class="trait-award-name good">↗ ${tierAfter.name}</div>
      <div class="trait-award-desc">${tierAfter.desc}</div>`;
    s.appendChild(ib);
  }

  if (ending.resource) {
    const res = document.createElement('div');
    res.className = 'stat-block';
    res.innerHTML = `<div class="resources">${ending.resource}</div>`;
    s.appendChild(res);
  }

  const back = document.createElement('div');
  back.className = 'replay-area';
  back.innerHTML = `<button class="replay-btn" onclick="renderPool()">回到列表</button><div class="replay-note">你還會遇到別人。</div>`;
  s.appendChild(back);

  show('ending');
  s.scrollTop = 0;
}

// ── 測試面板（只在網址帶 ?debug 時出現；正式遊玩看不到）──
function toggleDebug() {
  const p = document.getElementById('dbgPanel');
  if (p.classList.toggle('open')) renderDebugPanel();
}
function dbgInstant(on) { DEBUG.instant = on; renderDebugPanel(); }
function dbgForce(mode) { DEBUG.force = mode; renderDebugPanel(); }
function dbgArchetype(id) {
  // 快速換角色（不問確認）：重設資源為該原型；在某篇中就重開該篇，否則回池子
  state.archetype = id;
  state.resources = JSON.parse(JSON.stringify(PLAYER_ARCHETYPES[id].resources));
  state.insight = Math.max(state.insight, observationToInsight(state.resources.觀察力));
  saveAnth();
  if (ep && document.getElementById('chatWrap').classList.contains('visible')) startEpisode(ep.id);
  else renderPool();
  renderDebugPanel();
}
function dbgPlay(id) { if (!state.resources) dbgArchetype('everywoman'); startEpisode(id); renderDebugPanel(); }
function dbgStress() { if (ep && ep.lens) addStress(STRESS_SWALLOW); }
function dbgBreak() { if (ep && ep.lens) { stress = stressMax; addStress(0); } } // 過線→下一拍/跳拍時爆發
function dbgJump(n) {
  if (!ep) return;
  clearRenderTimers();
  beatIdx = Math.max(0, Math.min(ep.beats.length - 1, n));
  show('chat');
  renderBeat();
}
function dbgWipe() { localStorage.removeItem(ANTH_KEY); location.reload(); }

function renderDebugPanel() {
  const p = document.getElementById('dbgPanel');
  if (!p || !p.classList.contains('open')) return;
  const hasChar = !!state.resources;
  const inEp = !!ep && document.getElementById('chatWrap').classList.contains('visible');
  const sa = hasChar ? computeSA() : '—';
  const odds = hasChar ? expressiveChance() + '%' : '—';
  const tier = hasChar ? insightTier(liveInsight || state.insight).name : '—';
  const who = state.archetype ? PLAYER_ARCHETYPES[state.archetype].archetype : '（未選角）';
  const prey = (inEp && ep.lens) ? ep.lens.preyValue(state.resources) : null;
  const beatBtns = inEp ? ep.beats.map((b, i) => `<button class="dbg-chip" onclick="dbgJump(${i})">${i + 1}</button>`).join('') : '<span class="dbg-sw">（先進一篇）</span>';
  const forceOpts = [['random', '隨機'], ['win', '必成功'], ['lose', '必失敗']]
    .map(([v, t]) => `<button class="dbg-chip ${DEBUG.force === v ? 'on' : ''}" onclick="dbgForce('${v}')">${t}</button>`).join('');
  const epBtns = POOL_ORDER.map(id => `<button class="dbg-chip" onclick="dbgPlay('${id}')">${EPISODES[id].name}</button>`).join('');
  p.innerHTML = `
    <div class="dbg-title">🛠 測試模式 <button class="dbg-x" onclick="toggleDebug()">✕</button></div>
    <div class="dbg-sect">⏩ 快速模式（關動畫/延遲）
      <label class="dbg-sw"><input type="checkbox" ${DEBUG.instant ? 'checked' : ''} onchange="dbgInstant(this.checked)"> ${DEBUG.instant ? '開' : '關'}</label>
    </div>
    <div class="dbg-sect">🎲 擲骰結果<div class="dbg-row">${forceOpts}</div></div>
    <div class="dbg-sect">⚡ 換角色（重設資源）<div class="dbg-row">
      <button class="dbg-chip" onclick="dbgArchetype('heiress')">富家女</button>
      <button class="dbg-chip" onclick="dbgArchetype('everywoman')">普通</button>
      <button class="dbg-chip" onclick="dbgArchetype('singlemom')">單親媽媽</button>
    </div></div>
    <div class="dbg-sect">📂 跳進某個男人<div class="dbg-row">${epBtns}</div></div>
    <div class="dbg-sect">➡ 跳到第幾拍<div class="dbg-row">${beatBtns}</div></div>
    <div class="dbg-sect">💥 壓力<div class="dbg-row">
      <button class="dbg-chip" onclick="dbgStress()">+22 壓力</button>
      <button class="dbg-chip" onclick="dbgBreak()">逼到爆發</button>
    </div></div>
    <div class="dbg-sect">🔍 隱藏數值（即時）<div class="dbg-state">
      角色：${who}<br>
      SA（說出口）：${sa}　勝算：${odds}<br>
      識人之眼：${tier}（值 ${liveInsight}）<br>
      壓力：${inEp && ep.lens ? stress + ' / ' + stressMax + (brokeDown ? '（已爆發）' : (breakdownPending ? '（下一拍爆發）' : '')) : '—'}<br>
      獵物價值：${prey !== null ? prey + '（' + clingTier(prey) + '）' : '—'}<br>
      傷痕：${state.traits.join('、') || '（無）'}<br>
      已戳破：${[...flags].join('、') || '（無）'}<br>
      場景記憶：${[...memories].join('、') || '（無）'}<br>
      說出口：${spoke.tries ? spoke.wins + ' / ' + spoke.tries : '—'}
    </div></div>
    <div class="dbg-sect"><button class="dbg-chip" onclick="dbgWipe()">🗑 清存檔重來</button></div>`;
}

// ── INIT ──
// 測試鈕只在網址帶 ?debug（如 ?debug=1）時出現——朋友試玩看不到，作者自己測才加。
(function () {
  const t = document.getElementById('dbgToggle');
  if (t && !/[?&]debug/.test(location.search)) t.style.display = 'none';
})();
show('pool');
