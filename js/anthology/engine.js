// ── 諷刺選集引擎 ──
// 池子即選單：一張卡＝一篇。零回饋：遊戲中不顯示任何數值；
// 特質只在回顧揭曉，只改味道、永不鎖內容。

const EPISODES = { sebastian: EP_SEBASTIAN, daniel: EP_DANIEL };
const POOL_ORDER = ['sebastian', 'daniel'];

// ── 特質定義 ──
const TRAITS = {
  seeThrough: { name: '看穿包裝', cls: 'good', desc: '太完美的細節，妳現在會多看一眼。' },
  silent:     { name: '不敢開口', cls: 'scar', desc: '說出自己的困境，變得很難。' },
  guarded:    { name: '防衛心',   cls: 'edge', desc: '對掠食者是盔甲。對好人，是凶器。' },
  jumpy:      { name: '草木皆兵', cls: 'scar', desc: '警覺第一次傷到人——傷到的是妳自己。' },
  trust:      { name: '重新學會信任', cls: 'good', desc: '傷會好。需要時間，和一個好的人。' },
  spoken:     { name: '說得出口', cls: 'good', desc: '妳把不安說出口，世界沒有塌。' },
};

// ── 存檔 ──
const ANTH_KEY = 'rfd_anthology_v1';
let state = { traits: [], insight: 0, episodes: {} };
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
  if (n >= 3) return { name: '識人', cls: 'good', desc: '那些不對勁的小地方，你開始看得見了。' };
  if (n >= 1) return { name: '留心', cls: '',     desc: '你比以前多看了一眼。' };
  return            { name: '天真', cls: '',      desc: '你還願意相信大部分人說的話。' };
}

// ── 單篇進行中的狀態 ──
let ep = null;
let beatIdx = 0;
let flags = new Set();
let pendingEnd = null;
let currentChoices = null;

// ── 畫面切換 ──
function show(id) {
  document.getElementById('poolScreen').classList.toggle('visible', id === 'pool');
  document.getElementById('profileView').classList.toggle('visible', id === 'profile');
  document.getElementById('chatWrap').classList.toggle('visible', id === 'chat');
  document.getElementById('endingScreen').classList.toggle('visible', id === 'ending');
}

function anthStart() {
  const ts = document.getElementById('titleScreen');
  ts.classList.add('hiding');
  setTimeout(() => { ts.style.display = 'none'; }, 600);
  renderPool();
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
  me.innerHTML = `
    <div class="pool-card-top">
      <div class="pool-avatar" style="background:linear-gradient(135deg,#4a3f6b,#2d3a5a)">妳</div>
      <div>
        <div class="pool-card-name">妳</div>
        <div class="pool-card-sub">識人之眼 · ${tier.name}</div>
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
      stateLine = '<div class="pool-card-state"><span class="skip-tag">妳滑掉過他 · 他還在池子裡</span></div>';
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
  foot.innerHTML = allDone
    ? '第一池結束。<br>……池子深處，一個「正在輸入」的氣泡，閃了一下。'
    : '點開卡片，看仔細，再決定。<br>離開，永遠是選項之一。';
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
function schedule(fn, ms) { renderTimers.push(setTimeout(fn, ms)); }
function clearRenderTimers() { renderTimers.forEach(clearTimeout); renderTimers = []; }

function startEpisode(id) {
  ep = EPISODES[id];
  beatIdx = 0;
  flags = new Set();
  pendingEnd = null;
  liveInsight = state.insight;
  document.getElementById('chatAvatar').textContent = ep.avatarText;
  document.getElementById('chatAvatar').setAttribute('style', ep.avatarStyle);
  document.getElementById('chatName').textContent = ep.name;
  show('chat');
  renderBeat();
}

function confirmExit() {
  if (confirm('要放下手機、回到池子嗎？這一篇的進度不會保留。')) {
    clearRenderTimers();
    renderPool();
  }
}

function visibleMessages(list) {
  return list.filter(m => {
    if (m.trait && !hasTrait(m.trait)) return false;
    if (m.skipIfTrait && hasTrait(m.skipIfTrait)) return false;
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

// 逐則播放（沿用 Hannah 的節奏邏輯：打字時間與閱讀時間依字數）
function playMessages(list, startDelay, onDone, fast) {
  const msgs = document.getElementById('messages');
  let delay = startDelay;
  visibleMessages(list).forEach((m, i) => {
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
      ind.id = `anth-typing-${tDelay}`;
      ind.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      rows.appendChild(ind);
      scrollMsgs();
    }, tDelay);

    schedule(() => {
      const ind = document.getElementById(`anth-typing-${tDelay}`);
      if (ind) ind.remove();
      appendHim(msgs, m);
      scrollMsgs();
    }, tDelay + typeTime);

    delay = tDelay + typeTime + readTime;
  });
  schedule(onDone, delay + 300);
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
  document.getElementById('choicesArea').style.display = 'none';

  playMessages(beat.messages, 400, () => {
    showChoices(beat.choices);
  }, false);
}

function showChoices(choices) {
  // 識人之眼不夠的玩家，看不到「需要更利的眼睛才會出現」的觀察選項（只能加、不能鎖：天真玩家仍有其餘選項可玩）
  const shown = choices.filter(c => !c.minInsight || liveInsight >= c.minInsight);
  currentChoices = shown;
  const area = document.getElementById('choicesArea');
  area.querySelectorAll('.choice-btn').forEach(el => el.remove());
  shown.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (c.minInsight ? ' insight' : '');
    btn.textContent = c.text;
    btn.onclick = () => choose(i);
    area.appendChild(btn);
  });
  area.style.display = 'flex';
  scrollMsgs();
}

function choose(i) {
  const c = currentChoices[i];
  if (c.flag) { flags.add(c.flag); liveInsight = Math.min(liveInsight + 1, 8); } // 抓到一條線索，眼睛更利一點
  document.getElementById('choicesArea').style.display = 'none';
  const msgs = document.getElementById('messages');
  breakHimGroup(msgs);

  // 玩家的動作：括號開頭＝行動敘述，否則是訊息泡泡
  if (c.text.startsWith('（')) {
    appendNote(msgs, c.text.replace(/^（|）$/g, ''));
  } else {
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
    yb.textContent = c.text;
    yr.appendChild(yb);
    grp.appendChild(yr);
    msgs.appendChild(grp);
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
    traitBlock.healed = before && result.add;
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

  if (ending.showChecklist && ep.telltales) {
    const fc = document.createElement('div');
    fc.className = 'flagcheck-block';
    fc.innerHTML = `<div class="profile-block-label">${ep.id === 'daniel' ? '偽破綻——看起來像紅旗的，其實是' : '破綻清單——一直都在那裡的'}</div>`;
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
      nameHtml = `<div class="trait-award-name ${tr.cls}">${traitBlock.healed ? '✦ ' : '＋ '}${tr.name}</div>`;
    }
    tb.innerHTML = `
      <div class="trait-award-label">妳的卡片${traitBlock.add ? '被改寫了' : ''}</div>
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
  back.innerHTML = `<button class="replay-btn" onclick="renderPool()">回到池子</button><div class="replay-note">池子裡，還有別人。</div>`;
  s.appendChild(back);

  show('ending');
  s.scrollTop = 0;
}

// ── INIT ──
show('pool');
