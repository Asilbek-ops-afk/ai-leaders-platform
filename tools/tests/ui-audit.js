/* ==========================================================================
   UI AUDIT — barcha sahifalarni aylanib chiqib, "ko'zga ko'rinmas" nuqsonlarni topadi:
     1) kpi() argumentlari siljib ketgan holatlar (qiymat o'rniga ikona nomi)
     2) jadval ustunlarining matn to'lib-toshishi (scrollWidth > clientWidth)
     3) bo'sh/cho'zilgan konteynerlar, NaN/undefined matnlar
     4) gorizontal toshish va JS xatolari
   Ishlatish: npm run test:ui  (yoki TEST_URL=... node tools/tests/ui-audit.js)
   ========================================================================== */
const { chromium } = require('playwright');
const path = require('path');
const FIX = require('./fixtures.js');

const LOCAL = 'file://' + path.join(__dirname, '..', '..', 'index.html');
const BASE = process.env.TEST_URL || LOCAL;

/* Shablondagi ikona nomlari — KPI qiymati bularga teng bo'lsa, argumentlar siljigan */
const ICONS = ['home', 'book', 'task', 'users', 'clock', 'user', 'dash', 'check', 'check-c', 'plus', 'search', 'bell',
  'out', 'flame', 'trophy', 'medal', 'star', 'play', 'video', 'doc', 'link', 'code', 'upload', 'cal', 'right', 'left',
  'down', 'up', 'x', 'sun', 'moon', 'target', 'rocket', 'ai', 'chat', 'terminal', 'cube', 'flag', 'award', 'cert',
  'shield', 'heart', 'spark', 'filter', 'download', 'edit', 'trash', 'eye', 'send', 'lock', 'alert', 'trend', 'help',
  'phone', 'mail', 'copy', 'print', 'refresh', 'menu', 'grid', 'bolt', 'pin', 'globe', 'settings', 'users-plus',
  'briefcase', 'hand', 'eye-off', 'key'];

const ROUTES_ADMIN = ['admin', 'students', 'adminTasks', 'adminAdmins', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings'];
const ROUTES_STUDENT = ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];

let issues = 0;
const report = (where, msg) => { issues++; console.log('   ✗ [' + where + '] ' + msg); };

async function auditPage(page, label, checks) {
  const res = await page.evaluate(ic => {
    const out = { badKpi: [], overs: [], junk: [], settings: {}, counts: {} };
    /* 1) KPI qiymatlari */
    document.querySelectorAll('.kpi').forEach(k => {
      const v = k.querySelector('.v'), l = k.querySelector('.small');
      const val = v ? v.textContent.trim() : '';
      if (ic.includes(val)) out.badKpi.push(val + ' ← ' + (l ? l.textContent.trim() : '?'));
    });
    /* 2) jadval ustunlarida matn to'lib-toshishi */
    document.querySelectorAll('.trow > *').forEach(c => {
      if (c.scrollWidth > c.clientWidth + 2 && c.clientWidth > 0) out.overs.push((c.textContent || '').trim().slice(0, 28) + ' (' + c.scrollWidth + '>' + c.clientWidth + ')');
    });
    /* 3) NaN / undefined / [object Object] */
    const t = document.getElementById('app').innerText;
    ['NaN', 'undefined', '[object Object]', 'Infinity'].forEach(w => { if (t.includes(w)) out.junk.push(w); });
    /* 4) gorizontal toshish */
    out.settings.overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
    out.counts.kpi = document.querySelectorAll('.kpi').length;
    out.counts.rows = document.querySelectorAll('.trow').length;
    return out;
  }, ICONS);
  res.badKpi.forEach(x => report(label, 'KPI qiymati ikona nomi bo‘lib qolgan: ' + x));
  res.overs.forEach(x => report(label, 'ustun matni to‘lib-toshgan: ' + x));
  res.junk.forEach(x => report(label, 'matnda «' + x + '» bor'));
  if (res.settings.overflowX) report(label, 'gorizontal toshish');
  if (checks && checks.minKpi && res.counts.kpi < checks.minKpi) report(label, 'KPI kartalari kam: ' + res.counts.kpi);
  return res;
}

(async () => {
  const b = await chromium.launch();
  const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
  const states = [
    ['admin', 'a1', ROUTES_ADMIN, { minKpi: 4 }],
    ['talaba', 's1', ROUTES_STUDENT, { minKpi: 0 }]
  ];
  for (const [role, acc, routes, checks] of states) {
    const p = await b.newPage({ viewport: { width: 1568, height: 950 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    const st = FIX.withSession(acc);
    for (const r of routes) {
      if (ONLY && !ONLY.includes(r)) continue;
      await p.goto(BASE, { waitUntil: 'load' });
      await p.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, st);
      await p.waitForTimeout(560);
      if (r !== (role === 'admin' ? 'admin' : 'home')) {
        await p.evaluate(rt => document.querySelector('.sidebar [data-act="go"][data-route="' + rt + '"]')?.click(), r);
        await p.waitForTimeout(560);
      }
      await auditPage(p, role + '/' + r, checks);
    }
    /* modallar (admin) */
    if (role === 'admin') {
      const modals = process.env.MODALS === '0' ? [] : [
        ['yangi-vazifa', '[data-act="new-task"]'], ['dars-qoshish', '[data-act="new-lesson"]'],
        ['talaba-qoshish', '[data-act="new-student"]'], ['admin-qoshish', '[data-act="new-admin"]'],
        ['csv-import', '[data-act="import-csv"]'], ['buyruq-paneli', '[data-act="palette"]']
      ];
      for (const [nm, sel] of modals) {
        if (ONLY && !ONLY.includes(nm)) continue;
        await p.goto(BASE, { waitUntil: 'load' });
        await p.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, st);
        await p.waitForTimeout(560);
        await p.evaluate(s2 => { const el = document.querySelector(s2); if (el) el.click(); }, sel);
        await p.waitForTimeout(560);
        await auditPage(p, 'modal/' + nm, null);
      }
      /* admin panel maxsus: ruxsatlar jadvali ustunlari */
    }
    errs.slice(0, 3).forEach(e => report(role + ' (JS)', e.slice(0, 90)));
    await p.close();
  }
  await b.close();
  console.log('\n' + '─'.repeat(64));
  console.log(issues === 0 ? '✔ UI AUDIT: nuqson topilmadi' : '✖ UI AUDIT: ' + issues + ' ta nuqson');
  console.log('─'.repeat(64) + '\n');
  process.exit(issues ? 1 : 0);
})();
