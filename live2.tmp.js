/* JONLI: landing → ariza → admin → talaba (jonli saytda) */
const { chromium } = require('playwright');
const URL2 = 'https://ai-leaders-platform.pages.dev/';
const log = []; const t = (n, c) => log.push((c ? '✓' : '✗') + ' ' + n);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1568, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(URL2, { waitUntil: 'load' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(700);
  // bo'sh o'rnatish → founder
  t('bo‘sh o‘rnatishda Founder ekrani', await p.$('[data-form="setup-founder"]') !== null);
  await p.fill('input[name="name"]', 'Asilbek Yo‘ldoshev'); await p.fill('input[name="email"]', 'founder@aileaders.uz');
  await p.fill('input[name="p1"]', 'aileaders2026'); await p.fill('input[name="p2"]', 'aileaders2026');
  await p.click('[data-form="setup-founder"] button[type="submit"]'); await p.waitForTimeout(800);
  // sessiyani uzamiz → landing
  await p.evaluate(() => { const r = JSON.parse(localStorage.getItem('ai-leaders-platform-v1')); r.session = null; localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(r)); });
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1500);
  t('landing sahifa ochildi', await p.$('.lhero') !== null && await p.$('#lkirish') !== null);
  t('hero sarlavhasi va 2 CTA', (await p.textContent('.lhero h1')).includes('G‘oyadan') && await p.locator('.lhero .lcta .btn').count() === 2);
  t('navigatsiya + progress chizig‘i', await p.$('.lnav') !== null && await p.$('#lprog') !== null);
  await p.screenshot({ path: '/tmp/live-landing.png' });
  // skrollda ochilish
  await p.evaluate(() => document.querySelector('#lkirish').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(1800);
  t('kirish bo‘limi skrollda ochildi (3D karta)', await p.evaluate(() => document.querySelector('.lauth').classList.contains('in') && document.querySelector('.rev-card').classList.contains('in')));
  await p.screenshot({ path: '/tmp/live-auth.png' });
  // ariza
  await p.click('[data-act="pick-role"][data-r="apply"]'); await p.waitForTimeout(1500);
  await p.fill('[data-form="lead"] input[name="name"]', 'Dilnoza Karimova');
  await p.fill('[data-form="lead"] input[name="phone"]', '+998 90 111 22 33');
  await p.fill('[data-form="lead"] textarea[name="goal"]', 'AI bilan mahsulot yasash');
  await p.click('[data-form="lead"] button[type="submit"]'); await p.waitForTimeout(1000);
  t('ariza jonli saytda qabul qilindi', /Ariza qabul qilindi/.test(await p.textContent('.lauth-card')));
  await p.screenshot({ path: '/tmp/live-lead-done.png' });
  // admin
  await p.evaluate(() => { const r = JSON.parse(localStorage.getItem('ai-leaders-platform-v1')); const a = r.accounts.find(x => x.adminRole === 'founder'); r.session = { acc: a.id, at: Date.now() }; r.role = 'admin'; localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(r)); });
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(900);
  t('dashboard ariza haqida ogohlantiradi', /1 ta yangi ariza keldi/.test(await p.textContent('.content')));
  await p.click('[data-act="go"][data-route="students"]'); await p.waitForTimeout(600);
  t('«Yangi arizalar (1)» bloki', /Yangi arizalar \(1\)/.test(await p.textContent('.content')));
  await p.screenshot({ path: '/tmp/live-lead-admin.png' });
  await p.click('[data-act="lead-approve"]'); await p.waitForTimeout(600);
  await p.fill('[data-form="new-student"] input[name="hemis"]', '111222333444');
  await p.click('[data-form="new-student"] button[type="submit"]'); await p.waitForTimeout(900);
  const S0 = await p.evaluate(() => { const r = JSON.parse(localStorage.getItem('ai-leaders-platform-v1')); return { st: r.students.length, leads: r.leads.length, card: /Kirish kartochkasi/.test(document.querySelector('.mbox') ? document.querySelector('.mbox').textContent : '') }; });
  t('ariza → talaba + kirish kartochkasi', S0.st === 1 && S0.leads === 0 && S0.card);
  await p.screenshot({ path: '/tmp/live-card.png' });
  t('JS xatosi yo‘q (jonli landing + ariza)', errs.length === 0);
  console.log('\n' + log.join('\n'));
  if (errs.length) console.log('XATOLAR:', errs.slice(0, 3));
  console.log('\n' + (log.every(x => x[0] === '✓') ? '✔ JONLI: LANDING + ARIZA OQIMI ISHLAYDI' : '✖ kamchilik bor'));
  await b.close();
})();
