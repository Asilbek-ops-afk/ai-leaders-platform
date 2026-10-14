/* Layout QA: har bir o'lchamda gorizontal toshish (overflow) yo'qligini tekshiradi.
   Ishlatish: node tools/tests/layout.js   (yoki: npm run test:layout)
   Xohlasa TEST_URL=<url> bilan jonli saytni ham tekshirish mumkin. */
const { chromium } = require('playwright');
const path = require('path');
const FIX = require('./fixtures.js');
/* v2.0.0: bo'sh platforma holati (founder akkaunti bilan) */
function founderState() {
  const st = FIX.emptyState();
  st.accounts = [{ id: 'acc-founder', role: 'admin', adminRole: 'founder', perms: ['__all'], nick: 'asilbek',
    name: 'Asilbek Yo‘ldoshev', email: 'founder@aileaders.uz', phone: null, hemisId: null, pass: 'fixture',
    mustSetPass: false, status: 'active', demo: false, created: '2026-10-14', lastLogin: Date.now() }];
  st.session = { acc: 'acc-founder', at: Date.now() };
  st.role = 'admin';
  return st;
}

const ROOT = path.resolve(__dirname, '..', '..');
const URL = process.env.TEST_URL || ('file://' + path.join(ROOT, 'index.html'));
const SIZES = [[390, 844], [768, 1024], [1024, 800], [1366, 768], [1568, 768], [1440, 900], [1920, 1080]];
const ROUTES = { admin: ['admin', 'students', 'adminTasks', 'adminGroups', 'adminDeadlines', 'stats', 'settings'], student: ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'], empty: ['admin', 'students', 'stats'] };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const problems = [];
  let checks = 0;

  const measure = async label => {
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    checks++;
    if (over > 2) problems.push(label + ' → ' + over + 'px toshish');
  };

  const seed = async st => {
    await page.goto(URL, { waitUntil: 'load' });
    await page.evaluate(x => {
      localStorage.clear();
      if (x) localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(x));
    }, st);
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(400);
  };
  for (const [w, h] of SIZES) {
    await page.setViewportSize({ width: w, height: h });
    /* admin */
    await seed(FIX.withSession('a1'));
    for (const r of ROUTES.admin) {
      await page.evaluate(x => document.querySelector('[data-act="go"][data-route="' + x + '"]')?.click(), r);
      await page.waitForTimeout(170);
      await measure(w + '×' + h + ' admin/' + r);
    }
    /* talaba */
    await seed(FIX.withSession('s1'));
    for (const r of ROUTES.student) {
      await page.evaluate(x => document.querySelector('[data-act="go"][data-route="' + x + '"]')?.click(), r);
      await page.waitForTimeout(170);
      await measure(w + '×' + h + ' talaba/' + r);
    }
    /* bo'sh platforma (v2.0.0 — namuna ma'lumot yo'q) */
    await seed(founderState());
    for (const r of ROUTES.empty) {
      await page.evaluate(x => document.querySelector('[data-act="go"][data-route="' + x + '"]')?.click(), r);
      await page.waitForTimeout(170);
      await measure(w + '×' + h + ' bo‘sh/' + r);
    }
    /* v2.2.0: landing sahifasi (tizimga kirilmagan) — hero, bo'limlar, ariza formasi */
    await seed(FIX.withSession('a1'));
    await page.evaluate(() => { const r = JSON.parse(localStorage.getItem('ai-leaders-platform-v1')); r.session = null; localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(r)); });
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(500);
    await measure(w + '×' + h + ' landing/hero');
    for (const sec of ['#limkon', '#ljarayon', '#ldastur', '#lsavol', '#lkirish']) {
      await page.evaluate(x => document.querySelector(x).scrollIntoView({ block: 'start' }), sec);
      await page.waitForTimeout(420);
      await measure(w + '×' + h + ' landing/' + sec);
    }
    for (const tab of ['apply', 'admin']) {
      await page.evaluate(x => document.querySelector('[data-act="pick-role"][data-r="' + x + '"]')?.click(), tab);
      await page.waitForTimeout(260);
      await page.evaluate(() => document.querySelector('#lkirish').scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(260);
      await measure(w + '×' + h + ' landing/' + tab + '-tab');
    }
    console.log('  ✓ ' + w + '×' + h + ' tekshirildi');
  }
  await browser.close();
  console.log('\n' + (problems.length ? '✖ Layout xatolari:\n' + problems.map(x => '  • ' + x).join('\n') : '✔ Layout sog‘lom: ' + checks + ' sahifa-o‘lcham tekshiruvi, gorizontal toshish yo‘q'));
  process.exit(problems.length ? 1 : 0);
})();
