/* ==========================================================================
   CRAFT — sahifani «jonli» qiluvchi qatlam (v2.5.0)
   Faqat haqiqiy brauzerda ishlaydi (jsdom'da o'chadi), animatsiya
   prefers-reduced-motion'da to'xtaydi. View kodiga tegmasdan DOM'ni
   sayqallaydi: sarlavha ustki yozuvi, jonli lenta, faollik xaritasi,
   uchqun grafigi, raqamlarning sanalishi, kursor nuri.
   ========================================================================== */
/* DIQQAT: bu fayl oxirida yuklanadi, shuning uchun barcha o'zgaruvchilar `var`
   (yoki function) bo'lishi kerak — aks holda init paytida TDZ xatosi chiqadi. */
var CRAFT_READY = false;
function craftOn() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
    && typeof window.matchMedia === 'function' && typeof window.requestAnimationFrame === 'function';
}
function craftRM() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
function craftFine() { try { return window.matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) { return false; } }

/* ---------- nisbiy vaqt: ISO sana -> «bugun», «kecha», «3 kun oldin» ---------- */
function relDay(iso) {
  try {
    const d = new Date(iso + 'T12:00:00'); if (isNaN(d)) return String(iso || '');
    const t = new Date(); t.setHours(12, 0, 0, 0);
    const n = Math.round((t - d) / 864e5);
    if (n <= 0) return 'bugun';
    if (n === 1) return 'kecha';
    if (n < 7) return n + ' kun oldin';
    if (n < 30) return Math.round(n / 7) + ' hafta oldin';
    return fmtD(iso);
  } catch (e) { return ''; }
}
/* ---------- jonli lenta uchun hodisalar ---------- */
var CRAFT_IC = { accepted: 'check-c', in_review: 'eye', revise: 'refresh', late: 'alert' };
function craftFeed(n) {
  const out = [];
  const seen = {};
  (S.activity || []).forEach(a => {
    const k = (a.who || '') + '|' + (a.what || '');
    if (seen[k]) return; seen[k] = 1;
    out.push({ who: a.who, what: a.what, when: a.at || '', ic: 'spark' });
  });
  S.submissions.slice().sort((a, b) => (a.at < b.at ? 1 : -1)).forEach(p => {
    const st = get(S.students, p.st), t = taskOf(p.task);
    if (!st || !t) return;
    const k = st.id + '|' + t.id;
    if (seen[k]) return; seen[k] = 1;
    const l = STATUS[p.status] ? STATUS[p.status].l.toLowerCase() : p.status;
    const what = p.status === 'accepted' && p.score ? '“' + t.title + '” — ' + p.score + ' ball'
      : p.status === 'in_review' ? '“' + t.title + '”ni tekshiruvga yubordi'
      : p.status === 'revise' ? '“' + t.title + '” qayta ishlashga qaytdi'
      : p.status === 'late' ? '“' + t.title + '”ni kechikib topshirdi' : '“' + t.title + '” — ' + l;
    out.push({ who: st.name, what, when: relDay(p.at), ic: CRAFT_IC[p.status] || 'task' });
  });
  return out.slice(0, n || 9);
}
function craftFeedScore(x) { return (x.when === 'bugun' ? 3 : x.when === 'kecha' ? 2 : x.when.indexOf('kun oldin') > -1 ? 1 : 0); }
function craftTickerHTML(items) {
  const one = items.map(x => '<span class="tick-it">' + ico(x.ic, 'sm') + '<b>' + esc(x.who) + '</b> ' + esc(x.what) +
    (x.when ? '<em>' + esc(x.when) + '</em>' : '') + '</span><i class="pip"></i>').join('');
  return '<span class="tick-lb"><span class="pulse"></span>Jonli</span><div class="tick-vp"><div class="tick-tr">' + one + one + '</div></div>';
}
/* ---------- faollik issiqlik xaritasi (oxirgi 8 hafta, haqiqiy topshiriqlar) ---------- */
function craftScope() {
  if (isAdmin()) return null;
  const st = me(); if (!st) return null;
  const g = myGroup(st);
  return g ? g.members : [st.id];
}
function craftHeatCells(weeks) {
  const W = weeks || (isAdmin() ? 12 : 8), scope = craftScope();
  const map = {};
  S.submissions.forEach(p => { if (!scope || scope.indexOf(p.st) > -1) map[p.at] = (map[p.at] || 0) + 1; });
  const end = new Date(); end.setHours(12, 0, 0, 0);
  const off = (end.getDay() + 6) % 7;                 /* dushanba = 0 */
  const lastMon = new Date(end); lastMon.setDate(end.getDate() - off);
  const start = new Date(lastMon); start.setDate(lastMon.getDate() - (W - 1) * 7);
  const cells = [];
  for (let w = 0; w < W; w++) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
      const iso = isoDate(dt), n = map[iso] || 0;
      cells.push({ d: iso, n, lvl: n <= 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : 4, future: dt > end });
    }
  }
  return cells;
}
function heatCardHTML(cells, opt) {
  const o = opt || {};
  const past = cells.filter(c => !c.future);
  const total = past.reduce((a, c) => a + c.n, 0);
  const live = past.filter(c => c.n > 0).length;
  const best = past.slice().sort((a, b) => b.n - a.n)[0] || { n: 0, d: todayISO() };
  const avg = past.length ? (total / past.length).toFixed(1) : '0';
  const grid = cells.map(c => '<i data-v="' + (c.future ? 0 : c.lvl) + '" title="' + fmtFull(c.d) + ' — ' + c.n + ' ta ish"></i>').join('');
  const weeks = Math.round(cells.length / 7);
  return '<div class="card heat-card"><div class="card-h"><h2 class="h2">' + ico('grid') + (o.title || 'Faollik xaritasi') + '</h2>' +
    '<span class="tag c">' + weeks + ' hafta</span></div><div class="heat">' + grid + '</div>' +
    '<div class="heat-w"><span class="xs muted">Bir katak — bir kun · jami <b>' + total + '</b> topshiriq</span>' +
    '<span class="heat-lg">Kam<i data-v="1"></i><i data-v="2"></i><i data-v="3"></i><i data-v="4"></i>Ko‘p</span></div>' +
    '<div class="divider"></div>' +
    '<div class="row wrap" style="gap:9px"><div class="mini-stat"><div class="big">' + total + '</div><div class="xs muted">topshiriq</div></div>' +
    '<div class="mini-stat"><div class="big">' + live + '</div><div class="xs muted">faol kun</div></div>' +
    '<div class="mini-stat"><div class="big">' + best.n + '</div><div class="xs muted">eng faol kun · ' + fmtD(best.d) + '</div></div>' +
    '<div class="mini-stat"><div class="big">' + avg + '</div><div class="xs muted">o‘rtacha / kun</div></div></div></div>';
}
/* Haftalik dinamika kartasi: uchqun grafigi + 3 ko'rsatkich */
function sparkCardHTML(values, opt) {
  const o = opt || {};
  const sum = values.reduce((a, b) => a + b, 0);
  const today = values[values.length - 1] || 0;
  const week = values.slice(-7).reduce((a, b) => a + b, 0);
  const prev = values.slice(-14, -7).reduce((a, b) => a + b, 0);
  const delta = week - prev;
  return '<div class="card"><div class="card-h"><h2 class="h2">' + ico('trend') + (o.title || 'Topshirish dinamikasi') + '</h2>' +
    '<span class="tag ' + (delta >= 0 ? 'g' : 'r') + '">' + (delta >= 0 ? '+' : '') + delta + ' shu hafta</span></div>' +
    '<div class="micro" style="margin-bottom:4px">Oxirgi 14 kun · ' + sum + ' topshiriq</div>' + sparkSVG(values) +
    '<div class="row wrap" style="gap:9px;margin-top:10px"><div class="mini-stat"><div class="big">' + today + '</div><div class="xs muted">bugun</div></div>' +
    '<div class="mini-stat"><div class="big">' + week + '</div><div class="xs muted">shu hafta</div></div>' +
    '<div class="mini-stat"><div class="big">' + Math.max(0, delta) + '</div><div class="xs muted">o‘tgan haftadan ortiq</div></div></div></div>';
}
/* ---------- uchqun grafigi (haqiqiy topshiriqlar, oxirgi 14 kun) ---------- */
var craftSparkN = 0;
function sparkSVG(values) {
  const n = values.length, w = 260, h = 46, mx = Math.max(1, ...values);
  const id = 'spk' + (++craftSparkN);
  const pts = values.map((v, i) => [n === 1 ? w / 2 : (i / (n - 1)) * w, h - 4 - (v / mx) * (h - 12)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const last = pts[pts.length - 1] || [0, 0];
  return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
    '<defs><linearGradient id="' + id + 'L" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>' +
    '<linearGradient id="' + id + 'G" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(124,92,255,.55)"/><stop offset="1" stop-color="rgba(124,92,255,0)"/></linearGradient></defs>' +
    '<path class="area" d="' + line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="url(#' + id + 'G)"/>' +
    '<path class="line" style="--len:' + Math.round(len) + ';stroke:url(#' + id + 'L)" d="' + line + '"/>' +
    '<circle class="dot" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="3.4"/></svg>';
}
function craftTrend(scope, days) {
  const D = days || 14, map = {};
  S.submissions.forEach(p => { if (!scope || scope.indexOf(p.st) > -1) map[p.at] = (map[p.at] || 0) + 1; });
  const out = [];
  for (let i = D - 1; i >= 0; i--) { const dt = new Date(); dt.setDate(dt.getDate() - i); out.push(map[isoDate(dt)] || 0); }
  return out;
}
/* ---------- sahifa sarlavhasi: ustki yozuv (eyebrow) + raqamli chiplar ---------- */
function craftRouteLabel() {
  const r = UI.route, def = navDefs[r] || { l: '' };
  let sec = '', idx = 0;
  Object.keys(NAV_SEC).forEach(k => NAV_SEC[k].forEach(x => {
    if (x[1].indexOf(r) > -1) { sec = x[0]; idx = x[1].indexOf(r) + 1; }
  }));
  const pad = idx < 10 ? '0' + idx : String(idx);
  return (sec ? sec.toUpperCase() + ' · ' : '') + String(def.l || '').toUpperCase() + ' · ' + pad;
}
function craftHead() {
  const list = document.querySelectorAll('.content .page-head');
  for (const ph of list) {
    if (ph.dataset.craft) continue; ph.dataset.craft = '1';
    const box = ph.firstElementChild, h1 = ph.querySelector('h1');
    if (box && h1 && !ph.querySelector('.ph-eyebrow')) {
      const eb = document.createElement('div'); eb.className = 'ph-eyebrow';
      eb.innerHTML = '<i></i><b>' + esc(craftRouteLabel()) + '</b><span>AI Leaders Startup Club</span>';
      box.insertBefore(eb, h1);
    }
    const p = ph.querySelector('p.t2');
    if (p && !p.classList.contains('ph-sub')) {
      const parts = String(p.textContent || '').split(/\s*[·•]\s*/).filter(x => x.trim());
      p.className = 'ph-sub';
      p.innerHTML = parts.map(x => '<span class="ph-k">' + esc(x).replace(/(\d[\d\s.,/%]*)/g, '<b>$1</b>') + '</span>').join('<span class="dot"></span>');
    }
  }
}
/* ---------- jonli lenta va tahlil kartalarini joylash ---------- */
function craftTicker() {
  const content = document.querySelector('.content');
  if (!content || content.querySelector('.tick')) return;
  if (UI.authShow) return;
  const items = craftFeed(10);
  if (items.length < 4) return;
  items.sort((a, b) => craftFeedScore(b) - craftFeedScore(a));
  const node = document.createElement('div');
  node.className = 'tick'; node.setAttribute('role', 'status'); node.setAttribute('aria-label', 'Klubdagi so‘nggi harakatlar');
  node.innerHTML = craftTickerHTML(items.slice(0, 9));
  const anchor = content.querySelector('.page-head') || content.querySelector('.hero');
  if (anchor && anchor.parentElement === content) anchor.insertAdjacentElement('afterend', node);
  else content.insertBefore(node, content.firstChild);
}
function craftInsights() {
  const content = document.querySelector('.content');
  if (!content || UI.authShow) return;
  const cells = craftHeatCells();
  const scope = craftScope();
  if (UI.route === 'home') {
    const rail = content.querySelector('.wide-rail');
    if (rail && !rail.querySelector('.heat-card')) rail.insertAdjacentHTML('afterbegin', heatCardHTML(cells));
    const hc = content.querySelector('.hero .card.glass');
    if (hc && !hc.querySelector('.spark')) {
      const scope2 = craftScope();
      const vals = craftTrend(scope2, 14);
      const sum = vals.reduce((a, b) => a + b, 0);
      if (sum > 2) hc.insertAdjacentHTML('beforeend', '<div style="width:100%"><div class="row between" style="margin-bottom:2px">' +
        '<span class="micro">' + (scope2 && scope2.length > 1 ? 'Jamoam' : 'Men') + ' · oxirgi 14 kun</span>' +
        '<span class="xs muted">' + sum + ' topshiriq</span></div>' + sparkSVG(vals) + '</div>');
    }
  } else if (UI.route === 'admin' || UI.route === 'stats' || UI.route === 'adminGroups') {
    if (content.querySelector('.heat-card')) return;
    const row = document.createElement('div');
    row.className = 'grid g2 heat-row';
    row.innerHTML = heatCardHTML(cells, { title: 'Faollik xaritasi — butun klub' }) +
      sparkCardHTML(craftTrend(null, 14), { title: 'Topshirish dinamikasi' });
    const grids = content.querySelectorAll(':scope > .grid, :scope > .card');
    const g = grids[0];
    if (g) g.insertAdjacentElement('afterend', row); else content.insertBefore(row, content.firstChild);
  }
}
/* ---------- harakat: paydo bo'lish, sanash, o'sish ---------- */
var craftLastKey = '';
function craftReveal() {
  const key = (UI.authShow ? 'auth' : 'app') + ':' + UI.route + ':' + (UI.module || '');
  const isNew = key !== craftLastKey; craftLastKey = key;
  if (craftRM() || !isNew) return isNew;
  const kids = Array.prototype.slice.call(document.querySelectorAll('.content > *')).slice(0, 14);
  kids.forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', i); });
  setTimeout(() => kids.forEach(el => { el.classList.remove('rv'); el.style.removeProperty('--d'); }), 1600);
  return isNew;
}
function craftFmt(n, dec, sep) {
  let s = dec ? n.toFixed(dec) : String(Math.round(n));
  if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return s;
}
function craftMotion(countUp) {
  if (craftRM()) return;
  document.querySelectorAll('.content .bar > i').forEach(el => {
    const w = el.style.width; if (!w) return;
    el.style.width = '0%';
    requestAnimationFrame(() => { el.style.width = w; });
  });
  document.querySelectorAll('.content .ring .fgc').forEach(c => {
    const off = c.getAttribute('stroke-dashoffset'), full = parseFloat(c.getAttribute('stroke-dasharray'));
    if (!isFinite(full) || off == null) return;
    c.setAttribute('stroke-dashoffset', full);
    requestAnimationFrame(() => { c.setAttribute('stroke-dashoffset', off); });
  });
  if (!countUp) return;
  document.querySelectorAll('.content .kpi .v, .content .big').forEach(el => {
    const txt = (el.textContent || '').trim();
    const m = txt.match(/^(\d[\d\s\u00a0.,]*)(\D{0,4})$/);
    if (!m) return;
    const sep = /[\s\u00a0]/.test(m[1]) ? ' ' : '';
    const raw = m[1].replace(/[\s\u00a0]/g, '');
    const dec = (raw.split(/[.,]/)[1] || '').length;
    const val = parseFloat(raw.replace(',', '.'));
    if (!isFinite(val) || val <= 0 || val > 1e7) return;
    const t0 = performance.now(), dur = 520;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = craftFmt(val * e, dec, sep) + m[2];
      if (k < 1) requestAnimationFrame(step); else el.textContent = txt;
    };
    el.textContent = craftFmt(0, dec, sep) + m[2];
    requestAnimationFrame(step);
  });
}
/* ---------- bo'sh holat illyustratsiyasi (sahifaga qarab) ---------- */
var EMPTY_ART = {
  lessons: 'M4 10h24v18H4zM8 18h16M8 24h10',
  tasks: 'M8 12h20v18H8zM12 8l3 3 5-5',
  friends: 'M10 22a5 5 0 1 0 10 0M24 26a4 4 0 1 0 8 0M18 14a5 5 0 1 0 0 0',
  deadlines: 'M18 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20M18 16v6l4 3',
  team: 'M6 26h6v-8H6zM15 26h6V12h-6zM24 26h6V18h-6z',
  info: 'M18 8l10 6v14H8V14zM14 28v-7h8v7',
  default: 'M8 26l8-16 8 16zM10 32h16'
};
function craftEmpty() {
  document.querySelectorAll('.content .empty').forEach(el => {
    if (el.dataset.art || el.querySelector('.empty-t')) return; el.dataset.art = '1';
    const d = EMPTY_ART[UI.route] || EMPTY_ART.default;
    el.insertAdjacentHTML('afterbegin', '<svg class="empty-art" viewBox="0 0 40 40" aria-hidden="true"><path d="' + d + '"/>' +
      '<path class="dash" d="M4 36h32"/></svg>');
    const t = el.querySelector('.small, .xs') || el;
    t.classList.add('empty-t');
  });
}
/* ---------- avatar ranglari (ism bo'yicha barqaror hue) ---------- */
function craftAvatars() {
  document.querySelectorAll('.content .av').forEach(el => {
    if (el.dataset.h) return; el.dataset.h = '1';
    const s = el.getAttribute('title') || el.textContent || '';
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    el.style.setProperty('--h', h);
  });
}
/* ---------- kursor nuri, to'lqin, jonli soat, mavzu o'tishi ---------- */
function craftInteract() {
  if (window.__craftInit) return; window.__craftInit = 1;
  /* jonli soat (topbar oxirida, faqat keng ekranda) */
  const clock = document.createElement('span');
  clock.className = 'liveclock hide-sm';
  const tick = () => {
    const d = new Date();
    clock.innerHTML = '<span class="pulse"></span><b>' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + '</b><span>Toshkent</span>';
  };
  tick();
  const maybeClock = () => {
    const tb = document.querySelector('.topbar');
    if (tb && !tb.querySelector('.liveclock')) tb.appendChild(clock); else if (!tb && clock.parentElement) clock.remove();
  };
  window.__craftClock = maybeClock;
  setInterval(tick, 20000);
  if (craftFine() && !craftRM()) {
    let raf = 0;
    document.addEventListener('pointermove', e => {
      const el = e.target && e.target.closest ? e.target.closest('.card,.kpi,.mod') : null;
      if (!el || raf) return;
      const x = e.clientX, y = e.clientY;
      raf = requestAnimationFrame(() => {
        raf = 0; const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (x - r.left).toFixed(0) + 'px');
        el.style.setProperty('--my', (y - r.top).toFixed(0) + 'px');
      });
    }, { passive: true });
  }
  document.addEventListener('pointerdown', e => {
    if (craftRM()) return;
    const t = e.target && e.target.closest ? e.target.closest('.btn, .bn, .chip, .seg button') : null;
    if (!t || t.disabled) return;
    const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
    const w = document.createElement('span');
    w.className = 'rip-w';
    w.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left) + 'px;top:' + (e.clientY - r.top) + 'px';
    t.classList.add('rip');
    t.appendChild(w);
    setTimeout(() => { w.remove(); t.classList.remove('rip'); }, 560);
  }, { passive: true });
}
/* ---------- asosiy kirish nuqtasi (paint() chaqiradi) ---------- */
function craftPaint() {
  if (!CRAFT_READY) { setTimeout(() => { try { craftPaint(); } catch (e) { } }, 0); return; }   /* fayl hali yuklanmagan bo'lsa — keyinroq */
  if (!craftOn()) return;
  try {
    craftInteract();
    if (window.__craftClock) window.__craftClock();
    craftHead();
    craftTicker();
    craftInsights();
    craftAvatars();
    craftEmpty();
    const isNew = craftReveal();
    craftMotion(isNew);
  } catch (e) { /* craft qatlami hech qachon asosiy oqimni to'xtatmaydi */ }
}
CRAFT_READY = true;
