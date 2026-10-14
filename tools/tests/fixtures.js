/* ==========================================================================
   TEST FIXTURE — namunaviy (demo) ma'lumotlar.
   Mahsulot kodida (src/) demo ma'lumot YO'Q: platforma bo'sh holatda ishlaydi,
   birinchi ochilishda Founder akkaunti yaratiladi. Testlar va skrinshotlar
   haqiqiy ko'rinishni tekshirish uchun shu fayldagi ma'lumotni yuklaydi.
   ========================================================================== */

const UZ_M = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const dayShift = n => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
const isoDate = d => { const x = new Date(d); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const todayISO = () => isoDate(new Date());

const TASKS = [
  { id: 't1', m: 'm1', title: 'AI bilan tanishuv: 5 ta amaliy topshiriq', brief: 'ChatGPT yoki Claude bilan 5 xil turdagi vazifani bajaring va skrinshotlar bilan hisobot yuboring.', dl: dayShift(-28) },
  { id: 't2', m: 'm2', title: 'Prompt kutubxonasi: 10 ta prompt', brief: 'O‘zingiz ishlatadigan 10 ta promptni yozing: maqsad, namuna, natija. Notion yoki GitHub-ga joylang.', dl: dayShift(-14) },
  { id: 't3', m: 'm3', title: 'Shaxsiy landing sahifa', brief: 'O‘zingiz yoki g‘oyangiz uchun bitta sahifa: sarlavha, muammo, yechim, aloqa formasi. Jonli havola yuboring.', dl: dayShift(3) },
  { id: 't4', m: 'm4', title: 'Loyihani GitHub + Vercel-ga joylash', brief: 'Kodni GitHub repoga yuklang, Vercel-ga deploy qiling. Repo va jonli havola kerak.', dl: dayShift(14) },
  { id: 't5', m: 'm5', title: 'Mini-loyiha: demo video + havola', brief: 'MVP + 90 sekundlik demo video + foydalanuvchi bilan suhbat xulosasi.', dl: dayShift(31) },
  { id: 't6', m: 'm6', title: 'Jamoaviy startap MVP + pitch', brief: 'Jamoa bilan ishlaydigan MVP, 60 sekundlik pitch va Demo Day taqdimoti.', dl: dayShift(45) }
];

const GROUPS = [
  { id: 'g1', name: 'Nova', project: 'EduBot — maktab o‘quvchilari uchun AI repetitor', mentor: 'mt1', members: ['s1', 's2', 's9'], xp: 4820, dl: { t3: dayShift(2) } },
  { id: 'g2', name: 'Orbit', project: 'AgroScan — paxta kasalligini rasm orqali aniqlash', mentor: 'mt2', members: ['s3', 's4', 's10'], xp: 4390, dl: {} },
  { id: 'g3', name: 'Vertex', project: 'Sog‘liqAI — klinikalarda navbatsiz yozilish', mentor: 'mt1', members: ['s5', 's6', 's11'], xp: 3960, dl: {} },
  { id: 'g4', name: 'Pulse', project: 'ScooterGo — mikro-mobillik uchun marshrut', mentor: 'mt3', members: ['s7', 's8', 's12'], xp: 3610, dl: {} },
  { id: 'g5', name: 'Kayzen', project: 'SoftPay — frilanserlar uchun hisob-kitob', mentor: 'mt2', members: ['s13', 's14', 's15'], xp: 3180, dl: {} },
  { id: 'g6', name: 'Logos', project: 'KitobMR — maktab kitoblarini AI bilan saralash', mentor: 'mt3', members: ['s16', 's17', 's18'], xp: 2870, dl: {} }
];

const MENTORS = [
  { id: 'mt1', name: 'Malika Abdurahmonova', role: 'AI mentor', tg: '@malika_ai', rating: 4.9, groups: ['g1', 'g3'], bio: 'ML muhandisi, 4 yillik tajriba. Promptlash va model tanlash bo‘yicha mutaxassis.' },
  { id: 'mt2', name: 'Sardor Yo‘ldoshev', role: 'Product mentor', tg: '@sardor_pm', rating: 4.8, groups: ['g2', 'g5'], bio: 'Startap product menejeri. MVP, metrikalar va foydalanuvchi bilan suhbat bo‘yicha.' },
  { id: 'mt3', name: 'Nigora Karimova', role: 'Design mentor', tg: '@nigora_ui', rating: 4.9, groups: ['g4', 'g6'], bio: 'UI/UX dizayner. Vibe coding va dizayn tizimlari bo‘yicha yordam beradi.' }
];

const buildStudents = () => ([
  { id: 's1', name: 'Dilshod Rahimov', tg: '@dilshod_r', phone: '+998 90 111 22 33', group: 'g1', xp: 1840, wxp: 870, streak: 7, coins: 640, level: 'middle', act: true, score: 8.9, joined: dayShift(-42), bio: 'Toshkentda yashayman. AI bilan biznes g‘oyalarimni sinab ko‘rmoqchiman.', goal: 'Dekabrgacha o‘z SaaS loyihamni ishga tushirish', medals: true, done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'], last: 0 },
  { id: 's2', name: 'Aziza Karimova', tg: '@aziza_k', phone: '+998 90 222 33 44', group: 'g1', xp: 2120, wxp: 760, streak: 12, coins: 810, level: 'middle', act: true, score: 9.2, joined: dayShift(-42), bio: 'Marketing bo‘yicha ishlayman, AI bilan kontent qilaman.', goal: 'Kontent bilan pul topishni yo‘lga qo‘yish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'], last: 0 },
  { id: 's3', name: 'Jasur Toshmatov', tg: '@jasur_t', phone: '+998 91 333 44 55', group: 'g2', xp: 2310, wxp: 980, streak: 16, coins: 900, level: 'middle', act: true, score: 9.5, joined: dayShift(-42), bio: '2 kurs talabasiman, algoritmlarga qiziqaman.', goal: 'Birinchi ishga joylashish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11'], last: 0 },
  { id: 's4', name: 'Malika Sobirova', tg: '@malika_s', phone: '+998 93 444 55 66', group: 'g2', xp: 1740, wxp: 640, streak: 4, coins: 520, level: 'junior', act: true, score: 8.4, joined: dayShift(-42), bio: 'Dizayn bilan shug‘ullanaman.', goal: 'Portfolio yig‘ish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'], last: 1 },
  { id: 's5', name: 'Bekzod Nazarov', tg: '@bek_n', phone: '+998 94 555 66 77', group: 'g3', xp: 1290, wxp: 520, streak: 3, coins: 380, level: 'junior', act: true, score: 7.8, joined: dayShift(-42), bio: 'Savdo sohasida ishlayman.', goal: 'Ish jarayonini avtomatlashtirish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], last: 2 },
  { id: 's6', name: 'Zilola Yusupova', tg: '@zilola_y', phone: '+998 95 666 77 88', group: 'g3', xp: 980, wxp: 300, streak: 0, coins: 240, level: 'junior', act: false, score: 7.1, joined: dayShift(-42), bio: 'O‘qituvchiman, dars materiallarini AI bilan tayyorlayman.', goal: 'Onlayn kurs yaratish', done: ['l1', 'l2', 'l3', 'l4'], last: 6 },
  { id: 's7', name: 'Umid Murodov', tg: '@umid_m', phone: '+998 97 777 88 99', group: 'g4', xp: 1120, wxp: 690, streak: 5, coins: 340, level: 'junior', act: true, score: 8.0, joined: dayShift(-38), bio: 'Logistika kompaniyasida ishlayman.', goal: 'Ichki tizimlarni avtomatlashtirish', done: ['l1', 'l2', 'l3', 'l4', 'l5'], last: 1 },
  { id: 's8', name: 'Shahzoda Ergasheva', tg: '@shahzoda', phone: '+998 99 888 99 00', group: 'g4', xp: 1310, wxp: 460, streak: 6, coins: 410, level: 'junior', act: true, score: 8.3, joined: dayShift(-38), bio: 'Frilans dizayner.', goal: 'AI bilan dizayn tezligini oshirish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], last: 0 },
  { id: 's9', name: 'Otabek Ruzimov', tg: '@otabek_r', phone: '+998 90 121 23 34', group: 'g1', xp: 1980, wxp: 940, streak: 9, coins: 720, level: 'middle', act: true, score: 9.0, joined: dayShift(-42), bio: 'Backend dasturchiman, AI ni ishimga qo‘shyapman.', goal: 'AI-startupga texnik asoschi bo‘lish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'], last: 0 },
  { id: 's10', name: 'Nodira Ismoilova', tg: '@nodira_i', phone: '+998 91 232 34 45', group: 'g2', xp: 1560, wxp: 430, streak: 2, coins: 460, level: 'junior', act: true, score: 8.1, joined: dayShift(-42), bio: 'Agronomiya fakultetida o‘qiyman.', goal: 'Agrotech loyihasi', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'], last: 2 },
  { id: 's11', name: 'Rustam Qodirov', tg: '@rustam_q', phone: '+998 93 343 45 56', group: 'g3', xp: 870, wxp: 260, streak: 0, coins: 190, level: 'junior', act: false, score: 6.9, joined: dayShift(-35), bio: 'Tibbiyot sohasida ishlayman.', goal: 'Klinika uchun yordamchi vosita', done: ['l1', 'l2', 'l3'], last: 9 },
  { id: 's12', name: 'Gulnora Sharipova', tg: '@gulnora_s', phone: '+998 94 454 56 67', group: 'g4', xp: 1440, wxp: 760, streak: 8, coins: 500, level: 'junior', act: true, score: 8.5, joined: dayShift(-38), bio: 'Maktabda informatika o‘qituvchisiman.', goal: 'Darslarni AI bilan yangilash', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], last: 0 },
  { id: 's13', name: 'Farrux Abdullayev', tg: '@farrux_a', phone: '+998 95 565 67 78', group: 'g5', xp: 1020, wxp: 380, streak: 1, coins: 280, level: 'junior', act: true, score: 7.4, joined: dayShift(-33), bio: 'Frilanser dasturchiman.', goal: 'To‘lov tizimlari bilan loyiha', done: ['l1', 'l2', 'l3', 'l4'], last: 3 },
  { id: 's14', name: 'Sevara Mamadaliyeva', tg: '@sevara_m', phone: '+998 97 676 78 89', group: 'g5', xp: 890, wxp: 300, streak: 0, coins: 210, level: 'junior', act: false, score: 6.8, joined: dayShift(-33), bio: 'Talaba, marketingdan dars beraman.', goal: 'Birinchi mini-loyiha', done: ['l1', 'l2', 'l3'], last: 7 },
  { id: 's15', name: 'Temur Sultonov', tg: '@temur_s', phone: '+998 99 787 89 90', group: 'g5', xp: 1180, wxp: 640, streak: 4, coins: 330, level: 'junior', act: true, score: 7.9, joined: dayShift(-33), bio: 'Nazorat organida ishlayman.', goal: 'Hujjat ishlarini avtomatlashtirish', done: ['l1', 'l2', 'l3', 'l4', 'l5'], last: 1 },
  { id: 's16', name: 'Kamola Nurmatova', tg: '@kamola_n', phone: '+998 90 898 90 01', group: 'g6', xp: 1370, wxp: 520, streak: 6, coins: 470, level: 'junior', act: true, score: 8.2, joined: dayShift(-31), bio: 'Kutubxona xodimiman.', goal: 'Ta’lim jarayonini raqamlashtirish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], last: 1 },
  { id: 's17', name: 'Anvar Yoqubov', tg: '@anvar_y', phone: '+998 91 909 01 12', group: 'g6', xp: 760, wxp: 180, streak: 0, coins: 150, level: 'junior', act: false, score: 6.6, joined: dayShift(-31), bio: 'Bankda ishlayman.', goal: 'Ichki hisobotlarni avtomatlashtirish', done: ['l1', 'l2'], last: 11 },
  { id: 's18', name: 'Lola Tosheva', tg: '@lola_t', phone: '+998 93 010 12 23', group: 'g6', xp: 1490, wxp: 600, streak: 7, coins: 540, level: 'junior', act: true, score: 8.6, joined: dayShift(-31), bio: 'Nashriyotda ishlayman.', goal: 'Kitob tayyorlash oqimini tezlashtirish', done: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'], last: 0 }
]);

const buildSubmissions = () => ([
  /* s1 */
  { id: 'p1', task: 't1', st: 's1', link: 'https://github.com/dilshod/ai-basics', note: '5 ta vazifa, skrinshotlar repoda.', at: dayShift(-30), status: 'accepted', score: 92, fb: 'Juda yaxshi hisobot! Keyingi safar 3-topshiriqda xulosa qismini qo‘shing.', rev: 'Malika Abdurahmonova' },
  { id: 'p2', task: 't2', st: 's1', link: 'https://github.com/dilshod/prompt-library', note: '10 ta prompt, Notion bilan ham bog‘ladim.', at: dayShift(-16), status: 'accepted', score: 88, fb: 'Kutubxona tayyor. 6-promptni yanada aniqroq formatlash mumkin.', rev: 'Malika Abdurahmonova' },
  { id: 'p3', task: 't3', st: 's1', link: 'https://edu-bot-xi.vercel.app', note: 'Landing tayyor, kontakt forma Supabase-ga ulanadi.', at: dayShift(-1), status: 'in_review', score: null, fb: '', rev: '' },
  /* s2 */
  { id: 'p4', task: 't1', st: 's2', link: 'https://notion.so/aziza-ai-basics', note: 'Hisobot Notion’da.', at: dayShift(-31), status: 'accepted', score: 95, fb: 'Namunali hisobot, boshqalarga ko‘rsatish mumkin!', rev: 'Malika Abdurahmonova' },
  { id: 'p5', task: 't2', st: 's2', link: 'https://notion.so/aziza-prompts', note: 'Kontent promptlari to‘plami.', at: dayShift(-17), status: 'accepted', score: 90, fb: 'Yaxshi. Rasm promptlarini ham qo‘shsangiz zo‘r bo‘ladi.', rev: 'Malika Abdurahmonova' },
  { id: 'p6', task: 't3', st: 's2', link: 'https://aziza-portfolio.vercel.app', note: 'Shaxsiy portfolio sahifa.', at: dayShift(0), status: 'in_review', score: null, fb: '', rev: '' },
  /* s3 */
  { id: 'p7', task: 't1', st: 's3', link: 'https://github.com/jasur/ai-first-steps', note: 'Barcha topshiriqlar bajarildi.', at: dayShift(-33), status: 'accepted', score: 98, fb: 'Ajoyib. Guruhda yordam berganingiz uchun rahmat!', rev: 'Sardor Yo‘ldoshev' },
  { id: 'p8', task: 't2', st: 's3', link: 'https://github.com/jasur/prompts', note: 'Promptlar + test natijalari.', at: dayShift(-19), status: 'accepted', score: 94, fb: 'Kuchli ish.', rev: 'Sardor Yo‘ldoshev' },
  { id: 'p9', task: 't3', st: 's3', link: 'https://agroscan-demo.vercel.app', note: 'Landing tayyor, model demosi tez orada.', at: dayShift(-2), status: 'in_review', score: null, fb: '', rev: '' },
  /* s4 */
  { id: 'p10', task: 't1', st: 's4', link: 'https://drive.google.com/malika-hisobot', note: 'Hisobot Google Docs’da.', at: dayShift(-25), status: 'revise', score: 62, fb: '3 ta topshiriq yetishmayapti. Skrinshotlarni qo‘shib qayta yuboring.', rev: 'Sardor Yo‘ldoshev' },
  { id: 'p11', task: 't2', st: 's4', link: 'https://drive.google.com/malika-prompts', note: '6 ta prompt tayyor.', at: dayShift(-13), status: 'accepted', score: 78, fb: 'Yaxshi boshlanish. Keyingi safar to‘liq 10 ta bo‘lsin.', rev: 'Sardor Yo‘ldoshev' },
  /* s5 */
  { id: 'p12', task: 't1', st: 's5', link: 'https://github.com/bekzod/ai-homework', note: 'Topshiriq bajarildi.', at: dayShift(-27), status: 'accepted', score: 80, fb: 'Yaxshi, ammo xulosalar yuzaki. Chuqurroq yozing.', rev: 'Malika Abdurahmonova' },
  { id: 'p13', task: 't2', st: 's5', link: 'https://notion.so/bek-prompts', note: 'Savdo uchun promptlar.', at: dayShift(-12), status: 'accepted', score: 84, fb: 'Amaliy promptlar. Rahmat!', rev: 'Malika Abdurahmonova' },
  { id: 'p14', task: 't3', st: 's5', link: 'https://sogliq-ai.vercel.app', note: 'Landing, forma ishlamoqda.', at: dayShift(0), status: 'in_review', score: null, fb: '', rev: '' },
  /* s6 — kechikkan, topshirmagan */
  { id: 'p15', task: 't1', st: 's6', link: 'https://github.com/zilola/ai-tasks', note: 'Kechirasiz, biroz kechikdim.', at: dayShift(-21), status: 'late', score: 74, fb: 'Kechikkan, lekin bajarilgan. Vaqtni rejalashtirishga e’tibor bering.', rev: 'Malika Abdurahmonova' },
  /* s7 */
  { id: 'p16', task: 't1', st: 's7', link: 'https://github.com/umid/ai-1', note: 'Tayyor.', at: dayShift(-29), status: 'accepted', score: 86, fb: 'Yaxshi ish!', rev: 'Nigora Karimova' },
  { id: 'p17', task: 't2', st: 's7', link: 'https://github.com/umid/prompts', note: 'Logistika promptlari.', at: dayShift(-15), status: 'accepted', score: 89, fb: 'Sohaga mos promptlar — juda yaxshi.', rev: 'Sardor Yo‘ldoshev' },
  /* s8 */
  { id: 'p18', task: 't1', st: 's8', link: 'https://figma.com/shahzoda-ai', note: 'Figma prezentatsiya.', at: dayShift(-26), status: 'accepted', score: 91, fb: 'Vizual jihatdan juda chiroyli.', rev: 'Nigora Karimova' },
  { id: 'p19', task: 't2', st: 's8', link: 'https://figma.com/shahzoda-prompts', note: 'Dizayn promptlari.', at: dayShift(-11), status: 'in_review', score: null, fb: '', rev: '' },
  /* s9 */
  { id: 'p20', task: 't1', st: 's9', link: 'https://github.com/otabek/ai-first', note: 'Kod bilan birga.', at: dayShift(-32), status: 'accepted', score: 96, fb: 'Ajoyib. Mentor yordamchisi bo‘lishni taklif qilaman.', rev: 'Malika Abdurahmonova' },
  { id: 'p21', task: 't2', st: 's9', link: 'https://github.com/otabek/prompts-api', note: 'Promptlarni API orqali sinovdan o‘tkazdim.', at: dayShift(-18), status: 'accepted', score: 97, fb: 'Aqlga sig‘maydigan darajada yaxshi ish.', rev: 'Malika Abdurahmonova' },
  { id: 'p22', task: 't3', st: 's9', link: 'https://otabek-dev.vercel.app', note: 'Landing + blog sahifa.', at: dayShift(-4), status: 'accepted', score: 93, fb: 'Tez va toza ishlangan. Deploy ham to‘g‘ri.', rev: 'Malika Abdurahmonova' },
  /* s10 */
  { id: 'p23', task: 't1', st: 's10', link: 'https://drive.google.com/nodira-1', note: 'Tayyor.', at: dayShift(-23), status: 'accepted', score: 79, fb: 'Yaxshi, ilova qilingan fayllar aniq.', rev: 'Sardor Yo‘ldoshev' },
  /* s11 */
  { id: 'p24', task: 't1', st: 's11', link: 'https://github.com/rustam/ai-tasks', note: 'Bajardim.', at: dayShift(-14), status: 'late', score: 70, fb: 'Ikki hafta kechikdi. Qo‘llab-quvvatlash kerak bo‘lsa yozing.', rev: 'Malika Abdurahmonova' },
  /* s12 */
  { id: 'p25', task: 't1', st: 's12', link: 'https://github.com/gulnora/ai-lesson', note: 'Dars materiallari bilan.', at: dayShift(-28), status: 'accepted', score: 90, fb: 'Darsga tatbiq etilgani ajoyib.', rev: 'Nigora Karimova' },
  { id: 'p26', task: 't2', st: 's12', link: 'https://github.com/gulnora/prompts', note: 'O‘qituvchi uchun promptlar.', at: dayShift(-13), status: 'accepted', score: 92, fb: 'Juda foydali to‘plam.', rev: 'Nigora Karimova' },
  /* s13 */
  { id: 'p27', task: 't1', st: 's13', link: 'https://github.com/farrux/ai-1', note: 'Tayyor.', at: dayShift(-24), status: 'accepted', score: 82, fb: 'Yaxshi.', rev: 'Sardor Yo‘ldoshev' },
  /* s14 — topshirmagan */
  /* s15 */
  { id: 'p28', task: 't1', st: 's15', link: 'https://github.com/temur/ai-hw', note: 'Hujjat ishlari bilan bog‘ladim.', at: dayShift(-22), status: 'accepted', score: 85, fb: 'Amaliy yondashuv yaxshi.', rev: 'Sardor Yo‘ldoshev' },
  { id: 'p29', task: 't2', st: 's15', link: 'https://notion.so/temur-prompts', note: 'Nazorat uchun promptlar.', at: dayShift(-8), status: 'in_review', score: null, fb: '', rev: '' },
  /* s16 */
  { id: 'p30', task: 't1', st: 's16', link: 'https://drive.google.com/kamola-1', note: 'Kutubxona misolida.', at: dayShift(-26), status: 'accepted', score: 87, fb: 'Yaxshi ish.', rev: 'Nigora Karimova' },
  { id: 'p31', task: 't2', st: 's16', link: 'https://drive.google.com/kamola-prompts', note: 'Kitob tavsifi promptlari.', at: dayShift(-10), status: 'accepted', score: 88, fb: 'Aniq va toza.', rev: 'Nigora Karimova' },
  /* s17 — jim */
  { id: 'p32', task: 't1', st: 's17', link: 'https://github.com/anvar/ai', note: '', at: dayShift(-15), status: 'late', score: 68, fb: 'Kechikdi va hisobot yuzaki. Aloqaga chiqing.', rev: 'Nigora Karimova' },
  /* s18 */
  { id: 'p33', task: 't1', st: 's18', link: 'https://github.com/lola/ai-1', note: 'Nashriyot misolida.', at: dayShift(-27), status: 'accepted', score: 89, fb: 'Amaliy va aniq.', rev: 'Nigora Karimova' },
  { id: 'p34', task: 't2', st: 's18', link: 'https://github.com/lola/prompts', note: 'Tahrir promptlari.', at: dayShift(-9), status: 'accepted', score: 91, fb: 'Juda yaxshi tuzilgan.', rev: 'Nigora Karimova' },
  { id: 'p35', task: 't3', st: 's18', link: 'https://kitobmr.vercel.app', note: 'Landing sahifa tayyor.', at: dayShift(-1), status: 'in_review', score: null, fb: '', rev: '' },
  /* s9 ikkinchi jamoaviy belgi */
  { id: 'p36', task: 't1', st: 's10', link: 'https://drive.google.com/nodira-ai', note: 'Ilova.', at: dayShift(-22), status: 'revise', score: 65, fb: 'Fayl ochilmadi, ruxsatni tekshiring.', rev: 'Sardor Yo‘ldoshev' }
]);

const buildWalls = () => ({
  g1: [
    { id: 'w1', who: 's2', text: 'Bugun EduBot uchun chat ekranini tugatdim. Kechqurun 21:00 da qisqa sync qilamizmi?', at: '2 soat oldin' },
    { id: 'w2', who: 's9', text: 'Supabase jadvallarini tayyorladim. Landing formasi endi saqlanadi ✅', at: '5 soat oldin' },
    { id: 'w3', who: 's1', text: 'Demo Day uchun pitch strukturasi tayyor, ertaga mashq qilamiz.', at: 'kecha' }
  ],
  g2: [{ id: 'w4', who: 's3', text: 'Model aniqligi 78% ga chiqdi. Ma’lumot to‘plashda yordam kerak.', at: '3 soat oldin' }],
  g3: [{ id: 'w5', who: 's5', text: 'Forma validatsiyasini qo‘shdim, ertaga testga chiqaramiz.', at: '1 kun oldin' }],
  g4: [{ id: 'w6', who: 's8', text: 'Yangi dizayn varianti tayyor, fikrlaringizni yozing.', at: '6 soat oldin' }],
  g5: [{ id: 'w7', who: 's15', text: 'Frilanserlar bo‘yicha 5 ta intervyu oldim.', at: '2 kun oldin' }],
  g6: [{ id: 'w8', who: 's16', text: 'Kitoblarni saralash uchun test to‘plami tayyor.', at: '4 soat oldin' }]
});

const buildGallery = () => ([
  { id: 'gl1', t: 'EduBot — AI repetitor', by: 'g1', kind: 'Nova jamoasi', link: 'https://edu-bot-xi.vercel.app', desc: 'O‘quvchiga moslashtirilgan mashqlar generatori. 3 haftada MVP chiqarildi.', k: 'g1' },
  { id: 'gl2', t: 'AgroScan', by: 'g2', kind: 'Orbit jamoasi', link: 'https://agroscan-demo.vercel.app', desc: 'Barg rasmidan kasallikni aniqlaydigan model + mobil ko‘rinish.', k: 'g2' },
  { id: 'gl3', t: 'Aziza portfolio', by: 's2', kind: 'Shaxsiy loyiha', link: 'https://aziza-portfolio.vercel.app', desc: 'Kontent marketolog uchun shaxsiy brend sahifasi.', k: 'g4' },
  { id: 'gl4', t: 'KitobMR dashboard', by: 'g6', kind: 'Logos jamoasi', link: 'https://kitobmr.vercel.app', desc: 'Maktab kitoblarini AI bilan saralash paneli.', k: 'g3' }
]);

const ADMIN_SEED = [
  { id: 'a1', nick: 'bekzod', name: 'Bekzod Aliyev', email: 'bekzod@aileaders.uz', adRole: 'founder', perms: ['__all'] },
  { id: 'a2', nick: 'malika', name: 'Malika Abdurahmonova', email: 'malika@aileaders.uz', adRole: 'head-mentor', perms: ['students', 'tasks', 'stats'] },
  { id: 'a3', nick: 'sardor', name: 'Sardor Yo‘ldoshev', email: 'sardor@aileaders.uz', adRole: 'mentor', perms: ['students', 'tasks'] },
  { id: 'a4', nick: 'nigora', name: 'Nigora Karimova', email: 'nigora@aileaders.uz', adRole: 'mentor', perms: ['students', 'tasks', 'content'] },
  { id: 'a5', nick: 'zuhra', name: 'Zuhra Ismoilova', email: 'zuhra@aileaders.uz', adRole: 'content', perms: ['content', 'students'] },
  { id: 'a6', nick: 'timur', name: 'Timur Sobirov', email: 'timur@aileaders.uz', adRole: 'curator', perms: ['students', 'stats', 'groups'] },
  { id: 'a7', nick: 'dilnoza', name: 'Dilnoza Yo‘ldosheva', email: 'dilnoza@aileaders.uz', adRole: 'mentor', perms: ['students', 'tasks', 'groups'] }
];

const DEMO_NICKS = ['falcon', 'onyx', 'comet', 'zephyr', 'nova', 'atlas', 'echo', 'pixel', 'cobalt', 'quasar', 'vector', 'photon', 'nexus', 'ember', 'orbit', 'lunar', 'titan', 'hydra'];

function buildAccounts() {
  const accs = [];
  STUDENTS.forEach((st, i) => accs.push({
    id: 'acc-' + st.id, role: 'student', studentId: st.id, nick: DEMO_NICKS[i % DEMO_NICKS.length] + (i >= DEMO_NICKS.length ? (i + 1) : ''),
    name: st.name, phone: st.phone, hemisId: null, groupId: st.group, pass: null, mustSetPass: true,
    status: 'active', demo: true, created: st.joined, lastLogin: null
  }));
  ADMIN_SEED.forEach(a => accs.push({
    id: 'acc-' + a.id, role: 'admin', adminRole: a.adRole, perms: a.perms.slice(), nick: a.nick, name: a.name,
    email: a.email, phone: null, hemisId: null, pass: null, mustSetPass: true, status: 'active', demo: true,
    created: todayISO(), lastLogin: null
  }));
  return accs;
}

/* Talaba profillari bir marta quriladi (akkauntlar shundan foydalanadi) */
const STUDENTS = buildStudents();

const FIXTURE_VERSION = '2.0.0';

/* To'liq namunaviy holat (localStorage'ga yoziladi) */
function demoState() {
  return {
    role: 'student', user: 's1', theme: 'dark',
    students: buildStudents(), submissions: buildSubmissions(), walls: buildWalls(), gallery: buildGallery(),
    groups: JSON.parse(JSON.stringify(GROUPS)), mentors: JSON.parse(JSON.stringify(MENTORS)),
    tasks: JSON.parse(JSON.stringify(TASKS)),
    accounts: buildAccounts(),
    notifs: [
      { id: 'n1', for: 's1', t: 'Vazifa qabul qilindi', x: '“Prompt kutubxonasi” — 88/100 ball. Izohni o‘qing.', at: '2 kun oldin', ic: 'check-c', un: false },
      { id: 'n2', for: 's1', t: 'Deadline yaqin', x: '“Shaxsiy landing sahifa” — jamoangiz uchun 15-oktabr.', at: 'bugun', ic: 'clock', un: true },
      { id: 'n3', for: 's1', t: 'Jamoada yangi yozuv', x: 'Nova devorida Aziza yangi xabar qoldirdi.', at: '5 soat oldin', ic: 'users', un: true },
      { id: 'n4', for: 's1', t: 'Do‘stlik so‘rovi', x: 'Umid Murodov sizga so‘rov yubordi.', at: '1 kun oldin', ic: 'user', un: true },
      { id: 'n5', for: 's1', t: 'Demo Day', x: '28-noyabr kuni offline Demo Day. Ro‘yxatdan o‘ting.', at: '3 kun oldin', ic: 'trophy', un: false }
    ],
    friends: { s1: ['s2', 's3', 's9', 's12', 's15'] },
    incoming: { s1: ['s7'] }, sent: { s1: ['s16'] },
    activity: [
      { who: 'Aziza Karimova', what: '“Prompt kutubxonasi”ni topshirdi', at: '4 daqiqa oldin' },
      { who: 'Sardor Yo‘ldoshev', what: '5 ta vazifani tekshirishga oldi', at: '22 daqiqa oldin' },
      { who: 'Jasur Toshmatov', what: '2-modulni 100% tugatdi', at: '1 soat oldin' },
      { who: 'Nova jamoasi', what: 'yangi loyiha g‘oyasini e’lon qildi', at: '3 soat oldin' },
      { who: 'Nigora Karimova', what: 'dizayn bo‘yicha izoh qoldirdi', at: 'kecha' },
      { who: 'Otabek Ruzimov', what: '3-modul “Vibe coding”ni boshladi', at: 'kecha' }
    ],
    weekly: [{ l: 'Du', v: 42 }, { l: 'Se', v: 58 }, { l: 'Cho', v: 51 }, { l: 'Pa', v: 66 }, { l: 'Ju', v: 74 }, { l: 'Sh', v: 38 }, { l: 'Ya', v: 24 }],
    monthGrowth: [8, 11, 14, 18],
    session: null,
    settings: { notif: true, weekly: true, publicProfile: true, friendBoard: false },
    meta: { version: FIXTURE_VERSION, created: todayISO(), demoPurged: true, fixture: true }
  };
}
/* Sessiya bilan holat: sahifa ochilganda to'g'ridan-to'g'ri panel ochiladi */
function withSession(accId) {
  const st = demoState();
  const a = st.accounts.find(x => x.id === 'acc-' + accId) || st.accounts.find(x => x.id === accId);
  if (!a) throw new Error('fixture: akkaunt topilmadi — ' + accId);
  a.mustSetPass = false; a.pass = 'fixture';
  st.session = { acc: a.id, at: Date.now() };
  st.role = a.role === 'admin' ? 'admin' : 'student';
  if (a.studentId) st.user = a.studentId;
  return st;
}
/* Bo'sh (yangi o'rnatilgan) holat — birinchi ishga tushirish ekrani uchun */
function emptyState() {
  return { role: 'student', user: 's1', theme: 'dark', students: [], submissions: [], walls: {}, gallery: [], groups: [], mentors: [],
    tasks: [], accounts: [], notifs: [], friends: {}, incoming: {}, sent: {}, activity: [], weekly: [], monthGrowth: [],
    session: null, settings: { notif: true, weekly: true, publicProfile: true, friendBoard: false },
    meta: { version: FIXTURE_VERSION, created: todayISO(), demoPurged: true } };
}
module.exports = { demoState, withSession, emptyState, FIXTURE_VERSION };
