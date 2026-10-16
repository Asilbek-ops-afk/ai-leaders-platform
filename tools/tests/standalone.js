/* ==========================================================================
   STANDALONE — o'rnatilgan ilova (PWA) rejimi: status-bar/notch va xavfsiz
   hududlar (safe-area) bilan to'qnashuv yo'qligini HAQIQIY o'rnatilgan
   ko'rinishda tekshiradi (`--app=` oynasi + CDP safe-area emulyatsiyasi).

   Brauzerda `display-mode: standalone` va `env(safe-area-inset-*)` ni emulyatsiya
   qilib bo'lmaydi, shuning uchun bu test oynani boshqacha ochadi:
     - Linux/Docker (DISPLAY yo'q) → o'zini `xvfb-run` ostida qayta ishga tushiradi
     - Windows/macOS → to'g'ridan-to'g'ri (X kerak emas)
   Ishlatish: npm run test:standalone
   ========================================================================== */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const FIX = require('./fixtures.js');
const SHOT = path.join(ROOT, 'docs', 'screens');
const TOP_INSET = 59, BOTTOM_INSET = 34; /* iPhone 14 Pro uslubidagi qiymatlar */

/* Xavfsiz hududli muhit kerak: Linux'da DISPLAY bo'lmasa — xvfb ostida qayta ishga tushamiz */
if (process.platform === 'linux' && !process.env.DISPLAY && !process.env.__SA_WRAPPED) {
  const r = spawnSync('xvfb-run', ['-a', process.execPath, __filename], { stdio: 'inherit', env: { ...process.env, __SA_WRAPPED: '1' } });
  if (r.error) { console.log('\n(Chap tomoni: xvfb-run yo‘q — test o‘tkazib yuborildi)\n'); process.exit(0); }
  process.exit(r.status || 0);
}

let issues = 0;
const report = (w, m) => { issues++; console.log('   ✗ [' + w + '] ' + m); };
const ok = (w, m) => console.log('   ✓ ' + w + (m ? ' — ' + m : ''));

(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(require('os').tmpdir(), 'pw-standalone-' + Date.now()), {
    headless: false, viewport: null, args: ['--app=' + URL, '--window-size=390,900', '--no-first-run']
  });
  let page = null;
  for (let i = 0; i < 25 && !page; i++) { await new Promise(r => setTimeout(r, 300)); page = ctx.pages().find(x => x.url().includes('index.html')); }
  if (!page) { console.log('   (o‘rnatilgan oyna ochilmadi — test o‘tkazib yuborildi)'); await ctx.close(); process.exit(0); }
  await page.waitForTimeout(700);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: TOP_INSET, bottom: BOTTOM_INSET, left: 0, right: 0 } });

  const open = async (acc, theme, shot) => {
    await page.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, FIX.withSession(acc));
    await page.waitForTimeout(1100);
    if (theme === 'light') { await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light')); await page.waitForTimeout(260); }
    const m = await page.evaluate(() => {
      const px = el => el ? { top: Math.round(el.getBoundingClientRect().top), h: Math.round(el.getBoundingClientRect().height),
        pt: parseFloat(getComputedStyle(el).paddingTop), pb: parseFloat(getComputedStyle(el).paddingBottom) } : null;
      return { standalone: matchMedia('(display-mode: standalone)').matches, topbar: px(document.querySelector('.topbar')),
        bottomnav: px(document.querySelector('.bottomnav')), sidebar: px(document.querySelector('.sidebar')),
        junk: ['NaN', 'undefined', '[object Object]'].filter(w => document.getElementById('app').innerText.includes(w)) };
    });
    await page.screenshot({ path: path.join(SHOT, shot) });
    return m;
  };

  console.log('\n— O‘rnatilgan ilova rejimi (status-bar ' + TOP_INSET + 'px, past ' + BOTTOM_INSET + 'px) —\n');

  /* 1) Talaba (mobile, dark) */
  const s1 = await open('s1', 'dark', '105-standalone-talaba.png');
  ok('display-mode: standalone aniqlandi', String(s1.standalone));
  if (!s1.standalone) report('talaba', 'standalone rejimi aniqlanmadi');
  if (s1.topbar.pt < TOP_INSET) report('talaba', 'topbar xavfsiz hududni hisobga olmagan: pt=' + s1.topbar.pt);
  else ok('topbar status-bardan pastda', 'pt=' + s1.topbar.pt + 'px (kerak ≥' + TOP_INSET + ')');
  if (s1.bottomnav.pb < BOTTOM_INSET) report('talaba', 'pastki navbat xavfsiz hududni hisobga olmagan: pb=' + s1.bottomnav.pb);
  else ok('pastki navbat uy-indikatoridan yuqorida', 'pb=' + s1.bottomnav.pb + 'px');
  s1.junk.forEach(w => report('talaba', 'matnda «' + w + '» bor'));

  /* 2) Admin paneli (laptop kenglik, light) — yon panel ham status-barni chetlab o'tishi kerak */
  await page.setViewportSize({ width: 1280, height: 800 });
  const a1 = await open('a1', 'light', '106-standalone-admin-light.png');
  if (a1.sidebar && a1.sidebar.pt < TOP_INSET) report('admin', 'yon panel xavfsiz hududni hisobga olmagan: pt=' + a1.sidebar.pt);
  else if (a1.sidebar) ok('yon panel status-bardan pastda', 'pt=' + a1.sidebar.pt + 'px');
  if (a1.topbar.pt < TOP_INSET) report('admin', 'topbar pt=' + a1.topbar.pt);
  else ok('admin topbar ham to‘g‘ri');
  a1.junk.forEach(w => report('admin', 'matnda «' + w + '» bor'));

  await ctx.close();
  console.log('\nSkrinshotlar: docs/screens/105-standalone-talaba.png, 106-standalone-admin-light.png');
  console.log('\n' + '─'.repeat(64));
  console.log(issues === 0 ? '✔ STANDALONE: o‘rnatilgan ilova rejimi toza' : '✖ STANDALONE: ' + issues + ' ta nuqson');
  console.log('─'.repeat(64) + '\n');
  process.exit(issues ? 1 : 0);
})();
