/* ==========================================================================
   AUTH, ROUTER, EVENTLAR, QIDIRUV, EKSPORT
   ========================================================================== */

/* ---------- Kirish ekrani ---------- */
function vAuth() {
  const role = UI.authRole;
  const demo = get(S.students, S.user) || S.students[0];
  let h = '<div class="auth">' +
    '<div class="auth-art">' +
    '<div class="row" style="gap:14px"><svg style="width:54px;height:54px" viewBox="0 0 64 64"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>' +
    '<path d="M32 3.4 56.6 17.6v28.8L32 60.6 7.4 46.4V17.6Z" fill="rgba(10,15,30,.7)" stroke="url(#ag)" stroke-width="2.6" stroke-linejoin="round"/>' +
    '<path d="M21 46.5 32 17.8l11 28.7" fill="none" stroke="url(#ag)" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M25.6 37.6h12.8" stroke="#C6FF4F" stroke-width="4.6" stroke-linecap="round"/>' +
    '<circle cx="32" cy="17.8" r="3.7" fill="#C6FF4F"/><circle cx="21" cy="46.5" r="3" fill="#22D3EE"/><circle cx="43" cy="46.5" r="3" fill="#7C5CFF"/></svg>' +
    '<div><div style="font-size:19px;font-weight:850;letter-spacing:.12em">AI LEADERS</div><div class="xs" style="letter-spacing:.34em;color:#8C9CC8;font-weight:750">STARTUP CLUB</div></div></div>' +
    '<div class="spark-orb float-slow" style="width:260px;height:260px;background:#7C5CFF;top:16%;right:-60px"></div>' +
    '<div class="spark-orb float-slow" style="width:200px;height:200px;background:#22D3EE;bottom:6%;left:-40px;animation-delay:1.4s"></div>' +
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
      '<div style="width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(124,92,255,.18);border:1px solid rgba(124,92,255,.34);color:#C4B4FF">' + ico(x[0], 'sm') + '</div>' +
      '<div><div class="small" style="font-weight:750">' + esc(x[1]) + '</div><div class="xs muted">' + esc(x[2]) + '</div></div></div>').join('') +
    '</div></div>' +
    '<div class="grid g4 auth-stats">' + [['18', 'talaba'], ['6', 'jamoa'], ['29', 'dars'], ['4', 'loyiha jonli']].map(x =>
      '<div class="card tight soft tc"><div class="big">' + x[0] + '</div><div class="xs muted">' + x[1] + '</div></div>').join('') + '</div></div>' +

    '<div class="auth-form"><div class="inner">' +
    '<h2 class="h1" style="font-size:24px">Tizimga kirish</h2>' +
    '<p class="small muted" style="margin:8px 0 18px">Demo: parol talab qilinmaydi — rolni tanlab kiring.</p>' +
    '<div class="col" style="gap:10px">' +
    '<button class="role-card ' + (role === 'student' ? 'on' : '') + '" data-act="pick-role" data-r="student">' +
    '<span class="av sm" style="background:var(--grad)">' + ico('user', 'sm') + '</span>' +
    '<span class="grow"><span style="display:block;font-weight:800;font-size:14px">Student</span>' +
    '<span class="xs muted">Bosh sahifa, Darslar, Vazifa, Team, Deadline, Friends, Ma’lumot</span></span>' +
    '<span class="tag ' + (role === 'student' ? 'p' : '') + '">' + (role === 'student' ? 'tanlandi' : '') + '</span></button>' +
    '<button class="role-card ' + (role === 'admin' ? 'on' : '') + '" data-act="pick-role" data-r="admin">' +
    '<span class="av sm" style="background:linear-gradient(135deg,#C6FF4F,#22D3EE)">' + ico('shield', 'sm') + '</span>' +
    '<span class="grow"><span style="display:block;font-weight:800;font-size:14px">Admin / Mentor</span>' +
    '<span class="xs muted">Talabalar, vazifa berish va tekshirish, darslar, jamoalar, statistika</span></span>' +
    '<span class="tag ' + (role === 'admin' ? 'p' : '') + '">' + (role === 'admin' ? 'tanlandi' : '') + '</span></button>' +
    '</div>' +
    '<form data-form="login" class="col" style="gap:13px;margin-top:16px">' +
    (role === 'admin'
      ? '<div class="field"><label>Email</label><input class="inp" value="bekzod@aileaders.uz" readonly></div>' +
        '<div class="field"><label>Parol</label><input class="inp" type="password" value="demo1234" readonly><div class="inp-hint">Demo rejim — parol shart emas.</div></div>'
      : '<div class="field"><label>Qaysi talaba sifatida kiramiz? (demo)</label><select class="inp" name="who">' +
        S.students.map(s => '<option value="' + s.id + '"' + (demo.id === s.id ? ' selected' : '') + '>' + esc(s.name) + ' — ' + esc(myGroup(s) ? myGroup(s).name + ' jamoasi' : 'jamoasiz') + ' • ' + nf(s.xp) + ' XP</option>').join('') + '</select></div>' +
        '<div class="field"><label>Telefon</label><input class="inp" value="' + esc(demo.phone) + '" readonly></div>') +
    '<button class="btn btn-primary btn-block" type="submit">' + ico('right', 'sm') + (role === 'admin' ? 'Admin panelga kirish' : 'Talaba kabinetiga kirish') + '</button>' +
    '</form>' +
    '<div class="row wrap" style="gap:8px;margin-top:14px;justify-content:center">' +
    '<span class="xs muted">Tez kirish:</span>' +
    '<button class="chip" data-act="quick" data-r="student" data-s="s1">Dilshod (student)</button>' +
    '<button class="chip" data-act="quick" data-r="student" data-s="s3">Jasur (faol)</button>' +
    '<button class="chip" data-act="quick" data-r="admin">Bekzod (admin)</button></div>' +
    '<div class="row" style="gap:8px;margin-top:18px;justify-content:center"><span class="xs muted">© 2026 AI Leaders Startup Club • Toshkent</span></div>' +
    '</div></div></div>';
  return h;
}

/* ---------- Xabar modali ---------- */
function msgModal(id) {
  const p = id === 'admin' ? { name: 'Bekzod Aliyev', role: 'Founder • Admin', tg: '@bekzod' }
    : (get(S.students, id) || get(S.mentors, id) || { name: 'AI Leaders', role: 'Klub', tg: '@aileaders' });
  openModal(mhead('Xabar yozish', p.name + ' • ' + (p.tg || p.role || '')) +
    '<div class="card soft" style="max-height:190px;overflow:auto"><div class="col" style="gap:12px">' +
    '<div class="row" style="gap:9px;justify-content:flex-start"><div class="card tight soft" style="max-width:75%">Salom! Deadline yaqin, qanday ketyapti?</div></div>' +
    '<div class="row" style="gap:9px;justify-content:flex-end"><div class="card tight" style="max-width:75%;background:rgba(124,92,255,.18);border-color:rgba(124,92,255,.34)">Ishlayapman, kechqurun yuboraman ✅</div></div>' +
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
    (l.length ? '<div class="up muted" style="margin-bottom:8px">Darslar</div><div class="col" style="gap:7px;margin-bottom:14px">' + l.map(x => '<button class="lrow press" style="width:100%;text-align:left" data-act="' + (isAdmin() ? 'noop' : 'lesson-open') + '" data-id="' + x.id + '"><div class="lead">' + ico('book', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.t) + '</div><div class="xs muted">' + x.dur + ' daq • ' + fmtD(x.d) + '</div></div></button>').join('') + '</div>' : '') +
    (t.length ? '<div class="up muted" style="margin-bottom:8px">Vazifalar</div><div class="col" style="gap:7px;margin-bottom:14px">' + t.map(x => '<button class="lrow press" style="width:100%;text-align:left" data-act="' + (isAdmin() ? 'noop' : 'task-open') + '" data-id="' + x.id + '"><div class="lead">' + ico('task', 'sm') + '</div><div class="grow"><div class="small" style="font-weight:750">' + esc(x.title) + '</div><div class="xs muted">Deadline: ' + fmtFull(x.dl) + '</div></div></button>').join('') + '</div>' : '') +
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
  admin: vAdmin, students: vStudents, adminTasks: vAdminTasks, adminLessons: vAdminLessons, adminGroups: vAdminGroups, adminDeadlines: vAdminDeadlines, stats: vStats, settings: vAdminSettings };
const STUDENT_ONLY = ['home', 'lessons', 'tasks', 'team', 'deadlines', 'friends', 'info'];
const ADMIN_ONLY = ['admin', 'students', 'adminTasks', 'adminLessons', 'adminGroups', 'adminDeadlines', 'stats', 'settings'];
function currentView() {
  /* rol himoyasi: noto‘g‘ri bo‘limga kirilganda o‘z paneliga qaytarish */
  let route = UI.route;
  if (isAdmin() && STUDENT_ONLY.includes(route)) route = 'admin';
  if (!isAdmin() && ADMIN_ONLY.includes(route)) route = 'home';
  const fn = ROUTES[route] || ROUTES[isAdmin() ? 'admin' : 'home'];
  return fn();
}
function renderApp() {
  if (UI.authShow) return vAuth();
  return sidebar() + '<div class="main">' + topbar() + '<div class="content">' + currentView() + '</div></div>' + bottomnav() + toTopBtn();
}
function paint(keepScroll) {
  const el = document.getElementById('app');
  el.className = UI.authShow ? 'app authscreen' : 'app' + (UI.collapsed ? ' collapsed' : '');
  el.innerHTML = renderApp();
  if (!keepScroll) { try { if (window.scrollY) window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { } }
  const gs = document.getElementById('gsearch');
  if (gs) { gs.value = UI.search; gs.onkeydown = e => { if (e.key === 'Enter') { UI.search = gs.value.trim(); if (UI.search) searchModal(UI.search); } }; }
  const top = document.getElementById('toTop');
  if (top && window.scrollY > 640) top.classList.add('show');
}
function go(route) {
  if (isAdmin() && STUDENT_ONLY.includes(route)) route = 'admin';
  if (!isAdmin() && ADMIN_ONLY.includes(route)) route = 'home';
  UI.route = route; UI.module = null; closeModal(); paint();
}
function login(role, stId) {
  S.role = role; if (stId) S.user = stId;
  UI.authShow = false;
  const want = UI.pendingGo;
  const okWant = want && (role === 'admin' ? ADMIN_ONLY : STUDENT_ONLY).includes(want);
  UI.route = okWant ? want : (role === 'admin' ? 'admin' : 'home');
  UI.pendingGo = null;
  save(); paint();
  toast('ok', role === 'admin' ? 'Admin panel ochildi' : 'Xush kelibsiz, ' + me().name.split(' ')[0] + '!', role === 'admin' ? 'Talabalar, vazifalar va statistikani boshqarasiz.' : 'Bugungi reja Bosh sahifada.');
}

/* ---------- Eventlar ---------- */
document.addEventListener('click', e => {
  const backdrop = e.target.classList && e.target.classList.contains('mback');
  if (backdrop) { closeModal(); return; }
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const a = t.dataset.act, id = t.dataset.id, st = () => me();
  switch (a) {
    case 'go': e.preventDefault(); go(t.dataset.route); break;
    case 'go-team': go(isAdmin() ? 'adminGroups' : 'team'); break;
    case 'go-settings': go('settings'); break;
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
    case 'reset-confirm': confirmModal('Demo ma’lumotlarni tiklash?', 'Topshiriqlar, baholar va yangi qo‘shilgan a’zolar o‘chib, boshlang‘ich demo holat qaytadi. Bu amalni qaytarib bo‘lmaydi.', 'reset-do', '', true); break;
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
    case 'noop': toast('info', 'Bu bo‘lim hozircha yopiq', 'Tez orada ochiladi.'); break;
    case 'locked': toast('warn', 'Dars yopiq', 'Oldingi modul vazifasi qabul qilingach ochiladi.'); break;
    case 'filter-s': UI.studentsFilter = t.dataset.f; paint(true); break;
    case 'close-modal': closeModal(); break;
    case 'play-mock': toast('info', 'Demo pleyer', 'Haqiqiy versiyada bu yerda video dars ochiladi.'); break;
    case 'theme': {
      const n = UI.theme === 'dark' ? 'light' : 'dark';
      UI.theme = n; S.theme = n; document.documentElement.dataset.theme = n; save(); paint(true); break;
    }
    case 'logout': UI.authShow = true; closeModal(); paint(); break;
    case 'switch': {
      const n = isAdmin() ? 'student' : 'admin';
      S.role = n; UI.route = n === 'admin' ? 'admin' : 'home'; UI.module = null; save(); paint();
      toast('info', n === 'admin' ? 'Admin rejimi' : 'Student rejimi', 'Rol almashtirildi.');
      break;
    }
    case 'reset': resetAll(); break;
    case 'notifs': notifModal(); paint(true); break;
    case 'pick-role': UI.authRole = t.dataset.r; paint(); break;
    case 'quick': login(t.dataset.r, t.dataset.s); break;
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
        pushNotif(s0.id, 'Sertifikat ochildi 🎓', 'Modul ' + modOf(l.m).n + ' to‘liq tugatildi. Ma’lumot bo‘limida ko‘ring.', 'cert');
        toast('ok', 'Modul tugatildi! 🎉', modOf(l.m).n + '-modul 100% — sertifikat Ma’lumot bo‘limiga qo‘shildi.');
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
    case 'challenge': { pushNotif(id, 'XP musobaqasi ⚡', st().name + ' sizni haftalik ball musobaqasiga chorladi!', 'trophy'); toast('ok', 'Chaqiruv yuborildi', 'Do‘stingizga musobaqa taklifi ketdi.'); save(); break; }
    case 'help-ask': {
      const s = get(S.students, id) || get(S.mentors, id);
      toast('ok', 'Yordam so‘raldi', (s.name || 'Mentor') + 'ga savolingiz yuborildi — 24 soat ichida javob beradi.'); break;
    }
    case 'cert': { const c = certsOf(st()).find(x => x.m.id === id); if (c) certModal(c); break; }
    case 'print': window.print(); break;
    case 'toast-copy': { try { navigator.clipboard.writeText(t.dataset.code); } catch (e) { } toast('ok', 'Nusxalandi', t.dataset.code); break; }
    case 'gallery': { const it = S.gallery.find(x => x.id === id); if (it) galleryModal(it); break; }
    case 'cheer': toast('ok', 'Qo‘llab-quvvatlash yuborildi 💚', 'Jamoa reytingiga +1 olqish qo‘shildi.'); closeModal(); break;
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
    case 'new-group': createGroupModal(); break;
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
  if (kind === 'login') { login(UI.authRole, fd.get('who') || S.user); return; }
  if (kind === 'msg') {
    toast('ok', 'Xabar yuborildi', 'Demo rejim: xabar yuborilgan deb belgilandi.'); closeModal();
    S.activity.unshift({ who: isAdmin() ? 'Bekzod Aliyev' : me().name, what: 'xabar yubordi', at: 'hozir' }); save(); return;
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
    /* 900 KB'gacha fayl to‘g‘ridan-to‘g‘ri saqlanadi (demo rejim) */
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
    p.status = fd.get('status'); p.fb = fd.get('fb') || 'Ko‘rib chiqildi.'; p.rev = isAdmin() ? 'Bekzod Aliyev (mentor)' : me().name;
    const s0 = get(S.students, p.st);
    pushNotif(p.st, 'Vazifa baholandi', taskOf(p.task).title + ' — ' + p.score + '/100. Izohni o‘qing.', 'star');
    if (p.status === 'accepted' && !wasAccepted) { s0.xp += 60; toast('ok', 'Qabul qilindi', s0.name + 'ga +60 XP va izoh yuborildi.'); }
    else toast('warn', 'Qayta ishlashga yuborildi', s0.name + 'ga izoh bilan qaytarildi.');
    S.activity.unshift({ who: 'Bekzod Aliyev', what: '“' + taskOf(p.task).title + '”ni baholadi (' + p.score + ')', at: 'hozir' });
    closeModal(); save(); paint(true); return;
  }
  if (kind === 'new-task') {
    const t2 = { id: uid('t'), m: fd.get('m'), title: fd.get('title'), brief: fd.get('brief') || '', dl: fd.get('dl') };
    S.tasks.push(t2);
    const to = fd.get('to');
    if (to === 'all') S.students.forEach(s => pushNotif(s.id, 'Yangi vazifa', t2.title + ' • deadline ' + fmtFull(t2.dl), 'task'));
    else { const g = groupOf(to); if (g) g.members.forEach(sid => pushNotif(sid, 'Jamoa vazifasi', t2.title + ' • ' + g.name, 'task')); g.dl[t2.id] = t2.dl; }
    S.activity.unshift({ who: 'Bekzod Aliyev', what: 'yangi vazifa berdi: ' + t2.title, at: 'hozir' });
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
  if (kind === 'new-student') {
    const s = { id: uid('s'), name: fd.get('name'), tg: fd.get('tg') || '@talaba', phone: fd.get('phone') || '+998', group: fd.get('group') || '', xp: 0, wxp: 0, streak: 0, coins: 0, level: 'junior', act: true, score: 0, joined: todayISO(), bio: 'Yangi a’zo.', goal: fd.get('goal') || 'Birinchi loyihani chiqarish', done: [], last: 0 };
    S.students.push(s);
    if (s.group) { const g = groupOf(s.group); if (g) g.members.push(s.id); }
    S.friends[s.id] = []; S.incoming[s.id] = []; S.sent[s.id] = [];
    toast('ok', 'Talaba qo‘shildi', s.name + (s.group ? ' • ' + groupOf(s.group).name : ' • jamoasiz')); closeModal(); save(); paint(true); return;
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
UI.route = S.role === 'admin' ? 'admin' : 'home';
UI.authShow = true;

/* Service worker (PWA) — faqat https'da ishlaydi */
window.addEventListener('beforeinstallprompt', ev => { ev.preventDefault(); UI.installEvt = ev; paint(true); });
window.addEventListener('appinstalled', () => { UI.installEvt = null; toast('ok', 'AI Leaders o‘rnatildi', 'Endi ilova telefon ekranidan ochiladi.'); paint(true); });
window.addEventListener('online', () => toast('ok', 'Internet tiklandi', 'Ma’lumotlar saqlanmoqda.'));
window.addEventListener('offline', () => toast('warn', 'Internet yo‘q', 'Ilova oflayn rejimda ishlayapti — o‘zgarishlar saqlanadi.'));
window.addEventListener('scroll', () => {
  const top = document.getElementById('toTop');
  if (!top) return;
  const show = window.scrollY > 640;
  if (show !== top.classList.contains('show')) top.classList.toggle('show', show);
}, { passive: true });

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => { }));
}
paint();
