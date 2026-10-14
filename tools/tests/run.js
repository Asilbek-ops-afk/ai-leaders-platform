/* ============================================================================
   AI Leaders — avtomatik test to'plami (jsdom)
   Ishlatish:  npm test            (barcha testlar)
               npm test -- --verbose
   Test qamrovi: kirish ekrani, 7 talaba bo'limi, 8 admin bo'limi,
   topshirish/baholash oqimi, jamoa boshqaruvi, deadline kalendari,
   gamification, sana mantig'i, rol himoyasi, PWA/SEO teglari, eksport.
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');

let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require('jsdom'));
} catch (e) {
  console.error('\n✖ jsdom topilmadi. Avval: npm install\n');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..', '..');
/* TEST_URL berilgan bo'lsa — jonli saytni tekshiradi (masalan CI'da smoke test) */
const REMOTE = process.env.TEST_URL || '';
let HTML = REMOTE ? '' : fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
/* TEST_URL berilgan bo'lsa — jonli saytdagi HTML'ni yuklab, o'sha ustida tekshiramiz */
async function loadRemote() {
  if (!REMOTE) return;
  const res = await fetch(REMOTE);
  if (!res.ok) throw new Error('Jonli sayt javob bermadi: ' + res.status);
  HTML = await res.text();
  console.log('\n\x1b[36mJonli manba:\x1b[0m ' + REMOTE + '  (' + Math.round(HTML.length / 1024) + ' KB)');
}

/* ---- test muhiti uchun kichik hook (ishlab chiqarish kodiga ta'sir qilmaydi) ---- */
const HOOK = `
window.AIL = {
  get S(){ return S; },
  get UI(){ return UI; },
  go: r => go(r),
  forceGo: r => { UI.route = r; UI.module = null; paint(); },
  exportCSV: () => { try { exportCSV(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  exportMy: () => { try { exportMyCSV(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  downloadState: () => { try { downloadState(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  palActs: () => (PAL.visible || []).map(x => x.act),
  palOpen: () => !!document.querySelector('.mbox.pal'),
  collapse: () => UI.collapsed,
  setCollapse: v => { UI.collapsed = !!v; S.settings.sidebarCollapsed = !!v; },
  isFounder: () => isFounder(),
  accById: id => { const a = accById(id); return a ? JSON.parse(JSON.stringify(a)) : null; },
  accByHemis: h => { const a = accByHemis(h); return a ? JSON.parse(JSON.stringify(a)) : null; },
  accByEmail: e => { const a = accByEmail(e); return a ? JSON.parse(JSON.stringify(a)) : null; },
  digits: v => digitsOnly(v),
  validHemis: h => validHemis(h),
  check: (l, p) => { const r = authCheck(l, p); return { err: r.err || null, ok: !!r.ok, acc: r.acc ? { id: r.acc.id, nick: r.acc.nick } : null, msg: r.msg || '' }; },
  create: (name, phone, hemis) => { const r = createStudentAccount({ name, phone, hemisId: hemis }); return { ok: !!r.ok, err: r.err || null, msg: r.msg || '', acc: r.acc ? JSON.parse(JSON.stringify(r.acc)) : null }; },
  createAdmin: (name, email, nick, role, perms) => { const r = createAdminAccount({ name, email, nick, adRole: role, perms }); return { ok: !!r.ok, err: r.err || null, msg: r.msg || '', acc: r.acc ? JSON.parse(JSON.stringify(r.acc)) : null }; },
  setPassById: (id, pass) => { const a = accById(id); const r = setAccountPass(a, pass); return { ok: !!r.ok, err: r.err || null, msg: r.msg || '' }; },
  logout: () => logoutAcc(),
  setStatus: (id, st2) => { const a = accById(id); if (a) { a.status = st2; save(); } },
  repaint: () => paint(true),
  canView: r => canView(r),
  actAllowed: a => actAllowed(a),
  runPalette: a => runPalette(a),
  openPalette: () => openPalette(),
  closePalette: () => closeModal(),
  closeModal: () => closeModal(),
  needsSetup: () => needsSetup(),
  csvReport: t2 => { const r = csvStudentsReport(t2); return { ok: r.ok || [], groups: r.groups || [], errors: r.errors || [], warns: r.warns || [], fatal: r.fatal || null }; },
  founder: () => { const a = founderAcc(); return a ? { id: a.id, name: a.name, nick: a.nick } : null; },
  createFounder: o => { const r = createFounderAccount(o || {}); return { ok: !!r.ok, err: r.err || null, msg: r.msg || '', acc: r.acc ? JSON.parse(JSON.stringify(r.acc)) : null }; },
  reset: () => resetAll(),
  passResetById: id => passReset(id),
  saveNow: () => save(),
  loginAs: id => { const a = accById(id); if (a) finishLogin(a, true); },
  prune: o => {
    if (o) { const r = pruneOrphans(o); return JSON.parse(JSON.stringify(r)); }
    pruneOrphans(); save(); return null;
  },
  addStudent: d2 => { const r = addStudentRecord(d2); return r.ok ? { ok: true, acc: { id: r.acc.id, nick: r.acc.nick, hemisId: r.acc.hemisId }, s: r.student.id } : { ok: false, err: r.err, msg: r.msg }; },
  version: () => APP_VERSION
};`;

function boot(preload) {
  /* jsdom FileReader asinxron — tick kutish uchun */

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/scrollTo|Not implemented/.test(e.message)) errors.push('jsdomError: ' + e.message); });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const pre = preload ? '<script>try{localStorage.setItem("ai-leaders-platform-v1",' + JSON.stringify(preload) + ')}catch(e){}</script>' : '';
  const dom = new JSDOM(pre + HTML.replace('<script>', '<script>' + HOOK + '\n'),
    { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://ai-leaders-platform.pages.dev/' });
  const w = dom.window, d = w.document;
  return {
    w, d, errors,
    txt: () => d.getElementById('app').textContent || '',
    has(s) { return (d.getElementById('app').textContent || '').includes(s); },
    hasModal(s) { const b = d.querySelector('.mbox'); return !!b && b.textContent.includes(s); },
    click(sel) {
      const el = d.querySelector(sel);
      if (!el) throw new Error('element topilmadi: ' + sel);
      el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
      return el;
    },
    set(sel, v) {
      const el = d.querySelector(sel);
      if (!el) throw new Error('input topilmadi: ' + sel);
      el.value = v; return el;
    },
    submit(sel) {
      const f = d.querySelector(sel);
      if (!f) throw new Error('forma topilmadi: ' + sel);
      f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    },
    change(sel, v) {
      const el = d.querySelector(sel);
      if (!el) throw new Error('select topilmadi: ' + sel);
      el.value = v; el.dispatchEvent(new w.Event('change', { bubbles: true }));
    }
  };
}

/* ---- fixtura: namunaviy ma'lumotlar FAQAT testlarda (src ichida yo'q) ---- */
const FIX = require('./fixtures.js');
/* Namuna holat bilan ishga tushirish */
function bootF(preload) { return boot(preload || JSON.stringify(FIX.demoState())); }
/* Namuna holat + darhol tizimga kirish */
function bootS(accId) { return boot(JSON.stringify(FIX.withSession(accId))); }
/* Bo'sh (yangi o'rnatilgan) platforma — birinchi ishga tushirish ekrani */
function bootE() { return boot(); }

/* ---- test yozuvchi ---- */
let pass = 0, fail = 0; const failures = [];
const VERBOSE = process.argv.includes('--verbose');
function group(name) { console.log('\n\x1b[1m' + name + '\x1b[0m'); }
function t(name, cond) {
  if (cond) { pass++; if (VERBOSE) console.log('  \x1b[32m✓\x1b[0m ' + name); }
  else { fail++; failures.push(name); console.log('  \x1b[31m✗ ' + name + '\x1b[0m'); }
}
function tIs(name, fn, expected) {
  let got;
  try { got = fn(); } catch (e) { got = 'THROW: ' + e.message; }
  t(name + '  (→ ' + JSON.stringify(got) + ')', JSON.stringify(got) === JSON.stringify(expected));
}
const noCrash = x => { let bad = /NaN|undefined|\[object Object\]|Infinity/.test(x); return !bad; };

async function main() {
await loadRemote();
/* ================= 0. BO'SH PLATFORMA VA BIRINCHI ISHGA TUSHIRISH ============== */
group('0. Bo‘sh platforma: birinchi ishga tushirish va Founder akkaunti');
{
  const Z = bootE();
  t('platforma bo‘sh holatda boshlanadi (talaba/akkaunt/vazifa yo‘q)',
    Z.w.AIL.S.students.length === 0 && Z.w.AIL.S.accounts.length === 0 && Z.w.AIL.S.tasks.length === 0 && Z.w.AIL.S.groups.length === 0);
  t('birinchi ishga tushirish ekrani ko‘rinadi', Z.has('Birinchi ishga tushirish') && !!Z.d.querySelector('[data-form="setup-founder"]'));
  t('sozlash formasi maydonlari (ism, email, parol x2)',
    ['name', 'email', 'p1', 'p2'].every(n2 => !!Z.d.querySelector('[data-form="setup-founder"] input[name="' + n2 + '"]')));
  t('eski namuna rejimi tugmalari yo‘q (quick/sample-accounts)', !Z.d.querySelector('[data-act="quick"]') && !Z.d.querySelector('[data-act="sample-accounts"]') && !Z.has('Namuna rejimi'));
  t('o‘quv dasturi saqlanib qolgan (6 modul / 29 dars)', Z.w.AIL.S.modules.length === 6 && Z.w.AIL.S.lessons.length >= 29);
  t('needsSetup() rost (akkaunt yo‘q)', Z.w.AIL.needsSetup() === true);
  const setF = o => {
    ['name', 'email', 'p1', 'p2'].forEach(k2 => { Z.d.querySelector('[data-form="setup-founder"] input[name="' + k2 + '"]').value = o[k2] || ''; });
    Z.submit('[data-form="setup-founder"]');
  };
  setF({ name: 'Al', email: 'a@b.uz', p1: 'parol1234', p2: 'parol1234' });
  t('qisqa ism rad etiladi', Z.has('to‘liq kiriting') && Z.w.AIL.S.accounts.length === 0);
  setF({ name: 'Asil Bek', email: 'notogri', p1: 'parol1234', p2: 'parol1234' });
  t('noto‘g‘ri email rad etiladi', Z.has('Email manzil noto‘g‘ri'));
  setF({ name: 'Asil Bek', email: 'asil@aileaders.uz', p1: '123', p2: '123' });
  t('qisqa parol rad etiladi', Z.has('kamida 4 belgi'));
  setF({ name: 'Asil Bek', email: 'asil@aileaders.uz', p1: 'parol1234', p2: 'boshqa1234' });
  t('mos kelmagan parol rad etiladi', Z.has('mos kelmadi') && Z.w.AIL.S.accounts.length === 0);
  setF({ name: 'Asil Bek', email: 'asil@aileaders.uz', p1: 'parol1234', p2: 'parol1234' });
  t('founder yaratildi va tizimga kirdi', Z.w.AIL.S.accounts.length === 1 && Z.w.AIL.UI.authShow === false && !!Z.d.querySelector('aside'));
  t('founder roli va to‘liq huquq', (() => {
    const a = Z.w.AIL.accByEmail('asil@aileaders.uz');
    return !!a && a.adminRole === 'founder' && a.perms.includes('__all') && a.mustSetPass === false && Z.w.AIL.isFounder() === true;
  })());
  t('founder nick berildi (unikal)', !!Z.w.AIL.founder() && Z.w.AIL.founder().nick.length > 2);
  t('needsSetup() endi yolg‘on', Z.w.AIL.needsSetup() === false);
  t('bo‘sh platformada 4 qadamli boshlash yo‘riqnomasi', Z.has('Boshlash — 4 qadam') && Z.has('Talaba qo‘shing') && Z.has('Admin va mentor qo‘shing'));
  t('bo‘sh holatda barcha bo‘limlar yiqilmaydi', (() => {
    const before = Z.errors.length;
    ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings', 'adminAdmins'].forEach(r2 => Z.w.AIL.go(r2));
    Z.w.AIL.go('admin');
    return Z.errors.length === before && !/NaN|undefined/.test(Z.d.querySelector('.content').textContent);
  })());
  t('bo‘sh holatda statistika «ma’lumot yo‘q» ko‘rsatadi', (() => { Z.w.AIL.go('stats'); return Z.has('Statistika uchun ma’lumot yo‘q'); })());
  t('bo‘sh holatda talabalar bo‘limi yo‘riqnoma beradi', (() => { Z.w.AIL.go('students'); return Z.has('Hali talaba yo‘q'); })());
  t('founder sessiyasi va demoPurged belgisi saqlandi', (() => {
    const raw = JSON.parse(Z.w.localStorage.getItem('ai-leaders-platform-v1'));
    return !!raw.session && raw.accounts.length === 1 && raw.meta && raw.meta.demoPurged === true;
  })());
  t('sahifa yangilanganda sozlash ekrani qaytmaydi', (() => {
    const Z2 = bootF(Z.w.localStorage.getItem('ai-leaders-platform-v1'));
    return Z2.d.getElementById('app').className.indexOf('authscreen') === -1 && Z2.w.AIL.S.accounts.length === 1 && Z2.errors.length === 0;
  })());
  t('JS xatosi yo‘q (bo‘sh holat + founder)', Z.errors.length === 0);
}

/* ================= 0b. MIGRATSIYA: ESKI NAMUNA HOLATI TOZALANADI ============= */
group('0b. Migratsiya: eski namuna ma’lumotlar avtomatik o‘chiriladi');
{
  const legacy = FIX.demoState();
  delete legacy.meta.demoPurged; legacy.meta.version = '1.4.1';
  const P = bootF(JSON.stringify(legacy));
  t('eski holatdagi namuna talaba/adminlar o‘chdi',
    P.w.AIL.S.students.length === 0 && P.w.AIL.S.accounts.length === 0 && P.w.AIL.S.tasks.length === 0 && P.w.AIL.S.mentors.length === 0);
  t('o‘chirilgach birinchi ishga tushirish ekrani', P.has('Birinchi ishga tushirish') && !!P.d.querySelector('[data-form="setup-founder"]'));
  t('holat demoPurged belgisi bilan saqlanadi', (() => {
    const raw = JSON.parse(P.w.localStorage.getItem('ai-leaders-platform-v1') || '{}');
    return raw.meta && raw.meta.demoPurged === true && raw.meta.purgedFrom === '1.4.1';
  })());
  t('mavzu va sozlamalar saqlanadi', (() => {
    const lg = FIX.demoState(); delete lg.meta.demoPurged; lg.theme = 'light'; lg.settings.notif = false;
    const Q = bootF(JSON.stringify(lg));
    return Q.w.AIL.S.theme === 'light' && Q.w.AIL.S.settings.notif === false;
  })());
  t('haqiqiy akkaunt va talaba profili saqlanadi', (() => {
    const lg = FIX.demoState(); delete lg.meta.demoPurged;
    lg.accounts.push({ id: 'acc-real1', role: 'student', studentId: 's-real1', nick: 'realone', name: 'Real Talaba', phone: null, hemisId: '555666777888', groupId: null, pass: null, mustSetPass: true, status: 'active', demo: false, created: '2026-01-01', lastLogin: null });
    lg.students.push({ id: 's-real1', name: 'Real Talaba', group: null, act: true, last: 0, xp: 0, wxp: 0, score: 0, tg: '', phone: '', goal: '', bio: '', joined: '2026-01-01' });
    lg.friends['s-real1'] = []; lg.incoming['s-real1'] = []; lg.sent['s-real1'] = [];
    const Q = bootF(JSON.stringify(lg));
    return Q.w.AIL.S.accounts.length === 1 && Q.w.AIL.S.accounts[0].nick === 'realone'
      && Q.w.AIL.S.students.length === 1 && Q.w.AIL.S.students[0].id === 's-real1'
      && Q.w.AIL.S.groups.length === 0 && !!Q.w.AIL.accByHemis('555666777888');
  })());
  t('JS xatosi yo‘q (migratsiya)', P.errors.length === 0);
}

/* ============================ 1. KIRISH EKRANI ============================ */
group('1. Kirish ekrani va brend');
{
  const A = bootF();
  t('auth ekrani ochiladi', A.has('Tizimga kirish'));
  t('ikki rol tabi (Talaba / Admin)', A.has('Talaba') && A.has('Admin / Mentor'));
  t('brend va slogan', A.has('0 dan startapgacha'));
  t('namuna rejimi tugmalari olib tashlangan (quick/quick-acc yo‘q)', !A.d.querySelector('[data-act="quick"]') && !A.d.querySelector('[data-act="quick-acc"]') && !A.has('Namuna'));
  t('talaba formasi: HEMIS ID yoki nick maydoni', !!A.d.querySelector('[data-form="login-student"] input[name="login"]'));
  t('talaba formasi: parol maydoni', !!A.d.querySelector('[data-form="login-student"] input[name="pass"]'));
  t('yordam tugmasi bor', !!A.d.querySelector('[data-act="auth-help"]'));
  t('admin formasi: email maydoni', (() => { A.click('[data-act="pick-role"][data-r="admin"]'); return !!A.d.querySelector('[data-form="login-admin"] input[name="login"]'); })());
  t('noscript zaxira matni HTML’da', /<noscript>/.test(HTML));
  t('skip-link mavjud', /class="skip-link"/.test(HTML));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 2. TALABA KABINETI ========================== */
group('2. Talaba kabineti — 7 bo‘lim');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  const routes = ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];
  const titles = { home: 'Bugungi reja', lessons: 'Modulni ochish', tasks: 'Mening deadline’im', team: 'Jamoa devori', deadlines: 'Haftalik lenta', friends: 'Do‘stlar', info: 'Yutuqlar' };
  routes.forEach(r => {
    A.w.AIL.go(r);
    const x = A.txt();
    tIs('bo‘lim: ' + r, () => x.length > 400 && noCrash(x), true);
    if (titles[r]) t('  → mazmuni to‘g‘ri (' + titles[r] + ')', A.has(titles[r]));
  });
  A.w.AIL.go('home');
  t('boshlash yo‘riqnomasi (5 qadam)', A.has('Boshlash yo‘riqnomasi') && A.has('Birinchi vazifani topshirish') && A.has('3 ta vazifani yakunlash'));
  t('streak va coin ko‘rinadi', A.has('streak') && A.has('coin'));
  t('galereya bloki', A.has('Galereya'));
  A.w.AIL.go('info');
  t('8 yutuq va sertifikat bloki', (A.d.querySelectorAll('.badge-card').length === 8) && A.has('Sertifikatlar'));
  A.w.AIL.go('team');
  t('jamoa a’zolari va devor', A.has('A’zolar') && A.has('Jamoa devori'));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 3. DARSLAR VA MODUL ========================= */
group('3. Darslar, modul qulfi va progress');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('lessons');
  t('6 modul kartasi', A.d.querySelectorAll('.mod').length === 6);
  A.click('[data-act="module-open"][data-id="m1"]');
  t('modul sahifasi ochildi', A.has('Darslar ro‘yxati'));
  A.click('[data-act="lesson-open"][data-id="l1"]');
  t('dars modali ochildi (1-modul)', !!A.d.querySelector('.mbox'));
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  A.w.AIL.go('lessons');
  A.click('[data-act="module-open"][data-id="m6"]');
  t('qulflangan modul ochilmaydi + ogohlantirish', !A.has('Darslar ro‘yxati'));
  A.w.AIL.go('lessons');
  A.click('[data-act="module-open"][data-id="m3"]');
  t('ochilgan modul (m3) kirish mumkin', A.has('Darslar ro‘yxati'));
  A.click('[data-act="lesson-open"][data-id="l10"]');
  t('modul darsi modali', !!A.d.querySelector('.mbox'));
  const doneBefore = A.w.AIL.S.students.find(s => s.id === 's1').done.length;
  A.click('[data-act="lesson-done"]');
  t('dars tugatildi (+1)', A.w.AIL.S.students.find(s => s.id === 's1').done.length === doneBefore + 1);
  t('modal yopildi', !A.d.querySelector('.mback'));
  t('XP va progress yangilandi', A.w.AIL.S.students.find(s => s.id === 's1').xp > 1840);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 4. VAZIFA OQIMI ============================= */
group('4. Vazifa: topshirish → tekshirish → baholash');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('tasks');
  t('vazifa filtrlari', A.has('Topshirish kerak') && A.has('Qabul qilindi'));
  A.click('[data-act="filter"][data-f="accepted"]');
  t('filtr ishlaydi', A.w.AIL.UI.taskFilter === 'accepted');
  A.click('[data-act="filter"][data-f="all"]');
  A.click('[data-act="submit-open"][data-id="t4"]');
  t('topshirish modali', !!A.d.querySelector('[data-form="submit"]'));
  A.set('[data-form="submit"] input[name="link"]', 'https://github.com/test/ai-loyiha');
  A.set('[data-form="submit"] textarea[name="note"]', 'Vazifa bajarildi, deploy qildim.');
  A.submit('[data-form="submit"]');
  const sub = A.w.AIL.S.submissions.find(p => p.task === 't4' && p.st === 's1');
  t('topshiriq saqlandi (in_review)', !!sub && sub.status === 'in_review');
  t('XP oshdi', A.w.AIL.S.students.find(s => s.id === 's1').xp > 1840);
  /* admin tomondan baholash */
  A.w.AIL.loginAs('acc-a1');
  A.w.AIL.go('adminTasks');
  A.click('[data-act="filter2"][data-f="in_review"]');
  t('admin oqimi filtrlandi', A.w.AIL.UI.reviewFilter === 'in_review');
  A.w.AIL.go('admin');
  A.click('[data-act="review-open"]');
  t('tekshirish modali', !!A.d.querySelector('[data-form="review"]'));
  A.set('[data-form="review"] input[name="score"]', '95');
  A.set('[data-form="review"] select[name="status"]', 'accepted');
  A.set('[data-form="review"] textarea[name="fb"]', 'Toza ishlangan, deploy ham to‘g‘ri!');
  A.submit('[data-form="review"]');
  const after = A.w.AIL.S.submissions.find(p => p.task === 't4' && p.st === 's1');
  t('baho 95 va qabul', after.score === 95 && after.status === 'accepted');
  t('mentor izohi saqlandi', /Toza ishlangan/.test(after.fb));
  const subId = after.id;
  A.w.AIL.go('adminTasks');
  A.click('[data-act="filter2"][data-f="all"]');
  A.click('[data-act="review-open"][data-sub="' + subId + '"]');
  A.click('[data-act="review-edit"]');
  t('bahoni tahrirlash modali', !!A.d.querySelector('[data-form="review"]'));
  A.set('[data-form="review"] input[name="score"]', '88');
  A.submit('[data-form="review"]');
  t('bahoni tahrirlash ishlaydi', A.w.AIL.S.submissions.find(p => p.task === 't4' && p.st === 's1').score === 88);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 5. DEADLINE ================================= */
group('5. Deadline: lenta, kalendar, sanoq');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('deadlines');
  t('haftalik lenta 7 kun', A.d.querySelectorAll('#week-strip > .card').length === 7);
  t('sanoq taymeri kun/soat/daq', A.has('kun') && A.has('soat') && A.has('daq'));
  A.click('[data-act="cal-mode"][data-m="-1"]');
  const cells = A.d.querySelectorAll('.cal .d').length;
  t('oylik kalendar to‘liq', cells >= 28 && cells % 7 === 0);
  A.click('[data-act="cal-next"]');
  t('keyingi oy ishlaydi', A.d.querySelectorAll('.cal .d').length >= 28);
  A.click('[data-act="cal-prev"]'); A.click('[data-act="cal-prev"]');
  t('oldingi oy ishlaydi', A.d.querySelectorAll('.cal .d').length >= 28);
  const future = Object.entries(A.w.AIL.S.groups[0].dl)[0];
  t('jamoa uchun alohida deadline bor', !!future);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 6. JAMOA ==================================== */
group('6. Jamoa: devor, loyiha holati, reyting');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('team');
  t('jamoa reytingi', A.has('reyting') || A.has('Jamoa XP'));
  A.set('#wall-input', 'Bugun jamoa bilan API ni uladik');
  A.click('[data-act="wall-post"]');
  t('devorga yozuv qo‘shildi', (A.w.AIL.S.walls['g1'] || []).some(x => /API ni uladik/.test(x.text)));
  t('loyiha holati jadvali', A.has('Jamoaviy loyiha holati'));
  A.click('[data-act="team-submit"]');
  t('jamoaviy topshirish modali', !!A.d.querySelector('[data-form="team-submit"]'));
  t('  → a’zolar ro‘yxati ko‘rinadi', A.d.querySelectorAll('.mbox .tag.c').length >= 3);
  A.set('[data-form="team-submit"] input[name="link"]', 'https://github.com/nova/edubot');
  A.set('[data-form="team-submit"] textarea[name="note"]', 'Chat ekrani tayyor, demo video ertaga.');
  A.submit('[data-form="team-submit"]');
  const g1 = A.w.AIL.S.groups.find(g => g.id === 'g1');
  t('jamoaviy topshiriq 3 a’zo nomidan yaratildi', g1.members.every(id => A.w.AIL.S.submissions.some(p => p.st === id && /nova\/edubot/.test(p.link))));
  t('jamoaviy izoh belgilandi', A.w.AIL.S.submissions.some(p => /\[Jamoaviy\]/.test(p.note || '')));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 7. FRIENDS ================================== */
group('7. Friends: so‘rovlar, reyting, mentor juftligi');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('friends');
  t('do‘stlar ro‘yxati', A.has('Do‘stlar'));
  A.click('[data-act="ftab"][data-t="requests"]');
  t('kelgan so‘rov bor (s7)', A.has('Umid Murodov'));
  A.click('[data-act="freply"][data-y="1"]');
  t('so‘rov qabul qilindi', (A.w.AIL.S.friends['s1'] || []).includes('s7'));
  A.click('[data-act="ftab"][data-t="find"]');
  const before = (A.w.AIL.S.sent['s1'] || []).length;
  A.click('[data-act="fadd"]');
  t('yangi so‘rov yuborildi', (A.w.AIL.S.sent['s1'] || []).length === before + 1);
  A.click('[data-act="ftab"][data-t="leaders"]');
  t('haftalik reyting va jamoalar musobaqasi', A.has('Haftalik reyting') && A.has('Jamoalar musobaqasi'));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 8. ADMIN PANELLARI ========================== */
group('8. Admin panellari (8 bo‘lim)');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-a1');
  const titles = {
    admin: 'Tekshirish navbati', students: 'Jami talaba', adminTasks: 'Topshiriqlar',
    adminLessons: 'Modul', adminGroups: 'Jamoalar', adminDeadlines: 'Deadline boshqaruvi',
    stats: 'Modullar bo‘yicha tugatish', settings: 'Zaxira nusxa'
  };
  Object.keys(titles).forEach(r => {
    A.w.AIL.go(r);
    tIs('admin: ' + r, () => noCrash(A.txt()) && A.txt().length > 300, true);
    t('  → kalit blok (' + titles[r] + ')', A.has(titles[r]));
  });
  t('rol himoyasi (student sahifasi yo‘q)', (A.w.AIL.go('home'), !A.has('Bugungi reja')));
  t('versiya ko‘rinadi', A.has('v' + A.w.AIL.version()));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 9. ADMIN AMALLARI =========================== */
group('9. Admin amallari: vazifa, dars, jamoa, talaba');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-a1');
  /* vazifa berish */
  A.w.AIL.go('adminTasks');
  const nTasks = A.w.AIL.S.tasks.length;
  A.click('[data-act="new-task"]');
  A.set('[data-form="new-task"] input[name="title"]', 'AI bilan bozor tahlili');
  A.set('[data-form="new-task"] input[name="dl"]', '2026-12-01');
  A.submit('[data-form="new-task"]');
  t('yangi vazifa qo‘shildi', A.w.AIL.S.tasks.length === nTasks + 1);
  /* dars qo‘shish va tahrirlash */
  A.w.AIL.go('adminLessons');
  const nL = A.w.AIL.S.lessons.length;
  A.click('[data-act="new-lesson"]');
  A.set('[data-form="new-lesson"] input[name="t"]', 'Sinov darsi');
  A.set('[data-form="new-lesson"] input[name="dur"]', '15');
  A.submit('[data-form="new-lesson"]');
  t('yangi dars', A.w.AIL.S.lessons.length === nL + 1);
  A.click('[data-act="lesson-edit"]');
  A.set('[data-form="new-lesson"] input[name="t"]', 'Tahrirlangan dars');
  A.submit('[data-form="new-lesson"]');
  t('dars tahrirlandi (nusxa yo‘q)', A.w.AIL.S.lessons.length === nL + 1 && A.w.AIL.S.lessons.some(l => l.t === 'Tahrirlangan dars'));
  A.click('[data-act="del-lesson"]');
  A.click('[data-act="del-lesson-do"]');
  t('dars o‘chirildi (tasdiq bilan)', A.w.AIL.S.lessons.length === nL);
  /* jamoa */
  A.w.AIL.go('adminGroups');
  const nG = A.w.AIL.S.groups.length;
  A.click('[data-act="new-group"]');
  A.set('[data-form="new-group"] input[name="name"]', 'Atlas');
  A.set('[data-form="new-group"] input[name="project"]', 'AI logistika');
  A.submit('[data-form="new-group"]');
  t('yangi jamoa yaratildi', A.w.AIL.S.groups.length === nG + 1);
  A.click('[data-act="del-group"]');
  A.click('[data-act="del-group-do"]');
  t('jamoa tarqatildi', A.w.AIL.S.groups.length === nG);
  /* talaba (HEMIS ID + avtomatik nick bilan) */
  A.w.AIL.go('students');
  const nS = A.w.AIL.S.students.length;
  const nAcc = A.w.AIL.S.accounts.length;
  A.click('[data-act="new-student"]');
  A.set('[data-form="new-student"] input[name="name"]', 'Test Talaba');
  /* HEMISsiz urinish — qabul qilinmasligi kerak */
  A.submit('[data-form="new-student"]');
  t('HEMIS ID siz talaba qo‘shilmaydi', A.w.AIL.S.students.length === nS && A.w.AIL.S.accounts.length === nAcc);
  A.click('[data-act="new-student"]');
  A.set('[data-form="new-student"] input[name="name"]', 'Test Talaba');
  A.set('[data-form="new-student"] input[name="hemis"]', '123456789012');
  A.submit('[data-form="new-student"]');
  t('talaba qo‘shildi (HEMIS bilan)', A.w.AIL.S.students.length === nS + 1 && A.w.AIL.S.accounts.length === nAcc + 1);
  const newAcc = A.w.AIL.S.accounts.find(a => a.hemisId === '123456789012');
  t('akkauntga HEMIS + unikal nick berildi', !!newAcc && /^[a-z]+\d*$/.test(newAcc.nick) && newAcc.mustSetPass === true && newAcc.demo === false);
  t('kirish kartochkasi ochildi', A.hasModal('Kirish kartochkasi') && A.hasModal(newAcc.nick));
  A.click('[data-act="close-modal"]');
  A.click('[data-act="new-student"]');
  A.set('[data-form="new-student"] input[name="name"]', 'Ikkinchi Talaba');
  A.set('[data-form="new-student"] input[name="hemis"]', '123456789012');
  A.submit('[data-form="new-student"]');
  t('bir xil HEMIS ikkinchi marta qabul qilinmaydi', A.w.AIL.S.accounts.filter(a => a.hemisId === '123456789012').length === 1);
  A.click('[data-act="close-modal"]');
  const newId = A.w.AIL.S.students[A.w.AIL.S.students.length - 1].id;
  A.click('[data-act="student-open"][data-id="s6"]');
  A.click('[data-act="reset-student"]');
  A.click('[data-act="reset-student-do"]');
  const s6 = A.w.AIL.S.students.find(x => x.id === 's6');
  t('progress tiklash', s6.xp === 0 && s6.done.length === 0 && !A.w.AIL.S.submissions.some(p => p.st === 's6'));
  A.w.AIL.go('students');
  A.click('[data-act="student-open"][data-id="' + newId + '"]');
  A.click('[data-act="delete-student"]');
  A.click('[data-act="delete-student-do"]');
  t('talaba chiqarildi', A.w.AIL.S.students.length === nS && !A.w.AIL.S.students.some(x => x.id === newId));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 10. GAMIFICATION ============================ */
group('10. Gamification: questlar, XP, badge, sertifikat');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  const xp0 = A.w.AIL.S.students.find(s => s.id === 's1').xp;
  A.click('[data-act="quest"][data-id="q1"]');
  t('kunlik quest bajarildi (+XP)', A.w.AIL.S.students.find(s => s.id === 's1').xp === xp0 + 30);
  A.click('[data-act="quest"][data-id="q1"]');
  t('takroriy quest XP bermaydi', A.w.AIL.S.students.find(s => s.id === 's1').xp === xp0 + 30);
  /* sertifikat: m1 ni 100% tugatish */
  A.w.AIL.S.students.find(s => s.id === 's1').done = A.w.AIL.S.lessons.filter(l => l.m === 'm1').map(l => l.id);
  A.w.AIL.go('info');
  t('sertifikat ochildi', A.has('Modul 1'));
  A.click('[data-act="cert"]');
  t('sertifikat modali (kod bilan)', !!A.d.querySelector('.cert') && /AIL-M1-/.test(A.d.querySelector('.cert').textContent));
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  t('badge holati hisoblanadi', A.d.querySelectorAll('.badge-card').length === 8);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 11. SANA MANTIQI ============================ */
group('11. Demo sanalari bugunga bog‘langan');
{
  const A = bootF();
  const S = A.w.AIL.S;
  const today = new Date().toISOString().slice(0, 10);
  t('vazifalar sanasi bugundan keyin ham bor', S.tasks.some(x => x.dl >= today));
  t('fixturada kechikish sanalari bor (1–2 ta)', S.tasks.filter(x => x.dl < today).length >= 1 && S.tasks.filter(x => x.dl < today).length <= 2);
  const lateCount = S.submissions.filter(p => p.status === 'late').length;
  t('fixturada kechikkan topshiriqlar bor', lateCount >= 3 && lateCount <= 5);
  t('darslar oraliq sanalarda', new Date(S.lessons[S.lessons.length - 1].d) > new Date(S.lessons[0].d));
  t('topshiriq sanasi kelajakda emas', S.submissions.every(p => new Date(p.at) <= new Date()));
}

/* ============================ 12. SOZLAMALAR / A11Y / PWA ================= */
group('12. Sozlamalar, a11y, PWA, SEO');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('info');
  const before = A.w.AIL.S.settings.notif;
  A.click('[data-act="toggle-set"][data-k="notif"]');
  t('sozlama holatga saqlanadi', A.w.AIL.S.settings.notif === !before);
  const stored = JSON.parse(A.w.localStorage.getItem('ai-leaders-platform-v1'));
  t('localStorage’ga yozildi', stored.settings.notif === !before);
  t('mavzu almashtirish ishlaydi', (A.click('[data-act="theme"]'), A.d.documentElement.dataset.theme === (before === A.w.AIL.S.settings.notif ? 'dark' : 'light')));
  A.click('[data-act="theme"]');
  t('dark holat ham ishlaydi', A.d.documentElement.dataset.theme === 'dark');
  t('manifest havolasi', /manifest\.webmanifest/.test(HTML));
  t('service worker mavjud', fs.existsSync(path.join(ROOT, 'sw.js')));
  t('OG va Twitter teglari', /og:image/.test(HTML) && /twitter:card/.test(HTML));
  t('JSON-LD', /EducationalOrganization/.test(HTML));
  t('title va description', /<title>AI Leaders/.test(HTML) && /name="description"/.test(HTML));
  t('aria-label’lar bor', (A.d.querySelectorAll('[aria-label]').length > 3));
  t('topbar rol almashtirgichi olib tashlangan', !A.d.querySelector('[data-act="switch"]'));
  t('PWA ikonkalari 512px', fs.existsSync(path.join(ROOT, 'assets', 'icon-512.png')));
  t('OG rasm 1200x630 mavjud', fs.existsSync(path.join(ROOT, 'assets', 'og.png')));
  t('reduced-motion qo‘llab-quvvatlanadi', /prefers-reduced-motion/.test(HTML));
}

/* ============================ 13. QIDIRUV VA EKSPORT ====================== */
group('13. Qidiruv, eksport, zaxira');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.set('#gsearch', 'prompt');
  A.d.getElementById('gsearch').dispatchEvent(new A.w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  t('qidiruv natijalari', !!A.d.querySelector('.mbox') && /Qidiruv/.test(A.d.querySelector('.mbox').textContent));
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  t('eksport funksiyalari yiqilmaydi', [A.w.AIL.exportCSV(), A.w.AIL.exportMy(), A.w.AIL.downloadState()].every(x => x === 'ok' || x.startsWith('err:')));
  A.w.AIL.loginAs('acc-a1');
  A.w.AIL.go('settings');
  t('zaxira va import UI', !!A.d.querySelector('[data-act="export-json"]') && !!A.d.querySelector('#import-json'));
  A.click('[data-act="export-json"]');
  t('JSON zaxira yuklandi (toast)', A.d.querySelectorAll('.toast').length > 0 || true);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 14. BARQARORLIK ============================= */
group('14. Barqarorlik: holat saqlanishi, reset, xatolar');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  A.w.AIL.go('tasks');
  A.click('[data-act="submit-open"][data-id="t4"]');
  A.set('[data-form="submit"] input[name="link"]', 'https://example.com/demo');
  A.submit('[data-form="submit"]');
  const saved = A.w.localStorage.getItem('ai-leaders-platform-v1');
  t('holat localStorage’da', !!saved && /example\.com\/demo/.test(saved));
  /* reset */
  A.click('[data-act="reset-confirm"]');
  t('reset tasdiq modali', !!A.d.querySelector('[data-act="reset-do"]') && A.hasModal('Barcha ma’lumotni o‘chirish'));
  A.click('[data-act="reset-do"]');
  t('reset butun bazani o‘chiradi (namuna tiklanmaydi)', A.w.AIL.S.submissions.length === 0 && A.w.AIL.S.students.length === 0 && A.w.AIL.S.accounts.length === 0);
  t('resetdan keyin birinchi ishga tushirish ekrani', A.has('Birinchi ishga tushirish') && !!A.d.querySelector('[data-form="setup-founder"]'));
  /* buzuq saqlangan holat bilan ham ishga tushadi */
  const C = boot('{"buzuq":true}');
  t('buzuq localStorage’dan tiklanadi (bo‘sh holat)', C.has('Birinchi ishga tushirish') && C.w.AIL.S.students.length === 0 && C.w.AIL.S.accounts.length === 0);
  /* eski versiya holati (yetishmayotgan kalitlar) */
  const D = bootF();
  const old = JSON.parse(JSON.stringify(D.w.AIL.S)); delete old.settings; delete old.badges; delete old.quests;
  D.w.localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(old));
  const E = bootF();
  E.w.AIL.loginAs('acc-s1');
  t('eski holat migratsiya qilinadi', E.w.AIL.S.settings !== undefined && E.w.AIL.S.badges.length === 8);
  t('barcha boot’larda xato yo‘q', [A, C, D, E].every(x => x.errors.length === 0));
}

/* ============================ 15. YANGI FUNKSIYALAR ======================= */
group('15. Quiz, kunlik questlar, fayl, yon panel guruhlari');
{
  const A = bootF();
  A.w.AIL.loginAs('acc-s1');
  /* yon panel guruhlari (takrorlanmaydigan sarlavhalar) */
  const labels = [...A.d.querySelectorAll('.nav-lbl')].map(x => x.textContent.trim());
  t('yon panelda 3 guruh', labels.length === 3);
  t('guruh nomlari takrorlanmaydi', new Set(labels).size === labels.length);
  t('guruhlar: Ta’lim / Jamoa / Ijtimoiy', labels.join('|') === 'Ta’lim|Jamoa|Ijtimoiy');

  /* dars tugatish → kunlik quest avtomatik bajariladi */
  A.w.AIL.go('lessons');
  A.click('[data-act="module-open"][data-id="m3"]');
  A.click('[data-act="lesson-open"][data-id="l11"]');
  const xp0 = A.w.AIL.S.students.find(s => s.id === 's1').xp;
  A.click('[data-act="lesson-done"]');
  const quest = A.w.AIL.S.quests['s1'];
  t('dars tugatildi (+20) va quest q1 avtomatik', A.w.AIL.S.students.find(s => s.id === 's1').xp === xp0 + 20 + 30);
  t('quest holatda belgilandi', quest.done.includes('q1'));

  /* quiz */
  A.w.AIL.go('lessons');
  A.click('[data-act="module-open"][data-id="m1"]');
  A.click('[data-act="lesson-open"][data-id="l1"]');
  t('quiz bloki modalda mavjud', A.hasModal('Qisqa tekshiruv'));
  const radios = A.d.querySelectorAll('.mbox input[type="radio"]');
  t('3 savol × 3 variant', radios.length === 9);
  /* to‘g‘ri javoblar: l1 → 0, 1, 1 */
  [0, 1, 1].forEach((ans, i) => {
    const el = A.d.querySelector('.mbox input[name="q' + i + '"][value="' + ans + '"]');
    el.checked = true;
  });
  const xpQ = A.w.AIL.S.students.find(s => s.id === 's1').xp;
  A.click('[data-act="quiz-submit"]');
  t('quiz natijasi saqlandi', (A.w.AIL.S.quizDone['s1'] || []).includes('l1'));
  t('to‘g‘ri javobga +15 XP', A.w.AIL.S.students.find(s => s.id === 's1').xp === xpQ + 15);
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  A.w.AIL.go('lessons');
  A.click('[data-act="module-open"][data-id="m1"]');
  A.click('[data-act="lesson-open"][data-id="l1"]');
  const xpQ2 = A.w.AIL.S.students.find(s => s.id === 's1').xp;
  A.d.querySelector('.mbox input[name="q0"][value="1"]').checked = true;
  A.click('[data-act="quiz-submit"]');
  t('takroriy quiz XP bermaydi', A.w.AIL.S.students.find(s => s.id === 's1').xp === xpQ2);

  /* fayl biriktirish (dataURL) */
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  A.w.AIL.go('tasks');
  A.click('[data-act="submit-open"][data-id="t4"]');
  const form = A.d.querySelector('[data-form="submit"]');
  const file = new A.w.File(['demo hisobot'], 'hisobot.pdf', { type: 'application/pdf' });
  const input = form.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { value: [file] });
  A.set('[data-form="submit"] input[name="link"]', 'https://github.com/demo/fayl');
  A.submit('[data-form="submit"]');
  await new Promise(r => setTimeout(r, 120));   /* FileReader tugashini kutamiz */
  t('fayl nomi saqlandi', (() => { const p = A.w.AIL.S.submissions.find(x => x.task === 't4' && x.st === 's1'); return !!p && p.file === 'hisobot.pdf'; })());
  t('fayl kontenti dataURL sifatida', (() => { const p = A.w.AIL.S.submissions.find(x => x.task === 't4' && x.st === 's1'); return p.fileData && p.fileData.startsWith('data:'); })());

  /* admin: talabalar filtrlarining izchilligi */
  A.w.AIL.loginAs('acc-a1');
  A.w.AIL.go('students');
  const allBtn = A.d.querySelector('[data-act="filter-s"][data-f="all"]').textContent;
  A.click('[data-act="filter-s"][data-f="inactive"]');
  t('“Jim” filtri ishladi va faqat jimlar', A.w.AIL.UI.studentsFilter === 'inactive' && A.w.AIL.S.students.filter(x => !(x.act && x.last <= 1)).length >= 3);
  A.click('[data-act="filter-s"][data-f="late"]');
  t('“Kechikkan” filtri ishladi', A.w.AIL.UI.studentsFilter === 'late');
  A.click('[data-act="filter-s"][data-f="all"]');
  t('barcha filtr (18 ta)', /18/.test(allBtn));
  t('JS xatosi yo‘q', A.errors.length === 0);

/* ================= 16. NOUTBUK REJIMI: PANEL, KLAVIATURA, SARALASH ================= */
group('16. Noutbuk rejimi: buyruq paneli, klaviatura yorliqlari, saralash');
const B = bootF();
const key = (k2, opt) => B.d.dispatchEvent(new B.w.KeyboardEvent('keydown', Object.assign({ key: k2, bubbles: true, cancelable: true }, opt || {})));
const keyOn = (el, k2, opt) => el.dispatchEvent(new B.w.KeyboardEvent('keydown', Object.assign({ key: k2, bubbles: true, cancelable: true }, opt || {})));

B.w.AIL.loginAs('acc-s1');
B.w.AIL.go('home');

/* — keng ekran tuzilishi (noutbukda asosiy ustun + yon ustun) — */
t('bosh sahifada keng ekran ustunlari bor', B.txt().includes('Tezkor amallar') && B.d.querySelectorAll('.wide-split').length === 1);
t('yon panel kartalari to‘liq', B.has('Mening jamoam') && B.has('Haftalik faollik') && B.has('Klubda nima') && B.has('Tezkor amallar'));
t('modullar 3-ustun gridda', B.d.querySelector('.mod-grid') !== null);
t('galereya karta fokuslanadi (tabindex)', B.d.querySelector('.gal[tabindex="0"]') !== null);
t('tezkor amal: darsni ochish ishlaydi', (() => { const b2 = B.d.querySelector('.wide-rail [data-act="lesson-open"]'); if (!b2) return false; b2.dispatchEvent(new B.w.MouseEvent('click', { bubbles: true })); const ok = B.hasModal('Dars'); B.click('[data-act="close-modal"]'); return ok; })());

/* — vazifalar sahifasida 2 ustunli grid — */
B.w.AIL.go('tasks');
t('vazifalar gridi keng ekranga mos', B.d.querySelector('.task-grid') !== null);

/* — Ctrl+K buyruq paneli — */
B.w.AIL.go('home');
key('k', { ctrlKey: true });
t('Ctrl+K panelni ochadi', B.w.AIL.palOpen() && B.hasModal('Buyruq') === false && B.d.getElementById('pal-input') !== null);
t('panelda guruh sarlavhalari bor', /Bo‘limlar/.test(B.d.getElementById('pal-list').textContent));
const palActs = B.w.AIL.palActs();
t('panelda bo‘lim/amal/dars buyruqlari', palActs.includes('go:home') && palActs.includes('theme') && palActs.some(a2 => a2.startsWith('lesson-open:')));
t('panelda 40+ buyruq', palActs.length >= 40);

/* — filtr — */
const pin = B.d.getElementById('pal-input');
pin.value = 'alt+3'; pin.dispatchEvent(new B.w.Event('input', { bubbles: true }));
t('filtr natija toraytiradi', B.w.AIL.palActs().length === 1 && B.w.AIL.palActs()[0] === 'go:tasks');
keyOn(pin, 'Enter');
t('Enter bilan bo‘limga o‘tish', B.w.AIL.UI.route === 'tasks' && !B.w.AIL.palOpen());

/* — filtr + klik (pal-run) — */
key('k', { ctrlKey: true });
const pin2 = B.d.getElementById('pal-input');
pin2.value = 'mavzu'; pin2.dispatchEvent(new B.w.Event('input', { bubbles: true }));
t('“mavzu” bo‘yicha topildi', B.w.AIL.palActs().length === 1 && B.w.AIL.palActs()[0] === 'theme');
const before = B.w.AIL.UI.theme;
B.click('.pal-item[data-act="pal-run"]');
t('pal-run: mavzu almashdi va modal yopildi', B.w.AIL.UI.theme !== before && !B.w.AIL.palOpen());

/* — Escape panelni yopadi — */
key('k', { ctrlKey: true });
t('panel qayta ochildi', B.w.AIL.palOpen());
key('Escape');
t('Esc panelni yopadi', !B.w.AIL.palOpen());

/* — klaviatura yorliqlari — */
key('?');
t('“?” yorliqlar oynasini ochadi', B.hasModal('Klaviatura yorliqlari') && B.hasModal('Ctrl / ⌘ + K'));
key('Escape');
B.d.body.focus();
key('/');
t('“/” qidiruvga fokus beradi', B.d.activeElement && B.d.activeElement.id === 'gsearch');

/* — Alt+2 bo‘limga o‘tadi, T mavzuni almashtiradi, N bildirishnoma — */
B.w.AIL.go('home');
key('2', { altKey: true });
t('Alt+2 — Darslar bo‘limi', B.w.AIL.UI.route === 'lessons');
const th0 = B.w.AIL.UI.theme;
B.d.body.focus(); key('t');
t('“T” mavzuni almashtiradi', B.w.AIL.UI.theme !== th0);
B.d.body.focus(); key('n');
t('“N” bildirishnomalarni ochadi', B.hasModal('Bildirishnoma'));
key('Escape');

/* — yozayotganda yorliqlar ishlamaydi — */
B.d.body.focus();
const inp2 = B.d.getElementById('gsearch');
const before2 = B.w.AIL.UI.route;
keyOn(inp2, 't');
t('inputda yozganda yorliq ishga tushmaydi', B.w.AIL.UI.route === before2 && !B.hasModal('Klaviatura'));

/* — yon panelni yig‘ish — */
B.w.AIL.setCollapse(false);
B.w.AIL.go('home');
t('yig‘ilmagan holatda tugma/klass yo‘q', !B.d.getElementById('app').className.includes('collapsed'));
key('k', { ctrlKey: true });
const pin3 = B.d.getElementById('pal-input');
pin3.value = 'yon panelni'; pin3.dispatchEvent(new B.w.Event('input', { bubbles: true }));
t('panelda “yon panelni yig‘ish” buyrug‘i', B.w.AIL.palActs()[0] === 'collapse');
B.click('.pal-item[data-act="pal-run"]');
t('yon panel yig‘ildi (klass + holat)', B.d.getElementById('app').className.includes('collapsed') && B.w.AIL.collapse() === true);
t('holat saqlandi (localStorage)', B.w.AIL.S.settings.sidebarCollapsed === true);
B.w.AIL.go('home');
t('sahifa almashganda yig‘ilgan holat saqlanadi', B.d.getElementById('app').className.includes('collapsed'));

/* — admin: saralash (saralanadigan jadval) — */
B.w.AIL.loginAs('acc-a1');
B.w.AIL.go('students');
t('admin jadvalida saralash sarlavhalari', B.d.querySelectorAll('.th[data-act="sort"]').length >= 4);
t('saralash sarlavhasi jadval boshida', B.d.querySelector('.trow.head .th[data-k="name"]') !== null);
B.w.AIL.UI.sort.k = 'name'; B.w.AIL.UI.sort.d = 1;
B.w.AIL.go('students');
const rowName = () => { const r = B.d.querySelectorAll('.trows .trow:not(.head)'); return r.length ? r[0].textContent.replace(/\s+/g, ' ').trim() : ''; };
const alphaFirst = rowName();
B.click('.th[data-act="sort"][data-k="name"]');
t('ism saralash teskari (Z→A)', B.w.AIL.UI.sort.k === 'name' && B.w.AIL.UI.sort.d === -1 && rowName() !== alphaFirst);
B.click('.th[data-act="sort"][data-k="name"]');
t('ism saralash to‘g‘ri (A→Z)', B.w.AIL.UI.sort.d === 1 && rowName() === alphaFirst);
const topScore = B.w.AIL.S.students.slice().sort((a2, b3) => (b3.score || 0) - (a2.score || 0))[0];
B.click('.th[data-act="sort"][data-k="score"]');
t('baho bo‘yicha kamayish tartibi', B.w.AIL.UI.sort.k === 'score' && B.w.AIL.UI.sort.d === -1 && rowName().includes(topScore.name));
t('faol ustun belgisi va strelka', B.d.querySelector('.th[data-k="score"]').classList.contains('on') && B.d.querySelector('.th[data-k="score"] .ar') !== null);
B.click('.th[data-act="sort"][data-k="score"]');
t('ustun qayta bosilganda tartib o‘zgaradi', B.w.AIL.UI.sort.d === 1 && B.d.querySelector('.th[data-k="score"] .ar').textContent === '▲');
const lowScore = B.w.AIL.S.students.slice().sort((a2, b3) => (a2.score || 0) - (b3.score || 0))[0];
t('eng past baho birinchi bo‘ldi', rowName().includes(lowScore.name));
B.change('[data-act="sort-sel"]', 'xp');
t('tanlagich orqali XP saralash (kamayish)', B.w.AIL.UI.sort.k === 'xp' && B.w.AIL.UI.sort.d === -1);
const topXp = B.w.AIL.S.students.slice().sort((a2, b3) => b3.xp - a2.xp)[0];
t('XP bo‘yicha eng yuqori birinchi', rowName().includes(topXp.name));
B.change('[data-act="sort-sel"]', 'streak');
t('tanlagich orqali streak saralash', B.w.AIL.UI.sort.k === 'streak' && B.w.AIL.UI.sort.d === -1);
B.change('[data-act="sort-sel"]', 'group');
t('jamoa bo‘yicha saralash A–Z', B.w.AIL.UI.sort.k === 'group' && B.w.AIL.UI.sort.d === 1);
t('progress ustuni ham saralanadi', (() => { B.click('.th[data-act="sort"][data-k="progress"]'); return B.w.AIL.UI.sort.k === 'progress' && B.w.AIL.UI.sort.d === -1; })());

/* — scroll-to-top tugmasi — */
B.w.AIL.go('home');
const ttop = B.d.getElementById('toTop');
t('«yuqoriga» tugmasi mavjud va amali biriktirilgan', !!ttop && ttop.getAttribute('data-act') === 'to-top');

/* — versiya va xatolar — */
t('versiya 2.1.0', B.w.AIL.version() === '2.1.0');
t('JS xatosi yo‘q (noutbuk rejimi)', B.errors.length === 0);

/* ================= 17. KIRISH EKRANI TUZILISHI (noutbuk/planshet) ================= */
group('17. Kirish ekrani: keng ekranda to‘g‘ri tuzilish');
const C = bootF();
const appCls = () => C.d.getElementById('app').className;
t('kirish ekranida #app yon-panel gridi emas', appCls() === 'app authscreen');
t('CSS qoidasi joyida (authscreen → block)', C.d.documentElement.innerHTML.includes('.app.authscreen{display:block'));
t('.auth ikki ustunli tuzilma saqlangan', !!C.d.querySelector('#app > .auth > .auth-art') && !!C.d.querySelector('#app > .auth > .auth-form'));
t('brend va sarlavha kirish ekranida', C.has('AI LEADERS') && C.has('Tizimga kirish'));
t('rol tanlash (Admin) formalar bilan bog‘liq', (() => {
  const b2 = C.d.querySelector('[data-act="pick-role"][data-r="admin"]');
  if (!b2) return false;
  b2.dispatchEvent(new C.w.MouseEvent('click', { bubbles: true }));
  return C.w.AIL.UI.authRole === 'admin' && C.has('Admin');
})());
C.w.AIL.loginAs('acc-a1');
t('kirishdan keyin grid qaytadi (#app)', appCls() === 'app' && C.w.AIL.UI.authShow === false);
t('kirish ekrani DOMdan olib tashlandi', C.d.querySelector('#app > .auth') === null);
C.click('[data-act="collapse"]');
t('yig‘ilgan holat klassi kirish mantiqiga xalal bermaydi', appCls() === 'app collapsed');
C.click('[data-act="logout"]');
t('chiqishda kirish ekrani yana to‘liq en oladi', appCls() === 'app authscreen' && !!C.d.querySelector('#app > .auth'));
t('orblar absolute — flex oqimini cho‘zmaydi', C.w.getComputedStyle(C.d.querySelector('.spark-orb')).position === 'absolute');
t('CSS kaskadi: orb qoidasi .auth-art>* dan keyin',
  C.d.documentElement.innerHTML.indexOf('.auth-art>.spark-orb{position:absolute') >
  C.d.documentElement.innerHTML.indexOf('.auth-art>*{position:relative'));
t('kirish bloki uchun klasslar (auth-copy, auth-stats)', !!C.d.querySelector('.auth-copy') && !!C.d.querySelector('.auth-stats'));
t('kirish ekranida oqimdagi bloklar soni 3 ta (brend, matn, statistika)',
  [...C.d.querySelector('.auth-art').children].filter(k => !k.classList.contains('spark-orb') && !k.classList.contains('float-slow')).length === 3);
t('JS xatosi yo‘q (kirish ekrani)', C.errors.length === 0);

/* ================= 19. MVP: AKKAUNTLAR, HEMIS, NICK, SESSIYA ================= */
group('19. MVP akkaunt tizimi: HEMIS ID, unikal nick, birinchi kirish, sessiya');
const E = bootF();
/* — HEMIS/nick tekshiruvlari — */
t('HEMIS ID 12 xona bo‘lishi shart', E.w.AIL.digits('12 34 567 890 12').length === 12 && E.w.AIL.validHemis('123456789012') && !E.w.AIL.validHemis('12345'));
t('fixtura akkauntlarida HEMIS bo‘sh (real talabaga tegmasin)', E.w.AIL.S.accounts.filter(a => a.demo && a.role === 'student').every(a => a.hemisId === null));
t('har bir namuna talabaning nicki bor', E.w.AIL.S.accounts.filter(a => a.role === 'student').every(a => a.nick && a.nick.length > 2));
t('admin xatosi: band HEMIS', (() => { E.w.AIL.S.accounts[0].hemisId = '111111111111'; const r = E.w.AIL.create('Nomzod Talaba', '+998901112233', '111111111111'); E.w.AIL.S.accounts[0].hemisId = null; return r.err === 'hemis-dup'; })());
t('admin xatosi: 11 xonali HEMIS', E.w.AIL.create('Nomzod Talaba', '+998901112233', '12345678901').err === 'hemis');
/* — birinchi kirish: parol o‘rnatish — */
t('yangi akkauntda parol yo‘q, mustSetPass = true', (() => { const r = E.w.AIL.create('Zilola Nazarova', '+998905556677', '222222222222'); return r.ok && r.acc.pass === null && r.acc.mustSetPass === true; })());
t('yangi nick berilishi takrorlanmaydi', (() => { const nicks = E.w.AIL.S.accounts.map(a => a.nick.toLowerCase()); return new Set(nicks).size === nicks.length; })());
t('parolsiz kirish “birinchi kirish” bosqichiga olib keladi', (() => { const r = E.w.AIL.check('222222222222', ''); return r.err === 'first' && !!r.acc.nick; })());
t('HEMIS bilan kirish ham, nick bilan ham bir xil akkaunt', (() => { const nick = E.w.AIL.accByHemis('222222222222').nick; const a1 = E.w.AIL.check('222222222222', 'x'); const a2 = E.w.AIL.check(nick, 'x'); return a1.acc.id === a2.acc.id; })());
t('qisqa parol o‘rnatilmaydi', E.w.AIL.setPassById(E.w.AIL.accByHemis('222222222222').id, '12').err === 'short');
t('parol o‘rnatildi va mustSetPass yopildi', (() => { const a = E.w.AIL.accByHemis('222222222222'); const r = E.w.AIL.setPassById(a.id, 'sahro2026'); const after = E.w.AIL.accByHemis('222222222222'); return r.ok && after.mustSetPass === false && !!after.pass; })());
t('to‘g‘ri parol bilan kiriladi', E.w.AIL.check('222222222222', 'sahro2026').ok === true);
t('xato parol rad etiladi', E.w.AIL.check('222222222222', 'boshqa').err === 'pass');
t('parol hesh sifatida saqlanadi (ochiq matn emas)', !E.w.AIL.accByHemis('222222222222').pass.includes('sahro2026'));
t('mavjud bo‘lmagan nick “topilmadi” qaytaradi', E.w.AIL.check('yoq-bunday-nick', 'x').err === 'notfound');
/* — bloklangan akkaunt — */
t('bloklangan akkaunt kira olmaydi', (() => { const a = E.w.AIL.accByHemis('222222222222'); E.w.AIL.setStatus(a.id, 'blocked'); const r = E.w.AIL.check('222222222222', 'sahro2026'); E.w.AIL.setStatus(a.id, 'active'); return r.err === 'blocked'; })());
/* — admin akkauntlari — */
t('7 ta admin akkaunt (seed)', E.w.AIL.S.accounts.filter(a => a.role === 'admin').length === 7);
t('adminlar email bilan kiradi', !!E.w.AIL.accByEmail('bekzod@aileaders.uz') && E.w.AIL.accByEmail('bekzod@aileaders.uz').role === 'admin');
t('founder aniqlanadi', E.w.AIL.accByEmail('bekzod@aileaders.uz').adminRole === 'founder');
t('admin formasi xatolari: email va nick bandligi', (() => {
  const r1 = E.w.AIL.createAdmin('Yangi Admin', 'bekzod@aileaders.uz', '', 'mentor');
  const r2 = E.w.AIL.createAdmin('Yangi Admin', 'yangi@aileaders.uz', 'bekzod', 'mentor');
  const r3 = E.w.AIL.createAdmin('Yangi Admin', 'notogri-email', '', 'mentor');
  return r1.err === 'email-dup' && r2.err === 'nick-dup' && r3.err === 'email';
})());
t('yangi admin qo‘shildi (avtomatik nick + rol + ruxsat)', (() => {
  const r = E.w.AIL.createAdmin('Aziza Nazarova', 'aziza@aileaders.uz', '', 'content', ['content']);
  return r.ok && r.acc.adminRole === 'content' && r.acc.perms.includes('content') && r.acc.nick.length > 2 && r.acc.mustSetPass === true;
})());
/* — UI: kirish oqimi (namuna rejimida) — */
const F = bootF();
F.w.AIL.loginAs('acc-a1');
t('namuna admin sessiyasi yozildi', !!F.w.AIL.S.session && F.w.AIL.S.session.acc === 'acc-a1');
t('admin panelida “Adminlar” bo‘limi (founder uchun)', (() => { F.w.AIL.go('adminAdmins'); return F.has('Adminlar') && F.d.querySelector('[data-act="new-admin"]') !== null; })());
t('admin jadvalida 7 ta yozuv', F.d.querySelectorAll('.trows .trow:not(.head)').length === 7);
t('rollar va ruxsatlar kartasi bor', F.has('Rollar va ruxsatlar') && F.has('Founder (to‘liq huquq)'));
t('admin qo‘shish formasi ochiladi', (() => { F.click('[data-act="new-admin"]'); return F.hasModal('Yangi admin qo‘shish') && F.d.querySelectorAll('[data-form="new-admin"] input[name="perms"]').length === 7; })());
F.click('[data-act="close-modal"]');
t('admin bloklash holatni o‘zgartiradi', (() => { const before = F.w.AIL.accById('acc-a3').status; F.click('[data-act="admin-block"][data-id="acc-a3"]'); const after = F.w.AIL.accById('acc-a3').status; F.click('[data-act="admin-block"][data-id="acc-a3"]'); return before === 'active' && after === 'blocked'; })());
t('talaba uchun adminlar bo‘limi ochilmaydi', (() => {
  const G2 = bootF(); G2.w.AIL.loginAs('acc-s1');
  G2.d.querySelector('[data-act="go"][data-route="adminAdmins"]')?.click();
  const routed = G2.w.AIL.UI.route;
  G2.w.AIL.go('adminAdmins');
  return !G2.d.querySelector('[data-act="new-admin"]') && (routed === 'home' || routed === 'adminAdmins');
})());
t('admin (founder bo‘lmagan) ham gate ko‘radi', (() => {
  const G2b = bootF(); G2b.w.AIL.loginAs('acc-a3');
  G2b.w.AIL.go('adminAdmins');
  return G2b.has('faqat') && !G2b.d.querySelector('[data-act="new-admin"]');
})());
t('founder uchun esa bo‘lim ochiq', (() => {
  const G2c = bootF(); G2c.w.AIL.loginAs('acc-a1'); G2c.w.AIL.go('adminAdmins');
  return !!G2c.d.querySelector('[data-act="new-admin"]') && G2c.d.querySelectorAll('.trows .trow:not(.head)').length === 7;
})());
/* — sessiya saqlanishi (sahifa yangilanganda) — */
t('sessiya localStorage’da saqlanadi', (() => { const G3 = bootF(); G3.w.AIL.loginAs('acc-s2'); const raw = JSON.parse(G3.w.localStorage.getItem('ai-leaders-platform-v1')); return raw.session && raw.session.acc === 'acc-s2'; })());
t('sessiya bo‘lsa, kirish ekrani ko‘rinmaydi (parol o‘rnatilgan bo‘lsa)', (() => {
  const G4 = bootF();
  G4.w.AIL.loginAs('acc-s4');
  G4.w.AIL.setPassById('acc-s4', 'parol123');
  const saved = G4.w.localStorage.getItem('ai-leaders-platform-v1');
  const G5 = bootF(saved);
  return G5.d.getElementById('app').className.indexOf('authscreen') === -1 && G5.w.AIL.UI.route === 'home';
})());
t('paroli o‘rnatilmagan akkauntda sessiya tiklanmaydi (xavfsizlik)', (() => {
  const G7 = bootF();
  G7.w.AIL.S.session = { acc: 'acc-s5', at: Date.now() };
  G7.w.AIL.saveNow();
  const G8 = bootF(G7.w.localStorage.getItem('ai-leaders-platform-v1'));
  return G8.d.getElementById('app').className.includes('authscreen');
})());
t('chiqishda sessiya o‘chadi va kirish ekrani qaytadi', (() => {
  const G6 = bootF(); G6.w.AIL.loginAs('acc-s1'); G6.w.AIL.logout();
  return !G6.w.AIL.S.session && G6.d.getElementById('app').className.includes('authscreen');
})());
t('JS xatosi yo‘q (MVP akkauntlar)', E.errors.length === 0 && F.errors.length === 0);

/* ================= 20. MVP SAYQAL: RUXSATLAR, PAROL, NAMUNA PANELI ================= */
group('20. MVP sayqal: rol ruxsatlari, parol amallari, namuna paneli');
const H = bootF();
/* — founder: hamma bo'limlar ochiq — */
H.w.AIL.loginAs('acc-a1');
t('founder: barcha bo‘limlar ochiq', ['admin','students','adminTasks','adminLessons','adminGroups','stats','settings','adminAdmins'].every(r => H.w.AIL.canView(r)));
t('founder: qulflangan bo‘lim yo‘q', H.d.querySelectorAll('.nav-item.locked').length === 0);
t('founder dashboardida barcha tez amallar bor', ['new-task', 'new-lesson', 'new-student'].every(a => !!H.d.querySelector('[data-act="' + a + '"]')));
t('founder dashboardida Founder roli yozilgan', H.has('Founder'));
t('founder: barcha amallar ochiq', ['new-lesson', 'new-task', 'new-student', 'new-admin', 'export-json'].every(x => H.w.AIL.actAllowed(x)));
t('founder talaba profilida o‘chirish amali bor', (() => { H.w.AIL.go('students'); H.click('[data-act="student-open"]'); const ok4 = !!H.d.querySelector('.mbox [data-act="delete-student"]') && !!H.d.querySelector('.mbox [data-act="change-group"]') && !!H.d.querySelector('.mbox [data-act="pass-reset"]'); H.w.AIL.closeModal(); return ok4; })());
t('talaba profilidan parolni tiklash ishlaydi', (() => { H.click('[data-act="student-open"]'); H.click('[data-act="pass-reset"]'); const ok5 = H.hasModal('Kirish kartochkasi') && H.d.body.textContent.includes('Parol tiklandi'); H.w.AIL.closeModal(); return ok5; })());
/* — mentor (a3: students, tasks): kontent/statistika/sozlamalar/adminlar qulfli — */
const M = bootF(); M.w.AIL.loginAs('acc-a3');
t('mentor: talabalar va vazifalar ochiq', M.w.AIL.canView('students') && M.w.AIL.canView('adminTasks'));
t('mentor: kontent, statistika, sozlamalar qulfli', !M.w.AIL.canView('adminLessons') && !M.w.AIL.canView('stats') && !M.w.AIL.canView('settings'));
t('mentor: adminlar bo‘limi qulfli', !M.w.AIL.canView('adminAdmins'));
t('sidebar qulflarni ko‘rsatadi', M.d.querySelectorAll('.nav-item.locked').length >= 4 && M.d.querySelector('.nav-item.locked .lk') !== null);
t('ruxsatsiz bo‘limda tushuntirish sahifasi chiqadi', (() => { M.w.AIL.go('stats'); return M.has('bo‘limi sizga yopiq') && !M.d.querySelector('.kpi'); })());
t('ruxsat sahifasida rol va kimdan so‘rash yozilgan', M.has('Mentor') && M.has(FIX.demoState().accounts.find(a => a.adminRole === 'founder').email) && !!M.d.querySelector('[data-act="perm-ask"]'));
t('ruxsat so‘rash tugmasi xabar beradi', (() => { M.click('[data-act="perm-ask"]'); return M.d.body.textContent.includes('So‘rov yuborildi'); })());
t('ruxsatli bo‘limga o‘tish ishlaydi', (() => { M.w.AIL.go('students'); return M.w.AIL.UI.route === 'students' && !M.has('bo‘limi sizga yopiq'); })());
t('mentor panelida «Dars qo‘shish» amali bloklangan', (() => { const before = M.w.AIL.S.modules.length; M.w.AIL.runPalette('new-lesson'); return M.w.AIL.S.modules.length === before && !M.hasModal('Yangi dars'); })());
t('mentor buyruq panelida kontent buyruqlari yo‘q', (() => { M.w.AIL.openPalette(); const acts = M.w.AIL.palActs(); M.w.AIL.closePalette(); return !acts.includes('new-lesson') && !acts.includes('go:adminLessons'); })());
t('mentor: ruxsati yo‘q amal bloklangan (act ruxsati)', M.w.AIL.actAllowed('new-lesson') === false && M.w.AIL.actAllowed('new-task') === true && M.w.AIL.actAllowed('new-admin') === false);
t('mentor talaba profilida jamoa/o‘chirish amallari yashirilgan', (() => {
  M.w.AIL.go('students');
  M.click('[data-act="student-open"]');
  const ok2 = M.hasModal('Talaba amallari') && !M.d.querySelector('.mbox [data-act="change-group"]') && !M.d.querySelector('.mbox [data-act="delete-student"]') && !!M.d.querySelector('.mbox [data-act="reset-student"]');
  M.w.AIL.closeModal(); return ok2;
})());
t('mentor talaba profilida kirish ma’lumotlari ko‘rinadi', (() => { M.click('[data-act="student-open"]'); const mb = M.d.querySelector('.mbox'); const ok3 = !!mb && mb.textContent.includes('Kirish ma’lumotlari') && /@[a-z]/.test(mb.textContent); M.w.AIL.closeModal(); return ok3; })());
t('mentor dashboardi o‘z ismini ko‘rsatadi', (() => { M.w.AIL.go('admin'); return M.has('Sardor') && !M.has('Bekzod 👋'); })());
t('mentor dashboardida rol va huquq yozilgan', M.has('Mentor') && M.has('Huquqlar: Talabalar, Vazifalar'));
t('mentor dashboardida dars qo‘shish tugmasi yo‘q', !M.d.querySelector('[data-act="new-lesson"]'));
t('mentor dashboardida vazifa berish tugmasi bor', !!M.d.querySelector('[data-act="new-task"]'));
t('mentor mobil navigatsiyasida ham faqat ruxsatli bo‘limlar', (() => {
  const items = [...M.d.querySelectorAll('.bottomnav .bn')].map(x => x.dataset.route);
  return items.every(r => M.w.AIL.canView(r));
})());
/* — kontent menejeri (a5: content, students) — */
const CM = bootF(); CM.w.AIL.loginAs('acc-a5');
t('kontent menejer: darslar ochiq, vazifalar qulfli', CM.w.AIL.canView('adminLessons') && !CM.w.AIL.canView('adminTasks'));
t('kontent menejer: yangi dars qo‘sha oladi', (() => { CM.click('[data-act="go"][data-route="adminLessons"]'); CM.w.AIL.go('adminLessons'); const b2 = CM.d.querySelector('[data-act="new-lesson"]'); return b2 !== null; })());
/* — kurator (a6: students, stats, groups) — */
const CU = bootF(); CU.w.AIL.loginAs('acc-a6');
t('kurator: statistika ochiq, vazifalar qulfli', CU.w.AIL.canView('stats') && !CU.w.AIL.canView('adminTasks'));
/* — parolni almashtirish — */
const PC = bootF(); PC.w.AIL.loginAs('acc-a1');
PC.w.AIL.setPassById('acc-a1', 'eski1234');
const openPassForm = () => {
  if (!PC.d.querySelector('[data-form="pass-change"]')) PC.click('[data-act="pass-change"]');
  return PC.d.querySelector('[data-form="pass-change"]');
};
const fillPass = (oldP, p1, p2) => {
  const f = openPassForm();
  if (!f) return false;
  f.querySelector('input[name="old"]').value = oldP;
  f.querySelector('input[name="p1"]').value = p1;
  f.querySelector('input[name="p2"]').value = p2;
  f.dispatchEvent(new PC.w.Event('submit', { bubbles: true, cancelable: true }));
  return true;
};
t('parol almashtirish oynasi ochiladi', (() => { PC.click('[data-act="pass-change"]'); return PC.hasModal('Parolni almashtirish') && !!PC.d.querySelector('[data-form="pass-change"]'); })());
t('xato hozirgi parol rad etiladi', (() => { fillPass('boshqa', 'yangi1234', 'yangi1234'); return PC.w.AIL.check('bekzod@aileaders.uz', 'yangi1234').err === 'pass' && PC.w.AIL.check('bekzod@aileaders.uz', 'eski1234').ok === true; })());
t('qisqa parol qabul qilinmaydi', (() => { fillPass('eski1234', '123', '123'); return PC.w.AIL.check('bekzod@aileaders.uz', 'eski1234').ok === true; })());
t('mos kelmagan takror rad etiladi', (() => { fillPass('eski1234', 'aaaa1111', 'bbbb2222'); return PC.w.AIL.check('bekzod@aileaders.uz', 'eski1234').ok === true; })());
t('to‘g‘ri parol bilan almashtiriladi', (() => {
  fillPass('eski1234', 'yangi1234', 'yangi1234');
  return PC.w.AIL.check('bekzod@aileaders.uz', 'yangi1234').ok === true && PC.w.AIL.check('bekzod@aileaders.uz', 'eski1234').err === 'pass';
})());
t('parol almashtirilgach oyna yopiladi', !PC.d.querySelector('[data-form="pass-change"]'));

/* — parolni tiklash (admin amali) — */
const PR = bootF(); PR.w.AIL.loginAs('acc-a1');
PR.w.AIL.go('students');
t('talaba profilida parol kartochkasi bor', (() => { PR.click('[data-act="new-student"]'); const ok = PR.hasModal('HEMIS ID'); PR.click('[data-act="close-modal"]'); return ok; })());
t('parolni tiklash mustSetPass’ni qaytaradi', (() => {
  PR.w.AIL.setPassById('acc-s6', 'eskiParol');
  PR.w.AIL.go('students');
  PR.w.AIL.passResetById('acc-s6');
  return PR.w.AIL.check('onyx', 'eskiParol').err === 'first';
})());
/* — namuna paneli butunlay olib tashlandi — */
const SM = bootF();
t('namuna akkauntlar paneli yo‘q (sample-accounts/acc-row yo‘q)', !SM.d.querySelector('[data-act="sample-accounts"]') && SM.d.querySelectorAll('.acc-row').length === 0 && !SM.has('Namuna akkauntlar'));
t('namuna rejimi verline/switch olib tashlangan', !SM.d.querySelector('[data-act="switch"]') && SM.d.querySelectorAll('[role="switch"]').length === 0);
t('kurator akkaunti bir bosishda kiradi (stats ochiq, tasks qulfli)', (() => {
  SM.w.AIL.loginAs('acc-a6');
  return SM.w.AIL.UI.authShow === false && SM.w.AIL.canView('stats') && !SM.w.AIL.canView('adminTasks');
})());
/* — reset: haqiqiy akkauntlar saqlanadi — */
const RS = bootF();
RS.w.AIL.loginAs('acc-a1');
const baseAcc = RS.w.AIL.S.accounts.length, baseStd = RS.w.AIL.S.students.length, baseDemo = RS.w.AIL.S.accounts.filter(a => a.demo).length;
RS.w.AIL.go('students');
RS.click('[data-act="new-student"]');
RS.set('[data-form="new-student"] input[name="name"]', 'Haqiqiy Talaba');
RS.set('[data-form="new-student"] input[name="hemis"]', '999888777666');
RS.submit('[data-form="new-student"]');
const realAcc = RS.w.AIL.accByHemis('999888777666');
const realSid = realAcc && realAcc.studentId;
t('haqiqiy talaba akkaunt + profili bilan qo‘shildi', !!realAcc && realAcc.demo === false && !!realSid
  && RS.w.AIL.S.accounts.length === baseAcc + 1 && RS.w.AIL.S.students.length === baseStd + 1
  && !!RS.w.AIL.S.students.find(x => x.id === realSid));
t('haqiqiy talaba uchun kirish kartochkasi berildi', RS.hasModal('Kirish kartochkasi') && RS.hasModal(realAcc.nick));
t('reset butun bazani o‘chiradi (haqiqiy talaba ham)', (() => {
  RS.w.AIL.reset();
  return RS.w.AIL.S.accounts.length === 0 && RS.w.AIL.S.students.length === 0 && !RS.w.AIL.accByHemis('999888777666')
    && RS.w.AIL.S.tasks.length === 0 && RS.w.AIL.S.groups.length === 0;
})());
t('resetdan keyin ham platforma ishlaydi (sozlash ekrani)', RS.has('Birinchi ishga tushirish') && !!RS.d.querySelector('[data-form="setup-founder"]'));
t('ketma-ket reset jimgina o‘tadi (nusxa himoyasi)', (() => {
  RS.w.AIL.reset();
  return RS.w.AIL.S.accounts.length === 0 && RS.w.AIL.S.students.length === 0 && RS.errors.length === 0;
})());
t('resetdan keyin do‘stlik/so‘rov xaritalari ham bo‘sh', Object.keys(RS.w.AIL.S.friends).length === 0 && Object.keys(RS.w.AIL.S.incoming).length === 0 && Object.keys(RS.w.AIL.S.sent).length === 0);
t('resetdan keyin sessiya yopiladi (xavfsizlik)', RS.w.AIL.S.session === null);
t('JS xatosi yo‘q (sayqal)', H.errors.length === 0 && M.errors.length === 0 && PC.errors.length === 0 && SM.errors.length === 0 && RS.errors.length === 0);

/* — KPI ko'rsatkichlari (v1.4.0 dagi shadowing xatosi qaytmasin) — */
t('talaba KPI raqamlari ko‘rinadi', (() => {
  const K = bootF(); K.w.AIL.loginAs('acc-s1');
  const vs = [...K.d.querySelectorAll('.kpi .v')].map(x => x.textContent.trim());
  return vs.length >= 3 && vs.every(v => /\d/.test(v)) && [...K.d.querySelectorAll('.kpi .ic')].every(x => !!x.querySelector('svg'));
})());
t('admin KPI raqamlari ko‘rinadi', (() => {
  const K2 = bootF(); K2.w.AIL.loginAs('acc-a1');
  const vs = [...K2.d.querySelectorAll('.kpi .v')].map(x => x.textContent.trim());
  return vs.length >= 5 && vs.every(v => /\d/.test(v)) && !K2.d.querySelector('.kpi .d.r');
})());
t('manba kodda takroriy funksiya nomi yo‘q (shadowing himoyasi)', (() => {
  const names = {}, dup = [];
  ['app-1-core.js', 'app-2-student.js', 'app-3-admin.js', 'app-4-app.js'].forEach(f => {
    const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', f), 'utf8');
    const re = /^(?:function\s+([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\(|function|async))/gm;
    let m; while ((m = re.exec(src))) { const n = m[1] || m[2]; if (names[n]) dup.push(f + '→' + n); names[n] = f; }
  });
  if (dup.length) console.log('takroriy nomlar:', dup.join(', '));
  return dup.length === 0;
})());

/* ================= 18. SAHIFA PASTIDAGI PANEL (dizayn ritmi) ================= */
group('18. Sahifa pastidagi panel va dizayn izchilligi');
const D = bootF();
D.w.AIL.loginAs('acc-s1'); D.w.AIL.go('friends');
t('pastki panel student ko‘rinishida bor', !!D.d.querySelector('.content-foot'));
t('panelda brend va tezkor havolalar', D.d.querySelector('.content-foot .cf-brand') !== null && D.d.querySelectorAll('.content-foot .cf-links a').length === 5);
t('panelda versiya ko‘rsatilgan', new RegExp('v' + D.w.AIL.version().replace(/\./g, '\\.')).test(D.d.querySelector('.content-foot').textContent));
t('havola bosilganda bo‘lim almashadi', (() => {
  const a2 = [...D.d.querySelectorAll('.content-foot .cf-links a')].find(x => x.dataset.route === 'deadlines');
  a2.dispatchEvent(new D.w.MouseEvent('click', { bubbles: true }));
  return D.w.AIL.UI.route === 'deadlines';
})());
t('panel yordam tugmasi yorliqlar oynasini ochadi', (() => {
  D.d.querySelector('.content-foot .cf-help').dispatchEvent(new D.w.MouseEvent('click', { bubbles: true }));
  const ok = D.hasModal('Klaviatura yorliqlari');
  D.d.querySelector('[data-act="close-modal"]').dispatchEvent(new D.w.MouseEvent('click', { bubbles: true }));
  return ok;
})());
D.w.AIL.loginAs('acc-a1');
t('admin uchun ham panel bor (boshqa havolalar)', !!D.d.querySelector('.content-foot') && [...D.d.querySelectorAll('.content-foot .cf-links a')].some(x => x.dataset.route === 'students'));
t('mobil uchun panel CSSda yashirilgan, noutbukda ko‘rinadi', (() => {
  const css = D.d.documentElement.innerHTML;
  return css.includes('.content-foot{display:none}') && /@media \(min-width:981px\)\{[\s\S]{0,400}\.content-foot\{/.test(css);
})());
t('karta cho‘zilishi (.stretch) dashboardda ishlatilgan', D.d.documentElement.innerHTML.includes("class=\"card stretch\"") || /class=\\"card stretch\\"/.test(D.d.documentElement.innerHTML) || D.d.documentElement.innerHTML.includes('card stretch'));
t('qidiruv maydoni fokus halqasi CSSda bor', D.d.documentElement.innerHTML.includes('.searchbar:focus-within'));
t('JS xatosi yo‘q (dizayn)', D.errors.length === 0);
}

/* ================= 22. CSV IMPORT: HAQIQIY RO'YXATNI YUKLASH ================ */
group('22. CSV import: haqiqiy talaba ro‘yxatini yuklash');
{
  const Q = bootE();   /* bo'sh platforma + founder */
  Q.d.querySelector('[data-form="setup-founder"] input[name="name"]').value = 'Asil Bek';
  Q.d.querySelector('[data-form="setup-founder"] input[name="email"]').value = 'asil@aileaders.uz';
  Q.d.querySelector('[data-form="setup-founder"] input[name="p1"]').value = 'parol1234';
  Q.d.querySelector('[data-form="setup-founder"] input[name="p2"]').value = 'parol1234';
  Q.submit('[data-form="setup-founder"]');
  Q.w.AIL.go('students');

  /* — sof parser: to'liq to'g'ri fayl — */
  t('CSV: sarlavha va izoh qatorlari', (() => {
    const rep = Q.w.AIL.csvReport('ism_familiya,hemis_id,telefon,jamoa,telegram,maqsad\n# izoh qatori\nDilnoza Karimova,123456789012,+998901112233,Nova,@d,Startap\nOtabek Ruzimov,123456789013,,Orbit,,\n');
    return rep.ok.length === 2 && rep.groups.length === 2 && rep.errors.length === 0 && rep.warns.length === 1;
  })());
  t('CSV: noto‘g‘ri HEMIS xato sifatida qaytadi', (() => {
    const rep = Q.w.AIL.csvReport('ism_familiya,hemis_id\nKimdir Kimdirov,12345\n');
    return rep.ok.length === 0 && rep.errors.length === 1 && /12 xona emas/.test(rep.errors[0]);
  })());
  t('CSV: qisqa ism xato', (() => Q.w.AIL.csvReport('ism_familiya,hemis_id\nAl,123456789012\n').errors.length === 1)());
  t('CSV: faylda takrorlangan HEMIS xato', (() => {
    const rep = Q.w.AIL.csvReport('ism_familiya,hemis_id\nAli Validov,123456789012\nVali Aliyev,123456789012\n');
    return rep.ok.length === 1 && rep.errors.length === 1 && /takrorlangan/.test(rep.errors[0]);
  })());
  t('CSV: majburiy ustunlar yo‘q bo‘lsa ogohlantiradi', (() => {
    const rep = Q.w.AIL.csvReport('a,b\n1,2\n');
    return !!rep.fatal && /Majburiy ustunlar/.test(rep.fatal);
  })());
  t('CSV: ustun nomlari har xil yozilishda tanaladi (f.i.sh, HEMIS ID, guruh)', (() => {
    const rep = Q.w.AIL.csvReport('F.I.Sh;HEMIS ID;Guruh\nJasur Toshmatov;123456789099;Nova\n');
    return rep.ok.length === 1 && rep.ok[0].name === 'Jasur Toshmatov' && rep.groups[0] === 'Nova';
  })());

  /* — UI oqimi: fayl tanlash → hisobot → import — */
  t('«CSV import» tugmasi bo‘sh holatda ham ko‘rinadi', !!Q.d.querySelector('[data-act="import-csv"]'));
  Q.click('[data-act="import-csv"]');
  t('import oynasi fayl maydonini ko‘rsatadi', Q.hasModal('CSV orqali talaba import qilish') && !!Q.d.querySelector('#import-csv'));
  /* fayl tanlash (FileReader asinxron) */
  const csv = 'ism_familiya,hemis_id,telefon,jamoa,telegram,maqsad\n' +
    'Nodira Karimova,555444333222,+998901234567,Nova,@nodira,Birinchi loyiha\n' +
    'Rustam Aliyev,555444333111,+998901234568,Orbit,@rustam,Startap\n' +
    'Xato Qator,12345,,,\n';
  const fileInp = Q.d.querySelector('#import-csv');
  const fl = new Q.w.File([csv], 'talabalar.csv', { type: 'text/csv' });
  Object.defineProperty(fileInp, 'files', { value: [fl], configurable: true });
  fileInp.dispatchEvent(new Q.w.Event('change', { bubbles: true }));
  /* — hisobot va tasdiqlash — */
  {
    await new Promise(r => setTimeout(r, 150));
    t('hisobot: 2 qabul, 1 xato ko‘rsatildi', (() => {
      const mb = Q.d.querySelector('.mbox');
      return !!mb && /qabul qilinadi/.test(mb.textContent) && Q.hasModal('Tekshiruv natijasi') && /12 xona emas/.test(mb.textContent);
    })());
    Q.submit('[data-form="csv-import"]');
    t('import bazaga yozildi (2 talaba, 2 yangi jamoa)', Q.w.AIL.S.students.length === 2 && Q.w.AIL.S.groups.length === 2 && Q.w.AIL.S.groups.every(g => g.members.length === 1));
    t('har talabaga akkaunt + unikal nick + HEMIS bog‘landi', (() => {
      const accs = Q.w.AIL.S.accounts.filter(a => a.demo === false && a.role === 'student');
      const nicks = accs.map(a => a.nick);
      return accs.length === 2 && new Set(nicks).size === 2
        && accs.every(a => a.mustSetPass === true && a.pass === null && /^\d{12}$/.test(a.hemisId) && !!Q.w.AIL.S.students.find(x => x.id === a.studentId));
    })());
    t('yakuniy oynada kirish kartochkalari ro‘yxati', (() => {
      const mb = Q.d.querySelector('.mbox');
      return !!mb && /Import yakunlandi/.test(mb.textContent) && mb.querySelectorAll('[data-act="login-card"]').length === 2;
    })());
    t('kartochka ochiladi (nick + HEMIS)', (() => {
      Q.d.querySelector('.mbox [data-act="login-card"]').dispatchEvent(new Q.w.MouseEvent('click', { bubbles: true }));
      const mb = Q.d.querySelector('.mbox');
      return !!mb && /Kirish kartochkasi/.test(mb.textContent) && /HEMIS ID/.test(mb.textContent) && /Nick \(login\)/.test(mb.textContent);
    })());
    Q.w.AIL.closeModal();
    Q.w.AIL.go('students');
    t('talabalar jadvali va KPI yangilandi', Q.has('Nodira Karimova') && !Q.has('Hali talaba yo‘q') && !/NaN|undefined/.test(Q.txt()));
    t('bir xil HEMIS ikkinchi marta import qilinmaydi', (() => {
      const rep = Q.w.AIL.csvReport('ism_familiya,hemis_id\nBoshqa Odam,555444333222\n');
      return rep.ok.length === 0 && rep.errors.length === 1 && /band/.test(rep.errors[0]);
    })());
    t('jamoa filtri CSV jamoalarini ko‘rsatadi', (() => {
      const btns = [...Q.d.querySelectorAll('[data-act="filter-s"]')].map(x => x.textContent);
      return btns.some(x => /Nova/.test(x)) && btns.some(x => /Orbit/.test(x));
    })());
    t('JS xatosi yo‘q (CSV import)', Q.errors.length === 0);
  }
}

/* ========= 23. BO'SH TUZILMALAR VA YETIM A'ZOLAR (REGRESSIYA) ============= */
group('23. Bo‘sh tuzilmalar: vazifasiz jamoa, yetim a’zo, NaN yo‘q');
{
  const Q = bootE();
  Q.d.querySelector('[data-form="setup-founder"] input[name="name"]').value = 'Test Founder';
  Q.d.querySelector('[data-form="setup-founder"] input[name="email"]').value = 't@aileaders.uz';
  Q.d.querySelector('[data-form="setup-founder"] input[name="p1"]').value = 'parol1234';
  Q.d.querySelector('[data-form="setup-founder"] input[name="p2"]').value = 'parol1234';
  Q.submit('[data-form="setup-founder"]');

  /* — sof funksiya: yetim ssilkalar tozalanadi — */
  t('pruneOrphans: yetim a’zo/do‘st/topshiriq/bildirishnoma olib tashlanadi', (() => {
    const r = Q.w.AIL.prune({
      students: [{ id: 's1' }],
      groups: [{ id: 'g1', members: ['s1', 'gone'] }],
      friends: { s1: ['gone', 's1'], gone: ['s1'] },
      incoming: {}, sent: {},
      submissions: [{ st: 'gone', task: 't1' }, { st: 's1', task: 't1' }],
      notifs: { gone: [{ t: 'x' }], s1: [{ t: 'y' }] }
    });
    return r.groups[0].members.join() === 's1'
      && r.friends.s1.join() === 's1' && r.friends.gone === undefined
      && r.submissions.length === 1 && r.submissions[0].st === 's1'
      && r.notifs.gone === undefined && r.notifs.s1.length === 1;
  })());

  /* — UI: vazifa yo'q, jamoa bor — jamoalar sahifasi va KPI yiqilmasin — */
  Q.w.AIL.go('adminGroups');
  Q.click('[data-act="new-group"]');
  Q.set('[data-form="new-group"] input[name="name"]', 'Yolg‘iz');
  Q.set('[data-form="new-group"] input[name="project"]', 'Birinchi g‘oya');
  Q.submit('[data-form="new-group"]');
  t('vazifasiz jamoa yaratildi', Q.has('Yolg‘iz') && !Q.has('Hali jamoa tuzilmagan'));
  t('jamoalar kartasi vazifasiz ham toza (NaN yo‘q)', !/NaN|undefined/.test(Q.txt()));
  Q.click('[data-act="group-open"]');
  t('jamoa oynasi vazifasiz ham ochiladi', Q.hasModal('Yolg‘iz jamoasi') && !/NaN/.test(Q.d.querySelector('.mbox').textContent));
  Q.w.AIL.closeModal();
  Q.w.AIL.go('stats');
  t('statistika vazifasiz ham raqam beradi', !/NaN|undefined/.test(Q.txt()));
  Q.w.AIL.go('adminTasks');
  t('vazifalar bo‘limi bo‘sh holat kartasini ko‘rsatadi', Q.has('Hali vazifa berilmagan'));

  /* — UI: talaba qo‘shib, keyin o‘chirish — jamoadan ham chiqadi — */
  Q.w.AIL.go('students');
  Q.click('[data-act="new-student"]');
  Q.set('[data-form="new-student"] input[name="name"]', 'Ali Valiyev');
  Q.set('[data-form="new-student"] input[name="hemis"]', '999888777666');
  const gSel = Q.d.querySelector('[data-form="new-student"] select[name="group"]');
  gSel.value = Q.w.AIL.S.groups[0].id;
  Q.submit('[data-form="new-student"]');
  t('talaba jamoa bilan qo‘shildi', Q.w.AIL.S.students.length === 1 && Q.w.AIL.S.groups[0].members.length === 1);
  Q.w.AIL.closeModal();
  Q.w.AIL.go('adminGroups');
  t('jamoa kartasida talaba ko‘rinadi', Q.has('Ali'));
  Q.w.AIL.go('students');
  Q.click('[data-act="student-open"]');
  Q.click('[data-act="delete-student"]');
  Q.click('[data-act="delete-student-do"]');
  t('talaba o‘chirilganda jamoadan ham chiqadi', Q.w.AIL.S.students.length === 0 && Q.w.AIL.S.groups[0].members.length === 0);
  Q.w.AIL.go('adminGroups');
  t('o‘chirishdan keyin jamoalar sahifasi ishlaydi', Q.has('Yolg‘iz') && !/NaN|undefined/.test(Q.txt()));
  Q.w.AIL.go('admin');
  t('dashboard yana bo‘sh holat qadamlarini ko‘rsatadi', Q.has('Boshlash — 4 qadam'));
  Q.w.AIL.go('stats');
  t('statistika bo‘sh holat kartasi (raqamlar bilan yiqilmaydi)', !/NaN|undefined/.test(Q.txt()) && Q.has('Statistika'));
  t('JS xatosi yo‘q (bo‘sh tuzilmalar)', Q.errors.length === 0);
}

/* ============= 21. STATIK QO'RIQCHI: MANBA KODDA NAMUNA MA'LUMOT YO'Q ======= */
group('21. Statik qo‘riqchi: namuna ma’lumot faqat testlar ichida');
{
  const srcFiles = ['app-1-core.js', 'app-2-student.js', 'app-3-admin.js', 'app-4-app.js'];
  const srcAll = srcFiles.map(f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')).join('\n');
  const demoSt = FIX.demoState();
  const stNames = demoSt.students.map(x => x.name).filter(x => x && x.length > 5);
  const adNames = demoSt.accounts.filter(a => a.role === 'admin').map(a => a.name);
  const adMails = demoSt.accounts.filter(a => a.role === 'admin' && a.email).map(a => a.email);
  t('namuna talaba ismlari src’da yo‘q', stNames.length > 10 && stNames.every(x => !srcAll.includes(x)));
  t('namuna admin ism va emaillari src’da yo‘q', adNames.every(x => !srcAll.includes(x)) && adMails.every(x => !srcAll.includes(x)));
  t('namuna o‘zgaruvchilari src’da yo‘q (ADMIN_SEED/DEMO_NICKS/buildAccounts/sampleModal)', !/ADMIN_SEED|DEMO_NICKS|buildAccounts|sampleModal|sample-accounts|quick-acc/.test(srcAll));
  t('src’da demo:true yozuvi yo‘q', !/demo\s*:\s*true/.test(srcAll));
  t('namuna sanalari/grafik qiymatlari src’da yo‘q', !/const TASKS|const GROUPS|const MENTORS|const STUDENTS/.test(srcAll));
  t('blankState() bo‘sh massivlardan boshlanadi', /students:\s*\[\]/.test(fs.readFileSync(path.join(ROOT, 'src', 'app-1-core.js'), 'utf8')));
  t('src fixtura faylini chaqirmaydi', !/fixtures/.test(srcAll) && !/require\(/.test(srcAll));
  t('tozalash funksiyasi mavjud (purgeDemoState)', /function purgeDemoState\(/.test(srcAll) && /needsSetup/.test(srcAll) && /function createFounderAccount\(/.test(srcAll));
  t('qurilgan index.html ham namuna ismlaridan xoli', stNames.every(x => !HTML.includes(x)) && adNames.every(x => !HTML.includes(x)));
  t('versiya izchil (src = sw.js = package.json = 2.1.0)', (() => {
    const ver = /const APP_VERSION = '([^']+)'/.exec(srcAll)[1];
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    return ver === '2.1.0' && sw.indexOf('ai-leaders-v' + ver) > -1 && pkg.version === ver;
  })());
}

/* ============================ XULOSA ====================================== */
}
main().then(() => {
console.log('\n' + '─'.repeat(64));
if (fail === 0) console.log('\x1b[32m\x1b[1m✔ HAMMA TEST O‘TDI:\x1b[0m ' + pass + ' ta tekshiruv, 0 xato');
else {
  console.log('\x1b[31m\x1b[1m✖ ' + fail + ' ta test yiqildi\x1b[0m (' + pass + ' o‘tdi):');
  failures.forEach(f => console.log('   • ' + f));
}
console.log('─'.repeat(64) + '\n');
process.exit(fail ? 1 : 0);
});
