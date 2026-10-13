# AI Leaders — Startup Club platformasi

> **0 dan startapgacha** — boshlovchilarni startuplarga tayyorlaydigan klub uchun to'liq ishlaydigan o'quv platformasi.
> Talaba kabineti (7 bo'lim) + Admin/Mentor paneli (8 bo'lim), gamification, vazifa–deadline tizimi va jamoaviy ishlash.

| | |
|---|---|
| 🌐 **Jonli sayt** | **https://ai-leaders-platform.pages.dev** |
| 💻 **Kod** | https://github.com/Asilbek-ops-afk/ai-leaders-platform |
| 🧪 **Testlar** | `npm test` → **152 ta tekshiruv, 0 xato** |
| 📱 **PWA** | Telefonda "Bosh ekranga qo'shish" — oflayn ham ishlaydi |
| 📦 **Hajm** | Bitta `index.html` (~266 KB), tashqi kutubxonasiz |

---

## Mundarija
1. [Nima bor?](#nima-bor)
2. [Talaba kabineti](#1-talaba-kabineti-7-boʻlim)
3. [Admin paneli](#2-admin--mentor-paneli-8-boʻlim)
4. [Gamification](#3-gamification-oʻquvchini-ushlab-turish)
5. [Texnik tuzilma](#texnik-tuzilma)
6. [Ishga tushirish va buyruqlar](#ishga-tushirish)
7. [Testlar va skrinshotlar](#testlar)
8. [Real bazaga o'tish (Supabase)](#real-bazaga-otish)
9. [Demo ma'lumotlar](#demo-maʼlumotlar)
10. [Yo'l xaritasi](#yol-xaritasi)

---

## Nima bor?

Platforma **uchta asosiy g'oyani** hal qiladi:
- **Yo'l xaritasi** — 0 dan boshlovchi "keyingi qadamim nima?" degan savolga javob topadi.
- **Intizom** — vazifa → deadline → tekshirish → baho → keyingi modul zanjiri.
- **Jamoa** — yolg'iz o'qish emas, startap mashqi: jamoa, devor, mentor, Demo Day.

Barcha sahifalar **mobil-birinchi** (talabalar asosan telefondan kiradi) va **ikki rejimli** (dark / light).

---

### 1. Talaba kabineti (7 bo'lim)

| Bo'lim | Nima qiladi |
|---|---|
| 🏠 **Bosh sahifa** | Salomlashish, bugungi reja (kunlik questlar +XP), kurs progressi, eng yaqin deadline, "Boshlash yo'riqnomasi" (5 qadam), haftalik faollik grafigi, jamoa, Galereya |
| 📚 **Darslar** | 6 modul: AI asoslari → Prompt yozish → Vibe coding → Claude Code/GitHub/deploy → Mini-loyiha → Jamoaviy startap. Qisqa darslar (10–20 daq), **qisqa tekshiruv (quiz)**, modul qulfi: oldingi vazifa qabul qilinmaguncha keyingisi yopiq |
| ✅ **Vazifa** | Havola + fayl (900 KB gacha) topshirish, 6 xil holat filtri, mentor bahosi (0–100) va izohi, qayta yuborish |
| 👥 **Team** | O'z jamoasi va a'zolar (rollar), jamoa devori (standup), mentor, jamoaviy loyiha holati, **jamoaviy topshirish** (bir ish 3 a'zo nomidan) |
| ⏰ **Deadline** | Haftalik lenta + oylik kalendar (rangli belgilar), kun/soat/daqiqa sanoq taymeri, jamoa uchun alohida sanalar |
| 🤝 **Friends** | Do'stlar, so'rovlar (qabul/rad), klub a'zolarini topish, haftalik reyting, jamoalar musobaqasi, mentor–talaba juftliklari |
| 🛡 **Ma'lumot** | Profil tahriri, 8 yutuq (badge), sertifikatlar (**chop etish/PDF**), sozlamalar (saqlanadi), natijalarni CSV yuklab olish, ilovani o'rnatish |

### 2. Admin / Mentor paneli (8 bo'lim)

| Bo'lim | Nima qiladi |
|---|---|
| 📊 **Dashboard** | 5 KPI (talabalar, haftalik faollik, tekshirish navbati, kechikkanlar, o'rtacha baho), haftalik grafik, Top-5, navbat va kechikkanlar ro'yxati |
| 👥 **Talabalar** | Jadval (progress, faollik, ball, streak), filtrlar (guruh / kechikkan / jim), profil modali, **jamoa almashtirish**, progressni tiklash, klubdan chiqarish, eslatma yuborish |
| ✅ **Vazifalar** | Vazifa berish (modul, deadline, kimga), **tekshirish va baholash** (0–100 + izoh), bahoni tahrirlash, topshiriqlar oqimi |
| 📚 **Darslar** | Modul/dars qo'shish, tahrirlash, o'chirish (tasdiq bilan), kontent statistikasi |
| 🏁 **Jamoalar** | Jamoa tuzish, a'zo qo'shish/ko'chirish/chiqarish, mentor biriktirish, loyiha holati |
| ⏰ **Deadline'lar** | Kalendar (umumiy + jamoa istisnolari), kechikkanlar ro'yxati, jamoalar kesimi, eslatmalar |
| 📈 **Statistika** | Modul tugatish foizi, retention grafigi, jamoalar reytingi, eng yaxshi loyihalar, xulosa va tavsiyalar, **CSV hisobot** |
| ⚙️ **Sozlamalar** | **JSON zaxira nusxa** (yuklab olish + tiklash), CSV hisobot, mentorlar boshqaruvi, Galereya boshqaruvi, platforma haqida |

### 3. Gamification (o'quvchini ushlab turish)

🔥 **Streak** (kunlik) · ⚡ **XP va coin** · 🎯 **Kunlik questlar** (dars tugatish, yordam, vazifa — XP avtomatik yoziladi) ·
🏅 **8 yutuq** (Birinchi qadam, Prompt ustasi, Builder, 7 kun streak, Jamoa a'zosi, Deploy qilgan, Mentor do'sti, Demo Day yulduzi) ·
🎓 **Sertifikatlar** (modul 100% → chop etiladigan hujjat + kod) · 🏆 **Haftalik reyting va jamoalar musobaqasi** ·
🖼 **Galereya** · 🧑‍🏫 **Mentor–talaba juftligi** · 🎤 **Offline Demo Day**

---

## Texnik tuzilma

```
ai-leaders/
├── index.html                 # ← build natijasi: yagona mustaqil fayl (deploy uchun shu yetarli)
├── manifest.webmanifest       # PWA manifest (ikonlar, yorliqlar)
├── sw.js                      # Service worker: oflayn rejim
├── build.js                   # src → index.html + dist/ yig'uvchi
├── package.json               # npm run build / test / assets / deploy
├── src/                       # manba (o'qish va tahrirlash uchun qulay)
│   ├── template.html          # HTML karkas + 68 ta original SVG ikona (sprite)
│   ├── style.css              # dizayn tizimi: dark + light, mobil-birinchi, print
│   ├── app-1-core.js          # yordamchilar, o'quv dasturi, holat, hisob-kitoblar, shell, modallar
│   ├── app-2-student.js       # talaba bo'limlari
│   ├── app-3-admin.js         # admin bo'limlari
│   └── app-4-app.js           # auth, router, 80+ interaksiya, qidiruv, eksport
├── assets/                    # brend: icon-192/512, maskable, apple-touch, og.png (1200×630)
├── brand/                     # logo-mark.svg, logo-full.svg (vektor brend)
├── schema/supabase.sql        # Real bazaga o'tish uchun to'liq PostgreSQL sxemasi (19 jadval, RLS, view'lar)
├── tools/
│   ├── make-assets.py         # ikon va OG rasmni generatsiya qiladi (Pillow)
│   └── tests/
│       ├── run.js             # 152 ta avtomatik test (jsdom)
│       └── screens.js         # 28 ta skrinshot (playwright) → docs/screens/
├── docs/
│   ├── ishga-tushirish-rejasi.md   # 30 kunlik klub ishga tushirish rejasi + metrikalar
│   └── screens/                    # desktop + mobil skrinshotlar
└── dist/                      # deploy papkasi (build avtomatik yaratadi)
```

**Texnologiya:** vanilla JavaScript + CSS (yagona fayl), tashqi CDN/kutubxonasiz —
shu sababli juda tez yuklanadi va istalgan hostingda ishlaydi (Cloudflare Pages, Netlify, GitHub Pages, hatto `file://`).

**Xavfsizlik:** `_headers` (nosniff, referrer-policy, permissions-policy), `esc()` orqali XSS himoyasi,
sertifikat/CSV chop etishda xavfsiz `downloadBlob()`, JS render uchun error boundary.

**Qulayliklar:** `/` tugmasi bilan qidiruvga o'tish · `Esc` modalni yopadi · modalda fokus tuzog'i ·
`aria-label`/`role="switch"` · `prefers-reduced-motion` · skip-link · noscript zaxirasi · print (sertifikat uchun).

---

## Ishga tushirish

```bash
git clone https://github.com/Asilbek-ops-afk/ai-leaders-platform.git
cd ai-leaders-platform

npm run build       # src → index.html + dist/
npm test            # 152 ta avtomatik test (jsdom kerak: npm install)
npm run assets      # ikon/OG rasmni qayta generatsiya qilish (Python + Pillow)
npm run check       # sintaksis tekshiruvi

# shunchaki brauzerda ochish:
open index.html     # yoki faylni brauzerga tashlang
```

### Deploy (Cloudflare Pages)

```bash
export CLOUDFLARE_API_TOKEN=xxx      # Pages:Edit huquqi bilan
export CLOUDFLARE_ACCOUNT_ID=xxx
npm run deploy                       # build + wrangler pages deploy dist/
```

---

## Testlar

Loyihada ikki darajali sifat nazorati bor:

**1) `npm test` — funksional testlar (jsdom, haqiqiy DOM)**
15 guruh, **152 ta tekshiruv**: kirish va rol himoyasi, 7 talaba bo'limi, 8 admin bo'limi,
vazifa topshirish → tekshirish → baholash zanjiri, modul qulfi, quiz, kunlik questlar,
fayl biriktirish, jamoa devori va jamoaviy topshirish, kalendar navigatsiyasi, eksport/zaxira,
sozlamalar saqlanishi, sana mantig'i, PWA/SEO teglari, buzilgan `localStorage`'dan tiklanish.

**2) `node tools/tests/screens.js` — vizual QA (playwright, Chromium)**
28 ta skrinshot: 14 desktop sahifa, 6 mobil ko'rinish, modallar, light tema → `docs/screens/`.

---

## Real bazaga o'tish

Demo rejimda barcha ma'lumot brauzer xotirasida (`localStorage`, kalit `ai-leaders-platform-v1`) saqlanadi.
Real ko'p foydalanuvchili ish uchun:

1. **Supabase** loyihasi oching → SQL Editor → `schema/supabase.sql` ni to'liq ishga tushiring.
   Sxemada tayyor: **19 jadval**, 3 ta view (statistika, reyting, kechikkanlar), **RLS siyosatlari**
   (talaba faqat o'zini ko'radi, mentor hammasini), PL/pgSQL funksiyalar (`fn_complete_lesson`, `fn_module_unlocked`),
   Storage siyosatlari va demo seed ma'lumot.
2. `src/app-1-core.js` dagi **`loadState()`** va **`save()`** funksiyalarini Supabase chaqiruvlariga almashtiring —
   qolgan kod (butun UI) o'zgarishsiz qoladi, chunki butun holat bitta `S` obyektida.
3. Fayllar uchun Supabase Storage (`submissions` bucket) ishlatilsin — hozir kichik fayllar dataURL sifatida saqlanadi.
4. **Telegram-bot** ulash: deadline eslatmalari va kunlik standup (21:00).

---

## Demo ma'lumotlar

| Nima | Soni |
|---|---|
| Talabalar | 18 (5 jamoada + 3 jamoasiz) |
| Mentorlar | 3 (AI / Product / Design) |
| Modullar / darslar | 6 / 29 |
| Vazifalar / topshiriqlar | 6 / 38 |
| Jamoalar / loyihalar | 6 / 4 galereyada |

Demo sanalari **bugunga nisbatan siljitilgan** — ya'ni sayt har doim "tirik" ko'rinadi:
yaqin deadline'lar, kechikkanlar va haftalik reyting doim mavjud.
Demoni tiklash: yon paneldagi ↻ tugmasi yoki `localStorage.removeItem('ai-leaders-platform-v1')`.

**Demo hisoblar:** AUTH ekranida "Talaba" yoki "Admin" rolini tanlang (parol talab qilinmaydi).
Tezkirish tugmalari: Dilshod (student), Jasur (faol student), Bekzod (admin).

---

## Yo'l xaritasi

- [x] Talaba kabineti (7 bo'lim) va Admin paneli (8 bo'lim)
- [x] Gamification: streak, XP, questlar, badge, sertifikat, reyting
- [x] PWA (oflayn), SEO (OG/Twitter/JSON-LD), a11y, dark/light
- [x] Zaxira nusxa (JSON), CSV hisobotlar, vizual testlar
- [x] Supabase sxemasi (19 jadval + RLS) — real bazaga tayyor
- [ ] Supabase'ga ulash (real login: talaba/mentor/admin)
- [ ] Telegram-bot: deadline eslatmalari + standup
- [ ] Video darslarni yuklash (Storage + pleyer)
- [ ] Offline Demo Day moduli (stend, pitch taymeri, mehmon ro'yxati)
- [ ] To'lov moduli (obuna / ishga joylashgach to'lov)

---

© 2026 **AI Leaders Startup Club** — Toshkent. Demo loyiha; brend, dizayn va kod ushbu klub uchun yaratilgan.
