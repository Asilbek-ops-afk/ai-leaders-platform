/* Layout QA: har bir o'lchamda gorizontal toshish (overflow) yo'qligini tekshiradi.
   Ishlatish: node tools/tests/layout.js   (yoki: npm run test:layout)
   Xohlasa TEST_URL=<url> bilan jonli saytni ham tekshirish mumkin. */
const { chromium } = require('playwright');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const URL = process.env.TEST_URL || ('file://' + path.join(ROOT, 'index.html'));
const SIZES = [[390, 844], [768, 1024], [1024, 800], [1366, 768], [1568, 768], [1440, 900], [1920, 1080]];
const ROUTES = { admin: ['admin', 'students', 'adminTasks', 'adminGroups', 'adminDeadlines', 'stats', 'settings'], student: ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'] };

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

  for (const [w, h] of SIZES) {
    await page.setViewportSize({ width: w, height: h });
    /* admin */
    await page.goto(URL, { waitUntil: 'load' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(350);
    await page.evaluate(() => document.querySelector('[data-act="sample-accounts"]').click());
    await page.waitForTimeout(230);
    await page.evaluate(() => document.querySelector('.acc-row[data-id="acc-a1"]').click());
    await page.waitForTimeout(520);
    for (const r of ROUTES.admin) {
      await page.evaluate(x => document.querySelector('[data-act="go"][data-route="' + x + '"]')?.click(), r);
      await page.waitForTimeout(170);
      await measure(w + '×' + h + ' admin/' + r);
    }
    /* talaba */
    await page.evaluate(() => { const l = document.querySelector('[data-act="logout"]'); if (l) l.click(); });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector('[data-act="quick"][data-s="s1"]').click());
    await page.waitForTimeout(420);
    for (const r of ROUTES.student) {
      await page.evaluate(x => document.querySelector('[data-act="go"][data-route="' + x + '"]')?.click(), r);
      await page.waitForTimeout(170);
      await measure(w + '×' + h + ' talaba/' + r);
    }
    console.log('  ✓ ' + w + '×' + h + ' tekshirildi');
  }
  await browser.close();
  console.log('\n' + (problems.length ? '✖ Layout xatolari:\n' + problems.map(x => '  • ' + x).join('\n') : '✔ Layout sog‘lom: ' + checks + ' sahifa-o‘lcham tekshiruvi, gorizontal toshish yo‘q'));
  process.exit(problems.length ? 1 : 0);
})();
