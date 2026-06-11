// ── SELF-AWARENESS SYSTEM ──
// SA starts at 70 and erodes naturally through the story.
// Player choices can slow the erosion, stabilize, or occasionally
// accelerate it (talking too much too soon can backfire).
// Final SA determines which outcome POOL is available.
// Within a pool, outcomes are fixed per run — same SA = same fate.
// But pool boundaries create meaningful variation across playthroughs.

let SA = 70; // base value, 0–100

// SA erodes passively at danger/flag events regardless of choice
const PASSIVE_EROSION = { sweet:0, 'has-flag':-3, danger:-6 };

// ── STATE ──
let current = 0;
let chosen = {};
let currentFate = null;

// ── SAVE / LOAD ──
const SAVE_KEY = 'rfd_hannah_save';

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ SA, current, chosen }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    SA = state.SA ?? 70;
    current = state.current ?? 0;
    chosen = state.chosen ?? {};
    return true;
  } catch(e) {
    return false;
  }
}

function restoreLastNoted() {
  const chosenIds = Object.keys(chosen).map(Number).sort((a, b) => b - a);
  for (const id of chosenIds) {
    if (EVENTS[id]?.lastNoted) {
      updateLastNoted(EVENTS[id].lastNoted);
      return;
    }
  }
}

// ── SA HELPERS ──
function getPool(sa) {
  if (sa >= 52) return 'high';
  if (sa >= 28) return 'mid';
  return 'low';
}

function getSALabel(sa) {
  if (sa >= 60) return {text:'完整', cls:'high'};
  if (sa >= 40) return {text:'動搖中', cls:'mid'};
  if (sa >= 20) return {text:'消退中', cls:'mid'};
  return {text:'幾乎消失', cls:'low'};
}

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function rollFate(sa) {
  const pool = getPool(sa);
  const eligible = FATES.filter(f => f.pool === pool);
  const totalWeight = eligible.reduce((s,f) => s+f.weight, 0);
  let r = seededRandom(Math.round(sa)) * totalWeight;
  for (const f of eligible) {
    r -= f.weight;
    if (r <= 0) return f;
  }
  return eligible[eligible.length-1];
}

function applyChoice(eventId, opt) {
  const ev = EVENTS[eventId];
  const delta = opt === 'a' ? ev.choice.a.sa : ev.choice.b.sa;
  const passive = PASSIVE_EROSION[ev.type] || 0;
  SA = Math.max(0, Math.min(100, SA + delta + passive));
  updateSABar();
  flashDelta(delta + passive);
}

function updateSABar() {
  const fill = document.getElementById('saBarFill');
  const label = document.getElementById('saLabel');
  const info = getSALabel(SA);
  fill.style.width = SA + '%';
  fill.style.background = info.cls === 'high' ? 'var(--green)' : info.cls === 'mid' ? 'var(--warning)' : 'var(--accent)';
  label.textContent = info.text;
  label.style.color = info.cls === 'high' ? 'var(--green)' : info.cls === 'mid' ? 'var(--warning)' : 'var(--accent)';
}

function flashDelta(delta) {
  if (delta === 0) return;
  const el = document.getElementById('saDelta');
  el.className = `sa-delta ${delta > 0 ? 'pos' : 'neg'}`;
  el.textContent = delta > 0 ? `↑ 自我察覺 +${delta}` : `↓ 自我察覺 ${delta}`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

// ── TELLTALE PROMPT ──
function showTelltale(text) {
  const el = document.getElementById('telltalePrompt');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
}

// ── LAST NOTED ──
function updateLastNoted(text) {
  const el = document.getElementById('lastNotedText');
  el.classList.add('updating');
  setTimeout(() => {
    el.textContent = text ? `"${text}"` : '—';
    el.classList.remove('updating');
  }, 400);
}

// ── SIDEBAR ──
function showSidebar() {
  document.getElementById('timelineSidebar').classList.add('revealed');
}

function hideSidebar() {
  document.getElementById('timelineSidebar').classList.remove('revealed');
}

// ── EPILOGUE ──
function showEpilogue() {
  currentFate = rollFate(SA);
  document.getElementById('messages').style.display = 'none';
  document.getElementById('choicesArea').style.display = 'none';
  document.getElementById('navArea').style.display = 'none';
  document.getElementById('chatStatus').textContent = '2024–2025';
  if (currentFate.avatarFade) document.getElementById('avatar').classList.add('faded');

  showSidebar();
  buildTimeline(true);

  const ep = document.getElementById('epilogueScreen');
  ep.innerHTML = ''; ep.classList.add('visible');

  // SA status card
  const saInfo = getSALabel(SA);
  const saCard = document.createElement('div');
  saCard.className = 'ep-sa-status';
  saCard.innerHTML = `
    <div>
      <div class="ep-sa-label">自我察覺——最終狀態</div>
      <div class="ep-sa-value ${saInfo.cls}">${saInfo.text} &nbsp;·&nbsp; ${SA}</div>
    </div>`;
  ep.appendChild(saCard);

  // "回頭看" — deferred alert section
  const hindsightNotes = EVENTS.filter(ev => ev.epilogueNote).map(ev => ev.epilogueNote);
  if (hindsightNotes.length > 0) {
    const lb = document.createElement('div');
    lb.className = 'ck-log';
    lb.style.cssText = 'margin-bottom:40px;';
    const lbHeader = document.createElement('div');
    lbHeader.className = 'ck-log-header';
    lbHeader.innerHTML = `<span class="ck-log-subject">回頭看</span><span class="ck-log-date">2023年3月 – 2024年1月</span>`;
    lb.appendChild(lbHeader);
    hindsightNotes.forEach((note, i) => {
      const row = document.createElement('div');
      row.className = 'ck-entry';
      row.style.animationDelay = `${i * 100}ms`;
      row.innerHTML = `
        <div class="ck-entry-date" style="color:var(--text-dimmer);min-width:90px;">——</div>
        <div class="ck-entry-body">
          <div class="ck-entry-text" style="color:var(--text-dim);font-size:12px;line-height:1.9;">${note}</div>
        </div>`;
      lb.appendChild(row);
    });
    ep.appendChild(lb);
  }

  // Mirror — High pool only
  if (getPool(SA) === 'high') {
    const mir = document.createElement('div');
    mir.className = 'ep-mirror';
    mir.innerHTML = `
      <div class="ep-mirror-label">你在哪裡見過這些？</div>
      <div class="ep-mirror-text">${MIRROR.text}</div>
      <div class="ep-mirror-sources">${MIRROR.sourcesLabel}</div>
      <div class="ep-mirror-tags">${MIRROR.sources.map(s => `<span class="ep-mirror-tag">${s}</span>`).join('')}</div>`;
    ep.appendChild(mir);
  }

  // Case references — 4 cases, alternating real/fiction
  const selectedCases = selectCases(4);
  if (selectedCases.length > 0) {
    const caseBlock = document.createElement('div');
    caseBlock.className = 'ep-cases';
    const caseHeader = document.createElement('div');
    caseHeader.className = 'ep-cases-header';
    caseHeader.innerHTML = `<span class="ep-cases-title">你不是第一個旁觀這一切的人</span><span class="ep-cases-sub">真實 ＆ 虛構</span>`;
    caseBlock.appendChild(caseHeader);
    selectedCases.forEach((c, i) => {
      const entry = document.createElement('div');
      entry.className = 'ep-case-entry';
      entry.style.animationDelay = `${i * 80}ms`;
      entry.innerHTML = `
        <div class="ep-case-type ${c.type}">${c.type === 'real' ? '真實' : '虛構'}</div>
        <div class="ep-case-body">
          <div class="ep-case-title">${c.title}</div>
          <div class="ep-case-quote">${c.quote}</div>
        </div>`;
      caseBlock.appendChild(entry);
    });
    ep.appendChild(caseBlock);
  }

  // CK3 journal — Hannah's fate
  const log = document.createElement('div'); log.className = 'ck-log';
  const logHeader = document.createElement('div'); logHeader.className = 'ck-log-header';
  const isDeadEnding = currentFate.id === 'dead';
  logHeader.innerHTML = isDeadEnding
    ? `<span class="ck-log-subject" style="color:var(--accent)">她記住了。</span><span class="ck-log-date"></span>`
    : `<span class="ck-log-subject">Hannah Chen — 事件記錄</span><span class="ck-log-date">關係開始：2023年3月</span>`;
  log.appendChild(logHeader);

  currentFate.entries.forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = `ck-entry${currentFate.rare ? ' rare' : ''}`;
    row.style.animationDelay = `${i * 120}ms`;
    const dateEl = document.createElement('div'); dateEl.className = 'ck-entry-date'; dateEl.textContent = entry.date;
    const body = document.createElement('div'); body.className = 'ck-entry-body';
    const titleEl = document.createElement('div'); titleEl.className = 'ck-entry-title'; titleEl.textContent = entry.title;
    const textEl = document.createElement('div');
    if (entry.void || entry.text === null) {
      textEl.className = 'ck-entry-text void';
      textEl.textContent = '——  此後無記錄。';
    } else {
      textEl.className = 'ck-entry-text'; textEl.textContent = entry.text;
    }
    body.appendChild(titleEl); body.appendChild(textEl);
    row.appendChild(dateEl); row.appendChild(body);
    log.appendChild(row);
  });
  ep.appendChild(log);

  if (currentFate.lastOnline) {
    const lo = document.createElement('div'); lo.className = 'last-online-strip';
    lo.innerHTML = `<div class="lo-dot"></div><div class="lo-text">${currentFate.lastOnline}</div>`;
    ep.appendChild(lo);
  }

  if (currentFate.friendship) {
    const fw = document.createElement('div');
    fw.style.cssText = 'font-family:var(--font-mono);font-size:11px;color:var(--text-dimmer);padding:14px 0;border-bottom:1px solid var(--border);';
    fw.textContent = currentFate.friendship;
    ep.appendChild(fw);
  }

  const iv = document.createElement('div'); iv.className = 'your-voice';
  iv.innerHTML = `<div class="your-voice-label">你的內心</div><div class="your-voice-text">${currentFate.innerVoice}</div>`;
  ep.appendChild(iv);

  const stat = document.createElement('div'); stat.className = 'stat-block';
  stat.innerHTML = `
    <div class="stat-main">在台灣，每 4 位女性中就有 1 位曾遭受親密伴侶暴力。</div>
    <div class="stat-sub">你看見的是真實的。<br>你感受到的是真實的。</div>
    <div class="resources">台灣家暴專線 113 &nbsp;·&nbsp; 全年 24 小時</div>`;
  ep.appendChild(stat);

  const replay = document.createElement('div'); replay.className = 'replay-area';
  replay.innerHTML = `<button class="replay-btn" onclick="resetGame()">再玩一次</button><div class="replay-note">同樣的選擇，不一定通向同樣的地方。</div>`;
  ep.appendChild(replay);
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  chosen = {}; current = 0; currentFate = null; SA = 70;
  document.getElementById('avatar').classList.remove('faded');
  document.getElementById('messages').style.display = 'flex';
  document.getElementById('navArea').style.display = 'flex';
  const ep = document.getElementById('epilogueScreen');
  ep.classList.remove('visible'); ep.innerHTML = '';
  document.getElementById('lastNotedText').textContent = '—';
  updateSABar();
  hideSidebar();
  buildTimeline(false);
  renderEvent(0);
}

// ── TIMELINE ──
function buildTimeline(epActive) {
  const scroll = document.getElementById('timelineScroll');
  scroll.innerHTML = '';
  let lastMonth = '';
  EVENTS.forEach((ev, i) => {
    if (ev.month !== lastMonth) {
      const ml = document.createElement('div'); ml.className = 'month-label'; ml.textContent = ev.month;
      scroll.appendChild(ml); lastMonth = ev.month;
    }
    const item = document.createElement('div');
    const isActive = !epActive && i === current;
    const isLocked = !epActive && i > current;
    item.className = `event-item ${ev.type} ${isActive?'active':''} ${isLocked?'locked':''}`;
    if (!isLocked && !epActive) item.onclick = () => goTo(i);
    ['event-dot','event-line'].forEach(c => { const d=document.createElement('div'); d.className=c; item.appendChild(d); });
    const t=document.createElement('div'); t.className='event-title'; t.textContent=ev.title; item.appendChild(t);
    const d=document.createElement('div'); d.className='event-date'; d.textContent=ev.month; item.appendChild(d);
    scroll.appendChild(item);
  });
  const epItem = document.createElement('div');
  epItem.className = `event-item ${epActive?'active':'locked'}`;
  ['event-dot'].forEach(c=>{const d=document.createElement('div');d.className=c;epItem.appendChild(d);});
  const et=document.createElement('div'); et.className='event-title';
  et.textContent = epActive && currentFate ? currentFate.title : '——'; epItem.appendChild(et);
  const ed=document.createElement('div'); ed.className='event-date'; ed.textContent='2024–2025'; epItem.appendChild(ed);
  scroll.appendChild(epItem);
}

// ── RENDER ──
function renderEvent(idx) {
  const ev = EVENTS[idx];
  const msgs = document.getElementById('messages');
  msgs.innerHTML = '';
  document.getElementById('chatStatus').textContent = ev.month;
  document.getElementById('navProgress').textContent = `${idx+1} / ${EVENTS.length}`;
  document.getElementById('prevBtn').disabled = idx === 0;
  const isLastChosen = idx === EVENTS.length-1 && chosen[idx];
  document.getElementById('nextBtn').textContent = isLastChosen ? '查看結局 →' : '下一段 →';
  document.getElementById('nextBtn').disabled = idx === EVENTS.length-1 && !chosen[idx];

  const dl = document.createElement('div');
  dl.style.cssText = 'text-align:center;font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);margin-bottom:16px;letter-spacing:0.1em;';
  dl.textContent = ev.date; msgs.appendChild(dl);

  const grp = document.createElement('div'); grp.className = 'msg-group';
  const sl = document.createElement('div'); sl.className = 'msg-sender her'; sl.textContent = 'Hannah Chen'; grp.appendChild(sl);
  const rows = document.createElement('div'); rows.className = 'bubble-row';
  grp.appendChild(rows); msgs.appendChild(grp);

  if (chosen[idx]) {
    ev.messages.forEach(m => {
      if (m.isNote) {
        const n = document.createElement('div');
        n.style.cssText = 'font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);padding:4px 0;font-style:italic;';
        n.textContent = m.time; rows.appendChild(n); return;
      }
      const b = document.createElement('div'); b.className = 'bubble her'; b.textContent = m.text;
      const t = document.createElement('div'); t.className = 'bubble-time'; t.textContent = m.time;
      rows.appendChild(b); rows.appendChild(t);
    });
    if (ev.mirror) renderMirror(msgs, ev.mirror);
    showResponse(idx, chosen[idx]);
    document.getElementById('choicesArea').style.display = 'none';
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }

  document.getElementById('choicesArea').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;

  let delay = 200;
  const TYPING_DURATION = 700;
  const BETWEEN_GAP = 120;

  ev.messages.forEach((m, i) => {
    if (m.isNote) {
      setTimeout(() => {
        const n = document.createElement('div');
        n.style.cssText = 'font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);padding:4px 0;font-style:italic;';
        n.textContent = m.time; rows.appendChild(n);
        msgs.scrollTop = msgs.scrollHeight;
      }, delay);
      delay += 200;
      return;
    }

    const typingDelay = delay;
    setTimeout(() => {
      const ind = document.createElement('div');
      ind.className = 'typing-indicator'; ind.id = `typing-${i}`;
      ind.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      rows.appendChild(ind);
      msgs.scrollTop = msgs.scrollHeight;
    }, typingDelay);

    const bubbleDelay = delay + TYPING_DURATION;
    setTimeout(() => {
      const ind = document.getElementById(`typing-${i}`);
      if (ind) ind.remove();
      const b = document.createElement('div'); b.className = 'bubble her'; b.textContent = m.text;
      const t = document.createElement('div'); t.className = 'bubble-time'; t.textContent = m.time;
      b.style.animation = 'fadeUp 0.3s ease both';
      rows.appendChild(b); rows.appendChild(t);
      msgs.scrollTop = msgs.scrollHeight;
    }, bubbleDelay);

    delay += TYPING_DURATION + BETWEEN_GAP;
  });

  const totalDelay = delay + 300;
  setTimeout(() => {
    if (ev.mirror) renderMirror(msgs, ev.mirror);
    if (ev.choice) showChoices(ev);
    document.getElementById('nextBtn').disabled = idx === EVENTS.length - 1;
    msgs.scrollTop = msgs.scrollHeight;
  }, totalDelay);
}

function renderMirror(msgs, mirror) {
  const mir = document.createElement('div'); mir.className = 'romance-mirror';
  mir.innerHTML = `<div class="mirror-label">你在哪裡見過這些？</div><div class="mirror-question">${mirror.question}</div><div class="mirror-refs">${mirror.refs.map(r=>`<span class="mirror-tag">${r}</span>`).join('')}</div>`;
  msgs.appendChild(mir);
}

function showChoices(ev) {
  const area = document.getElementById('choicesArea');
  const existing = area.querySelectorAll('.choice-btn, .choice-note');
  existing.forEach(el => el.remove());

  ['a','b'].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.id = opt === 'a' ? 'choiceA' : 'choiceB';
    btn.textContent = `${opt.toUpperCase()}: ${ev.choice[opt].text}`;
    btn.onclick = () => choose(opt);

    const noteEl = document.createElement('div');
    noteEl.className = 'choice-note';
    noteEl.textContent = ev.choice[opt].note;

    area.appendChild(btn);
    area.appendChild(noteEl);
  });

  area.style.display = 'flex';
}

function choose(opt) {
  const ev = EVENTS[current];
  chosen[current] = opt;
  applyChoice(current, opt);

  const btnA = document.getElementById('choiceA');
  const btnB = document.getElementById('choiceB');
  if (btnA) btnA.className = `choice-btn ${opt==='a'?'sel-a':''}`;
  if (btnB) btnB.className = `choice-btn ${opt==='b'?'sel-b':''}`;

  document.getElementById('choicesArea').style.display='none';
  showResponse(current, opt);
  document.getElementById('messages').scrollTop = 99999;

  if (ev.telltale) showTelltale(ev.telltale[opt]);
  if (ev.lastNoted) updateLastNoted(ev.lastNoted);
  saveState();

  if (ev.isLast) {
    document.getElementById('nextBtn').textContent = '查看結局 →';
    document.getElementById('nextBtn').disabled = false;
  }
}

function showResponse(idx, opt) {
  const ev = EVENTS[idx];
  const msgs = document.getElementById('messages');
  const responses = opt==='a' ? ev.responseA : ev.responseB;
  const youGrp=document.createElement('div'); youGrp.className='msg-group';
  const yl=document.createElement('div'); yl.className='msg-sender you'; yl.textContent='你'; youGrp.appendChild(yl);
  const yr=document.createElement('div'); yr.className='bubble-row you';
  const yb=document.createElement('div'); yb.className=`bubble you ${opt==='b'?'opt-b':''}`;
  yb.textContent = opt==='a' ? ev.choice.a.text : ev.choice.b.text;
  yr.appendChild(yb); youGrp.appendChild(yr); msgs.appendChild(youGrp);
  if (responses?.length) {
    const rGrp=document.createElement('div'); rGrp.className='msg-group';
    const rl=document.createElement('div'); rl.className='msg-sender her'; rl.textContent='Hannah Chen'; rGrp.appendChild(rl);
    const rr=document.createElement('div'); rr.className='bubble-row';
    responses.forEach(r => {
      const rb=document.createElement('div'); rb.className='bubble her'; rb.textContent=r.text;
      const rt=document.createElement('div'); rt.className='bubble-time'; rt.textContent=r.time;
      rr.appendChild(rb); rr.appendChild(rt);
    });
    rGrp.appendChild(rr); msgs.appendChild(rGrp);
  }
}

function navigate(dir) {
  if (dir===1 && current===EVENTS.length-1 && chosen[current]) { showEpilogue(); return; }
  const next=current+dir;
  if (next<0||next>=EVENTS.length) return;
  goTo(next);
}

function goTo(idx) {
  current=idx; renderEvent(current);
  setTimeout(()=>{ document.getElementById('messages').scrollTop=0; },50);
}

// ── TITLE SCREEN ──
function startGame() {
  const ts = document.getElementById('titleScreen');
  ts.classList.add('hiding');
  setTimeout(()=>{ ts.style.display='none'; }, 600);
}
document.addEventListener('keydown', function onKey(e) {
  if (document.getElementById('titleScreen').style.display === 'none') return;
  startGame();
  document.removeEventListener('keydown', onKey);
});

// ── INIT ──
const hasSave = loadState();
updateSABar();
buildTimeline(false);
renderEvent(current);
if (hasSave && Object.keys(chosen).length > 0) {
  const ts = document.getElementById('titleScreen');
  ts.style.display = 'none';
  restoreLastNoted();
}
