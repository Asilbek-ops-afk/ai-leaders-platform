/* Vizual QA: desktop va mobil ekranlarni suratga olish (playwright) */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, '..', '..', 'docs', 'screens');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file://' + path.join(__dirname, '..', '..', 'index.html');
const FIX = require('./fixtures.js');
/* v2.0.0: haqiqiy platforma bo'sh boshlanadi — namuna ma'lumot faqat shu yerda (fixtura) */
function founderState() {
  const st = FIX.emptyState();
  st.accounts = [{ id: 'acc-founder', role: 'admin', adminRole: 'founder', perms: ['__all'], nick: 'asilbek',
    name: 'Asilbek Yo‘ldoshev', email: 'founder@aileaders.uz', phone: null, hemisId: null, pass: 'fixture',
    mustSetPass: false, status: 'active', demo: false, created: '2026-10-14', lastLogin: Date.now() }];
  st.session = { acc: 'acc-founder', at: Date.now() };
  st.role = 'admin';
  return st;
}
function stateFor(name) {
  if (name === 'empty') return null;
  if (name === 'founder') return founderState();
  if (name === 'landing') { const l = FIX.withSession('a1'); l.session = null; return l; }
  if (name === 'demo') return FIX.demoState();
  return FIX.withSession(name);
}

(async () => {
  const browser = await chromium.launch();
  const shots = [
    { name: '01-kirish-desktop', vp: { width: 1440, height: 900 }, steps: [] },
    { name: '01b-kirish-noutbuk-1920', vp: { width: 1920, height: 1080 }, steps: [] },
    { name: '01c-kirish-planshet-1024', vp: { width: 1024, height: 800 }, steps: [] },
    { name: '02-talaba-bosh-desktop', vp: { width: 1440, height: 1100 }, steps: ['login-student'] },
    { name: '03-talaba-darslar', vp: { width: 1440, height: 1050 }, steps: ['login-student', 'go-lessons'] },
    { name: '04-talaba-vazifa', vp: { width: 1440, height: 1050 }, steps: ['login-student', 'go-tasks'] },
    { name: '05-talaba-deadline', vp: { width: 1440, height: 1050 }, steps: ['login-student', 'go-deadlines'] },
    { name: '06-talaba-jamoa', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'go-team'] },
    { name: '07-talaba-friends', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'go-friends'] },
    { name: '08-talaba-malumot', vp: { width: 1440, height: 1100 }, steps: ['login-student', 'go-info'] },
    { name: '09-admin-dashboard', vp: { width: 1440, height: 1100 }, steps: ['login-admin'] },
    { name: '10-admin-talabalar', vp: { width: 1440, height: 1050 }, steps: ['login-admin', 'go-students'] },
    { name: '11-admin-vazifalar', vp: { width: 1440, height: 1050 }, steps: ['login-admin', 'go-adminTasks'] },
    { name: '12-admin-jamoalar', vp: { width: 1440, height: 1050 }, steps: ['login-admin', 'go-adminGroups'] },
    { name: '13-admin-statistika', vp: { width: 1440, height: 1100 }, steps: ['login-admin', 'go-stats'] },
    { name: '14-admin-sozlamalar', vp: { width: 1440, height: 1050 }, steps: ['login-admin', 'go-settings'] },
    { name: '20-mobil-kirish', vp: { width: 390, height: 844 }, steps: [], mobile: true },
    { name: '21-mobil-bosh', vp: { width: 390, height: 844 }, steps: ['login-student'], mobile: true },
    { name: '22-mobil-darslar', vp: { width: 390, height: 880 }, steps: ['login-student', 'go-lessons'], mobile: true },
    { name: '23-mobil-deadline', vp: { width: 390, height: 900 }, steps: ['login-student', 'go-deadlines'], mobile: true },
    { name: '24-mobil-jamoa', vp: { width: 390, height: 880 }, steps: ['login-student', 'go-team'], mobile: true },
    { name: '25-mobil-admin', vp: { width: 390, height: 880 }, steps: ['login-admin'], mobile: true },
    { name: '26-modal-topshirish', vp: { width: 1440, height: 900 }, steps: ['login-student', 'go-tasks', 'modal-submit'] },
    { name: '27-modal-sertifikat', vp: { width: 1440, height: 950 }, steps: ['login-student', 'go-info', 'modal-cert'] },
    { name: '28-light-mavzu', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'theme', 'go-home'] },
    { name: '29-quiz-dars', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'go-lessons', 'module-m1', 'lesson-l1'] },
    { name: '30-light-deadline', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'theme', 'go-deadlines'] },
    { name: '31-admin-talaba-profili', vp: { width: 1440, height: 1000 }, steps: ['login-admin', 'go-students', 'student-profile'] },
    { name: '32-admin-darslar', vp: { width: 1440, height: 1000 }, steps: ['login-admin', 'go-adminLessons'] },
    /* --- v1.3.0: noutbuk rejimi --- */
    { name: '40-noutbuk-bosh-1920', vp: { width: 1920, height: 1080 }, steps: ['login-student'] },
    { name: '41-noutbuk-bosh-1440', vp: { width: 1440, height: 900 }, steps: ['login-student'] },
    { name: '42-noutbuk-yigilgan-panel', vp: { width: 1920, height: 1080 }, steps: ['login-student', 'collapse'] },
    { name: '43-noutbuk-palette', vp: { width: 1920, height: 1080 }, steps: ['login-student', 'palette-q'] },
    { name: '44-noutbuk-yorliqlar', vp: { width: 1440, height: 950 }, steps: ['login-student', 'shortcuts'] },
    { name: '45-noutbuk-vazifalar-2ustun', vp: { width: 1440, height: 1000 }, steps: ['login-student', 'go-tasks'] },
    { name: '46-noutbuk-admin-talabalar', vp: { width: 1920, height: 1080 }, steps: ['login-admin', 'go-students'] },
    { name: '47-noutbuk-kompakt-1366', vp: { width: 1366, height: 768 }, steps: ['login-student', 'go-deadlines'] },
    { name: '48-noutbuk-light-1920', vp: { width: 1920, height: 1080 }, steps: ['login-student', 'theme'] },
    { name: '49-noutbuk-admin-1680', vp: { width: 1680, height: 1050 }, steps: ['login-admin', 'go-stats'] },
    /* --- v1.4.0: MVP akkaunt tizimi --- */
    { name: '50-mvp-kirish-talaba-1920', vp: { width: 1920, height: 1080 }, steps: [] },
    { name: '51-mvp-kirish-admin-1920', vp: { width: 1920, height: 1080 }, steps: ['admin-login-form'] },
    { name: '52-mvp-birinchi-kirish-parol', vp: { width: 1920, height: 1080 }, steps: ['login-nick'] },
    { name: '53-mvp-kirish-mobil', vp: { width: 390, height: 844 }, steps: [], mobile: true },
    { name: '54-mvp-adminlar-bolimi', vp: { width: 1920, height: 1080 }, steps: ['login-admin', 'admins-page'] },
    { name: '55-mvp-admin-tahrirlash', vp: { width: 1920, height: 1080 }, steps: ['login-admin', 'admins-page', 'login-card'] },
    { name: '56-mvp-talaba-qoshish', vp: { width: 1440, height: 950 }, steps: ['login-admin', 'go-students', 'add-student'] },
    /* --- v1.4.1: ruxsatlar, parol, namuna paneli --- */
    { name: '57-v2-birinchi-sozlash-1920', vp: { width: 1920, height: 1080 }, steps: [], data: 'empty' },
    { name: '58-mvp-qulflangan-menyu', vp: { width: 1920, height: 1080 }, steps: ['login-mentor', 'go-adminTasks'] },
    { name: '59-mvp-ruxsat-sahifasi', vp: { width: 1920, height: 1080 }, steps: ['login-mentor', 'go-stats'] },
    { name: '60-mvp-parol-almashtirish', vp: { width: 1440, height: 950 }, steps: ['login-admin', 'pass-modal'] },
    { name: '61-mvp-ruxsat-mobil', vp: { width: 390, height: 844 }, steps: ['login-mentor', 'go-stats'], mobile: true },
    { name: '62-mvp-talaba-kirish-malumoti', vp: { width: 1440, height: 950 }, steps: ['login-admin', 'go-students', 'student-profile'] },
    /* --- v1.4.1: foydalanuvchi noutbuk/planshet o'lchamlari --- */
    { name: '63-mvp-1568-qulflar', vp: { width: 1568, height: 768 }, steps: ['login-mentor', 'go-adminTasks'] },
    { name: '64-v2-birinchi-sozlash-1568', vp: { width: 1568, height: 768 }, steps: [], data: 'empty' },
    { name: '65-mvp-1440-ruxsat', vp: { width: 1440, height: 900 }, steps: ['login-mentor', 'go-stats'] },
    { name: '66-mvp-1366-qulflar', vp: { width: 1366, height: 768 }, steps: ['login-mentor', 'go-adminTasks'] },
    { name: '67-v2-birinchi-sozlash-1024', vp: { width: 1024, height: 800 }, steps: [], data: 'empty' },
    { name: '68-mvp-1568-parol', vp: { width: 1568, height: 768 }, steps: ['login-admin', 'pass-modal'] },
    { name: '69-v2-light-bosh-panel', vp: { width: 1440, height: 900 }, steps: ['login-admin', 'theme', 'go-admin'] },
    { name: '70-v2-light-qulflar', vp: { width: 1440, height: 900 }, steps: ['login-mentor', 'theme', 'go-stats'] },
    { name: '71-mvp-light-talaba-kirish', vp: { width: 1440, height: 950 }, steps: ['login-admin', 'theme', 'go-students', 'student-profile'] },
    /* --- v2.0.0: namuna ma'lumotlar olib tashlandi — bo'sh platforma holatlari --- */
    { name: '72-v2-bosh-dashboard-1568', vp: { width: 1568, height: 768 }, steps: [], data: 'founder' },
    { name: '73-v2-bosh-talabalar-1440', vp: { width: 1440, height: 1000 }, steps: ['go-students'], data: 'founder' },
    { name: '74-v2-bosh-dashboard-mobil', vp: { width: 390, height: 844 }, steps: [], mobile: true, data: 'founder' },
    { name: '75-v2-bosh-statistika-1568', vp: { width: 1568, height: 768 }, steps: ['go-stats'], data: 'founder' },
    { name: '76-v2-csv-import', vp: { width: 1568, height: 768 }, steps: ['go-students', 'csv-import'], data: 'founder' },
    { name: '77-v2-import-yakunlandi', vp: { width: 1568, height: 768 }, steps: ['go-students', 'csv-import', 'csv-import-file', 'csv-import-confirm'], data: 'founder' },
    { name: '78-v2-undo-tugmasi', vp: { width: 1568, height: 768 }, steps: ['go-students', 'csv-import', 'csv-import-file', 'csv-import-confirm', 'csv-import-close'], data: 'founder' },
    /* v2.2.0 — landing sahifasi */
    { name: '79-v22-landing-hero-1920', vp: { width: 1920, height: 1080 }, steps: ['top'], data: 'landing' },
    { name: '80-v22-landing-imkoniyatlar', vp: { width: 1440, height: 1000 }, steps: ['land-sec:#limkon'], data: 'landing' },
    { name: '81-v22-landing-jarayon', vp: { width: 1440, height: 1000 }, steps: ['land-sec:#ljarayon'], data: 'landing' },
    { name: '82-v22-landing-dastur', vp: { width: 1440, height: 1050 }, steps: ['land-sec:#ldastur'], data: 'landing' },
    { name: '83-v22-landing-savollar', vp: { width: 1440, height: 950 }, steps: ['land-sec:#lsavol', 'faq-open'], data: 'landing' },
    { name: '84-v22-landing-kirish', vp: { width: 1568, height: 768 }, steps: ['land-sec:#lkirish'], data: 'landing' },
    { name: '85-v22-landing-ariza', vp: { width: 1568, height: 900 }, steps: ['land-sec:#lkirish', 'lead-tab'], data: 'landing' },
    { name: '86-v22-landing-kirish-admin', vp: { width: 1440, height: 1050 }, steps: ['land-sec:#lkirish', 'admin-tab'], data: 'landing' },
    { name: '87-v22-landing-mobil', vp: { width: 390, height: 844 }, steps: ['top'], data: 'landing' },
    { name: '88-v22-landing-kirish-mobil', vp: { width: 390, height: 844 }, steps: ['land-sec:#lkirish'], data: 'landing' },

    /* v2.3.0 — dizayn sayqali */
    { name: '89-v23-parol-kozi', vp: { width: 1568, height: 900 }, steps: ['land-sec:#lkirish', 'eye'], data: 'landing' },
    { name: '90-v23-kirish-kartochkasi', vp: { width: 1440, height: 1000 }, steps: ['go-students', 'student-profile', 'login-card'], data: 'a1' },
    { name: '91-v23-kartochka-bosma', vp: { width: 1440, height: 1000 }, steps: ['go-students', 'student-profile', 'login-card', 'print-media'], data: 'a1' },
    { name: '92-v23-talabalar-jadvali', vp: { width: 1568, height: 950 }, steps: ['go-students'], data: 'a1' },
    { name: '93-v23-mobil-qidiruv', vp: { width: 390, height: 844 }, steps: ['go-students'], data: 'a1' },

    /* v2.3.1 — ko'zdan kechirilmagan bo'limlar */
    { name: '94-v231-adminlar', vp: { width: 1568, height: 950 }, steps: ['go-adminAdmins'], data: 'a1' },
    { name: '95-v231-buyruq-paneli', vp: { width: 1568, height: 950 }, steps: ['go-admin', 'palette', 'palette-q'], data: 'a1' },
    { name: '96-v231-bildirishnomalar', vp: { width: 1568, height: 950 }, steps: ['go-admin', 'notifs'], data: 'a1' },
    { name: '97-v231-jamoalar', vp: { width: 1568, height: 950 }, steps: ['go-adminGroups'], data: 'a1' },
    { name: '98-v231-sozlamalar', vp: { width: 1568, height: 950 }, steps: ['go-settings'], data: 'a1' },
    { name: '99-v231-sertifikat', vp: { width: 1568, height: 950 }, steps: ['go-info', 'cert-modal'], data: 's1' },
    { name: '100-v231-birinchi-ishga-tushirish', vp: { width: 1568, height: 950 }, steps: [], data: 'empty' },

    /* v2.3.2 — yorug' mavzu kontrasti + faollik taqsimoti */
    { name: '101-v232-light-admin', vp: { width: 1568, height: 950 }, steps: ['theme', 'go-admin'], data: 'a1' },
    { name: '102-v232-light-statistika', vp: { width: 1568, height: 950 }, steps: ['theme', 'go-stats'], data: 'a1' },
    { name: '103-v232-light-vazifa', vp: { width: 1568, height: 950 }, steps: ['theme', 'go-tasks'], data: 's1' },
    { name: '104-v232-faollik-taqsimoti', vp: { width: 1568, height: 950 }, steps: ['go-stats'], data: 'a1' }
  ];
  const page = await browser.newPage();
  const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
  for (const s of shots) {
    if (ONLY && !ONLY.includes(s.name)) continue;
    await page.setViewportSize(s.vp);
    const seed = s.data || (s.steps.includes('login-mentor') ? 'a3' : s.steps.includes('login-admin') ? 'a1' : s.steps.includes('login-student') ? 's1' : 'demo');
    const state = stateFor(seed);
    await page.goto(URL, { waitUntil: 'load' });
    await page.evaluate(st => {
      localStorage.clear();
      if (st) localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(st));
      location.reload();
    }, state);
    await page.waitForTimeout(320);
    /* Brauzer skrolni tiklab qo'yadi — har bir surat tepadan boshlanadi */
    await page.evaluate(() => { try { history.scrollRestoration = 'manual'; } catch (e) { } window.scrollTo(0, 0); });
    await page.evaluate(t => {
      if (t === 'login-student' || t === 'login-admin' || t === 'login-mentor') { /* sessiya fixturadan */ }
      else if (t.startsWith('go-')) document.querySelector('[data-act="go"][data-route="' + t.slice(3) + '"]')?.click();
      else if (t === 'modal-submit') document.querySelector('[data-act="submit-open"][data-id="t4"]')?.click();
      else if (t === 'modal-cert') {
        const cert = [...document.querySelectorAll('[data-act="cert"]')][0];
        if (!cert) { document.querySelector('[data-act="go"][data-route="info"]')?.click(); }
        setTimeout(() => [...document.querySelectorAll('[data-act="cert"]')][0]?.click(), 50);
      }
      else if (t === 'theme') document.querySelector('[data-act="theme"]')?.click();
      else if (t === 'quiz') {
        document.querySelector('[data-act="go"][data-route="lessons"]')?.click();
        setTimeout(() => document.querySelector('[data-act="module-open"][data-id="m1"]')?.click(), 80);
        setTimeout(() => document.querySelector('[data-act="lesson-open"][data-id="l1"]')?.click(), 160);
      }
      else if (t === 'student-profile') {
        setTimeout(() => document.querySelector('[data-act="student-open"]')?.click(), 80);
      }
      else if (t === 'login-nick') {
        document.querySelector('[data-act="pick-role"][data-r="student"]')?.click();
        setTimeout(() => {
          const f = document.querySelector('[data-form="login-student"]');
          if (f) { f.querySelector('input[name="login"]').value = 'falcon'; f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }
        }, 120);
      }
      else if (t === 'csv-import') setTimeout(() => document.querySelector('[data-act="import-csv"]')?.click(), 120);
      else if (t === 'login-card') setTimeout(() => document.querySelector('[data-act="login-card"]')?.click(), 120);
      else if (t === 'eye') setTimeout(() => document.querySelector('[data-act="eye"]')?.click(), 220);
      else if (t === 'notifs') setTimeout(() => document.querySelector('[data-act="notifs"]')?.click(), 220);
      else if (t === 'cert-modal') setTimeout(() => document.querySelector('[data-act="cert"]')?.click(), 220);
      else if (t === 'top') setTimeout(() => window.scrollTo(0, 0), 160);
      else if (t.startsWith('land-sec:')) setTimeout(() => document.querySelector(t.slice(9))?.scrollIntoView({ block: 'start' }), 150);
      else if (t === 'lead-tab') setTimeout(() => document.querySelector('[data-act="pick-role"][data-r="apply"]')?.click(), 320);
      else if (t === 'admin-tab') setTimeout(() => document.querySelector('[data-act="pick-role"][data-r="admin"]')?.click(), 320);
      else if (t === 'faq-open') setTimeout(() => document.querySelector('.fq .fq-q')?.click(), 320);
      else if (t === 'palette') document.querySelector('[data-act="palette"]')?.click();
      else if (t === 'palette-q') {
        document.querySelector('[data-act="palette"]')?.click();
        setTimeout(() => { const i = document.getElementById('pal-input'); if (i) { i.value = 'dars'; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 130);
      }
      else if (t === 'collapse') document.querySelector('[data-act="collapse"]')?.click();
      else if (t === 'shortcuts') document.querySelector('[data-act="shortcuts"]')?.click();
    }, s.steps[0] || 'none');
    for (const st of s.steps.slice(1)) {
      await page.waitForTimeout(220);
      await page.evaluate(t => {
        if (t.startsWith('go-')) document.querySelector('[data-act="go"][data-route="' + t.slice(3) + '"]')?.click();
        else if (t === 'modal-submit') document.querySelector('[data-act="submit-open"][data-id="t4"]')?.click();
        else if (t === 'modal-cert') [...document.querySelectorAll('[data-act="cert"]')][0]?.click();
        else if (t === 'theme') document.querySelector('[data-act="theme"]')?.click();
        else if (t === 'student-profile') document.querySelector('[data-act="student-open"]')?.click();
        else if (t.startsWith('module-')) document.querySelector('[data-act="module-open"][data-id="' + t.slice(7) + '"]')?.click();
        else if (t.startsWith('lesson-')) document.querySelector('[data-act="lesson-open"][data-id="' + t.slice(7) + '"]')?.click();
        else if (t === 'student-profile') setTimeout(() => document.querySelector('[data-act="student-open"]')?.click(), 200);
        else if (t === 'csv-import') setTimeout(() => document.querySelector('[data-act="import-csv"]')?.click(), 120);
        else if (t === 'login-card') setTimeout(() => document.querySelector('[data-act="login-card"]')?.click(), 120);
        else if (t === 'eye') setTimeout(() => document.querySelector('[data-act="eye"]')?.click(), 220);
        else if (t === 'notifs') setTimeout(() => document.querySelector('[data-act="notifs"]')?.click(), 220);
        else if (t === 'cert-modal') setTimeout(() => document.querySelector('[data-act="cert"]')?.click(), 220);
        else if (t === 'top') setTimeout(() => window.scrollTo(0, 0), 160);
        else if (t.startsWith('land-sec:')) setTimeout(() => document.querySelector(t.slice(9))?.scrollIntoView({ block: 'start' }), 150);
        else if (t === 'lead-tab') setTimeout(() => document.querySelector('[data-act="pick-role"][data-r="apply"]')?.click(), 320);
        else if (t === 'admin-tab') setTimeout(() => document.querySelector('[data-act="pick-role"][data-r="admin"]')?.click(), 320);
        else if (t === 'faq-open') setTimeout(() => document.querySelector('.fq .fq-q')?.click(), 320);
        else if (t === 'palette') document.querySelector('[data-act="palette"]')?.click();
        else if (t === 'palette-q') {
          document.querySelector('[data-act="palette"]')?.click();
          setTimeout(() => { const i = document.getElementById('pal-input'); if (i) { i.value = 'dars'; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 130);
        }
        else if (t === 'collapse') document.querySelector('[data-act="collapse"]')?.click();
        else if (t === 'shortcuts') document.querySelector('[data-act="shortcuts"]')?.click();
      }, st);
    }
    /* CSV import qadamlari haqiqiy fayl bilan (faqat shu suratlar uchun) */
    if (s.steps.includes('csv-import-file')) {
      const os = require('os');
      const tmp = path.join(os.tmpdir(), 'screens-talabalar.csv');
      fs.writeFileSync(tmp, 'ism_familiya,hemis_id,telefon,jamoa,telegram,maqsad\n' +
        'Dilnoza Karimova,111222333444,+998901112233,Nova,@dilnoza,Landing + AI\n' +
        'Rustam Aliyev,111222333555,+998901112234,Nova,@rustam,Frontend\n' +
        'Sardor Bekov,111222333666,+998901112235,Orbit,@sardor,AI mahsulot\n' +
        'Malika Yusupova,111222333777,+998901112236,Orbit,@malika,UX tadqiqot\n');
      await page.setInputFiles('#import-csv', tmp);
      await page.waitForTimeout(500);
    }
    if (s.steps.includes('csv-import-confirm')) {
      await page.click('[data-form="csv-import"] button[type="submit"]');
      await page.waitForTimeout(650);
    }
    if (s.steps.includes('csv-import-close')) {
      await page.click('[data-act="close-modal"]');
      await page.waitForTimeout(450);
    }
    if (s.steps.includes('print-media')) { await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(320); }
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(OUT, s.name + '.png'), fullPage: false });
    if (s.steps.includes('print-media')) await page.emulateMedia({ media: 'screen' });
    console.log('  ✓ ' + s.name);
  }
  await browser.close();
  console.log('\nScreenshotlar: ' + OUT);
})();
