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
    '<div style="max-width:520px">' +
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
    '<div class="grid g4" style="gap:10px;max-width:560px">' + [['18', 'talaba'], ['6', 'jamoa'], ['29', 'dars'], ['4', 'loyiha jonli']].map(x =>
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
function exportCSV() {
  const rows = [['Ism', 'Jamoa', 'XP', 'Haftalik XP', 'Progress %', 'Qabul qilingan', 'Ortacha ball', 'Streak', 'Faollik']];
  S.students.forEach(s => rows.push([s.name, (myGroup(s) || {}).name || '-', s.xp, s.wxp, progress(s).pct, acceptedOf(s), s.score, s.streak, s.act ? 'faol' : 'jim']));
  const csv = rows.map(r => r.join(';')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'ai-leaders-statistika.csv';
  document.body.appendChild(a); a.click(); a.remove();
  toast('ok', 'Hisobot tayyor', 'ai-leaders-statistika.csv yuklab olindi.');
}

/* ---------- Render ---------- */
const ROUTES = { home: vHome, lessons: vLessons, tasks: vTasks, team: vTeam, deadlines: vDeadlines, friends: vFriends, info: vInfo, admin: vAdmin, students: vStudents, adminTasks: vAdminTasks, adminLessons: vAdminLessons, adminGroups: vAdminGroups, adminDeadlines: vAdminDeadlines, stats: vStats };
function currentView() {
  const fn = ROUTES[UI.route] || (isAdmin() ? vAdmin : vHome);
  return fn();
}
function renderApp() {
  if (UI.authShow) return vAuth();
  return sidebar() + '<div class="main">' + topbar() + '<div class="content">' + currentView() + '</div></div>' + bottomnav();
}
function paint(keepScroll) {
  const el = document.getElementById('app');
  el.innerHTML = renderApp();
  if (!keepScroll) { try { if (window.scrollY) window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { } }
  const gs = document.getElementById('gsearch');
  if (gs) { gs.value = UI.search; gs.onkeydown = e => { if (e.key === 'Enter') { UI.search = gs.value.trim(); if (UI.search) searchModal(UI.search); } }; }
}
function go(route) { UI.route = route; if (route !== 'lessons') UI.module = null; closeModal(); paint(); }
function login(role, stId) {
  S.role = role; if (stId) S.user = stId;
  UI.authShow = false; UI.route = role === 'admin' ? 'admin' : 'home';
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
    case 'go-team': go('team'); break;
    case 'noop': toast('info', 'Bu bo‘lim hozircha yopiq', 'Avvalgi modul vazifasini topshiring.'); break;
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
      if (!s0.done.includes(id)) { s0.done.push(id); addXp(s0, 20, 10); }
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
      addXp(st(), 15, 5); save(); paint(true); toast('ok', 'Devorga yozildi', '+15 XP');
      break;
    }
    case 'edit-profile': profileModal(); break;
    case 'toggle-set': { t.classList.toggle('on'); toast('info', 'Sozlama saqlandi', t.classList.contains('on') ? 'Yoqilgan' : 'O‘chirilgan'); break; }
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
    case 'del-group': { const i = S.groups.findIndex(g => g.id === id); if (i > -1) { S.groups.splice(i, 1); toast('warn', 'Jamoa o‘chirildi'); save(); paint(true); } break; }
    case 'del-lesson': { const i = S.lessons.findIndex(l => l.id === id); if (i > -1) { S.lessons.splice(i, 1); toast('warn', 'Dars o‘chirildi'); save(); paint(true); } break; }
    case 'del-module': { const i = S.modules.findIndex(m => m.id === id); if (i > -1) { S.modules.splice(i, 1); S.modules.forEach((m, k) => m.n = k + 1); toast('warn', 'Modul o‘chirildi'); save(); paint(true); } break; }
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
    const data = { link: fd.get('link'), note: fd.get('note') || '', at: todayISO(), status: 'in_review', score: null, fb: '', rev: '' };
    if (p && p.status !== 'accepted') Object.assign(p, data);
    else { p = { id: uid('p'), task: tid, st: s0.id, ...data }; S.submissions.push(p); }
    addXp(s0, 40, 15);
    S.activity.unshift({ who: s0.name, what: '“' + task.title + '”ni topshirdi', at: 'hozir' });
    toast('ok', 'Topshiriq yuborildi', 'Holat: tekshirilmoqda. +40 XP');
    closeModal(); save(); paint(true); return;
  }
  if (kind === 'review') {
    const p = get(S.submissions, f.dataset.sub);
    p.score = parseInt(fd.get('score'), 10) || 0;
    p.status = fd.get('status'); p.fb = fd.get('fb') || 'Ko‘rib chiqildi.'; p.rev = isAdmin() ? 'Bekzod Aliyev (mentor)' : me().name;
    const s0 = get(S.students, p.st);
    pushNotif(p.st, 'Vazifa baholandi', taskOf(p.task).title + ' — ' + p.score + '/100. Izohni o‘qing.', 'star');
    if (p.status === 'accepted') { s0.xp += 60; toast('ok', 'Qabul qilindi', s0.name + 'ga +60 XP va izoh yuborildi.'); }
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
    const l = { id: uid('l'), m: fd.get('m'), t: fd.get('t'), type: fd.get('type'), dur: parseInt(fd.get('dur'), 10) || 12, d: todayISO(), brief: fd.get('brief') || '', link: fd.get('link') || '' };
    S.lessons.push(l);
    const g = myGroup(me()) || S.groups[0];
    toast('ok', 'Dars qo‘shildi', l.t + ' • ' + l.dur + ' daqiqa'); closeModal(); save(); paint(true); return;
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- Ishga tushirish ---------- */
S = loadState();
UI.theme = S.theme || 'dark';
document.documentElement.dataset.theme = UI.theme;
UI.route = S.role === 'admin' ? 'admin' : 'home';
UI.authShow = true;
window.addEventListener('beforeprint', () => { });
paint();
