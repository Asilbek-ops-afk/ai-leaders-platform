/* ==========================================================================
   AI LEADERS — Startup Club platformasi
   To'liq ishlaydigan demo (localStorage). Tashqi kutubxona yo'q.
   Rollar: Admin (mentor/founder) va Student.
   ========================================================================== */
'use strict';

/* ---------- 1. Yordamchi funksiyalar ---------- */
const VKEY = 'ai-leaders-platform-v1';
const APP_VERSION = '2.3.1';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ico = (n, c) => '<svg class="i ' + (c || '') + '" aria-hidden="true"><use href="#i-' + n + '"></use></svg>';
const uid = p => p + Math.random().toString(36).slice(2, 8);
const get = (arr, id) => arr.find(x => x.id === id);
const cls = (...a) => a.filter(Boolean).join(' ');
const UZ_M = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const UZ_D = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh', 'Ya'];
const TYPES = { video: { l: 'Video', i: 'video', tag: 'p' }, text: { l: 'Matn', i: 'doc', tag: 'c' }, practice: { l: 'Amaliyot', i: 'bolt', tag: 'a' } };

/* demo sanalari har doim "tirik" ko'rinishi uchun bugunga nisbatan siljitiladi */
const dayShift = n => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
const isoDate = d => { const x = new Date(d); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const todayISO = () => isoDate(new Date());
const fmtD = s => { const d = new Date(s + 'T12:00:00'); return d.getDate() + ' ' + UZ_M[d.getMonth()]; };
const fmtFull = s => { const d = new Date(s + 'T12:00:00'); return d.getDate() + ' ' + UZ_M[d.getMonth()] + ' ' + d.getFullYear(); };
const wd = s => UZ_D[(new Date(s + 'T12:00:00').getDay() + 6) % 7];
function timeLeft(dateStr) {
  const ms = new Date(dateStr + 'T23:59:59') - new Date();
  if (ms < 0) return { late: true, txt: Math.max(1, Math.ceil(-ms / 864e5)) + ' kun o‘tib ketdi', d: 0, h: 0, m: 0 };
  const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
  return { late: false, d, h, m, txt: d > 0 ? d + ' kun ' + h + ' soat' : h > 0 ? h + ' soat ' + m + ' daqiqa' : m + ' daqiqa' };
}
const initials = n => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const nf = n => new Intl.NumberFormat('uz-UZ').format(n);

/* ---------- 2. O'quv dasturi ---------- */
const MODULES = [
  { id: 'm1', n: 1, title: 'AI asoslari va ChatGPT/Claude', desc: 'Neyron tarmoq nima, AI bilan birinchi suhbat, nima qila oladi va olmaydi.', icon: 'ai' },
  { id: 'm2', n: 2, title: 'Prompt yozish san’ati', desc: 'Rol, kontekst, format. Few-shot, zanjirli fikrlash, prompt kutubxonasi.', icon: 'chat' },
  { id: 'm3', n: 3, title: 'Vibe coding: g‘oya → sayt', desc: 'Next.js + Supabase + Vercel. G‘oyadan ishlaydigan sahifagacha.', icon: 'bolt' },
  { id: 'm4', n: 4, title: 'Claude Code, GitHub, deploy', desc: 'Terminal, Claude Code bilan kod, GitHub, Vercel-ga chiqarish.', icon: 'terminal' },
  { id: 'm5', n: 5, title: 'Birinchi mini-loyiha', desc: 'Muammo → yechim, MVP, foydalanuvchi bilan suhbat, demo video.', icon: 'rocket' },
  { id: 'm6', n: 6, title: 'Jamoaviy startap va Demo Day', desc: 'Jamoa rollari, PR bilan ishlash, pitch, Demo Day.', icon: 'flag' }
];
const LESSONS = [
  { id: 'l1', m: 'm1', t: 'AI nima? Neyron tarmoq oddiy tilda', type: 'video', dur: 12, d: dayShift(-41), brief: 'AI, ML va neyron tarmoq tushunchalari. Model qanday “o‘ylaydi” — hech qanday matematikadan qo‘rqmasdan.' },
  { id: 'l2', m: 'm1', t: 'ChatGPT, Claude, Gemini: farqi nimada', type: 'text', dur: 10, d: dayShift(-40), brief: 'Qaysi model qaysi vazifaga mos: kod, matn, rasm, tahlil.' },
  { id: 'l3', m: 'm1', t: 'AI bilan birinchi suhbat', type: 'video', dur: 14, d: dayShift(-39), brief: 'Akkaunt ochish, interfeys, birinchi savollaringiz.' },
  { id: 'l4', m: 'm1', t: 'AI nima qila olmaydi: halyusinatsiya', type: 'text', dur: 11, d: dayShift(-38), brief: 'AI xato qiladi — tekshirish odatlari va ishonch chegaralari.' },
  { id: 'l5', m: 'm1', t: 'Amaliyot: kundalik ishni AI-ga topshirish', type: 'practice', dur: 15, d: dayShift(-37), brief: 'O‘qish, ish yoki uy ishlarida 3 ta vazifani AI bilan tezlashtiring.' },

  { id: 'l6', m: 'm2', t: 'Prompt anatomiyasi: rol, kontekst, vazifa, format', type: 'video', dur: 13, d: dayShift(-27), brief: 'Ishlaydigan promptning 4 qismi va tayyor shablon.' },
  { id: 'l7', m: 'm2', t: 'Few-shot va zanjirli fikrlash', type: 'text', dur: 12, d: dayShift(-26), brief: 'Misol berib o‘rgatish, “qadam-baqadam o‘yla” texnikasi.' },
  { id: 'l8', m: 'm2', t: 'AI bilan kontent: matn, rasm, prezentatsiya', type: 'video', dur: 15, d: dayShift(-25), brief: 'Kontent ishlab chiqarish oqimi: g‘oya → matn → vizual.' },
  { id: 'l9', m: 'm2', t: 'Amaliyot: 10 ta prompt kutubxonasi', type: 'practice', dur: 20, d: dayShift(-24), brief: 'O‘zingizga kerak bo‘lgan 10 ta promptni yozib, sinab ko‘ring.' },

  { id: 'l10', m: 'm3', t: 'Vibe coding nima va nega ishlaydi', type: 'video', dur: 12, d: dayShift(-12), brief: 'Kod yozmasdan mahsulot qurish yondashuvi va chegaralari.' },
  { id: 'l11', m: 'm3', t: 'Stack tanlash: Next.js, Supabase, Vercel', type: 'text', dur: 14, d: dayShift(-11), brief: 'Nima uchun aynan shu uchtalik: frontend, baza, hosting.' },
  { id: 'l12', m: 'm3', t: 'Birinchi landing: g‘oyadan sahifagacha', type: 'video', dur: 18, d: dayShift(-10), brief: 'AI bilan landing sahifa qurish — jonli ekran yozuvi.' },
  { id: 'l13', m: 'm3', t: 'Dizayn asoslari: rang, shrift, bo‘sh joy', type: 'text', dur: 12, d: dayShift(-9), brief: 'Professional ko‘rinish uchun 7 ta qoida.' },
  { id: 'l14', m: 'm3', t: 'Forma va ma’lumot: Supabase-ga ulash', type: 'video', dur: 20, d: dayShift(-8), brief: 'Foydalanuvchi ma’lumotini saqlash: jadval, so‘rov, xavfsizlik.' },
  { id: 'l15', m: 'm3', t: 'Amaliyot: o‘z landing sahifangiz', type: 'practice', dur: 30, d: dayShift(-7), brief: 'G‘oyangiz uchun bitta sahifa: sarlavha, muammo, yechim, aloqa.' },

  { id: 'l16', m: 'm4', t: 'Terminaldan qo‘rqmaslik: 12 ta buyruq', type: 'text', dur: 13, d: dayShift(4), brief: 'cd, ls, npm, git — kundalik ish uchun yetarli buyruqlar.' },
  { id: 'l17', m: 'm4', t: 'Claude Code bilan kod yozish', type: 'video', dur: 17, d: dayShift(5), brief: 'Terminaldagi AI yordamchi: vazifa berish, tekshirish, tuzatish.' },
  { id: 'l18', m: 'm4', t: 'GitHub: repo, commit, branch', type: 'video', dur: 15, d: dayShift(6), brief: 'Loyihangizni saqlash va tarixini yuritish.' },
  { id: 'l19', m: 'm4', t: 'Vercel-ga deploy: jonli havola', type: 'video', dur: 12, d: dayShift(7), brief: 'Loyihani internetga chiqarish va domen ulash.' },
  { id: 'l20', m: 'm4', t: 'Amaliyot: GitHub + Vercel-ga chiqarish', type: 'practice', dur: 25, d: dayShift(8), brief: 'Loyihangizni repoga joylang va jonli havola oling.' },

  { id: 'l21', m: 'm5', t: 'G‘oyani tanlash: muammo → yechim', type: 'video', dur: 12, d: dayShift(16), brief: 'Atrofdagi haqiqiy muammodan startap g‘oyasi chiqarish.' },
  { id: 'l22', m: 'm5', t: 'MVP: 1 haftada nima qilsa bo‘ladi', type: 'text', dur: 11, d: dayShift(17), brief: 'Eng kichik ishlaydigan mahsulot — va nima MVP emas.' },
  { id: 'l23', m: 'm5', t: 'Foydalanuvchi bilan suhbat: 5 savol', type: 'video', dur: 13, d: dayShift(18), brief: 'Haqiqiy odamdan haqiqiy fikr olish.' },
  { id: 'l24', m: 'm5', t: 'Amaliyot: MVP + demo video', type: 'practice', dur: 40, d: dayShift(19), brief: 'Ishlaydigan prototip va 90 sekundlik demo video.' },

  { id: 'l25', m: 'm6', t: 'Jamoa rollari: founder, builder, designer', type: 'text', dur: 12, d: dayShift(25), brief: 'Kichik jamoada kim nima qiladi va nega bu muhim.' },
  { id: 'l26', m: 'm6', t: 'Git bilan jamoaviy ish: branch va PR', type: 'video', dur: 16, d: dayShift(26), brief: 'Bir loyihada 4 kishi qanday to‘qnashmasdan ishlaydi.' },
  { id: 'l27', m: 'm6', t: 'Pitch: 60 sekundda g‘oyani sotish', type: 'video', dur: 14, d: dayShift(27), brief: 'Pitch strukturasi: muammo, yechim, bozor, jamoa, so‘rov.' },
  { id: 'l28', m: 'm6', t: 'Demo Day tayyorgarligi', type: 'text', dur: 10, d: dayShift(28), brief: 'Stend, ekran yozuvi, savollarga tayyorgarlik.' },
  { id: 'l29', m: 'm6', t: 'Amaliyot: startap MVP-ni chiqarish', type: 'practice', dur: 60, d: dayShift(32), brief: 'Jamoa bilan 2 haftada ishlaydigan mahsulot chiqarish.' }
];
const QUIZZES = {
  l1: [
    { q: 'Neyron tarmoq nima qiladi?', o: ['Ma’lumotdan naqsh (pattern) topadi', 'Faqat rasm chizadi', 'Internetni tezlashtiradi'], a: 0 },
    { q: 'ChatGPT qaysi turdagi modelga asoslangan?', o: ['Qoidalar bazasi', 'Katta til modeli (LLM)', 'Ekspert tizimi'], a: 1 },
    { q: 'AI javobini har doim qanday qabul qilish kerak?', o: ['To‘g‘ri deb ishonish', 'Tekshirib, manba bilan solishtirish', 'E’tiborsiz qoldirish'], a: 1 }
  ],
  l6: [
    { q: 'Yaxshi promptning to‘rt qismi qaysilar?', o: ['Rol, kontekst, vazifa, format', 'Salom, savol, rahmat', 'Kod, rasm, video'], a: 0 },
    { q: 'Few-shot nima?', o: ['Modelga 2–3 misol ko‘rsatish', 'Modelni o‘chirish', 'Faqat raqam bilan yozish'], a: 0 },
    { q: '“Qadam-baqadam o‘yla” qanday natija beradi?', o: ['Tezroq javob', 'Aniqroq va tekshiriladigan javob', 'Hech qanday farq yo‘q'], a: 1 }
  ],
  l10: [
    { q: 'Vibe coding nima?', o: ['AI yordamida kod yozib mahsulot qurish', 'Musiqa yozish usuli', 'Faqat dizayn chizish'], a: 0 },
    { q: 'MVP nima?', o: ['Eng kichik ishlaydigan mahsulot', 'Marketing rejasi', 'Katta jamoa'], a: 0 },
    { q: 'Loyihani internetga chiqarish (deploy) uchun nima kerak?', o: ['Faqat qog‘oz', 'GitHub + Vercel kabi hosting', 'Server sotib olish shart'], a: 1 }
  ]
};
const BADGES = [
  { id: 'b1', n: 'Birinchi qadam', d: 'Birinchi darsni tugatdingiz', i: 'flag' },
  { id: 'b2', n: 'Prompt ustasi', d: '2-modulni to‘liq tugatdingiz', i: 'chat' },
  { id: 'b3', n: 'Builder', d: '3 ta vazifa qabul qilindi', i: 'cube' },
  { id: 'b4', n: '7 kun streak', d: 'Bir hafta uzluksiz o‘qish', i: 'flame' },
  { id: 'b5', n: 'Jamoa a’zosi', d: 'Jamoa loyihasiga hissa qo‘shdingiz', i: 'users' },
  { id: 'b6', n: 'Deploy qilgan', d: 'Loyihani internetga chiqardingiz', i: 'rocket' },
  { id: 'b7', n: 'Mentor do‘sti', d: '3 kishiga yordam berdingiz', i: 'heart' },
  { id: 'b8', n: 'Demo Day yulduzi', d: 'Demo Day’da qatnashdingiz', i: 'trophy' }
];

/* ---------- 3. Holat ---------- */
function blankState() {
  /* Platforma BO'SH holatda boshlanadi: namunaviy talaba/akkaunt yo'q.
     O'quv dasturi (modullar, darslar) va o'yinlashtirish ta'riflari saqlanadi. */
  return {
    role: 'student', user: null, theme: 'dark',
    students: [], submissions: [], walls: {}, gallery: [],
    badges: BADGES.map(b => JSON.parse(JSON.stringify(b))), quests: {}, quizDone: {},
    accounts: [], session: null,
    settings: { notif: true, weekly: true, publicProfile: true, friendBoard: false },
    meta: { version: APP_VERSION, created: todayISO(), demoPurged: true },
    groups: [], modules: MODULES.map(m => JSON.parse(JSON.stringify(m))),
    lessons: LESSONS.map(l => JSON.parse(JSON.stringify(l))),
    tasks: [], mentors: [], notifs: [], leads: [],
    friends: {}, incoming: {}, sent: {}, activity: [], weekly: [], monthGrowth: []
  };
}
let S = null;
/* Eski (demo) saqlangan holatni tozalash: namunaviy yozuvlar o'chadi,
   faqat haqiqiy (demo bo'lmagan) akkauntlar va ularning profillari qoladi. */
function purgeDemoState(p) {
  const base = blankState();
  const realAccs = (p.accounts || []).filter(a => a && !a.demo);
  const realIds = realAccs.map(a => a.studentId).filter(Boolean);
  base.accounts = realAccs;
  base.students = (p.students || []).filter(x => realIds.includes(x.id));
  realIds.forEach(id => {
    base.friends[id] = (p.friends || {})[id] || [];
    base.incoming[id] = (p.incoming || {})[id] || [];
    base.sent[id] = (p.sent || {})[id] || [];
  });
  base.theme = p.theme || base.theme;
  if (p.settings) base.settings = p.settings;
  base.meta.demoPurged = true;
  base.meta.purgedFrom = p.meta ? p.meta.version : '—';
  base.meta.purgedAt = todayISO();
  return base;
}
/* Yetim ssilkalarni tozalash: jamoa a'zosi, do'stlar, topshiriqlar — hammasi mavjud
   talabalarga bog'lanadi. Bu invariant butun interfeysda null-tekshiruvlarni yo'q qiladi. */
function pruneOrphans(st0) {
  const st = st0 || S;
  const ids = new Set((st.students || []).map(x => x.id));
  const gids = new Set((st.groups || []).map(g => g.id));
  (st.groups || []).forEach(g => { g.members = (g.members || []).filter(id => ids.has(id)); });
  (st.students || []).forEach(x => { if (x.group && !gids.has(x.group)) x.group = ''; });
  ['friends', 'incoming', 'sent'].forEach(k => {
    if (st[k]) Object.keys(st[k]).forEach(id => {
      if (!ids.has(id)) { delete st[k][id]; return; }
      st[k][id] = (st[k][id] || []).filter(f => ids.has(f));
    });
  });
  if (Array.isArray(st.submissions)) st.submissions = st.submissions.filter(p => ids.has(p.st));
  if (st.notifs) Object.keys(st.notifs).forEach(id => { if (!ids.has(id)) delete st.notifs[id]; });
  return st;
}
function loadState() {
  try {
    const raw = localStorage.getItem(VKEY);
    if (!raw) return blankState();
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return blankState();
    /* v2.0.0: namunaviy ma'lumotlar olib tashlandi — eski holat tozalanadi */
    if (!p.meta || p.meta.demoPurged !== true) {
      /* Tozalangan holat darhol yoziladi: namuna ma'lumot qayta-qayta o'qilmaydi */
      const q = purgeDemoState(p);
      try { localStorage.setItem(VKEY, JSON.stringify(q)); } catch (e2) {}
      return q;
    }
    const base = blankState();
    Object.keys(base).forEach(k => { if (p[k] === undefined) p[k] = base[k]; });
    if (!Array.isArray(p.accounts)) p.accounts = [];
    if (p.session && !p.accounts.some(a => a.id === p.session.acc)) p.session = null;
    if (!p.session) p.session = null;
    return pruneOrphans(p);
  } catch (e) { return blankState(); }
}
function save() { try { localStorage.setItem(VKEY, JSON.stringify(S)); } catch (e) { } }
function resetAll() {
  /* Barcha ma'lumotlar (akkauntlar, talabalar, yozuvlar) butunlay o'chiriladi.
     Platforma yangi o'rnatilgan holatga qaytadi — birinchi ishga tushirish ekrani ochiladi. */
  S = blankState();
  save();
  UI.route = 'home'; UI.authShow = true; UI.firstPass = null; UI.authErr = '';
  closeModal();
  toast('ok', 'Barcha ma’lumotlar tozalandi', 'Platforma yangi holatga qaytdi — Founder akkauntini qaytadan yaratasiz.');
  paint();
}

/* ---------- 4. Hisob-kitoblar ---------- */
const EMPTY_ME = { id: null, name: 'Mehmon', act: false, last: 0, xp: 0, wxp: 0, score: 0, tg: '', phone: '', goal: '', bio: '', coins: 0, streak: 0 };
const me = () => get(S.students, S.user) || S.students[0] || EMPTY_ME;
const isAdmin = () => S.role === 'admin';
const modOf = id => get(S.modules, id);
const taskOf = id => get(S.tasks, id);
const lessonOf = id => get(S.lessons, id);
const groupOf = gid => get(S.groups, gid);
const mentorOf = mid => get(S.mentors, mid);
const myGroups = st => S.groups.filter(g => g.members.includes(st.id));
const myGroup = st => myGroups(st)[0] || null;
const lessonsOfModule = m => S.lessons.filter(l => l.m === m);
const totalLessons = () => S.lessons.length;
const subsOf = st => S.submissions.filter(p => p.st === st.id);
const subOf = (st, task) => S.submissions.find(p => p.st === st.id && p.task === task);
const acceptedOf = st => subsOf(st).filter(p => p.status === 'accepted').length;
const notifOf = st => S.notifs.filter(n => n.for === st.id);
const unreadOf = st => notifOf(st).filter(n => n.un).length;
const friendsOf = st => (S.friends[st.id] || []).map(id => get(S.students, id)).filter(Boolean);
const incomingOf = st => (S.incoming[st.id] || []).map(id => get(S.students, id)).filter(Boolean);
const sentOf = st => (S.sent[st.id] || []).map(id => get(S.students, id)).filter(Boolean);
const dueOf = (st, task) => { const g = myGroup(st); return (g && g.dl && g.dl[task.id]) || task.dl; };
const xpRank = id => [...S.students].sort((a, b) => b.xp - a.xp).findIndex(u => u.id === id) + 1;
const wxpRank = id => [...S.students].sort((a, b) => b.wxp - a.wxp).findIndex(u => u.id === id) + 1;
const teamRank = gid => [...S.groups].sort((a, b) => b.xp - a.xp).findIndex(g => g.id === gid) + 1;
/* Haftalik faollik grafigi: saqlangan bo'lsa o'sha, aks holda talabalardan hisoblanadi */
const DAY_L = ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Ya'];
function weeklyData() {
  if (Array.isArray(S.weekly) && S.weekly.length) return S.weekly;
  const tot = S.students.reduce((a, x) => a + (Number(x.wxp) || 0), 0);
  const base = Math.round(tot / 7);
  return DAY_L.map((l, i) => ({ l, v: base ? Math.round(base * (0.74 + i * 0.085)) : 0 }));
}
/* Oxirgi modul (yakuniy loyiha moduli) va uning vazifalari — id'lar qattiq yozilmaydi */
const lastModuleId = () => (S.modules.length ? S.modules[S.modules.length - 1].id : null);
const projTasks = () => S.tasks.filter(t => t.m === lastModuleId());
/* Talaba yakuniy modulda qabul qilingan ish topshirganmi? */
const hasDeployed = st => projTasks().some(t => { const p = subOf(st, t.id); return p && p.status === 'accepted'; });
/* Talaba yakuniy modulda birorta ish topshirganmi? */
const hasFinalWork = st => projTasks().some(t => !!subOf(st, t.id));

/* Eng yuqori XP'li jamoa (bo'sh bo'lsa null) */
const topGroup = () => (S.groups.length ? [...S.groups].sort((a, b) => b.xp - a.xp)[0] : null);
/* Bo'sh holat kartasi: ikonka + sarlavha + matn + ixtiyoriy tugma */
function emptyCard(ic, title, text, btn) {
  return '<div class="card"><div class="empty">' + ico(ic) +
    '<div style="margin-top:10px;font-weight:750;font-size:16px">' + esc(title) + '</div>' +
    '<div class="small muted" style="margin-top:8px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.65">' + esc(text) + '</div>' +
    (btn ? '<div class="row" style="justify-content:center;margin-top:16px">' + btn + '</div>' : '') +
    '</div></div>';
}
function unlockedCount(st) {
  let n = 1;
  for (let i = 1; i < S.modules.length; i++) {
    const prev = S.modules[i - 1];
    const t = S.tasks.find(x => x.m === prev.id);
    const p = t ? subOf(st, t.id) : null;
    if (p && (p.status === 'accepted' || p.status === 'late')) n = i + 1; else break;
  }
  return n;
}
function openLessons(st) { const u = unlockedCount(st); return S.lessons.filter(l => { const m = S.modules.find(x => x.id === l.m); return m && m.n <= u; }); }
function progress(st) {
  const ls = openLessons(st);
  const done = ls.filter(l => st.done.includes(l.id)).length;
  return { done, total: ls.length, pct: ls.length ? Math.round(done / ls.length * 100) : 0 };
}
function modulePct(st, mid) {
  const ls = lessonsOfModule(mid);
  const done = ls.filter(l => st.done.includes(l.id)).length;
  return { done, total: ls.length, pct: ls.length ? Math.round(done / ls.length * 100) : 0 };
}
function medal(st) {
  const a = acceptedOf(st);
  if (a >= 8) return { n: 'AI Leader', i: 'trophy', c: 'a' };
  if (a >= 6) return { n: 'Founder', i: 'rocket', c: 'p' };
  if (a >= 4) return { n: 'Builder', i: 'cube', c: 'c' };
  if (a >= 2) return { n: 'Izlanuvchi', i: 'spark', c: '' };
  return { n: 'Boshlovchi', i: 'flag', c: '' };
}
function myBadges(st) {
  const a = acceptedOf(st);
  const p2 = modulePct(st, 'm2');
  const deployed = hasDeployed(st);
  const m1 = modulePct(st, 'm1');
  const own = { b1: m1.done >= 1, b2: p2.pct === 100, b3: a >= 3, b4: st.streak >= 7, b5: (S.walls[(myGroup(st) || {}).id] || []).some(w => w.who === st.id), b6: deployed, b7: a >= 5, b8: hasFinalWork(st) };
  return S.badges.map(b => ({ ...b, own: !!own[b.id] }));
}
function certsOf(st) {
  const out = [];
  S.modules.forEach(m => { if (modulePct(st, m.id).pct === 100) out.push({ m, code: 'AIL-' + m.id.toUpperCase() + '-' + st.id.toUpperCase() + '-2026', date: dayShift(-7) }); });
  return out;
}
function nextLesson(st) { const ls = openLessons(st); return ls.find(l => !st.done.includes(l.id)) || null; }
function nextTask(st) { return S.tasks.find(t => { const s = subOf(st, t.id); return !s || s.status === 'revise'; }) || null; }
function deadlinesOf(st) { return S.tasks.map(t => { const s = subOf(st, t.id); const due = dueOf(st, t); return { t, s, due, tl: timeLeft(due), late: !s && timeLeft(due).late }; }); }
function lateStudents() {
  const out = [];
  S.tasks.forEach(t => S.students.forEach(st => { const s = subOf(st, t.id); if (!s && timeLeft(dueOf(st, t)).late) out.push({ st, t, due: dueOf(st, t) }); }));
  return out;
}
function onTimePct() {
  let ok = 0, all = 0;
  S.submissions.forEach(p => { const t = taskOf(p.task); const st = get(S.students, p.st); if (!t || !st) return; all++; if (new Date(p.at) <= new Date(dueOf(st, t) + 'T23:59:59')) ok++; });
  return all ? Math.round(ok / all * 100) : 0;
}
function activeCount() { return S.students.filter(s => s.act).length; }
function reviewQueue() { return S.submissions.filter(p => p.status === 'in_review').sort((a, b) => (a.at < b.at ? 1 : -1)); }
function kpisAdmin() {
  const subs = S.submissions;
  const accepted = subs.filter(p => p.status === 'accepted').length;
  const late = subs.filter(p => p.status === 'late').length;
  const rev = subs.filter(p => p.status === 'revise').length;
  const avg = S.students.length ? S.students.reduce((a, s) => a + s.score, 0) / S.students.length : 0;
  return { total: S.students.length, active: activeCount(), subs: subs.length, accepted, late, rev, queue: reviewQueue().length, onTime: onTimePct(), avg: avg.toFixed(1), lateSt: lateStudents().length, groups: S.groups.length, projects: S.gallery.length };
}
function activityPct() { return S.students.length ? Math.round(activeCount() / S.students.length * 100) : 0; }

/* ---------- 5. UI holati ---------- */
const UI = { route: 'home', authShow: false, authRole: 'student', authErr: '', firstPass: null, newCard: null, theme: 'dark', cal: 0, calMonthly: false,
  taskFilter: 'all', studentsFilter: 'all', friendTab: 'friends', search: '', reviewFilter: 'all',
  module: null, installEvt: null, lastLesson: null, collapsed: false, sort: { k: 'name', d: 1 }, csvReport: null, lastImport: null, leadDone: null, landScrollKeep: null, leadDraft: null };

function toast(kind, title, text) {
  const map = { ok: 'check-c', warn: 'alert', err: 'x', info: 'spark' };
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = '<div class="ic">' + ico(map[kind] || 'spark') + '</div><div><b>' + esc(title) + '</b>' + (text ? '<p>' + esc(text) + '</p>' : '') + '</div>';
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => { el.style.transition = '.3s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 320); }, 3800);
}
function pushNotif(stId, t, x, ic) {
  S.notifs.unshift({ id: uid('n'), for: stId, t, x, at: 'hozir', ic: ic || 'spark', un: true });
}
function openModal(html, cls2) {
  document.getElementById('modal-root').innerHTML = '<div class="mback" data-close="1"><div class="mbox ' + (cls2 || '') + '" role="dialog" aria-modal="true">' + html + '</div></div>';
  document.body.style.overflow = 'hidden';
  const box = document.querySelector('.mbox');
  if (box) {
    const f = box.querySelector('input:not([readonly]),textarea,select,button:not([data-act="close-modal"])');
    if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { } }, 60);
  }
}
/* modal ichida Tab fokusini ushlab turish */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const box = document.querySelector('.mbox');
  if (!box) return;
  const items = [...box.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')]
    .filter(x => x.offsetParent !== null || x === document.activeElement);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
/* tasdiqlash modali — xavfli amallar uchun */
function confirmModal(title, text, act, dataId, danger) {
  openModal(mhead(title, text) +
    '<div class="row" style="gap:10px;margin-top:6px"><button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + ' grow" data-act="' + act + '" data-id="' + (dataId || '') + '">Ha, davom etish</button>' +
    '<button class="btn btn-ghost" data-act="close-modal">Bekor qilish</button></div>', 'narrow');
}
function closeModal() { document.getElementById('modal-root').innerHTML = ''; document.body.style.overflow = ''; }
const mhead = (t, s) => '<div class="mhead"><div><h3 class="h2">' + esc(t) + '</h3>' + (s ? '<p class="small muted" style="margin:4px 0 0">' + esc(s) + '</p>' : '') + '</div><button class="btn-icon" data-act="close-modal" aria-label="Yopish">' + ico('x') + '</button></div>';

/* ---------- 6. Umumiy UI bo'laklari ---------- */
const STATUS = {
  none: { l: 'Topshirilmagan', c: 'wait' }, in_review: { l: 'Tekshirilmoqda', c: 'run' },
  accepted: { l: 'Qabul qilindi', c: 'ok' }, revise: { l: 'Qayta ishlash', c: 'bad' }, late: { l: 'Kechikkan', c: 'late' }
};
const stChip = k => '<span class="st ' + (STATUS[k] ? STATUS[k].c : 'wait') + '">' + esc(STATUS[k] ? STATUS[k].l : k) + '</span>';
const onl = st => st.act && st.last <= 1;
function avatar(st, size) {
  return '<span class="av ' + (size || '') + '" title="' + esc(st.name) + '">' + esc(initials(st.name)) + '<i class="' + (onl(st) ? 'on-dot' : 'off-dot') + '"></i></span>';
}
function crest(g, size) {
  const s = size || 52;
  const h = (esc(g.name.charCodeAt(0) + g.name.charCodeAt(1) % 360));
  return '<svg class="crest" style="width:' + s + 'px;height:' + s + 'px" viewBox="0 0 64 64" aria-hidden="true">' +
    '<defs><linearGradient id="cg' + g.id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>' +
    '<path d="M32 3 56 17v30L32 61 8 47V17z" fill="rgba(124,92,255,.16)" stroke="url(#cg' + g.id + ')" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<text x="32" y="39" text-anchor="middle" font-family="Inter,sans-serif" font-size="19" font-weight="800" fill="#EAF0FF">' + esc(initials(g.name)) + '</text></svg>';
}
function ring(pct, size, sub) {
  const s = size || 96, r = (s - 11) / 2, c = 2 * Math.PI * r;
  return '<div class="ring" style="width:' + s + 'px;height:' + s + 'px">' +
    '<svg width="' + s + '" height="' + s + '"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>' +
    '<circle class="bgc" cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" stroke-width="7"/>' +
    '<circle class="fgc" cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" stroke-width="7" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct / 100)) + '" style="transition:stroke-dashoffset .6s"/></svg>' +
    '<div class="val"><div style="font-size:' + Math.round(s / 4) + 'px">' + pct + '%</div>' + (sub ? '<div class="xs muted">' + esc(sub) + '</div>' : '') + '</div></div>';
}
const bar = (pct, c) => '<div class="bar ' + (c || '') + '"><i style="width:' + Math.max(2, Math.min(100, pct)) + '%"></i></div>';
function kpi(ic, val, lab, d, tone) {
  return '<div class="kpi ' + (tone || '') + '"><div class="ic">' + ico(ic) + '</div><div><div class="v">' + val + '</div><div class="small muted" style="font-weight:650">' + esc(lab) + '</div>' + (d ? '<div class="d ' + (tone === 'r' ? 'dn-c' : 'up-c') + '">' + ico('trend', 'sm') + esc(d) + '</div>' : '') + '</div></div>';
}
const tlPill = tl => '<span class="tag ' + (tl.late ? 'r' : tl.d < 2 ? 'o' : 'g') + '">' + ico('clock', 'sm') + esc(tl.late ? tl.txt : tl.txt + ' qoldi') + '</span>';
function streakPill(st) { return '<span class="streak" title="Kunlik streak">' + ico('flame', 'sm') + st.streak + ' kun</span>'; }
function wallClock() {
  const d = new Date(), h = d.getHours();
  return h < 6 ? 'Tinch tun' : h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech';
}
const navDefs = {
  home: { l: 'Bosh sahifa', i: 'home' }, lessons: { l: 'Darslar', i: 'book' }, tasks: { l: 'Vazifa', i: 'task' },
  team: { l: 'Team', i: 'users' }, deadlines: { l: 'Deadline', i: 'clock' }, friends: { l: 'Friends', i: 'user' }, info: { l: 'Ma’lumot', i: 'shield' },
  admin: { l: 'Dashboard', i: 'dash' }, students: { l: 'Talabalar', i: 'users' }, adminTasks: { l: 'Vazifalar', i: 'task' },
  adminLessons: { l: 'Darslar', i: 'book' }, adminGroups: { l: 'Jamoalar', i: 'flag' }, adminDeadlines: { l: 'Deadline’lar', i: 'cal' },
  adminAdmins: { l: 'Adminlar', i: 'shield' },
  stats: { l: 'Statistika', i: 'trend' }, settings: { l: 'Sozlamalar', i: 'settings' }
};
const NAV_SEC = {
  student: [
    ['Ta’lim', ['home', 'lessons', 'tasks']],
    ['Jamoa', ['team', 'deadlines']],
    ['Ijtimoiy', ['friends', 'info']]
  ],
  admin: [
    ['Boshqaruv', ['admin', 'students', 'adminTasks', 'adminAdmins']],
    ['Kontent', ['adminLessons', 'adminGroups', 'adminDeadlines']],
    ['Tahlil', ['stats', 'settings']]
  ]
};
const MOBILE_STUDENT = ['home', 'lessons', 'tasks', 'deadlines', 'info'];
const MOBILE_ADMIN = ['admin', 'students', 'adminTasks', 'adminGroups', 'stats'];

/* ---------- 7. Shell ---------- */
function brandBlock(big, withCollapse) {
  return '<div class="brand"><svg class="mark" style="width:' + (big ? 46 : 42) + 'px;height:' + (big ? 46 : 42) + 'px" viewBox="0 0 64 64" aria-hidden="true">' +
    '<defs><linearGradient id="bm' + (big ? 'b' : 's') + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset=".55" stop-color="#5B8CFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>' +
    '<path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" fill="#0A0F1E" stroke="url(#bm' + (big ? 'b' : 's') + ')" stroke-width="2.6" stroke-linejoin="round"/>' +
    '<path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="url(#bm' + (big ? 'b' : 's') + ')" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25.6 37.6h12.8" stroke="#C6FF4F" stroke-width="4.6" stroke-linecap="round"/>' +
    '<circle cx="32" cy="17.8" r="3.7" fill="#C6FF4F"/><circle cx="21" cy="46.5" r="3" fill="#22D3EE"/><circle cx="43" cy="46.5" r="3" fill="#7C5CFF"/></svg>' +
    '<div class="brand-txt"><strong>AI LEADERS</strong><em>STARTUP CLUB</em></div>' +
    (withCollapse ? '<button class="collapse-btn" data-act="collapse" title="Yon panelni yig‘ish / ochish" aria-label="Yon panelni yig‘ish">' +
      ico(UI.collapsed ? 'right' : 'left', 'sm') + '</button>' : '') + '</div>';
}
function sidebar() {
  const nav = NAV_SEC[isAdmin() ? 'admin' : 'student'];
  const st = me();
  let h = '<aside class="sidebar">' + brandBlock(false, true) + '<div class="side-nav">';
  nav.forEach(sec => {
    h += '<div class="nav-lbl">' + sec[0] + '</div>';
    sec[1].forEach(r => {
      const d = navDefs[r]; const on = UI.route === r;
      let badge = '';
      if (r === 'tasks') { const n = deadlinesOf(st).filter(x => !x.s || x.s.status === 'revise').length; badge = n ? '<span class="cnt">' + n + '</span>' : ''; }
      if (r === 'adminTasks') { const n = reviewQueue().length; badge = n ? '<span class="cnt">' + n + '</span>' : ''; }
      if (r === 'deadlines') { const n = deadlinesOf(st).filter(x => !x.s && x.tl.late).length; badge = n ? '<span class="cnt">' + n + '</span>' : ''; }
      if (r === 'friends') { const n = incomingOf(st).length; badge = n ? '<span class="cnt">' + n + '</span>' : ''; }
      const allowed = canView(r);
      h += '<a class="nav-item' + (on ? ' on' : '') + (allowed ? '' : ' locked') + '" href="#" data-act="go" data-route="' + r + '" title="' + esc(d.l) + (allowed ? '' : ' — ruxsat yo‘q') + '"' + (on ? ' aria-current="page"' : '') + '>' +
        ico(d.i) + '<span class="nlbl">' + esc(d.l) + '</span>' + (allowed ? badge : '<span class="lk">' + ico('lock', 'sm') + '</span>') + '</a>';
    });
  });
  h += '</div><div class="side-foot">';
  const acc = meAcc();
  const meName = acc ? acc.name : (isAdmin() ? 'Admin' : st.name);
  const meSub = acc
    ? (acc.role === 'admin' ? (ADMIN_ROLES[acc.adminRole] || { l: 'Admin' }).l + ' • @' + acc.nick : '@' + acc.nick + ' • ' + (myGroup(st) ? myGroup(st).name + ' jamoasi' : 'jamoa yo‘q'))
    : (isAdmin() ? 'Founder • Admin' : (myGroup(st) ? myGroup(st).name + ' jamoasi' : 'Jamoa biriktirilmagan'));
  h += '<div class="userbox">' + avatar(isAdmin() ? { id: 'adm', name: meName, act: true, last: 0 } : st, 'sm') +
    '<div class="grow ubx" style="min-width:0"><div class="small help ellip" style="font-weight:750">' + esc(meName) + '</div>' +
    '<small class="ellip ubx-sub">' + esc(meSub) + '</small></div>' +
    '<button class="btn-icon" style="width:34px;height:34px" data-act="pass-change" title="Parolni almashtirish" aria-label="Parolni almashtirish">' + ico('lock', 'sm') + '</button></div>';
  h += '<div class="row" style="gap:8px"><button class="btn btn-ghost btn-sm grow" data-act="logout" title="Hisobdan chiqish">' + ico('out', 'sm') + '<span class="blbl">Chiqish</span></button>' +
    '<button class="btn btn-ghost btn-sm" data-act="reset-confirm" title="Demoni tiklash" aria-label="Demo ma’lumotlarni tiklash">' + ico('refresh', 'sm') + '</button></div>' +
    '<div class="xs muted verline" style="text-align:center;padding-top:2px">v' + APP_VERSION + '</div></div></aside>';
  return h;
}
function topbar() {
  const st = isAdmin() ? null : me();
  const un = st ? unreadOf(st) : reviewQueue().length;
  return '<header class="topbar">' +
    '<div class="mobile-brand">' + ico('spark', 'sm') + 'AI LEADERS</div>' +
    '<label class="searchbar grow"><span style="display:flex">' + ico('search', 'sm') + '</span><input id="gsearch" placeholder="' + (window.innerWidth <= 760 ? 'Qidirish…' : 'Dars, vazifa yoki odam qidirish…') + '" autocomplete="off">' +
    '<button type="button" class="kbd" data-act="palette" title="Buyruq paneli (Ctrl+K)">Ctrl K</button></label>' +
    '<span class="hide-sm ' + (isAdmin() ? 'tag p' : 'tag c') + '">' + ico(isAdmin() ? 'shield' : 'user', 'sm') + (isAdmin() ? 'Admin' : 'Student') + '</span>' +
    (!isAdmin() && st ? '<span class="hide-sm streak">' + ico('flame', 'sm') + st.streak + '</span>' : '') +
    '<button class="btn-icon" data-act="notifs" aria-label="Bildirishnomalar">' + ico('bell', 'sm') + (un ? '<i class="dot"></i>' : '') + '</button>' +
    '<button class="btn-icon" data-act="theme" aria-label="Mavzu">' + ico(UI.theme === 'dark' ? 'sun' : 'moon', 'sm') + '</button>' +
    (UI.installEvt ? '<button class="btn-icon hide-sm" data-act="install" title="Ilovani o‘rnatish">' + ico('download', 'sm') + '</button>' : '') +
    (isAdmin() ? '<button class="btn-icon hide-sm" data-act="go-settings" title="Sozlamalar" aria-label="Sozlamalar">' + ico('settings', 'sm') + '</button>' : '') +
    '<button class="btn-icon hide-sm" data-act="shortcuts" title="Klaviatura yorliqlari (?)" aria-label="Klaviatura yorliqlari">' + ico('help', 'sm') + '</button>' +
    '</header>';
}
function toTopBtn() {
  return '<button class="totop" id="toTop" data-act="to-top" title="Yuqoriga" aria-label="Yuqoriga ko‘tarilish"><svg class="i" style="transform:rotate(180deg)" aria-hidden="true"><use href="#i-down"></use></svg></button>';
}
function bottomnav() {
  const list = (isAdmin() ? MOBILE_ADMIN : MOBILE_STUDENT).filter(r => canView(r));
  return '<nav class="bottomnav">' + list.map(r => '<a class="bn' + (UI.route === r ? ' on' : '') + '" href="#" data-act="go" data-route="' + r + '">' + ico(navDefs[r].i) + '<span>' + esc(navDefs[r].l.split(' ')[0]) + '</span></a>').join('') + '</nav>';
}

/* ---------- 7b. Buyruq paneli (Ctrl/Cmd + K) va tez amallar ---------- */
let PAL = { q: '', idx: 0, items: [], visible: [] };
function paletteData() {
  const items = [];
  const navs = isAdmin() ? ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings']
    : ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];
  navs.forEach((r, i) => items.push({ grp: 'Bo‘limlar', l: navDefs[r].l, s: 'Sahifaga o‘tish • Alt+' + (i + 1), i: navDefs[r].i, act: 'go:' + r }));
  /* ruxsati yo'q bo'lim va amallar ro'yxatga tushmaydi */
  for (let k = items.length - 1; k >= 0; k--) {
    const it = items[k];
    if (it.act && it.act.indexOf('go:') === 0 && !canView(it.act.slice(3))) items.splice(k, 1);
  }
  const palFilter = list => {
    for (let k = list.length - 1; k >= 0; k--) {
      const a0 = list[k].act || '';
      if (!palActAllowed(a0)) list.splice(k, 1);
    }
    return list;
  };
  if (isAdmin()) {
    items.push({ grp: 'Amallar', l: 'Yangi vazifa berish', s: 'Talabalarga topshiriq', i: 'plus', act: 'new-task' });
    items.push({ grp: 'Amallar', l: 'Dars qo‘shish', s: 'Kontent qo‘shish', i: 'video', act: 'new-lesson' });
    items.push({ grp: 'Amallar', l: 'Talaba qo‘shish', s: 'HEMIS ID + nick berish', i: 'users-plus', act: 'new-student' });
    items.push({ grp: 'Amallar', l: 'Admin qo‘shish', s: 'Email + rol + ruxsatlar', i: 'shield', act: 'new-admin' });
    items.push({ grp: 'Amallar', l: 'Zaxira nusxa (JSON)', s: 'Ma’lumotlarni yuklab olish', i: 'download', act: 'export-json' });
    items.push({ grp: 'Amallar', l: 'Statistika hisoboti (CSV)', s: 'Excel uchun', i: 'doc', act: 'export' });
  } else {
    const nl = nextLesson(me()), nt = nextTask(me());
    if (nl) items.push({ grp: 'Amallar', l: 'Darsda davom etish', s: nl.t, i: 'play', act: 'lesson-open:' + nl.id });
    if (nt) items.push({ grp: 'Amallar', l: 'Vazifa topshirish', s: nt.title, i: 'upload', act: 'submit-open:' + nt.id });
    items.push({ grp: 'Amallar', l: 'Natijalarimni yuklab olish', s: 'CSV hisobot', i: 'download', act: 'export-my' });
  }
  items.push({ grp: 'Amallar', l: UI.theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Tungi rejimga o‘tish', s: 'Mavzu', i: 'sun', act: 'theme' });
  items.push({ grp: 'Amallar', l: 'Bildirishnomalar', s: 'Yangi xabarlar', i: 'bell', act: 'notifs' });
  items.push({ grp: 'Amallar', l: UI.collapsed ? 'Yon panelni ochish' : 'Yon panelni yig‘ish', s: 'Ish maydonini kengaytirish', i: 'grid', act: 'collapse' });
  if (UI.installEvt) items.push({ grp: 'Amallar', l: 'Ilovani o‘rnatish', s: 'Telefon yoki kompyuterga', i: 'download', act: 'install' });
  items.push({ grp: 'Amallar', l: 'Parolni almashtirish', s: '@' + ((meAcc() || {}).nick || '—'), i: 'lock', act: 'pass-change' });
  S.lessons.forEach(l => items.push({ grp: 'Darslar', l: l.t, s: modOf(l.m).n + '-modul • ' + l.dur + ' daqiqa', i: 'book',
    act: (isAdmin() ? 'lesson-edit:' : 'lesson-open:') + l.id }));
  S.tasks.forEach(t => items.push({ grp: 'Vazifalar', l: t.title, s: 'Deadline: ' + fmtFull(t.dl), i: 'task', act: (isAdmin() ? 'task-review:' : 'task-open:') + t.id }));
  if (isAdmin()) S.students.forEach(s0 => items.push({ grp: 'Talabalar', l: s0.name, s: (myGroup(s0) || {}).name || 'jamoa yo‘q', i: 'user', act: 'student-open:' + s0.id }));
  S.groups.forEach(g => items.push({ grp: 'Jamoalar', l: g.name, s: g.project, i: 'flag', act: 'group-open:' + g.id }));
  return palFilter(items);
}
function openPalette() {
  PAL.items = paletteData(); PAL.q = ''; PAL.idx = 0;
  openModal(
    '<div class="pal-head">' + ico('search') +
    '<input id="pal-input" class="grow" placeholder="Buyruq, dars, vazifa yoki odam qidirish…" autocomplete="off" aria-label="Buyruq izlash">' +
    '<span class="kbd">ESC</span></div>' +
    '<div id="pal-list" class="pal-list"></div>' +
    '<div class="pal-foot"><span class="row xs">' + ico('down', 'sm') + ico('up', 'sm') + ' harakatlanish • ' + ico('right', 'sm') + ' tanlash</span>' +
    '<span class="xs">' + PAL.items.length + ' ta buyruq</span></div>', 'pal');
  const inp = document.getElementById('pal-input');
  if (inp) {
    inp.focus();
    inp.oninput = () => { PAL.q = inp.value.trim().toLowerCase(); PAL.idx = 0; paintPalette(); };
    inp.onkeydown = e => {
      const list = PAL.visible || [];
      if (e.key === 'ArrowDown') { e.preventDefault(); PAL.idx = Math.min(PAL.idx + 1, list.length - 1); paintPalette(true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); PAL.idx = Math.max(PAL.idx - 1, 0); paintPalette(true); }
      else if (e.key === 'Enter') { e.preventDefault(); if (list[PAL.idx]) runPalette(list[PAL.idx].act); }
      else if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    };
  }
  paintPalette();
}
function paintPalette(keepIdx) {
  const items = PAL.items.filter(x => !PAL.q || (x.l + ' ' + x.s + ' ' + x.grp).toLowerCase().includes(PAL.q));
  PAL.visible = items.slice(0, 60);
  if (!keepIdx) PAL.idx = 0;
  if (PAL.idx > PAL.visible.length - 1) PAL.idx = Math.max(0, PAL.visible.length - 1);
  let html = '', lastGrp = '';
  PAL.visible.forEach((x, i) => {
    if (x.grp !== lastGrp) { html += '<div class="pal-grp">' + esc(x.grp) + '</div>'; lastGrp = x.grp; }
    html += '<button type="button" class="pal-item' + (i === PAL.idx ? ' on' : '') + '" data-act="pal-run" data-idx="' + i + '">' +
      '<span class="pal-ic">' + ico(x.i, 'sm') + '</span><span class="grow" style="min-width:0">' +
      '<span class="small ellip" style="font-weight:700;display:block">' + esc(x.l) + '</span>' +
      '<span class="xs muted ellip" style="display:block">' + esc(x.s) + '</span></span>' +
      '<span class="kbd">↵</span></button>';
  });
  const list = document.getElementById('pal-list');
  if (list) list.innerHTML = html || '<div class="empty">Hech narsa topilmadi — boshqa so‘z bilan urinib ko‘ring</div>';
  const on = document.querySelector('.pal-item.on');
  if (on && on.scrollIntoView) { try { on.scrollIntoView({ block: 'nearest' }); } catch (e) { } }
}
const PAL_PERM = { 'new-task': 'tasks', 'new-lesson': 'content', 'new-module': 'content', 'new-student': 'students', 'new-group': 'groups', 'new-admin': '__founder', export: 'stats', 'export-json': 'settings' };
/* Amal ruxsatga ega bo'lmasa: panel ro'yxatida ham, bajarishda ham yopiq */
function palActAllowed(act) {
  const parts = String(act).split(':'), k = parts[0], v = parts[1];
  if (PAL_PERM[k]) return PAL_PERM[k] === '__founder' ? isFounder() : actionAllowed(PAL_PERM[k]);
  if (k === 'go' && v) {
    if (!canView(v)) return false;
    const need = ADMIN_SECTION_PERM[v];
    if (need === '__founder') return isFounder();
  }
  return true;
}
function runPalette(act) {
  const parts = String(act).split(':'), k = parts[0], v = parts[1];
  closeModal();
  if (PAL_PERM[k]) {
    if (PAL_PERM[k] === '__founder' && !isFounder()) { permDenied('admins'); return; }
    if (PAL_PERM[k] !== '__founder' && !actionAllowed(PAL_PERM[k])) { permDenied(PAL_PERM[k]); return; }
  }
  if (k === 'go' && !canView(v)) { permDenied(ADMIN_SECTION_PERM[v] === '__founder' ? 'admins' : (ADMIN_SECTION_PERM[v] || 'settings')); return; }
  const acts = {
    go: () => go(v),
    theme: () => { const n = UI.theme === 'dark' ? 'light' : 'dark'; UI.theme = n; S.theme = n; document.documentElement.dataset.theme = n; save(); paint(true); },
    notifs: () => notifModal(),
    collapse: () => toggleCollapse(),
    install: () => document.querySelector('.topbar [data-act="install"]') ? document.querySelector('.topbar [data-act="install"]').click() : toast('info', 'O‘rnatish', 'Brauzer menyusidan “Bosh ekranga qo‘shish” ni tanlang.'),
    'new-task': () => createTaskModal(),
    'new-lesson': () => createLessonModal(),
    'new-student': () => addStudentModal(),
    'export-json': () => downloadState(),
    'pass-change': () => passChangeModal(),
    'export-my': () => exportMyCSV(),
    export: () => exportCSV(),
    'lesson-open': () => lessonModal(lessonOf(v)),
    'lesson-edit': () => editLessonModal(v),
    'submit-open': () => submitModal(taskOf(v)),
    'task-open': () => { if (isAdmin()) toast('info', 'Vazifa', taskOf(v).title); else { const p = subOf(me(), v); p ? subViewModal(p) : submitModal(taskOf(v)); } },
    'task-review': () => { const rel = S.submissions.filter(p => p.task === v); openModal(mhead('Tekshirish: ' + taskOf(v).title, rel.length + ' ta topshiriq') + (rel.length ? '<div class="col" style="gap:9px">' + rel.map(p => { const s0 = get(S.students, p.st); return '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s0, 'xs') + '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s0.name) + '</div><div class="xs muted">' + fmtD(p.at) + '</div></div></div>' + stChip(p.status) + '<button class="btn btn-xs btn-primary" data-act="review-open" data-sub="' + p.id + '">Ochish</button></div>'; }).join('') + '</div>' : '<div class="empty">Topshiriq yo‘q</div>'), 'wide'); },
    'student-open': () => adminStudentModal(get(S.students, v)),
    'group-open': () => teamModal(groupOf(v))
  };
  (acts[k] || (() => { }))();
}
function toggleCollapse() {
  UI.collapsed = !UI.collapsed;
  S.settings.sidebarCollapsed = UI.collapsed;
  save(); paint(true);
  toast('info', UI.collapsed ? 'Yon panel yig‘ildi' : 'Yon panel ochildi', UI.collapsed ? 'Ish maydoni kengaydi (Ctrl+K bilan tez amallar).' : '');
}
function shortcutsModal() {
  const rows = [
    ['Ctrl / ⌘ + K', 'Buyruq paneli — tez qidiruv va amallar'],
    ['/', 'Qidiruv maydoniga o‘tish'],
    ['Alt + 1…8', 'Bo‘limlar orasida almashish'],
    ['N', 'Bildirishnomalar'],
    ['T', 'Dark / Light rejim'],
    ['?', 'Klaviatura yorliqlari'],
    ['Esc', 'Modalni yopish'],
    ['Tab', 'Modal ichida fokusni aylantirish']
  ];
  openModal(mhead('Klaviatura yorliqlari', 'Noutbukda sichqonchasiz ishlash uchun') +
    '<div class="col" style="gap:10px">' + rows.map(r => '<div class="row between" style="gap:12px"><span class="small t2">' + esc(r[1]) + '</span><span class="kbd">' + esc(r[0]) + '</span></div>').join('') + '</div>' +
    '<div class="divider"></div><div class="row" style="gap:10px"><span class="kbd">Ctrl K</span><span class="xs muted">— eng tez yo‘l: buyruq paneli orqali hamma narsa.</span></div>' +
    '<div class="xs muted" style="margin-top:8px">Maslahat: yon panel sarlavhasidagi strelka tugmasi bilan panelni yig‘ib, kengroq ish maydoni olasiz.</div>', 'narrow');
}
/* Jadval saralash (admin) */
function sortStudentsList(list) {
  const k = UI.sort.k, d = UI.sort.d;
  const val = s0 => ({
    name: s0.name, group: (myGroup(s0) || {}).name || '~', progress: progress(s0).pct,
    score: Number(s0.score) || 0, xp: s0.xp, streak: s0.streak, last: s0.last
  }[k]);
  return [...list].sort((a, b) => {
    const A = val(a), B = val(b);
    if (typeof A === 'string') return A.localeCompare(B, 'uz') * d;
    return (A - B) * d;
  });
}
const thBtn = (k, l) => '<button class="th' + (UI.sort.k === k ? ' on' : '') + '" data-act="sort" data-k="' + k + '" title="' + esc(l) + ' bo‘yicha saralash">' +
  esc(l) + (UI.sort.k === k ? '<span class="ar">' + (UI.sort.d > 0 ? '▲' : '▼') + '</span>' : '') + '</button>';

/* ---------- 7c. AKKAUNTLAR: HEMIS ID + unikal nick + parol (MVP) ----------
   Har bir talabaga bitta HEMIS ID va bitta unikal nick beriladi (21-school uslubida).
   Parolni talaba BIRINCHI kirishda o'zi o'rnatadi. Hozir ma'lumot brauzerda saqlanadi
   (demo baza); Supabase ulanganda shu qatlam o'sha bazaga ko'chadi — interfeys o'zgarmaydi. */
const NICK_WORDS = ('falcon onyx comet zephyr nova atlas echo pixel cobalt quasar vector photon nexus ember orbit lunar ' +
  'titan hydra volt riddle summit beacon cypher delta aurora blaze canyon dynamo eclipse forge glacier halo ' +
  'ignite jasper kernel legend matrix nebula omega prism quartz ripple sigma torrent umbra vertex whisper xenon ' +
  'yonder zenith alpine bison cascade drift falcon2 granite horizon ivory jigsaw kraken lantern marble nimbus ' +
  'obsidian pinnacle quill raven sapphire tundra uranium voyage wanderer yarrow zephyrus anchor breeze cliff ' +
  'domino engine fathom gadget helix inlet journey keystone lagoon magnet nickel orchard plumage quiver rocket ' +
  'saddle tempest upal valley willow xenolith yacht zebra acorn boulder cipher dune flint grove haven isthmus ' +
  'jubilee kestrel lotus mirage nomad opal pasture quasar2 reef solstice tide ultimo vista walnut zephyr2 aikido ' +
  'binary circuit diode falconer grid iron juniper kelvin laser metro neutron octagon plasma rotor seismic tesseract ' +
  'urgent vivid wagon zenith2 amber bronze copper diamond emerald falcon3 graphite helium indigo jade krypton ' +
  'lithium mercury neon oxygen pearl radium silver tin uranium2 zinc argon boron carbon').split(/\s+/).filter(Boolean);
const ADMIN_ROLES = {
  founder: { l: 'Founder (to‘liq huquq)', i: 'award' },
  'head-mentor': { l: 'Bosh mentor', i: 'trophy' },
  mentor: { l: 'Mentor', i: 'users' },
  content: { l: 'Kontent menejer', i: 'book' },
  curator: { l: 'Kurator (nazorat)', i: 'shield' }
};
const ADMIN_PERMS = [
  ['students', 'Talabalar va akkauntlar'], ['tasks', 'Vazifalar va tekshirish'], ['content', 'Darslar va modullar'],
  ['groups', 'Jamoalar'], ['stats', 'Statistika va hisobot'], ['settings', 'Sozlamalar va zaxira'], ['admins', 'Adminlarni boshqarish']
];
/* Parol hesh: cxhash (demo-darajali). Haqiqiy bazada parol server tomonda (bcrypt) saqlanadi. */
function cxhash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return ('0000000' + (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36)).slice(-13);
}
const hashPass = (nick, pass) => cxhash('ail|' + String(nick).toLowerCase() + '|' + String(pass) + '|v1');
function digitsOnly(v) { return String(v == null ? '' : v).replace(/\D/g, ''); }
const validHemis = h => /^\d{12}$/.test(digitsOnly(h));
/* Telefonni o'qishga qulay ko'rinishda: 998901112233 → +998 90 111 22 33 */
const fmtPhone = p => {
  const d = digitsOnly(p || '');
  if (d.length === 12 && d.slice(0, 3) === '998') return '+998 ' + d.slice(3, 5) + ' ' + d.slice(5, 8) + ' ' + d.slice(8, 10) + ' ' + d.slice(10);
  if (d.length === 9) return '+998 ' + d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5, 7) + ' ' + d.slice(7);
  return p || '';
};
const maskHemis = h => h ? '•••• •••• ' + digitsOnly(h).slice(-4) : '—';
const accounts = () => (S.accounts || []);
const accById = id => accounts().find(a => a.id === id) || null;
const accByNick = n => accounts().find(a => a.nick && a.nick.toLowerCase() === String(n || '').trim().toLowerCase()) || null;
const accByHemis = h => { const d = digitsOnly(h); return d ? accounts().find(a => a.hemisId && digitsOnly(a.hemisId) === d) || null : null; };
const accByEmail = e => accounts().find(a => a.email && a.email.toLowerCase() === String(e || '').trim().toLowerCase()) || null;
const meAcc = () => (S.session && accById(S.session.acc)) || null;
const nickTaken = (nick, exceptId) => accounts().some(a => a.nick && a.nick.toLowerCase() === String(nick).toLowerCase() && a.id !== exceptId);
function genNick() {
  const free = NICK_WORDS.filter(w => !nickTaken(w));
  if (free.length) return free[Math.floor(Math.random() * free.length)];
  let n = 2; while (nickTaken('leader' + n)) n++;
  return 'leader' + n;
}
/* Birinchi ishga tushirish: akkaunt yo'q bo'lsa — sozlash ekrani ko'rsatiladi */
const needsSetup = () => accounts().length === 0;
/* Founder akkauntini yaratish (platformaning birinchi egasi) */
function createFounderAccount(data) {
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const pass = String(data.pass || '');
  if (name.length < 3) return { err: 'name', msg: 'Ism-familiyani to‘liq kiriting.' };
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return { err: 'email', msg: 'Email manzil noto‘g‘ri ko‘rinishda (masalan ism@aileaders.uz).' };
  if (accByEmail(email)) return { err: 'email-dup', msg: 'Bu email allaqachon ro‘yxatdan o‘tgan.' };
  if (pass.length < 4) return { err: 'pass', msg: 'Parol kamida 4 belgidan iborat bo‘lsin.' };
  const nick = (String(data.nick || '').trim().toLowerCase().replace(/[^a-z0-9_.]/g, '')) || genNick();
  if (nickTaken(nick)) return { err: 'nick-dup', msg: 'Bu nick band: ' + nick + '.' };
  const acc = {
    id: 'acc-' + Math.random().toString(36).slice(2, 8), role: 'admin', adminRole: 'founder', perms: ['__all'],
    nick, name, email, phone: null, hemisId: null, pass: hashPass(nick, pass), mustSetPass: false,
    status: 'active', created: todayISO(), lastLogin: Date.now()
  };
  accounts().push(acc); save();
  return { ok: true, acc };
}
/* ---------- 3a. Ro'yxatdan o'tish arizasi (landing sahifasi) ----------
   Talaba o'zi akkaunt yarata olmaydi: ariza qoldiradi, admin uning HEMIS ID sini
   kiritib akkaunt ochadi va NICK beradi. Kirish esa faqat shu nick + parol bilan.
   Bitta HEMIS ID — bitta nick (takror ro'yxatga olish bloklanadi). */
function addLead(d) {
  const name = String(d.name || '').trim();
  const phone = digitsOnly(d.phone || '');
  const tg = String(d.tg || '').trim();
  const goal = String(d.goal || '').trim();
  if (name.length < 3) return { err: 'name', msg: 'Ism-familiyani to‘liq kiriting.' };
  if (phone.length < 9) return { err: 'phone', msg: 'Telefon raqamni to‘liq kiriting (masalan +998 90 123 45 67).' };
  if ((S.leads || []).some(l => l.phone === phone)) return { err: 'dup', msg: 'Bu raqam bilan ariza allaqachon yuborilgan — admin tez orada bog‘lanadi.' };
  if (!Array.isArray(S.leads)) S.leads = [];
  const lead = { id: uid('ld'), name, phone, tg, goal, at: todayISO(), status: 'new' };
  S.leads.unshift(lead); save();
  return { ok: true, lead };
}
function delLead(id) {
  if (!Array.isArray(S.leads)) return;
  const i = S.leads.findIndex(l => l.id === id);
  if (i > -1) { S.leads.splice(i, 1); save(); }
}

/* ---------- 3b. Talaba yaratish (bitta joydan: forma ham, CSV import ham) ---------- */
function addStudentRecord(d, o) {
  const res = createStudentAccount(d);
  if (res.err) return res;
  if (o && o.imp) res.acc.imp = true;
  const s0 = { id: uid('s'), name: String(d.name || '').trim(), tg: String(d.tg || '').trim() || '@talaba',
    phone: String(d.phone || '').trim() || '+998', group: d.groupId || '',
    xp: 0, wxp: 0, streak: 0, coins: 0, level: 'junior', act: true, score: 0, joined: todayISO(),
    bio: d.bio || 'Yangi a’zo.', goal: String(d.goal || '').trim() || 'Birinchi loyihani chiqarish', done: [], last: 0 };
  S.students.push(s0);
  res.acc.studentId = s0.id; res.acc.groupId = s0.group || null;
  if (s0.group) { const g = groupOf(s0.group); if (g) g.members.push(s0.id); }
  S.friends[s0.id] = []; S.incoming[s0.id] = []; S.sent[s0.id] = [];
  save();
  return { ok: true, acc: res.acc, student: s0 };
}
/* ---------- 3c. CSV import: ustunlarni tanish + tekshirish + bazaga qo'shish ---------- */
const CSV_ALIASES = {
  name: ['ism', 'ism_familiya', 'fish', 'f.i.sh', 'f.i.o', 'fish', 'name', 'talaba', 'talaba f.i.sh', 'fullname'],
  hemis: ['hemis', 'hemis_id', 'hemisid', 'hemis id', 'id'],
  phone: ['telefon', 'tel', 'phone', 'raqam'],
  group: ['jamoa', 'guruh', 'group', 'team'],
  tg: ['telegram', 'tg', 'username'],
  goal: ['maqsad', 'goal', 'maqsadi']
};
function csvDelim(line) { const c = [',', ';', '\t']; let best = ',', n = 0; c.forEach(x => { const k = line.split(x).length; if (k > n) { n = k; best = x; } }); return best; }
function parseCSV(text) {
  const clean = String(text || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = clean.split('\n').filter(l => l.trim() !== '' && !l.trim().startsWith('#'));
  if (!lines.length) return [];
  const sep = csvDelim(lines[0]);
  const rows = []; let cur = [], cell = '', q = false;
  const pushCell = () => { cur.push(cell.trim()); cell = ''; };
  for (const line of lines) {
    q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
      else if (ch === '"') q = true;
      else if (ch === sep) pushCell();
      else cell += ch;
    }
    pushCell(); rows.push(cur); cur = [];
  }
  return rows;
}
function csvMapHeader(row) {
  const map = {};
  row.forEach((h, i) => {
    const k = String(h || '').toLowerCase().replace(/["']/g, '').trim();
    Object.keys(CSV_ALIASES).forEach(f => { if (map[f] === undefined && CSV_ALIASES[f].includes(k)) map[f] = i; });
  });
  return map;
}
/* CSV matnini tekshirib tayyor qatorlar + xato/ogohlantirishlar qaytaradi */
function csvStudentsReport(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return { fatal: 'Faylda sarlavha va kamida bitta talaba qatori bo‘lishi kerak.' };
  const map = csvMapHeader(rows[0]);
  if (map.name === undefined || map.hemis === undefined) return { fatal: 'Majburiy ustunlar topilmadi: «ism_familiya» va «hemis_id». Shablon: docs/talabalar-shabloni.csv' };
  const ok = [], errors = [], warns = [], seen = {}, seenPhone = {};
  rows.slice(1).forEach((r, i) => {
    const line = i + 2;
    const g = f => (map[f] === undefined ? '' : String(r[map[f]] || '').trim());
    const name = g('name'), hemis = digitsOnly(g('hemis')), phone = g('phone'), group = g('group');
    if (name.length < 3) { errors.push(line + '-qator: ism juda qisqa («' + name + '»).'); return; }
    if (!validHemis(hemis)) { errors.push(line + '-qator: HEMIS ID 12 xona emas («' + g('hemis') + '»).'); return; }
    if (accByHemis(hemis)) { errors.push(line + '-qator: ' + name + ' — bu HEMIS ID band (' + accByHemis(hemis).nick + ').'); return; }
    if (seen[hemis]) { errors.push(line + '-qator: ' + name + ' — faylda takrorlangan HEMIS ID.'); return; }
    seen[hemis] = 1;
    if (phone && (seenPhone[phone] || accounts().some(a => a.phone && a.phone === phone))) warns.push(line + '-qator: ' + name + ' — telefon boshqa talabada ham bor.');
    if (phone) seenPhone[phone] = 1;
    if (!phone) warns.push(line + '-qator: ' + name + ' — telefon yo‘q.');
    if (!group) warns.push(line + '-qator: ' + name + ' — jamoasiz (keyin biriktirish mumkin).');
    ok.push({ name, hemisId: hemis, phone, group, tg: g('tg'), goal: g('goal') });
  });
  const groups = [...new Set(ok.map(x => x.group).filter(Boolean))];
  const freeNicks = NICK_WORDS.filter(w => !nickTaken(w)).length;
  if (ok.length > freeNicks) warns.push((ok.length - freeNicks) + ' talabaga «leaderN» ko‘rinishidagi nick beriladi (nick lug‘ati tugadi).');
  const newGroupNames = groups.filter(n => !S.groups.some(g => String(g.name).toLowerCase() === String(n).toLowerCase()));
  return { ok, groups, newGroupNames, errors, warns };
}
/* Tekshirilgan qatorlarni bazaga qo'shadi (jamoa kerak bo'lsa avtomatik yaratiladi) */
function importStudents(report) {
  const gMap = {};
  const created = [];
  const newGroupIds = [];
  const newGroupNames = [];
  report.groups.forEach(gName => {
    const found = S.groups.find(g => String(g.name).toLowerCase() === String(gName).toLowerCase());
    const g = found || { id: uid('g'), name: gName, project: '', members: [], mentor: null, xp: 0, dl: {}, color: 'p' };
    if (!found) { S.groups.push(g); newGroupIds.push(g.id); newGroupNames.push(gName); }
    gMap[gName] = g.id;
  });
  report.ok.forEach(row => {
    const res = addStudentRecord({ name: row.name, phone: row.phone, hemisId: row.hemisId, groupId: row.group ? gMap[row.group] : '', tg: row.tg, goal: row.goal }, { imp: true });
    if (res.ok) created.push(res);
  });
  save();
  const undo = { accIds: created.map(x => x.acc.id), studentIds: created.map(x => x.student.id), groupIds: newGroupIds, groupNames: newGroupNames };
  return { created, newGroups: newGroupIds.length, undo };
}
/* Noto'g'ri fayl yuklangan bo'lsa — import natijasini bir tugma bilan qaytarish.
   Faqat shu import yaratgan talaba/akkaunt/jamoa o'chadi; keyin qo'lda qo'shilganlar tegilmaydi. */
function undoImport(u) {
  if (!u) return { students: 0, groups: 0, accounts: 0 };
  const sids = new Set(u.studentIds || []);
  const accIds = new Set(u.accIds || []);
  const gids = new Set(u.groupIds || []);
  const before = { students: S.students.length, groups: S.groups.length, accounts: accounts().length };
  const names = new Set(S.students.filter(x => sids.has(x.id)).map(x => x.name));
  S.students = S.students.filter(x => !sids.has(x.id));
  (S.groups || []).forEach(g => { g.members = (g.members || []).filter(id => !sids.has(id)); });
  S.groups = S.groups.filter(g => !gids.has(g.id));
  accounts().forEach(a => { if (accIds.has(a.id)) delete a.imp; });
  S.accounts = accounts().filter(a => !accIds.has(a.id));
  if (S.session && accIds.has(S.session.acc)) S.session = null;
  sids.forEach(id => { ['friends', 'incoming', 'sent'].forEach(k => { if (S[k]) delete S[k][id]; }); if (S.notifs) delete S.notifs[id]; });
  if (Array.isArray(S.submissions)) S.submissions = S.submissions.filter(p => !sids.has(p.st));
  if (Array.isArray(S.activity)) S.activity = S.activity.filter(a => !names.has(a.who));
  pruneOrphans();
  save();
  return {
    students: before.students - S.students.length,
    groups: before.groups - S.groups.length,
    accounts: before.accounts - accounts().length
  };
}
function createStudentAccount(data) {
  const name = String(data.name || '').trim(), phone = String(data.phone || '').trim(), hemis = digitsOnly(data.hemisId);
  if (name.length < 3) return { err: 'name', msg: 'Ism-familiyani to‘liq kiriting.' };
  if (!validHemis(hemis)) return { err: 'hemis', msg: 'HEMIS ID 12 xonali raqam bo‘lishi kerak (masalan 123456789012).' };
  if (accByHemis(hemis)) return { err: 'hemis-dup', msg: 'Bu HEMIS ID allaqachon ro‘yxatda: ' + accByHemis(hemis).nick + '. Bitta HEMIS ID — bitta talaba.' };
  if (phone && accounts().some(a => a.phone && a.phone === phone)) return { err: 'phone-dup', msg: 'Bu telefon raqami boshqa akkauntda ishlatilgan.' };
  const acc = { id: 'acc-' + Math.random().toString(36).slice(2, 8), role: 'student', studentId: null, nick: genNick(), name, phone, hemisId: hemis, groupId: data.groupId || null, pass: null, mustSetPass: true, status: 'active', demo: false, created: todayISO(), lastLogin: null };
  accounts().push(acc); save();
  return { ok: true, acc };
}
function createAdminAccount(data) {
  const name = String(data.name || '').trim(), email = String(data.email || '').trim().toLowerCase();
  if (name.length < 3) return { err: 'name', msg: 'Ism-familiyani kiriting.' };
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return { err: 'email', msg: 'Email manzil noto‘g‘ri ko‘rinishda.' };
  if (accByEmail(email)) return { err: 'email-dup', msg: 'Bu email allaqachon band: ' + accByEmail(email).nick + '.' };
  let nick = String(data.nick || '').trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
  if (!nick) nick = genNick();
  if (nickTaken(nick)) return { err: 'nick-dup', msg: 'Bu nick band: ' + nick + '. Boshqasini tanlang.' };
  const role = ADMIN_ROLES[data.adRole] ? data.adRole : 'mentor';
  const perms = (data.perms && data.perms.length ? data.perms : ['students', 'tasks']).slice();
  const acc = { id: 'acc-' + Math.random().toString(36).slice(2, 8), role: 'admin', adminRole: role, perms, nick, name, email, phone: null, hemisId: null, pass: null, mustSetPass: true, status: 'active', demo: false, created: todayISO(), lastLogin: null };
  accounts().push(acc); save();
  return { ok: true, acc };
}
function setAccountPass(acc, pass) {
  if (!acc) return { err: 'no' };
  if (String(pass).length < 4) return { err: 'short', msg: 'Parol kamida 4 belgidan iborat bo‘lsin.' };
  acc.pass = hashPass(acc.nick, pass); acc.mustSetPass = false; acc.lastLogin = Date.now(); save();
  return { ok: true };
}
/* Kirish: login = nick | HEMIS ID (12 xona) | admin uchun email */
/* Kirish qidiruvi — rolga qarab:
   TALABA: faqat NICK bo'yicha (HEMIS ID kirishda ishlatilmaydi!).
   ADMIN/MENTOR: email (yoki nick) bo'yicha.
   HEMIS ID — admin ro'yxatga olishda kiritadigan identifikator: bitta HEMIS ID = bitta nick. */
function authLookup(login, role) {
  const raw = String(login || '').trim();
  if (!raw) return null;
  if (role === 'student') return accByNick(raw);
  return accByEmail(raw) || accByNick(raw);
}
/* Foydalanuvchi HEMIS ID kirityaptimi? (talaba kirishida bu — xato) */
const isHemisLike = v => digitsOnly(v).length === 12 && String(v).replace(/[\s-]/g, '') === digitsOnly(v);
function authCheck(login, pass, role) {
  const raw = String(login || '').trim();
  if (!raw) return { err: 'empty', msg: (role === 'student' ? 'Nickni' : 'Emailni') + ' kiriting.' };
  if (isHemisLike(raw)) return { err: 'hemis-login',
    msg: 'Talaba kirishi faqat NICK bilan. HEMIS ID ni klub adminiga topshiring — u akkaunt ochib, sizga nick beradi.' };
  const acc = authLookup(raw, role);
  if (!acc) return { err: 'notfound', msg: role === 'student'
    ? 'Bunday nick topilmadi. Nickni klub adminidan so‘rang (masalan: falcon).'
    : 'Bunday email topilmadi. Admin akkauntlari email bilan kiradi.' };
  if (acc.status === 'blocked') return { err: 'blocked', msg: 'Akkaunt bloklangan. Administratorga murojaat qiling.' };
  if (acc.mustSetPass) return { err: 'first', acc };
  if (acc.pass !== hashPass(acc.nick, pass)) return { err: 'pass', msg: 'Parol xato. Yana bir marta urinib ko‘ring.' };
  return { ok: true, acc };
}
function signIn(acc) {
  acc.lastLogin = Date.now();
  S.session = { acc: acc.id, at: Date.now() };
  S.role = acc.role;
  if (acc.role === 'student' && acc.studentId) S.user = acc.studentId;
  save();
}
const isFounder = () => { const a = meAcc(); return !!a && isFounderAcc(a); };
const isFounderAcc = a => !!a && a.role === 'admin' && (a.adminRole === 'founder' || (a.perms || []).includes('__all'));
/* Platformadagi founder akkaunti (imzo va aloqa ma'lumotlari uchun) */
const founderAcc = () => accounts().find(a => isFounderAcc(a)) || null;
/* Har bir admin bo'limi qaysi ruxsatni talab qiladi (null — hamma admin uchun ochiq) */
const ADMIN_SECTION_PERM = {
  admin: null, students: 'students', adminTasks: 'tasks', adminLessons: 'content',
  adminGroups: 'groups', adminDeadlines: 'tasks', stats: 'stats', settings: 'settings', adminAdmins: '__founder'
};
const PERM_LABEL = { students: 'Talabalar', tasks: 'Vazifalar', content: 'Kontent', groups: 'Jamoalar', stats: 'Statistika', settings: 'Sozlamalar', admins: 'Adminlar' };
/* Bo'limni ko'rish huquqi */
function canView(route) {
  const a = meAcc();
  if (!a) return true;                                  /* sessiyasiz: birinchi ishga tushirish / kirish ekrani */
  if (a.role !== 'admin') return !ADMIN_ONLY_ROUTES.includes(route);
  const need = ADMIN_SECTION_PERM[route];
  if (!need) return true;
  if (need === '__founder') return isFounder();
  return canPerm(need);
}
const ADMIN_ONLY_ROUTES = ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings', 'adminAdmins'];
/* Amal (tugma/forma) uchun ruxsat: true bo'lsa — ruxsat bor */
function actionAllowed(perm) {
  const a = meAcc();
  if (!a || a.role !== 'admin') return true;            /* talaba uchun bu amallar baribir yopiq */
  return canPerm(perm);
}
function permDenied(perm) {
  toast('warn', 'Ruxsat yo‘q', '«' + (PERM_LABEL[perm] || perm) + '» bo‘limi uchun huquqingiz yo‘q. Founder yoki bosh mentorga murojaat qiling.');
}
/* Parolni almashtirish oynasi (har qanday rol) */
function passChangeModal() {
  const a = meAcc();
  openModal(mhead('Parolni almashtirish', a ? '@' + a.nick : 'Sessiya yo‘q') +
    '<form data-form="pass-change" class="col" style="gap:13px">' +
    (a && a.pass ? '<div class="field"><label>Hozirgi parol</label><div class="pwrap"><input class="inp" type="password" name="old" required autocomplete="current-password"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' : '') +
    '<div class="field"><label>Yangi parol</label><div class="pwrap"><input class="inp" type="password" name="p1" minlength="4" required autocomplete="new-password" placeholder="Kamida 4 belgi"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
    '<div class="field"><label>Yangi parolni takrorlang</label><div class="pwrap"><input class="inp" type="password" name="p2" minlength="4" required autocomplete="new-password"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
    '<button class="btn btn-primary btn-block" type="submit">' + ico('check', 'sm') + 'Saqlash</button>' +
    '<div class="inp-hint">Parolni hech kimga aytmang — klub adminlari ham uni ko‘ra olmaydi.</div>' +
    '</form>', 'narrow');
}
/* Parolni noldan tiklash (admin amali): keyingi kirishda talaba yangi parol o‘rnatadi */
function passReset(accId) {
  const a = accById(accId);
  if (!a) return false;
  a.pass = null; a.mustSetPass = true; save();
  return true;
}
const canPerm = p => { const a = meAcc(); if (!a || a.role !== 'admin') return false; return a.adminRole === 'founder' || (a.perms || []).includes('__all') || (a.perms || []).includes(p); };
function logoutAcc() { S.session = null; save(); UI.authShow = true; UI.firstPass = null; closeModal(); paint(); }

/* ---------- 8. Kunlik topshiriqlar (gamification) ---------- */
const QUESTS = [
  { id: 'q1', t: 'Bugungi darsni tugatish', s: '10–15 daqiqalik bitta dars', xp: 30, i: 'book' },
  { id: 'q2', t: 'Jamoa yoki do‘stga yordam', s: 'Devorga yozing yoki savolga javob bering', xp: 20, i: 'heart' },
  { id: 'q3', t: 'Vazifa ustida 20 daqiqa', s: 'Loyihangizni bir qadam oldinga suring', xp: 25, i: 'rocket' }
];
function ensureQuests(st) {
  if (!S.quests) S.quests = {};
  const q = S.quests[st.id];
  if (!q || q.d !== todayISO()) S.quests[st.id] = { d: todayISO(), done: [] };
  return S.quests[st.id];
}
function addXp(st, xp, coins, questCode) { return awardXP(st, xp, coins, questCode); }
/* XP berish + kunlik topshiriqni avtomatik bajarish */
function awardXP(st, xp, coins, questCode) {
  st.xp += xp; st.coins += (coins || 0);
  let bonus = 0;
  if (questCode && QUESTS.some(q => q.id === questCode)) {
    const q = ensureQuests(st);
    if (!q.done.includes(questCode)) { q.done.push(questCode); bonus = (QUESTS.find(z => z.id === questCode) || {}).xp || 0; st.xp += bonus; }
  }
  if (st.id === (me() || {}).id) toast('ok', '+' + (xp + bonus) + ' XP', bonus ? 'Kunlik topshiriq ham bajarildi (+' + bonus + ').' : 'Hisobingizga qo‘shildi.');
  return xp + bonus;
}

/* ---------- 9. Modallar (talaba) ---------- */
function lessonModal(l) {
  const t = TYPES[l.type] || TYPES.video;
  const st = me();
  const done = st.done.includes(l.id);
  const m = modOf(l.m);
  openModal(
    mhead(l.t, m.n + '-modul • ' + t.l + ' • ' + l.dur + ' daqiqa') +
    '<div class="player"><div class="ptn"></div><button class="pbtn" data-act="play-mock">' + ico('play', 'lg') + '</button>' +
    '<span class="tag p" style="position:absolute;top:12px;left:12px">' + esc(t.l) + '</span>' +
    '<span class="tag c" style="position:absolute;top:12px;right:12px">' + l.dur + ' daq</span></div>' +
    '<div class="card soft" style="margin-top:14px"><div class="up muted" style="margin-bottom:6px">Dars haqida</div>' +
    '<p style="margin:0" class="t2">' + esc(l.brief) + '</p>' +
    '<div class="divider"></div><div class="col" style="gap:8px">' +
    [['target', 'Dars oxirida buni qila olasiz'], ['bolt', 'Amaliy topshiriq: ' + (l.type === 'practice' ? 'to‘liq bajarish shart' : 'qisqa mashq')], ['link', 'Qo‘shimcha materiallar dars ichida']]
      .map(x => '<div class="row small t2">' + ico(x[0], 'sm') + esc(x[1]) + '</div>').join('') +
    '</div></div>' +
    (QUIZZES[l.id] ? '<div class="card" style="margin-top:14px"><div class="card-h"><h2 class="h2">' + ico('help') + 'Qisqa tekshiruv</h2>' +
      '<span class="tag ' + ((S.quizDone[st.id] || []).includes(l.id) ? 'g' : 'c') + '">' + ((S.quizDone[st.id] || []).includes(l.id) ? 'topshirilgan' : '3 savol • +15 XP') + '</span></div>' +
      '<div class="col" style="gap:12px">' + QUIZZES[l.id].map((q, qi) => '<div><div class="small" style="font-weight:750;margin-bottom:7px">' + (qi + 1) + '. ' + esc(q.q) + '</div>' +
        '<div class="col" style="gap:6px">' + q.o.map((o, oi) => '<label class="row small t2" style="gap:9px;cursor:pointer"><input type="radio" name="q' + qi + '" value="' + oi + '" style="accent-color:#7C5CFF;width:16px;height:16px">' + esc(o) + '</label>').join('') + '</div></div>').join('') + '</div>' +
      '<button class="btn btn-soft btn-sm btn-block" style="margin-top:12px" data-act="quiz-submit" data-id="' + l.id + '">' + ico('check-c', 'sm') + 'Javoblarni tekshirish</button></div>' : '') +
    '<div class="row" style="margin-top:14px;gap:10px">' +
    (done ? '<button class="btn btn-soft grow" disabled>' + ico('check-c', 'sm') + 'Tugatilgan</button>'
      : '<button class="btn btn-primary grow" data-act="lesson-done" data-id="' + l.id + '">' + ico('check', 'sm') + 'Tugatdim (+20 XP)</button>') +
    '<button class="btn btn-ghost" data-act="close-modal">Keyinroq</button></div>', 'wide');
}
function submitModal(task) {
  const st = me();
  const prev = subOf(st, task.id);
  openModal(
    mhead('Vazifani topshirish', task.title) +
    '<form data-form="submit" data-task="' + task.id + '" class="col" style="gap:13px">' +
    '<div class="field"><label>Loyiha havolasi (GitHub / Vercel / Notion)</label>' +
    '<input class="inp" name="link" required placeholder="https://github.com/username/loyiha" value="' + esc(prev && prev.status !== 'accepted' ? prev.link : '') + '"></div>' +
    '<div class="field"><label>Fayl (ixtiyoriy)</label><input class="inp" type="file" name="file"><div class="inp-hint">PDF, ZIP yoki PNG — 25 MB gacha</div></div>' +
    '<div class="field"><label>Qisqa izoh</label><textarea class="inp" name="note" placeholder="Nima qildim, nimada qiynaldim, nimaga yordam kerak…">' + esc(prev && prev.status !== 'accepted' ? prev.note : '') + '</textarea></div>' +
    '<div class="card soft tight small t2" style="display:flex;gap:10px">' + ico('clock', 'sm') + '<div>Deadline: <b>' + fmtFull(dueOf(st, task)) + '</b> • ' + tlPill(timeLeft(dueOf(st, task))) + '</div></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('send', 'sm') + 'Yuborish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}
function subViewModal(p) {
  const t = taskOf(p.task), st = get(S.students, p.st);
  const adm = isAdmin();
  openModal(
    mhead(t.title, (adm ? st.name + ' • ' : '') + fmtFull(p.at) + ' topshirildi') +
    '<div class="row wrap" style="gap:8px;margin-bottom:12px">' + stChip(p.status) +
    (p.score != null ? '<span class="tag a">' + ico('star', 'sm') + p.score + '/100</span>' : '') +
    '<span class="tag c">' + ico('clock', 'sm') + 'Deadline: ' + fmtFull(dueOf(st, t)) + '</span></div>' +
    (p.note ? '<div class="card soft"><div class="up muted" style="margin-bottom:6px">Talaba izohi</div><p style="margin:0" class="t2">' + esc(p.note) + '</p></div>' : '') +
    '<div class="card soft" style="margin-top:12px"><div class="up muted" style="margin-bottom:6px">Havola</div>' +
    '<a class="row small" style="gap:8px;word-break:break-all" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + ico('link', 'sm') + esc(p.link) + '</a></div>' +
    (p.file ? '<div class="card soft tight" style="margin-top:10px"><div class="row between" style="gap:10px"><div class="row" style="gap:9px;min-width:0">' + ico('upload', 'sm') +
      '<span class="small ellip">' + esc(p.file) + '</span></div>' +
      (p.fileData ? '<button class="btn btn-xs btn-soft" data-act="open-file" data-sub="' + p.id + '">' + ico('download', 'sm') + 'Yuklab olish</button>'
        : '<span class="xs muted">faqat nom saqlangan</span>') + '</div></div>' : '') +
    (p.fb ? '<div class="card soft" style="margin-top:12px;border-color:rgba(124,92,255,.3)"><div class="up muted" style="margin-bottom:6px">Mentor izohi</div><p style="margin:0" class="t2">' + esc(p.fb) + '</p>' +
      (p.rev ? '<div class="xs muted" style="margin-top:8px">— ' + esc(p.rev) + '</div>' : '') + '</div>' : '') +
    (adm && p.status === 'in_review' ? '<hr class="hr"><form data-form="review" data-sub="' + p.id + '" class="col" style="gap:12px">' +
      '<div class="row" style="gap:12px"><div class="field grow"><label>Baho (0–100)</label><input class="inp" name="score" type="number" min="0" max="100" value="85" required></div>' +
      '<div class="field grow"><label>Qaror</label><select class="inp" name="status"><option value="accepted">Qabul qilish</option><option value="revise">Qayta ishlashga</option><option value="late">Kechikkan deb belgilash</option></select></div></div>' +
      '<div class="field"><label>Izoh</label><textarea class="inp" name="fb" placeholder="Kuchli tomonlar, yaxshilash kerak bo‘lgan joylar…"></textarea></div>' +
      '<button class="btn btn-primary" type="submit">' + ico('check-c', 'sm') + 'Bahoni saqlash</button></form>'
      : adm ? '<hr class="hr"><div class="row" style="gap:10px"><button class="btn btn-soft grow" data-act="review-edit" data-sub="' + p.id + '">' + ico('edit', 'sm') + 'Bahoni tahrirlash</button>' +
        '<button class="btn btn-ghost" data-act="nudge" data-id="' + st.id + '">' + ico('bell', 'sm') + 'Eslatma</button></div>' : ''),
    'wide');
}
function teamModal(g) {
  const m = mentorOf(g.mentor);
  const task = S.tasks.find(t => { const s = S.submissions.find(p => p.task === t.id && g.members.includes(p.st)); return !!s; })
    || projTasks()[0] || (S.tasks.length ? S.tasks[S.tasks.length - 1] : null);
  openModal(
    mhead(g.name + ' jamoasi', g.project) +
    '<div class="row wrap" style="gap:8px;margin-bottom:12px"><span class="tag p">' + ico('trophy', 'sm') + 'Reyting #' + teamRank(g.id) + '</span>' +
    '<span class="tag a">' + ico('bolt', 'sm') + nf(g.xp) + ' XP</span>' +
    (m ? '<span class="tag c">' + ico('user', 'sm') + esc(m.name) + '</span>' : '') + '</div>' +
    '<div class="grid g3" style="margin-bottom:12px">' + g.members.map(id => { const st = get(S.students, id); return '<div class="card tight soft"><div class="row">' + avatar(st, 'sm') + '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(st.name) + '</div><div class="xs muted">' + nf(st.xp) + ' XP • ' + (onl(st) ? 'onlayn' : st.last + ' kun oldin') + '</div></div></div></div>'; }).join('') + '</div>' +
    '<div class="card soft"><div class="up muted" style="margin-bottom:8px">Jamoaviy loyiha holati</div>' +
    '<div class="h3">' + esc(task ? task.title : 'Jamoaviy vazifa hali berilmagan') + '</div>' +
    '<div class="small muted" style="margin:4px 0 10px">' + (task ? 'Deadline: ' + fmtFull(g.dl[task.id] || task.dl) : 'Deadline vazifa bilan birga belgilanadi') + '</div>' +
    '<div class="col" style="gap:9px">' + g.members.map(id => { const st = get(S.students, id); const p = task ? subOf(st, task.id) : null; const s = p ? STATUS[p.status] : STATUS.none; return '<div class="row small"><span class="grow ellip">' + esc(st.name) + '</span><span class="tag ' + (p && p.status === 'accepted' ? 'g' : '') + '">' + ico('user', 'sm') + esc(s.l) + '</span></div>'; }).join('') + '</div></div>' +
    '<div class="row" style="margin-top:14px"><button class="btn btn-primary grow" data-act="go-team">' + ico('users', 'sm') + 'Jamoa sahifasiga o‘tish</button></div>', 'wide');
}
function teamSubmitModal(task) {
  const st = me(), g = myGroup(st);
  if (!g) { toast('warn', 'Jamoa yo‘q', 'Jamoaviy topshiriq uchun avval jamoaga qo‘shilishingiz kerak.'); return; }
  openModal(mhead('Jamoaviy topshirish', g.name + ' jamoasi • ' + task.title) +
    '<form data-form="team-submit" data-task="' + task.id + '" class="col" style="gap:13px">' +
    '<div class="field"><label>Jamoaviy havola (repo / jonli loyiha)</label>' +
    '<input class="inp" name="link" required placeholder="https://github.com/jamoa/loyiha" value="' + esc((subOf(st, task.id) || {}).link || '') + '"></div>' +
    '<div class="field"><label>Jamoaviy izoh</label><textarea class="inp" name="note" placeholder="Kim nima qildi, loyiha hozirgi holati, demo havolasi…"></textarea></div>' +
    '<div class="card soft tight"><div class="up muted" style="margin-bottom:7px">Topshiriq quyidagilar nomidan yuboriladi</div>' +
    '<div class="row wrap" style="gap:6px">' + g.members.map(id => '<span class="tag c">' + esc(get(S.students, id).name) + '</span>').join('') + '</div>' +
    '<div class="xs muted" style="margin-top:8px">Mentor bitta ishni tekshirib, butun jamoaga baho qo‘yadi.</div></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('upload', 'sm') + 'Jamoaviy yuborish (+50 XP)</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}
function certModal(c) {
  const st = me();
  openModal(
    mhead('Sertifikat', 'Modul ' + c.m.n + ' • ' + fmtFull(c.date)) +
    '<div class="cert" id="cert-print"><svg class="watermark" viewBox="0 0 64 64"><path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" fill="none" stroke="#7C5CFF" stroke-width="2.6"/><path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="#22D3EE" stroke-width="4"/><path d="M25.6 37.6h12.8" stroke="#C6FF4F" stroke-width="4"/></svg>' +
    '<div class="wl">AI Leaders • Startup Club</div>' +
    '<div class="small" style="color:#A9BCE8;margin-top:10px">Bu hujjat quyidagi shaxsga beriladi</div>' +
    '<div class="nm">' + esc(st.name) + '</div>' +
    '<div class="small" style="color:#B6C6EE">“' + esc(c.m.title) + '” modulini to‘liq tamomlaganligi uchun</div>' +
    '<div class="row between" style="margin-top:26px;align-items:flex-end;gap:14px">' +
    '<div><div class="small" style="color:#C9D6F5">O‘quv dasturi: AI Leaders 2026</div>' +
    '<div class="xs" style="color:#8FA5D8;margin-top:2px">Kod: ' + esc(c.code) + '</div></div>' +
    '<div class="qr">' + Array.from({ length: 36 }).map((_, i) => (i % 3 === 0 || i % 7 === 0 || i < 6) ? '<i></i>' : '<i style="opacity:.15"></i>').join('') + '</div></div>' +
    '<div class="row between" style="margin-top:18px"><div class="sig">' + esc(founderAcc() ? founderAcc().name : 'AI Leaders') + '<br>Founder, AI Leaders</div>' +
    '<div class="sig">' + esc(S.mentors[0] ? S.mentors[0].name : 'Mentorlar kengashi') + '<br>Bosh mentor</div>' +
    '<div class="sig">' + fmtFull(c.date) + '</div></div></div>' +
    '<div class="row" style="margin-top:14px;gap:10px"><button class="btn btn-primary grow" data-act="print">' + ico('print', 'sm') + 'Chop etish / PDF</button>' +
    '<button class="btn btn-soft" data-act="toast-copy" data-code="' + esc(c.code) + '">' + ico('copy', 'sm') + 'Kodni nusxalash</button></div>', 'wide');
}
function galleryModal(item) {
  openModal(
    mhead(item.t, item.kind + ' • ' + item.desc) +
    '<div class="thumb ' + item.k + '" style="border-radius:14px;border:1px solid var(--line);aspect-ratio:16/9;position:relative;display:flex;align-items:center;justify-content:center">' +
    '<div class="mock" style="position:absolute;inset:14% 12% 0;background:rgba(6,10,22,.72);border:1px solid rgba(255,255,255,.14);border-radius:12px 12px 0 0;padding:10px;display:flex;flex-direction:column;gap:6px">' +
    '<i style="height:8px;border-radius:4px;background:rgba(255,255,255,.24);width:58%;display:block"></i>' +
    '<i style="height:6px;border-radius:4px;background:rgba(255,255,255,.18);width:84%;display:block"></i>' +
    '<i style="height:6px;border-radius:4px;background:rgba(255,255,255,.18);width:42%;display:block"></i>' +
    '<i style="height:26px;border-radius:6px;background:rgba(198,255,79,.35);width:38%;display:block;margin-top:auto"></i></div></div>' +
    '<div class="row wrap" style="gap:8px;margin-top:12px"><span class="tag a">' + ico('star', 'sm') + 'Hafta tanlovi</span><span class="tag c">' + ico('bolt', 'sm') + '2 haftada qurilgan</span></div>' +
    '<div class="row" style="margin-top:14px;gap:10px"><a class="btn btn-primary grow" href="' + esc(item.link) + '" target="_blank" rel="noopener">' + ico('globe', 'sm') + 'Jonli ko‘rish</a>' +
    '<button class="btn btn-soft" data-act="cheer">' + ico('heart', 'sm') + 'Qo‘llab-quvvatlash</button></div>', 'wide');
}
function notifModal() {
  const st = isAdmin() ? null : me();
  const list = st ? notifOf(st) : S.activity.map(a => ({ t: a.what, x: a.who + ' • ' + a.at, ic: 'spark', un: false }));
  notifOf(st || {}).forEach(n => n.un = false);
  openModal(
    mhead('Bildirishnomalar', st ? unreadOf(st) + ' yangi xabar' : 'Admin uchun so‘nggi harakatlar') +
    '<div class="col" style="gap:9px">' + (list.length ? list.map(n => '<div class="lrow"><div class="lead">' + ico(n.ic || 'bell') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(n.t) + '</div><div class="xs muted">' + esc(n.x) + '</div></div>' + (n.un ? '<span class="tag p">yangi</span>' : '') + '</div>').join('') : '<div class="empty">Xabar yo‘q</div>') + '</div>');
  save();
}
