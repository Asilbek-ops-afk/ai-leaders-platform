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
