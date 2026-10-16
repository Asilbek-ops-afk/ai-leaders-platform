/* ==========================================================================
   PRINT — chop etish (bosma) ko'rinishini haqiqiy PDF orqali tekshiradi.
   playwight `emulateMedia` yetarli emas: haqiqiy `page.pdf()` chop etish
   CSS'ini qo'llaydi. Natija pdftotext bilan o'qiladi.
   Ishlatish: npm run test:print
   ========================================================================== */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const FIX = require('./fixtures.js');

const LOCAL = 'file://' + path.join(__dirname, '..', '..', 'index.html');
const BASE = process.env.TEST_URL || LOCAL;
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'ail-print-'));

let issues = 0;
const report = (w, m) => { issues++; console.log('   ✗ [' + w + '] ' + m); };
const ok = (w, m) => console.log('   ✓ ' + w + (m ? ' — ' + m : ''));

function pdfText(file) {
  try { return execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' }); }
  catch (e) { return ''; }
}
function pageCount(file) {
  try { return +execFileSync('pdfinfo', [file], { encoding: 'utf8' }).match(/^Pages:\s+(\d+)/m)[1]; }
  catch (e) { return -1; }
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1568, height: 950 } });
  const seed = async st => {
    await p.goto(BASE, { waitUntil: 'load' });
    await p.evaluate(s => { localStorage.clear(); localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(s)); location.reload(); }, st);
    await p.waitForTimeout(520);
  };
  const click = sel => p.evaluate(s => { const el = document.querySelector(s); if (el) el.click(); }, sel);

  /* ---------- 1) Talaba kirish kartochkasi (asosiy bosma hujjat) ---------- */
  await seed(FIX.withSession('a1'));
  await click('.sidebar [data-act="go"][data-route="students"]');
  await p.waitForTimeout(260);
  await click('[data-act="student-open"]');
  await p.waitForTimeout(320);
  await click('[data-act="login-card"]');
  await p.waitForTimeout(320);
  await click('[data-act="print-card"]');           /* → printZone + «Chop etish» */
  await p.waitForTimeout(420);
  const f1 = path.join(OUT, 'kartochka.pdf');
  await p.pdf({ path: f1, format: 'A4', printBackground: true });
  const t1 = pdfText(f1), n1 = pageCount(f1);
  console.log('\n— 1) Kirish kartochkasi (A4) —');
  if (n1 !== 1) report('kartochka', 'sahifalar soni ' + n1 + ' (1 kutilgan)'); else ok('bitta sahifada');
  const hasNick = /talaba|nick|HEMIS|@/i.test(t1);
  if (!hasNick) report('kartochka', 'PDF bo‘sh yoki o‘qib bo‘lmaydi'); else ok('matn o‘qiladi', Math.round(t1.length) + ' belgi');
  /* Sidebar/topbar bosmada chiqmasligi kerak */
  const junk = ['Boshqaruv', 'Statistika', 'Sozlamalar', 'Chiqish', 'Ctrl K', 'Chop etish', 'Yopish']
    .filter(x => t1.includes(x));
  if (junk.length) report('kartochka', 'kartochkadan tashqari matn ham bosilgan: ' + junk.join(', ')); else ok('faqat kartochka bosilgan (navigatsiya va tugmalar yo‘q)');

  /* ---------- 2) Sertifikat (chop etiladigan ikkinchi hujjat) ---------- */
  await seed(FIX.withSession('s1'));
  await click('.sidebar [data-act="go"][data-route="info"]');
  await p.waitForTimeout(300);
  await click('[data-act="cert"]');
  await p.waitForTimeout(420);
  const f2 = path.join(OUT, 'sertifikat.pdf');
  await p.pdf({ path: f2, format: 'A4', printBackground: true });
  const t2 = pdfText(f2), n2 = pageCount(f2);
  console.log('\n— 2) Sertifikat —');
  if (n2 < 1) report('sertifikat', 'PDF yaratilmadi'); else ok(n2 + ' sahifa');
  if (t2.trim().length < 40) report('sertifikat', 'matn juda kam (' + t2.trim().length + ' belgi)'); else ok('matn o‘qiladi', Math.round(t2.length) + ' belgi');
  const certK = ['AI Leaders', 'sertifikat', 'modul'].filter(x => t2.toLowerCase().includes(x.toLowerCase()));
  if (certK.length < 1) report('sertifikat', 'sertifikat matni topilmadi'); else ok('sertifikat mazmuni bor', certK.join(', '));
  if (n2 !== 1) report('sertifikat', 'bitta varaqda chiqishi kerak, hozir ' + n2 + ' varaq');
  const behind = ['Profilni tahrirlash', 'Tugatilgan darslar', 'Boshqaruv'].filter(x => t2.includes(x));
  if (behind.length) report('sertifikat', 'orqadagi sahifa ham bosilgan: ' + behind.join(', ')); else ok('orqa sahifa bosmaga tushmagan');

  /* ---------- 3) Oddiy sahifa bosmasi (orqa fon/menyu chiqmasin) ---------- */
  await seed(FIX.withSession('a1'));
  await click('.sidebar [data-act="go"][data-route="admin"]');
  await p.waitForTimeout(300);
  const f3 = path.join(OUT, 'dashboard.pdf');
  await p.pdf({ path: f3, format: 'A4', printBackground: true });
  const t3 = pdfText(f3), n3 = pageCount(f3);
  console.log('\n— 3) Dashboard bosmasi —');
  ok(n3 + ' sahifa', Math.round(t3.length) + ' belgi');
  if (t3.includes('ctrl') || t3.includes('Ctrl K')) report('dashboard', '«Ctrl K» yorlig‘i bosmada qolgan');

  /* ---------- 4) Modal ochiq holda bosma (fon qoraymasin) ---------- */
  await seed(FIX.withSession('a1'));
  await click('.sidebar [data-act="go"][data-route="students"]');
  await p.waitForTimeout(240);
  await click('[data-act="new-student"]');
  await p.waitForTimeout(320);
  const f4 = path.join(OUT, 'modal.pdf');
  await p.pdf({ path: f4, format: 'A4', printBackground: true });
  const t4 = pdfText(f4), n4 = pageCount(f4);
  console.log('\n— 4) Modal ochiq holda bosma —');
  ok(n4 + ' sahifa', Math.round(t4.length) + ' belgi');
  if (t4.trim().length < 30) report('modal', 'bo‘sh varaq (modal bosmada ko‘rinmaydi)');
  if (n4 !== 1) report('modal', 'modal bitta varaqda chiqishi kerak, hozir ' + n4 + ' varaq');
  if (t4.includes('Guruh, daraja va faollik bo‘yicha kuzatuv')) report('modal', 'orqadagi «Talabalar» sahifasi ham bosilgan');

  await b.close();
  console.log('\nPDF namunalar: ' + OUT);
  console.log('\n' + '─'.repeat(64));
  console.log(issues === 0 ? '✔ PRINT: chop etish ko‘rinishi toza' : '✖ PRINT: ' + issues + ' ta nuqson');
  console.log('─'.repeat(64) + '\n');
  process.exit(issues ? 1 : 0);
})();
