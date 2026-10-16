/* ==========================================================================
   AUTH, ROUTER, EVENTLAR, QIDIRUV, EKSPORT
   ========================================================================== */

/* ---------- Kirish ekrani ---------- */
function vAuth() {
  const role = UI.authRole;                 /* student | admin */
  const err = UI.authErr || '';
  /* Birinchi kirish: parol o'rnatish bosqichi */
  if (UI.firstPass) {
    const acc = accById(UI.firstPass.acc);
    if (!acc) { UI.firstPass = null; }
    else return '<div class="auth">' +
      '<div class="auth-art">' + authArt() + '</div>' +
      '<div class="auth-form"><div class="inner">' +
      '<span class="tag p" style="margin-bottom:12px">' + ico('shield', 'sm') + 'Birinchi kirish</span>' +
      '<h2 class="h1" style="font-size:24px">Parolni o‘rnatamiz</h2>' +
      '<p class="small muted" style="margin:8px 0 16px">Salom, <b>' + esc(acc.name) + '</b>! Sizning nickingiz: <span class="kbd">' + esc(acc.nick) + '</span>' +
      (acc.hemisId ? ' • HEMIS ID tasdiqlandi' : '') + '. Endi o‘zingizga parol o‘ylab toping — uni faqat siz bilib turasiz.</p>' +
      '<form data-form="first-pass" data-acc="' + esc(acc.id) + '" class="col" style="gap:13px">' +
      '<div class="field"><label>Yangi parol</label><div class="pwrap"><input class="inp" type="password" name="p1" minlength="4" required autocomplete="new-password" placeholder="Kamida 4 belgi"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      '<div class="field"><label>Parolni takrorlang</label><div class="pwrap"><input class="inp" type="password" name="p2" minlength="4" required autocomplete="new-password" placeholder="Xuddi shu parol"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      (err ? '<div class="form-err">' + ico('alert', 'sm') + esc(err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('check', 'sm') + 'Parolni saqlash va kirish</button>' +
      '</form>' +
      '<div class="inp-hint" style="margin-top:12px">Maslahat: ismingiz bilan bog‘liq oson parol tanlang, lekin boshqalarga aytmang.</div>' +
      '<button class="btn btn-ghost btn-sm btn-block" style="margin-top:10px" data-act="auth-back">' + ico('left', 'sm') + 'Orqaga</button>' +
      '</div></div></div>';
  }
  /* Birinchi ishga tushirish: hali hech qanday akkaunt yo'q — Founder o'zi yaratadi */
  if (needsSetup()) {
    return '<div class="auth">' +
      '<div class="auth-art">' + authArt() + '</div>' +
      '<div class="auth-form"><div class="inner">' +
      '<span class="tag a" style="margin-bottom:12px">' + ico('rocket', 'sm') + 'Birinchi ishga tushirish</span>' +
      '<h2 class="h1" style="font-size:24px">Founder akkauntini yaratamiz</h2>' +
      '<p class="small muted" style="margin:8px 0 16px">Platforma toza holatda ishga tushdi. ' +
      'Sizning akkauntingiz <b>to‘liq huquqli Founder</b> bo‘ladi: talaba qo‘shish, jamoa tuzish, dars va vazifa berish, adminlarni tayinlash.</p>' +
      '<form data-form="setup-founder" class="col" style="gap:13px">' +
      '<div class="field"><label>Ism va familiya</label><input class="inp" name="name" required placeholder="Masalan: Asilbek Yusupov"></div>' +
      '<div class="field"><label>Email (kirish uchun)</label><input class="inp" name="email" type="email" required placeholder="ism@aileaders.uz"></div>' +
      '<div class="grid g2" style="gap:12px">' +
      '<div class="field"><label>Parol</label><div class="pwrap"><input class="inp" type="password" name="p1" minlength="4" required autocomplete="new-password" placeholder="Kamida 4 belgi"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      '<div class="field"><label>Parolni takrorlang</label><div class="pwrap"><input class="inp" type="password" name="p2" minlength="4" required autocomplete="new-password" placeholder="Xuddi shu parol"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div></div>' +
      (err ? '<div class="form-err">' + ico('alert', 'sm') + esc(err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('check', 'sm') + 'Akkauntni yaratish va kirish</button>' +
      '</form>' +
      '<div class="inp-hint" style="margin-top:12px">Parolni hech kimga aytmang. Keyinchalik «Adminlar» bo‘limidan boshqa admin va mentorlarni qo‘shasiz.</div>' +
      '</div></div></div>';
  }
  /* Asosiy holat: LANDING sahifasi — kirish/ariza bo'limi skrolda ochiladi */
  return landingPage();
}
/* ============================================================================
   LANDING SAHIFA — tizimga kirmagan foydalanuvchi ko'radigan birinchi ekran.
   Tuzilish: qahramon (hero) → imkoniyatlar → jarayon → o'quv dasturi → savollar
   → KIRISH/ARIZA bo'limi (skrollda 3D «ochilish» animatsiyasi bilan).
   ============================================================================ */

/* Logotip (brend hexagon) — unique gradient id bilan */
function landLogo(id, sz) {
  return '<svg style="width:' + sz + 'px;height:' + sz + 'px;flex:0 0 auto" viewBox="0 0 64 64">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--brand)"/><stop offset="1" style="stop-color:var(--brand-2)"/></linearGradient></defs>' +
    '<path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" style="fill:var(--logo-fill)" stroke="url(#' + id + ')" stroke-width="2.6" stroke-linejoin="round"/>' +
    '<path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="url(#' + id + ')" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25.6 37.6h12.8" style="stroke:var(--accent)" stroke-width="4.6" stroke-linecap="round"/>' +
    '<circle cx="32" cy="17.8" r="3.7" style="fill:var(--accent)"/><circle cx="21" cy="46.5" r="3" style="fill:var(--brand-2)"/><circle cx="43" cy="46.5" r="3" style="fill:var(--brand)"/></svg>';
}
function landBrand() {
  return '<div class="lbrand">' + landLogo('lgL', 42) +
    '<div><div class="lbrand-t">AI LEADERS</div><div class="lbrand-s">STARTUP CLUB</div></div></div>';
}
/* Yuklash progress chizig'i + yopishqoq navigatsiya */
function landNav() {
  return '<div class="lprog" id="lprog" aria-hidden="true"></div>' +
    '<header class="lnav" id="lnav">' + landBrand() +
    '<nav class="lnav-links">' +
    [['#limkon', 'Imkoniyatlar'], ['#ljarayon', 'Jarayon'], ['#ldastur', 'Dastur'], ['#lsavol', 'Savollar']]
      .map(x => '<a href="' + x[0] + '" data-act="to-sec" data-sec="' + x[0] + '">' + esc(x[1]) + '</a>').join('') +
    '</nav>' +
    '<button class="btn-icon lnav-theme" data-act="theme" aria-label="Mavzu" title="Yorug‘/tungi rejim">' +
      ico(UI.theme === 'dark' ? 'sun' : 'moon', 'sm') + '</button>' +
    '<button class="btn btn-primary btn-sm lnav-cta" data-act="to-auth">' + ico('lock', 'sm') + 'Kirish</button>' +
    '</header>';
}
/* Qahramon bo'limi */
function landHero() {
  const nMod = S.modules.length, nL = S.lessons.length;
  return '<section class="lhero">' +
    '<div class="lhero-orb o1"></div><div class="lhero-orb o2"></div><div class="lhero-orb o3"></div>' +
    '<div class="lhero-grid-bg" aria-hidden="true"></div>' +
    '<div class="lhero-copy">' +
    '<span class="ltag rise" data-d="0">' + ico('spark', 'sm') + '0 dan startapgacha · Toshkent</span>' +
    '<h1 class="rise" data-d="1">G‘oyadan ishlaydigan mahsulotgacha — <em>jamoada, kuzatuv&nbsp;ostida</em>.</h1>' +
    '<p class="llede rise" data-d="2">AI Leaders — 0 dan boshlovchilar uchun amaliy klub. Platformada: yo‘l xaritasi, ' +
    'vazifa → deadline → mentor izohi → baho, jamoaviy loyihalar va reyting tizimi. Kirish — admin bergan ' +
    'shaxsiy <b>nick</b> bilan (HEMIS ID faqat ro‘yxatga olishda kerak).</p>' +
    '<div class="lcta rise" data-d="3">' +
    '<button class="btn btn-primary btn-lg" data-act="to-apply">' + ico('rocket', 'sm') + 'Hoziroq boshlash</button>' +
    '<button class="btn btn-soft btn-lg" data-act="to-auth">' + ico('lock', 'sm') + 'Tizimga kirish</button>' +
    '</div>' +
    '<div class="lchips rise" data-d="4">' +
    [[nf(nMod), 'modul', 'book'], [nf(nL), 'dars', 'code'], ['0–100', 'baholash', 'star'], ['8', 'yutuq', 'award']]
      .map(x => '<div class="lchip">' + ico(x[2], 'sm') + '<b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') +
    '</div></div>' +
    '<div class="lhero-float" aria-hidden="true">' +
    '<div class="lfcard a">' + ico('bolt', 'sm') + '<div><b>+120 XP</b><span>Vazifa qabul qilindi</span></div></div>' +
    '<div class="lfcard b">' + ico('flame', 'sm') + '<div><b>7 kun streak</b><span>Uzluksiz o‘qish</span></div></div>' +
    '<div class="lfcard c">' + ico('users', 'sm') + '<div><b>Nova jamoasi</b><span>3 a’zo · loyiha 80%</span></div></div>' +
    '</div>' +
    '<div class="lcue"><span class="lcue-m"></span>Pastga suring</div>' +
    '</section>';
}
/* Bo'lim sarlavhasi */
function landHead(tag, title, sub, d) {
  return '<div class="lhead reveal"' + (d ? ' data-d="' + d + '"' : '') + '>' +
    '<span class="ltag p">' + ico('spark', 'sm') + esc(tag) + '</span>' +
    '<h2 class="lh2">' + esc(title) + '</h2>' +
    (sub ? '<p class="lsub">' + esc(sub) + '</p>' : '') + '</div>';
}
/* Imkoniyatlar */
function landFeature() {
  const items = [
    ['task', 'Amaliy loyihalar', 'Har modul mini-loyiha bilan yakunlanadi: muammo → yechim → MVP → demo.'],
    ['star', 'Mentor izohi va baho', 'Har topshiriq 0–100 ballik tizimda baholanadi, izoh bilan qaytadi.'],
    ['users', 'Jamoada ishlash', '3–4 kishilik startap jamoalari, jamoa devori va umumiy topshiriqlar.'],
    ['clock', 'Aniq deadline', 'Har modulga muddat: kalendar, eslatmalar va kechikkanlar nazorati.'],
    ['flame', 'XP, streak, reyting', 'Kunlik faollik, coin, yutuqlar va jamoalar musobaqasi.'],
    ['cert', 'Sertifikat va Galereya', 'Dasturni tugatganlarga chop etiladigan sertifikat, loyihalar galereyasi.']
  ];
  return '<section class="lsec" id="limkon"><div class="lsec-in">' +
    landHead('Klub nima beradi', 'Bilim emas — ishlaydigan mahsulot', 'Har bir modul nazariya emas, amaliyot bilan tugaydi. Platforma jarayonni ko‘rinadigan qiladi: kim nima qildi, qachon, qanday baho oldi.', 0) +
    '<div class="lfeat">' + items.map((x, i) =>
      '<div class="lfeat-c reveal" data-d="' + (i % 3 + 1) + '"><div class="lfeat-ic">' + ico(x[0], 'sm') + '</div>' +
      '<h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p></div>').join('') + '</div></div></section>';
}
/* Jarayon: 4 qadam */
function landFlow() {
  const steps = [
    ['Ariza qoldirasiz', 'Quyidagi «Ariza» formasini to‘ldirasiz — ism, telefon va maqsad. 1 daqiqada.'],
    ['Admin akkaunt ochadi', 'Klub admini HEMIS ID asosida sizga akkaunt yaratadi va unikal nick beradi.'],
    ['Birinchi kirish', 'Admin bergan nick bilan kirasiz va parolni o‘zingiz o‘rnatasiz.'],
    ['Jamoa, vazifa, baho', 'Jamoaga qo‘shilasiz, vazifa va deadline olasiz, har ish baholanadi.']
  ];
  return '<section class="lsec" id="ljarayon"><div class="lsec-in">' +
    landHead('Qanday ishlaydi', '4 qadamda klubga qo‘shilasiz', 'Ro‘yxatdan o‘tish 1 daqiqa, qolganini klub hal qiladi.', 0) +
    '<div class="lflow">' + steps.map((x, i) =>
      '<div class="lstep reveal" data-d="' + (i + 1) + '"><div class="lstep-n">' + (i + 1) + '</div>' +
      '<h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></div>').join('') + '</div></div></section>';
}
/* O'quv dasturi (bazadan) */
function landProgram() {
  const mods = S.modules.map(m => ({ t: m.title, d: m.desc, i: m.icon || 'book', n: lessonsOfModule(m.id).length }));
  return '<section class="lsec" id="ldastur"><div class="lsec-in">' +
    landHead('O‘quv dasturi', '6 modul — noldan startapgacha', 'AI asoslaridan boshlab, jamoa bilan ishlaydigan loyihaga qadar. Har modul darslar va topshiriqlardan iborat.', 0) +
    '<div class="lprog-list">' + mods.map((m, i) =>
      '<div class="lmodc reveal" data-d="' + (i % 3 + 1) + '">' +
      '<div class="lmodc-h"><span class="lmodc-n">' + (i + 1) + '</span><div class="lmodc-ic">' + ico(m.i, 'sm') + '</div>' +
      '<b>' + esc(m.t) + '</b></div><p>' + esc(m.d) + '</p>' +
      '<span class="lmodc-l">' + ico('book', 'sm') + m.n + ' dars</span></div>').join('') + '</div>' +
    '<div class="lgame reveal" data-d="2">' +
    [['flame', 'Streak', 'Har kuni o‘qisangiz — seriya uzilmaydi'],
     ['bolt', 'XP va coin', 'Topshiriq va faollik uchun ball'],
     ['trophy', 'Reyting', 'Jamoalar va talabalar orasida musobaqa'],
     ['cert', 'Sertifikat', 'Dastur yakunida chop etiladigan hujjat']]
      .map(x => '<div class="lgame-c">' + ico(x[0], 'sm') + '<div><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div></div>').join('') +
    '</div></div></section>';
}
/* Savol-javob */
function landFaq() {
  const qa = [
    ['Tizimga kirish uchun nima kerak?', 'Klub adminingiz bergan <b>nick</b> va o‘zingiz o‘rnatgan parol. HEMIS ID kirishda ishlatilmaydi — u faqat ro‘yxatga olishda kerak.'],
    ['Hali a’zo emasman — nima qilaman?', '«Ariza» formasini to‘ldiring: ism, telefon va maqsad. Klub admini siz bilan bog‘lanadi, HEMIS ID ingizni kiritib akkaunt ochadi va <b>nick</b> beradi.'],
    ['Parolimni unutdim, nima qilaman?', 'Mentor yoki klub adminiga murojaat qiling — u parolni tiklab, qayta o‘rnatish imkonini beradi. Parollar bazada ochiq saqlanmaydi.'],
    ['Qancha vaqt o‘qiyman?', 'Dastur 6 modul • 29 darsdan iborat. Har modulga alohida deadline bor, o‘qish tezligini o‘zingiz belgilaysiz.'],
    ['Sertifikat beriladimi?', 'Ha. Dasturni yakunlab, topshiriqlarni muvaffaqiyatli topshirganlarga chop etiladigan sertifikat beriladi.']
  ];
  return '<section class="lsec" id="lsavol"><div class="lsec-in lsec-narrow">' +
    landHead('Savol-javob', 'Ko‘p so‘raladigan savollar', '', 0) +
    '<div class="lfaq">' + qa.map((x, i) =>
      '<div class="fq reveal" data-d="' + (i + 1) + '"><button class="fq-q" data-act="faq" aria-expanded="false">' +
      '<span>' + esc(x[0]) + '</span><span class="fq-i">' + ico('down', 'sm') + '</span></button>' +
      /* Javob matni shu faylda yozilgan (tashqi kiritma emas) — kichik teglar uchun xom qoldiriladi */
      '<div class="fq-a"><div class="fq-a-in">' + x[1] + '</div></div></div>').join('') + '</div></div></section>';
}
/* KIRISH + ARIZA bo'limi: skrollda 3D «ochilish» animatsiyasi bilan chiqadi */
function landAuthSection() {
  const role = UI.authRole;
  const err = UI.authErr || '';
  /* Uzun yorliq telefonda ikki qatorga bo'linmasin: ikkinchi qismi kichik ekranda yashiriladi */
  const tab = (r, l, ic) => {
    const sp = l.indexOf(' / ');
    const inner = sp > -1
      ? esc(l.slice(0, sp)) + '<span class="tt2">' + esc(l.slice(sp)) + '</span>'
      : esc(l);
    return '<button class="auth-tab' + (role === r ? ' on' : '') + '" data-act="pick-role" data-r="' + r + '">' + ico(ic, 'sm') + inner + '</button>';
  };
  let body = '';
  if (role === 'apply') {
    body = UI.leadDone
      ? '<div class="ldone">' + ico('check-c', 'big') +
        '<h3>Ariza qabul qilindi!</h3>' +
        '<p>Rahmat, <b>' + esc(UI.leadDone) + '</b>. Klub admini tez orada telefon orqali bog‘lanadi va ' +
        'HEMIS ID ingizni kiritib akkaunt ochadi va sizga <b>nick</b> beradi. Shundan keyin shu yerdan faqat nick bilan kirishingiz mumkin bo‘ladi.</p>' +
        '<button class="btn btn-soft" data-act="lead-reset">' + ico('plus', 'sm') + 'Yana ariza topshirish</button></div>'
      : (() => { const d0 = UI.leadDraft || {}; return '<form data-form="lead" class="col" style="gap:11px">' +
        '<div class="field"><label>Ism va familiya</label><input class="inp" name="name" required placeholder="Masalan: Dilnoza Karimova" value="' + esc(d0.name || '') + '"></div>' +
        '<div class="grid g2" style="gap:11px">' +
        '<div class="field"><label>Telefon</label><input class="inp" name="phone" inputmode="tel" required placeholder="+998 90 123 45 67" value="' + esc(d0.phone || '') + '"></div>' +
        '<div class="field"><label>Telegram</label><input class="inp" name="tg" placeholder="@username" value="' + esc(d0.tg || '') + '"></div></div>' +
        '<div class="field"><label>Maqsadingiz</label><textarea class="inp" name="goal" placeholder="Nima qilmoqchisiz? Masalan: AI yordamida mahsulot yasash">' + esc(d0.goal || '') + '</textarea></div>' +
        (err ? '<div class="form-err">' + ico('alert', 'sm') + esc(err) + '</div>' : '') +
        '<button class="btn btn-primary btn-block" type="submit">' + ico('send', 'sm') + 'Arizani yuborish</button>' +
        '<div class="inp-hint">Ariza klub adminiga tushadi. Akkaunt ochilgach, «Kirish» bo‘limidan foydalanasiz.</div>' +
        '</form>'; })();
  } else if (role === 'admin') {
    body = '<form data-form="login-admin" class="col" style="gap:12px">' +
      '<div class="field"><label>Email</label><input class="inp" name="login" required autocomplete="username" placeholder="ism@aileaders.uz"></div>' +
      '<div class="field"><label>Parol</label><div class="pwrap"><input class="inp" type="password" name="pass" autocomplete="current-password" placeholder="Parolingiz"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      (err ? '<div class="form-err">' + ico('alert', 'sm') + esc(err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('right', 'sm') + 'Admin panelga kirish</button>' +
      '</form>';
  } else {
    body = '<form data-form="login-student" class="col" style="gap:12px">' +
      '<div class="field"><label>Nick (kirish uchun)</label>' +
      '<input class="inp" name="login" required autocomplete="username" inputmode="text" autofocus placeholder="Masalan: falcon">' +
      '<div class="inp-hint">Nickni klub admini beradi. <b>HEMIS ID kirishda ishlatilmaydi</b> — u faqat ro‘yxatga olishda (adminga) topshiriladi.</div></div>' +
      '<div class="field"><label>Parol</label><div class="pwrap"><input class="inp" type="password" name="pass" autocomplete="current-password" placeholder="Parolingiz"><button type="button" class="eye" data-act="eye" aria-label="Parolni ko‘rsatish" title="Parolni ko‘rsatish">' + ico('eye', 'sm') + '</button></div></div>' +
      '<div class="row between" style="gap:10px"><span class="xs muted">Nickni eslay olmadingizmi?</span>' +
      '<button type="button" class="auth-help" data-act="auth-help">' + ico('help', 'sm') + 'Yordam olish</button></div>' +
      (err ? '<div class="form-err">' + ico('alert', 'sm') + esc(err) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" type="submit">' + ico('right', 'sm') + 'Talaba kabinetiga kirish</button>' +
      '</form>';
  }
  return '<section class="lauth" id="lkirish">' +
    '<div class="lauth-thread" aria-hidden="true"></div>' +
    '<div class="lauth-glow" aria-hidden="true"></div>' +
    '<div class="lauth-hero reveal" data-d="0">' +
    '<span class="ltag a">' + ico('lock', 'sm') + 'Kirish / Ro‘yxatdan o‘tish</span>' +
    '<h2 class="lh2">Klubga kirish shu yerdan boshlanadi</h2>' +
    '<p class="lsub">A’zo bo‘lsangiz — admingiz bergan <b>nick</b> bilan kirasiz. Hali a’zo emassizmi? Ariza qoldiring.</p>' +
    '</div>' +
    '<div class="lauth-wrap">' +
    '<div class="lauth-pitch reveal" data-d="1">' +
    [['shield', 'Parolni faqat siz bilasiz', 'Parolni birinchi kirishda o‘zingiz o‘rnatasiz — admin ham ko‘ra olmaydi.'],
     ['lock', 'Nick — yagona kalit', 'HEMIS ID ni adminga topshirasiz, u akkaunt ochib sizga nick beradi. Kirish faqat nick bilan.'],
     ['user', 'Talaba kabineti', 'Darslar, vazifalar, deadline, jamoa, yutuqlar va sertifikat.'],
     ['shield', 'Admin va mentor paneli', 'Talabalar, jamoalar, vazifalar, baholar, statistika va sozlamalar.']]
      .map(x => '<div class="lpitch-r"><span class="lpitch-ic">' + ico(x[0], 'sm') + '</span>' +
        '<div><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div></div>').join('') +
    '</div>' +
    '<div class="lauth-card rev-card">' +
    '<div class="auth-tabs">' + tab('student', 'Talaba', 'user') + tab('admin', 'Admin / Mentor', 'shield') + tab('apply', 'Ariza', 'send') + '</div>' +
    body +
    '<div class="lauth-note xs muted">© 2026 AI Leaders Startup Club • Toshkent</div>' +
    '</div>' +
    '</div></section>';
}
function landFoot() {
  return '<footer class="lfoot">' + landBrand() +
    '<div class="lfoot-links">' +
    '<a href="#limkon" data-act="to-sec" data-sec="#limkon">Imkoniyatlar</a>' +
    '<a href="#ljarayon" data-act="to-sec" data-sec="#ljarayon">Jarayon</a>' +
    '<a href="#ldastur" data-act="to-sec" data-sec="#ldastur">Dastur</a>' +
    '<a href="#lkirish" data-act="to-auth">Kirish</a></div>' +
    '<div class="xs muted">© 2026 AI Leaders Startup Club • Toshkent</div></footer>';
}
/* To'liq landing sahifasi */
function landingPage() {
  return '<div class="land">' + landNav() + landHero() + landFeature() + landFlow() + landProgram() + landFaq() + landAuthSection() + landFoot() + '</div>';
}
/* Landing interaktivligi: skrollda ochilish, progress, yopishqoq navigatsiya.
   IntersectionObserver yo'q bo'lsa (eski brauzer/test muhiti) — hammasi darhol ko'rinadi. */
function initLanding() {
  const root = document.querySelector('.land');
  if (!root) return;
  const targets = root.querySelectorAll('.reveal,.rev-card,.lauth');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(el => io.observe(el));
  }
  landTick();
  /* Tab almashganda yoki forma qayta chizilganda skrol o'rni saqlanadi */
  if (UI.landScrollKeep) { const y = UI.landScrollKeep; UI.landScrollKeep = null; try { window.scrollTo({ top: y, behavior: 'auto' }); } catch (e) { } }
}
/* Skrol holati: o'qish progressi + yopishqoq navigatsiya foni.
   Global scroll listener'dan chaqiriladi (listener takrorlanmaydi). */
function landTick() {
  const bar = document.getElementById('lprog'), nav = document.getElementById('lnav');
  if (!bar && !nav) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
  if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 28);
  /* Skrol-spy: hozir ko'rinib turgan bo'lim navda belgilanadi */
  if (!nav) return;
  const links = nav.querySelectorAll('[data-sec]');
  if (!links.length) return;
  /* Faol bo'lim: ko'rinish markazi qaysi bo'limda bo'lsa, o'sha yonadi */
  const mark = window.scrollY + window.innerHeight * 0.5;
  let active = '';
  links.forEach(a => {
    const el = document.getElementById((a.dataset.sec || '').slice(1));
    if (el && el.offsetTop <= mark) active = a.dataset.sec;
  });
  links.forEach(a => a.classList.toggle('on', a.dataset.sec === active));
}
/* Bo'limga yumshoq skrol */
function landScrollTo(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { try { window.scrollTo(0, el.offsetTop); } catch (e2) { } }
}
/* Kirish ekranining chap tomoni (brend + tavsif) */
function authArt() {
  const nMod = S.modules.length, nL = S.lessons.length;
  return '<div class="row auth-brand" style="gap:14px"><svg style="width:54px;height:54px" viewBox="0 0 64 64"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--brand)"/><stop offset="1" style="stop-color:var(--brand-2)"/></linearGradient></defs>' +
    '<path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" fill="rgba(10,15,30,.7)" stroke="url(#ag)" stroke-width="2.6" stroke-linejoin="round"/>' +
    '<path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="url(#ag)" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25.6 37.6h12.8" style="stroke:var(--accent)" stroke-width="4.6" stroke-linecap="round"/>' +
    '<circle cx="32" cy="17.8" r="3.7" style="fill:var(--accent)"/><circle cx="21" cy="46.5" r="3" style="fill:var(--brand-2)"/><circle cx="43" cy="46.5" r="3" style="fill:var(--brand)"/></svg>' +
    '<div><div style="font-size:19px;font-weight:850;letter-spacing:.12em">AI LEADERS</div><div class="xs" style="letter-spacing:.34em;color:#8C9CC8;font-weight:750">STARTUP CLUB</div></div></div>' +
    '<div class="spark-orb float-slow" style="width:260px;height:260px;background:var(--brand);top:16%;right:-60px"></div>' +
    '<div class="spark-orb float-slow" style="width:200px;height:200px;background:var(--brand-2);bottom:6%;left:-40px;animation-delay:1.4s"></div>' +
    '<div class="auth-copy">' +
    '<span class="tag p" style="margin-bottom:14px">' + ico('rocket', 'sm') + '0 dan startapgacha</span>' +
    '<h1 style="font-size:clamp(28px,4vw,44px);line-height:1.08;letter-spacing:-.03em;margin:14px 0 12px;font-weight:880">G‘oyadan ishlaydigan mahsulotgacha — jamoada, kuzatuv ostida.</h1>' +
    '<p class="t2" style="margin:0;max-width:46ch">AI Leaders — 0 dan boshlovchilarni startuplarga tayyorlaydigan klub. Platformada: yo‘l xaritasi, vazifa → deadline → jamoa → reyting tizimi.</p>' +
    '<div class="col" style="gap:11px;margin-top:22px">' +
    [['book', '6 modul • 29 dars', 'AI asoslari → promptlash → vibe coding → Claude Code → mini-loyiha → startap'],
     ['clock', 'Har modulga deadline', 'Vazifa topshirish, mentor izohi, baho (0–100)'],
     ['users', 'Jamoaviy ishlash', 'Jamoa devori, mentor juftligi, jamoalar musobaqasi'],
     ['flame', 'Streak va reyting', 'Kunlik XP, coin, 8 ta yutuq, Galereya']
    ].map(x => '<div class="row" style="gap:11px">' +
      '<div class="feat-ic">' + ico(x[0], 'sm') + '</div>' +
      '<div><div class="small" style="font-weight:750">' + esc(x[1]) + '</div><div class="xs muted">' + esc(x[2]) + '</div></div></div>').join('') +
    '</div></div>' +
    '<div class="grid g4 auth-stats">' + [[nf(nMod), 'modul'], [nf(nL), 'dars'], ['6', 'deadline'], ['0–100', 'baholash']].map(x =>
      '<div class="card tight soft tc"><div class="big">' + x[0] + '</div><div class="xs muted">' + x[1] + '</div></div>').join('') + '</div>';
}

/* ---------- Xabar modali ---------- */
function msgModal(id) {
  const fa = founderAcc();
  const p = id === 'admin' ? (fa ? { name: fa.name, role: (ADMIN_ROLES[fa.adminRole] || { l: 'Admin' }).l + ' • Admin', tg: '@' + fa.nick } : { name: 'AI Leaders', role: 'Klub', tg: '@aileaders' })
    : (get(S.students, id) || get(S.mentors, id) || { name: 'AI Leaders', role: 'Klub', tg: '@aileaders' });
  openModal(mhead('Xabar yozish', p.name + ' • ' + (p.tg || p.role || '')) +
    '<div class="card soft" style="max-height:190px;overflow:auto"><div class="col" style="gap:12px">' +
    '<div class="row" style="gap:9px;justify-content:flex-start"><div class="card tight soft" style="max-width:75%">Salom! Deadline yaqin, qanday ketyapti?</div></div>' +
    '<div class="row" style="gap:9px;justify-content:flex-end"><div class="card tight" style="max-width:75%;background:rgba(124,92,255,.18);border-color:rgba(124,92,255,.34)">Ishlayapman, kechqurun yuboraman</div></div>' +
    '</div></div>' +
    '<form data-form="msg" data-to="' + esc(id) + '" style="margin-top:12px">' +
    '<div class="field"><textarea class="inp" name="text" placeholder="Xabar yozing…" required></textarea></div>' +
    '<div class="row" style="gap:9px;margin-top:10px">' +
    '<div class="row wrap" style="gap:7px;flex:1"><button type="button" class="chip" data-act="quick-reply" data-t="Rahmat!">Rahmat!</button>' +
    '<button type="button" class="chip" data-act="quick-reply" data-t="Yordam kerak">Yordam kerak</button>' +
    '<button type="button" class="chip" data-act="quick-reply" data-t="Bugun topshiraman">Bugun topshiraman</button></div>' +
    '<button class="btn btn-primary" type="submit">' + ico('send', 'sm') + 'Yuborish</button></div></form>', 'narrow');
}
function profileModal() {
  const st = me();
  openModal(mhead('Profilni tahrirlash', 'Ma’lumotlar mentor va reytingda ko‘rinadi') +
    '<form data-form="profile" class="col" style="gap:13px">' +
    '<div class="field"><label>To‘liq ism</label><input class="inp" name="name" value="' + esc(st.name) + '" required></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Telegram</label><input class="inp" name="tg" value="' + esc(st.tg) + '"></div>' +
    '<div class="field"><label>Telefon</label><input class="inp" name="phone" value="' + esc(st.phone) + '"></div></div>' +
    '<div class="field"><label>Maqsadim</label><input class="inp" name="goal" value="' + esc(st.goal) + '"></div>' +
    '<div class="field"><label>Men haqimda</label><textarea class="inp" name="bio">' + esc(st.bio) + '</textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('check', 'sm') + 'Saqlash</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}
function searchModal(q) {
  const ql = q.toLowerCase();
  const l = S.lessons.filter(x => x.t.toLowerCase().includes(ql)).slice(0, 5);
  const t = S.tasks.filter(x => x.title.toLowerCase().includes(ql) || x.brief.toLowerCase().includes(ql)).slice(0, 4);
  const s = S.students.filter(x => x.name.toLowerCase().includes(ql) || (myGroup(x) || {}).name && myGroup(x).name.toLowerCase().includes(ql)).slice(0, 5);
  const g = S.groups.filter(x => x.name.toLowerCase().includes(ql) || x.project.toLowerCase().includes(ql)).slice(0, 3);
  openModal(mhead('Qidiruv: “' + q + '”', l.length + t.length + s.length + g.length + ' natija') +
    (l.length ? '<div class="up muted" style="margin-bottom:8px">Darslar</div><div class="col" style="gap:7px;margin-bottom:14px">' + l.map(x => '<button class="lrow press" style="width:100%;text-align:left" data-act="' + 'lesson-open' + '" data-id="' + x.id + '"><div class="lead">' + ico('book', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.t) + '</div><div class="xs muted">' + x.dur + ' daq • ' + fmtD(x.d) + '</div></div></button>').join('') + '</div>' : '') +
    (t.length ? '<div class="up muted" style="margin-bottom:8px">Vazifalar</div><div class="col" style="gap:7px;margin-bottom:14px">' + t.map(x => '<button class="lrow press" style="width:100%;text-align:left" data-act="' + 'task-open' + '" data-id="' + x.id + '"><div class="lead">' + ico('task', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.title) + '</div><div class="xs muted">Deadline: ' + fmtFull(x.dl) + '</div></div></button>').join('') + '</div>' : '') +
    (s.length ? '<div class="up muted" style="margin-bottom:8px">Talabalar</div><div class="col" style="gap:7px;margin-bottom:14px">' + s.map(x => '<button class="lrow press" style="width:100%;text-align:left" data-act="' + (isAdmin() ? 'student-open' : 'msg') + '" data-id="' + x.id + '"><div class="lead">' + ico('user', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.name) + '</div><div class="xs muted">' + esc(myGroup(x) ? myGroup(x).name : '—') + ' • ' + nf(x.xp) + ' XP</div></div></button>').join('') + '</div>' : '') +
    (g.length ? '<div class="up muted" style="margin-bottom:8px">Jamoalar</div><div class="col" style="gap:7px">' + g.map(x => '<div class="lrow"><div class="lead">' + ico('flag', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.name) + '</div><div class="xs muted ellip">' + esc(x.project) + '</div></div></div>').join('') + '</div>' : '') +
    (!l.length && !t.length && !s.length && !g.length ? '<div class="empty">Hech narsa topilmadi. Boshqa so‘z bilan urinib ko‘ring.</div>' : ''), 'wide');
}
function downloadBlob(content, filename, mime) {
  try {
    const blob = new Blob(['\ufeff' + content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) { } }, 4000);
    return true;
  } catch (e) { return false; }
}
function exportCSV() {
  const rows = [['Ism', 'Jamoa', 'XP', 'Haftalik XP', 'Progress %', 'Qabul qilingan', 'Ortacha ball', 'Streak', 'Faollik']];
  S.students.forEach(s => rows.push([s.name, (myGroup(s) || {}).name || '-', s.xp, s.wxp, progress(s).pct, acceptedOf(s), s.score, s.streak, s.act ? 'faol' : 'jim']));
  const csv = rows.map(r => r.join(';')).join('\n');
  if (downloadBlob(csv, 'ai-leaders-statistika.csv', 'text/csv;charset=utf-8')) toast('ok', 'Hisobot tayyor', 'ai-leaders-statistika.csv yuklab olindi.');
  else toast('err', 'Yuklab bo‘lmadi', 'Brauzer ruxsat bermadi. Boshqa brauzerda urinib ko‘ring.');
}

function downloadState() {
  if (downloadBlob(JSON.stringify(S, null, 1), 'ai-leaders-zaxira-' + todayISO() + '.json', 'application/json'))
    toast('ok', 'Zaxira nusxa yuklandi', 'Faylni xavfsiz joyda saqlang (Google Drive / Telegram).');
  else toast('err', 'Zaxira olinmadi', 'Brauzer ruxsat bermadi.');
}
function importState(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d || !Array.isArray(d.students) || !Array.isArray(d.lessons)) throw new Error('format');
      S = d; save();
      toast('ok', 'Zaxiradan tiklandi', d.students.length + ' talaba, ' + d.lessons.length + ' dars yuklandi.');
      UI.authShow = true; paint();
    } catch (e) { toast('err', 'Fayl o‘qilmadi', 'To‘g‘ri zaxira faylini tanlang (.json).'); }
  };
  r.readAsText(file);
}
function exportMyCSV() {
  const st = me();
  const rows = [['Vazifa', 'Modul', 'Deadline', 'Holat', 'Baho', 'Yuborilgan', 'Mentor izohi']];
  deadlinesOf(st).forEach(d => rows.push([d.t.title, modOf(d.t.m).n + '-modul', d.due, (STATUS[d.s ? d.s.status : 'none']).l, d.s && d.s.score != null ? d.s.score : '-', d.s ? d.s.at : '-', (d.s && d.s.fb) || '-']));
  const csv = rows.map(r => r.map(v => String(v).replace(/;/g, ',')).join(';')).join('\n');
  if (downloadBlob(csv, 'ai-leaders-' + st.name.toLowerCase().replace(/\s+/g, '-') + '-natijalar.csv', 'text/csv;charset=utf-8'))
    toast('ok', 'Natijalar yuklandi', 'CSV faylni Excel yoki Google Sheets’da ochish mumkin.');
  else toast('err', 'Yuklab bo‘lmadi', 'Brauzer ruxsat bermadi.');
}

/* ---------- Render ---------- */
const ROUTES = { home: vHome, lessons: vLessons, tasks: vTasks, team: vTeam, deadlines: vDeadlines, friends: vFriends, info: vInfo,
  admin: vAdmin, students: vStudents, adminTasks: vAdminTasks, adminLessons: vAdminLessons, adminGroups: vAdminGroups, adminDeadlines: vAdminDeadlines, stats: vStats, settings: vAdminSettings, adminAdmins: vAdminAdmins };
const STUDENT_ONLY = ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];
const ADMIN_ONLY = ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'adminAdmins', 'stats', 'settings'];
function currentView() {
  /* rol himoyasi: noto‘g‘ri bo‘limga kirilganda o‘z paneliga qaytarish */
  let route = UI.route;
  if (isAdmin() && STUDENT_ONLY.includes(route)) route = 'admin';
  if (!isAdmin() && ADMIN_ONLY.includes(route)) route = 'home';
  if (isAdmin() && !canView(route)) return permGate(route);
  const fn = ROUTES[route] || ROUTES[isAdmin() ? 'admin' : 'home'];
  return fn();
}
/* Ruxsati yo'q bo'lim: nima uchun yopiq ekanini tushuntiradigan sahifa */
function permGate(route) {
  const me = meAcc() || {};
  const need = ADMIN_SECTION_PERM[route];
  const isF = need === '__founder';
  const sec = (navDefs[route] || {}).l || 'Bu bo‘lim';
  const needName = isF ? 'Founder huquqi' : ('«' + (PERM_LABEL[need] || need || '') + '» huquqi');
  return '<div class="card" style="max-width:640px"><div class="empty">' + ico('lock') +
    '<div style="margin-top:10px;font-weight:750;font-size:16px">' + (isF ? 'Bu bo‘lim faqat Founder uchun ochiq' : '«' + esc(sec) + '» bo‘limi sizga yopiq') + '</div>' +
    '<div class="small muted" style="margin-top:8px;max-width:460px;margin-left:auto;margin-right:auto;line-height:1.65">' +
    'Sizning rolingiz: <b>' + esc((ADMIN_ROLES[me.adminRole] || { l: 'Admin' }).l) + '</b>. Kirish uchun ' + esc(needName) + ' kerak. ' +
    'Ruxsatni <b>Founder</b>' + (founderAcc() && founderAcc().email ? ' (' + esc(founderAcc().email) + ')' : '') + ' yoki bosh mentor beradi.</div>' +
    '<div class="row wrap" style="gap:10px;justify-content:center;margin-top:16px">' +
    '<button class="btn btn-primary" data-act="perm-ask" data-route="' + esc(route) + '">' + ico('bell', 'sm') + 'Ruxsat so‘rash</button>' +
    '<button class="btn btn-soft" data-act="go" data-route="admin">' + ico('grid', 'sm') + 'Dashboardga qaytish</button>' +
    '</div></div></div>';
}
function contentFoot() {
  const adm = isAdmin();
  const links = adm
    ? [['admin', 'Dashboard'], ['students', 'Talabalar'], ['adminTasks', 'Vazifalar'], ['adminGroups', 'Jamoalar'], ['stats', 'Statistika']]
    : [['home', 'Bosh sahifa'], ['lessons', 'Darslar'], ['tasks', 'Vazifalar'], ['deadlines', 'Deadline'], ['friends', 'Friends']];
  return '<footer class="content-foot">' +
    '<div class="cf-brand"><svg style="width:26px;height:26px" viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" fill="rgba(10,15,30,.7)" stroke="url(#agf)" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="url(#agf)" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25.6 37.6h12.8" style="stroke:var(--accent)" stroke-width="4.6" stroke-linecap="round"/>' +
    '<defs><linearGradient id="agf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--brand)"/><stop offset="1" style="stop-color:var(--brand-2)"/></linearGradient></defs></svg>' +
    '<span><b>AI Leaders</b> <em>Startup Club</em></span></div>' +
    '<nav class="cf-links" aria-label="Tezkor havolalar">' + links.map(l =>
      '<a href="#" data-act="go" data-route="' + l[0] + '">' + esc(l[1]) + '</a>').join('') + '</nav>' +
    '<div class="cf-meta"><span>© ' + new Date().getFullYear() + ' · Toshkent</span>' +
    '<span class="cf-dot">•</span><span>v' + APP_VERSION + ' · MVP</span>' +
    '<button class="cf-help" data-act="shortcuts" title="Klaviatura yorliqlari">' + ico('help', 'sm') + '<span>Yorliqlar</span></button></div></footer>';
}
function renderApp() {
  if (UI.authShow) return vAuth();
  return sidebar() + '<div class="main">' + topbar() + '<div class="content">' + currentView() + contentFoot() + '</div></div>' + bottomnav() + toTopBtn();
}
function paint(keepScroll) {
  rcClear(); /* kesh faqat bitta chizish davomida amal qiladi */
  const el = document.getElementById('app');
  el.className = UI.authShow ? 'app authscreen' : 'app' + (UI.collapsed ? ' collapsed' : '');
  el.innerHTML = renderApp();
  if (!keepScroll) { try { if (window.scrollY) window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { } }
  const gs = document.getElementById('gsearch');
  if (gs) { gs.value = UI.search; gs.onkeydown = e => { if (e.key === 'Enter') { UI.search = gs.value.trim(); if (UI.search) searchModal(UI.search); } }; }
  const top = document.getElementById('toTop');
  if (top && window.scrollY > 640) top.classList.add('show');
  if (UI.authShow) initLanding();   /* landing: skrollda ochilish animatsiyasi */
  craftPaint();   /* craft qatlami: jonli lenta, faollik xaritasi, sarlavha sayqali */
}
function go(route) {
  if (isAdmin() && STUDENT_ONLY.includes(route)) route = 'admin';
  if (!isAdmin() && ADMIN_ONLY.includes(route)) route = 'home';
  UI.route = route; UI.module = null; closeModal(); paint();
}
/* Kirishni yakunlash: sessiya, marshrut, xabar */
function finishLogin(acc, silent) {
  signIn(acc);
  UI.authShow = false; UI.authErr = ''; UI.firstPass = null;
  const want = UI.pendingGo;
  const okWant = want && (acc.role === 'admin' ? ADMIN_ONLY : STUDENT_ONLY).includes(want);
  UI.route = okWant ? want : (acc.role === 'admin' ? 'admin' : 'home');
  UI.pendingGo = null;
  closeModal();   /* kirish/parol oynasi ochiq qolmasin */
  save(); paint();
  if (!silent) toast('ok', acc.role === 'admin' ? 'Admin panel ochildi' : 'Xush kelibsiz, ' + acc.name.split(' ')[0] + '!',
    acc.role === 'admin' ? 'Rol: ' + (ADMIN_ROLES[acc.adminRole] || { l: 'Admin' }).l : 'Nick: @' + acc.nick + ' • bugungi reja Bosh sahifada.');
}

/* ---------- Eventlar ---------- */
/* Bo'lim ruxsatlariga bog'langan amallar jadvali (null = faqat Founder) */
const ACT_PERM = {
  'new-student': 'students', 'reset-student': 'students', 'reset-student-do': 'students', 'student-open': 'students',
  'delete-student': null, 'delete-student-do': null, 'move-student': 'students', 'filter-s': 'students',
  'new-admin': null, 'admin-edit': null, 'admin-del': null, 'admin-block': null, 'new-mentor': 'content', 'del-mentor': 'content',
  'new-task': 'tasks', 'review-open': 'tasks', 'task-review': 'tasks', 'deadline-open': 'tasks', 'del-dl': 'tasks',
  'new-lesson': 'content', 'lesson-edit': 'content', 'del-lesson': 'content', 'new-module': 'content', 'del-module': 'content',
  'new-lesson-mod': 'content', 'new-gallery': 'content', 'del-gallery': 'content',
  'new-group': 'groups', 'group-add': 'groups', 'group-add-member': 'groups', 'group-remove': 'groups', 'del-group': 'groups', 'change-group': 'groups',
  'export': 'stats', 'export-json': 'settings', 'reset-confirm': 'settings', 'reset-do': 'settings'
};
/* Amal ruxsati: ruxsat yo'q bo'lsa xabar beriladi va amal bajarilmaydi */
function actAllowed(act) {
  if (!Object.prototype.hasOwnProperty.call(ACT_PERM, act)) return true;
  const need = ACT_PERM[act];
  if (need === null) { if (!isAdmin() || isFounder()) return true; permDenied('admins'); return false; }
  if (!isAdmin() || actionAllowed(need)) return true;
  permDenied(need); return false;
}
document.addEventListener('click', e => {
  const backdrop = e.target.classList && e.target.classList.contains('mback');
  if (backdrop) { closeModal(); return; }
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const a = t.dataset.act, id = t.dataset.id, st = () => me();
  if (!actAllowed(a)) return;
  switch (a) {
    case 'go': e.preventDefault(); go(t.dataset.route); break;
    case 'go-team': go(isAdmin() ? 'adminGroups' : 'team'); break;
    case 'go-settings': go('settings'); break;
    case 'import-csv': csvImportModal(UI.csvReport || null); break;
    case 'import-undo': {
      if (!UI.lastImport) break;
      const u = undoImport(UI.lastImport);
      UI.lastImport = null;
      toast('warn', 'Import bekor qilindi', u.students + ' talaba, ' + u.accounts + ' akkaunt va ' + u.groups + ' jamoa olib tashlandi.');
      closeModal(); paint(true); break;
    }
    case 'palette': openPalette(); break;
    case 'pal-run': { const it = (PAL.visible || [])[parseInt(t.dataset.idx, 10)]; if (it) runPalette(it.act); break; }
    case 'shortcuts': shortcutsModal(); break;
    case 'collapse': toggleCollapse(); break;
    case 'to-top': try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { } break;
    case 'sort': {
      const k = t.dataset.k;
      if (UI.sort.k === k) UI.sort.d = -UI.sort.d; else { UI.sort.k = k; UI.sort.d = (k === 'name' || k === 'group') ? 1 : -1; }
      paint(true); break;
    }
    case 'reset-confirm': if (!actionAllowed('settings')) { permDenied('settings'); break; }
      confirmModal('Barcha ma’lumotni o‘chirish?', 'Talabalar, jamoalar, vazifalar, baholar va akkauntlar butunlay o‘chadi — platforma noldan boshlanadi va Founder akkauntini qaytadan yaratasiz. Avval zaxira nusxa olishni tavsiya qilamiz. Bu amalni qaytarib bo‘lmaydi.', 'reset-do', '', true); break;
    case 'reset-do': resetAll(); break;
    case 'install': {
      const ev = UI.installEvt;
      if (ev) { ev.prompt(); ev.userChoice && ev.userChoice.then(c => { if (c.outcome === 'accepted') toast('ok', 'Ilova o‘rnatildi', 'Endi AI Leaders telefon ekranidan ochiladi.'); UI.installEvt = null; paint(true); }); }
      else toast('info', 'O‘rnatish yo‘riqnomasi', 'Brauzer menyusidan “Bosh ekranga qo‘shish” (Add to Home Screen) ni tanlang.');
      break;
    }
    case 'export-json': downloadState(); break;
    case 'export-my': exportMyCSV(); break;
    case 'lesson-edit': editLessonModal(id); break;
    case 'review-edit': reviewEditModal(t.dataset.sub); break;
    case 'new-gallery': addGalleryModal(); break;
    case 'new-mentor': addMentorModal(); break;
    case 'del-gallery': { const i = S.gallery.findIndex(x => x.id === id); if (i > -1) { confirmModal('Loyihani galereyadan olib tashlash?', S.gallery[i].t, 'del-gallery-do', id, true); } break; }
    case 'del-gallery-do': { const i = S.gallery.findIndex(x => x.id === id); if (i > -1) S.gallery.splice(i, 1); toast('info', 'Galereyadan olib tashlandi'); save(); closeModal(); paint(true); break; }
    case 'del-mentor': {
      const m = get(S.mentors, id);
      const gs = S.groups.filter(g => g.mentor === id).length;
      confirmModal('Mentorni o‘chirish?', (m ? m.name : '') + (gs ? ' • ' + gs + ' jamoa boshqa mentorga o‘tadi' : ''), 'del-mentor-do', id, true);
      break;
    }
    case 'del-mentor-do': {
      const i = S.mentors.findIndex(m => m.id === id);
      if (i > -1 && S.mentors.length > 1) {
        S.mentors.splice(i, 1);
        const fallback = S.mentors[0].id;
        S.groups.forEach(g => { if (g.mentor === id) g.mentor = fallback; });
        toast('info', 'Mentor o‘chirildi');
      } else toast('warn', 'O‘chirilmadi', 'Kamida bitta mentor qolishi kerak.');
      save(); closeModal(); paint(true); break;
    }
    case 'reset-student': { const stx = get(S.students, id); confirmModal('Progressni tiklash?', stx.name + ' — barcha tugatilgan darslar va topshiriqlar holati tozalanadi.', 'reset-student-do', id, true); break; }
    case 'reset-student-do': {
      const stx = get(S.students, id);
      stx.done = []; stx.xp = 0; stx.wxp = 0; stx.coins = 0; stx.streak = 0; stx.score = 0;
      S.submissions = S.submissions.filter(p => p.st !== id);
      pushNotif(id, 'Progress tiklandi', 'Mentor hisobingizni yangiladi — 1-moduldan qayta boshlaysiz.', 'refresh');
      toast('ok', 'Progress tiklandi', stx.name + ' noldan boshlaydi.'); save(); closeModal(); paint(true); break;
    }
    case 'delete-student': { const stx = get(S.students, id); confirmModal('Talabani klubdan chiqarish?', stx.name + ' — profili, topshiriqlari va do‘stlik aloqalari o‘chiriladi.', 'delete-student-do', id, true); break; }
    case 'delete-student-do': {
      const stx = get(S.students, id);
      S.students = S.students.filter(x => x.id !== id);
      S.submissions = S.submissions.filter(p => p.st !== id);
      S.groups.forEach(g => g.members = g.members.filter(x => x !== id));
      Object.keys(S.friends).forEach(k => { S.friends[k] = (S.friends[k] || []).filter(x => x !== id); });
      if (S.user === id) S.user = S.students[0].id;
      toast('warn', 'Talaba chiqarildi', stx.name); save(); closeModal(); paint(true); break;
    }
    case 'locked': toast('warn', 'Dars yopiq', 'Oldingi modul vazifasi qabul qilingach ochiladi.'); break;
    case 'filter-s': UI.studentsFilter = t.dataset.f; paint(true); break;
    case 'close-modal': closeModal(); break;
    case 'play-mock': toast('info', 'Demo pleyer', 'Haqiqiy versiyada bu yerda video dars ochiladi.'); break;
    case 'theme': {
      const n = UI.theme === 'dark' ? 'light' : 'dark';
      UI.theme = n; S.theme = n; document.documentElement.dataset.theme = n; save(); paint(true); break;
    }
    case 'logout': logoutAcc(); break;
    case 'auth-back': UI.firstPass = null; UI.authErr = ''; paint(true); break;
    case 'auth-help': openModal(mhead('Kirish bo‘yicha yordam', 'Talaba va admin uchun') +
      '<div class="col" style="gap:11px">' +
      [['user', 'Talaba qanday kiradi?', 'Faqat shaxsiy nick + parol. Nickni klub admini beradi (HEMIS ID ni admin ro‘yxatga olishda ishlatadi).'],
       ['shield', 'Admin qanday kiradi?', 'Email + parol. Adminlar qo‘lda qo‘shiladi, parolni birinchi kirishda o‘zi o‘rnatadi.'],
       ['alert', 'Parolni unutdim', 'Mentor yoki klub adminiga murojaat qiling — parolni noldan o‘rnatib beradi.'],
       ['check', 'Birinchi kirish', 'Akkaunt yangi ochilgan bo‘lsa, tizim parolni o‘zingiz o‘rnatishni taklif qiladi.']
      ].map(x => '<div class="lrow"><div class="lead">' + ico(x[0]) + '</div><div><div class="small" style="font-weight:750">' + esc(x[1]) + '</div><div class="xs muted">' + esc(x[2]) + '</div></div></div>').join('') +
      '</div>', 'narrow'); break;
    case 'reset': resetAll(); break;
    case 'notifs': notifModal(); paint(true); break;
    case 'pick-role': UI.authRole = t.dataset.r; UI.authErr = ''; paint(true); break;
    case 'eye': {
      /* Parolni ko'rsatish/yashirish — forma qayta chizilmaydi */
      const w = t.closest('.pwrap'), inp0 = w && w.querySelector('input');
      if (!inp0) break;
      const show = inp0.type === 'password';
      inp0.type = show ? 'text' : 'password';
      t.classList.toggle('on', show);
      t.innerHTML = ico(show ? 'eye-off' : 'eye', 'sm');
      const lbl = show ? 'Parolni yashirish' : 'Parolni ko‘rsatish';
      t.setAttribute('aria-label', lbl); t.setAttribute('title', lbl);
      inp0.focus();
      break;
    }
    /* --- Landing sahifasi: bo'limlarga skrol va ariza oqimi --- */
    case 'to-auth': UI.authRole = 'student'; UI.authErr = ''; UI.leadDone = null; paint(true); landScrollTo('#lkirish'); break;
    case 'to-apply': UI.authRole = 'apply'; UI.authErr = ''; paint(true); landScrollTo('#lkirish'); break;
    case 'to-sec': landScrollTo(t.dataset.sec || ''); break;
    case 'faq': {
      const fq = t.closest('.fq');
      if (fq) t.setAttribute('aria-expanded', fq.classList.toggle('open') ? 'true' : 'false');
      break;
    }
    case 'lead-reset': UI.leadDone = null; UI.authErr = ''; paint(true); landScrollTo('#lkirish'); break;
    case 'lead-approve': {
      const l = (S.leads || []).find(x => x.id === id);
      if (l) addStudentModal({ name: l.name, phone: fmtPhone(l.phone), tg: l.tg, goal: l.goal, lead: l.id });
      break;
    }
    case 'del-lead': {
      const l2 = (S.leads || []).find(x => x.id === id);
      if (l2) confirmModal('Arizani o‘chirish?', l2.name + ' (' + l2.phone + ') — ariza ro‘yxatdan olib tashlanadi.', 'del-lead-do', id, true);
      break;
    }
    case 'del-lead-do': delLead(id); toast('warn', 'Ariza o‘chirildi', 'Ro‘yxatdan olib tashlandi.'); closeModal(); paint(true); break;
    case 'quest': {
      const q = ensureQuests(st());
      if (q.done.includes(id)) { toast('info', 'Bajarilgan', 'Bu topshiriq bugun allaqachon bajarildi.'); break; }
      const x = QUESTS.find(z => z.id === id);
      q.done.push(id); addXp(st(), x.xp, 5); save(); paint(); break;
    }
    case 'lesson-done': {
      const l = lessonOf(id), s0 = st(), before = modulePct(s0, l.m).pct;
      if (!s0.done.includes(id)) { s0.done.push(id); addXp(s0, 20, 10, 'q1'); }
      const after = modulePct(s0, l.m);
      if (before < 100 && after.pct === 100) {
        pushNotif(s0.id, 'Sertifikat ochildi', 'Modul ' + modOf(l.m).n + ' to‘liq tugatildi. Ma’lumot bo‘limida ko‘ring.', 'cert');
        toast('ok', 'Modul tugatildi!', modOf(l.m).n + '-modul 100% — sertifikat Ma’lumot bo‘limiga qo‘shildi.');
      } else toast('ok', 'Dars tugatildi', '+20 XP hisobingizga qo‘shildi.');
      closeModal(); save(); paint(true); break;
    }
    case 'lesson-open': lessonModal(lessonOf(id)); break;
    case 'module-open': {
      const m = modOf(id);
      if (m && m.n > unlockedCount(st())) { toast('warn', 'Modul yopiq', 'Avvalgi modul vazifasi qabul qilinishi kerak.'); break; }
      UI.module = id; UI.route = 'lessons'; closeModal(); paint(); break;
    }
    case 'module-back': UI.module = null; paint(); break;
    case 'submit-open': submitModal(taskOf(id)); break;
    case 'task-open': {
      if (isAdmin()) { toast('info', 'Vazifa', taskOf(id).title); break; }
      const p = subOf(st(), id);
      p ? subViewModal(p) : submitModal(taskOf(id));
      break;
    }
    case 'review-open': subViewModal(get(S.submissions, t.dataset.sub)); break;
    case 'team-submit': teamSubmitModal(taskOf(id)); break;
    case 'quiz-submit': {
      const l = lessonOf(id), qs = QUIZZES[id] || [];
      if (!qs.length) break;
      let ok = 0;
      qs.forEach((q, i) => { const sel = document.querySelector('.mbox input[name="q' + i + '"]:checked'); if (sel && parseInt(sel.value, 10) === q.a) ok++; });
      S.quizDone = S.quizDone || {};
      const list = S.quizDone[st().id] = S.quizDone[st().id] || [];
      const first = !list.includes(id);
      if (first) list.push(id);
      const passed = ok >= Math.ceil(qs.length * 0.67);
      if (passed && first) addXp(st(), 15, 5);
      toast(passed ? 'ok' : 'warn', 'Natija: ' + ok + '/' + qs.length, passed ? (first ? 'A’lo! +15 XP qo‘shildi.' : 'Yana bir bor mustahkamlash yaxshi.') : 'Darsni qayta ko‘rib chiqish tavsiya etiladi.');
      save(); lessonModal(l); break;
    }
    case 'open-file': {
      const p = get(S.submissions, t.dataset.sub);
      if (p && p.fileData) {
        const a = document.createElement('a');
        a.href = p.fileData; a.download = p.file || 'ai-leaders-fayl';
        document.body.appendChild(a); a.click(); a.remove();
        toast('ok', 'Fayl yuklanmoqda', p.file);
      } else toast('info', 'Fayl mavjud emas', 'Talaba faqat fayl nomini kiritgan.');
      break;
    }
    case 'nudge': {
      const s = get(S.students, id) || st();
      pushNotif(s.id, 'Mentor eslatmasi', 'Deadline yaqinlashdi — iltimos, vazifani tekshirishga yuboring yoki sababini yozing.', 'bell');
      toast('ok', 'Eslatma yuborildi', s.name + ' nomiga bildirishnoma ketdi.'); save(); break;
    }
    case 'student-open': adminStudentModal(get(S.students, id)); break;
    case 'msg': msgModal(id); break;
    case 'quick-reply': { const ta = document.querySelector('.mbox textarea'); if (ta) ta.value = t.dataset.t; break; }
    case 'filter': UI.taskFilter = t.dataset.f; paint(true); break;
    case 'filter2': UI.reviewFilter = t.dataset.f; paint(true); break;
    case 'ftab': UI.friendTab = t.dataset.t; paint(true); break;
    case 'fadd': {
      const meId = st().id;
      (S.sent[meId] = S.sent[meId] || []).push(id);
      (S.incoming[id] = S.incoming[id] || []).push(meId);
      toast('ok', 'So‘rov yuborildi', get(S.students, id).name + ' javobini kutamiz.'); save(); paint(true); break;
    }
    case 'freply': {
      const meId = st().id, y = t.dataset.y === '1';
      S.incoming[meId] = (S.incoming[meId] || []).filter(x => x !== id);
      if (y) { (S.friends[meId] = S.friends[meId] || []).push(id); (S.friends[id] = S.friends[id] || []).push(meId); toast('ok', 'Yangi do‘st!', get(S.students, id).name + ' ro‘yxatga qo‘shildi.'); }
      else toast('info', 'So‘rov rad etildi', '');
      save(); paint(true); break;
    }
    case 'funreq': { const meId = st().id; S.sent[meId] = (S.sent[meId] || []).filter(x => x !== id); S.incoming[id] = (S.incoming[id] || []).filter(x => x !== meId); save(); paint(true); break; }
    case 'unfriend': { const meId = st().id; S.friends[meId] = (S.friends[meId] || []).filter(x => x !== id); S.friends[id] = (S.friends[id] || []).filter(x => x !== meId); toast('info', 'Do‘stlar ro‘yxatidan chiqarildi'); save(); paint(true); break; }
    case 'challenge': { pushNotif(id, 'XP musobaqasi', st().name + ' sizni haftalik ball musobaqasiga chorladi!', 'trophy'); toast('ok', 'Chaqiruv yuborildi', 'Do‘stingizga musobaqa taklifi ketdi.'); save(); break; }
    case 'help-ask': {
      const s = get(S.students, id) || get(S.mentors, id);
      toast('ok', 'Yordam so‘raldi', (s.name || 'Mentor') + 'ga savolingiz yuborildi — 24 soat ichida javob beradi.'); break;
    }
    case 'cert': { const c = certsOf(st()).find(x => x.m.id === id); if (c) certModal(c); break; }
    case 'print': window.print(); break;
    case 'toast-copy': { try { navigator.clipboard.writeText(t.dataset.code); } catch (e) { } toast('ok', 'Nusxalandi', t.dataset.code); break; }
    case 'gallery': { const it = S.gallery.find(x => x.id === id); if (it) galleryModal(it); break; }
    case 'cheer': toast('ok', 'Qo‘llab-quvvatlash yuborildi', 'Jamoa reytingiga +1 olqish qo‘shildi.'); closeModal(); break;
    case 'wall-post': {
      const ta = document.getElementById('wall-input'); const g = myGroup(st());
      if (!ta || !ta.value.trim()) { toast('warn', 'Bo‘sh yozuv', 'Biror narsa yozing.'); break; }
      if (g) { (S.walls[g.id] = S.walls[g.id] || []).unshift({ id: uid('w'), who: st().id, text: ta.value.trim(), at: 'hozir' }); }
      addXp(st(), 15, 5, 'q2'); save(); paint(true); toast('ok', 'Devorga yozildi', '+15 XP');
      break;
    }
    case 'edit-profile': profileModal(); break;
    case 'toggle-set': {
      const kk = t.dataset.k || 'notif';
      S.settings[kk] = !S.settings[kk];
      t.classList.toggle('on', S.settings[kk]);
      t.setAttribute('aria-checked', String(!!S.settings[kk]));
      toast('info', S.settings[kk] ? 'Yoqildi' : 'O‘chirildi', 'Sozlama saqlandi.');
      save(); break;
    }
    case 'cal-mode': UI.calMonthly = t.dataset.m === '-1'; UI.cal = 0; paint(true); break;
    case 'cal-prev': UI.cal = (UI.cal || 0) - 1; paint(true); break;
    case 'cal-next': UI.cal = (UI.cal || 0) + 1; paint(true); break;
    case 'cal-day': {
      const ds = t.dataset.d, g = myGroup(st());
      const items = [];
      deadlinesOf(st()).filter(d => d.due === ds).forEach(d => items.push({ k: 'Vazifa deadline', l: d.t.title, s: d.s, x: d }));
      openLessons(st()).filter(l => l.d === ds).forEach(l => items.push({ k: 'Dars', l: l.t, id: l.id }));
      (S.walls[g ? g.id : ''] || []);
      openModal(mhead(fmtFull(ds), items.length + ' ta yozuv') +
        (items.length ? '<div class="col" style="gap:9px">' + items.map(it => '<div class="lrow"><div class="lead">' + ico(it.k === 'Dars' ? 'book' : 'task', 'sm') + '</div>' +
          '<div class="grow"><div class="small" style="font-weight:750">' + esc(it.l) + '</div><div class="xs muted">' + esc(it.k) + '</div></div>' +
          (it.s ? stChip(it.s.status) : '<button class="btn btn-xs btn-soft" data-act="' + (it.id ? 'lesson-open' : 'submit-open') + '" data-id="' + (it.id || st().id) + '">Ochish</button>') + '</div>').join('') + '</div>' : '<div class="empty">Bu kunda yozuv yo‘q</div>'), 'narrow');
      break;
    }
    case 'cal-day2': {
      const ds = t.dataset.d, items = [];
      S.tasks.filter(x => x.dl === ds).forEach(x => items.push({ l: x.title, k: 'Umumiy deadline', c: 'p' }));
      S.groups.forEach(g => Object.entries(g.dl || {}).forEach(([tid, d]) => { if (d === ds) items.push({ l: (taskOf(tid) || { title: tid }).title, k: g.name + ' jamoasi', c: 'a' }); }));
      openModal(mhead(fmtFull(ds), items.length + ' ta deadline') + '<div class="col" style="gap:9px">' + items.map(it => '<div class="lrow"><div class="lead">' + ico('cal', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(it.l) + '</div><div class="xs muted">' + esc(it.k) + '</div></div><span class="tag ' + it.c + '">deadline</span></div>').join('') + '</div>', 'narrow');
      break;
    }
    case 'new-task': createTaskModal(); break;
    case 'new-lesson': createLessonModal(); break;
    case 'new-lesson-mod': createLessonModal(t.dataset.id); break;
    case 'new-module': createModuleModal(); break;
    case 'new-student': addStudentModal(); break;
    case 'admin-edit': adminFormModal(id); break;
    case 'admin-block': {
      const a2 = accById(id);
      if (!a2) break;
      if (a2.id === (meAcc() || {}).id) { toast('warn', 'O‘zingizni bloklay olmaysiz'); break; }
      a2.status = a2.status === 'blocked' ? 'active' : 'blocked'; save(); paint(true);
      toast(a2.status === 'blocked' ? 'warn' : 'ok', a2.status === 'blocked' ? 'Akkaunt bloklandi' : 'Akkaunt faollashtirildi', a2.name);
      break;
    }
    case 'admin-del': {
      const a3 = accById(id);
      if (!a3 || a3.adminRole === 'founder') { toast('warn', 'Founder o‘chirilmaydi'); break; }
      confirmModal('Adminni o‘chirish', a3.name + ' (@' + a3.nick + ') tizimdan olib tashlanadi. Davom etamizmi?', 'admin-del-do', id);
      break;
    }
    case 'admin-del-do': {
      const i = accounts().findIndex(a2 => a2.id === id);
      if (i > -1) { const nm = accounts()[i].name; accounts().splice(i, 1); save(); closeModal(); paint(true); toast('ok', 'Admin o‘chirildi', nm); }
      break;
    }
    case 'login-card': loginCardModal(id); break;
    case 'perm-ask': toast('ok', 'So‘rov yuborildi', 'Founderga «' + ((navDefs[id] || {}).l || id) + '» bo‘limi uchun so‘rov yozildi.'); break;
    case 'pass-change': passChangeModal(); break;
    case 'pass-reset': {
        const a5 = accById(id);
      if (!a5) break;
      passReset(id); paint(true); loginCardModal(id);
      toast('ok', 'Parol tiklandi', a5.name + ' keyingi kirishda yangi parol o‘rnatadi.');
      break;
    }
    case 'print-card': {
      const box = document.getElementById('loginCard');
      openModal('<div id="printZone">' + (box ? box.outerHTML : '') + '</div>' +
        '<div class="row no-print" style="gap:10px;margin-top:12px"><button class="btn btn-primary grow" data-act="print">' + ico('print', 'sm') + 'Chop etish</button>' +
        '<button class="btn btn-ghost" data-act="close-modal">Yopish</button></div>', 'narrow');
      break;
    }
    case 'new-admin': if (isFounder()) adminFormModal(); else toast('warn', 'Ruxsat yo‘q', 'Faqat founder admin qo‘sha oladi.'); break;
    case 'new-group': createGroupModal(); break;
    if (!actionAllowed('groups')) { permDenied('groups'); break; }
    case 'deadline-open': deadlineModal(t.dataset.id || ''); break;
    case 'del-dl': { const g = groupOf(id); if (g) { delete g.dl[t.dataset.t]; toast('info', 'Istisno o‘chirildi'); save(); paint(true); } break; }
    case 'group-open': { const g = groupOf(id); if (g) teamModal(g); break; }
    case 'group-add': {
      const g = groupOf(id), s = get(S.students, t.dataset.s);
      if (g && s && !g.members.includes(s.id)) { g.members.push(s.id); s.group = g.id; pushNotif(s.id, 'Jamoa', g.name + ' jamoasiga qo‘shildingiz. Devorga tanishing!', 'users'); }
      toast('ok', 'A’zo qo‘shildi', (s ? s.name : '') + ' → ' + g.name); save(); closeModal(); paint(true); break;
    }
    case 'group-add-member': addMemberModal(id); break;
    case 'group-remove': {
      const g = groupOf(id), s = get(S.students, t.dataset.s);
      if (g) g.members = g.members.filter(x => x !== t.dataset.s);
      if (s) s.group = '';
      toast('info', 'A’zo chiqarildi', s ? s.name : ''); save(); paint(true); break;
    }
    case 'del-group': { const g = groupOf(id);
      if (g) confirmModal('Jamoani tarqatish?', g.name + ' — a’zolar jamoasiz qoladi (loyiha va devor o‘chadi).', 'del-group-do', id, true);
      break; }
    case 'del-group-do': {
      const i = S.groups.findIndex(g => g.id === id);
      if (i > -1) {
        const gid = S.groups[i].id;
        S.groups[i].members.forEach(sid => { const sx = get(S.students, sid); if (sx) sx.group = ''; });
        delete S.walls[gid];
        S.groups.splice(i, 1);
        toast('warn', 'Jamoa tarqatildi');
      }
      save(); closeModal(); paint(true); break;
    }
    case 'del-lesson': { const l = lessonOf(id); confirmModal('Darsni o‘chirish?', l ? l.t : '', 'del-lesson-do', id, true); break; }
    case 'del-lesson-do': { const i = S.lessons.findIndex(l => l.id === id); if (i > -1) { S.lessons.splice(i, 1); toast('warn', 'Dars o‘chirildi'); S.students.forEach(x => x.done = x.done.filter(did => did !== id)); } save(); closeModal(); paint(true); break; }
    case 'del-module': { const m = modOf(id); confirmModal('Modulni o‘chirish?', (m ? m.title : '') + ' — darslar ham o‘chadi.', 'del-module-do', id, true); break; }
    case 'del-module-do': { const i = S.modules.findIndex(m => m.id === id); if (i > -1) { const mid = S.modules[i].id; S.lessons = S.lessons.filter(l => l.m !== mid); S.tasks = S.tasks.filter(t2 => t2.m !== mid); S.modules.splice(i, 1); S.modules.forEach((m, k) => m.n = k + 1); toast('warn', 'Modul va darslari o‘chirildi'); } save(); closeModal(); paint(true); break; }
    case 'task-review': {
      const rel = S.submissions.filter(p => p.task === id);
      openModal(mhead('Tekshirish: ' + taskOf(id).title, rel.length + ' ta topshiriq') +
        (rel.length ? '<div class="col" style="gap:9px">' + rel.map(p => { const s = get(S.students, p.st);
          return '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'xs') +
            '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div>' +
            '<div class="xs muted">' + fmtD(p.at) + (p.score != null ? ' • ' + p.score + '/100' : '') + '</div></div></div>' + stChip(p.status) +
            '<button class="btn btn-xs ' + (p.status === 'in_review' ? 'btn-primary' : 'btn-soft') + '" data-act="review-open" data-sub="' + p.id + '">Tekshirish</button></div>'; }).join('') + '</div>'
          : '<div class="empty">Bu vazifaga hali topshiriq yo‘q</div>') +
        '<div class="divider"></div><div class="xs muted">Topshirmaganlar: ' + S.students.filter(s => !subOf(s, id)).map(s => esc(s.name.split(' ')[0])).join(', ') + '</div>', 'wide');
      break;
    }
    case 'export': exportCSV(); break;
    default: break;
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (!f.dataset || !f.dataset.form) return;
  e.preventDefault();
  const fd = new FormData(f);
  const kind = f.dataset.form;
  /* Ruxsat: forma turi bo'yicha bo'lim tekshiruvi */
  const FORM_PERM = { 'new-student': 'students', 'admin-edit': null, 'new-admin': null, 'new-task': 'tasks', 'new-lesson': 'content', 'new-module': 'content',
    'new-group': 'groups', 'lesson-edit': 'content', 'new-gallery': 'content', 'new-mentor': 'content', 'group-member': 'groups' };
  if (Object.prototype.hasOwnProperty.call(FORM_PERM, kind) && isAdmin()) {
    const need = FORM_PERM[kind];
    const okPerm = need === null ? isFounder() : actionAllowed(need);
    if (!okPerm) { permDenied(need === null ? 'admins' : need); return; }
  }
  /* Landing: ro'yxatdan o'tish arizasi */
  if (kind === 'lead') {
    const draft = { name: fd.get('name'), phone: fd.get('phone'), tg: fd.get('tg'), goal: fd.get('goal') };
    const r = addLead(draft);
    if (r.err) { UI.authErr = r.msg; UI.leadDraft = draft; paint(true); return; }
    UI.authErr = ''; UI.leadDraft = null; UI.leadDone = r.lead.name;
    toast('ok', 'Ariza yuborildi', 'Admin tez orada bog‘lanadi: ' + r.lead.phone);
    paint(true); landScrollTo('#lkirish');
    return;
  }
  if (kind === 'login-student' || kind === 'login-admin') {
    /* Talaba — faqat nick; admin — email (authCheck rolni hisobga oladi) */
    const res = authCheck(fd.get('login'), fd.get('pass'), kind === 'login-student' ? 'student' : 'admin');
    if (res.err === 'first') { UI.firstPass = { acc: res.acc.id }; UI.authErr = ''; paint(); return; }
    if (res.err) { UI.authErr = res.msg; paint(true); return; }
    finishLogin(res.acc); return;
  }
  if (kind === 'pass-change') {
    const a = meAcc();
    if (!a) { closeModal(); return; }
    const oldP = String(fd.get('old') || ''), p1 = String(fd.get('p1') || ''), p2 = String(fd.get('p2') || '');
    if (a.pass && a.pass !== hashPass(a.nick, oldP)) { toast('warn', 'Hozirgi parol xato', 'Qayta tekshirib ko‘ring.'); return; }
    if (p1.length < 4) { toast('warn', 'Parol juda qisqa', 'Kamida 4 belgi kiriting.'); return; }
    if (p1 !== p2) { toast('warn', 'Parollar mos emas', 'Ikki maydonga bir xil parol yozing.'); return; }
    setAccountPass(a, p1); closeModal();
    toast('ok', 'Parol yangilandi', 'Keyingi kirishda yangi parolni ishlatasiz.');
    return;
  }
  if (kind === 'setup-founder') {
    const p1 = String(fd.get('p1') || ''), p2 = String(fd.get('p2') || '');
    if (p1 !== p2) { UI.authErr = 'Parollar bir-biriga mos kelmadi. Qayta yozing.'; paint(true); return; }
    const r = createFounderAccount({ name: fd.get('name'), email: fd.get('email'), pass: p1 });
    if (r.err) { UI.authErr = r.msg || 'Xatolik yuz berdi.'; paint(true); return; }
    UI.authErr = '';
    finishLogin(r.acc);
    toast('ok', 'Founder akkaunti yaratildi', 'Xush kelibsiz, ' + r.acc.name.split(' ')[0] + '! Birinchi qadam — talaba qo‘shish.');
    return;
  }
  if (kind === 'first-pass') {
    const acc = accById(f.dataset.acc);
    const p1 = String(fd.get('p1') || ''), p2 = String(fd.get('p2') || '');
    if (p1.length < 4) { UI.authErr = 'Parol kamida 4 belgidan iborat bo‘lsin.'; paint(true); return; }
    if (p1 !== p2) { UI.authErr = 'Parollar bir-biriga mos kelmadi. Qayta yozing.'; paint(true); return; }
    const r = setAccountPass(acc, p1);
    if (r.err) { UI.authErr = r.msg || 'Xatolik'; paint(true); return; }
    finishLogin(acc);
    toast('ok', 'Parol o‘rnatildi', 'Keyingi kirishlarda shu paroldan foydalanasiz.');
    return;
  }
  if (kind === 'msg') {
    toast('ok', 'Xabar yuborildi', 'Xabar qabul qilindi va tarixda saqlandi.'); closeModal();
    S.activity.unshift({ who: isAdmin() ? (meAcc() ? meAcc().name : 'Admin') : me().name, what: 'xabar yubordi', at: 'hozir' }); save(); return;
  }
  if (kind === 'profile') {
    const s0 = me();
    s0.name = fd.get('name') || s0.name; s0.tg = fd.get('tg'); s0.phone = fd.get('phone'); s0.goal = fd.get('goal'); s0.bio = fd.get('bio');
    toast('ok', 'Profil saqlandi'); closeModal(); save(); paint(true); return;
  }
  if (kind === 'submit') {
    const s0 = me(), tid = f.dataset.task, task = taskOf(tid);
    let p = subOf(s0, tid);
    const fileIn = f.querySelector('input[type="file"]');
    const fl = (fileIn && fileIn.files && fileIn.files.length) ? fileIn.files[0] : null;
    const finish = fileData => {
      const data = { link: fd.get('link'), note: fd.get('note') || '', file: fl ? fl.name : '', fileData: fileData || '',
        at: todayISO(), status: 'in_review', score: null, fb: '', rev: '' };
      if (p && p.status !== 'accepted') Object.assign(p, data);
      else { p = { id: uid('p'), task: tid, st: s0.id, ...data }; S.submissions.push(p); }
      addXp(s0, 40, 15, 'q3');
      S.activity.unshift({ who: s0.name, what: '“' + task.title + '”ni topshirdi', at: 'hozir' });
      toast('ok', 'Topshiriq yuborildi', 'Holat: tekshirilmoqda. +40 XP');
      closeModal(); save(); paint(true);
    };
    /* 900 KB'gacha fayl to‘g‘ridan-to‘g‘ri brauzer xotirasida saqlanadi */
    if (fl && fl.size <= 900 * 1024) {
      const r = new FileReader();
      r.onload = () => finish(r.result);
      r.onerror = () => finish('');
      r.readAsDataURL(fl);
      return;
    }
    if (fl && fl.size > 900 * 1024) toast('warn', 'Fayl juda katta', 'Demo rejimda 900 KB gacha saqlanadi — faqat nom yozildi. Real versiyada Supabase Storage ishlatiladi.');
    finish('');
    return;
  }
  if (kind === 'team-submit') {
    const tid = f.dataset.task, g = myGroup(me()), task = taskOf(tid);
    if (!g) { toast('warn', 'Jamoa yo‘q'); closeModal(); return; }
    const link = fd.get('link'), note = (fd.get('note') || '').trim();
    g.members.forEach(mid => {
      const stx = get(S.students, mid);
      let p = subOf(stx, tid);
      const data = { link, note: (note ? '[Jamoaviy] ' + note : '[Jamoaviy topshiriq]'), at: todayISO(), status: 'in_review', score: null, fb: '', rev: '' };
      if (p && p.status !== 'accepted') Object.assign(p, data);
      else if (!p) S.submissions.push({ id: uid('p'), task: tid, st: mid, ...data });
      if (mid !== me().id) pushNotif(mid, 'Jamoaviy topshiriq yuborildi', g.name + ' — ' + task.title, 'users');
    });
    addXp(me(), 25, 10);
    S.activity.unshift({ who: me().name, what: '“' + task.title + '” jamoaviy topshiriqni yubordi', at: 'hozir' });
    toast('ok', 'Jamoaviy topshiriq yuborildi', g.members.length + ' a’zo nomidan • +25 XP');
    closeModal(); save(); paint(true); return;
  }

  if (kind === 'review') {
    const p = get(S.submissions, f.dataset.sub);
    const wasAccepted = p.status === 'accepted';
    p.score = Math.max(0, Math.min(100, parseInt(fd.get('score'), 10) || 0));
    p.status = fd.get('status'); p.fb = fd.get('fb') || 'Ko‘rib chiqildi.'; p.rev = isAdmin() ? ((meAcc() ? meAcc().name : 'Admin') + ' (mentor)') : me().name;
    const s0 = get(S.students, p.st);
    pushNotif(p.st, 'Vazifa baholandi', taskOf(p.task).title + ' — ' + p.score + '/100. Izohni o‘qing.', 'star');
    if (p.status === 'accepted' && !wasAccepted) { s0.xp += 60; toast('ok', 'Qabul qilindi', s0.name + 'ga +60 XP va izoh yuborildi.'); }
    else toast('warn', 'Qayta ishlashga yuborildi', s0.name + 'ga izoh bilan qaytarildi.');
    S.activity.unshift({ who: (meAcc() ? meAcc().name : 'Admin'), what: '“' + taskOf(p.task).title + '”ni baholadi (' + p.score + ')', at: 'hozir' });
    closeModal(); save(); paint(true); return;
  }
  if (kind === 'new-task') {
    const t2 = { id: uid('t'), m: fd.get('m'), title: fd.get('title'), brief: fd.get('brief') || '', dl: fd.get('dl') };
    S.tasks.push(t2);
    const to = fd.get('to');
    if (to === 'all') S.students.forEach(s => pushNotif(s.id, 'Yangi vazifa', t2.title + ' • deadline ' + fmtFull(t2.dl), 'task'));
    else { const g = groupOf(to); if (g) g.members.forEach(sid => pushNotif(sid, 'Jamoa vazifasi', t2.title + ' • ' + g.name, 'task')); g.dl[t2.id] = t2.dl; }
    S.activity.unshift({ who: (meAcc() ? meAcc().name : 'Admin'), what: 'yangi vazifa berdi: ' + t2.title, at: 'hozir' });
    toast('ok', 'Vazifa yuborildi', t2.title + ' • deadline ' + fmtFull(t2.dl)); closeModal(); save(); paint(true); return;
  }
  if (kind === 'new-lesson') {
    const data = { m: fd.get('m'), t: fd.get('t'), type: fd.get('type'), dur: parseInt(fd.get('dur'), 10) || 12, brief: fd.get('brief') || '', link: fd.get('link') || '' };
    if (f.dataset.id) {
      const l = lessonOf(f.dataset.id); Object.assign(l, data);
      toast('ok', 'Dars yangilandi', l.t);
    } else {
      const l = { id: uid('l'), d: todayISO(), ...data };
      S.lessons.push(l);
      toast('ok', 'Dars qo‘shildi', l.t + ' • ' + l.dur + ' daqiqa');
    }
    closeModal(); save(); paint(true); return;
  }

  if (kind === 'new-gallery') {
    const ow = fd.get('by');
    const g2x = myGroup(get(S.students, ow));
    S.gallery.unshift({ id: uid('gl'), t: fd.get('t'), desc: fd.get('desc') || '', by: ow, kind: g2x ? g2x.name + ' jamoasi' : 'Shaxsiy loyiha', link: fd.get('link'), k: fd.get('k') || 'g1' });
    toast('ok', 'Galereyaga qo‘shildi', fd.get('t')); closeModal(); save(); paint(true); return;
  }

  if (kind === 'new-mentor') {
    const m2 = { id: uid('mt'), name: fd.get('name'), role: fd.get('role') || 'Mentor', tg: fd.get('tg') || '@mentor', rating: 5.0, groups: [], bio: fd.get('bio') || 'Yangi mentor.' };
    S.mentors.push(m2);
    toast('ok', 'Mentor qo‘shildi', m2.name + ' — jamoalarga biriktirishingiz mumkin.'); closeModal(); save(); paint(true); return;
  }
  if (kind === 'new-module') {
    const m = { id: uid('m'), n: S.modules.length + 1, title: fd.get('title'), desc: fd.get('desc') || '', icon: 'spark' };
    S.modules.push(m); toast('ok', 'Yangi modul qo‘shildi', m.n + '-modul: ' + m.title); closeModal(); save(); paint(true); return;
  }
  if (kind === 'csv-import') {
    const rep = UI.csvReport;
    if (!rep || !rep.ok.length) { toast('warn', 'Import qilinmadi', 'Avval CSV faylni tanlang.'); closeModal(); return; }
    const res = importStudents(rep);
    UI.csvReport = null;
    UI.lastImport = res.undo;
    toast('ok', 'Import yakunlandi', res.created.length + ' talaba qo‘shildi' + (res.newGroups ? ', ' + res.newGroups + ' yangi jamoa' : '') + '.');
    if (res.created.length) csvDoneModal(res); else closeModal();
    paint(true); return;
  }
  if (kind === 'new-student') {
    const res = addStudentRecord({ name: fd.get('name'), phone: fd.get('phone'), hemisId: fd.get('hemis'), groupId: fd.get('group'), tg: fd.get('tg'), goal: fd.get('goal') });
    if (res.err) { toast('warn', 'Qo‘shilmadi', res.msg); return; }
    if (f.dataset.lead) delLead(f.dataset.lead);   /* ariza talabaga aylandi */
    closeModal();
    toast('ok', 'Talaba qo‘shildi', res.student.name + ' • kirish nick: ' + res.acc.nick);
    loginCardModal(res.acc.id); paint(true); return;
  }
  if (kind === 'new-admin' || kind === 'admin-edit') {
    const isEdit = kind === 'admin-edit';
    const a2 = isEdit ? accById(f.dataset.id) : null;
    if (isEdit && !a2) return;
    const perms = (fd.getAll('perms') || []);
    if (isEdit) {
      const nm2 = a2.name;
      a2.name = fd.get('name') || a2.name;
      const em = String(fd.get('email') || '').trim().toLowerCase();
      if (em && em !== a2.email) { if (accByEmail(em)) { toast('warn', 'Band email', accByEmail(em).nick + ' shu emailni ishlatgan.'); return; } a2.email = em; }
      let nk = String(fd.get('nick') || '').trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (nk && nk !== a2.nick) { if (accByEmail(nk) || nickTaken(nk, a2.id)) { toast('warn', 'Band nick', nk + ' allaqachon olingan.'); return; } a2.nick = nk; }
      a2.adminRole = fd.get('adRole') || a2.adminRole;
      a2.perms = perms.length ? perms : a2.perms;
      save(); closeModal(); paint(true); toast('ok', 'Saqlandi', nm2 + ' ma’lumotlari yangilandi.');
      return;
    }
    const r2 = createAdminAccount({ name: fd.get('name'), email: fd.get('email'), nick: fd.get('nick'), adRole: fd.get('adRole'), perms });
    if (r2.err) { toast('warn', 'Qo‘shilmadi', r2.msg); return; }
    save(); closeModal(); toast('ok', 'Admin qo‘shildi', r2.acc.name + ' • @' + r2.acc.nick);
    loginCardModal(r2.acc.id); paint(true); return;
  }
  if (kind === 'new-group') {
    const g = { id: uid('g'), name: fd.get('name'), project: fd.get('project') || 'Yangi loyiha g‘oyasi', mentor: fd.get('mentor') || 'mt1', members: [], xp: 0, dl: {} };
    (fd.getAll('members') || []).forEach(mid => { g.members.push(mid); const s = get(S.students, mid); if (s) s.group = g.id; });
    S.groups.push(g); S.walls[g.id] = [];
    toast('ok', 'Jamoa yaratildi', g.name + ' • ' + g.members.length + ' a’zo'); closeModal(); save(); paint(true); return;
  }
  if (kind === 'set-deadline') {
    const gid = fd.get('group'), tid = fd.get('task'), date = fd.get('date'), g = groupOf(gid);
    if (g) { g.dl[tid] = date; g.members.forEach(sid => pushNotif(sid, 'Deadline yangilandi', (taskOf(tid) || {}).title + ': ' + fmtFull(date), 'clock')); }
    toast('ok', 'Deadline saqlandi', g.name + ' • ' + fmtFull(date)); closeModal(); save(); paint(true); return;
  }
});
document.addEventListener('change', e => {
  const ss = e.target.closest('[data-act="sort-sel"]');
  if (ss) {
    UI.sort.k = ss.value;
    UI.sort.d = (ss.value === 'name' || ss.value === 'group') ? 1 : -1;
    paint(true); return;
  }
  const cg = e.target.closest('[data-act="change-group"]');
  if (cg && cg.value) {
    const stx = get(S.students, cg.dataset.id), g = groupOf(cg.value);
    S.groups.forEach(x => x.members = x.members.filter(m => m !== stx.id));
    g.members.push(stx.id); stx.group = g.id;
    pushNotif(stx.id, 'Jamoa o‘zgardi', g.name + ' jamoasiga o‘tkazildingiz.', 'users');
    toast('ok', 'Jamoa yangilandi', stx.name + ' → ' + g.name);
    save(); closeModal(); paint(true); return;
  }
  const imp = e.target.closest('#import-json');
  if (imp && imp.files && imp.files[0]) { importState(imp.files[0]); return; }
  const csv = e.target.closest('#import-csv');
  if (csv && csv.files && csv.files[0]) {
    const fr = new FileReader();
    fr.onload = () => {
      const rep = csvStudentsReport(String(fr.result || ''));
      if (rep.fatal) { toast('warn', 'Fayl o‘qilmadi', rep.fatal); return; }
      UI.csvReport = rep;
      csvImportModal(rep);
    };
    fr.readAsText(csv.files[0], 'utf-8');
    return;
  }
  const t = e.target.closest('[data-act="move-student"]');
  if (t && t.value) {
    const fromId = t.dataset.g, toId = t.value, to = groupOf(toId);
    const from = groupOf(fromId);
    if (from) from.members = from.members.filter(x => x !== toId);
    if (to) { to.members.push(toId); const s = get(S.students, toId); if (s) s.group = to.id; }
    toast('ok', 'Talaba ko‘chirildi', get(S.students, toId).name + ' → ' + to.name);
    save(); closeModal(); paint(true);
  }
});
const NAV_ORDER_S = ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];
const NAV_ORDER_A = ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings'];
document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  /* Ctrl/⌘ + K — buyruq paneli */
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); return; }
  if (e.key === 'Escape') { closeModal(); return; }
  trapFocus(e);
  /* Alt + 1…8 — bo'limlar */
  if (e.altKey && /^[1-8]$/.test(e.key)) {
    e.preventDefault();
    const order = isAdmin() ? NAV_ORDER_A : NAV_ORDER_S;
    const r = order[parseInt(e.key, 10) - 1];
    if (r) go(r);
    return;
  }
  if (typing) return;
  if (e.key === '/') { const gs = document.getElementById('gsearch'); if (gs) { e.preventDefault(); gs.focus(); } return; }
  if (e.key === '?') { e.preventDefault(); shortcutsModal(); return; }
  if (e.key === 't' || e.key === 'T') {
    const n = UI.theme === 'dark' ? 'light' : 'dark';
    UI.theme = n; S.theme = n; document.documentElement.dataset.theme = n; save(); paint(true); return;
  }
  if (e.key === 'n' || e.key === 'N') { notifModal(); return; }
});

/* ---------- Ishga tushirish ---------- */
S = loadState();
/* PWA yorliqlari: /?go=lessons kabi parametrlar */
try {
  const goWant = new URLSearchParams(location.search).get('go');
  if (goWant && ROUTES[goWant]) UI.pendingGo = goWant;
} catch (e) { }
UI.theme = S.theme || 'dark';
document.documentElement.dataset.theme = UI.theme;
/* Sessiya bo'lsa — qayta kiritmasdan davom etamiz (parol faqat chiqqach so'raladi) */
const _sesAcc = (S.session && accById(S.session.acc)) || null;
if (_sesAcc && _sesAcc.status === 'active' && !_sesAcc.mustSetPass) {
  S.role = _sesAcc.role; if (_sesAcc.studentId) S.user = _sesAcc.studentId;
  UI.authShow = false;
} else {
  UI.authShow = true;
}
UI.route = S.role === 'admin' ? 'admin' : 'home';

/* Service worker (PWA) — faqat https'da ishlaydi */
window.addEventListener('beforeinstallprompt', ev => { ev.preventDefault(); UI.installEvt = ev; paint(true); });
window.addEventListener('appinstalled', () => { UI.installEvt = null; toast('ok', 'AI Leaders o‘rnatildi', 'Endi ilova telefon ekranidan ochiladi.'); paint(true); });
window.addEventListener('online', () => toast('ok', 'Internet tiklandi', 'Ma’lumotlar saqlanmoqda.'));
window.addEventListener('offline', () => toast('warn', 'Internet yo‘q', 'Ilova oflayn rejimda ishlayapti — o‘zgarishlar saqlanadi.'));
window.addEventListener('scroll', () => {
  landTick();
  const top = document.getElementById('toTop');
  if (!top) return;
  const show = window.scrollY > 640;
  if (show !== top.classList.contains('show')) top.classList.toggle('show', show);
}, { passive: true });

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
    /* Yangi deploy chiqqanda eski keshda qolib ketmaslik:
       yangi service worker boshqaruvni olgach — bir marta avtomatik yangilanadi */
    let hadCtl = !!navigator.serviceWorker.controller, done = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadCtl) { hadCtl = true; return; }
      if (done) return; done = true;
      try { toast('ok', 'Yangi versiya o‘rnatildi', 'Ilova yangilanmoqda…'); } catch (e) { }
      setTimeout(() => location.reload(), 900);
    });
    /* Uzoq ochiq turgan tablar uchun: har 30 daqiqada yangilanish bor-yo‘qligi tekshiriladi */
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then(r => { if (r) r.update().catch(() => { }); }).catch(() => { });
    }, 30 * 60 * 1000);
  });
}
paint();
