/* Vizual QA: desktop va mobil ekranlarni suratga olish (playwright) */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, '..', '..', 'docs', 'screens');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file://' + path.join(__dirname, '..', '..', 'index.html');

(async () => {
  const browser = await chromium.launch();
  const shots = [
    { name: '01-kirish-desktop', vp: { width: 1440, height: 900 }, steps: [] },
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
    { name: '49-noutbuk-admin-1680', vp: { width: 1680, height: 1050 }, steps: ['login-admin', 'go-stats'] }
  ];
  const page = await browser.newPage();
  const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
  for (const s of shots) {
    if (ONLY && !ONLY.includes(s.name)) continue;
    await page.setViewportSize(s.vp);
    await page.goto(URL, { waitUntil: 'load' });
    await page.evaluate(() => { localStorage.clear(); location.reload(); });
    await page.waitForTimeout(250);
    await page.evaluate(t => {
      if (t === 'login-student') document.querySelector('[data-act="quick"][data-s="s1"]').click();
      else if (t === 'login-admin') document.querySelector('[data-act="quick"][data-r="admin"]').click();
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
        else if (t === 'palette') document.querySelector('[data-act="palette"]')?.click();
        else if (t === 'palette-q') {
          document.querySelector('[data-act="palette"]')?.click();
          setTimeout(() => { const i = document.getElementById('pal-input'); if (i) { i.value = 'dars'; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 130);
        }
        else if (t === 'collapse') document.querySelector('[data-act="collapse"]')?.click();
        else if (t === 'shortcuts') document.querySelector('[data-act="shortcuts"]')?.click();
      }, st);
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, s.name + '.png'), fullPage: false });
    console.log('  ✓ ' + s.name);
  }
  await browser.close();
  console.log('\nScreenshotlar: ' + OUT);
})();
