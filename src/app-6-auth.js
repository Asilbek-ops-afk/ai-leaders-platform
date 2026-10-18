/* ==========================================================================
   AI LEADERS — O'Z-O'ZINI RO'YXATDAN O'TKAZISH + GMAIL XABARLARI (v2.9.0)
   Talaba veb-saytning o'zidan to'liq ma'lumot kiritib ro'yxatdan o'tadi:
     1) shaxsiy ma'lumot  2) telefon + email  3) yo'nalish va maqsad
     4) parol  5) emailga kelgan 6 xonali kod  6) avtomatik unikal NICK
   Barcha xabarlar (tasdiqlash, ariza holati, parolni tiklash, profil o'zgarishi) Gmail'ga server orqali boradi.
   Parolni tiklash: nick / email / telefon bilan qidirish → Gmail kodi → yangi parol.
   Admin panelida «Arizalar» bo'limi: tasdiqlash, rad etish, xabarlar jurnali.
   ========================================================================== */

/* ---------- 1. Konfiguratsiya ---------- */
const REG_STEPS = [
  { n: 1, t: 'Shaxsiy', s: 'Ism, tug‘ilgan sana va shahar' },
  { n: 2, t: 'Aloqa', s: 'Telefon va email — barcha xabarlar shu yerga boradi' },
  { n: 3, t: 'Yo‘nalish', s: 'Nima o‘rganmoqchisiz va maqsadingiz nima' },
  { n: 4, t: 'Parol', s: 'Kirish uchun parol va foydalanish shartlari' },
  { n: 5, t: 'Tasdiqlash', s: 'Emailga kelgan 6 xonali kodni kiriting' }
];
const REG_DIRS = [
  { v: 'dasturlash', l: 'Dasturlash', i: 'code' },
  { v: 'dizayn', l: 'Dizayn va UX', i: 'spark' },
  { v: 'ai', l: 'AI va ma’lumot', i: 'ai' },
  { v: 'marketing', l: 'Marketing', i: 'trend' },
  { v: 'startap', l: 'Startap / biznes', i: 'rocket' },
  { v: 'boshqa', l: 'Hali aniqlamadim', i: 'help' }
];
const REG_LEVELS = [
  { v: 'yangi', l: '0 dan boshlayman' },
  { v: 'asos', l: 'Asoslarim bor' },
  { v: 'tajriba', l: 'Tajribam bor' }
];
const REG_SOURCES = ['Instagram', 'Telegram', 'Do‘stlar / tanishlar', 'Google qidiruv', 'Tadbir yoki dars', 'Boshqa'];
const REG_CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg‘ona', 'Nukus', 'Urganch', 'Qarshi', 'Jizzax', 'Termiz', 'Navoiy', 'Boshqa shahar'];
const REG_ADJ = ['swift', 'brave', 'calm', 'bright', 'keen', 'bold', 'quiet', 'noble', 'vivid', 'clever', 'gentle', 'cosmic',
  'solar', 'lunar', 'alpine', 'rapid', 'silent', 'golden', 'iron', 'neon', 'amber', 'polar', 'misty', 'candid', 'eager'];
const REG_STATUS = {
  new: { l: 'Yangi ariza', t: 'o' },
  approved: { l: 'Tasdiqlangan', t: 'g' },
  rejected: { l: 'Rad etilgan', t: 'r' }
};

/* ---------- 2. Email qatlami — serverdagi haqiqiy yuborish ---------- */
/* API kaliti va jo'natuvchi manzil frontendga chiqmaydi. Cloudflare Pages worker
   /api/email orqali Resend'ga yuboradi; bu yerda faqat qabul qiluvchi va matn bor. */
function mailCfg() {
  if (!S.settings) S.settings = {};
  if (!S.settings.mail || typeof S.settings.mail !== 'object') S.settings.mail = { mode: 'server', testEmail: '' };
  const m = S.settings.mail;
  /* v2.8'dagi demo/FormSubmit qiymatlari bilan mos migratsiya */
  if (!m.testEmail && m.email) m.testEmail = String(m.email).trim();
  m.mode = 'server';
  m.testEmail = String(m.testEmail || '').trim().toLowerCase();
  return m;
}
function mailIsDemo() { return false; }
function mailLog() { if (!Array.isArray(S.mail)) S.mail = []; return S.mail; }
function emailOk(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(String(v || '').trim()); }
function mailStatusLabel(status) {
  return ({ queued: 'navbatda', sent: 'yuborildi', setup: 'sozlanmagan', failed: 'xato' })[status] || status || 'navbatda';
}
/* Xabar avval jurnalga yoziladi, keyin faqat o'z Pages serverimizga yuboriladi.
   `sent` — Resend API qabul qilganini bildiradi; email inboxga tushishi bir necha soniya olishi mumkin. */
function sendMail(kind, to, subject, body, code) {
  const target = String(to || '').trim().toLowerCase();
  const item = { id: uid('m'), at: Date.now(), kind: kind || 'info', to: target, subject: String(subject || ''),
    body: String(body || ''), code: code || '', status: emailOk(target) ? 'queued' : 'failed', detail: '' };
  mailLog().unshift(item);
  if (S.mail.length > 40) S.mail.length = 40;
  save();
  if (!emailOk(target)) { item.detail = 'Email manzil noto‘g‘ri'; save(); return item; }
  if (typeof fetch !== 'function') return item;
  try {
    fetch('/api/email', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: item.kind, to: item.to, subject: item.subject, text: item.body })
    }).then(async r => {
      let data = {};
      try { data = await r.json(); } catch (e) { }
      if (r && r.ok && data && data.ok) {
        item.status = 'sent'; item.detail = data.id ? 'provider:' + data.id : '';
      } else {
        item.status = data && data.error === 'not_configured' ? 'setup' : 'failed';
        item.detail = (data && data.error) || ('HTTP ' + (r ? r.status : 0));
        if (typeof toast === 'function') {
          const setup = item.status === 'setup';
          toast('warn', setup ? 'Email server hali sozlanmagan' : 'Email yuborilmadi',
            setup ? 'Admin: Resend kaliti va jo‘natuvchi manzilini Cloudflare Pages secrets’da qo‘shing.' : 'Internet yoki email server sozlamasini tekshiring.');
        }
      }
      save();
    }).catch(() => {
      item.status = 'failed'; item.detail = 'network_error'; save();
      if (typeof toast === 'function') toast('warn', 'Email yuborilmadi', 'Internet yoki email serverini tekshiring.');
    });
  } catch (e) { item.status = 'failed'; item.detail = 'request_error'; save(); }
  return item;
}
function mailTest() {
  const cfg = mailCfg(), to = cfg.testEmail;
  if (!emailOk(to)) return { ok: false, msg: 'Avval sinov uchun Gmail manzilini kiriting.' };
  const item = sendMail('test', to, 'AI Leaders — sinov xabari',
    'Bu AI Leaders Startup Club email serverining sinov xabari. Uni ko‘rsangiz, Gmail xabarlari ishlayapti.');
  return { ok: true, to, item };
}

/* ---------- 3. Yordamchi ---------- */
function normPhone(v) { const d = digitsOnly(v); return d.length === 9 ? '998' + d : d; }
function regList() { if (!Array.isArray(S.registrations)) S.registrations = []; return S.registrations; }
function regOf(id) { return regList().find(r => r.id === id) || null; }
function regPendingCount() { return regList().filter(r => r.verified && r.status === 'new').length; }
/* Talaba profili uchun akkaunt (o'zi ro'yxatdan o'tganini ko'rsatish uchun) */
function accOfSt(st) { return accounts().find(a => a.studentId === (st && st.id)) || null; }
function accSelfCount() { return accounts().filter(a => a.self).length; }
function nickReserved(n) { return nickTaken(n) || regList().some(r => r.nick === n && r.status !== 'rejected'); }
/* Ikki so'zli, talaffuz qilinadigan unikal nick — masalan: swift_falcon */
function genPairNick() {
  const nouns = NICK_WORDS.filter(w => !/\d/.test(w));
  for (let i = 0; i < 80; i++) {
    const n = REG_ADJ[Math.floor(Math.random() * REG_ADJ.length)] + '_' + nouns[Math.floor(Math.random() * nouns.length)];
    if (!nickReserved(n)) return n;
  }
  return genNick();
}
function makeCode() { return String(Math.floor(100000 + Math.random() * 900000)); }
/* Ro'yxatdan o'tish avtomatik tasdiqlanadimi (standart: ha — talaba darhol kiradi) */
function autoApproveOn() { return !(S.settings && S.settings.autoApprove === false); }
function ageOf(iso) { const d = new Date(iso + 'T12:00:00'); if (isNaN(d)) return -1; const t = new Date(); let a = t.getFullYear() - d.getFullYear(); const m = t.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--; return a; }
function dirLabel(v) { return (REG_DIRS.find(x => x.v === v) || { l: v || '—' }).l; }
function levelLabel(v) { return (REG_LEVELS.find(x => x.v === v) || { l: v || '—' }).l; }
function maskEmail(e) { const s = String(e || ''); const i = s.indexOf('@'); return i > 1 ? s.slice(0, 2) + '•••' + s.slice(i - 1) : s; }
function maskPhone(p) { const d = digitsOnly(p); return d.length > 6 ? '+' + d.slice(0, 3) + ' ••• ' + d.slice(-2) : p; }

/* ---------- 4. Tekshirish (har qadam alohida) ---------- */
function regValidate(d, step) {
  d = d || {};
  const s = String;
  const nameOk = /^[A-Za-zА-Яа-яЁё\u2018\u2019'`\-\s]{2,40}$/.test(s(d.name || '').trim());
  const surOk = /^[A-Za-zА-Яа-яЁё\u2018\u2019'`\-\s]{2,40}$/.test(s(d.surname || '').trim());
  const stepErr = (n, msg) => ({ ok: false, step: n, msg });
  /* 1-qadam */
  if (step >= 1) {
    if (!nameOk) return stepErr(1, 'Ismni kiriting (kamida 2 harf, faqat harflar).');
    if (!surOk) return stepErr(1, 'Familiyani kiriting (kamida 2 harf).');
    const age = ageOf(s(d.birth || ''));
    if (age < 0) return stepErr(1, 'Tug‘ilgan sanani tanlang.');
    if (age < 12) return stepErr(1, 'Ro‘yxatdan o‘tish uchun kamida 12 yosh bo‘lishi kerak.');
    if (age > 80) return stepErr(1, 'Tug‘ilgan sanani tekshirib ko‘ring.');
    if (['erkak', 'ayol'].indexOf(d.gender) === -1) return stepErr(1, 'Jinsni tanlang.');
    if (REG_CITIES.indexOf(d.city) === -1) return stepErr(1, 'Shaharni tanlang.');
  }
  /* 2-qadam */
  if (step >= 2) {
    const ph = digitsOnly(d.phone);
    if (!(ph.length === 9 || (ph.length === 12 && ph.slice(0, 3) === '998'))) return stepErr(2, 'Telefon raqamni to‘liq kiriting: +998 90 123 45 67.');
    const em = s(d.email || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(em)) return stepErr(2, 'Email manzil noto‘g‘ri ko‘rinishda (masalan ism@gmail.com).');
    if (accByEmail(em) || regList().some(r => r.email === em && r.status !== 'rejected')) return stepErr(2, 'Bu email allaqachon ro‘yxatdan o‘tgan. Parolni tiklashdan foydalaning.');
    const p12 = normPhone(ph);
    if (accounts().some(a => a.phone && digitsOnly(a.phone) === p12) || regList().some(r => normPhone(r.phone) === p12 && r.status !== 'rejected'))
      return stepErr(2, 'Bu telefon raqam bilan ariza allaqachon mavjud.');
    const hem = digitsOnly(d.hemis);
    if (hem && !validHemis(hem)) return stepErr(2, 'HEMIS ID 12 xonali bo‘lishi kerak (yoki bo‘sh qoldiring).');
    if (hem && accByHemis(hem)) return stepErr(2, 'Bu HEMIS ID band: ' + accByHemis(hem).nick);
  }
  /* 3-qadam */
  if (step >= 3) {
    if (!REG_DIRS.some(x => x.v === d.direction)) return stepErr(3, 'Yo‘nalishni tanlang.');
    if (!REG_LEVELS.some(x => x.v === d.level)) return stepErr(3, 'Tajriba darajasini tanlang.');
    if (s(d.goal || '').trim().length < 12) return stepErr(3, 'Maqsadingizni kamida bir gap bilan yozing (12+ belgi).');
    if (REG_SOURCES.indexOf(d.source) === -1) return stepErr(3, 'Bizni qayerdan eshitganingizni tanlang.');
  }
  /* 4-qadam */
  if (step >= 4) {
    const p = s(d.pass || '');
    if (p.length < 6) return stepErr(4, 'Parol kamida 6 belgidan iborat bo‘lishi kerak.');
    if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return stepErr(4, 'Parolda kamida bitta harf va bitta raqam bo‘lsin.');
    if (p !== s(d.pass2 || '')) return stepErr(4, 'Parollar mos kelmadi — qayta yozing.');
    if (d.terms !== 'on' && d.terms !== true) return stepErr(4, 'Foydalanish shartlariga rozilik belgilanishi kerak.');
  }
  return { ok: true };
}
function passStrength(p) {
  const s = String(p || '');
  let k = 0;
  if (s.length >= 6) k++;
  if (s.length >= 10) k++;
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) k++;
  if (/\d/.test(s) && /[^A-Za-z0-9]/.test(s)) k++;
  return Math.min(4, k);
}

/* ---------- 5. Ro'yxatdan o'tkazish oqimi (mantiq) ---------- */
function regStart(d) {
  const v = regValidate(d, 4);
  if (!v.ok) return v;
  const reg = {
    id: uid('reg'), at: Date.now(), status: 'new', verified: false,
    name: String(d.name).trim(), surname: String(d.surname).trim(), birth: d.birth, gender: d.gender, city: d.city,
    phone: normPhone(d.phone), email: String(d.email).trim().toLowerCase(), telegram: String(d.tg || '').trim(),
    hemis: digitsOnly(d.hemis) || '', direction: d.direction, level: d.level, goal: String(d.goal).trim(),
    source: d.source, pass: String(d.pass), nick: genPairNick(), code: makeCode(), exp: Date.now() + 10 * 60 * 1000,
    accId: null, decidedAt: null, decidedBy: null, reason: ''
  };
  regList().unshift(reg);
  if (S.registrations.length > 120) S.registrations.length = 120;
  sendMail('reg-code', reg.email, 'AI Leaders — tasdiqlash kodi',
    'Salom, ' + reg.name + '!\n\nRo‘yxatdan o‘tishni yakunlash uchun kod: ' + reg.code +
    '\nKod 10 daqiqa amal qiladi.\n\nSizga beriladigan nick: ' + reg.nick + '\n\nAI Leaders Startup Club', reg.code);
  save();
  return { ok: true, reg };
}
function regVerify(regId, code) {
  const r = regOf(regId);
  if (!r) return { err: 'notfound', msg: 'Ariza topilmadi — ro‘yxatdan o‘tishni qaytadan boshlang.' };
  if (r.verified) return { ok: true, reg: r, acc: accById(r.accId) };
  if (!r.code || Date.now() > r.exp) return { err: 'expired', msg: 'Kod muddati tugagan. «Kodni qayta yuborish» tugmasini bosing.' };
  if (digitsOnly(code) !== String(r.code)) return { err: 'code', msg: 'Kod xato. Emailga kelgan 6 xonali kodni kiriting.' };
  const nick = r.nick || genPairNick();
  const acc = {
    id: 'acc-' + Math.random().toString(36).slice(2, 8), role: 'student', studentId: null, nick,
    name: r.name + ' ' + r.surname, phone: r.phone, email: r.email, hemisId: r.hemis || null,
    birth: r.birth, city: r.city, direction: r.direction, groupId: null,
    pass: hashPass(nick, r.pass), mustSetPass: false,
    status: autoApproveOn() ? 'active' : 'pending',
    self: true, created: todayISO(), lastLogin: null
  };
  accounts().push(acc);
  r.accId = acc.id; r.verified = true; r.pass = ''; r.code = ''; r.exp = 0;
  if (acc.status === 'active') {
    makeStudentForReg(r, acc);
    r.status = 'approved'; r.decidedAt = Date.now(); r.decidedBy = 'Avtomatik tasdiqlash';
    sendMail('approved', r.email, 'Arizangiz tasdiqlandi — nick: ' + nick,
      'Tabriklaymiz, ' + r.name + '!\n\nArizangiz tasdiqlandi.\n\nSizning nick: ' + nick + '\nParol: ro‘yxatdan o‘tishda o‘zingiz o‘rnatgan parol.\n\nKirish: AI Leaders → «Kirish» → Talaba.');
  } else {
    sendMail('welcome', r.email, 'Ariza qabul qilindi — nick: ' + nick,
      'Rahmat, ' + r.name + '!\n\nArizangiz qabul qilindi va ko‘rib chiqilmoqda.\nSizning nick: ' + nick +
      '\n\nAdmin tasdiqlagach, shu manzilga xabar keladi. Shundan keyin nick va parolingiz bilan kirishingiz mumkin.');
  }
  save();
  return { ok: true, reg: r, acc };
}
function makeStudentForReg(r, acc) {
  const s0 = {
    id: uid('s'), name: acc.name, tg: r.telegram || ('@' + acc.nick), phone: fmtPhone(r.phone), group: '',
    xp: 0, wxp: 0, streak: 0, coins: 0, level: 'junior', act: true, score: 0, joined: todayISO(),
    bio: dirLabel(r.direction) + ' · ' + levelLabel(r.level), goal: r.goal, done: [], last: 0
  };
  S.students.push(s0);
  acc.studentId = s0.id;
  S.friends[s0.id] = []; S.incoming[s0.id] = []; S.sent[s0.id] = [];
  pushNotif(s0.id, 'Xush kelibsiz!', 'Arizangiz tasdiqlandi — 1-moduldan boshlang.', 'rocket');
  return s0;
}
function regApprove(regId) {
  const r = regOf(regId);
  if (!r) return { err: 'notfound', msg: 'Ariza topilmadi.' };
  if (r.status === 'approved') return { ok: true, reg: r, acc: accById(r.accId) };
  if (!r.verified) return { err: 'unverified', msg: 'Talaba email kodini hali tasdiqlamagan — tasdiqlashni so‘rang.' };
  const acc = accById(r.accId);
  if (!acc) return { err: 'acc', msg: 'Akkaunt topilmadi — arizani qayta yaratish kerak.' };
  acc.status = 'active';
  if (!acc.studentId) makeStudentForReg(r, acc);
  r.status = 'approved'; r.decidedAt = Date.now(); r.decidedBy = (meAcc() || {}).name || 'Admin';
  sendMail('approved', r.email, 'Arizangiz tasdiqlandi — nick: ' + acc.nick,
    'Tabriklaymiz, ' + r.name + '!\n\nArizangiz tasdiqlandi.\n\nNick: ' + acc.nick + '\nKirish: sayt → «Kirish» → Talaba.\n\nAI Leaders Startup Club');
  save();
  return { ok: true, reg: r, acc };
}
function regReject(regId, reason) {
  const r = regOf(regId);
  if (!r) return { err: 'notfound', msg: 'Ariza topilmadi.' };
  r.status = 'rejected'; r.decidedAt = Date.now(); r.decidedBy = (meAcc() || {}).name || 'Admin';
  r.reason = String(reason || '').trim();
  const acc = accById(r.accId);
  if (acc) acc.status = 'blocked';
  sendMail('rejected', r.email, 'Ariza bo‘yicha javob',
    'Salom, ' + r.name + '.\n\nAfsuski arizangiz rad etildi.' + (r.reason ? '\nSabab: ' + r.reason : '') +
    '\nSavollar bo‘lsa klub adminiga yozing.\n\nAI Leaders Startup Club');
  save();
  return { ok: true, reg: r };
}
function regResend(regId) {
  const r = regOf(regId);
  if (!r) return { err: 'notfound' };
  r.code = makeCode(); r.exp = Date.now() + 10 * 60 * 1000;
  sendMail('reg-code', r.email, 'AI Leaders — yangi tasdiqlash kodi',
    'Yangi tasdiqlash kodi: ' + r.code + '\nKod 10 daqiqa amal qiladi.', r.code);
  save();
  return { ok: true, reg: r };
}

/* ---------- 6. Parolni tiklash ---------- */
function resetList() { if (!Array.isArray(S.reset)) S.reset = []; return S.reset; }
function authLookupReset(v) {
  const s = String(v || '').trim();
  if (!s) return null;
  const byMail = accByEmail(s), byNick = accByNick(s);
  if (byMail) return byMail;
  if (byNick) return byNick;
  const d = digitsOnly(s);
  if (d.length >= 9) return accounts().find(a => a.phone && digitsOnly(a.phone) === d) || null;
  return null;
}
function resetRequest(login) {
  const a = authLookupReset(login);
  if (!a) return { err: 'notfound', msg: 'Bunday nick, email yoki telefon topilmadi.' };
  if (a.role !== 'student') return { err: 'admin', msg: 'Admin akkauntlari uchun parolni klub egasi tiklaydi.' };
  if (!a.email) return { err: 'contact', msg: 'Bu akkauntda Gmail manzili yo‘q. Xavfsiz tiklash uchun klub adminiga murojaat qiling.' };
  const rec = { id: uid('rst'), accId: a.id, code: makeCode(), exp: Date.now() + 10 * 60 * 1000, used: false, at: Date.now(), channel: 'email' };
  resetList().unshift(rec);
  if (S.reset.length > 30) S.reset.length = 30;
  sendMail('reset', a.email, 'Parolni tiklash kodi — AI Leaders',
    'Parolni tiklash kodi: ' + rec.code + '\nKod 10 daqiqa amal qiladi.\nAgar bu so‘rov sizdan bo‘lmasa — xatni e’tiborsiz qoldiring.', rec.code);
  save();
  return { ok: true, rec, acc: a };
}
function resetConfirm(recId, code, pass) {
  const rec = resetList().find(x => x.id === recId);
  if (!rec) return { err: 'notfound', msg: 'So‘rov topilmadi — qaytadan boshlang.' };
  if (rec.used) return { err: 'used', msg: 'Bu kod allaqachon ishlatilgan — yangi kod so‘rang.' };
  if (Date.now() > rec.exp) return { err: 'expired', msg: 'Kod muddati tugagan — yangi kod so‘rang.' };
  if (digitsOnly(code) !== String(rec.code)) return { err: 'code', msg: 'Kod xato.' };
  const p = String(pass || '');
  if (p.length < 6 || !/[A-Za-z]/.test(p) || !/\d/.test(p)) return { err: 'pass', msg: 'Yangi parol: kamida 6 belgi, harf va raqam.' };
  const a = accById(rec.accId);
  if (!a) return { err: 'acc', msg: 'Akkaunt topilmadi.' };
  a.pass = hashPass(a.nick, p); a.mustSetPass = false;
  if (a.status === 'pending') a.status = 'pending';
  rec.used = true;
  sendMail('reset-done', a.email, 'Parolingiz yangilandi — AI Leaders',
    'Parol muvaffaqiyatli yangilandi.\nNick: ' + a.nick + '\nAgar bu siz bo‘lmasangiz, darhol admin bilan bog‘laning.');
  save();
  return { ok: true, acc: a };
}

/* ---------- 7. Profil va telefon raqamini Gmail orqali himoyalangan yangilash ---------- */
function phoneChangeList() { if (!Array.isArray(S.contactChanges)) S.contactChanges = []; return S.contactChanges; }
function samePhone(a, b) { return normPhone(a) === normPhone(b); }
function profileSave(data) {
  const a = meAcc();
  if (!a || a.role !== 'student') return { err: 'auth', msg: 'Profilni yangilash uchun talaba akkaunti bilan kiring.' };
  const st = get(S.students, a.studentId);
  if (!st) return { err: 'profile', msg: 'Talaba profili topilmadi.' };
  const name = String(data.name || '').trim();
  if (name.length < 2) return { err: 'name', msg: 'To‘liq ismni kiriting.' };
  const phone = normPhone(data.phone || '');
  if (phone.length !== 12 || phone.slice(0, 3) !== '998') return { err: 'phone', msg: 'Yangi telefon raqamini +998 90 123 45 67 ko‘rinishida kiriting.' };
  const before = { name: a.name || st.name, tg: st.tg || '', goal: st.goal || '', bio: st.bio || '', phone: normPhone(a.phone || st.phone || '') };
  const changes = [];
  if (name !== before.name) changes.push('ism');
  if (String(data.tg || '').trim() !== before.tg) changes.push('Telegram');
  if (String(data.goal || '').trim() !== before.goal) changes.push('maqsad');
  if (String(data.bio || '').trim() !== before.bio) changes.push('bio');
  /* Telefon darhol almashmaydi: email egasi 6 xonali kod bilan tasdiqlaydi. */
  const phoneChanged = !samePhone(phone, before.phone);
  if (phoneChanged) {
    const used = accounts().some(x => x.id !== a.id && x.phone && samePhone(x.phone, phone)) ||
      regList().some(r => r.status !== 'rejected' && r.accId !== a.id && r.phone && samePhone(r.phone, phone));
    if (used) return { err: 'phone-dup', msg: 'Bu telefon raqami boshqa akkauntda ishlatilgan.' };
    if (!emailOk(a.email)) return { err: 'email', msg: 'Telefonni xavfsiz almashtirish uchun akkauntga Gmail manzili bog‘langan bo‘lishi kerak.' };
  }
  a.name = name; st.name = name;
  st.tg = String(data.tg || '').trim(); st.goal = String(data.goal || '').trim(); st.bio = String(data.bio || '').trim();
  let pending = null;
  if (phoneChanged) {
    pending = { id: uid('pch'), accId: a.id, phone, code: makeCode(), exp: Date.now() + 10 * 60 * 1000, used: false, at: Date.now() };
    phoneChangeList().unshift(pending);
    if (S.contactChanges.length > 20) S.contactChanges.length = 20;
    sendMail('phone-change-code', a.email, 'Telefon raqamini yangilash kodi — AI Leaders',
      'Salom, ' + name + '.\n\nYangi telefon raqamini akkauntingizga ulash uchun kod: ' + pending.code +
      '\nKod 10 daqiqa amal qiladi.\n\nYangi raqam: ' + fmtPhone(phone) +
      '\nAgar bu so‘rov sizdan bo‘lmasa, kodni hech kimga bermang.', pending.code);
  } else if (changes.length && emailOk(a.email)) {
    sendMail('profile-updated', a.email, 'Profilingiz yangilandi — AI Leaders',
      'Salom, ' + name + '.\n\nProfil ma’lumotlaringiz yangilandi: ' + changes.join(', ') +
      '.\nAgar bu o‘zgarishni siz qilmagan bo‘lsangiz, darhol klub administratori bilan bog‘laning.');
  }
  save();
  return { ok: true, pending, changes };
}
function phoneChangeConfirm(changeId, code) {
  const c = phoneChangeList().find(x => x.id === changeId);
  if (!c) return { err: 'notfound', msg: 'Telefon o‘zgartirish so‘rovi topilmadi. Profilga qayting.' };
  if (c.used) return { err: 'used', msg: 'Bu kod allaqachon ishlatilgan.' };
  if (Date.now() > c.exp) return { err: 'expired', msg: 'Kod muddati tugagan. Profilga qaytib qayta urinib ko‘ring.' };
  if (digitsOnly(code) !== String(c.code)) return { err: 'code', msg: 'Kod xato.' };
  const a = accById(c.accId), st = a && get(S.students, a.studentId);
  if (!a || !st) return { err: 'account', msg: 'Akkaunt topilmadi.' };
  a.phone = c.phone; st.phone = fmtPhone(c.phone); c.used = true;
  sendMail('phone-changed', a.email, 'Telefon raqamingiz yangilandi — AI Leaders',
    'Salom, ' + a.name + '.\n\nAkkauntingizdagi telefon raqami yangilandi: ' + fmtPhone(c.phone) +
    '.\nParol tiklashda endi shu raqamdan qidirishingiz mumkin.\nAgar bu siz bo‘lmasangiz, darhol klub administratori bilan bog‘laning.');
  save();
  return { ok: true, account: a };
}
function phoneChangeModal(change) {
  const a = meAcc();
  if (!change || !a) return;
  openModal(mhead('Yangi raqamni tasdiqlang', 'Kod ' + maskEmail(a.email) + ' Gmail manziliga yuborildi') +
    '<form data-form="profile-phone-confirm" data-id="' + esc(change.id) + '" class="col" style="gap:12px">' +
    '<div class="reg-hint">' + ico('phone', 'sm') + '<div>Ulanayotgan yangi raqam: <b>' + esc(fmtPhone(change.phone)) + '</b><br>Kod 10 daqiqa amal qiladi.</div></div>' +
    '<div class="field"><label>6 xonali Gmail kodi</label><input class="inp code-inp" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required placeholder="123456"></div>' +
    '<div class="row" style="gap:9px"><button class="btn btn-primary grow" type="submit">' + ico('check', 'sm') + 'Raqamni ulash</button>' +
    '<button type="button" class="btn btn-ghost" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}

/* ---------- 7. Landing: sehrgar holati ---------- */
function regState() {
  if (!UI.reg) UI.reg = { step: 1, d: {}, err: '', regId: null, done: null };
  return UI.reg;
}
function resetState() {
  if (!UI.reset) UI.reset = { step: 1, login: '', recId: '', err: '' };
  return UI.reset;
}
/* Joriy formadagi kiritilganlarni qoralamaga yig'ish (qadam almashganda yo'qolmasin) */
function regHarvest() {
  const f = document.querySelector('form[data-form="reg-step"]');
  if (!f) return;
  const st = regState();
  try {
    new FormData(f).forEach((v, k) => { st.d[k] = typeof v === 'string' ? v : st.d[k]; });
  } catch (e) { }
  ['name', 'surname', 'birth', 'phone', 'email', 'tg', 'hemis', 'goal', 'pass', 'pass2', 'city', 'source'].forEach(k => {
    const el = f.querySelector('[name="' + k + '"]');
    if (el) st.d[k] = el.value;
  });
  const t = f.querySelector('[name="terms"]');
  if (t) st.d.terms = t.checked ? 'on' : '';
}

/* ---------- 8. Landing: sehrgar ko'rinishi ---------- */
function regSelect(name, label, opts, cur) {
  return '<div class="field"><label>' + label + '</label><select class="inp" name="' + name + '">' +
    '<option value="">Tanlang…</option>' +
    opts.map(o => { const v = typeof o === 'string' ? o : o.v, l = typeof o === 'string' ? o : o.l; return '<option value="' + esc(v) + '"' + (cur === v ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') +
    '</select></div>';
}
function regPicks(name, list, cur, cls) {
  return '<div class="pick ' + (cls || '') + '">' + list.map(o =>
    '<button type="button" class="pick-c' + (cur === o.v ? ' on' : '') + '" data-act="reg-pick" data-k="' + name + '" data-v="' + esc(o.v) + '">' +
    (o.i ? ico(o.i, 'sm') : '') + '<span>' + esc(o.l) + '</span></button>').join('') + '</div>';
}
function regStepForm(step) {
  const st = regState(), d = st.d, v = k => esc(d[k] || '');
  let body = '';
  if (step === 1) {
    body =
      '<div class="reg-g2">' +
      '<div class="field"><label>Ism <span class="field-req">*</span></label><input class="inp" name="name" required autocomplete="given-name" placeholder="Dilnoza" value="' + v('name') + '"></div>' +
      '<div class="field"><label>Familiya <span class="field-req">*</span></label><input class="inp" name="surname" required autocomplete="family-name" placeholder="Karimova" value="' + v('surname') + '"></div></div>' +
      '<div class="reg-g2">' +
      '<div class="field"><label>Tug‘ilgan sana <span class="field-req">*</span></label><input class="inp" type="date" name="birth" required max="' + todayISO() + '" value="' + v('birth') + '"></div>' +
      regSelect('city', 'Shahar <span class="field-req">*</span>', REG_CITIES, d.city) + '</div>' +
      '<div class="field"><label>Jins <span class="field-req">*</span></label>' +
      regPicks('gender', [{ v: 'erkak', l: 'Erkak', i: 'user' }, { v: 'ayol', l: 'Ayol', i: 'user' }], d.gender, 'g2') + '</div>';
  } else if (step === 2) {
    body =
      '<div class="field"><label>Telefon raqam <span class="field-req">*</span></label>' +
      '<input class="inp" name="phone" inputmode="tel" autocomplete="tel" required placeholder="+998 90 123 45 67" value="' + v('phone') + '">' +
      '<div class="inp-hint">Parolni tiklash kodi shu raqamga ham yuboriladi.</div></div>' +
      '<div class="field"><label>Email <span class="field-req">*</span></label>' +
      '<input class="inp" name="email" type="email" inputmode="email" autocomplete="email" required placeholder="ism@gmail.com" value="' + v('email') + '">' +
      '<div class="inp-hint">Barcha xabarlar shu manzilga boradi: tasdiqlash kodi, ariza holati, eslatmalar.</div></div>' +
      '<div class="field"><label>Telegram (ixtiyoriy)</label><input class="inp" name="tg" placeholder="@username" value="' + v('tg') + '"></div>' +
      '<div class="field"><label>HEMIS ID (ixtiyoriy)</label><input class="inp" name="hemis" inputmode="numeric" maxlength="12" placeholder="12 xonali raqam" value="' + v('hemis') + '">' +
      '<div class="inp-hint">Klubda o‘qiysizmi — 12 xonali HEMIS ID ni kiriting. Kirishda ishlatilmaydi, faqat klub hisoboti uchun.</div></div>';
  } else if (step === 3) {
    body =
      '<div class="field"><label>Yo‘nalish <span class="field-req">*</span></label>' + regPicks('direction', REG_DIRS, d.direction, 'g2') + '</div>' +
      '<div class="field"><label>Tajriba darajasi <span class="field-req">*</span></label>' + regPicks('level', REG_LEVELS, d.level, 'g2') + '</div>' +
      '<div class="field"><label>Maqsadingiz <span class="field-req">*</span></label>' +
      '<textarea class="inp" name="goal" rows="3" placeholder="Masalan: AI yordamida o‘quvchilar uchun foydali ilova yasash">' + v('goal') + '</textarea></div>' +
      regSelect('source', 'Bizni qayerdan bildingiz? <span class="field-req">*</span>', REG_SOURCES, d.source);
  } else {
    const pw = passStrength(d.pass);
    body =
      '<div class="field"><label>Parol <span class="field-req">*</span></label>' +
      '<div class="pwrap"><input class="inp" type="password" name="pass" autocomplete="new-password" required placeholder="Kamida 6 belgi" value="' + v('pass') + '">' +
      '<button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div>' +
      '<div class="pw' + (pw ? ' s' + pw : '') + '"><i></i><i></i><i></i><i></i></div>' +
      '<div class="pw-lbl">' + (pw <= 1 ? 'Zaif — harf va raqam qo‘shing' : pw === 2 ? 'O‘rtacha — 10+ belgi yaxshiroq' : pw === 3 ? 'Yaxshi parol' : 'Kuchli parol') + '</div></div>' +
      '<div class="field"><label>Parolni tasdiqlang <span class="field-req">*</span></label><input class="inp" type="password" name="pass2" autocomplete="new-password" required placeholder="Qayta yozing" value="' + v('pass2') + '"></div>' +
      '<label class="chk"><input type="checkbox" name="terms"' + (d.terms === 'on' ? ' checked' : '') + '>' +
      '<span>Men <b>foydalanish shartlari</b> va ma’lumotlarim klub maqsadida saqlanishiga roziman. Xabarlar email orqali yuboriladi.</span></label>';
  }
  const last = step === 4;
  return '<form data-form="reg-step" data-step="' + step + '" class="col" style="gap:11px" novalidate>' + body +
    (st.err ? '<div class="form-err">' + ico('alert', 'sm') + esc(st.err) + '</div>' : '') +
    '<div class="row" style="gap:8px;margin-top:2px">' +
    (step > 1 ? '<button type="button" class="btn btn-ghost btn-sm" data-act="reg-back">' + ico('left', 'sm') + 'Orqaga</button>' : '') +
    '<button class="btn btn-primary grow" type="submit">' + ico(last ? 'send' : 'right', 'sm') + (last ? 'Kod yuborish' : 'Davom etish') + '</button>' +
    '</div>' +
    '<div class="xs muted" style="text-align:center">' + step + '/4 qadam · 1 daqiqada</div>' +
    '</form>';
}
function regCodeForm() {
  const st = regState();
  const reg = regOf(st.regId);
  const email = reg ? reg.email : '';
  return '<form data-form="reg-verify" class="col" style="gap:11px" novalidate>' +
    '<div class="reg-hint">' + ico('mail', 'sm') + '<div>Kod <b>' + esc(maskEmail(email)) + '</b> Gmail manziliga yuborildi. Xat kelmasa — Spam / Promotions papkasini tekshiring.</div></div>' +
    '<div class="field"><label>Tasdiqlash kodi</label>' +
    '<input class="inp code-inp" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" autofocus></div>' +
    (st.err ? '<div class="form-err">' + ico('alert', 'sm') + esc(st.err) + '</div>' : '') +
    '<button class="btn btn-primary btn-block" type="submit">' + ico('check-c', 'sm') + 'Tasdiqlash va akkaunt yaratish</button>' +
    '<div class="row between" style="gap:10px">' +
    '<button type="button" class="auth-link" data-act="reg-resend">' + ico('refresh', 'sm') + 'Kodni qayta yuborish</button>' +
    '<button type="button" class="auth-link" data-act="reg-restart">' + ico('left', 'sm') + 'Boshidan boshlash</button></div></form>';
}
function regDoneCard() {
  const st = regState(), r = regOf(st.regId);
  const nick = r ? r.nick : (st.done && st.done.nick) || '—';
  const acc = r ? accById(r.accId) : null;
  const active = acc && acc.status === 'active';
  return '<div class="reg-done">' +
    '<div class="reg-done-ic">' + ico('check-c', 'lg') + '</div>' +
    '<div><h3 style="margin:0;font-size:17px;font-weight:850">Ariza qabul qilindi!</h3>' +
    '<p class="small muted" style="margin:5px 0 0">' + (active ? 'Akkaunt faol — hoziroq kirishingiz mumkin.' : 'Admin ko‘rib chiqadi va tasdiqlagach emailga xabar keladi.') + '</p></div>' +
    '<div class="nickcard"><span class="xs muted">Sizning shaxsiy nick</span><div class="big-nick">@' + esc(nick) + '</div>' +
    '<span class="xs muted">Kirishda shu nick ishlatiladi</span></div>' +
    '<div class="reg-hint ok">' + ico('mail', 'sm') + '<div>Tasdiqlash xati <b>' + esc(r ? r.email : '') + '</b> manziliga yuborildi. Barcha keyingi xabarlar ham shu yerga keladi.</div></div>' +
    '<div class="row" style="gap:8px;width:100%;margin-top:2px">' +
    (active ? '<button class="btn btn-primary grow" data-act="to-auth">' + ico('lock', 'sm') + 'Kirish</button>' : '') +
    '<button class="btn btn-soft' + (active ? '' : ' grow') + '" data-act="reg-restart">' + ico('plus', 'sm') + 'Yangi ariza</button></div></div>';
}
function regWizard() {
  const st = regState();
  if (st.done && st.regId) return regDoneCard();
  const step = Math.min(5, Math.max(1, st.step));
  const cur = REG_STEPS[step - 1] || REG_STEPS[0];
  let h = '<div class="reg"><div class="reg-rail">' +
    REG_STEPS.map(x => '<div class="reg-dot' + (step === x.n ? ' on' : step > x.n ? ' done' : '') + '"><i>' + (step > x.n ? '✓' : x.n) + '</i><span>' + esc(x.t) + '</span></div>').join('') +
    '</div><div class="reg-head"><h3>' + esc(cur.t) + '</h3><p>' + esc(cur.s) + '</p></div>';
  h += step <= 4 ? regStepForm(step) : regCodeForm();
  return h + '</div>';
}
function resetWizard() {
  const r = resetState();
  let h = '<div class="reg"><div class="reset-top"><span class="xs up muted">Parolni tiklash</span>' +
    '<button type="button" class="auth-link" data-act="reset-cancel">' + ico('left', 'sm') + 'Kirishga qaytish</button></div>';
  if (r.step === 1) {
    h += '<div class="reg-head"><h3>Parolni unutdingizmi?</h3><p>Nick, email yoki telefon raqamingizni kiriting — tasdiqlash kodi Gmail manzilingizga yuboriladi.</p></div>' +
      '<form data-form="reset-request" class="col" style="gap:11px" novalidate>' +
      '<div class="field"><label>Nick / email / telefon</label><input class="inp" name="login" required autocomplete="username" placeholder="Masalan: falcon yoki ism@gmail.com" value="' + esc(r.login || '') + '"></div>' +
      (r.err ? '<div class="form-err">' + ico('alert', 'sm') + esc(r.err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('send', 'sm') + 'Kod yuborish</button>' +
      '<div class="inp-hint">Kod xavfsizlik uchun akkauntingizdagi Gmail manziliga yuboriladi.</div></form>';
  } else if (r.step === 2) {
    const rec = resetList().find(x => x.id === r.recId);
    const a = rec ? accById(rec.accId) : null;
    const where = a && a.email ? maskEmail(a.email) + ' Gmail manziliga' : '';
    h += '<div class="reg-head"><h3>Kodni kiriting</h3><p>Kod ' + esc(where) + ' yuborildi.</p></div>' +
      '<form data-form="reset-confirm" class="col" style="gap:11px" novalidate>' +
      '<div class="field"><label>Tasdiqlash kodi</label><input class="inp code-inp" name="code" inputmode="numeric" maxlength="6" placeholder="000000" autofocus></div>' +
      '<div class="field"><label>Yangi parol</label><div class="pwrap"><input class="inp" type="password" name="pass" autocomplete="new-password" required placeholder="Kamida 6 belgi">' +
      '<button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      '<div class="field"><label>Yangi parolni tasdiqlang</label><input class="inp" type="password" name="pass2" autocomplete="new-password" required placeholder="Qayta yozing"></div>' +
      (r.err ? '<div class="form-err">' + ico('alert', 'sm') + esc(r.err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('check-c', 'sm') + 'Parolni yangilash</button>' +
      '<button type="button" class="auth-link" style="justify-content:center" data-act="reset-start">Kod kelmadimi? Qayta yuborish</button></form>';
  } else {
    h += '<div class="reg-done"><div class="reg-done-ic">' + ico('check-c', 'lg') + '</div>' +
      '<div><h3 style="margin:0;font-size:17px;font-weight:850">Parol yangilandi</h3>' +
      '<p class="small muted" style="margin:5px 0 0">Endi yangi parol bilan kirishingiz mumkin.</p></div>' +
      '<button class="btn btn-primary btn-block" data-act="reset-cancel">' + ico('lock', 'sm') + 'Kirish</button></div>';
  }
  return h + '</div>';
}

/* Xatoni forma ichida ko'rsatish — qayta chizishsiz (kiritilgan kod/parol yo'qolmaydi) */
function formErrNow(msg) {
  const f = document.querySelector('form[data-form="reg-verify"], form[data-form="reset-confirm"], form[data-form="reset-request"]');
  if (!f) return false;
  let el = f.querySelector('.form-err');
  if (!msg) { if (el) el.remove(); return true; }
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-err';
    const btn = f.querySelector('button[type="submit"]');
    f.insertBefore(el, btn || null);
  }
  el.innerHTML = ico('alert', 'sm') + esc(msg);
  return true;
}

/* ---------- 9. Forma va amallar (app-4 dan chaqiriladi) ---------- */
function authFormSubmit(kind, fd, form, ev) {
  /* --- talaba profili: telefon faqat Gmail kodi tasdiqlangach almashtiriladi --- */
  if (kind === 'profile') {
    const r = profileSave({ name: fd.get('name'), tg: fd.get('tg'), phone: fd.get('phone'), goal: fd.get('goal'), bio: fd.get('bio') });
    if (r.err) { toast('warn', 'Profil saqlanmadi', r.msg); return true; }
    if (r.pending) {
      toast('ok', 'Gmail kodi yuborildi', 'Yangi telefon raqamini ulash uchun emailingizni tekshiring.');
      phoneChangeModal(r.pending);
    } else {
      toast('ok', 'Profil saqlandi', r.changes.length ? 'O‘zgarish haqida Gmail’ingizga xabar yuborildi.' : 'O‘zgarish yo‘q.');
      closeModal(); paint(true);
    }
    return true;
  }
  if (kind === 'profile-phone-confirm') {
    const r = phoneChangeConfirm((form && form.dataset.id) || '', fd.get('code'));
    if (r.err) { toast('warn', 'Raqam ulanmagan', r.msg); return true; }
    closeModal(); toast('ok', 'Yangi raqam ulandi', 'Tasdiqlovchi xabar Gmail’ingizga yuborildi.'); paint(true);
    return true;
  }
  /* --- ro'yxatdan o'tish: qadam --- */
  if (kind === 'reg-step') {
    const st = regState();
    const step = parseInt((form && form.dataset.step) || '1', 10) || 1;
    ['name', 'surname', 'birth', 'phone', 'email', 'tg', 'hemis', 'goal', 'pass', 'pass2', 'city', 'source'].forEach(k => {
      if (fd.has(k)) st.d[k] = String(fd.get(k) || '');
    });
    const termsEl = form && form.querySelector('[name="terms"]');
    st.d.terms = termsEl && termsEl.checked ? 'on' : '';
    const v = regValidate(st.d, step);
    if (!v.ok) { st.err = v.msg; paint(true); return true; }
    st.err = '';
    if (step === 4) {
      const r = regStart(st.d);
      if (!r.ok) { st.err = r.msg; paint(true); return true; }
      st.regId = r.reg.id; st.step = 5; st.done = null;
      toast('ok', 'Kod yuborildi', 'Emailingizni tekshiring: ' + maskEmail(r.reg.email));
    } else {
      st.step = step + 1;
    }
    paint(true); landScrollCard();
    return true;
  }
  /* --- ro'yxatdan o'tish: kodni tasdiqlash --- */
  if (kind === 'reg-verify') {
    const st = regState();
    const r = regVerify(st.regId, fd.get('code'));
    if (r.err) { st.err = r.msg; formErrNow(r.msg); return true; }
    st.err = ''; st.done = { nick: r.reg ? r.reg.nick : '' };
    toast('ok', 'Akkaunt yaratildi', 'Sizning nick: @' + (r.reg ? r.reg.nick : ''));
    paint(true); landScrollCard();
    return true;
  }
  /* --- parolni tiklash: so'rov --- */
  if (kind === 'reset-request') {
    const r = resetState();
    r.login = String(fd.get('login') || '').trim();
    const res = resetRequest(r.login);
    if (res.err) { r.err = res.msg; formErrNow(res.msg); return true; }
    r.err = ''; r.recId = res.rec.id; r.step = 2;
    toast('ok', 'Kod yuborildi', 'Gmail: ' + maskEmail(res.acc.email));
    paint(true); landScrollCard();
    return true;
  }
  /* --- parolni tiklash: kod + yangi parol --- */
  if (kind === 'reset-confirm') {
    const r = resetState();
    if (String(fd.get('pass')) !== String(fd.get('pass2'))) { r.err = 'Parollar mos kelmadi.'; formErrNow(r.err); return true; }
    const res = resetConfirm(r.recId, fd.get('code'), fd.get('pass'));
    if (res.err) { r.err = res.msg; formErrNow(res.msg); return true; }
    r.err = ''; r.step = 3;
    toast('ok', 'Parol yangilandi', 'Nick: @' + res.acc.nick + ' — endi yangi parol bilan kiring.');
    paint(true); landScrollCard();
    return true;
  }
  /* --- ariza egasiga email --- */
  if (kind === 'reg-msg') {
    const r = regOf((form && form.dataset.id) || '');
    if (!r) { closeModal(); return true; }
    sendMail('custom', r.email, String(fd.get('subject') || 'AI Leaders'), String(fd.get('body') || ''));
    closeModal();
    toast('ok', 'Xabar yuborildi', r.email);
    paint(true);
    return true;
  }
  /* --- email sozlamalari (admin) --- */
  if (kind === 'mail-settings') {
    const cfg = mailCfg();
    cfg.testEmail = String(fd.get('testEmail') || '').trim().toLowerCase();
    save();
    toast('ok', 'Sinov manzili saqlandi', cfg.testEmail || 'Sinov xabari uchun Gmail manzilini kiriting.');
    paint(true);
    return true;
  }
  return false;
}
/* Qo'shimcha amallar (app-4 switch'i ichida chaqiriladi) */
function regAct(act, id, el) {
  if (act === 'reg-pick') {
    regHarvest();
    const st = regState();
    st.d[el.dataset.k] = el.dataset.v;
    st.err = '';
    paint(true);
    return true;
  }
  if (act === 'reg-back') {
    regHarvest();
    const st = regState();
    st.step = Math.max(1, st.step - 1); st.err = '';
    paint(true);
    return true;
  }
  if (act === 'reg-restart') {
    UI.reg = { step: 1, d: {}, err: '', regId: null, done: null };
    paint(true); landScrollCard();
    return true;
  }
  if (act === 'reg-resend') {
    const st = regState();
    const r = regResend(st.regId);
    if (r.ok) { toast('ok', 'Kod qayta yuborildi', 'Spam papkasini ham tekshiring'); st.err = ''; }
    paint(true);
    return true;
  }
  if (act === 'reset-start' || act === 'reset-cancel') {
    UI.reset = act === 'reset-start' ? { step: 1, login: (UI.reset && UI.reset.login) || '', recId: '', err: '' } : null;
    UI.authRole = 'student'; UI.authErr = '';
    paint(true); landScrollCard();
    return true;
  }
  if (act === 'reg-approve') {
    const r = regApprove(id);
    if (r.err) toast('warn', 'Tasdiqlanmadi', r.msg);
    else toast('ok', 'Ariza tasdiqlandi', r.acc ? ('Nick: @' + r.acc.nick + ' — email yuborildi') : '');
    paint(true);
    return true;
  }
  if (act === 'reg-reject') {
    const r = regOf(id);
    if (!r) return true;
    confirmModal('Arizani rad etish?', r.name + ' ' + r.surname + ' (' + r.email + ') — ariza rad etiladi va emailga xabar boradi.', 'reg-reject-do', id, true);
    return true;
  }
  if (act === 'reg-reject-do') {
    const r = regReject(id, '');
    closeModal();
    if (!r.err) toast('warn', 'Ariza rad etildi', 'Emailga xabar yuborildi.');
    paint(true);
    return true;
  }
  if (act === 'reg-filter') {
    UI.regFilter = el.dataset.v || 'all';
    paint(true);
    return true;
  }
  if (act === 'reg-msg') { regMsgModal(id); return true; }
  if (act === 'mail-test') {
    const r = mailTest();
    if (!r.ok) toast('warn', 'Sinov yuborilmadi', r.msg);
    else toast('ok', 'Sinov navbatga qo‘yildi', 'Gmail: ' + r.to + ' — jurnal holatini tekshiring.');
    paint(true);
    return true;
  }
  return false;
}

/* Ariza egasiga email orqali xabar yozish */
function regMsgModal(id) {
  const r = regOf(id);
  if (!r) return;
  openModal(mhead('Xabar yozish', r.name + ' ' + r.surname + ' · ' + r.email) +
    '<form data-form="reg-msg" data-id="' + esc(r.id) + '" class="col" style="gap:11px">' +
    '<div class="field"><label>Mavzu</label><input class="inp" name="subject" required value="AI Leaders — arizangiz bo‘yicha"></div>' +
    '<div class="field"><label>Xabar matni</label><textarea class="inp" name="body" rows="5" required placeholder="Salom, ' + esc(r.name) + '! ..."></textarea>' +
    '<div class="inp-hint">Xabar talabaning emailiga yuboriladi va «Sozlamalar → Email» jurnalida saqlanadi.</div></div>' +
    '<div class="row" style="gap:9px"><button class="btn btn-primary grow" type="submit">' + ico('send', 'sm') + 'Emailga yuborish</button>' +
    '<button type="button" class="btn btn-ghost" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}

/* ---------- 10. Boshqaruv: arizalar sahifasi ---------- */
function vRegistrations() {
  const all = regList().filter(r => r.verified);
  const drafts = regList().filter(r => !r.verified).length;
  const f = UI.regFilter || 'all';
  const c = {
    nw: all.filter(r => r.status === 'new').length,
    ok: all.filter(r => r.status === 'approved').length,
    no: all.filter(r => r.status === 'rejected').length
  };
  const list = all.filter(r => f === 'all' ? true : r.status === f);
  let h = '<div class="page-head"><div><h1 class="h1">Arizalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + c.nw + '</b> yangi · <b>' + c.ok + '</b> tasdiqlangan · <b>' + c.no + '</b> rad etilgan' +
    (drafts ? ' · <b>' + drafts + '</b> kod tasdiqlanmagan' : '') + '</p></div>' +
    '<div class="row wrap" style="gap:8px"><button class="btn btn-soft btn-sm" data-act="go" data-route="settings">' + ico('mail', 'sm') + 'Email sozlamalari</button></div></div>';
  h += '<div class="grid g4">' +
    kpi('send', c.nw, 'Yangi ariza', '', c.nw ? 'o' : '') +
    kpi('check-c', c.ok, 'Tasdiqlangan', '', 'a') +
    kpi('x', c.no, 'Rad etilgan', '', 'r') +
    kpi('users', all.length, 'Jami ariza', '', 'c') + '</div>';
  h += '<div class="row wrap" style="gap:8px">' +
    [['all', 'Barchasi', all.length], ['new', 'Yangi', c.nw], ['approved', 'Tasdiqlangan', c.ok], ['rejected', 'Rad etilgan', c.no]]
      .map(x => '<button class="chip' + (f === x[0] ? ' on' : '') + '" data-act="reg-filter" data-v="' + x[0] + '">' + esc(x[1]) +
        ' <b style="opacity:.75">' + x[2] + '</b></button>').join('') + '</div>';
  if (!all.length) {
    h += '<div class="card"><div class="empty">' + ico('send', 'xl') +
      '<div class="empty-t">Hozircha ariza yo‘q</div>' +
      '<div class="small muted" style="max-width:420px;text-align:center">Talabalar saytning «Ro‘yxatdan o‘tish» bo‘limidan ariza topshirganda shu yerda paydo bo‘ladi. Ariza email kodi bilan tasdiqlangach ro‘yxatga qo‘shiladi.</div>' +
      '<button class="btn btn-soft btn-sm" data-act="to-landing">Landing sahifani ko‘rish</button></div></div>';
  } else {
    h += '<div class="reg-list">' + list.map(r => {
      const full = r.name + ' ' + r.surname;
      const stt = REG_STATUS[r.status] || REG_STATUS.new;
      return '<details class="reg-item"' + (r.status === 'new' ? ' open' : '') + '><summary class="reg-sum">' + avatar({ name: full, act: true, last: 0 }, 'sm') +
        '<div class="grow"><b>' + esc(full) + '</b><small>@' + esc(r.nick) + ' · ' + esc(r.email) + ' · ' + esc(fmtPhone(r.phone)) + '</small></div>' +
        '<span class="tag ' + stt.t + '">' + esc(stt.l) + '</span>' +
        '<svg class="i sm reg-caret" aria-hidden="true"><use href="#i-down"></use></svg></summary>' +
        '<div class="reg-body"><div class="reg-grid">' +
        [['Tug‘ilgan sana', fmtFull(r.birth)], ['Shahar', r.city], ['Yo‘nalish', dirLabel(r.direction)], ['Daraja', levelLabel(r.level)],
         ['HEMIS ID', r.hemis || '—'], ['Telegram', r.telegram || '—'], ['Qayerdan', r.source || '—'], ['Ariza sanasi', fmtFull(isoDate(new Date(r.at)))]]
          .map(x => '<div class="reg-kv"><div class="k">' + esc(x[0]) + '</div><div class="v">' + esc(x[1] || '—') + '</div></div>').join('') +
        '</div>' +
        (r.goal ? '<div class="reg-quote">«' + esc(r.goal) + '»</div>' : '') +
        (r.status === 'approved' ? '<div class="reg-hint ok">' + ico('check-c', 'sm') + '<div>Tasdiqlangan' + (r.decidedBy ? ' · ' + esc(r.decidedBy) : '') + ' · nick: <b>@' + esc(r.nick) + '</b></div></div>' : '') +
        (r.status === 'rejected' ? '<div class="reg-hint warn">' + ico('x', 'sm') + '<div>Rad etilgan' + (r.decidedBy ? ' · ' + esc(r.decidedBy) : '') + '</div></div>' : '') +
        '<div class="reg-acts">' +
        (r.status === 'new' ? '<button class="btn btn-sm btn-primary" data-act="reg-approve" data-id="' + r.id + '">' + ico('check-c', 'sm') + 'Tasdiqlash</button>' +
          '<button class="btn btn-sm btn-ghost" data-act="reg-reject" data-id="' + r.id + '">' + ico('x', 'sm') + 'Rad etish</button>' : '') +
        '<button class="btn btn-sm btn-soft" data-act="reg-msg" data-id="' + r.id + '">' + ico('mail', 'sm') + 'Xabar yozish</button>' +
        '</div></div></details>';
    }).join('') + '</div>';
  }
  return h;
}

/* ---------- 11. Dashboard: yangi arizalar banneri ---------- */
function regDashBanner() {
  const n = regPendingCount();
  if (!n) return '';
  return '<div class="lrow" style="border-color:rgba(124,92,255,.4);background:linear-gradient(90deg,rgba(124,92,255,.14),transparent 70%);margin-bottom:14px">' +
    '<div class="lead" style="background:rgba(124,92,255,.18);color:#C4B4FF">' + ico('send', 'sm') + '</div>' +
    '<div class="grow" style="min-width:0"><div class="small" style="font-weight:780">' + n + ' ta yangi ariza tasdiqlashni kutmoqda</div>' +
    '<div class="xs muted ellip">Ro‘yxatdan o‘tish saytdan — email kodi tasdiqlangan, endi sizning qaroringiz kerak.</div></div>' +
    '<button class="btn btn-sm btn-primary" data-act="go" data-route="registrations">Arizalarni ko‘rish</button></div>';
}

/* ---------- 11b. Sozlamalar: ro'yxatdan o'tish kartasi ---------- */
function regSetupCard() {
  const all = regList().filter(r => r.verified);
  const nw = all.filter(r => r.status === 'new').length;
  const last = all[0];
  return '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users-plus') + 'Ro‘yxatdan o‘tish</h2>' +
    '<span class="tag ' + (autoApproveOn() ? 'g' : 'o') + '">' + (autoApproveOn() ? 'Avtomatik' : 'Admin tasdiqlaydi') + '</span></div>' +
    '<div class="row between" style="gap:12px;margin-top:-2px"><div><div class="small" style="font-weight:700">Avtomatik tasdiqlash</div>' +
    '<div class="xs muted">Yoqilganda talaba email kodini tasdiqlagach darhol kiradi. O‘chirilsa — arizalar shu yerda tasdiq kutadi.</div></div>' +
    '<button class="switch ' + (autoApproveOn() ? 'on' : '') + '" data-act="toggle-set" data-k="autoApprove" role="switch" aria-checked="' + autoApproveOn() + '" aria-label="Avtomatik tasdiqlash"></button></div>' +
    '<div class="divider"></div>' +
    '<div class="reg-stats">' +
    '<div class="card tight soft tc"><div class="big">' + all.length + '</div><div class="xs muted">jami ariza</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + nw + '</div><div class="xs muted">kutayotgan</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + accSelfCount() + '</div><div class="xs muted">o‘zi ro‘yxatdan o‘tgan</div></div></div>' +
    (last ? '<div class="xs muted" style="margin-top:10px">Oxirgi ariza: <b>' + esc(last.name + ' ' + last.surname) + '</b> · @' + esc(last.nick) + ' · ' + fmtTime(last.at) + '</div>' : '') +
    '<div class="divider"></div>' +
    '<div class="col" style="gap:7px">' +
    [['user', 'Ism, familiya, tug‘ilgan sana, shahar, jins'],
     ['phone', 'Telefon (parolni tiklash uchun ham ishlatiladi)'],
     ['mail', 'Email — barcha xabarlar shu manzilga boradi'],
     ['check', 'Email kodi (6 xonali) tasdiqlangach akkaunt faollashadi'],
     ['spark', 'Nick avtomatik beriladi va emailga yuboriladi']]
      .map(x => '<div class="row" style="gap:9px"><span class="muted">' + ico(x[0], 'sm') + '</span><span class="xs t2">' + esc(x[1]) + '</span></div>').join('') +
    '</div>' +
    '<button class="btn btn-soft btn-sm btn-block" style="margin-top:11px" data-act="go" data-route="registrations">' + ico('send', 'sm') + 'Arizalarni ko‘rish</button></div>';
}

/* ---------- 12. Sozlamalar: email kartasi ---------- */
function regMailCard() {
  const cfg = mailCfg();
  const log = mailLog().slice(0, 6);
  return '<div class="card"><div class="card-h"><h2 class="h2">' + ico('mail') + 'Email va xabarlar</h2>' +
    '<span class="tag p">Pages server</span></div>' +
    '<div class="reg-hint" style="margin:0 0 12px">' + ico('shield', 'sm') + '<div><b>Haqiqiy email oqimi</b><br>Ro‘yxatdan o‘tish kodi, nick, parol tiklash, ariza holati va profil/telefon o‘zgarishlari Gmail’ga server orqali yuboriladi. API kalit bu sahifada saqlanmaydi.</div></div>' +
    '<form data-form="mail-settings" class="col" style="gap:10px">' +
    '<div class="field"><label>Sinov uchun Gmail manzili</label><input class="inp" name="testEmail" type="email" placeholder="siz@gmail.com" value="' + esc(cfg.testEmail) + '">' +
    '<div class="inp-hint">Bu jo‘natuvchi emas — faqat «Sinov xabari» qabul qiluvchisi.</div></div>' +
    '<div class="row" style="gap:8px"><button class="btn btn-primary btn-sm grow" type="submit">' + ico('check', 'sm') + 'Saqlash</button>' +
    '<button class="btn btn-soft btn-sm" type="button" data-act="mail-test">' + ico('send', 'sm') + 'Sinov xabari</button></div>' +
    '<div class="inp-hint">Jo‘natuvchi email, Resend kaliti va Reply-To Cloudflare Pages secrets’da sozlanadi. Ular brauzerga chiqmaydi.</div>' +
    '</form><div class="divider"></div><div class="micro" style="margin-bottom:4px">Oxirgi xabarlar</div>' +
    (log.length ? log.map(m => {
      const ic = m.kind === 'reset' || m.kind === 'reset-done' ? 'lock' : m.kind === 'approved' ? 'check-c' : m.kind === 'rejected' ? 'x' : m.kind.indexOf('phone') === 0 ? 'phone' : 'send';
      const tag = m.status === 'sent' ? 'g' : m.status === 'failed' ? 'r' : m.status === 'setup' ? 'r' : 'o';
      return '<div class="mail-row"><div class="d">' + ico(ic, 'sm') + '</div>' +
        '<div class="grow" style="min-width:0"><div class="t">' + esc(m.subject) + '</div>' +
        '<div class="m">' + esc(m.to) + ' · ' + fmtTime(m.at) + (m.detail ? ' · ' + esc(m.detail) : '') + '</div></div>' +
        '<span class="tag ' + tag + '">' + esc(mailStatusLabel(m.status)) + '</span></div>';
    }).join('') : '<div class="xs muted">Hozircha xabar yo‘q — Gmail manzilini kiritib sinov yuboring.</div>') + '</div>';
}
function fmtTime(ts) {
  try {
    const d = new Date(ts);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' · ' + d.getDate() + ' ' + UZ_M[d.getMonth()];
  } catch (e) { return ''; }
}
