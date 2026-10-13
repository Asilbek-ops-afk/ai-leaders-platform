# Sifat hisoboti — v1.2.0 (professional sayqal)

Bu hujjat platformani qayta ko'rikdan o'tkazishda **topilgan va tuzatilgan** barcha kamchiliklarni,
tekshiruv usullarini va natijalarni qayd etadi.

**Sana:** 2026-10-13 · **Versiya:** v1.2.0 · **Holat:** ✅ barcha tekshiruvlar o'tdi

---

## 1. Umumiy natija

| Ko'rsatkich | Natija |
|---|---|
| Funksional testlar (`npm test`) | **152 ta tekshiruv, 0 xato** (15 guruh) |
| Jonli sayt tekshiruvi (`node tools/tests/live.js`) | **18 tekshiruv, 0 xato** |
| Vizual QA (playwright, Chromium) | **28 ta skrinshot** — desktop, mobil, modallar, light tema |
| JS sintaksis (`npm run check`) | 4/4 fayl toza |
| Brauzer konsoli | Xatolarsiz (jsdom + Chromium) |
| Topilgan va tuzatilgan nuqsonlar | **23 ta** |

---

## 2. Topilgan va tuzatilgan nuqsonlar

### A. Ma'lumot / mantiq xatolari (12)
1. **"Jamoaviy topshirish" tugmasi hech narsa qilmasdi** → tarjimon funksiyasi va to'liq oqim yozildi
   (bir ish barcha a'zolar nomidan yuboriladi, bildirishnomalar ketadi, +25 XP).
2. **O'quvchi 0% da "Borish!" ko'rardi** — kurs progressi qulflangan darslarni ham hisobga olardi →
   foiz faqat ochilgan modullar bo'yicha hisoblanadi, izoh qo'shildi ("N modul ochilgan").
3. **Demo sanalari o'lik edi** (2026-09/10 da qotib qolgan) → barcha sanalar bugunga nisbatan siljitildi
   (`dayShift()`), shunda deadline'lar, kechikishlar va reyting har doim "tirik".
4. **Yon panel badge'i "1" deb qotib turardi** (talaba uchun) → haqiqiy hisob: topshirilmagan/kechikkan vazifalar.
5. **Kechikkan sanalar nofaol talabalarda "bugun faol" ko'rinardi** → `last` qiymatlari izchil qilindi.
6. **"E'tibor bering" bloki top-**ilmagan** vazifalarni ham ogohlantirardi** → faqat muddati o'tgan
   yoki qayta ishlashga qaytarilgan ishlar ko'rsatiladi.
7. **Qabul qilingan ish uchun "28 kun o'tib ketdi" qizil tegi** → endi "Muddatida topshirilgan /
   Kechikib topshirilgan" ko'rsatiladi (yuborilgan sana bo'yicha).
8. **Deadline jadvalida qabul qilingan ishlar "qizil"** → rang faqat haqiqiy kechikishga.
9. **Admin oqimida yangi topshiriqlar ro'yxat oxirida qolardi** → sana bo'yicha kamayish tartibida saralanadi.
10. **Onboarding "4 qadam" deb yozardi, aslida 5 ta edi** → matn qadamlardan avtomatik olinadi.
11. **Admin "Talabalar" sahifasida filtrlar global holatni buzardi** (`UI.taskFilter`) →
    alohida `studentsFilter`; filtr chiplari jamoalarga bo'lindi.
12. **Baholashdan keyin qayta baholash mumkin emas edi** → "Bahoni tahrirlash" modali (0–100, qaror, izoh).

### B. Interfeys / UX (6)
13. **Light temada teglar oqarib ko'rinmasdi** (kontrast) → barcha `.tag/.st/.streak` uchun alohida
    light palitrasi yozildi.
14. **Yon panelda "O'QUV" 4 marta takrorlanardi** → professional guruhlar: **Ta'lim / Jamoa / Ijtimoiy**
    (admin: Boshqaruv / Kontent / Tahlil).
15. **Deadline sahifasi "joriy hafta" o'rniga tasodifiy 9 kunni ko'rsatardi** → dushanbadan yakshanbagacha
    aniq haftalik lenta.
16. **"2 kun 14 soat qoldi" matni kattaroq edi, sanoq ko'rinmasdi** → kun / soat / daqiqa alohida kartalarda.
17. **Modalda fokus va klaviatura boshqaruvi yo'q edi** → fokus tuzog'i (Tab), avtomatik fokus,
    `Esc` bilan yopish (ilgari ham bor edi — endi fokus ham).
18. **Xavfli amallar tasdiqsiz bajarilardi** (o'chirish, progressni tiklash, reset) →
    `confirmModal()` — barcha o'chirish amallari tasdiq so'raydi.

### C. Funksional kamchiliklar → yangi imkoniyatlar (5)
19. **Darsda tekshiruv yo'q edi** → 3 ta interaktiv dars uchun **qisqa quiz** (3 savol, +15 XP).
20. **Kunlik topshiriqlar qo'lda belgilanardi** → dars tugatilganda, vazifa topshirilganda va devorga
    yozilganda questlar **avtomatik** bajariladi va bonus XP yoziladi.
21. **Fayl faqat nom bilan saqlanardi** → 900 KB gacha fayl **dataURL** sifatida saqlanadi va
    yuklab olish mumkin (`open-file`).
22. **Zaxira nusxa yo'q edi** → admin **Sozlamalar**: JSON zaxira (yuklab olish + tiklash), CSV hisobot,
    mentorlar va Galereya boshqaruvi, platforma ma'lumotlari.
23. **Talabaga amal yo'q edi** → jamoa almashtirish, progressni tiklash, klubdan chiqarish,
    eslatma yuborish.

### D. Texnik sayqal (qo'shimcha)
- **PWA**: `manifest.webmanifest` (maskable ikon, 3 yorliq) + `sw.js` (oflayn rejim, kesh strategiyasi).
- **SEO**: OG/Twitter kartochkalari, 1200×630 `og.png`, JSON-LD (`EducationalOrganization` + 6 kurs),
  canonical, `robots`.
- **A11y**: `aria-label`/`role="switch"`, skip-link, `prefers-reduced-motion`, `noscript` zaxirasi,
  Modalda `role="dialog" aria-modal`.
- **Barqarorlik**: render uchun **error boundary** (xato bo'lsa "Sahifani yangilash" taklif qiladi),
  buzilgan `localStorage`'dan tiklanish, eski versiya holatini migratsiya qilish.
- **Xavfsizlik**: `_headers` (nosniff, referrer-policy, permissions-policy, x-frame-options),
  `esc()` orqali XSS himoyasi, CSV/JSON'da `downloadBlob()` (xavfsiz).
- **Kod sifati**: `npm run check`, `npm test`, `npm run screens`, `npm run deploy` — hammasi skript sifatida.

---

## 3. Qanday tekshirildi

| Daraja | Vosita | Nima tekshiradi |
|---|---|---|
| 1. Sintaksis | `npm run check` | 4 manba fayl |
| 2. Funksional | `npm test` (jsdom) | 152 tekshiruv: kirish, rollar, 15 bo'lim, oqimlar (topshirish→tekshirish→baho), kalendar, eksport, PWA, xato holatlari |
| 3. Jonli | `node tools/tests/live.js` | 18 tekshiruv: HTTP, resurslar, sarlavhalar, manifest, SEO |
| 4. Vizual | `npm run screens` (playwright) | 28 skrinshot, light/dark, mobil/desktop, modallar |

Testlar **haqiqiy DOM**'da ishlaydi (jsdom) — ya'ni mahsulot kodining o'zi, mock emas.
Har bir tuzatishdan keyin to'liq to'plam qayta ishga tushirildi.

---

## 4. Ma'lum cheklovlar (demo rejim)

| Cheklov | Sabab | Yechim (rejada) |
|---|---|---|
| Ma'lumot faqat shu brauzerda | `localStorage` | `schema/supabase.sql` (19 jadval + RLS) |
| Fayl 900 KB gacha | localStorage kvotasi | Supabase Storage |
| Video darslar demo pleyer | kontent yuklanmagan | Storage + `<video>` |
| Parol yo'q | demo kirish | Supabase Auth (email/Telegram) |
| Telegram eslatmalar yo'q | bot ulanmagan | Telegram Bot API (21:00 standup) |

---

## 5. Natija

Platforma **production-ga tayyor demo** darajasida: barcha sahifalar ishlaydi, xato bermaydi,
PWA sifatida o'rnatiladi, oflayn ishlaydi, telefon va kompyuterda bir xil sifatli ko'rinadi,
ma'lumot zaxiralanadi va statistikalar eksport qilinadi.
Real ko'p foydalanuvchili rejimga o'tish uchun `schema/supabase.sql` ishga tushirilib,
`loadState()` / `save()` almashtiriladi — UI kodi o'zgarmaydi.

---

## Qo'shimcha: v1.3.0 — noutbuk rejimi (13-oktyabr)

**Vazifa:** mobil uchun moslangan saytni noutbuk/kompyuterdan ham to'liq va qulay ishlatish (telefon tajribasini buzmasdan).

### Qilingan ishlar

| # | Ish | Tafsilot |
|---|---|---|
| 1 | Keng ekran tuzilishi | ≥1500 px da kontent 1460 px, ≥1800 px da 1680 px, ≥2200 px da 1860 px gacha kengaydi; oraliqlar mutanosib |
| 2 | Asosiy ustun + yon panel | ≥1280 px da Bosh sahifa va tegishli sahifalar 2 ustunga bo'lindi (o'ng panel 372→420 px): jamoa, tez amallar, haftalik faollik, klub oqimi |
| 3 | Yig'iladigan yon panel | 80 px ikonka paneli; holat `localStorage`da saqlanadi (`settings.sidebarCollapsed`) |
| 4 | Buyruq paneli (Ctrl/⌘+K) | 54+ buyruq: bo'limlar, amallar, darslar, vazifalar, talabalar, jamoalar; ↑↓ va Enter bilan boshqariladi |
| 5 | Klaviatura yorliqlari | `/`, `Alt+1…8`, `N`, `T`, `?`, `Esc`; yozish maydonida yorliqlar bloklanadi; yordam oynasi sayt ichida |
| 6 | Saralanadigan jadvallar | Admin «Talabalar»: ism/jamoa/progress/baho ustunlari (▲▼ belgisi); telefonda «Saralash» tanlagichi (XP, streak ham) |
| 7 | Keng ekran to'rlari | ≥1400 px da vazifalar 2 ustun, modullar 3 ustun, galereya zichroq |
| 8 | Kompakt rejim | ≥1024 px va balandlik ≤850 px (masalan 1366×768) da oraliqlar avtomatik zichlashadi |
| 9 | «Yuqoriga» tugmasi | Sahifa 640 px dan ko'p aylantirilsa paydo bo'ladi (yumshoq ko'tarilish) |
| 10 | Karta fokus | Galereya kartalari `tabindex`/`role`/`aria-label` bilan — `Tab` bilan aylanib chiqish mumkin |

### Sifat nazorati (v1.3.0)

| Daraja | Natija |
|---|---|
| Sintaksis (`npm run check`) | ✔ 4 fayl toza |
| Funksional testlar (`npm test`) | ✔ **195 ta tekshiruv, 0 xato** (16-guruh: buyruq paneli, yorliqlar, yig'ish, saralash — 43 yangi tekshiruv) |
| Vizual QA (`npm run screens`) | ✔ **37 ta skrinshot**, shundan 10 tasi noutbuk (1920×1080, 1440×900, 1366×768) |
| Jonli sayt (`npm run test:live`) | ✔ 18 ta tekshiruv (deploydan keyin) |
| Telefon regressiyasi | ✔ mobil ko'rinishlar (6 ta skrinshot) va pastdagi navigatsiya o'zgarmagan |

### Ma'lum cheklovlar (o'zgarmagan)

- Ma'lumotlar hali ham `localStorage`da (demo) — ko'p qurilmali ishlash uchun Supabase'ga o'tish kerak.
- Mentor roli faqat ma'lumot sifatida (login yo'q) — bu ongli qaror, admin panel mentor ishini bajaradi.
- Buyruq paneli va klaviatura yorliqlari telefon ekranida ham ochiladi, lekin ular noutbuk uchun mo'ljallangan.

---

## v1.3.1 — kirish ekrani tuzatildi (regressiya)

**Shikoyat:** noutbukda kirish (login) qismi "sochilib ketgan" — forma siqilgan, bloklar kesilgan.

**Ikki sabab topildi va tuzatildi:**

| # | Sabab | Tuzatish |
|---|---|---|
| 1 | `#app` elementida doimiy `app` klassi bor edi: `display:grid; grid-template-columns: var(--nav-w) 1fr` (yon panel + kontent). Kirish ekranida `.auth` shu gridning **birinchi ustuni (268 px)** ichiga tushib qolardi — ≤980 px da bir ustunli qoida buni yashirgan, noutbukda esa hammasi siqilib ketgan. | Kirish rejimida `#app` ga `authscreen` klassi qo'shiladi: `.app.authscreen{display:block}`. Chiqishda/kirishda avtomatik almashinadi. |
| 2 | `.auth-art>*{position:relative}` qoidasi `.spark-orb{position:absolute}` ni **bosib ketgan** — 260 px va 200 px'lik dekorativ "yorug'lik sharlari" flex oqimiga tushib, kirish ekranini **~460 px ga cho'zib yuborgan** (natijada pastdagi bloklar viewport'dan chiqib ketgan va oraliqlar buzilgan). | `.auth-art>.spark-orb{position:absolute;z-index:0}` qoidasi qo'shildi (kaskadda keyin turadi). |

**Qo'shimcha yaxshilanishlar (noutbukda kirish ekrani bitta ekranga sig'adi):**
- `@media (min-width:1024px)`: matn 2 ustunli xususiyatlar to'riga o'tadi, sarlavha `clamp(23–32px)`, oraliqlar ixchamlashadi.
- `@media (min-width:1024px) and (max-height:820px)`: 1366×768 kabi ekranlarda statistika kartalari yashiriladi — balandlik 100% viewport ichida qoladi.
- `.auth-copy` / `.auth-stats` klasslari qo'shildi; `#app` grid tuzilishi kirish rejimida o'chadi.

**Tekshiruv natijasi:**

| Daraja | Natija |
|---|---|
| O'lchov (playwright) | 1920×1080 / 1440×900 / 1366×768 / 1024×800 — kontent viewport ichida, sahifa **bitta ekran**, kesilish yo'q |
| Funksional testlar | ✔ **209 ta tekshiruv, 0 xato** (17-guruh: kirish ekrani tuzilishi — 9 yangi tekshiruv, shu jumladan orb regressiya testi) |
| Skrinshotlar | 3 ta yangi kirish surati: `01-kirish-desktop` (1440), `01b-kirish-noutbuk-1920`, `01c-kirish-planshet-1024` |
| Telefon | O'zgarmagan (390 px: bir ustun, statistika 2×2) |
