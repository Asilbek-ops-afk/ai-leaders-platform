# AI Leaders — Startup Club platformasi

**AI Leaders** — 0 dan boshlovchilarni startuplarga tayyorlaydigan klub uchun to'liq ishlaydigan o'quv platformasi.
Bitta HTML fayl (`index.html`), tashqi kutubxonasiz — istalgan hostingga qo'yish mumkin.

> Jonli demo: AUTH ekranida **Student** yoki **Admin** rolini tanlab kiring (parol talab qilinmaydi).

---

## Nima bor?

### Talaba (Student) — 7 bo'lim
| Bo'lim | Mazmuni |
|---|---|
| **Bosh sahifa** | Salomlashish, bugungi reja (kunlik questlar), progress foizi, eng yaqin deadline, yo'l xaritasi, haftalik faollik, jamoa va Galereya |
| **Darslar** | 6 modul: AI asoslari → Prompt yozish → Vibe coding → Claude Code/GitHub/deploy → Mini-loyiha → Jamoaviy startap. Modul ochilishi oldingi modul vazifasi qabul qilinishiga bog'liq |
| **Vazifa** | Havola/fayl topshirish, holat (topshirilmagan → tekshirilmoqda → qabul / qayta ishlash / kechikkan), mentor bahosi (0–100) va izohi |
| **Team** | O'z jamoasi, a'zolar va rollari, jamoa devori (standup), mentor, jamoaviy loyiha holati |
| **Deadline** | Haftalik lenta + oylik kalendar, kechikishlar, jamoa uchun alohida sanalar |
| **Friends** | Do'stlar, so'rovlar, klub a'zolarini topish, haftalik reyting, jamoalar musobaqasi, mentor–talaba juftliklari |
| **Ma'lumot** | Profil, yutuqlar (8 badge), sertifikatlar (chop etish mumkin), sozlamalar, aloqa |

### Admin / Mentor — 7 panel
**Dashboard** (KPI: faol talabalar, topshirish intizomi, tekshirish navbati, kechikkanlar) ·
**Talabalar** (filtrlar, profil, vazifa holati, eslatma) ·
**Vazifalar** (vazifa berish, tekshirish, baho + izoh, deadline o'zgartirish) ·
**Darslar** (dars/modul qo'shish va o'chirish) ·
**Jamoalar** (jamoa tuzish, a'zo qo'shish/ko'chirish, mentor juftlash) ·
**Deadline'lar** (kalendar, kechikkanlar, jamoa istisnolari) ·
**Statistika** (modul tugatish, retention, jamoa reytingi, CSV hisobot)

### Gamification (o'quvchini ushlab turish)
Kunlik streak 🔥 · XP va coin · 8 ta yutuq · haftalik reyting · jamoalar musobaqasi ·
Galereya (eng yaxshi ishlar) · mentor–talaba juftligi · Demo Day

---

## Ishga tushirish

```bash
# 1) shunchaki brauzerda ochish
open index.html           # yoki faylni brauzerga tashlang

# 2) manba fayllardan qayta yig'ish (src/*.js + style.css -> index.html)
npm run build
```

## Loyiha tuzilishi

```
ai-leaders/
├── index.html            # ← build natijasi: bitta mustaqil fayl (deploy uchun shu yetarli)
├── build.js              # src fayllarni index.html ga yig'adi
├── brand/                # original brend: logo-mark.svg, logo-full.svg
├── src/
│   ├── template.html     # HTML karkas + ikona sprite (68 ta original SVG ikona)
│   ├── style.css         # dizayn tizimi (dark + light, mobil-birinchi)
│   ├── app-1-core.js     # yordamchilar, o'quv dasturi, holat, hisob-kitoblar, shell, modallar
│   ├── app-2-student.js   # talaba sahifalari
│   ├── app-3-admin.js     # admin sahifalari
│   └── app-4-app.js       # auth, router, eventlar, qidiruv, CSV eksport
└── docs/ishga-tushirish-rejasi.md
```

## Texnik jihatlar
- **Tashqi kutubxona yo'q** — React/Vue/Tailwind ishlatilmagan, hammasi vanilla JS + CSS.
- **Ma'lumot** brauzer xotirasida (`localStorage`, kalit: `ai-leaders-platform-v1`) saqlanadi — demo uchun 18 talaba, 6 jamoa, 29 dars, 6 vazifa seed qilingan.
- **Demoni tiklash**: chap paneldagi ↻ tugmasi (yoki konsolda `localStorage.removeItem('ai-leaders-platform-v1')`).
- **Real backendga o'tish**: barcha ma'lumot `S` obyektida va `save()` orqali saqlanadi — Supabase/Firebase'ga ulash uchun faqat shu ikki joyni almashtirish kifoya.
- **Brend**: hexagon + "A" + yashil uchqun (o'z brendimiz); ranglar `#7C5CFF → #5B8CFF → #22D3EE`, aksent `#C6FF4F`.

## O'lchov ko'rsatkichlari (Statistika bo'limida)
Haftalik faol talabalar · o'z vaqtida topshirish % · modulni tugatganlar · loyihasini chiqarganlar · retention.
