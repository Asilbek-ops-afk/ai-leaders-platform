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

/* WCAG kontrast: matn/фон juftligi (gradient fonlar chiqarib tashlanadi) */
async function contrastScan(page, label) {
  /* Tema almashganda .card "background .3s" bilan o'tadi — o'lchov o'tish
     effekti ostida qolmasligi uchun harakatni o'chirib, tinch holatni o'lchaymiz. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(140);
  const rows = await page.evaluate(() => {
    const parse = c => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(c); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
    const lum = rgb => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
    const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b); const hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };
    const bgOf = el => {
      let n = el, stack = [], grad = false;
      while (n && n.nodeType === 1) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') grad = true;
        const c = parse(cs.backgroundColor);
        if (c && c[3] > 0.05) { stack.push(c); if (c[3] >= 0.96) break; }
        n = n.parentElement;
      }
      let base = [5, 7, 15];
      for (let i = stack.length - 1; i >= 0; i--) { const c = stack[i]; base = [0, 1, 2].map(k => Math.round(c[k] * c[3] + base[k] * (1 - c[3]))); }
      return { base, grad };
    };
    const out = [];
    const walk = (el, depth) => {
      if (!el || depth > 40) return;
      [...el.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const t = n.textContent.trim();
          if (t.length < 3) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') return;
          let op = 1, m = el;
          while (m && m.nodeType === 1) { op *= parseFloat(getComputedStyle(m).opacity || '1'); m = m.parentElement; }
          if (op < 0.6) return;
          const { base, grad } = bgOf(el);
          const c = parse(cs.color);
          if (!c || c[3] < 0.6) return;
          const r = ratio([c[0], c[1], c[2]], base);
          const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
          const big = size >= 18.66 || (size >= 14 && weight >= 700);
          const hex = a => '#' + a.slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('');
          const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
          out.push({ txt: t.slice(0, 34), r: +r.toFixed(2), need: big ? 3 : 4.5, grad,
            sel: el.tagName.toLowerCase() + (cls ? '.' + cls : ''), col: hex(c), bg: hex(base), size });
        } else if (n.nodeType === 1) walk(n, depth + 1);
      });
    };
    walk(document.getElementById('app') || document.body, 0);
    return out;
  });
  const bad = rows.filter(x => !x.grad && x.r < x.need);
  /* CONTRAST_RAW=1 → har sahifada eng past 5 nisbatni ham chiqaradi (zaxira ko'rish uchun) */
  if (process.env.CONTRAST_RAW) console.log(JSON.stringify(rows.filter(x => !x.grad).sort((a, b) => a.r - b.r).slice(0, 5).map(x => ({ l: label, r: x.r, t: x.txt, s: x.sel, c: x.col + ' on ' + x.bg })), null, 1));
  bad.slice(0, 14).forEach(x => report(label, 'kontrast ' + x.r + ' < ' + x.need + ' — «' + x.txt + '»  [' + x.sel + ' ' + x.col + ' on ' + x.bg + ' ' + x.size + 'px]'));
  return bad.length;
}

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
      await contrastScan(p, 'kontrast ' + role + '/' + r + ' (dark)');
      await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      await p.waitForTimeout(260);
      await contrastScan(p, 'kontrast ' + role + '/' + r + ' (light)');
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
