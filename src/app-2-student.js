/* ==========================================================================
   TALABA bo'limlari
   ========================================================================== */

/* ---------- Bosh sahifa ---------- */
function vHome() {
  const st = me(), g = myGroup(st), p = progress(st), nl = nextLesson(st), nt = nextTask(st);
  const q = ensureQuests(st);
  const dls = deadlinesOf(st).filter(d => !d.s || d.s.status === 'revise' || d.s.status === 'in_review').sort((a, b) => a.due < b.due ? -1 : 1);
  const near = dls[0];
  const m = medal(st);
  const week = weeklyData();
  const maxv = Math.max(1, ...week.map(w => w.v));
  const questXp = QUESTS.reduce((a, x) => a + (q.done.includes(x.id) ? x.xp : 0), 0);
  const lateCount = dls.filter(d => !d.s && d.tl.late).length;

  /* hero */
  let h = '<section class="hero"><div class="hero-grid">' +
    '<div class="col" style="gap:14px">' +
    '<div class="row wrap" style="gap:8px"><span class="tag p">' + ico(m.i, 'sm') + esc(m.n) + '</span>' +
    (g ? '<span class="tag c">' + ico('users', 'sm') + esc(g.name) + ' jamoasi</span>' : '') + streakPill(st) +
    '<span class="tag a">' + ico('coin', 'sm') + nf(st.coins) + ' coin</span></div>' +
    '<div><h1 class="h1">' + wallClock() + ', ' + esc(st.name.split(' ')[0]) + '! <span class="wave">' + ico('hand', 'sm') + '</span></h1>' +
    '<p class="t2 hero-sub">' + (nl ? 'Keyingi dars — “' + esc(nl.t) + '” · ' + nl.dur + ' daqiqa' : 'Barcha darslar tugatilgan — loyihaga e’tibor') +
    ' · reytingda <b>' + wxpRank(st.id) + '-o‘rin</b></p></div>' +
    '<div class="row wrap" style="gap:10px">' +
    (nl ? '<button class="btn btn-primary" data-act="lesson-open" data-id="' + nl.id + '">' + ico('play', 'sm') + 'Darsda davom etish</button>' : '') +
    (nt ? '<button class="btn btn-soft" data-act="submit-open" data-id="' + nt.id + '">' + ico('upload', 'sm') + 'Vazifa topshirish</button>' : '') +
    '<button class="btn btn-ghost" data-act="go" data-route="team">' + ico('users', 'sm') + 'Jamoa</button></div>' +
    '<div class="row wrap" style="gap:9px;margin-top:2px">' +
    '<span class="hero-stat">' + ico('check-c', 'sm') + '<b>' + p.done + '/' + p.total + '</b> dars</span>' +
    '<span class="hero-stat">' + ico('task', 'sm') + '<b>' + acceptedOf(st) + '</b> vazifa</span>' +
    '<span class="hero-stat">' + ico('trophy', 'sm') + '<b>' + nf(st.xp) + '</b> XP</span>' +
    '<span class="hero-stat">' + ico('bolt', 'sm') + '<b>' + nf(st.wxp) + '</b> haftalik XP</span></div>' +
    '</div>' +
    '<div class="card glass" style="align-self:stretch;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;text-align:center">' +
    ring(p.pct, 118, 'kurs') +
    '<div><div class="h3">Kurs progressi</div><div class="small muted">' + (nl ? 'keyingi darsga qadar' : 'kurs tugatilgan') + '</div></div>' +
    bar(p.pct) +
    '<div class="row" style="gap:8px;width:100%"><div class="card tight soft grow tc"><div class="big">' + st.streak + '</div><div class="xs muted">kun streak</div></div>' +
    '<div class="card tight soft grow tc"><div class="big">' + wxpRank(st.id) + '</div><div class="xs muted">haftalik o‘rin</div></div></div>' +
    '</div></div></section>';

  /* Yangi talaba uchun boshlash yo'riqnomasi */
  const steps = [
    { d: !!p.done, t: 'Birinchi darsni tugatish', s: 'Darslar bo‘limidan 1-modulni oching', a: 'lesson-open', id: (S.lessons[0] || {}).id },
    { d: !!st.tg && !!st.goal, t: 'Profilni to‘ldirish', s: 'Maqsad va aloqa ma’lumotlarini yozing', a: 'edit-profile', id: '' },
    { d: !!g, t: 'Jamoaga qo‘shilish', s: 'Jamoada 3 kishi bilan startap mashqi', a: 'go', id: '' },
    { d: acceptedOf(st) > 0, t: 'Birinchi vazifani topshirish', s: 'Havola yuboring va mentor izohini oling', a: 'submit-open', id: (nt || {}).id },
    { d: acceptedOf(st) >= 3, t: '3 ta vazifani yakunlash', s: 'Klubda faollik darajangizni oshiring', a: 'go', id: '' , route: 'tasks' }
  ];
  const doneSteps = steps.filter(x => x.d).length;

  /* KPI */
  h += '<div class="grid g4">' +
    kpi('trend', p.pct + '%', 'O‘quv progressi', '+' + p.done + ' dars', '') +
    kpi('bolt', nf(st.xp), 'Umumiy XP', '+' + nf(st.wxp) + ' bu hafta', 'c') +
    kpi('coin', nf(st.coins), 'Coin balansi', 'Do‘konga yaroqli', 'a') +
    kpi('clock', near ? (near.tl.late ? '!' + near.tl.d + ' kun' : near.tl.txt) : '—', 'Eng yaqin deadline', near ? near.t.title.slice(0, 26) : '', near && near.tl.late ? 'r' : '') +
    '</div>';

  /* Boshlash checklisti (hammasi bajarilgach yashiriladi) */
  /* Qadamlar siqilgan qatorlarda: bajarilganlari belgi bo'lib qoladi, joriysi ajralib turadi */
  if (doneSteps < steps.length) h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'Boshlash yo‘riqnomasi</h2>' +
    '<span class="tag ' + (doneSteps === steps.length ? 'g' : 'p') + '">' + doneSteps + '/' + steps.length + '</span></div>' +
    '<div class="qstrip">' + steps.map((x, i) => '<div class="qstep' + (x.d ? ' done' : ' now') + '">' +
      '<span class="qnum">' + (x.d ? ico('check', 'sm') : i + 1) + '</span>' +
      '<span class="qtxt"><b>' + esc(x.t) + '</b><em>' + esc(x.s) + '</em></span>' +
      (x.d ? '<span class="qok">' + ico('check-c', 'sm') + '</span>'
        : '<button class="btn btn-xs btn-primary" data-act="' + (x.route ? 'go' : x.a) + '" ' +
          (x.route ? 'data-route="' + x.route + '"' : (x.id ? 'data-id="' + x.id + '"' : '')) + '>' + ico('right', 'sm') + 'Boshlash</button>') +
      '</div>').join('') + '</div></div>';

  /* ===== Noutbuk uchun: asosiy ustun + yon ustun ===== */
  h += '<div class="wide-split"><div class="wide-main">';

  /* Bugungi reja + deadline */
  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('target') + 'Bugungi reja</h2>' +
    '<span class="tag a">+' + questXp + ' XP</span></div>' +
    '<p class="small muted" style="margin:-4px 0 10px">Har kuni 3 ta kichik qadam — streak uzilmaydi.</p>' +
    '<div class="col" style="gap:9px">' + QUESTS.map(x => {
      const done = q.done.includes(x.id);
      return '<button class="lrow press ' + (done ? 'done' : '') + '" data-act="quest" data-id="' + x.id + '" style="text-align:left;width:100%">' +
        '<div class="lead" style="' + (done ? 'background:rgba(56,225,160,.16);border-color:rgba(56,225,160,.34);color:var(--ok-tone)' : '') + '">' + ico(done ? 'check' : x.i) + '</div>' +
        '<div class="grow"><div class="small" style="font-weight:750">' + esc(x.t) + '</div><div class="xs muted">' + esc(x.s) + '</div></div>' +
        '<span class="tag ' + (done ? 'g' : '') + '">+' + x.xp + ' XP</span></button>';
    }).join('') + '</div>' +
    '<div class="divider"></div>' +
    '<div class="row small t2" style="gap:7px">' + ico('flame', 'sm') + 'Streak: <b>' + st.streak + ' kun</b> • eng uzoq: 21 kun</div></div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('clock') + 'Yaqin deadline’lar</h2>' +
    '<button class="btn btn-xs btn-ghost" data-act="go" data-route="deadlines">Kalendar' + ico('right', 'sm') + '</button></div>' +
    '<div class="col" style="gap:9px">' + (dls.length ? dls.slice(0, 4).map(d => '<button class="lrow press ' + (d.tl.late ? 'hot' : '') + '" data-act="task-open" data-id="' + d.t.id + '" style="width:100%;text-align:left">' +
      '<div class="lead">' + ico(modOf(d.t.m).icon) + '</div>' +
      '<div class="grow"><div class="small ellip" style="font-weight:750">' + esc(d.t.title) + '</div><div class="xs muted">' + modOf(d.t.m).n + '-modul • ' + fmtFull(d.due) + '</div></div>' +
      tlPill(d.tl) + '</button>').join('') : '<div class="empty">Faol deadline yo‘q</div>') + '</div>' +
    (near && near.tl.late ? '<div class="card tight" style="margin-top:10px;border-color:rgba(255,92,122,.34);background:rgba(255,92,122,.07)"><div class="row small" style="gap:8px;color:var(--danger-tone)">' + ico('alert', 'sm') + 'Mentorga kechikish sababini yozib qo‘ying — bu streak va bahoga ijobiy ta’sir qiladi.</div></div>' : '') +
    '</div></div>';

  /* Yo'l xaritasi */
  const unlocked = unlockedCount(st);
  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'O‘quv yo‘l xaritasi</h2>' +
    '<span class="small muted">' + unlocked + '/6 modul ochilgan</span></div>' +
    '<div class="grid g3 mod-grid">' + S.modules.map(mm => {
      const mp = modulePct(st, mm.id), lock = mm.n > unlocked, done = mp.pct === 100;
      return '<button class="mod ' + (lock ? 'locked' : '') + '" data-act="module-open" data-id="' + mm.id + '" style="text-align:left;cursor:' + (lock ? 'not-allowed' : 'pointer') + '">' +
        '<span class="mnum">' + mm.n + '</span>' +
        '<div class="micon">' + ico(lock ? 'lock' : mm.icon) + '</div>' +
        '<div class="h3">' + esc(mm.title) + '</div>' +
        '<div class="xs muted" style="margin:5px 0 10px;min-height:32px">' + esc(mm.desc) + '</div>' +
        bar(mp.pct, done ? 'accent' : '') +
        '<div class="row between" style="margin-top:9px"><span class="xs muted">' + mp.done + '/' + mp.total + ' dars</span>' +
        (done ? '<span class="tag g">' + ico('check', 'sm') + 'Tugatilgan</span>' : lock ? '<span class="tag">' + ico('lock', 'sm') + 'Yopiq</span>' : '<span class="tag p">' + ico('play', 'sm') + 'Davom etish</span>') + '</div></button>';
    }).join('') + '</div></div>';

  /* ===== Yon ustun: jamoa, tezkor amallar, faollik (noutbukda o'ngda, telefonda pastda) ===== */
    /* Galereya */
  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('star') + 'Galereya — eng yaxshi ishlar</h2>' +
    '<span class="small muted">Har hafta yangilanadi</span></div>' +
    '<div class="grid g4 gal-grid">' + S.gallery.map(it => '<div class="gal" data-act="gallery" data-id="' + it.id + '" tabindex="0" role="button" aria-label="' + esc(it.t) + '">' +
      '<div class="thumb ' + it.k + '"><div class="mock"><i class="w1"></i><i class="w2"></i><i class="w3"></i></div>' +
      '<span class="tag a" style="position:absolute;top:9px;left:9px">' + ico('heart', 'sm') + 'Top' + '</span></div>' +
      '<div style="padding:11px"><div class="small" style="font-weight:750">' + esc(it.t) + '</div><div class="xs muted">' + esc(it.kind) + '</div></div></div>').join('') + '</div></div>';
  h += '</div><aside class="wide-rail">';

  h += '<div class="card rail-card"><div class="card-h"><h2 class="h2">' + ico('users') + 'Mening jamoam</h2>' + (g ? '<span class="tag p">#' + teamRank(g.id) + ' reyting</span>' : '') + '</div>' +
    (g ? '<div class="row" style="gap:12px">' + crest(g, 56) + '<div class="grow" style="min-width:0"><div class="h3">' + esc(g.name) + '</div><div class="small muted ellip">' + esc(g.project) + '</div>' +
      '<div class="row" style="gap:6px;margin-top:8px"><div class="av-stack">' + g.members.slice(0, 3).map(id => avatar(get(S.students, id), 'xs')).join('') + '</div>' +
      '<span class="xs muted">' + g.members.length + ' a\u2019zo \u2022 ' + nf(g.xp) + ' XP</span></div></div></div>' +
      '<div class="divider"></div>' +
      '<div class="col" style="gap:8px">' + (S.walls[g.id] || []).slice(0, 2).map(w => '<div class="wall-item" style="padding:8px 0"><div><div class="small"><b>' + esc(get(S.students, w.who).name.split(' ')[0]) + ':</b> ' + esc(w.text) + '</div><div class="xs muted" style="margin-top:3px">' + esc(w.at) + '</div></div></div>').join('') + '</div>' +
      '<button class="btn btn-soft btn-sm btn-block" style="margin-top:6px" data-act="go" data-route="team">' + ico('chat', 'sm') + 'Jamoa devoriga o\u2019tish</button>'
      : '<div class="empty">Sizga hali jamoa biriktirilmagan. Admin tez orada biriktiradi.</div>') + '</div>';

  h += '<div class="card rail-card"><div class="card-h"><h2 class="h2">' + ico('bolt') + 'Tezkor amallar</h2>' +
    '<span class="kbd hide-sm">Ctrl K</span></div>' +
    '<div class="col" style="gap:8px">' +
    (nl ? '<button class="btn btn-primary btn-sm btn-block" data-act="lesson-open" data-id="' + nl.id + '">' + ico('play', 'sm') + 'Darsda davom etish</button>' : '') +
    (nt ? '<button class="btn btn-soft btn-sm btn-block" data-act="submit-open" data-id="' + nt.id + '">' + ico('upload', 'sm') + 'Vazifa topshirish</button>' : '') +
    '<button class="btn btn-ghost btn-sm btn-block" data-act="go" data-route="deadlines">' + ico('cal', 'sm') + 'Deadline kalendari</button>' +
    '<button class="btn btn-ghost btn-sm btn-block" data-act="go" data-route="friends">' + ico('users-plus', 'sm') + 'Do\u2019st qo\u2019shish</button>' +
    '<button class="btn btn-ghost btn-sm btn-block" data-act="shortcuts">' + ico('help', 'sm') + 'Klaviatura yorliqlari</button>' +
    '</div></div>';

  if (lateCount) h += '<div class="card rail-card" style="border-color:rgba(255,92,122,.34);background:linear-gradient(120deg,rgba(255,92,122,.08),transparent 70%)">' +
    '<div class="row" style="gap:11px;align-items:flex-start">' + ico('alert') +
    '<div><div class="small" style="font-weight:750">' + lateCount + ' ta topshiriq kechikdi</div>' +
    '<div class="xs muted" style="margin-top:4px">Mentorga sababini yozing \u2014 deadline\u2019ni individual surish mumkin.</div>' +
    '<button class="btn btn-xs btn-soft" style="margin-top:9px" data-act="go" data-route="tasks">Topshiriqlarni ko\u2019rish</button></div></div></div>';

  h += '<div class="card rail-card"><div class="card-h"><h2 class="h2">' + ico('trend') + 'Haftalik faollik</h2><span class="tag c">' + st.wxp + ' XP</span></div>' +
    '<div class="chart">' + week.map((w, i) => { const v = Math.max(6, Math.round(w.v / maxv * 100)); return '<div class="b' + (i === week.length - 2 ? ' hi' : '') + '"><div class="fill" style="height:' + v + '%;animation-delay:' + (i * 55) + 'ms"></div><span>' + w.l + '</span></div>'; }).join('') + '</div>' +
    '<div class="divider"></div>' +
    '<div class="row between wrap" style="gap:10px"><div class="row small t2" style="gap:8px">' + ico('flame', 'sm') + 'Oxirgi 7 kun:</div>' +
    '<div class="row" style="gap:5px">' + Array.from({ length: 7 }).map((_, i) => { const on = (6 - i) < st.streak; return '<span title="' + (on ? 'bajarilgan' : 'bo\u2019sh') + '" style="width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:' + (on ? 'linear-gradient(135deg,var(--brand),var(--brand-2))' : 'var(--panel-3)') + ';color:' + (on ? 'var(--on-brand)' : 'var(--muted)') + ';font-size:10px;font-weight:800">' + (on ? '\u2713' : '') + '</span>'; }).join('') + '</div></div></div>';

  h += '<div class="card rail-card"><div class="card-h"><h2 class="h2">' + ico('spark') + 'Klubda nima bo\u2019lyapti</h2></div>' +
    '<div class="col" style="gap:0">' + (S.activity.length ? S.activity.slice(0, 4).map(a => '<div class="wall-item" style="padding:9px 0">' +
      '<div class="lead" style="width:32px;height:32px;border-radius:10px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:var(--panel-3);border:1px solid var(--line);color:var(--txt2)">' + ico('spark', 'sm') + '</div>' +
      '<div><div class="small"><b>' + esc(a.who) + '</b> ' + esc(a.what) + '</div><div class="xs muted" style="margin-top:2px">' + esc(a.at) + '</div></div></div>').join('') : '<div class="small muted" style="padding:10px 0">Hozircha yangilik yo‘q — birinchi topshiriqdan keyin shu yerda ko‘rinadi.</div>') + '</div></div>';

  h += '</aside></div>';

  return h;
}

/* ---------- Darslar ---------- */
function vLessons() {
  if (UI.module) return vModule(UI.module);
  const st = me(), p = progress(st), nl = nextLesson(st), unlocked = unlockedCount(st);
  const lessonsDone = st.done.length;
  let h = '<div class="page-head"><div><h1 class="h1">Darslar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + S.modules.length + '</b> modul · <b>' + unlocked + '</b> ochilgan · ' +
    lessonsDone + '/' + S.lessons.length + ' dars tugatilgan</p></div>' +
    '<div class="row" style="gap:10px">' + ring(p.pct, 74) + '</div></div>';

  if (nl) {
    const mm = modOf(nl.m);
    h += '<div class="card glass"><div class="row wrap between" style="gap:14px">' +
      '<div class="row" style="gap:14px;min-width:260px"><div class="lead" style="width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:var(--grad);color:var(--on-brand)">' + ico('play', 'lg') + '</div>' +
      '<div><div class="up muted">' + mm.n + '-modul • ' + (TYPES[nl.type] || TYPES.video).l + ' • ' + nl.dur + ' daq</div>' +
      '<div class="h2" style="margin-top:4px">' + esc(nl.t) + '</div><div class="small muted" style="margin-top:3px">Kurs progressi ' + p.pct + '% — bugun bitta dars yetarli.</div></div></div>' +
      '<button class="btn btn-primary" data-act="lesson-open" data-id="' + nl.id + '">' + ico('play', 'sm') + 'Davom etish</button></div></div>';
  }

  h += '<div class="grid g2 mod-grid">' + S.modules.map(mm => {
    const mp = modulePct(st, mm.id), lock = mm.n > unlocked, done = mp.pct === 100;
    const t = S.tasks.find(x => x.m === mm.id);
    const sub = t ? subOf(st, t.id) : null;
    const ls = lessonsOfModule(mm.id);
    const durSum = ls.reduce((a, l) => a + l.dur, 0);
    return '<div class="card mod ' + (lock ? 'locked' : '') + '">' +
      '<span class="mnum">' + mm.n + '-modul</span>' +
      '<div class="row between" style="align-items:flex-start">' +
      '<div class="micon">' + ico(lock ? 'lock' : mm.icon) + '</div>' +
      (done ? '<span class="tag g">' + ico('check-c', 'sm') + 'Tugatilgan</span>' : lock ? '<span class="tag">' + ico('lock', 'sm') + 'Yopiq</span>' : '<span class="tag p">' + ico('bolt', 'sm') + 'Jarayonda</span>') + '</div>' +
      '<div class="h2">' + esc(mm.title) + '</div>' +
      '<p class="small muted clamp2" style="margin:6px 0 12px">' + esc(mm.desc) + '</p>' +
      bar(mp.pct, done ? 'accent' : '') +
      '<div class="row between" style="margin-top:8px"><span class="xs muted">' + mp.done + '/' + mp.total + ' dars • ' + durSum + ' daqiqa</span><span class="xs" style="font-weight:800">' + mp.pct + '%</span></div>' +
      (t ? '<div class="divider"></div><div class="row between" style="gap:10px"><div style="min-width:0"><div class="small clamp2" style="font-weight:700">' + esc(t.title) + '</div><div class="xs muted">Deadline: ' + fmtFull(dueOf(st, t)) + '</div></div>' +
        '<button class="btn btn-xs ' + (lock ? 'btn-ghost' : 'btn-soft') + '" data-act="' + (sub && sub.status === 'accepted' ? 'task-open' : 'submit-open') + '" data-id="' + t.id + '">' + (sub && sub.status === 'accepted' ? 'Ko‘rish' : 'Topshirish') + '</button></div>' : '') +
      '<button class="btn ' + (lock ? 'btn-ghost' : 'btn-primary') + ' btn-sm btn-block" style="margin-top:12px" data-act="module-open" data-id="' + mm.id + '">' +
      (lock ? ico('lock', 'sm') + 'Avvalgi modulni tugating' : done ? ico('eye', 'sm') + 'Takrorlash' : ico('book', 'sm') + 'Modulni ochish') + '</button></div>';
  }).join('') + '</div>';
  return h;
}

/* ---------- Modul sahifasi ---------- */
function vModule(mid) {
  const st = me(), mm = modOf(mid), ls = lessonsOfModule(mid), mp = modulePct(st, mid);
  const unlocked = unlockedCount(st), lock = mm.n > unlocked;
  const t = S.tasks.find(x => x.m === mid), sub = t ? subOf(st, t.id) : null;
  const doneAll = mp.pct === 100;
  let h = '<div class="row wrap between" style="gap:12px">' +
    '<div class="row" style="gap:12px"><button class="btn-icon" data-act="module-back">' + ico('left', 'sm') + '</button>' +
    '<div><div class="up muted">' + mm.n + '-modul • ' + ls.length + ' dars</div><h1 class="h1" style="margin-top:4px">' + esc(mm.title) + '</h1></div></div>' +
    '<div class="row" style="gap:10px">' + (doneAll ? '<span class="tag g">' + ico('check-c', 'sm') + 'Modul tugatilgan</span>' : '<span class="tag p">' + mp.pct + '% bajarildi</span>') +
    '<span class="tag c">' + ico('clock', 'sm') + ls.reduce((a, l) => a + l.dur, 0) + ' daqiqa</span></div></div>';

  if (lock) h += '<div class="card" style="border-color:rgba(255,180,58,.34)"><div class="row">' + ico('lock') + '<div>Bu modul hali yopiq. Avvalgi modulning vazifasi qabul qilinishi kerak.</div></div></div>';

  h += '<div class="grid split-16">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('book') + 'Darslar ro‘yxati</h2>' +
    '<span class="small muted">' + mp.done + '/' + mp.total + '</span></div>' + bar(mp.pct) +
    '<div class="col" style="gap:4px;margin-top:12px">' + ls.map((l, i) => {
      const done = st.done.includes(l.id), ty = TYPES[l.type] || TYPES.video;
      return '<div class="lesson-row' + (done ? ' done' : '') + (lock ? '' : ' ') + '" data-act="' + (lock ? 'locked' : 'lesson-open') + '" data-id="' + l.id + '">' +
        '<div class="num">' + (done ? ico('check', 'sm') : (i + 1)) + '</div>' +
        '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:700">' + esc(l.t) + '</div>' +
        '<div class="row xs muted" style="gap:8px;margin-top:3px"><span class="tag ' + ty.tag + '">' + ico(ty.i, 'sm') + esc(ty.l) + '</span><span>' + l.dur + ' daq</span><span>•</span><span>' + fmtD(l.d) + '</span></div></div>' +
        (done ? '<span class="tag g">' + ico('check', 'sm') + 'Bajarilgan</span>' : '<span class="tag ' + (lock ? '' : 'p') + '">' + (lock ? ico('lock', 'sm') : ico('play', 'sm')) + (lock ? 'Yopiq' : 'Ochish') + '</span>') +
        '</div>';
    }).join('') + '</div></div>' +

    '<div class="col" style="gap:14px">' +
    (t ? '<div class="card glass"><div class="up muted">Modul topshirig‘i</div>' +
      '<div class="h3" style="margin-top:6px">' + esc(t.title) + '</div>' +
      '<p class="small t2" style="margin:8px 0 10px">' + esc(t.brief) + '</p>' +
      '<div class="row wrap" style="gap:8px;margin-bottom:12px">' + tlPill(timeLeft(dueOf(st, t))) + (sub ? stChip(sub.status) : stChip('none')) + '</div>' +
      (sub && sub.score != null ? '<div class="row between small" style="margin-bottom:10px"><span class="muted">Baho</span><b>' + sub.score + '/100</b></div>' : '') +
      '<button class="btn ' + (sub && sub.status === 'accepted' ? 'btn-soft' : 'btn-primary') + ' btn-block" data-act="' + (sub && sub.status === 'accepted' ? 'task-open' : 'submit-open') + '" data-id="' + t.id + '">' +
      ico(sub && sub.status === 'accepted' ? 'eye' : 'upload', 'sm') + (sub && sub.status === 'accepted' ? 'Topshiriqni ko‘rish' : 'Vazifani topshirish') + '</button></div>' : '') +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('target') + 'Dars natijalari</h2></div>' +
    '<div class="col" style="gap:9px">' + ['Modul materiallarini tushunish', 'Amaliy topshiriqni bajarish', 'Natijani mentor bilan tekshirish', 'Jamoada qo‘llash']
      .map(x => '<div class="row small t2" style="gap:8px">' + ico('check-c', 'sm') + esc(x) + '</div>').join('') + '</div>' +
    '<div class="divider"></div><div class="row small t2" style="gap:8px">' + ico('clock', 'sm') + 'Deadline: <b>' + (t ? fmtFull(dueOf(st, t)) : '—') + '</b></div></div>' +
    '</div></div>';
  return h;
}

/* ---------- Vazifa ---------- */
function vTasks() {
  const st = me();
  const all = deadlinesOf(st);
  const f = UI.taskFilter;
  const list = all.filter(d => f === 'all' ? true : f === 'todo' ? (!d.s || d.s.status === 'revise') : d.s && d.s.status === f);
  const cnt = k => all.filter(d => k === 'all' ? true : k === 'todo' ? (!d.s || d.s.status === 'revise') : d.s && d.s.status === k).length;
  const accepted = all.filter(d => d.s && d.s.status === 'accepted');
  const avg = accepted.length ? Math.round(accepted.reduce((a, d) => a + (d.s.score || 0), 0) / accepted.length) : 0;
  if (!all.length) return '<div class="page-head"><div><h1 class="h1">Vazifalar</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Topshiriq → tekshirish → baho zanjiri. Mentorlar izoh yozadi.</p></div></div>' +
    emptyCard('task', 'Hozircha vazifa yo‘q', 'Administrator vazifa bergan zahoti u shu bo‘limda deadline bilan ko‘rinadi. Hozir darslardan boshlash mumkin.');

  let h = '<div class="page-head"><div><h1 class="h1">Vazifa</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + all.length + '</b> vazifa · <b>' + all.filter(d => d.s && d.s.status === 'accepted').length + '</b> qabul qilingan · <b>' +
      all.filter(d => d.s && (d.s.status === 'in_review' || d.s.status === 'revise')).length + '</b> jarayonda</p></div>' +
    '<button class="btn btn-primary" ' + (nextTask(st) ? 'data-act="submit-open" data-id="' + nextTask(st).id + '"' : 'disabled') + '>' + ico('upload', 'sm') + 'Yangi topshiriq</button></div>';

  h += '<div class="grid g4">' +
    kpi('task', all.length, 'Jami vazifa', '6 modul uchun', '') +
    kpi('check-c', accepted.length, 'Qabul qilingan', '+' + accepted.length + ' modul ochilgan', 'a') +
    kpi('clock', all.filter(d => d.s && (d.s.status === 'in_review' || d.s.status === 'revise')).length, 'Jarayonda', 'Tekshirilmoqda / qayta ishlash', 'c') +
    kpi('star', avg ? avg + '/100' : '—', 'O‘rtacha baho', 'Mentor baholari', '') + '</div>';

  h += '<div class="row wrap between" style="gap:10px"><div class="seg">' +
    [['all', 'Barchasi', cnt('all')], ['todo', 'Topshirish kerak', cnt('todo')], ['in_review', 'Tekshirilmoqda', cnt('in_review')], ['accepted', 'Qabul qilindi', cnt('accepted')], ['revise', 'Qayta ishlash', cnt('revise')], ['late', 'Kechikkan', cnt('late')]]
      .map(([k, l, c]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="filter" data-f="' + k + '">' + l + ' (' + c + ')</button>').join('') + '</div></div>';

  h += '<div class="col task-grid" style="gap:12px">' + (list.length ? list.map(d => {
    const t = d.t, mm = modOf(t.m), s = d.s;
    const stt = s ? s.status : 'none';
    return '<div class="card"><div class="row between wrap" style="gap:14px;align-items:flex-start">' +
      '<div class="grow" style="min-width:250px">' +
      '<div class="row wrap" style="gap:8px;margin-bottom:8px"><span class="tag p">' + ico(mm.icon, 'sm') + mm.n + '-modul</span>' + stChip(stt) +
      (s && s.score != null ? '<span class="tag a">' + ico('star', 'sm') + s.score + '/100</span>' : '') +
      /* muddat holati: qabul qilingan ishlar uchun "o‘tib ketdi" ko‘rsatilmaydi */
      (stt === 'accepted'
        ? (new Date(s.at) <= new Date(d.due + 'T23:59:59')
            ? '<span class="tag g">' + ico('check', 'sm') + 'Muddatida topshirilgan</span>'
            : '<span class="tag o">' + ico('clock', 'sm') + 'Kechikib topshirilgan</span>')
        : tlPill(d.tl)) + '</div>' +
      '<div class="h2">' + esc(t.title) + '</div>' +
      '<p class="small muted" style="margin:6px 0 10px;max-width:70ch">' + esc(t.brief) + '</p>' +
      (s && s.file ? '<div class="row xs muted wrap" style="gap:8px;margin-bottom:8px">' + ico('upload', 'sm') + 'Fayl: <b>' + esc(s.file) + '</b>' +
        (s.fileData ? '<button class="btn btn-xs btn-ghost" data-act="open-file" data-sub="' + s.id + '">' + ico('download', 'sm') + 'Yuklab olish</button>' : '') + '</div>' : '') +
      (s && s.fb ? '<div class="card soft tight" style="border-color:rgba(124,92,255,.3)"><div class="xs up muted" style="margin-bottom:5px">Mentor izohi' + (s.rev ? ' • ' + esc(s.rev) : '') + '</div><div class="small t2">' + esc(s.fb) + '</div></div>' : '') +
      (s ? '<div class="row xs muted" style="gap:8px;margin-top:10px">' + ico('clock', 'sm') + fmtFull(s.at) + ' topshirildi</div>' : '') +
      '</div>' +
      '<div class="col" style="gap:8px;min-width:190px">' +
      '<div class="card tight soft"><div class="xs muted">Mening deadline’im</div><div class="small" style="font-weight:750">' + fmtFull(d.due) + '</div>' +
      (dueOf(st, t) !== t.dl ? '<div class="xs hl" style="margin-top:2px">Jamoa uchun alohida belgilangan</div>' : '') + '</div>' +
      (stt === 'accepted' || stt === 'in_review' || stt === 'late' ? '<button class="btn btn-soft" data-act="task-open" data-id="' + t.id + '">' + ico('eye', 'sm') + 'Topshiriqni ko‘rish</button>' : '') +
      (stt === 'none' || stt === 'revise' ? '<button class="btn btn-primary" data-act="submit-open" data-id="' + t.id + '">' + ico('upload', 'sm') + (stt === 'revise' ? 'Qayta yuborish' : 'Topshirish') + '</button>' : '') +
      (mm.n > 1 ? '<button class="btn btn-ghost btn-sm" data-act="module-open" data-id="' + mm.id + '">' + ico('book', 'sm') + 'Modul darslari</button>' : '') +
      '</div></div></div>';
  }).join('') : '<div class="empty">Bu filtrda vazifa yo‘q.</div>') + '</div>';
  return h;
}

/* ---------- Team ---------- */
function vTeam() {
  const st = me(), g = myGroup(st);
  if (!g) return '<div class="page-head"><div><h1 class="h1">Team</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Jamoa — startap mashqi: devor, vazifalar va umumiy reyting.</p></div></div>' +
    emptyCard('users', 'Sizga hali jamoa biriktirilmagan', 'Administrator jamoani tuzgach shu yerda devor, a’zolar va jamoaviy topshiriq ko‘rinadi.');
  const m = mentorOf(g.mentor);
  const walls = S.walls[g.id] || [];
  const task = projTasks()[0] || (S.tasks.length ? S.tasks[S.tasks.length - 1] : null);
  const teamScore = Math.round(g.members.reduce((a, id) => a + get(S.students, id).wxp, 0) / Math.max(1, g.members.length));
  const roles = ['Founder', 'Builder', 'Designer', 'Growth'];

  let h = '<div class="page-head"><div><h1 class="h1">Team</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + esc(g.name) + '</b> · <b>' + g.members.length + '</b> a’zo · <b>' + nf(g.xp) + '</b> XP' + (m ? ' · mentor: <b>' + esc(m.name) + '</b>' : '') + '</p></div>' +
    '<span class="tag p">' + ico('trophy', 'sm') + 'Jamoalar reytingi: #' + teamRank(g.id) + '/6</span></div>';

  h += '<div class="card glass"><div class="row wrap between" style="gap:16px">' +
    '<div class="row" style="gap:14px;min-width:280px">' + crest(g, 62) +
    '<div><div class="up muted">Jamoaviy loyiha</div><div class="h1" style="font-size:22px;margin:2px 0 4px">' + esc(g.name) + '</div>' +
    '<div class="small t2">' + esc(g.project) + '</div></div></div>' +
    '<div class="grid g3" style="gap:10px;min-width:280px;flex:1">' +
    '<div class="card tight soft tc"><div class="big">' + nf(g.xp) + '</div><div class="xs muted">jamoa XP</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + teamScore + '</div><div class="xs muted">haftalik XP / a’zo</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + (task ? timeLeft(g.dl[task.id] || task.dl).txt.split(' ')[0] : '—') + '</div><div class="xs muted">kun deadline’gacha</div></div>' +
    '</div></div>' +
    '<div class="divider"></div>' +
    '<div class="row wrap between" style="gap:10px"><div class="row small t2" style="gap:8px">' + ico('flag', 'sm') + (task ? 'Jamoaviy vazifa: <b>' + esc(task.title) + '</b>' : 'Jamoaviy vazifa hali berilmagan — administrator vazifa bergach shu yerda ko‘rinadi.') + '</div>' +
    '<span class="small muted">Mentor: ' + (m ? esc(m.name) : '—') + '</span></div></div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users') + 'A’zolar</h2><span class="small muted">' + g.members.length + ' kishi</span></div>' +
    '<div class="col" style="gap:9px">' + g.members.map((id, i) => { const s = get(S.students, id);
      return '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'sm') +
        '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + (s.id === st.id ? ' <span class="tag p">siz</span>' : '') + '</div>' +
        '<div class="xs muted">' + roles[i % roles.length] + ' • ' + nf(s.xp) + ' XP • ' + (onl(s) ? 'onlayn' : s.last + ' kun oldin') + '</div></div></div>' +
        '<button class="btn btn-xs btn-soft" data-act="msg" data-id="' + s.id + '">' + ico('chat', 'sm') + '</button></div>'; }).join('') + '</div>' +
    (m ? '<div class="divider"></div><div class="row" style="gap:11px">' + avatar({ name: m.name, act: true, last: 0 }, 'sm') +
      '<div class="grow"><div class="small" style="font-weight:750">' + esc(m.name) + '</div><div class="xs muted">' + esc(m.role) + ' • ' + ico('star', 'sm') + ' ' + m.rating + ' • ' + esc(m.tg) + '</div></div>' +
      '<button class="btn btn-xs btn-primary" data-act="msg" data-id="' + m.id + '">' + ico('help', 'sm') + 'Savol</button></div>' : '') + '</div>' +

    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('chat') + 'Jamoa devori</h2><span class="tag c">' + walls.length + ' yozuv</span></div>' +
    '<div class="col" style="gap:10px;max-height:330px;overflow:auto">' + (walls.length ? walls.map(w => { const a = get(S.students, w.who) || { name: 'Mentor' };
      return '<div class="wall-item"><div class="row" style="gap:10px;align-items:flex-start">' + avatar(a, 'xs') +
        '<div class="grow"><div class="small"><b>' + esc(a.name) + '</b></div><div class="small t2" style="margin-top:3px">' + esc(w.text) + '</div>' +
        '<div class="xs muted" style="margin-top:4px">' + esc(w.at) + '</div></div></div></div>'; }).join('') : '<div class="empty">Hali yozuv yo‘q — birinchi bo‘lib yozing!</div>') + '</div>' +
    '<div class="divider"></div>' +
    '<div class="field"><textarea class="inp" id="wall-input" placeholder="Bugun nima qildim, nimada yordam kerak…"></textarea></div>' +
    '<div class="row between" style="margin-top:9px"><span class="xs muted">Standup: har kuni 21:00</span>' +
    '<button class="btn btn-primary btn-sm" data-act="wall-post">' + ico('send', 'sm') + 'Yuborish</button></div></div></div>';

  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('target') + 'Jamoaviy loyiha holati</h2><span class="tag a">' + ico('bolt', 'sm') + 'Hafta 6</span></div>' +
    '<div class="grid g3">' + g.members.map(id => { const s = get(S.students, id); const p = task ? subOf(s, task.id) : null; const v = p ? STATUS[p.status] : STATUS.none;
      return '<div class="card tight soft"><div class="row" style="gap:9px">' + avatar(s, 'xs') + '<div class="small ellip grow" style="font-weight:700">' + esc(s.name.split(' ')[0]) + '</div></div>' +
      '<div class="row between" style="margin-top:9px"><span class="tag ' + (p && p.status === 'accepted' ? 'g' : '') + '">' + esc(v.l) + '</span>' +
      '<span class="xs muted">' + (p ? fmtD(p.at) : '—') + '</span></div></div>'; }).join('') + '</div>' +
    '<div class="divider"></div>' +
    '<div class="row wrap between" style="gap:10px"><div class="row small t2" style="gap:8px">' + ico('cal', 'sm') + (task ? 'Jamoaviy deadline: <b>' + fmtFull(g.dl[task.id] || task.dl) + '</b>' : 'Deadline vazifa bilan birga belgilanadi') + '</div>' +
    (task ? '<button class="btn btn-sm btn-soft" data-act="team-submit" data-id="' + task.id + '">' + ico('upload', 'sm') + 'Jamoaviy topshirish</button>' : '') + '</div></div>';
  return h;
}

/* ---------- Deadline ---------- */
function calData(offset) {
  const now = new Date();
  const y = now.getFullYear(), mo = now.getMonth() + offset;
  const first = new Date(y, mo, 1), last = new Date(y, mo + 1, 0);
  const startShift = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startShift; i++) cells.push({ out: true, d: new Date(y, mo, 1 - (startShift - i)) });
  for (let d = 1; d <= last.getDate(); d++) cells.push({ out: false, d: new Date(y, mo, d) });
  while (cells.length % 7) cells.push({ out: true, d: new Date(y, mo + 1, cells.length - startShift - last.getDate() + 1) });
  return { cells, label: UZ_M[((mo % 12) + 12) % 12] + ' ' + new Date(y, mo, 1).getFullYear(), offset };
}
function vDeadlines() {
  const st = me(), all = deadlinesOf(st).sort((a, b) => a.due < b.due ? -1 : 1);
  const isCal = !!UI.calMonthly;
  const cal = calData(UI.cal);
  const today = todayISO();
  const map = {};
  all.forEach(d => { (map[d.due] = map[d.due] || []).push({ k: 'task', l: d.t.title, s: d.s, d }); });
  openLessons(st).forEach(l => { (map[l.d] = map[l.d] || []).push({ k: 'lesson', l: l.t, id: l.id }); });
  if (!all.length) return '<div class="page-head"><div><h1 class="h1">Deadlines</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">Deadline — baho emas, odat. Kechikkanlar mentor yordamiga muhtoj bo‘ladi.</p></div></div>' +
    emptyCard('cal', 'Deadline hali qo‘yilmagan', 'Administrator vazifalarni deadline bilan berganda shu kalendar to‘ladi. Dars jadvali «Darslar» bo‘limida.');
  const near = all.filter(d => !d.s || d.s.status !== 'accepted').slice(0, 1)[0];
  const lateN = all.filter(d => !d.s && d.tl.late).length;   /* kechikkanlar soni */
  const nx = all.find(d => !d.s && !d.tl.late);               /* keyingi ochiq deadline */
  const nowD = new Date(), dow = (nowD.getDay() + 6) % 7;
  const weekStart = new Date(nowD); weekStart.setDate(nowD.getDate() - dow);
  const strip = Array.from({ length: 7 }).map((_, i) => { const dt = new Date(weekStart); dt.setDate(weekStart.getDate() + i); return dt; });

  let h = '<div class="page-head"><div><h1 class="h1">Deadlines</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + all.length + '</b> deadline · <b>' + lateN + '</b> kechikkan · keyingisi: <b>' + esc(nx ? nx.t.title : '—') + '</b></p></div>' +
    '<div class="seg on-accent"><button class="' + (isCal ? '' : 'on') + '" data-act="cal-mode" data-m="0">Haftalik</button>' +
    '<button class="' + (isCal ? 'on' : '') + '" data-act="cal-mode" data-m="-1">Oylik kalendar</button></div></div>';

  if (near) h += '<div class="card glass"><div class="row wrap between" style="gap:14px">' +
    '<div class="row" style="gap:13px;min-width:280px"><div class="lead" style="width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:rgba(255,92,122,.14);color:var(--danger-tone);border:1px solid rgba(255,92,122,.3)">' + ico('clock', 'lg') + '</div>' +
    '<div><div class="up muted">Eng yaqin deadline</div><div class="h2" style="margin:3px 0">' + esc(near.t.title) + '</div>' +
    '<div class="small muted">' + fmtFull(near.due) + ' • ' + wd(near.due) + ' kuni</div></div></div>' +
    (near.tl.late
      ? '<span class="tag r" style="font-size:12.5px">' + ico('alert', 'sm') + esc(near.tl.txt) + ' — mentor bilan bog‘laning</span>'
      : '<div class="row" style="gap:8px">' + [['kun', near.tl.d], ['soat', near.tl.h], ['daq', near.tl.m]].map(x =>
          '<div class="card tight soft tc" style="min-width:62px"><div class="big">' + x[1] + '</div><div class="xs muted">' + x[0] + '</div></div>').join('') + '</div>') +
    '<button class="btn btn-primary" data-act="submit-open" data-id="' + near.t.id + '">' + ico('upload', 'sm') + 'Topshirish</button></div></div>';

  if (!isCal) {
    h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('cal') + 'Haftalik lenta</h2><span class="small muted">' + fmtFull(today) + '</span></div>' +
      '<div class="grid strip7" id="week-strip">' + strip.map(dt => {
        const ds = isoDate(dt), items = map[ds] || [], isToday = ds === today, past = ds < today;
        return '<div class="card tight" style="min-height:150px;' + (isToday ? 'border-color:var(--brand-2);box-shadow:0 0 0 1px rgba(34,211,238,.35) inset;' : past ? 'opacity:.75;' : '') + '">' +
          '<div class="row between" style="margin-bottom:8px"><span class="xs muted" style="font-weight:800">' + UZ_D[(dt.getDay() + 6) % 7] + '</span>' +
          '<span class="small" style="font-weight:850;color:' + (isToday ? 'var(--brand-2)' : 'inherit') + '">' + dt.getDate() + '</span></div>' +
          '<div class="col" style="gap:6px">' + (items.length ? items.slice(0, 3).map(it => '<div class="tag ' + (it.k === 'task' ? (it.s && it.s.status === 'accepted' ? 'g' : 'p') : 'c') + '" style="white-space:normal;text-align:left;line-height:1.3">' + ico(it.k === 'task' ? 'task' : 'book', 'sm') + esc(it.l.slice(0, 30)) + '</div>').join('') : '<span class="xs muted">—</span>') + '</div></div>';
      }).join('') + '</div></div>';
  } else {
    h += '<div class="card"><div class="card-h">' +
      '<div class="row" style="gap:8px"><button class="btn-icon" style="width:36px;height:36px" data-act="cal-prev">' + ico('left', 'sm') + '</button>' +
      '<h2 class="h2" style="min-width:150px;text-align:center">' + esc(cal.label) + '</h2>' +
      '<button class="btn-icon" style="width:36px;height:36px" data-act="cal-next">' + ico('right', 'sm') + '</button></div>' +
      '<div class="row xs muted wrap" style="gap:12px"><span class="row" style="gap:6px"><i style="width:8px;height:8px;border-radius:50%;background:var(--brand);display:block"></i>vazifa deadline</span>' +
      '<span class="row" style="gap:6px"><i style="width:8px;height:8px;border-radius:50%;background:var(--brand-2);display:block"></i>dars</span>' +
      '<span class="row" style="gap:6px"><i style="width:8px;height:8px;border-radius:50%;background:var(--ok);display:block"></i>qabul qilingan</span></div></div>' +
      '<div class="cal">' + UZ_D.map(d => '<div class="hd">' + d + '</div>').join('') +
      cal.cells.map(c => {
        const ds = isoDate(c.d), items = map[ds] || [], isToday = ds === today;
        const dots = items.slice(0, 4).map(it => '<i style="background:' + (it.k === 'lesson' ? 'var(--brand-2)' : it.s && it.s.status === 'accepted' ? 'var(--ok)' : 'var(--brand)') + '"></i>').join('');
        return '<div class="d ' + (c.out ? 'out ' : '') + (isToday ? 'today ' : '') + (items.length ? 'has' : '') + '" ' + (items.length ? 'data-act="cal-day" data-d="' + ds + '"' : '') + '>' +
          '<span class="n">' + c.d.getDate() + '</span><div class="dots">' + dots + '</div></div>';
      }).join('') + '</div></div>';
  }

  h += '<div class="grid g2"><div class="card"><div class="card-h"><h2 class="h2">' + ico('task') + 'Vazifalar jadvali</h2><span class="small muted">' + all.length + ' ta</span></div>' +
    '<div class="col" style="gap:10px">' + all.map(d => '<div class="lrow ' + (!d.s && d.tl.late ? 'hot' : '') + '">' +
      '<div class="lead">' + ico(modOf(d.t.m).icon) + '</div>' +
      '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(d.t.title) + '</div>' +
      '<div class="xs muted">' + fmtFull(d.due) + ' • ' + wd(d.due) + (dueOf(st, d.t) !== d.t.dl ? ' • jamoa sanasi' : '') + '</div></div>' +
      (d.s ? stChip(d.s.status) : tlPill(d.tl)) + '</div>').join('') + '</div></div>' +

    '<div class="col" style="gap:14px"><div class="card"><div class="card-h"><h2 class="h2">' + ico('alert') + 'E’tibor bering</h2></div>' +
    '<div class="col" style="gap:9px">' + (all.filter(d => (d.s && d.s.status === 'revise') || (!d.s && d.tl.late)).slice(0, 4)
      .map(d => '<div class="row small" style="gap:9px">' + ico('alert', 'sm') + '<span class="grow">' + esc(d.t.title) + '</span><span class="xs muted">' + (d.s ? 'qayta ishlash' : 'topshirilmagan') + '</span></div>').join('')
      || '<div class="empty">' + ico('check-c', 'sm') + ' Hammasi joyida — kechikkan topshiriq yo‘q.</div>') + '</div></div>' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users') + 'Jamoa deadline’lari</h2></div>' +
    (myGroup(st) ? '<div class="col" style="gap:9px">' + S.tasks.slice(2, 5).map(t => { const gd = myGroup(st).dl[t.id] || t.dl; return '<div class="row between small"><span class="t2 ellip">' + esc(t.title) + '</span><b class="nowrap">' + fmtD(gd) + '</b></div>'; }).join('') +
      '<div class="divider"></div><div class="xs muted">Jamoa uchun alohida sanalar mentor tomonidan belgilanadi.</div></div>' : '<div class="empty">Jamoa yo‘q</div>') + '</div>' +
    '<div class="card soft"><div class="row" style="gap:11px"><div class="lead">' + ico('phone') + '</div><div><div class="small" style="font-weight:750">Yordam kerakmi?</div><div class="xs muted">Mentorga yozing — deadline’ni individual surish mavjud.</div></div>' +
    '<button class="btn btn-xs btn-soft" data-act="msg" data-id="mt1">Yozish</button></div></div></div></div>';
  return h;
}

/* ---------- Friends ---------- */
function vFriends() {
  const st = me();
  const fr = friendsOf(st), inc = incomingOf(st), snt = sentOf(st), un = inc.length;
  const all = [...fr, ...inc, ...snt];
  const others = S.students.filter(s => s.id !== st.id && !all.some(x => x.id === s.id));
  const tab = UI.friendTab;
  const board = [...S.students].sort((a, b) => b.wxp - a.wxp).slice(0, 8);
  if (S.students.length < 2) return '<div class="page-head"><div><h1 class="h1">Friends</h1>' +
    '<p class="t2 small" style="margin:6px 0 0">«Har kim har kimdan o‘rganadi» — do‘stlar, XP musobaqasi va jamoaviy reyting.</p></div></div>' +
    emptyCard('users', 'Hozircha klubda faqat siz borsiz', 'Boshqa talabalar qo‘shilgach do‘stlar ro‘yxati, so‘rovlar va XP musobaqasi ishga tushadi.');

  let h = '<div class="page-head"><div><h1 class="h1">Friends</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + fr.length + '</b> do‘st · <b>' + inc.length + '</b> yangi so‘rov · <b>' + S.students.length + '</b> talaba klubda</p></div>' +
    '<div class="row" style="gap:10px"><span class="tag c">' + ico('users', 'sm') + fr.length + ' do‘st</span><span class="tag a">' + ico('flame', 'sm') + fr.filter(onl).length + ' onlayn</span></div></div>';

  h += '<div class="grid g4">' +
    kpi('users', fr.length, 'Do‘stlar', inc.length + ' yangi so‘rov', 'c') +
    kpi('bolt', nf(st.wxp), 'Haftalik XP', '#' + wxpRank(st.id) + '-o‘rin', 'a') +
    kpi('trophy', nf(st.xp), 'Umumiy XP', 'Reyting: ' + xpRank(st.id) + '/18', '') +
    kpi('help', fr.reduce((a, s) => a + s.streak, 0) || 0, 'Do‘stlar streak yig‘indisi', 'Jamoaviy kuch', '') + '</div>';

  h += '<div class="seg">' + [['friends', 'Do‘stlar', fr.length], ['requests', 'So‘rovlar', un], ['find', 'Topish', others.length], ['leaders', 'Reyting', 8]]
    .map(([k, l, c]) => '<button class="' + (tab === k ? 'on' : '') + '" data-act="ftab" data-t="' + k + '">' + l + ' (' + c + ')</button>').join('') + '</div>';

  if (tab === 'friends') {
    h += '<div class="grid g2">' + (fr.length ? fr.map(s => '<div class="card"><div class="row wrap between" style="gap:12px">' +
      '<div class="row" style="gap:11px;min-width:0">' + avatar(s) +
      '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div>' +
      '<div class="xs muted">' + (myGroup(s) ? myGroup(s).name + ' jamoasi • ' : '') + (onl(s) ? 'onlayn' : s.last + ' kun oldin') + '</div>' +
      '<div class="row xs muted" style="gap:9px;margin-top:5px"><span>' + ico('flame', 'sm') + ' ' + s.streak + ' kun</span><span>' + ico('bolt', 'sm') + ' ' + nf(s.wxp) + ' XP</span><span>' + ico('star', 'sm') + ' ' + s.score + '</span></div></div></div>' +
      '<div class="row" style="gap:8px"><button class="btn btn-xs btn-soft" data-act="msg" data-id="' + s.id + '">' + ico('chat', 'sm') + 'Yozish</button>' +
      '<button class="btn btn-xs btn-primary" data-act="help-ask" data-id="' + s.id + '">' + ico('help', 'sm') + 'Yordam</button></div></div>' +
      '<div class="divider"></div>' +
      '<div class="row between small"><span class="muted">Chaqiruv</span><span class="row" style="gap:6px"><button class="btn btn-xs btn-ghost" data-act="challenge" data-id="' + s.id + '">' + ico('trophy', 'sm') + 'XP musobaqasi</button>' +
      '<button class="btn btn-xs btn-ghost" data-act="unfriend" data-id="' + s.id + '">' + ico('x', 'sm') + '</button></span></div></div>').join('') : '<div class="empty">Hali do‘st yo‘q — “Topish” bo‘limidan qo‘shing.</div>') + '</div>';
    h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users-plus') + 'Mentor — talaba juftliklari</h2><span class="small muted">“Peer-to-peer” modeli</span></div>' +
      '<div class="grid g3">' + S.mentors.map(m => '<div class="card tight soft"><div class="row" style="gap:9px">' + avatar({ name: m.name, act: true, last: 0 }, 'sm') +
        '<div style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(m.name) + '</div><div class="xs muted">' + esc(m.role) + '</div></div></div>' +
        '<div class="xs muted" style="margin:9px 0">' + esc(m.bio) + '</div>' +
        '<div class="row between"><span class="tag c">' + ico('star', 'sm') + ' ' + m.rating + '</span><button class="btn btn-xs btn-soft" data-act="msg" data-id="' + m.id + '">Savol berish</button></div></div>').join('') + '</div></div>';
  }

  if (tab === 'requests') {
    h += '<div class="grid g2">' +
      '<div class="card"><div class="card-h"><h2 class="h2">' + ico('users-plus') + 'Kelgan so‘rovlar</h2><span class="tag p">' + inc.length + '</span></div>' +
      '<div class="col" style="gap:10px">' + (inc.length ? inc.map(s => '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'sm') +
        '<div><div class="small" style="font-weight:750">' + esc(s.name) + '</div><div class="xs muted">' + esc(s.bio.slice(0, 46)) + '…</div></div></div>' +
        '<button class="btn btn-xs btn-ok" data-act="freply" data-id="' + s.id + '" data-y="1">Qabul</button>' +
        '<button class="btn btn-xs btn-ghost" data-act="freply" data-id="' + s.id + '" data-y="0">Rad</button></div>').join('') : '<div class="empty">Yangi so‘rov yo‘q</div>') + '</div></div>' +
      '<div class="card"><div class="card-h"><h2 class="h2">' + ico('send') + 'Yuborilgan so‘rovlar</h2></div>' +
      '<div class="col" style="gap:10px">' + (snt.length ? snt.map(s => '<div class="lrow"><div class="row grow" style="gap:11px;min-width:0">' + avatar(s, 'sm') +
        '<div><div class="small" style="font-weight:750">' + esc(s.name) + '</div><div class="xs muted">javob kutilmoqda</div></div></div>' +
        '<button class="btn btn-xs btn-ghost" data-act="funreq" data-id="' + s.id + '">Bekor qilish</button></div>').join('') : '<div class="empty">Yuborilgan so‘rov yo‘q</div>') + '</div></div></div>';
  }

  if (tab === 'find') {
    h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('search') + 'Klub a’zolari</h2><span class="small muted">' + others.length + ' kishi</span></div>' +
      '<div class="grid g3">' + (others.length ? others.map(s => '<div class="card tight soft"><div class="row" style="gap:10px">' + avatar(s, 'sm') +
        '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + '</div>' +
        '<div class="xs muted">' + (myGroup(s) ? myGroup(s).name : 'jamoa yo‘q') + ' • ' + nf(s.xp) + ' XP</div></div></div>' +
        '<div class="row between" style="margin-top:10px"><span class="tag">' + esc(medal(s).n) + '</span>' +
        '<button class="btn btn-xs btn-primary" data-act="fadd" data-id="' + s.id + '">' + ico('plus', 'sm') + 'Qo‘shish</button></div></div>').join('') : '<div class="empty">' + ico('users', 'sm') + ' Barcha a’zolar allaqachon do‘stlar ro‘yxatida</div>') + '</div></div>';
  }

  if (tab === 'leaders') {
    h += '<div class="grid g2"><div class="card"><div class="card-h"><h2 class="h2">' + ico('trophy') + 'Haftalik reyting</h2><span class="tag a">Dushanbadan yangilanadi</span></div>' +
      '<div class="col" style="gap:9px">' + board.map((s, i) => '<div class="lrow ' + (s.id === st.id ? 'hot' : '') + '">' +
        '<div class="rank r' + (i + 1) + '">' + (i + 1) + '</div>' + avatar(s, 'xs') +
        '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(s.name) + (s.id === st.id ? ' (siz)' : '') + '</div>' +
        '<div class="xs muted">' + (myGroup(s) ? myGroup(s).name : '—') + ' • ' + s.streak + ' kun streak</div></div>' +
        '<b class="nowrap">' + nf(s.wxp) + ' XP</b></div>').join('') + '</div></div>' +
      '<div class="card"><div class="card-h"><h2 class="h2">' + ico('flag') + 'Jamoalar musobaqasi</h2></div>' +
      '<div class="col" style="gap:9px">' + [...S.groups].sort((a, b) => b.xp - a.xp).map((g, i) => '<div class="lrow">' +
        '<div class="rank r' + (i + 1) + '">' + (i + 1) + '</div>' + crest(g, 30) +
        '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">' + esc(g.name) + '</div><div class="xs muted ellip">' + esc(g.project) + '</div></div>' +
        '<b class="nowrap">' + nf(g.xp) + '</b></div>').join('') + '</div>' +
      '<div class="divider"></div><div class="xs muted">Oy oxirida eng yuqori jamoa offline Demo Day’da stend oladi.</div></div></div>';
  }
  return h;
}

/* ---------- Ma'lumot ---------- */
function vInfo() {
  const st = me(), g = myGroup(st), p = progress(st), m = medal(st), bs = myBadges(st), cs = certsOf(st);
  let h = '<div class="page-head"><div><h1 class="h1">Ma’lumot</h1>' +
    '<p class="t2 small" style="margin:6px 0 0"><b>' + p.done + '/' + p.total + '</b> dars · <b>' + acceptedOf(st) + '</b> vazifa · <b>' +
      certsOf(st).length + '</b> sertifikat · <b>' + nf(st.coins) + '</b> coin</p></div>' +
    '<button class="btn btn-soft" data-act="edit-profile">' + ico('edit', 'sm') + 'Profilni tahrirlash</button></div>';

  h += '<div class="card glass"><div class="row wrap between" style="gap:16px">' +
    '<div class="row" style="gap:14px;min-width:280px">' +
    '<div class="av xl">' + esc(initials(st.name)) + '<i class="' + (onl(st) ? 'on-dot' : 'off-dot') + '"></i></div>' +
    '<div><div class="row wrap" style="gap:8px"><h2 class="h1" style="font-size:24px">' + esc(st.name) + '</h2><span class="tag p">' + ico(m.i, 'sm') + esc(m.n) + '</span></div>' +
    '<div class="small t2" style="margin-top:6px">' + (g ? esc(g.name) + ' jamoasi • ' : '') + esc(st.tg) + ' • ' + esc(st.phone) + '</div>' +
    '<div class="row wrap xs muted" style="gap:10px;margin-top:8px"><span>' + ico('cal', 'sm') + ' ' + fmtFull(st.joined) + ' dan beri</span>' +
    '<span>' + ico('shield', 'sm') + ' Faol talaba</span>' + (st.medals ? '<span>' + ico('trophy', 'sm') + ' Mentor-talaba juftligi</span>' : '') + '</div></div></div>' +
    '<div class="grid g3" style="gap:10px;min-width:300px;flex:1">' +
    '<div class="card tight soft tc"><div class="big">' + nf(st.xp) + '</div><div class="xs muted">umumiy XP</div></div>' +
    '<div class="card tight soft tc"><div class="big">#' + xpRank(st.id) + '</div><div class="xs muted">umumiy reyting</div></div>' +
    '<div class="card tight soft tc"><div class="big">' + st.streak + '</div><div class="xs muted">kun streak</div></div>' +
    '</div></div>' +
    '<div class="divider"></div>' +
    '<div class="grid g2" style="gap:14px">' +
    '<div class="card soft"><div class="up muted" style="margin-bottom:7px">Maqsadim</div><div class="small t2">' + esc(st.goal) + '</div></div>' +
    '<div class="card soft"><div class="up muted" style="margin-bottom:7px">Men haqimda</div><div class="small t2">' + esc(st.bio) + '</div></div>' +
    '</div></div>';

  h += '<div class="grid g4">' +
    kpi('book', p.done + '/' + p.total, 'Tugatilgan darslar', p.pct + '% kurs progressi', '') +
    kpi('task', acceptedOf(st), 'Qabul qilingan vazifa', 'O‘rtacha ball: ' + st.score, 'a') +
    kpi('cert', cs.length, 'Sertifikatlar', 'Modul yakunida beriladi', 'c') +
    kpi('coin', nf(st.coins), 'Coin', 'Reyting sovg‘alariga', '') + '</div>';

  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('award') + 'Yutuqlar</h2><span class="small muted">' + bs.filter(b => b.own).length + '/' + bs.length + ' ochilgan</span></div>' +
    '<div class="grid g4">' + bs.map(b => '<div class="badge-card ' + (b.own ? '' : 'lock') + '"><div class="bi">' + ico(b.i, 'lg') + '</div>' +
      '<div class="small" style="font-weight:750">' + esc(b.n) + '</div><div class="xs muted">' + esc(b.d) + '</div></div>').join('') + '</div></div>';

  h += '<div class="card"><div class="card-h"><h2 class="h2">' + ico('cert') + 'Sertifikatlar</h2>' +
    '<span class="small muted">' + cs.length + ' ta</span></div>' +
    (cs.length ? '<div class="grid g2">' + cs.map(c => '<div class="lrow"><div class="lead" style="background:rgba(198,255,79,.14);color:var(--accent-tone);border-color:rgba(198,255,79,.3)">' + ico('cert') + '</div>' +
      '<div class="grow" style="min-width:0"><div class="small ellip" style="font-weight:750">Modul ' + c.m.n + ': ' + esc(c.m.title) + '</div>' +
      '<div class="xs muted">Kod: ' + esc(c.code) + '</div></div>' +
      '<button class="btn btn-xs btn-soft" data-act="cert" data-id="' + c.m.id + '">Ochish</button></div>').join('') + '</div>'
      : '<div class="empty">Modulni 100% tugatganingizda sertifikat avtomatik ochiladi.</div>') + '</div>';

  h += '<div class="grid g2">' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('settings') + 'Sozlamalar</h2></div>' +
    '<div class="col" style="gap:12px">' +
    [['notif', 'Bildirishnomalar', 'Yangi vazifa va deadline haqida xabar'], ['weekly', 'Haftalik hisobot', 'Dushanba kuni xulosa keladi'],
     ['publicProfile', 'Ochiq profil', 'Reytingda ismim ko‘rinsin'], ['friendBoard', 'Do‘stlar reytingi', 'Haftalik musobaqa eslatmasi']]
      .map(([k, t2, s2]) => '<div class="row between" style="gap:12px"><div><div class="small" style="font-weight:700">' + esc(t2) + '</div><div class="xs muted">' + esc(s2) + '</div></div>' +
        '<button class="switch ' + (S.settings[k] ? 'on' : '') + '" data-act="toggle-set" data-k="' + k + '" role="switch" aria-checked="' + !!S.settings[k] + '" aria-label="' + esc(t2) + '"></button></div>').join('') +
    '<div class="divider"></div>' +
    '<div class="row wrap" style="gap:9px"><button class="btn btn-soft btn-sm" data-act="export-my">' + ico('download', 'sm') + 'Natijalarimni yuklab olish</button>' +
    (UI.installEvt ? '<button class="btn btn-soft btn-sm" data-act="install">' + ico('download', 'sm') + 'Ilovani o‘rnatish</button>' : '') +
    '<span class="xs muted" style="align-self:center">AI Leaders v' + APP_VERSION + '</span></div>' +
    '</div></div>' +
    '<div class="card"><div class="card-h"><h2 class="h2">' + ico('mail') + 'Aloqa va yordam</h2></div>' +
    '<div class="col" style="gap:10px">' +
    '<div class="row" style="gap:11px"><div class="lead">' + ico('user') + '</div><div class="grow"><div class="small" style="font-weight:750">Mentoringiz</div><div class="xs muted">' + (g && mentorOf(g.mentor) ? esc(mentorOf(g.mentor).name) + ' • ' + esc(mentorOf(g.mentor).tg) : 'Jamoangizga mentor biriktirilmagan') + '</div></div>' +
    '<button class="btn btn-xs btn-soft" data-act="msg" data-id="' + (g ? g.mentor : 'mt1') + '">Yozish</button></div>' +
    '<div class="row" style="gap:11px"><div class="lead">' + ico('chat') + '</div><div class="grow"><div class="small" style="font-weight:750">Klub guruhi</div><div class="xs muted">Umumiy savol-javob va e’lonlar</div></div>' +
    '<button class="btn btn-xs btn-soft" data-act="msg" data-id="mt1">Telegram</button></div>' +
    '<div class="row" style="gap:11px"><div class="lead">' + ico('phone') + '</div><div class="grow"><div class="small" style="font-weight:750">Admin bilan bog‘lanish</div><div class="xs muted">+998 71 200 30 40 • info@aileaders.uz</div></div>' +
    '<button class="btn btn-xs btn-soft" data-act="msg" data-id="admin">Qo‘ng‘iroq</button></div>' +
    '<div class="divider"></div>' +
    '<button class="btn btn-danger btn-sm" data-act="logout">' + ico('out', 'sm') + 'Hisobdan chiqish</button>' +
    '</div></div></div>';
  return h;
}
