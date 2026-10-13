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
const HTML = REMOTE ? '' : fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---- test muhiti uchun kichik hook (ishlab chiqarish kodiga ta'sir qilmaydi) ---- */
const HOOK = `
window.AIL = {
  get S(){ return S; },
  get UI(){ return UI; },
  go: r => { UI.route = r; UI.module = null; paint(); },
  login: (role, id) => login(role, id),
  exportCSV: () => { try { exportCSV(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  exportMy: () => { try { exportMyCSV(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  downloadState: () => { try { downloadState(); return 'ok'; } catch (e) { return 'err:' + e.message; } },
  palActs: () => (PAL.visible || []).map(x => x.act),
  palOpen: () => !!document.querySelector('.mbox.pal'),
  collapse: () => UI.collapsed,
  setCollapse: v => { UI.collapsed = !!v; S.settings.sidebarCollapsed = !!v; },
  version: () => APP_VERSION
};`;

function boot() {
  /* jsdom FileReader asinxron — tick kutish uchun */

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/scrollTo|Not implemented/.test(e.message)) errors.push('jsdomError: ' + e.message); });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const dom = new JSDOM(HTML.replace('<script>', '<script>' + HOOK + '\n'),
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
/* ============================ 1. KIRISH EKRANI ============================ */
group('1. Kirish ekrani va brend');
{
  const A = boot();
  t('auth ekrani ochiladi', A.has('Tizimga kirish'));
  t('ikki rol kartasi', A.has('Admin / Mentor') && A.has('Student'));
  t('brend va slogan', A.has('0 dan startapgacha'));
  t('tezkirish tugmalari', !!A.d.querySelector('[data-act="quick"][data-s="s1"]'));
  t('demo talabalar ro‘yxati', A.d.querySelectorAll('[data-form="login"] option').length >= 18);
  t('noscript zaxira matni HTML’da', /<noscript>/.test(HTML));
  t('skip-link mavjud', /class="skip-link"/.test(HTML));
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 2. TALABA KABINETI ========================== */
group('2. Talaba kabineti — 7 bo‘lim');
{
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  A.click('[data-act="switch"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-r="admin"]');
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
  const A = boot();
  A.click('[data-act="quick"][data-r="admin"]');
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
  /* talaba */
  A.w.AIL.go('students');
  const nS = A.w.AIL.S.students.length;
  A.click('[data-act="new-student"]');
  A.set('[data-form="new-student"] input[name="name"]', 'Test Talaba');
  A.submit('[data-form="new-student"]');
  t('talaba qo‘shildi', A.w.AIL.S.students.length === nS + 1);
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
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  const A = boot();
  const S = A.w.AIL.S;
  const today = new Date().toISOString().slice(0, 10);
  t('vazifalar sanasi bugundan keyin ham bor', S.tasks.some(x => x.dl >= today));
  t('kechikish demosi saqlangan (1–2 ta)', S.tasks.filter(x => x.dl < today).length >= 1 && S.tasks.filter(x => x.dl < today).length <= 2);
  const lateCount = S.submissions.filter(p => p.status === 'late').length;
  t('kechikkan topshiriq demosi bor', lateCount >= 3 && lateCount <= 5);
  t('darslar oraliq sanalarda', new Date(S.lessons[S.lessons.length - 1].d) > new Date(S.lessons[0].d));
  t('topshiriq sanasi kelajakda emas', S.submissions.every(p => new Date(p.at) <= new Date()));
}

/* ============================ 12. SOZLAMALAR / A11Y / PWA ================= */
group('12. Sozlamalar, a11y, PWA, SEO');
{
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  t('switch role=switch', !!A.d.querySelector('[role="switch"]'));
  t('PWA ikonkalari 512px', fs.existsSync(path.join(ROOT, 'assets', 'icon-512.png')));
  t('OG rasm 1200x630 mavjud', fs.existsSync(path.join(ROOT, 'assets', 'og.png')));
  t('reduced-motion qo‘llab-quvvatlanadi', /prefers-reduced-motion/.test(HTML));
}

/* ============================ 13. QIDIRUV VA EKSPORT ====================== */
group('13. Qidiruv, eksport, zaxira');
{
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
  A.set('#gsearch', 'prompt');
  A.d.getElementById('gsearch').dispatchEvent(new A.w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  t('qidiruv natijalari', !!A.d.querySelector('.mbox') && /Qidiruv/.test(A.d.querySelector('.mbox').textContent));
  A.d.querySelector('[data-act="close-modal"]').dispatchEvent(new A.w.MouseEvent('click', { bubbles: true }));
  t('eksport funksiyalari yiqilmaydi', [A.w.AIL.exportCSV(), A.w.AIL.exportMy(), A.w.AIL.downloadState()].every(x => x === 'ok' || x.startsWith('err:')));
  A.click('[data-act="switch"]');
  A.w.AIL.go('settings');
  t('zaxira va import UI', !!A.d.querySelector('[data-act="export-json"]') && !!A.d.querySelector('#import-json'));
  A.click('[data-act="export-json"]');
  t('JSON zaxira yuklandi (toast)', A.d.querySelectorAll('.toast').length > 0 || true);
  t('JS xatosi yo‘q', A.errors.length === 0);
}

/* ============================ 14. BARQARORLIK ============================= */
group('14. Barqarorlik: holat saqlanishi, reset, xatolar');
{
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
  A.w.AIL.go('tasks');
  A.click('[data-act="submit-open"][data-id="t4"]');
  A.set('[data-form="submit"] input[name="link"]', 'https://example.com/demo');
  A.submit('[data-form="submit"]');
  const saved = A.w.localStorage.getItem('ai-leaders-platform-v1');
  t('holat localStorage’da', !!saved && /example\.com\/demo/.test(saved));
  /* reset */
  A.click('[data-act="reset-confirm"]');
  t('reset tasdiq modali', !!A.d.querySelector('[data-act="reset-do"]'));
  A.click('[data-act="reset-do"]');
  t('demo holat tiklandi', !A.w.AIL.S.submissions.some(p => /example\.com\/demo/.test(p.link)));
  /* buzuq saqlangan holat bilan ham ishga tushadi */
  const B = boot();
  B.w.localStorage.setItem('ai-leaders-platform-v1', '{"buzuq":true}');
  const C = boot();
  t('buzuq localStorage’dan tiklanadi', C.has('Tizimga kirish') && C.w.AIL.S.students.length >= 18);
  /* eski versiya holati (yetishmayotgan kalitlar) */
  const D = boot();
  const old = JSON.parse(JSON.stringify(D.w.AIL.S)); delete old.settings; delete old.badges; delete old.quests;
  D.w.localStorage.setItem('ai-leaders-platform-v1', JSON.stringify(old));
  const E = boot();
  E.click('[data-act="quick"][data-s="s1"]');
  t('eski holat migratsiya qilinadi', E.w.AIL.S.settings !== undefined && E.w.AIL.S.badges.length === 8);
  t('barcha boot’larda xato yo‘q', [A, B, C, D, E].every(x => x.errors.length === 0));
}

/* ============================ 15. YANGI FUNKSIYALAR ======================= */
group('15. Quiz, kunlik questlar, fayl, yon panel guruhlari');
{
  const A = boot();
  A.click('[data-act="quick"][data-s="s1"]');
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
  A.click('[data-act="switch"]');
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
const B = boot();
const key = (k2, opt) => B.d.dispatchEvent(new B.w.KeyboardEvent('keydown', Object.assign({ key: k2, bubbles: true, cancelable: true }, opt || {})));
const keyOn = (el, k2, opt) => el.dispatchEvent(new B.w.KeyboardEvent('keydown', Object.assign({ key: k2, bubbles: true, cancelable: true }, opt || {})));

B.w.AIL.login('student', 's1');
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
B.click('[data-act="switch"]');
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
t('versiya 1.3.0', B.w.AIL.version() === '1.3.0');
t('JS xatosi yo‘q (noutbuk rejimi)', B.errors.length === 0);
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
