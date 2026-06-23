// ── Satirical anthology engine (English playtest build) ──
// The pool IS the menu: one card = one episode. Zero feedback: no numbers shown
// during play; traits are revealed only in the recap and only flavor the tone.
// NOTE: object keys like 觀察力 / 自信 are internal code keys, never shown — left in Chinese on purpose.

const EPISODES = { sebastian: EP_SEBASTIAN, daniel: EP_DANIEL, julian: EP_JULIAN };
const POOL_ORDER = ['sebastian', 'daniel', 'julian'];

// ── Trait definitions ──
const TRAITS = {
  seeThrough: { name: 'Sees Through the Polish', cls: 'good', desc: 'When a detail is too perfect, you now look twice.' },
  silent:     { name: 'Can’t Speak Up',       cls: 'scar', desc: 'Naming your own trouble has become hard.' },
  guarded:    { name: 'Guarded',                  cls: 'edge', desc: 'Armor against predators. A weapon against good people.' },
  jumpy:      { name: 'Jumping at Shadows',       cls: 'scar', desc: 'Your vigilance hurt someone for the first time — and it was you.' },
  trust:      { name: 'Learning to Trust Again',  cls: 'good', desc: 'Wounds heal. It takes time, and a good person.' },
  spoken:     { name: 'Able to Say It',           cls: 'good', desc: 'You spoke your unease aloud, and the world did not end.' },
  selfdoubt:  { name: 'Am I Overthinking It?',    cls: 'scar', desc: 'He taught you to doubt your own feelings. Even anger has to ask first whether it’s your fault.' },
  holdfast:   { name: 'Held Onto Yourself',       cls: 'good', desc: 'He tried to rewrite who you are. You didn’t let him.' },
};

// ── Save ──
// archetype/resources: you live once — who you are and what you bring carries
// across the whole pool and gets rewritten by your dates.
const ANTH_KEY = 'rfd_anthology_en_v1';
let state = { archetype: null, resources: null, traits: [], insight: 0, episodes: {} };
let liveInsight = 0; // live "eye for people" for this episode (starts from save, rises when you catch a tell)
try {
  const raw = localStorage.getItem(ANTH_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* corrupt save: start over */ }

function saveAnth() { localStorage.setItem(ANTH_KEY, JSON.stringify(state)); }
function hasTrait(id) { return state.traits.includes(id); }
function addTrait(id) { if (id && !hasTrait(id)) state.traits.push(id); }
function removeTrait(id) { state.traits = state.traits.filter(t => t !== id); }

// Eye for people: no number shown, only a tier. Higher = you notice more tells.
function insightTier(n) {
  if (n >= 6) return { name: 'Seasoned',   cls: 'good', desc: 'You read what’s off almost at a glance.' };
  if (n >= 3) return { name: 'Perceptive', cls: 'good', desc: 'The little wrong things — you’re starting to see them.' };
  if (n >= 1) return { name: 'Watchful',   cls: '',     desc: 'You look one beat longer than you used to.' };
  return            { name: 'Naive',       cls: '',      desc: 'You still take most people at their word.' };
}

// ── Resource mechanics (only active in episodes that define ep.lens) ──
// Debug: with ?debug, console can flip DEBUG.instant / DEBUG.force
const DEBUG = { instant: false, force: 'random' };
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// Speaking up: SA (a blend of confidence + boundaries) → odds (Mode A: shown up front).
const ODDS_BASE = 48, ODDS_K = 1.6, ODDS_MIN = 25, ODDS_MAX = 88;
function computeSA() {
  const r = state.resources || { 自信: 30, 邊界感: 30 };
  return Math.round(((r.自信 || 0) + (r.邊界感 || 0)) / 2);
}
function expressiveChance() { return clamp(Math.round(ODDS_BASE + (computeSA() - 30) * ODDS_K), ODDS_MIN, ODDS_MAX); }

// Stress: betray yourself → it builds → it breaks. Shown openly (Mode A) so the break never feels random.
const STRESS_SWALLOW = 22;        // wanted to resist but swallowed it (failed roll)
const STRESS_COMPLY  = 12;        // had a resist option but chose to comply
const DRIFT_AFTER_BREAKDOWN = 8;  // after a break, inner resources drift down (persists → harder next time)
function breakdownThreshold() { return ((state.resources && state.resources.韌性) || 50) + 30; }

// Prey-value tiers (how much he wants to keep you). Formula set per-episode by ep.lens.preyValue.
function clingTier(v) { return v >= 60 ? 'high' : (v >= 38 ? 'mid' : 'low'); }

// ── Per-episode live state ──
let ep = null;
let beatIdx = 0;
let flags = new Set();
let pendingEnd = null;
let currentChoices = null;
let stress = 0;
let stressMax = 100;
let brokeDown = false;
let breakdownPending = false;
let diceIv = null;
let spoke = { tries: 0, wins: 0 };

// ── Screen switching ──
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
  if (state.archetype && PILOT_CHARACTERS[state.archetype]) renderPool();
  else renderCharSelect();
}

// ── Character select (you only live once) ──
function statBar(label, val, active, tip) {
  return `
    <div class="stat-row ${active ? 'active' : ''}"${tip ? ` data-tip="${tip}"` : ''}>
      <div class="stat-label">${label}${active ? ' <span class="stat-tag">SHOWN</span>' : ''}</div>
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
    card.onclick = () => selectArchetype(id);
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
        ${statBar('Observation', r.觀察力, true, 'How well you see red flags. The higher it is, the sooner you notice what’s off.')}
        ${statBar('Confidence', r.自信, false, 'Whether you dare to say your unease out loud. Drives your odds of speaking up (SA).')}
        ${statBar('Boundaries', r.邊界感, false, 'Whether you hold your line. Too weak: exploited. Too strong: you build walls. Combines with confidence into SA.')}
        ${statBar('Vigilance', r.警戒 || 0, false, 'Your guard toward strangers. Too low: easily approached. Too high: hurts good people. (Display only for now.)')}
        ${statBar('Resilience', r.韌性, false, 'How long stress grinds before you break. Higher endures longer.')}
      </div>
      <div class="charsel-foot">
        <span class="charsel-eye">Eye for people: <b class="${tier.cls}">${tier.name}</b></span>
        <span class="charsel-cost">Cost to leave: ${c.leaveCost}</span>
      </div>
      <button class="charsel-btn">Choose her, enter the pool →</button>`;
    wrap.appendChild(card);
  });
}

function selectArchetype(id) {
  state.archetype = id;
  state.resources = JSON.parse(JSON.stringify(PILOT_CHARACTERS[id].resources)); // deep copy: dates rewrite resources, don't pollute source
  state.insight = Math.max(state.insight, observationToInsight(state.resources.觀察力));
  saveAnth();
  renderPool();
}

function resetLife() {
  if (confirm('Live a different life? Your traits, eye for people, and progress will all be wiped. Pick a new you.')) {
    state = { archetype: null, resources: null, traits: [], insight: 0, episodes: {} };
    liveInsight = 0;
    saveAnth();
    renderCharSelect();
  }
}

// ── The pool ──
function renderPool() {
  show('pool');
  const wrap = document.getElementById('poolCards');
  wrap.innerHTML = '';

  // Your own card
  const me = document.createElement('div');
  me.className = 'pool-card is-player';
  let traitHtml;
  if (state.traits.length) {
    traitHtml = '<div class="trait-row">' + state.traits.map(t => {
      const tr = TRAITS[t];
      return `<span class="trait-chip ${tr.cls}" title="${tr.desc}">${tr.name}</span>`;
    }).join('') + '</div>';
  } else {
    traitHtml = '<div class="trait-empty">(Still new. For now.)</div>';
  }
  const tier = insightTier(state.insight);
  const meChar = state.archetype ? PILOT_CHARACTERS[state.archetype] : null;
  const meAvatar = meChar ? meChar.avatarStyle : 'background:linear-gradient(135deg,#4a3f6b,#2d3a5a)';
  const meSub = meChar ? `${meChar.archetype} · Eye for people: ${tier.name}` : `Eye for people · ${tier.name}`;
  me.innerHTML = `
    <div class="pool-card-top">
      <div class="pool-avatar" style="${meAvatar}">You</div>
      <div>
        <div class="pool-card-name">You</div>
        <div class="pool-card-sub">${meSub}</div>
      </div>
    </div>${traitHtml}`;
  wrap.appendChild(me);

  // The people in the pool
  POOL_ORDER.forEach((id, i) => {
    const e = EPISODES[id];
    const st = state.episodes[id] || {};
    const card = document.createElement('div');
    card.className = 'pool-card' + (st.done ? ' done' : '');
    card.style.animationDelay = `${(i + 1) * 90}ms`;
    let stateLine = '';
    if (st.done) {
      const endTitle = e.endings[st.ending] ? e.endings[st.ending].title : '';
      stateLine = `<div class="pool-card-state"><span class="done-tag">Finished</span> · ${endTitle} · tap to reread</div>`;
    } else if (st.skipped) {
      stateLine = '<div class="pool-card-state"><span class="skip-tag">You swiped past him · he’s still in the pool</span></div>';
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
    ? 'End of the first pool.<br>…deep in the pool, a “typing…” bubble flickers once.'
    : 'Open a card. Look closely. Then decide.<br>Leaving is always one of the options.';
  foot.innerHTML = footLine +
    '<div class="pool-reset"><button class="pool-reset-btn" onclick="resetLife()">Live a different life ↺</button></div>';
  renderDebugPanel();
}

// ── Profile ──
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
      <div class="profile-block-label">Photos</div>
      ${e.profile.photos.map(p => `<div class="profile-photo-item">${p}</div>`).join('')}
    </div>
    <div class="profile-block-label">About</div>
    <div class="profile-bio">${e.profile.bio}</div>
    <div class="profile-actions">
      <button class="profile-btn back" onclick="renderPool()">←</button>
      <button class="profile-btn" onclick="skipProfile('${id}')">✕ Skip</button>
      <button class="profile-btn match" onclick="startEpisode('${id}')">${st.done ? '↻ Read again' : '♥ Match'}</button>
    </div>`;
  show('profile');
}

function skipProfile(id) {
  state.episodes[id] = Object.assign({}, state.episodes[id], { skipped: true });
  saveAnth();
  renderPool();
}

// ── Story playback ──
let renderTimers = [];
function schedule(fn, ms) { renderTimers.push(setTimeout(fn, ms)); }
function clearRenderTimers() {
  renderTimers.forEach(clearTimeout); renderTimers = [];
  if (diceIv) { clearInterval(diceIv); diceIv = null; }
}

function startEpisode(id) {
  ep = EPISODES[id];
  beatIdx = 0;
  flags = new Set();
  pendingEnd = null;
  liveInsight = state.insight;
  document.getElementById('chatAvatar').textContent = ep.avatarText;
  document.getElementById('chatAvatar').setAttribute('style', ep.avatarStyle);
  document.getElementById('chatName').textContent = ep.name;

  const roleBar = document.getElementById('roleBar');
  const stressWrap = document.getElementById('stressWrap');
  spoke = { tries: 0, wins: 0 };
  if (ep.lens && state.resources) {
    stress = state.resources.壓力 || 0;
    stressMax = breakdownThreshold();
    brokeDown = false;
    breakdownPending = false;
    const tier = insightTier(liveInsight);
    const who = state.archetype ? PILOT_CHARACTERS[state.archetype].archetype : 'You';
    roleBar.innerHTML = `Playing as <b>${who}</b> · Eye for people <b class="${tier.cls}">${tier.name}</b> · Speak-up SA <b>${computeSA()}</b>`;
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

// ── Stress (visible bar) ──
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
  if (!brokeDown && stress >= stressMax) breakdownPending = true;
  updateStressBar();
  renderDebugPanel();
}

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

function playClinging(onDone) {
  const tier = clingTier(ep.lens.preyValue(state.resources));
  const set = (ep.lens.clinging && ep.lens.clinging[tier]) || (ep.lens.clinging && ep.lens.clinging.mid) || [];
  breakHimGroup(document.getElementById('messages'));
  playMessages(set, 600, onDone, true);
}

function confirmExit() {
  if (confirm('Put the phone down and go back to the pool? Your progress in this story won’t be saved.')) {
    clearRenderTimers();
    renderPool();
  }
}

function visibleMessages(list) {
  return list.filter(m => {
    if (m.trait && !hasTrait(m.trait)) return false;
    if (m.skipIfTrait && hasTrait(m.skipIfTrait)) return false;
    if (m.minInsight && liveInsight < m.minInsight) return false; // not enough eye for people to see this tell
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

// Play messages one by one (typing + reading time scaled by length)
function playMessages(list, startDelay, onDone, fast) {
  const msgs = document.getElementById('messages');
  if (DEBUG.instant) {
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
  document.getElementById('navProgress').textContent = `Beat ${beatIdx + 1} / ${ep.beats.length}`;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = 'Continue →';
  nextBtn.disabled = true;
  document.getElementById('choicesArea').style.display = 'none';
  renderDebugPanel();

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

function refreshRoleBar() {
  const roleBar = document.getElementById('roleBar');
  if (!ep.lens || roleBar.style.display === 'none') return;
  const tier = insightTier(liveInsight);
  const who = state.archetype ? PILOT_CHARACTERS[state.archetype].archetype : 'You';
  roleBar.innerHTML = `Playing as <b>${who}</b> · Eye for people <b class="${tier.cls}">${tier.name}</b> · Speak-up SA <b>${computeSA()}</b>`;
}

function showChoices(choices) {
  const shown = choices.filter(c => !c.minInsight || liveInsight >= c.minInsight);
  currentChoices = shown;
  const area = document.getElementById('choicesArea');
  area.querySelectorAll('.choice-btn').forEach(el => el.remove());
  shown.forEach((c, i) => {
    const dice = ep.lens && c.flag && ep.lens.dice && ep.lens.dice[c.flag];
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (c.minInsight ? ' insight' : '') + (dice ? ' resist' : '');
    if (dice) {
      btn.innerHTML = `<span class="choice-main"></span><span class="odds">Speak up · ${expressiveChance()}% odds</span>`;
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
  yl.textContent = 'You';
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
      addStress(STRESS_SWALLOW);
      const bubble = appendYouBubble(c.text);
      scrollMsgs();
      const d1 = DEBUG.instant ? 10 : 500, d2 = DEBUG.instant ? 10 : 950;
      schedule(() => {
        bubble.classList.add('retracting');
        schedule(() => {
          const grp = bubble.closest('.msg-group');
          if (grp) grp.remove();
          appendInner(msgs, dice.failInner);
          scrollMsgs();
          playMessages(dice.failReply || [], DEBUG.instant ? 10 : 700, cont, true);
        }, d2);
      }, d1);
    }
  });
}

function rollDice(text, chance, cb) {
  const msgs = document.getElementById('messages');
  const panel = document.createElement('div');
  panel.className = 'dice-panel';
  panel.innerHTML = `
    <div class="dice-label">Speak up · check</div>
    <div class="dice-say"></div>
    <div class="dice-meter">
      <span class="dice-odds">${chance}% odds</span>
      <span class="dice-roll" id="diceRoll">··</span>
    </div>
    <div class="dice-result" id="diceResult">rolling…</div>`;
  panel.querySelector('.dice-say').textContent = text;
  msgs.appendChild(panel);
  scrollMsgs();
  const rollEl = panel.querySelector('#diceRoll');
  const resEl = panel.querySelector('#diceResult');
  let success, final;
  if (DEBUG.force === 'win')  { success = true;  final = Math.floor(Math.random() * chance); }
  else if (DEBUG.force === 'lose') { success = false; final = chance + Math.floor(Math.random() * (100 - chance)); }
  else { final = Math.floor(Math.random() * 100); success = final < chance; }

  const settle = () => {
    rollEl.textContent = final;
    rollEl.classList.add(success ? 'ok' : 'no');
    resEl.textContent = success ? '✓ You said it' : '✗ The words slipped back down';
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
  const dice = ep.lens && c.flag && ep.lens.dice && ep.lens.dice[c.flag];
  document.getElementById('choicesArea').style.display = 'none';
  const msgs = document.getElementById('messages');
  breakHimGroup(msgs);

  if (dice) { resolveExpressive(c, dice); return; }

  if (ep.lens) {
    const beatHadResist = currentChoices.some(x => ep.lens.dice && x.flag && ep.lens.dice[x.flag]);
    if (beatHadResist && !c.end && !c.followup && !c.flag) addStress(STRESS_COMPLY);
  }

  if (c.flag) { flags.add(c.flag); liveInsight = Math.min(liveInsight + 1, 8); }

  // A choice wrapped in ( ) is an action/narration; otherwise it's a message bubble.
  if (c.text.startsWith('(')) {
    appendNote(msgs, c.text.replace(/^\(|\)$/g, ''));
  } else {
    appendYouBubble(c.text);
  }
  scrollMsgs();

  const armEnd = () => {
    pendingEnd = c.end;
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = 'See it through →';
    nextBtn.disabled = false;
  };

  const after = () => {
    if (c.followup) {
      playMessages(c.followup.reply || [], 500, () => showChoices(c.followup.choices), true);
      return;
    }
    if (c.end) {
      if (ep.lens && ep.lens.clingEnds && ep.lens.clingEnds.includes(c.end)) playClinging(armEnd);
      else armEnd();
      return;
    }
    document.getElementById('nextBtn').disabled = false;
    scrollMsgs();
  };

  if (c.end && ep.lens && ep.lens.clingEnds && ep.lens.clingEnds.includes(c.end)) {
    schedule(after, 300);
  } else if (c.reply && c.reply.length) {
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

// ── Ending & recap ──
function finish(endKey) {
  clearRenderTimers();
  const ending = ep.endings[endKey];
  const result = ep.resolveTraits(endKey, flags, hasTrait);

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
  kick.textContent = ending.kicker || 'Ending';
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
    a.innerHTML = '<div class="profile-block-label">Anatomy of the script — each of his moves, and the page it came from</div>';
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
    ab.innerHTML = `<div class="dodge-label" style="color:var(--text-dim)">A word for you</div><div class="dodge-text">${ending.absolve.replace(/\n/g, '<br>')}</div>`;
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
    fc.innerHTML = `<div class="profile-block-label">${ep.id === 'daniel' ? 'False tells — what looked like a red flag, and what it really was' : 'The tells — they were there the whole time'}</div>`;
    ep.telltales.forEach((t, i) => {
      const hit = t.flag && flags.has(t.flag);
      const row = document.createElement('div');
      row.className = 'flagcheck-row';
      row.style.animationDelay = `${i * 80}ms`;
      const body = t.q
        ? `${t.q}<br><span class="answer">→ ${t.a}</span>`
        : t.text;
      row.innerHTML = `<div class="flagcheck-mark ${hit ? 'hit' : 'miss'}">${hit ? '✓ you probed' : '——'}</div><div class="flagcheck-text">${body}</div>`;
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
    const awardLabel = traitBlock.regress ? 'Your card slipped back a notch' : ('Your card' + (traitBlock.add ? ' was rewritten' : ''));
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
      <div class="trait-award-label">Eye for people</div>
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
  back.innerHTML = `<button class="replay-btn" onclick="renderPool()">Back to the pool</button><div class="replay-note">There are others in the pool.</div>`;
  s.appendChild(back);

  show('ending');
  s.scrollTop = 0;
}

// ── Debug panel (only with ?debug in the URL; players never see it) ──
function toggleDebug() {
  const p = document.getElementById('dbgPanel');
  if (p.classList.toggle('open')) renderDebugPanel();
}
function dbgInstant(on) { DEBUG.instant = on; renderDebugPanel(); }
function dbgForce(mode) { DEBUG.force = mode; renderDebugPanel(); }
function dbgArchetype(id) {
  state.archetype = id;
  state.resources = JSON.parse(JSON.stringify(PILOT_CHARACTERS[id].resources));
  state.insight = Math.max(state.insight, observationToInsight(state.resources.觀察力));
  saveAnth();
  if (ep && document.getElementById('chatWrap').classList.contains('visible')) startEpisode(ep.id);
  else renderPool();
  renderDebugPanel();
}
function dbgPlay(id) { if (!state.resources) dbgArchetype('everywoman'); startEpisode(id); renderDebugPanel(); }
function dbgStress() { if (ep && ep.lens) addStress(STRESS_SWALLOW); }
function dbgBreak() { if (ep && ep.lens) { stress = stressMax; addStress(0); } }
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
  const who = state.archetype ? PILOT_CHARACTERS[state.archetype].archetype : '(no character)';
  const prey = (inEp && ep.lens) ? ep.lens.preyValue(state.resources) : null;
  const beatBtns = inEp ? ep.beats.map((b, i) => `<button class="dbg-chip" onclick="dbgJump(${i})">${i + 1}</button>`).join('') : '<span class="dbg-sw">(enter an episode first)</span>';
  const forceOpts = [['random', 'Random'], ['win', 'Always win'], ['lose', 'Always lose']]
    .map(([v, t]) => `<button class="dbg-chip ${DEBUG.force === v ? 'on' : ''}" onclick="dbgForce('${v}')">${t}</button>`).join('');
  const epBtns = POOL_ORDER.map(id => `<button class="dbg-chip" onclick="dbgPlay('${id}')">${EPISODES[id].name}</button>`).join('');
  p.innerHTML = `
    <div class="dbg-title">🛠 Debug mode <button class="dbg-x" onclick="toggleDebug()">✕</button></div>
    <div class="dbg-sect">⏩ Fast mode (no animation/delay)
      <label class="dbg-sw"><input type="checkbox" ${DEBUG.instant ? 'checked' : ''} onchange="dbgInstant(this.checked)"> ${DEBUG.instant ? 'on' : 'off'}</label>
    </div>
    <div class="dbg-sect">🎲 Roll result<div class="dbg-row">${forceOpts}</div></div>
    <div class="dbg-sect">⚡ Swap character (reset resources)<div class="dbg-row">
      <button class="dbg-chip" onclick="dbgArchetype('heiress')">Heiress</button>
      <button class="dbg-chip" onclick="dbgArchetype('everywoman')">Everywoman</button>
      <button class="dbg-chip" onclick="dbgArchetype('singlemom')">Single mom</button>
    </div></div>
    <div class="dbg-sect">📂 Jump into a man<div class="dbg-row">${epBtns}</div></div>
    <div class="dbg-sect">➡ Jump to beat<div class="dbg-row">${beatBtns}</div></div>
    <div class="dbg-sect">💥 Stress<div class="dbg-row">
      <button class="dbg-chip" onclick="dbgStress()">+22 stress</button>
      <button class="dbg-chip" onclick="dbgBreak()">Force a break</button>
    </div></div>
    <div class="dbg-sect">🔍 Hidden values (live)<div class="dbg-state">
      Character: ${who}<br>
      SA (speak up): ${sa}　Odds: ${odds}<br>
      Eye for people: ${tier} (value ${liveInsight})<br>
      Stress: ${inEp && ep.lens ? stress + ' / ' + stressMax + (brokeDown ? ' (broke down)' : (breakdownPending ? ' (breaks next beat)' : '')) : '—'}<br>
      Prey value: ${prey !== null ? prey + ' (' + clingTier(prey) + ')' : '—'}<br>
      Scars: ${state.traits.join(', ') || '(none)'}<br>
      Probed: ${[...flags].join(', ') || '(none)'}<br>
      Spoke up: ${spoke.tries ? spoke.wins + ' / ' + spoke.tries : '—'}
    </div></div>
    <div class="dbg-sect"><button class="dbg-chip" onclick="dbgWipe()">🗑 Wipe save & restart</button></div>`;
}

// ── INIT ──
// The debug button only appears with ?debug in the URL — friends playtesting won't see it.
(function () {
  const t = document.getElementById('dbgToggle');
  if (t && !/[?&]debug/.test(location.search)) t.style.display = 'none';
})();
show('pool');
