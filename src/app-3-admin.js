/* ==========================================================================
   ADMIN (founder + mentorlar) bo'limlari
   ========================================================================== */
function adminStudentModal(st) {
  const p = progress(st), g = myGroup(st), m = medal(st), cs = certsOf(st);
  openModal(
    mhead(st.name, (g ? g.name + ' jamoasi • ' : '') + 'Daraja: ' + esc(m.n)) +
    '<div class="row wrap" style="gap:8px;margin-bottom:14px">' +
    '<span class="tag ' + (onl(st) ? 'g' : '') + '">' + ico('user', 'sm') + (onl(st) ? 'Onlayn' : st.last + ' kun oldin faol') + '</span>' +
    '<span class="tag p">' + ico('bolt', 'sm') + nf(st.xp) + ' XP</span>' +
    '<span class="tag a">' + ico('flame', 'sm') + st.streak + ' kun</span>' +
    '<span class="tag c">' + ico('star', 'sm') + 'O‘rtacha ' + st.score + '</span>' +
    '<span class="tag">' + ico('cal', 'sm') + fmtFull(st.joined) + '</span></div>' +
    '<div class="card soft"><div class="row between small" style="margin-bottom:7px"><span class="muted">Kurs progressi</span><b>' + p.pct + '% • ' + p.done + '/' + p.total + ' dars</b></div>' + bar(p.pct) + '</div>' +
    '<div class="grid g3" style="margin:12px 0">' +
    '<div class="card tight soft tc"><div class="big">' + acceptedOf(st) + '</div><div class="xs muted">qabul qilingan</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + subsOf(st).filter(x => x.status === 'in_review').length + '</div><div class="xs muted">tekshirilmoqda</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + cs.length + '</div><div class="xs muted">sertifikat</div></div></div>' +
    '<div class="up muted" style="margin-bottom:8px">Vazifalar holati</div>' +
    '<div class="col" style="gap:8px">' + S.tasks.map(t => { const s = subOf(st, t.id); const due = dueOf(st, t); const late = !s && timeLeft(due).late;
      return '<div class="lrow ' + (late ? 'hot' : '') + '"><div class="lead">' + ico(modOf(t.m).icon) + '</div>' +
        '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:700">' + esc(t.title) + '</div><div class="xs muted">Deadline: ' + fmtD(due) + (s ? ' • yuborilgan: ' + fmtD(s.at) : '') + '</div></div>' +
        (s ? stChip(s.status) : late ? stChip('late') : stChip('none')) + '</div>'; }).join('') + '</div>' +
    (st.goal ? '<div class="card soft" style="margin-top:12px"><div class="up muted" style="margin-bottom:6px">Maqsadi</div><div class="small t2">' + esc(st.goal) + '</div></div>' : '') +
    '<div class="row" style="margin-top:14px;gap:9px"><button class="btn btn-primary grow" data-act="nudge" data-id="' + st.id + '">' + ico('bell', 'sm') + 'Eslatma yuborish</button>' +
    '<button class="btn btn-soft" data-act="msg" data-id="' + st.id + '">' + ico('chat', 'sm') + 'Xabar</button>' +
    '<button class="btn btn-ghost" data-act="deadline-open" data-id="' + (g ? g.id : '') + '">' + ico('clock', 'sm') + 'Deadline</button></div>' +
    '<div class="divider"></div><div class="up muted" style="margin-bottom:8px">Talaba amallari</div>' +
    '<div class="row wrap" style="gap:9px">' +
    '<select class="inp" style="width:auto" data-act="change-group" data-id="' + st.id + '" aria-label="Jamoa o‘zgartirish"><option value="">Jamoa o‘zgartirish…</option>' +
    S.groups.map(x => '<option value="' + x.id + '"' + (g && g.id === x.id ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select>' +
    '<button class="btn btn-soft btn-sm" data-act="reset-student" data-id="' + st.id + '">' + ico('refresh', 'sm') + 'Progressni tiklash</button>' +
    '<button class="btn btn-danger btn-sm" data-act="delete-student" data-id="' + st.id + '">' + ico('trash', 'sm') + 'Klubdan chiqarish</button></div>', 'wide');
}
function createTaskModal() {
  openModal(mhead('Yangi vazifa berish', 'Vazifa modulga bog‘lanadi va barcha jamoalarga tushadi') +
    '<form data-form="new-task" class="col" style="gap:13px">' +
    '<div class="field"><label>Modul</label><select class="inp" name="m">' + S.modules.map(m => '<option value="' + m.id + '">' + m.n + '-modul — ' + esc(m.title) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Vazifa nomi</label><input class="inp" name="title" required placeholder="Masalan: AI bilan biznes g‘oyasi tahlili"></div>' +
    '<div class="field"><label>Tavsif</label><textarea class="inp" name="brief" placeholder="Nima qilish kerak, qanday formatda topshiriladi…"></textarea></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Deadline</label><input class="inp" type="date" name="dl" value="' + todayISO() + '" required></div>' +
    '<div class="field"><label>Baho maksimali</label><input class="inp" type="number" name="max" value="100"></div></div>' +
    '<div class="field"><label>Kimga</label><select class="inp" name="to"><option value="all">Barcha talabalar</option>' + S.groups.map(g => '<option value="' + g.id + '">' + esc(g.name) + ' jamoasi</option>').join('') + '</select></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('send', 'sm') + 'Vazifani yuborish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}
function createLessonModal(mid) {
  openModal(mhead('Dars qo‘shish', 'Video, matn yoki amaliyot — 10–15 daqiqalik qisqa dars') +
    '<form data-form="new-lesson" class="col" style="gap:13px">' +
    '<div class="field"><label>Modul</label><select class="inp" name="m">' + S.modules.map(m => '<option value="' + m.id + '"' + (m.id === mid ? ' selected' : '') + '>' + m.n + '-modul — ' + esc(m.title) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Dars nomi</label><input class="inp" name="t" required placeholder="Masalan: Claude Code bilan landing qurish"></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Turi</label><select class="inp" name="type">' +
    Object.keys(TYPES).map(k => '<option value="' + k + '">' + TYPES[k].l + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Davomiyligi (daqiqa)</label><input class="inp" type="number" name="dur" value="12" min="3" max="90"></div></div>' +
    '<div class="field"><label>Material havolasi</label><input class="inp" name="link" placeholder="YouTube / Notion / Drive havolasi"></div>' +
    '<div class="field"><label>Qisqa tavsif</label><textarea class="inp" name="brief" placeholder="Dars nima haqida, nima o‘rganiladi…"></textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('plus', 'sm') + 'Darsni qo‘shish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor qilish</button></div></form>', 'narrow');
}
function createModuleModal() {
  openModal(mhead('Yangi modul', 'O‘quv dasturiga yangi modul qo‘shish') +
    '<form data-form="new-module" class="col" style="gap:13px">' +
    '<div class="field"><label>Modul nomi</label><input class="inp" name="title" required placeholder="Masalan: AI bilan marketing"></div>' +
    '<div class="field"><label>Tavsif</label><textarea class="inp" name="desc" placeholder="Modul nima beradi…"></textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('plus', 'sm') + 'Modul qo‘shish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}
function addStudentModal() {
  openModal(mhead('Talaba qo‘shish', 'Yangi a’zoni klubga ro‘yxatdan o‘tkazish') +
    '<form data-form="new-student" class="col" style="gap:13px">' +
    '<div class="field"><label>To‘liq ism</label><input class="inp" name="name" required placeholder="Ism Familiya"></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Telegram</label><input class="inp" name="tg" placeholder="@username"></div>' +
    '<div class="field"><label>Telefon</label><input class="inp" name="phone" placeholder="+998 __ ___ __ __"></div></div>' +
    '<div class="field"><label>Jamoa</label><select class="inp" name="group"><option value="">Hozircha yo‘q</option>' + S.groups.map(g => '<option value="' + g.id + '">' + esc(g.name) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Maqsadi</label><input class="inp" name="goal" placeholder="Nima uchun o‘qiyapti…"></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('plus', 'sm') + 'Qo‘shish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}
function createGroupModal() {
  openModal(mhead('Yangi jamoa tuzish', '3–4 kishilik startap jamoasi') +
    '<form data-form="new-group" class="col" style="gap:13px">' +
    '<div class="field"><label>Jamoa nomi</label><input class="inp" name="name" required placeholder="Masalan: Atlas"></div>' +
    '<div class="field"><label>Loyiha g‘oyasi</label><input class="inp" name="project" placeholder="Muammo → yechim (bir qatorda)"></div>' +
    '<div class="field"><label>Mentor</label><select class="inp" name="mentor">' + S.mentors.map(m => '<option value="' + m.id + '">' + esc(m.name) + ' — ' + esc(m.role) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Birinchi a’zolar (bir nechtasini tanlang)</label><select class="inp" name="members" multiple size="5">' +
    S.students.filter(s => !myGroup(s)).map(s => '<option value="' + s.id + '">' + esc(s.name) + ' • ' + esc(medal(s).n) + '</option>').join('') + '</select></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('flag', 'sm') + 'Jamoani yaratish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}
function addMemberModal(gid) {
  const g = groupOf(gid);
  const free = S.students.filter(s => !myGroup(s));
  openModal(mhead('A’zo qo‘shish', g.name + ' jamoasiga talaba biriktirish') +
    (free.length ? '<div class="col" style="gap:9px">' + free.map(s => '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'sm') +
      '<div><div class="small" style="font-weight:750">' + esc(s.name) + '</div><div class="xs muted">' + esc(medal(s).n) + ' • ' + nf(s.xp) + ' XP</div></div></div>' +
      '<button class="btn btn-xs btn-primary" data-act="group-add" data-id="' + gid + '" data-s="' + s.id + '">' + ico('plus', 'sm') + 'Qo‘shish</button></div>').join('') + '</div>'
      : '<div class="empty">Hamma talaba jamoalarga biriktirilgan. Yangi talaba qo‘shing yoki boshqa jamoadan ko‘chiring.</div>') +
    '<div class="divider"></div><div class="up muted" style="margin-bottom:8px">Boshqa jamoadan ko‘chirish</div>' +
    '<div class="col" style="gap:8px">' + S.groups.filter(x => x.id !== gid).map(x => '<div class="lrow"><div class="row grow" style="gap:10px">' + crest(x, 28) +
      '<div><div class="small" style="font-weight:750">' + esc(x.name) + '</div><div class="xs muted">' + x.members.length + ' a’zo</div></div></div>' +
      '<select class="inp" style="width:auto" data-act="move-student" data-g="' + x.id + '"><option value="">a’zo…</option>' +
      x.members.map(id => '<option value="' + id + '">' + esc(get(S.students, id).name) + '</option>').join('') + '</select></div>').join('') + '</div>');
}
function deadlineModal(gid) {
  openModal(mhead('Deadline belgilash', 'Jamoa uchun alohida yoki umumiy sana') +
    '<form data-form="set-deadline" data-group="' + (gid || '') + '" class="col" style="gap:13px">' +
    '<div class="field"><label>Jamoa</label><select class="inp" name="group">' + S.groups.map(g => '<option value="' + g.id + '"' + (g.id === gid ? ' selected' : '') + '>' + esc(g.name) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Vazifa</label><select class="inp" name="task">' + S.tasks.map(t => '<option value="' + t.id + '">' + modOf(t.m).n + '-modul: ' + esc(t.title) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Yangi sana</label><input class="inp" type="date" name="date" value="' + todayISO() + '" required></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('check', 'sm') + 'Saqlash</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>' +
    '<div class="divider"></div><div class="up muted" style="margin-bottom:8px">Belgilangan istisnolar</div>' +
    '<div class="col" style="gap:8px">' + (Object.keys((groupOf(gid) || { dl: {} }).dl || {}).length ? Object.entries(groupOf(gid).dl).map(([tid, d]) =>
      '<div class="lrow"><div class="grow small">' + esc((taskOf(tid) || { title: tid }).title) + '</div><span class="tag c">' + fmtFull(d) + '</span>' +
      '<button class="btn btn-xs btn-ghost" data-act="del-dl" data-id="' + gid + '" data-t="' + tid + '">' + ico('trash', 'sm') + '</button></div>').join('') : '<div class="xs muted">Istisno yo‘q — umumiy sanalar amal qiladi.</div>') + '</div>', 'narrow');
}

/* ---------- Dashboard ---------- */
function vAdmin() {
  const k = kpisAdmin();
  const rq = reviewQueue();
  const late = lateStudents();
  const maxv = Math.max(...S.weekly.map(w => w.v));
  const top = [...S.students].sort((a, b) => b.wxp - a.wxp).slice(0, 5);

  let h = '<div class="page-head"><div><h1 class="h1">' + wallClock() + ', Bekzod 👋</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">' + fmtFull(todayISO()) + ' • ' + k.total + ' talaba, ' + k.groups + ' jamoa, ' + rq.length + ' ta vazifa tekshiruv kutilmoqda.</p></div>' +
    '<div class="row wrap" style="gap:9px"><button class="btn btn-primary btn-sm" data-act="new-task">' + ico('plus', 'sm') + 'Vazifa berish</button>' +
    '<button class="btn btn-soft btn-sm" data-act="new-lesson">' + ico('video', 'sm') + 'Dars qo‘shish</button>' +
    '<button class="btn btn-soft btn-sm" data-act="new-student">' + ico('users-plus', 'sm') + 'Talaba qo‘shish</button></div></div>';

  h += '<div class="grid g5">' +
    kpi('users', k.total, 'Talabalar', k.active + ' faol', '') +
    kpi('trend', activityPct() + '%', 'Haftalik faollik', k.active + '/' + k.total + ' kishi', 'c') +
    kpi('clock', rq.length, 'Tekshirish navbati', 'Kutilayotgan ishlar', rq.length > 3 ? 'r' : '') +
    kpi('alert', late.length, 'Kechikkanlar', 'Deadline o‘tgan', 'r') +
    kpi('star', k.avg, 'O‘rtacha baho', k.subs + ' topshiriq', 'a') + '</div>';

  h += '<div class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('trend') + 'Haftalik topshirish faolligi</h2>' +
    '<span class="tag c">' + ico('bolt', 'sm') + 'O‘rtacha ' + Math.round(S.weekly.reduce((a, w) => a + w.v, 0) / 7) + '/kun</span></div>' +
    '<div class="chart">' + S.weekly.map((w, i) => '<div class="b"><div class="fill" style="height:' + Math.max(8, Math.round(w.v / maxv * 100)) + '%;animation-delay:' + (i * 50) + 'ms"></div><span>' + w.l + '</span></div>').join('') + '</div>' +
    '<div class="divider"></div>' +
    '<div class="grid g4" style="gap:10px"><div class="card tight soft tc"><div class="big">' + k.subs + '</div><div class="xs muted">jami topshiriq</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + k.accepted + '</div><div class="xs muted">qabul qilindi</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + k.onTime + '%</div><div class="xs muted">o‘z vaqtida</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + k.rev + '</div><div class="xs muted">qayta ishlash</div></div></div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('trophy') + 'Haftalik Top 5</h2>' +
    '<button class="btn btn-xs btn-ghost" data-act="go" data-route="stats">Hisobot' + ico('right', 'sm') + '</button></div>' +
    '<div class="col" style="gap:9px">' + top.map((s, i) => '<div class="lrow"><div class="rank r' + (i + 1) + '">' + (i + 1) + '</div>' + avatar(s, 'xs') +
      '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div><div class="xs muted">' + (myGroup(s) ? myGroup(s).name : '—') + ' • ' + s.streak + ' kun</div></div>' +
      '<b class="nowrap">' + nf(s.wxp) + '</b></div>').join('') + '</div>' +
    '<div class="divider"></div><div class="row between small"><span class="muted">Jamoalar yetakchisi</span><b>' + esc([...S.groups].sort((a, b) => b.xp - a.xp)[0].name) + '</b></div></div></div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('task') + 'Tekshirish navbati</h2>' +
    '<span class="tag ' + (rq.length ? 'o' : 'g') + '">' + rq.length + ' ta ish</span></div>' +
    (rq.length ? '<div class="col" style="gap:10px">' + rq.map(p => { const s = get(S.students, p.st), t = taskOf(p.task);
      return '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'xs') +
        '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div>' +
        '<div class="xs muted ellip">' + esc(t.title) + ' • ' + fmtD(p.at) + '</div></div></div>' +
        '<button class="btn btn-xs btn-primary" data-act="review-open" data-sub="' + p.id + '">' + ico('eye', 'sm') + 'Tekshirish</button></div>'; }).join('') + '</div>'
      : '<div class="empty">Navbat bo‘sh — barcha ishlar tekshirilgan ✅</div>') + '</div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('alert') + 'Kechikkanlar</h2>' +
    '<span class="tag r">' + late.length + ' ta</span></div>' +
    (late.length ? '<div class="col" style="gap:10px">' + late.slice(0, 6).map(x => '<div class="lrow hot"><div class="row grow" style="gap:11px;min-width:0">' + avatar(x.st, 'xs') +
      '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(x.st.name) + '</div>' +
      '<div class="xs muted ellip">' + esc(x.t.title) + ' • ' + timeLeft(x.due).txt + '</div></div></div>' +
      '<button class="btn btn-xs btn-soft" data-act="nudge" data-id="' + x.st.id + '">' + ico('bell', 'sm') + 'Eslatma</button></div>').join('') + '</div>'
      : '<div class="empty">Kechikkan yo‘q 🎉</div>') + '</div></div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('spark') + 'So‘nggi harakatlar</h2></div>' +
    '<div class="col" style="gap:0">' + S.activity.map(a => '<div class="wall-item"><div class="lead" style="width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--panel-3);border:1px solid var(--line);color:var(--txt2)">' + ico('spark', 'sm') + '</div>' +
      '<div><div class="small"><b>' + esc(a.who) + '</b> ' + esc(a.what) + '</div><div class="xs muted">' + esc(a.at) + '</div></div></div>').join('') + '</div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'Jamoalar holati</h2>' +
    '<button class="btn btn-xs btn-ghost" data-act="go" data-route="adminGroups">Boshqarish' + ico('right', 'sm') + '</button></div>' +
    '<div class="col" style="gap:9px">' + [...S.groups].sort((a, b) => b.xp - a.xp).map((g, i) => {
      const tot = g.members.reduce((a, id) => a + get(S.students, id).wxp, 0);
      const mx = 3000;
      return '<div class="lrow"><div class="rank r' + (i + 1) + '">' + (i + 1) + '</div>' + crest(g, 30) +
        '<div class="grow" style="min-width:0"><div class="row between"><span class="small ellip" style="font-weight:750">' + esc(g.name) + '</span><span class="xs muted">' + nf(g.xp) + '</span></div>' +
        '<div style="margin-top:5px">' + bar(Math.round(g.xp / 5000 * 100)) + '</div></div></div>'; }).join('') + '</div></div></div>';
  return h;
}

/* ---------- Talabalar ---------- */
function vStudents() {
  const f = UI.studentsFilter || 'all';
  const lateIds = lateStudents().map(x => x.st.id);
  const list = S.students.filter(s => f === 'all' ? true
    : f === 'inactive' ? !onl(s)
    : f === 'late' ? lateIds.includes(s.id)
    : myGroup(s) && myGroup(s).id === f);
  let h = '<div class="page-head"><div><h1 class="h1">Talabalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Guruh, daraja va faollik bo‘yicha kuzatuv. Profilni ochib vazifa, deadline va baholarni ko‘rish mumkin.</p></div>' +
    '<button class="btn btn-primary btn-sm" data-act="new-student">' + ico('users-plus', 'sm') + 'Talaba qo‘shish</button></div>';

  h += '<div class="grid g4">' +
    kpi('users', S.students.length, 'Jami talaba', S.groups.length + ' jamoada', '') +
    kpi('bolt', activeCount(), 'Faol', activityPct() + '% haftalik faollik', 'a') +
    kpi('clock', lateStudents().length, 'Kechikkanlar', 'Yordam kerak', 'r') +
    kpi('star', (S.students.reduce((a, s) => a + (Number(s.score) || 0), 0) / Math.max(1, S.students.length)).toFixed(1), 'O‘rtacha ball', '100 ballik tizim', 'c') + '</div>';

  h += '<div class="row wrap between" style="gap:10px">' +
    '<div class="seg">' +
    [['all', 'Barchasi (' + S.students.length + ')'], ['late', 'Kechikkan (' + [...new Set(lateIds)].length + ')'], ['inactive', 'Jim (' + S.students.filter(x => !onl(x)).length + ')']]
      .map(([k, l]) => '<button class="' + (f === k ? ' on' : '') + '" data-act="filter-s" data-f="' + k + '">' + esc(l) + '</button>').join('') +
    '</div><div class="seg">' + S.groups.map(g => [g.id, g.name + ' (' + g.members.length + ')'])
      .map(([k, l]) => '<button class="' + (f === k ? ' on' : '') + '" data-act="filter-s" data-f="' + k + '">' + esc(l) + '</button>').join('') +
    '</div></div>';

  h += '<div class="row wrap between" style="gap:10px;margin-top:-4px">' +
    '<div class="row small t2 only-sm" style="gap:8px">' + ico('filter', 'sm') + 'Saralash:' +
    '<select class="inp" style="width:auto;padding:8px 12px" data-act="sort-sel" aria-label="Saralash">' +
    [['name', 'Ism (A–Z)'], ['progress', 'Progress'], ['score', 'Baho'], ['xp', 'XP'], ['streak', 'Streak'], ['group', 'Jamoa']]
      .map(([k, l]) => '<option value="' + k + '"' + (UI.sort.k === k ? ' selected' : '') + '>' + esc(l) + '</option>').join('') +
    '</select></div>' +
    '<span class="xs muted hide-sm">Ustun nomini bosing — saralash uchun</span></div>';

  const sorted = sortStudentsList(list);
  h += '<div class="card" style="padding:14px 12px"><div class="table-scroll"><div class="trows">' +
    '<div class="trow head">' + thBtn('name', 'Talaba') + '<span class="cell-hide">' + thBtn('group', 'Jamoa') + '</span>' +
    '<span class="cell-hide">' + thBtn('progress', 'Progress') + '</span><span class="cell-hide">' + thBtn('score', 'Faollik / baho') + '</span>' +
    '<span class="tr">Amallar</span></div>' +
    sorted.map(s => { const p = progress(s); const g = myGroup(s); const late = lateStudents().some(x => x.st.id === s.id);
      return '<div class="trow"><div class="row" style="gap:10px;min-width:0">' + avatar(s, 'sm') +
        '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div>' +
        '<div class="xs muted ellip">' + esc(s.tg) + ' • ' + esc(medal(s).n) + '</div></div></div>' +
        '<span class="cell-hide"><span class="tag ' + (g ? 'p' : '') + '">' + (g ? esc(g.name) : 'biriktirilmagan') + '</span></span>' +
        '<span class="cell-hide"><div class="row" style="gap:8px"><div class="grow">' + bar(p.pct) + '</div><span class="xs muted nowrap">' + p.pct + '%</span></div></span>' +
        '<span class="cell-hide"><div class="row wrap" style="gap:7px">' + (late ? '<span class="tag r">kechikkan</span>' : onl(s) ? '<span class="tag g">onlayn</span>' : '<span class="tag">' + s.last + ' kun</span>') +
        '<span class="tag a">' + ico('star', 'sm') + s.score + '</span><span class="tag c">' + ico('bolt', 'sm') + nf(s.wxp) + '</span></div></span>' +
        '<span class="row" style="gap:7px;justify-content:flex-end"><button class="btn btn-xs btn-soft" data-act="student-open" data-id="' + s.id + '">Profil</button>' +
        '<button class="btn btn-xs btn-ghost" data-act="nudge" data-id="' + s.id + '" aria-label="Eslatma yuborish">' + ico('bell', 'sm') + '</button></span></div>'; }).join('') +
    '</div></div>' + (sorted.length ? '' : '<div class="empty">Filtr bo‘yicha talaba topilmadi</div>') + '</div>';
  return h;
}

/* ---------- Vazifalar (admin) ---------- */
function vAdminTasks() {
  const f = UI.reviewFilter;
  /* eng yangi topshiriqlar birinchi (sanaga qarab) */
  const sorted = [...S.submissions].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  const subs = f === 'all' ? sorted : sorted.filter(p => p.status === f);
  let h = '<div class="page-head"><div><h1 class="h1">Vazifalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Vazifa bering, tekshiring, baho va izoh yozing. Deadline’larni jamoa bo‘yicha boshqaring.</p></div>' +
    '<div class="row wrap" style="gap:9px"><button class="btn btn-primary btn-sm" data-act="new-task">' + ico('plus', 'sm') + 'Yangi vazifa</button>' +
    '<button class="btn btn-soft btn-sm" data-act="deadline-open" data-id="">' + ico('clock', 'sm') + 'Deadline belgilash</button></div></div>';

  h += '<div class="grid g4">' +
    kpi('task', S.submissions.length, 'Topshiriqlar', reviewQueue().length + ' navbatda', '') +
    kpi('check-c', S.submissions.filter(p => p.status === 'accepted').length, 'Qabul qilingan', 'O‘z vaqtida: ' + onTimePct() + '%', 'a') +
    kpi('refresh', S.submissions.filter(p => p.status === 'revise').length, 'Qayta ishlash', 'Talaba tuzatishi kerak', 'c') +
    kpi('alert', S.submissions.filter(p => p.status === 'late').length, 'Kechikkan', 'Suhbat kerak', 'r') + '</div>';

  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('book') + 'Modul vazifalari va deadline’lar</h2>' +
    '<span class="small muted">' + S.tasks.length + ' vazifa</span></div>' +
    '<div class="table-scroll"><div class="trows">' + S.tasks.map(t => {
      const mm = modOf(t.m);
      const rel = S.submissions.filter(p => p.task === t.id);
      const acc = rel.filter(p => p.status === 'accepted').length;
      const rev = rel.filter(p => p.status === 'in_review').length;
      const lateN = rel.filter(p => p.status === 'late').length + S.students.filter(s => !subOf(s, t.id) && timeLeft(dueOf(s, t)).late).length;
      const done = Math.round((acc / S.students.length) * 100);
      return '<div class="trow"><div class="row" style="gap:10px;min-width:0"><div class="lead" style="width:36px;height:36px">' + ico(mm.icon, 'sm') + '</div>' +
        '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(t.title) + '</div>' +
        '<div class="xs muted">' + mm.n + '-modul • ' + fmtFull(t.dl) + '</div></div></div>' +
        '<span class="cell-hide"><span class="tag ' + (timeLeft(t.dl).late ? 'r' : 'c') + '">' + (timeLeft(t.dl).late ? 'muddati o‘tgan' : fmtD(t.dl)) + '</span></span>' +
        '<span class="cell-hide"><div class="row" style="gap:8px"><div class="grow">' + bar(done, done === 100 ? 'accent' : '') + '</div><span class="xs muted nowrap">' + acc + '/' + S.students.length + '</span></div></span>' +
        '<span class="cell-hide"><div class="row wrap" style="gap:7px"><span class="tag g">qabul ' + acc + '</span><span class="tag c">navbat ' + rev + '</span>' + (lateN ? '<span class="tag r">kechikkan ' + lateN + '</span>' : '') + '</div></span>' +
        '<span class="row" style="gap:7px;justify-content:flex-end"><button class="btn btn-xs btn-soft" data-act="task-review" data-id="' + t.id + '">Tekshirish</button>' +
        '<button class="btn btn-xs btn-ghost" data-act="deadline-open" data-id="">' + ico('clock', 'sm') + '</button></span></div>';
    }).join('') + '</div></div></div>';

  h += '<div class="row wrap between" style="gap:10px"><h2 class="h2">Topshiriqlar oqimi</h2><div class="seg">' +
    [['all', 'Barchasi'], ['in_review', 'Tekshirilmoqda'], ['accepted', 'Qabul'], ['revise', 'Qayta ishlash'], ['late', 'Kechikkan']]
      .map(([k, l]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="filter2" data-f="' + k + '">' + l + '</button>').join('') + '</div></div>';

  h += '<div class="col" style="gap:10px">' + (subs.length ? subs.slice(0, 24).map(p => { const s = get(S.students, p.st), t = taskOf(p.task);
    return '<div class="lrow ' + (p.status === 'late' ? 'hot' : '') + '"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'xs') +
      '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + ' — ' + esc(t.title) + '</div>' +
      '<div class="xs muted">Yuborilgan: ' + fmtFull(p.at) + ' • ' + esc(myGroup(s) ? myGroup(s).name : '—') + (p.score != null ? ' • ' + p.score + '/100' : '') + '</div></div></div>' +
      stChip(p.status) +
      '<button class="btn btn-xs ' + (p.status === 'in_review' ? 'btn-primary' : 'btn-soft') + '" data-act="review-open" data-sub="' + p.id + '">' + (p.status === 'in_review' ? 'Tekshirish' : 'Ko‘rish') + '</button></div>';
  }).join('') : '<div class="empty">Bu filtrda topshiriq yo‘q</div>') + '</div>';
  return h;
}

/* ---------- Darslar (admin) ---------- */
function vAdminLessons() {
  let h = '<div class="page-head"><div><h1 class="h1">Darslar va kontent</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Modullar bo‘yicha darslar: video, matn va amaliyot. 10–15 daqiqalik qisqa format saqlanadi.</p></div>' +
    '<div class="row wrap" style="gap:9px"><button class="btn btn-primary btn-sm" data-act="new-lesson">' + ico('plus', 'sm') + 'Dars qo‘shish</button>' +
    '<button class="btn btn-soft btn-sm" data-act="new-module">' + ico('flag', 'sm') + 'Yangi modul</button></div></div>';

  h += '<div class="grid g4">' +
    kpi('book', S.modules.length, 'Modul', 'O‘quv dasturi', '') +
    kpi('video', S.lessons.length, 'Dars', S.lessons.reduce((a, l) => a + l.dur, 0) + ' daqiqa kontent', 'c') +
    kpi('bolt', S.lessons.filter(l => l.type === 'practice').length, 'Amaliyot', 'Topshiriqli darslar', 'a') +
    kpi('task', S.tasks.length, 'Vazifa', 'Har modulga bittadan', '') + '</div>';

  h += '<div class="col" style="gap:14px">' + S.modules.map(mm => {
    const ls = lessonsOfModule(mm.id); const t = S.tasks.find(x => x.m === mm.id);
    const completers = S.students.filter(s => modulePct(s, mm.id).pct === 100).length;
    return '<div class="card"><div class="card-h"><div class="row" style="gap:12px">' +
      '<div class="lead" style="width:42px;height:42px;border-radius:13px;background:rgba(124,92,255,.16);border-color:rgba(124,92,255,.3);color:#C4B4FF">' + ico(mm.icon) + '</div>' +
      '<div><div class="up muted">' + mm.n + '-modul</div><h2 class="h2">' + esc(mm.title) + '</h2>' +
      '<div class="xs muted">' + ls.length + ' dars • ' + completers + ' talaba 100% tugatgan • ' + (t ? 'vazifa: ' + esc(t.title) : 'vazifa yo‘q') + '</div></div></div>' +
      '<div class="row" style="gap:8px"><button class="btn btn-xs btn-soft" data-act="new-lesson-mod" data-id="' + mm.id + '">' + ico('plus', 'sm') + 'Dars</button>' +
      '<button class="btn btn-xs btn-ghost" data-act="del-module" data-id="' + mm.id + '">' + ico('trash', 'sm') + '</button></div></div>' +
      '<div class="col" style="gap:5px">' + ls.map((l, i) => { const ty = TYPES[l.type] || TYPES.video;
        return '<div class="lesson-row"><div class="num">' + (i + 1) + '</div>' +
          '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:700">' + esc(l.t) + '</div>' +
          '<div class="xs muted ellip">' + esc(l.brief) + '</div></div>' +
          '<span class="tag ' + ty.tag + '">' + ico(ty.i, 'sm') + esc(ty.l) + '</span>' +
          '<span class="xs muted nowrap hide-sm">' + l.dur + ' daq</span>' +
          '<button class="btn btn-xs btn-ghost" data-act="lesson-edit" data-id="' + l.id + '" aria-label="Tahrirlash">' + ico('edit', 'sm') + '</button>' +
          '<button class="btn btn-xs btn-ghost" data-act="del-lesson" data-id="' + l.id + '" aria-label="O‘chirish">' + ico('trash', 'sm') + '</button></div>';
      }).join('') + '</div></div>';
  }).join('') + '</div>';
  return h;
}

/* ---------- Jamoalar (admin) ---------- */
function vAdminGroups() {
  const free = S.students.filter(s => !myGroup(s));
  let h = '<div class="page-head"><div><h1 class="h1">Jamoalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Jamoa tuzish, a’zolarni biriktirish va mentor juftlash. Jamoa = startap mashqi.</p></div>' +
    '<button class="btn btn-primary btn-sm" data-act="new-group">' + ico('flag', 'sm') + 'Yangi jamoa</button></div>';

  h += '<div class="grid g4">' +
    kpi('flag', S.groups.length, 'Jamoalar', S.groups.reduce((a, g) => a + g.members.length, 0) + ' a’zo', '') +
    kpi('users-plus', free.length, 'Biriktirilmagan', 'Yangi a’zolar', free.length ? 'a' : '') +
    kpi('trophy', esc([...S.groups].sort((a, b) => b.xp - a.xp)[0].name), 'Yetakchi jamoa', nf([...S.groups].sort((a, b) => b.xp - a.xp)[0].xp) + ' XP', 'c') +
    kpi('target', S.gallery.length, 'Galereyadagi loyiha', 'Demo Day’ga tayyor', '') + '</div>';

  if (free.length) h += '<div class="card" style="border-color:rgba(198,255,79,.3);background:linear-gradient(120deg,rgba(198,255,79,.07),transparent 60%)"><div class="row wrap between" style="gap:12px">' +
    '<div class="row" style="gap:11px">' + ico('users-plus') + '<div><div class="small" style="font-weight:750">' + free.length + ' talaba hali jamoasiz</div>' +
    '<div class="xs muted">' + free.map(s => esc(s.name)).join(', ') + '</div></div></div>' +
    '<button class="btn btn-soft btn-sm" data-act="go" data-route="adminGroups">Jamoalarga taqsimlash</button></div></div>';

  h += '<div class="grid g2">' + S.groups.map(g => {
    const m = mentorOf(g.mentor);
    const task = S.tasks[2];
    const donePct = Math.round(g.members.filter(id => { const p = subOf(get(S.students, id), task.id); return p && p.status === 'accepted'; }).length / g.members.length * 100);
    return '<div class="card"><div class="card-h"><div class="row" style="gap:12px">' + crest(g, 46) +
      '<div><div class="row" style="gap:7px"><h2 class="h2">' + esc(g.name) + '</h2><span class="tag ' + (teamRank(g.id) === 1 ? 'a' : '') + '">#' + teamRank(g.id) + '</span></div>' +
      '<div class="xs muted ellip" style="max-width:230px">' + esc(g.project) + '</div></div></div>' +
      '<button class="btn btn-xs btn-ghost" data-act="group-open" data-id="' + g.id + '">' + ico('eye', 'sm') + '</button></div>' +
      '<div class="row wrap" style="gap:8px;margin-bottom:12px"><span class="tag p">' + ico('bolt', 'sm') + nf(g.xp) + ' XP</span>' +
      '<span class="tag c">' + ico('user', 'sm') + (m ? esc(m.name.split(' ')[0]) : 'mentor yo‘q') + '</span>' +
      '<span class="tag ' + (donePct === 100 ? 'g' : 'o') + '">loyiha ' + donePct + '%</span></div>' +
      '<div class="col" style="gap:8px">' + g.members.map(id => { const s = get(S.students, id); const p = progress(s);
        return '<div class="row" style="gap:10px">' + avatar(s, 'xs') +
          '<div class="grow" style="min-width:0"><div class="row between"><span class="small ellip" style="font-weight:700">' + esc(s.name) + '</span><span class="xs muted">' + p.pct + '%</span></div>' +
          '<div style="margin-top:4px">' + bar(p.pct, p.pct === 100 ? 'accent' : '') + '</div></div>' +
          '<button class="btn btn-xs btn-ghost" data-act="group-remove" data-id="' + g.id + '" data-s="' + s.id + '">' + ico('x', 'sm') + '</button></div>'; }).join('') + '</div>' +
      '<div class="divider"></div>' +
      '<div class="row wrap" style="gap:8px"><button class="btn btn-xs btn-soft" data-act="group-add-member" data-id="' + g.id + '">' + ico('plus', 'sm') + 'A’zo qo‘shish</button>' +
      '<button class="btn btn-xs btn-soft" data-act="deadline-open" data-id="' + g.id + '">' + ico('clock', 'sm') + 'Deadline</button>' +
      '<button class="btn btn-xs btn-soft" data-act="msg" data-id="' + g.mentor + '">' + ico('chat', 'sm') + 'Mentorga yozish</button>' +
      '<button class="btn btn-xs btn-ghost" data-act="del-group" data-id="' + g.id + '">' + ico('trash', 'sm') + '</button></div></div>';
  }).join('') + '</div>';
  return h;
}

/* ---------- Deadline'lar (admin) ---------- */
function vAdminDeadlines() {
  const cal = calData(UI.cal || 0);
  const map = {};
  S.tasks.forEach(t => { (map[t.dl] = map[t.dl] || []).push({ l: t.title, k: 'task' }); });
  Object.entries(S.groups).forEach(([i, g]) => Object.entries(g.dl || {}).forEach(([tid, d]) => {
    (map[d] = map[d] || []).push({ l: (taskOf(tid) || { title: tid }).title + ' — ' + g.name, k: 'team' });
  }));
  const late = lateStudents();
  const today = todayISO();

  let h = '<div class="page-head"><div><h1 class="h1">Deadline boshqaruvi</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Umumiy va jamoa uchun alohida sanalar. Kechikkanlarni bir joydan ko‘rasiz.</p></div>' +
    '<button class="btn btn-primary btn-sm" data-act="deadline-open" data-id="">' + ico('plus', 'sm') + 'Deadline belgilash</button></div>';

  h += '<div class="grid g4">' +
    kpi('cal', S.tasks.length, 'Umumiy deadline', 'Modul vazifalari', '') +
    kpi('flag', Object.values(S.groups).reduce((a, g) => a + Object.keys(g.dl || {}).length, 0), 'Jamoa istisnolari', 'Alohida belgilangan', 'c') +
    kpi('alert', late.length, 'Kechikkan topshiriq', late.length ? 'Eslatma yuborish kerak' : 'Hammasi joyida', 'r') +
    kpi('check-c', onTimePct() + '%', 'O‘z vaqtida', 'Topshirish intizomi', 'a') + '</div>';

  h += '<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">' +
    '<div class="card"><div class="card-h"><div class="row" style="gap:8px">' +
    '<button class="btn-icon" style="width:36px;height:36px" data-act="cal-prev">' + ico('left', 'sm') + '</button>' +
    '<h2 class="h2" style="min-width:150px;text-align:center">' + esc(cal.label) + '</h2>' +
    '<button class="btn-icon" style="width:36px;height:36px" data-act="cal-next">' + ico('right', 'sm') + '</button></div>' +
    '<div class="row xs muted wrap" style="gap:12px"><span class="row" style="gap:6px"><i style="width:8px;height:8px;border-radius:50%;background:#7C5CFF;display:block"></i>umumiy</span>' +
    '<span class="row" style="gap:6px"><i style="width:8px;height:8px;border-radius:50%;background:#C6FF4F;display:block"></i>jamoa uchun</span></div></div>' +
    '<div class="cal">' + UZ_D.map(d => '<div class="hd">' + d + '</div>').join('') +
    cal.cells.map(c => { const ds = isoDate(c.d), items = map[ds] || [];
      return '<div class="d ' + (c.out ? 'out ' : '') + (ds === today ? 'today ' : '') + (items.length ? 'has' : '') + '" ' + (items.length ? 'data-act="cal-day2" data-d="' + ds + '"' : '') + '>' +
        '<span class="n">' + c.d.getDate() + '</span><div class="dots">' + items.slice(0, 4).map(it => '<i style="background:' + (it.k === 'team' ? '#C6FF4F' : '#7C5CFF') + '"></i>').join('') + '</div></div>';
    }).join('') + '</div></div>' +

    '<div class="col" style="gap:14px"><div class="card"><div class="card-h"><h2 class="h2">' + ico('alert') + 'Kechikkanlar ro‘yxati</h2>' +
    '<span class="tag r">' + late.length + '</span></div>' +
    (late.length ? '<div class="col" style="gap:9px;max-height:340px;overflow:auto">' + late.map(x => '<div class="lrow hot"><div class="row grow" style="gap:10px;min-width:0">' + avatar(x.st, 'xs') +
      '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(x.st.name) + '</div><div class="xs muted ellip">' + esc(x.t.title) + ' • ' + fmtD(x.due) + '</div></div></div>' +
      '<button class="btn btn-xs btn-soft" data-act="nudge" data-id="' + x.st.id + '">' + ico('bell', 'sm') + '</button></div>').join('') + '</div>'
      : '<div class="empty">Kechikkan yo‘q 🎉</div>') + '</div>' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users') + 'Jamoalar kesimida</h2></div>' +
    '<div class="col" style="gap:10px">' + S.groups.map(g => { const k2 = g.members.filter(id => lateStudents().some(x => x.st.id === id && (x.st.group === g.id))).length;
      return '<div class="row between small"><span class="row" style="gap:9px">' + crest(g, 26) + esc(g.name) + '</span>' +
        '<span class="row" style="gap:8px"><span class="tag ' + (k2 ? 'r' : 'g') + '">' + (k2 ? k2 + ' kechikkan' : 'intizomli') + '</span>' +
        '<button class="btn btn-xs btn-ghost" data-act="deadline-open" data-id="' + g.id + '">' + ico('clock', 'sm') + '</button></span></div>'; }).join('') + '</div></div></div></div>';
  return h;
}

/* ---------- Statistika ---------- */
function vStats() {
  const k = kpisAdmin();
  const modStats = S.modules.map(m => { const done = S.students.filter(s => modulePct(s, m.id).pct === 100).length;
    return { m, done, pct: Math.round(done / S.students.length * 100) }; });
  const deployed = S.students.filter(s => ['t4', 't5'].some(t => { const p = subOf(s, t); return p && p.status === 'accepted'; })).length;
  const grads = S.students.filter(s => certsOf(s).length > 0).length;
  const byGroup = [...S.groups].sort((a, b) => b.xp - a.xp);
  const maxg = Math.max(...byGroup.map(g => g.xp));
  const retention = [100, 94, 89, 83, 78, activityPct()];

  let h = '<div class="page-head"><div><h1 class="h1">Statistika</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Asosiy ko‘rsatkichlar: faollik, intizom, modul tugatish va loyiha chiqarish.</p></div>' +
    '<button class="btn btn-soft btn-sm" data-act="export">' + ico('download', 'sm') + 'Hisobotni yuklab olish</button></div>';

  h += '<div class="grid g4">' +
    kpi('users', k.active + '/' + k.total, 'Haftalik faol talaba', activityPct() + '%', 'c') +
    kpi('check-c', k.onTime + '%', 'O‘z vaqtida topshirish', k.subs + ' topshiriq asosida', 'a') +
    kpi('book', grads, 'Modul tugatganlar', k.total ? Math.round(grads / k.total * 100) + '% klub' : '', '') +
    kpi('rocket', deployed, 'Loyiha chiqarganlar', 'GitHub + Vercel', 'a') + '</div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('trend') + 'Modullar bo‘yicha tugatish</h2><span class="small muted">100% tugatgan talabalar</span></div>' +
    '<div class="col" style="gap:12px">' + modStats.map(x => '<div><div class="row between small" style="margin-bottom:6px"><span class="t2">' + x.m.n + '. ' + esc(x.m.title) + '</span><b>' + x.done + '/' + S.students.length + '</b></div>' + bar(x.pct) + '</div>').join('') + '</div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flame') + 'Kohortani ushlab turish</h2><span class="tag c">Retention</span></div>' +
    '<div class="chart">' + retention.map((v, i) => '<div class="b' + (i === retention.length - 1 ? ' hi' : '') + '"><div class="fill" style="height:' + v + '%;animation-delay:' + (i * 55) + 'ms"></div><span>' + (i * 2) + '-h</span></div>').join('') + '</div>' +
    '<div class="divider"></div><div class="col" style="gap:8px">' +
    '<div class="row between small"><span class="muted">1-haftada qolganlar</span><b>100%</b></div>' +
    '<div class="row between small"><span class="muted">Hozirgi faollik</span><b>' + activityPct() + '%</b></div>' +
    '<div class="row between small"><span class="muted">Streak 7+ kun</span><b>' + S.students.filter(s => s.streak >= 7).length + ' talaba</b></div>' +
    '<div class="row between small"><span class="muted">Jim qolganlar</span><b>' + (S.students.length - k.active) + ' talaba</b></div></div></div></div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'Jamoalar reytingi</h2><span class="small muted">Umumiy XP</span></div>' +
    '<div class="col" style="gap:12px">' + byGroup.map((g, i) => '<div><div class="row between small" style="margin-bottom:6px">' +
      '<span class="row" style="gap:9px"><span class="rank r' + (i + 1) + '" style="width:26px;height:26px;font-size:11px">' + (i + 1) + '</span>' + esc(g.name) + '</span><b>' + nf(g.xp) + '</b></div>' +
      bar(Math.round(g.xp / maxg * 100), i === 0 ? 'accent' : '') + '</div>').join('') + '</div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('star') + 'Eng yaxshi loyihalar</h2><span class="tag a">Galereya</span></div>' +
    '<div class="col" style="gap:10px">' + S.gallery.map(it => '<div class="lrow"><div class="lead">' + ico('rocket', 'sm') + '</div>' +
      '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(it.t) + '</div><div class="xs muted ellip">' + esc(it.kind) + ' • ' + esc(it.desc) + '</div></div>' +
      '<a class="btn btn-xs btn-soft" href="' + esc(it.link) + '" target="_blank" rel="noopener">' + ico('globe', 'sm') + '</a></div>').join('') + '</div>' +
    '<div class="divider"></div><div class="xs muted">Demo Day: 28-noyabr, Toshkent. Har jamoa 5 daqiqa pitch qiladi.</div></div></div>';

  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('dash') + 'Xulosa va keyingi qadamlar</h2></div>' +
    '<div class="grid g3">' + [
      ['alert', 'Jim qolganlar', (S.students.length - k.active) + ' talaba 5+ kun kirmagan — mentor juftligi tayinlang'],
      ['clock', 'Kechikish', k.lateSt + ' ta kechikkan topshiriq — avatar/telefon orqali bog‘laning'],
      ['rocket', 'Loyiha bosqichi', deployed + ' talaba loyihasini jonli havola bilan chiqargan'],
      ['users', 'Jamoa balansi', 'Har jamoaga 3 a’zo: 1 builder, 1 dizayner, 1 growth'],
      ['trophy', 'Musobaqa', 'Haftalik reyting g‘olibi: ' + esc([...S.students].sort((a, b) => b.wxp - a.wxp)[0].name)],
      ['cal', 'Offline kun', 'Oyiga bir marta offline demo-kun — keyingisi 28-noyabr']
    ].map(x => '<div class="card tight soft"><div class="row" style="gap:9px">' + ico(x[0], 'sm') + '<b class="small">' + esc(x[1]) + '</b></div>' +
      '<div class="xs muted" style="margin-top:8px">' + esc(x[2]) + '</div></div>').join('') + '</div></div>';
  return h;
}


/* ---------- Bahoni tahrirlash ---------- */
function reviewEditModal(subId) {
  const p = get(S.submissions, subId), st = get(S.students, p.st), t = taskOf(p.task);
  openModal(mhead('Bahoni tahrirlash', st.name + ' • ' + t.title) +
    '<form data-form="review" data-sub="' + p.id + '" class="col" style="gap:12px">' +
    '<div class="row" style="gap:12px"><div class="field grow"><label>Baho (0–100)</label><input class="inp" name="score" type="number" min="0" max="100" value="' + (p.score != null ? p.score : 85) + '" required></div>' +
    '<div class="field grow"><label>Qaror</label><select class="inp" name="status">' +
    [['accepted', 'Qabul qilish'], ['revise', 'Qayta ishlashga'], ['late', 'Kechikkan deb belgilash'], ['in_review', 'Yana tekshirilmoqda']]
      .map(([k, l]) => '<option value="' + k + '"' + (p.status === k ? ' selected' : '') + '>' + l + '</option>').join('') +
    '</select></div></div>' +
    '<div class="field"><label>Izoh</label><textarea class="inp" name="fb">' + esc(p.fb || '') + '</textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('check-c', 'sm') + 'Saqlash</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>' +
    '<div class="divider"></div><a class="row small" style="gap:8px;word-break:break-all" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + ico('link', 'sm') + esc(p.link) + '</a>', 'narrow');
}

/* ---------- Darsni tahrirlash ---------- */
function editLessonModal(id) {
  const l = lessonOf(id); if (!l) return;
  openModal(mhead('Darsni tahrirlash', modOf(l.m).n + '-modul') +
    '<form data-form="new-lesson" data-id="' + l.id + '" class="col" style="gap:13px">' +
    '<div class="field"><label>Modul</label><select class="inp" name="m">' + S.modules.map(m => '<option value="' + m.id + '"' + (m.id === l.m ? ' selected' : '') + '>' + m.n + '-modul — ' + esc(m.title) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Dars nomi</label><input class="inp" name="t" value="' + esc(l.t) + '" required></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Turi</label><select class="inp" name="type">' +
    Object.keys(TYPES).map(k => '<option value="' + k + '"' + (l.type === k ? ' selected' : '') + '>' + TYPES[k].l + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Davomiyligi (daqiqa)</label><input class="inp" type="number" name="dur" value="' + l.dur + '" min="3" max="90"></div></div>' +
    '<div class="field"><label>Material havolasi</label><input class="inp" name="link" value="' + esc(l.link || '') + '"></div>' +
    '<div class="field"><label>Qisqa tavsif</label><textarea class="inp" name="brief">' + esc(l.brief || '') + '</textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('check', 'sm') + 'Saqlash</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}

/* ---------- Galereyaga loyiha qo'shish ---------- */
function addGalleryModal() {
  openModal(mhead('Galereyaga loyiha qo‘shish', 'Eng yaxshi ishlar hammaga ko‘rinadi') +
    '<form data-form="new-gallery" class="col" style="gap:13px">' +
    '<div class="field"><label>Loyiha nomi</label><input class="inp" name="t" required placeholder="Masalan: EduBot"></div>' +
    '<div class="field"><label>Tavsif</label><textarea class="inp" name="desc" placeholder="Muammo → yechim, natija…"></textarea></div>' +
    '<div class="grid g2" style="gap:12px"><div class="field"><label>Egasi</label><select class="inp" name="by">' +
    S.students.map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Rang</label><select class="inp" name="k"><option value="g1">Binafsha</option><option value="g2">Moviy</option><option value="g3">To‘q sariq</option><option value="g4">Yashil</option></select></div></div>' +
    '<div class="field"><label>Jonli havola</label><input class="inp" name="link" required placeholder="https://loyiha.vercel.app"></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('plus', 'sm') + 'Qo‘shish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}

/* ---------- Mentor qo'shish ---------- */
function addMentorModal() {
  openModal(mhead('Yangi mentor', 'Mentor jamoalarga biriktiriladi') +
    '<form data-form="new-mentor" class="col" style="gap:13px">' +
    '<div class="field"><label>To‘liq ism</label><input class="inp" name="name" required></div>' +
    '<div class="field"><label>Yo‘nalish</label><input class="inp" name="role" placeholder="AI mentor / Product mentor / Design mentor"></div>' +
    '<div class="field"><label>Telegram</label><input class="inp" name="tg" placeholder="@username"></div>' +
    '<div class="field"><label>Qisqa tavsif</label><textarea class="inp" name="bio" placeholder="Tajribasi va qaysi mavzuda yordam beradi…"></textarea></div>' +
    '<div class="row" style="gap:10px"><button class="btn btn-primary grow" type="submit">' + ico('plus', 'sm') + 'Mentor qo‘shish</button>' +
    '<button class="btn btn-ghost" type="button" data-act="close-modal">Bekor</button></div></form>', 'narrow');
}

/* ---------- Sozlamalar (admin) ---------- */
function vAdminSettings() {
  const k = kpisAdmin();
  const size = (() => { try { return (new Blob([JSON.stringify(S)]).size / 1024).toFixed(1); } catch (e) { return '—'; } })();
  let h = '<div class="page-head"><div><h1 class="h1">Sozlamalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Zaxira nusxa, mentorlar, galereya va platforma ma’lumotlari.</p></div>' +
    '<span class="tag c">' + ico('shield', 'sm') + 'v' + APP_VERSION + '</span></div>';

  h += '<div class="grid g4">' +
    kpi('users', k.total, 'Talaba', k.groups + ' jamoa', '') +
    kpi('book', S.lessons.length, 'Dars', S.modules.length + ' modul', 'c') +
    kpi('user', S.mentors.length, 'Mentor', 'Talaba–mentor juftligi', 'a') +
    kpi('dash', size + ' KB', 'Ma’lumot hajmi', 'Brauzer xotirasida', '') + '</div>';

  h += '<div class="grid g2">' +
    /* zaxira */
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('download') + 'Zaxira nusxa va tiklash</h2></div>' +
    '<p class="small muted" style="margin:-4px 0 12px">Barcha ma’lumot (talabalar, jamoalar, vazifalar, baholar) bitta JSON faylda saqlanadi. Har hafta zaxira olish tavsiya etiladi.</p>' +
    '<div class="col" style="gap:9px">' +
    '<button class="btn btn-primary btn-block" data-act="export-json">' + ico('download', 'sm') + 'Zaxira nusxa yuklab olish (JSON)</button>' +
    '<button class="btn btn-soft btn-block" data-act="export">' + ico('doc', 'sm') + 'Statistika hisoboti (CSV, Excel uchun)</button>' +
    '<div class="field"><label>Zaxiradan tiklash (.json)</label><input class="inp" type="file" id="import-json" accept="application/json,.json"></div>' +
    '<div class="divider"></div>' +
    '<button class="btn btn-danger btn-block" data-act="reset-confirm">' + ico('refresh', 'sm') + 'Demo ma’lumotlarga qaytarish</button>' +
    '</div></div>' +

    /* mentorlar */
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('user') + 'Mentorlar</h2>' +
    '<button class="btn btn-xs btn-soft" data-act="new-mentor">' + ico('plus', 'sm') + 'Mentor</button></div>' +
    '<div class="col" style="gap:9px">' + S.mentors.map(m => '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' +
      avatar({ name: m.name, act: true, last: 0 }, 'sm') +
      '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(m.name) + '</div>' +
      '<div class="xs muted">' + esc(m.role) + ' • ' + esc(m.tg) + ' • ' + S.groups.filter(g => g.mentor === m.id).length + ' jamoa</div></div></div>' +
      '<button class="btn btn-xs btn-soft" data-act="msg" data-id="' + m.id + '">' + ico('chat', 'sm') + '</button>' +
      '<button class="btn btn-xs btn-ghost" data-act="del-mentor" data-id="' + m.id + '">' + ico('trash', 'sm') + '</button></div>').join('') + '</div></div></div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('star') + 'Galereya</h2>' +
    '<button class="btn btn-xs btn-soft" data-act="new-gallery">' + ico('plus', 'sm') + 'Loyiha</button></div>' +
    '<p class="small muted" style="margin:-4px 0 12px">Talaba Bosh sahifasida ko‘rinadi — eng yaxshi ishlarni shu yerga chiqaring.</p>' +
    '<div class="col" style="gap:9px">' + S.gallery.map(it => '<div class="lrow"><div class="lead">' + ico('rocket', 'sm') + '</div>' +
      '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(it.t) + '</div>' +
      '<div class="xs muted ellip">' + esc(it.kind) + ' • ' + esc(it.desc) + '</div></div>' +
      '<button class="btn btn-xs btn-ghost" data-act="del-gallery" data-id="' + it.id + '">' + ico('trash', 'sm') + '</button></div>').join('') + '</div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'Platforma haqida</h2></div>' +
    '<div class="col" style="gap:10px">' +
    '<div class="row between small"><span class="muted">Versiya</span><b>v' + APP_VERSION + '</b></div>' +
    '<div class="row between small"><span class="muted">Ma’lumot manbai</span><b>Brauzer xotirasi (demo)</b></div>' +
    '<div class="row between small"><span class="muted">Hosting</span><b>Cloudflare Pages</b></div>' +
    '<div class="row between small"><span class="muted">Kod</span><b>github.com/Asilbek-ops-afk/ai-leaders-platform</b></div>' +
    '<div class="divider"></div>' +
    '<div class="card tight soft"><div class="up muted" style="margin-bottom:6px">Keyingi qadam</div>' +
    '<div class="xs t2">Real bazaga o‘tish uchun Supabase jadvallari tayyor: <b>schema/supabase.sql</b>. Ulash faqat <b>loadState()</b> va <b>save()</b> funksiyalarini almashtirishni talab qiladi.</div></div>' +
    '<div class="card tight soft"><div class="up muted" style="margin-bottom:6px">Bildirishnomalar</div>' +
    '<div class="xs t2">Telegram-bot orqali deadline eslatmalarini ulash mumkin (kuniga 21:00 standup xabari).</div></div>' +
    '</div></div></div>';
  return h;
}
