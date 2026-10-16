/* ==========================================================================
   SCALE — katta klub sinovi: 200+ talaba, o'qituvchi yuki ostida sahifalar
   qancha tez chiziladi va raqamlar to'g'ri qoladimi (NaN/kesilish/toshish).
   Ishlatish: npm run test:scale   (yoki TEST_URL=... node tools/tests/scale.js)
   ========================================================================== */
const { chromium } = require('playwright');
const path = require('path');
const FIX = require('./fixtures.js');

const LOCAL = 'file://' + path.join(__dirname, '..', '..', 'index.html');
const BASE = process.env.TEST_URL || LOCAL;
const N = +(process.env.N || 200);

/* Katta klub holati — umumiy generator fixturada: FIX.bigState(n) */
let issues = 0;
const report = (w, m) => { issues++; console.log('   ✗ [' + w + '] ' + m); };
const P = [['render', 900], ['interaktiv', 1600]]; /* ms: ruxsat etilgan chegara */

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1568, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const st = FIX.bigState(N);
  const routes = ['admin', 'students', 'adminTasks', 'adminAdmins', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings'];
  console.log('\n— Katta klub sinovi: ' + N + ' talaba, ' + st.groups.length + ' jamoa, ' + st.submissions.length + ' topshiriq —\n');
  for (const r of routes) {
    await p.goto(BASE, { waitUntil: 'load' });
    await p.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, st);
    await p.waitForTimeout(500);
    const ms = await p.evaluate(rt => {
      const t0 = performance.now();
      document.querySelector('.sidebar [data-act="go"][data-route="' + rt + '"]')?.click();
      return Math.round(performance.now() - t0);
    }, r);
    await p.waitForTimeout(150);
    const chk = await p.evaluate(() => {
      const app = document.getElementById('app');
      const t = app.innerText;
      const out = { junk: ['NaN', 'undefined', '[object Object]', 'Infinity'].filter(w => t.includes(w)), rows: document.querySelectorAll('.trow:not(.head)').length,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 1, nodes: app.querySelectorAll('*').length };
      out.overs = [];
      document.querySelectorAll('.trow > *').forEach(c => { if (c.scrollWidth > c.clientWidth + 2 && c.clientWidth > 0) out.overs.push((c.textContent || '').trim().slice(0, 24)); });
      return out;
    });
    const tag = (r + '            ').slice(0, 15);
    const bad = ms > P[0] || chk.junk.length || chk.overall;
    console.log((ms > P[0] ? '   ✗ ' : '   ✓ ') + tag + String(ms).padStart(5) + ' ms · ' + String(chk.rows).padStart(4) + ' qator · ' +
      String(chk.nodes).padStart(5) + ' tugun' + (chk.overs.length ? ' · kesilgan: ' + chk.overs.length : ''));
    if (ms > P[0]) report(r, 'sekin chizilish: ' + ms + ' ms (chegara ' + P[0] + ')');
    chk.junk.forEach(w => report(r, 'matnda «' + w + '» bor'));
    if (chk.overflowX) report(r, 'gorizontal toshish');
    if (chk.overs.length) report(r, 'ustun matni kesilgan: ' + chk.overs.slice(0, 3).join(' | '));
  }
  /* Filtrlash/saralash ham tez ishlashi kerak (200 qator ustida) */
  await p.goto(BASE, { waitUntil: 'load' });
  await p.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, st);
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.sidebar [data-act="go"][data-route="students"]')?.click());
  await p.waitForTimeout(200);
  const acts = [['saralash', () => document.querySelector('.th[data-k="xp"]')?.click()],
    ['filtr: kechikkan', () => document.querySelector('[data-act="filter-s"][data-f="late"]')?.click()],
    ['filtr: jim', () => document.querySelector('[data-act="filter-s"][data-f="inactive"]')?.click()],
    ['filtr: barchasi', () => document.querySelector('[data-act="filter-s"][data-f="all"]')?.click()]];
  for (const [nm, fn] of acts) {
    const ms = await p.evaluate(f => { const t0 = performance.now(); new Function('return (' + f + ')()')(); return Math.round(performance.now() - t0); }, fn.toString());
    await p.waitForTimeout(150);
    console.log((ms > P[1] ? '   ✗ ' : '   ✓ ') + ('   ' + nm + '            ').slice(0, 18) + String(ms).padStart(5) + ' ms');
    if (ms > P[1]) report('students/' + nm, 'sekin: ' + ms + ' ms (chegara ' + P[1] + ')');
  }
  errs.slice(0, 3).forEach(e => report('katta klub (JS)', e.slice(0, 110)));
  await b.close();
  console.log('\n' + '─'.repeat(64));
  console.log(issues === 0 ? '✔ SCALE: ' + N + ' talabada ham nuqson yo‘q' : '✖ SCALE: ' + issues + ' ta nuqson');
  console.log('─'.repeat(64) + '\n');
  process.exit(issues ? 1 : 0);
})();
