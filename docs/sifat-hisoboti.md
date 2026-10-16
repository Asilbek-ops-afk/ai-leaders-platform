# Sifat hisoboti — AI Leaders platformasi

Bu hujjat platformani qayta ko'rikdan o'tkazishda **topilgan va tuzatilgan** barcha kamchiliklarni,
tekshiruv usullarini va natijalarni qayd etadi. Har bir versiya bo'limi o'sha paytdagi holatni saqlaydi;
**eng yangi holat — oxirgi bo'lim (v2.3.3)**.

**Oxirgi versiya:** v2.3.3 · **Holat:** ✅ barcha tekshiruvlar o'tdi (507 test + sahifa auditi, 175 joylashuv, 96 skrinshot, 4 ta yangi vosita)

| Bo'lim | Versiya | Mazmuni |
|---|---|---|
| [1–5](#1-umumiy-natija) | v1.2.0 | Professional sayqal: 23 nuqson, dizayn, PWA/SEO |
| v1.3.x | v1.3.0–1.3.2 | Noutbuk rejimi, buyruq paneli, dizayn sayqali |
| [v1.4.0](#v140--mvp-haqiqiy-akkaunt-tizimi) | v1.4.0 | Haqiqiy akkaunt tizimi: HEMIS ID + nick, parol, sessiya |
| [v1.4.1](#v141--mvpni-mukammal-qilish-ruxsatlar-parol-boshqaruvi-namunareal-ajratish) | v1.4.1 | Rollar/ruxsatlar, parol boshqaruvi, joylashuv auditi |
| [**v2.0.0**](#v200--keraksiz-narsalarni-ochirib-tashla-namuna-malumotlar-butunlay-olib-tashlandi) | **v2.0.0** | **Namuna ma'lumotlar butunlay olib tashlandi: bo'sh start + Founder yaratish** |
| [**v2.1.0**](#v210--haqiqiy-talabalar-royxatini-yuklash-csv-import) | **v2.1.0** | **CSV import: haqiqiy talabalar ro'yxatini platformada yuklash + bo'sh tuzilmalar mustahkamligi** |
| [**v2.2.0**](#v220--landing-sahifa-va-skrollda-ochiladigan-kirishariza) | **v2.2.0** | **Landing sahifa + skrollda 3D ochiladigan kirish/ariza bo'limi & ariza oqimi** |
| [**v2.2.1**](#v221--kirish-faqat-nick-bilan-hemis-id-kirishda-ishlatilmaydi) | **v2.2.1** | **Kirish faqat nick bilan: HEMIS ID — adminga, talabaga unikal nick (1 HEMIS = 1 nick)** |
| [**v2.3.0**](#v230--dizayn-sayqali-professional-polish) | **v2.3.0** | **Dizayn sayqali: ikonkalar (emoji o'rniga), parol ko'zi, bosmaga tayyor kartochka, skrol-spy, mikro-animatsiya, laptop zichligi** |
| [**v2.3.1**](#v231--ichki-bolimlar-auditi-va-avtomatik-ui-tekshiruvi) | **v2.3.1** | **Ichki bo'limlar auditi + avtomatik UI tekshiruvi (`npm run test:ui`): KPI siljishi, matn kesilishi, gorizontal toshish** |
| [**v2.3.2**](#v232--kontrast-aa-auditi-va-faollik-taqsimoti) | **v2.3.2** | **WCAG AA kontrast auditi (ikkala mavzu), yorug' mavzu rang tuzatishlari, haqiqiy «Faollik taqsimoti» (o'ylab topilgan egri chiziq o'rniga)** |
| [**v2.3.3**](#v233--katta-klub-unumdorligi-bosma-va-ornatilgan-ilova) | **v2.3.3** | **200+ talabada unumdorlik (indeks + kesh), bosmada orqa sahifa tushib qolishi tuzatildi, o'rnatilgan ilova (safe-area) rejimi, 3 yangi vosita: `test:scale`, `test:print`, `test:standalone`** |

---

## 1. Umumiy natija

| Ko'rsatkich | Natija |
|---|---|
| Funksional testlar (`npm test`, v1.2.0 paytida) | **152 ta tekshiruv, 0 xato** (15 guruh) — hozirgi holat: **349 ta** |
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

---

## v1.3.2 — dizayn sayqali (noutbuk)

Foydalanuvchi izohi: «Hammasi yaxshi, faqat dizayn ustida ozroq ishlash kerak». Shu asosda noutbuk ko'rinishida
dizayn ritmi va izchillik yaxshilandi:

| # | Yaxshilanish | Tafsilot |
|---|---|---|
| 1 | **Kirish ekrani kompozitsiyasi** | Logo yuqorida, matn bloki vertikal markazda (avval pastga yopishib, tepada ~250 px bo'shliq qolardi). Mantiqiy ritm: brend → sarlavha → xususiyatlar → statistika |
| 2 | **Brend qatori** | `.auth-brand` klassi — keng ekranda logo satr sifatida mustahkam turadi, matn esa markazda |
| 3 | **Juftlik ritmi** | 4 ta xususiyat endi 1-ustunda 3 qator, 2-ustunda aniq juftlik bilan tekislanadi (avval 2/2/2/2 tarqoq edi) |
| 4 | **Statistika kartalari** | 1920×1080 va 1440×900 da «18 talaba · 6 jamoa · 29 dars · 4 loyiha» to'rtta karta; 1366×768 va pastida ixcham qatorga aylanadi (nazorat nuqtasiz, faqat media so'rov) |
| 5 | **Sahifa pastidagi panel** (yangi) | `contentFoot()` — brend, tezkor havolalar, versiya va «Yorliqlar» tugmasi. Qisqa sahifalarda (Friends, modul, Ma'lumot) pastdagi bo'shliqni to'ldiradi, uzun sahifalarda kontent oxirida chiqadi. Telefonda yashirilgan (`display:none` < 981 px) |
| 6 | **Admin dashboard** | «Haftalik topshirish faolligi» kartasi `.stretch` bilan ustun balandligiga cho'ziladi — yonidagi «Haftalik Top 5» bilan tenglashadi (avval yarim bo'sh qolardi) |
| 7 | **Yuqori panel** | O'ng chetda qo'shimcha nafas (22 px), tugmalar orasi 9 px — vizual ritm izchil |
| 8 | **Qidiruv maydoni** | Fokus halqasi (`.searchbar:focus-within`) va hover holati qo'shildi — noutbukda sichqoncha bilan ishlash sezgir |
| 9 | **Yon panel sarlavhalari** | Bo'lim sarlavhalari orasi kengaytirildi (18 px), birinchi sarlavha tepaga yaqinlashtirildi |
| 10 | **Xususiyat ikonkalari** | `.feat-ic` klassi + yumshoq hover (ko'tarilish va yorqinlashuv) |

**Tekshiruv:** `npm test` → **219 ta tekshiruv, 0 xato** (18-guruh: pastki panel va dizayn izchilligi — 10 yangi tekshiruv),
39 ta skrinshot qayta olindi.

---

## v1.4.0 — MVP: HEMIS ID + unikal nick akkaunt tizimi

Foydalanuvchi aniqlashtirdi: platforma **demo emas, MVP** bo'lishi kerak. Shu asosda haqiqiy akkaunt tizimi qurildi.

### Nima yaratildi

| # | Qism | Tafsilot |
|---|---|---|
| 1 | **Akkaunt qatlami** | `accounts[]` + `session`; har akkauntda: nick, ism, HEMIS ID, telefon, rol, holat, parol heshi, oxirgi kirish |
| 2 | **HEMIS ID tekshiruvi** | Aynan **12 xona raqam**; bir xil HEMIS ikkinchi marta kiritilmaydi; telefon takrori ham tekshiriladi |
| 3 | **Unikal nick generatori** | ~200 inglizcha so'zdan (`falcon`, `onyx`, `comet`...) tasodifiy tanlanadi, band bo'lsa keyingisiga o'tadi; 25 namuna akkauntga avtomatik berilgan |
| 4 | **Birinchi kirish oqimi** | Parolsiz kirilgan akkaunt "Parolni o'rnatamiz" bosqichiga o'tadi (2 maydon + mos kelish tekshiruvi) |
| 5 | **Parol xavfsizligi** | Parol hesh sifatida saqlanadi (ochiq matn emas), heshda nick "tuz" vazifasini bajaradi; 4 belgidan qisqa parol qabul qilinmaydi |
| 6 | **Login formasi** | Talaba: **HEMIS ID yoki nick**; Admin: **email**. Yagona `authLookup()` uch xil usulni ham taniydi |
| 7 | **Sessiya** | Kirgandan keyin `session` saqlanadi → sahifa yangilanganda qayta parol so'ralmaydi; paroli o'rnatilmagan akkauntda sessiya tiklanmaydi (xavfsizlik) |
| 8 | **Adminlar bo'limi** (yangi) | 7 admin seed: Founder, Bosh mentor, 2 Mentor, Kontent menejer, Kurator; KPI kartalar, jadval, qo'shish/tahrirlash/bloklash/o'chirish; **faqat Founder** ko'radi |
| 9 | **Ruxsatlar modeli** | 7 ruxsat turi (`students`, `tasks`, `content`, `groups`, `stats`, `settings`, `admins`); founder avtomatik `__all` |
| 10 | **Kirish kartochkasi** | Nick + HEMIS ID + parol qoidasi; chop etish/PDF va nusxalash; talaba va admin uchun alohida ko'rinish |
| 11 | **Yordam oynasi** | "Kirish bo'yicha yordam": talaba/admin qanday kiradi, parolni unutganda nima qilish, birinchi kirish |
| 12 | **Namuna rejimi ajratildi** | Demo akkauntlar `demo: true` belgisi bilan; faqat shularda "Tez kirish" va rol almashtirish tugmasi ko'rinadi; versiya qatorida "namuna rejimi" yozuvi |

### Tekshiruv natijalari

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **261 ta, 0 xato** (19-guruh: akkaunt tizimi — 35 yangi tekshiruv) |
| Haqiqiy brauzer sinovi | ✔ `falcon` → parol o'rnatish → talaba kabineti; xato nick/parol xabarlari; admin qo'shish → kartochka |
| Skrinshotlar | 7 ta yangi: kirish (talaba/admin), birinchi kirish, mobil, Adminlar bo'limi, tahrirlash, talaba qo'shish |
| Migratsiya | ✔ Eski `localStorage` holati buzilmaydi — akkauntlar avtomatik ulanadi |

### Keyingi qadam (baza)

`docs/mvp-reja.md` dagi 7 bosqichli reja kuchida: Supabase kalitlari kiritilishi bilan bir xil interfeys
haqiqiy bazada ishlay boshlaydi (19 jadval, 26 RLS siyosat, storage tayyor).

---

## v1.4.1 — MVP'ni "mukammal" qilish: ruxsatlar, parol boshqaruvi, namuna/real ajratish

Foydalanuvchi: *"hozircha adminlar uchun namunaviy hisob yarat, keyinchalik ularning ma'lumotlarini beraman — hozir esa menga 1-chi MVP'ni perfect qilib ber."*
Shu asosda MVP to'liq ishlaydigan holatga keltirildi: har bir admin **faqat o'z bo'limini** ko'radi,
parolni o'zi almashtiradi, admin esa talabaning parolini tiklaydi, namuna va real ma'lumot aralashmaydi.

### A. Topilgan va tuzatilgan nuqsonlar (4 ta)

| # | Muammo | Sabab va tuzatish |
|---|---|---|
| 1 | **Barcha KPI kartalari raqamsiz ko'rinardi** (talaba va admin bosh sahifasida) | `app-3-admin.js` ichida `kpi()` funksiyasi **ikkinchi marta** e'lon qilinib, `app-1-core.js` dagi to'g'ri versiyani bosib ketgan edi (nom shadowing): kartada raqam o'rniga sarlavha, yonida `r`/`a`/`c` harflari chiqardi. Takroriy funksiya o'chirildi + **takroriy nomlarni topadigan statik test** qo'shildi |
| 2 | **`reset()` har chaqiriqda namunaviy bazani shishirardi** | `blankState()` massivlarni **havola** bilan berardi (`students: STUDENTS`), reset esa haqiqiy talabani o'sha umumiy massivga qo'shardi → keyingi resetda 19/20/21 talaba. Endi barcha seed massivlari **chuqur nusxa** (deep copy) |
| 3 | **"Yaxshi kun, Bekzod" — boshqa admin kirganda ham founder ismi** | Sarlavha qotib yozilgan edi → endi sessiyadagi adminning ismi + **rol va huquqlar qatori** (masalan `Mentor • Huquqlar: Talabalar, Vazifalar`) |
| 4 | **Namuna akkaunt bilan kirilganda namuna paneli ochiq qolardi** | `finishLogin()` modalni yopmasdi → endi har kirishda panellar yopiladi |

### B. Joylashuv (layout) tekshiruvi — 7 o'lcham × 17 sahifa

Maxsus vosita yozildi: `npm run test:layout` (`tools/tests/layout.js`, playwright) — **7 o'lchamda
(390×844, 768×1024, 1024×800, 1366×768, 1568×768, 1440×900, 1920×1080) 14 sahifani** ochib,
gorizontal toshishni (overflow) o'lchaydi. Topilgan va tuzatilgan 3 ta turdagi nuqson:

| # | Muammo | Sabab va tuzatish |
|---|---|---|
| 5 | **Admin dashboardida KPI raqamlari yo'q** | `app-3-admin.js` da `kpi()` ikkinchi marta e'lon qilinib, asosiy funksiyani bosib ketgan — takroriy e'lon o'chirildi, **statik test** qo'shildi (bunday xato qaytmasin) |
| 6 | **Foydalanuvchi noutbuklarida (1366–1568) talaba bosh sahifasi yon ustuni 15–19 px tashqariga chiqardi** | Yon ustun kartalari `min-width` bilan qisqarmasdi → `.card{min-width:0}`, `.card>*{min-width:0}`, `.card-h{flex-wrap:wrap}` va `.wide-split` uchun aniq `minmax(0,1fr)` ustun |
| 7 | **Telefonda admin panel yuqori paneli 38 px toshardi** | Topbar'dagi «Sozlamalar» tugmasi mobil uchun yashirilmagan + qidiruv maydoni `min-width:180px` bilan qotib qolgan → `.hide-sm` va ixcham mobil topbar |
| 8 | **Telefonda «Haftalik lenta» 7 kun siqilib o'qilmas holga kelardi** | Inline uslub o'rniga `.strip7` klassi: telefonda yonma-yon skroll (har kun ≥86 px) |

### C. Nima qo'shildi

| # | Qism | Tafsilot |
|---|---|---|
| 1 | **Bo'lim ruxsatlari** | `canView(route)` + yon panelda **qulflangan band** (qulf ikoni, `title="ruxsat yo'q"`), mobil pastki navigatsiya ham filtrlangan |
| 2 | **Ruxsat sahifasi** | Ruxsati yo'q bo'lim ochilsa: "«Statistika» bo'limi sizga yopiq", sizning rolingiz, kerakli huquq, kim beradi (Founder email) + **«Ruxsat so'rash»** tugmasi |
| 3 | **Amal darajasidagi ruxsat** | `ACT_PERM` jadvali: 30+ amal (talaba qo'shish, vazifa/dars yaratish, jamoa boshqarish, eksport, o'chirish...) bo'lim ruxsatiga bog'landi; forma yuborishda ham tekshiriladi (2 qavatli himoya) |
| 4 | **Dashboard shaxsiylashtirildi** | Faqat ruxsatli tez amallar ko'rinadi (mentor "Dars qo'shish"ni ko'rmaydi) + rol/huquq chipi |
| 5 | **Parolni almashtirish** | Yon paneldagi qulf tugmasi / `Ctrl+K` buyrug'i: hozirgi parol tekshiriladi (paroli bo'lsa), yangi parol + takror maydoni, «kamida 4 belgi» qoidasi |
| 6 | **Parolni tiklash (admin)** | Talaba profilida: nick/HEMIS/holati ko'rinadi, **«Parolni tiklash»** → parol nolga tushadi va talaba keyingi kirishda o'zi yangisini o'rnatadi (eski parol hech kimga ko'rinmaydi); **«Kirish kartochkasi»** qayta chiqariladi |
| 7 | **Namuna paneli** | Kirish ekranidagi **«Barcha namunalar (25)»** va admin buyruq panelidagi yozuv: 7 admin (rollari bilan) + 18 talaba, bir bosishda kirish |
| 8 | **Namuna/real ajratish** | `reset()` endi **haqiqiy akkauntlar, ularning profillari va do'stlik ro'yxatlarini saqlab qoladi**, namuna bazani tiklaydi va nechta akkaunt saqlangani haqida xabar beradi |
| 9 | **Yangi skrinshotlar** | 15 ta yangi surat: namuna paneli, qulflangan menyu, ruxsat sahifasi, parol oynasi, mobil/planshet/noutbuk o'lchamlari, light tema |
| 10 | **Kichik sayqal** | Yon paneldagi foydalanuvchi qatori bir satrda (ism/rol ellipsis), takroriy mavzu tugmasi olib tashlandi |

### Tekshiruv natijalari

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **310 ta, 0 xato** (20-guruh: ruxsatlar, parol, namuna paneli, reset — 49 yangi tekshiruv) |
| Joylashuv testi | ✔ **`npm run test:layout` — 7 o'lcham × 14 sahifa, 98 tekshiruv, 0 toshish** |
| Statik himoya | ✔ Takroriy funksiya nomlarini topadigan test (shadowing xatosi qaytmasin) |
| O'lchamlar | ✔ 1920×1080, 1568×768 (foydalanuvchi noutbuki), 1440×900, 1366×768, 1024×800, 768×1024, 390×844 — qo'lda tekshiruv: 7 o'lcham × 17 sahifa, hammasi 0 toshish |
| Rollar sinovi | ✔ Founder/mentor/kontent/kurator: ko'rinadigan bo'limlar, bloklangan amallar, qulflar |
| Parol oqimi | ✔ Eski parol tekshiruvi, qisqa parol rad etilishi, mos kelmagan takror, tiklashdan keyin birinchi kirish |

### Foydalanish (namuna rejimi — v1.4.1 holati)

> **Diqqat:** v2.0.0 da namuna ma'lumotlar butunlay olib tashlandi (quyiga qarang). Quyidagi jadval
> faqat tarixiy ma'lumot — bu hisoblar endi platformada yo'q, ular `tools/tests/fixtures.js` ichida test uchun saqlanadi.

| Rol | Kirish | Ko'radigan bo'limlari |
|---|---|---|
| Founder | `bekzod` yoki bekzod@aileaders.uz | hammasi + Adminlar |
| Bosh mentor | `malika` | Talabalar, Vazifalar, Statistika |
| Mentor | `sardor`, `nigora`, `dilnoza` | Talabalar, Vazifalar (+ Nigora: Darslar) |
| Kontent menejer | `zuhra` | Darslar, Talabalar |
| Kurator | `timur` | Talabalar, Statistika, Jamoalar |
| Talabalar | `falcon`, `onyx`, `comet`, … (18 ta) | talaba kabineti |

**Keyingi qadam:** foydalanuvchi haqiqiy talabalar bazasini va admin ma'lumotlarini yuborishi bilan
`npm run import <fayl.csv>` → namuna yozuvlar olib tashlanadi → kirish kartochkalari tarqatiladi
(`docs/mvp-reja.md` §8 dagi 7 bosqich).

---

## v2.0.0 — «Keraksiz narsalarni o'chirib tashla»: namuna ma'lumotlar butunlay olib tashlandi

Foydalanuvchi so'rovi: *"Keraksiz narsalarni ochirib tashla"* → aniqlashtiruvchi savolga javob:
**«Namuna ma'lumotlarni BUTUNLAY»** (18 namuna talaba + 7 namuna admin). Ya'ni platforma **bo'sh holatda**
ishga tushadi, real talabalar keyin `npm run import` bilan yuklanadi, adminlar esa platformadan qo'shiladi.

### Nima qilindi

| # | O'zgarish | Tafsilot |
|---|---|---|
| 1 | **Namuna ma'lumot manbadan chiqarildi** | `src/app-1-core.js` ichidagi 18 talaba, 7 admin, 6 jamoa, 3 mentor, 6 vazifa, 38 topshiriq, devorlar, galereya — hammasi `tools/tests/fixtures.js` ga ko'chirildi (faqat test uchun). Manba kodda birorta namuna ism/email qolmadi |
| 2 | **Bo'sh holat (`blankState`)** | Platforma `students: []`, `tasks: []`, `groups: []`, `accounts: []` bilan boshlanadi; o'quv dasturi (6 modul / 29 dars), yutuqlar va questlar ta'riflari saqlanadi |
| 3 | **Birinchi ishga tushirish ekrani** | Akkaunt yo'q bo'lsa `needsSetup()` → «Birinchi ishga tushirish → **Founder akkauntini yaratamiz**»: ism (≥3 belgi), email, parol (≥4 belgi, takrori bilan), unikal nick avtomatik beriladi. Founder = `adminRole: 'founder'`, `perms: ['__all']` |
| 4 | **Migratsiya (eski brauzerlar)** | Ilgari ochilgan `localStorage` holatida `meta.demoPurged` belgisi bo'lmasa — `purgeDemoState()` ishlaydi: namuna yozuvlar o'chadi, **haqiqiy** (demo bo'lmagan) akkauntlar va ularning profillari saqlanadi, mavzu va sozlamalar ko'chiriladi, holat darhol qayta yoziladi |
| 5 | **Reset semantikasi o'zgardi** | «Barcha ma'lumotni o'chirish (noldan boshlash)»: talabalar, jamoalar, vazifalar, akkauntlar — hammasi o'chadi va Founder ekrani qaytadi (avvalgi «namunani tiklash» o'rniga) |
| 6 | **Namuna rejimi qoldiqlari olib tashlandi** | `sampleModal` (25 akkaunt paneli), kirish ekranidagi tez kirish tugmalari, topbar'dagi rol almashtirgich, versiya qatoridagi «namuna rejimi» yozuvi, buyruq panelidagi namuna yozuvi — hammasi o'chirildi |
| 7 | **Bo'sh holat dizayni** | Admin dashboardda **«Boshlash — 4 qadam»** yo'riqnomasi (talaba → jamoa → vazifa/deadline → admin), bo'limlarda tushunarli bo'sh holat kartalari (Talabalar, Vazifalar, Jamoalar, Deadline, Statistika, talaba tomonida Vazifalar/Deadline/Team/Friends) |
| 8 | **Statik qo'riqchi (yangi test guruhi)** | `21. Statik qo'riqchi`: manba kodda namuna ism/email/o'zgaruvchilar (`ADMIN_SEED`, `DEMO_NICKS`, `buildAccounts`, `demo:true`) yo'qligini, bo'sh `blankState`, versiya izchilligi (`src` = `sw.js` = `package.json`) va qurilgan `index.html` tozaligini tekshiradi |

### Yo'l-yo'lakay topilgan va tuzatilgan xatolar

| # | Muammo | Tuzatish |
|---|---|---|
| 1 | Bo'sh holatda `vStats()` `h` o'zgaruvchisiga e'londan oldin murojaat qilardi (TDZ) — Statistika bo'limi yiqilardi | Bo'sh holat tekshiruvi `let h = …` dan keyinga ko'chirildi; testlar barcha bo'limlarni bo'sh holatda aylanib chiqadi |
| 2 | `kpisAdmin()`/`activityPct()` bo'sh bazada `NaN` qaytarardi | Bo'luvchi nolga tekshiriladi (`avg`, `activityPct`, modul foizlari, statistika foizlari) |
| 3 | Haftalik faollik grafigi bo'sh bo'lganda `NaN` balandlik berardi | `weeklyData()`: saqlangan haftalik ma'lumot bo'lmasa, talabalar XP'sidan hisoblanadi (0 bo'lsa — 0) |
| 4 | Sertifikat va ruxsat kartasida qattiq yozilgan ism/email («Bekzod Aliyev», «bekzod@aileaders.uz») qolgan edi | Endi `founderAcc()` dan olinadi: imzo — haqiqiy Founder, ruxsat kartasi — haqiqiy Founder emaili |
| 5 | Yopiq dars qatori `data-act="noop"` yuborardi, `case 'noop'` olib tashlangach hech narsa bo'lmasdi | Yopiq dars `data-act="locked"` → «Dars yopiq: oldingi modul vazifasi qabul qilingach ochiladi» xabari; admin buyruq panelidagi dars/vazifa yozuvlari ham to'g'ri ishlaydi |
| 6 | Bo'sh platformada «jamoalar yetakchisi» va «haftalik g'olib» kartalari yiqilardi | `topGroup()` (bo'sh bo'lsa `null`) + «jamoa yo'q»/«talabalar qo'shilgach reyting boshlanadi» matnlari |
| 7 | Tozalash har yuklanishda qayta hisoblanardi | `loadState()` tozalangan holatni darhol `localStorage`ga yozadi |
| 8 | Test/tasvir to'plamlari olib tashlangan namuna tugmalariga tayanardi | `run.js`/`screens.js`/`layout.js` fixtura (`tools/tests/fixtures.js`) bilan ishlaydi: sessiya va holat to'g'ridan-to'g'ri `localStorage`ga seed qilinadi |

### Tekshiruv natijalari (v2.0.0)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **349 ta, 0 xato** — 21 guruh (yangi: `0. Bo'sh platforma va Founder`, `0b. Migratsiya`, `21. Statik qo'riqchi`) |
| Joylashuv testi | ✔ **`npm run test:layout` — 7 o'lcham × 17 sahifa (7 admin + 7 talaba + 3 bo'sh platforma), 119 tekshiruv, 0 toshish** |
| Skrinshotlar | ✔ **65 ta surat (75 qadam)** — bo'sh platforma holatlari: birinchi sozlash (1920/1568/1024), Founder dashboardi, bo'sh bo'limlar, mobil |
| O'lchamlar | ✔ 1920×1080, 1568×768 (foydalanuvchi noutbuki), 1440×900, 1366×768, 1024×800, 768×1024, 390×844 |
| Migratsiya sinovi | ✔ Eski holat (18 talaba + 7 admin) yuklanganda hammasi o'chadi, haqiqiy akkaunt/profil saqlanadi, Founder ekrani chiqadi |
| Bo'sh holat sinovi | ✔ Barcha 9 admin bo'limi va barcha talaba bo'limlari bo'sh bazada xatosiz chiziladi (`NaN`/`undefined` yo'q) |

### Fayllar

| Fayl | O'zgarish |
|---|---|
| `tools/tests/fixtures.js` | **Yangi** — `demoState()`, `withSession(accId)`, `emptyState()`, `FIXTURE_VERSION` (namuna ma'lumot faqat shu yerda) |
| `src/app-1-core.js` | Bo'sh `blankState()`, `purgeDemoState()`, `needsSetup()`, `createFounderAccount()`, `founderAcc()`, `weeklyData()`, `emptyCard()`, `topGroup()`; namuna seedlari va `sampleModal` olib tashlandi |
| `src/app-2-student.js` | Bo'sh holat kartalari (Vazifalar, Deadline, Team, Friends), faollik lentasi bo'sh holati |
| `src/app-3-admin.js` | «Boshlash — 4 qadam» yo'riqnomasi, bo'limlar bo'sh holatlari, bo'sh bazada `NaN`siz hisoblar, dinamik Founder emaili |
| `src/app-4-app.js` | «Birinchi ishga tushirish» ekrani + forması, `data-form="setup-founder"` oqimi, namuna amallari/`login()` olib tashlandi |
| `tools/tests/run.js`, `screens.js`, `layout.js` | Fixtura bilan seed qilinadi; namuna paneli testlari → bo'sh holat + migratsiya + statik qo'riqchi testlariga almashtirildi |
| `README.md`, `docs/mvp-reja.md`, `docs/talabalar-shabloni.csv` | Hujjatlar yangilandi; shablondan NAMUNA qatorlar olib tashlandi (import vositasi `#` izohlarni o'qiydi) |

---

## v2.1.0 — Haqiqiy talabalar ro'yxatini yuklash (CSV import)

**Vazifa:** «real talabalar bazasi kiritilishi kerak — har oqim uchun kod o'zgartirib qayta deploy qilmasdan».

### Nima qo'shildi

| # | O'zgarish | Tafsilot |
|---|---|---|
| 1 | **CSV import oqimi (admin)** | Admin → Talabalar → «CSV import» → fayl tanlash → **hisobot** (qabul / ogohlantirish / xato) → tasdiqlash → talabalar + akkauntlar + jamoalar avtomatik yaratiladi |
| 2 | **Kirish kartochkalari** | Import tugagach har bir talabaning nick + HEMIS ID kartochkasi ro'yxati chiqadi, «Chop etish / PDF» bilan tarqatiladi |
| 3 | **Ustunlarni tanish** | Sarlavhalar har xil yozilishda taniladi: `ism_familiya`/`f.i.sh`/`name`, `hemis_id`/`HEMIS ID`, `telefon`, `jamoa`/`guruh`, `telegram`, `maqsad`; ajratuvchi `,` / `;` / tab; `#` izoh qatorlari o'qiladi |
| 4 | **Tekshiruv** | 12 xonali HEMIS, takrorlangan HEMIS (fayl ichida va bazada), qisqa ism — xato sifatida o'tkazib yuboriladi; telefonsiz/jamoasiz qatorlar — ogohlantirish |
| 5 | **Jamoalar** | Jamoa nomi yangi bo'lsa avtomatik yaratiladi; mavjudi bo'lsa talaba o'sha jamoaga qo'shiladi |
| 6 | **Bitta kod yo'li** | Bitta talaba qo'shish ham, CSV import ham `addStudentRecord()` ishlatadi — mantiq takrorlanmaydi |
| 7 | **Yetim ssilkalar tozalanadi** | `pruneOrphans()`: o'chirilgan talaba jamoa a'zoligidan, do'stlar/bildirishnomalar/topshiriqlardan ham chiqadi (`loadState()` da har ochilishda) |
| 8 | **Importni bekor qilish (undo)** | Xato fayl yuklansa — yakuniy oynada yoki Talabalar sahifasida «Importni bekor qilish»: faqat shu import yaratgan talaba + akkaunt + jamoa o'chadi, keyin qo'lda qo'shilganlar tegilmaydi (import akkauntlari `imp` belgisi bilan saqlanadi) |
| 9 | **Qolgan hardkodlar olib tashlandi** | `S.tasks[2]` (jamoalar sahifasi, jamoa oynasi) → `projTasks()`/oxirgi vazifa; vazifa hali berilmagan bo'lsa: «Jamoaviy vazifa hali berilmagan», deadline «—» |

### Nima tuzatildi

1. **Jamoalar bo'limi vazifasiz holatda yiqilardi** — `S.tasks[2].id` (`undefined`) o'qilishi; endi vazifa bo'lmasa 0% va xatosiz.
2. **Jamoa oynasi (`group-open`) 3 tadan kam vazifa bo'lsa yiqilardi** — `task.title` himoyasiz edi; endi «Jamoaviy vazifa hali berilmagan».
3. **Jamoalar sahifasida bo'sh a'zo ro'yxatida `NaN`** — 0 ga bo'lish himoyalandi.
4. **`teamScore` hisobi** bo'sh jamoalarda `NaN` berardi — `Math.max(1, …)`.

### Tekshiruv natijalari (v2.1.0)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **394 ta, 0 xato** — 23 guruh (yangi: `22. CSV import` — import, hisobot, undo; `23. Bo'sh tuzilmalar va yetim a'zolar`; avtomatik yangilanish qo'riqchilari) |
| Joylashuv testi | ✔ **119 tekshiruv, 0 toshish** (7 o'lcham, 17 sahifa) |
| Skrinshotlar | ✔ **68 ta surat (78 qadam)** — yangi: `76-v2-csv-import`, `77-v2-import-yakunlandi`, `78-v2-undo-tugmasi` (1568×768) |
| To'liq real oqim (Playwright) | ✔ Bo'sh platforma → Founder → CSV import (4 talaba, 2 jamoa) → vazifa → talaba kirishi (parol o'rnatish) → topshirish → baholash (92, +125 XP) → statistika: **0 JS xatosi** |
| Import + undo oqimi (Playwright) | ✔ import (3 talaba) → undo (toza baza) → qayta import (4 talaba) → vazifa → topshirish → baholash (90, +125 XP): **0 JS xatosi** |
| Chekka holatlar (Playwright) | ✔ Vazifasiz jamoa, o'chirilgan talaba, yakka talaba, bo'sh statistika — yiqilish/`NaN` yo'q, 0 JS xatosi |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.1.0** |
| Jonli sayt (Playwright, `ai-leaders-platform.pages.dev`) | ✔ Demo ekran **yo'q**, Founder sozlash ekrani bor → Founder yaratish → CSV import (3 talaba, 2 jamoa, kartochkalar) → undo tugmasi → talaba birinchi kirishi (parol o'rnatish) → kabinet → yangilashdan keyin sessiya saqlanadi: **0 JS xatosi** |
| Jonli testlar | ✔ `TEST_URL=… npm test` → **394/0**, `node tools/tests/live.js` → **18 ✓**, `TEST_URL=… npm run test:layout` → **119/0** |

### Kesh yangilanishi (muhim)

Ilgari foydalanuvchi eski (demo) versiyani ko'rishda davom etishi mumkin edi. Sabab: eski
deploy havolalari (`3ab2e015…` = v1.4.0) o'sha kungi versiyada muzlab qoladi va asosiy
havola o'zgarmaydi. Yechim: **service worker `controllerchange` → avtomatik reload**
(«Yangi versiya o'rnatildi» xabari) + har 30 daqiqada `registration.update()`; testlar
`sw.js` kesh nomi versiyaga bog'langanligini va `_headers` kesh siyosatini
(`index.html` → `must-revalidate`, `sw.js` → `no-cache`) har safar tekshiradi.

---

## v2.2.0 — Landing sahifa va skrollda ochiladigan kirish/ariza

**Talab:** «sahifani landing page qilish kerak, skroldan keyin kreativroq usulda login/register qismi chiqishi kerak».

### Nima qo'shildi

| # | O'zgarish | Tafsilot |
|---|---|---|
| 1 | **Landing sahifa** | Yopishqoq navigatsiya (fon skrolda shishadi) + o'qish progressi (yuqorida gradient chiziq). Bo'limlar: hero → «Klub nima beradi» (6 karta) → 4 qadamli jarayon → o'quv dasturi (bazadagi modullar + gamification) → savol-javob (5 akkordeon) → kirish/ariza → sayt pasti |
| 2 | **Hero** | Katta sarlavha (gradient urg'u bilan), tavsif, 2 CTA, 4 ko'rsatkich (modul/dars/baholash/yutuq), suzuvchi «+120 XP / 7 kun streak / Nova jamoasi» kartochkalari, orblar va to'r fon, «pastga suring» ko'rsatkichi |
| 3 | **Kreativ ochilish** | Kirish bo'limiga skrollda: tepadan yorug'lik chizig'i tushadi, fon porlaydi, **karta 3D burilib ochiladi** (perspective(1400px) rotateX(17°) → 0), chetida yashil yorug'lik yugurishi, maydonlar ketma-ket chiqadi. `IntersectionObserver`; yo'q muhitda darhol ko'rinadi |
| 4 | **Uch tab** | **Talaba** (nick/HEMIS ID), **Admin / Mentor** (email), **Ariza** (yangi). Tab almashganda skrol o'rni saqlanadi, xatolar landingda ko'rsatiladi |
| 5 | **Ariza oqimi** | Ariza formasi (ism, telefon, telegram, maqsad) → rahmat ekrani → **Admin → Talabalar → «Yangi arizalar (N)»** → «Talaba qilish» bosilganda forma ariza ma'lumotlari bilan to'ldiriladi (faqat HEMIS ID kiritiladi) → kirish kartochkasi. Dashboard ham «N ta yangi ariza keldi» deb ogohlantiradi |
| 6 | **Ariza tekshiruvlari** | Ism ≥3 belgi, telefon ≥9 raqam (rakamlarga normallashtiriladi), takroriy raqam bloklanadi («allaqachon yuborilgan»). Xato berganda kiritilgan qiymatlar yo'qolmaydi (`UI.leadDraft`) |
| 7 | **Telefon formati** | Ariza kartasida va formasida raqam o'qiladigan ko'rinishda: `998901112233` → `+998 90 111 22 33` (`fmtPhone()`) |

### Nima tuzatildi

1. **Ariza xatosi maydonlarni tozalar edi** — foydalanuvchi hammasini qaytadan yozishi kerak bo'lardi; endi qoralama saqlanadi.

### Tekshiruv natijalari (v2.2.0)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **422 ta, 0 xato** (yangi: `17. Landing sahifasi`, `24. Ariza oqimi`) |
| Joylashuv testi | ✔ **175 tekshiruv, 0 toshish** — landing 5 bo'limi + 3 tabi ham 7 o'lchamda (390×844 dan 1920×1080 gacha) |
| Skrinshotlar | ✔ **78 ta surat (88 qadam)** — yangi: 79–88 (`79-v22-landing-hero-1920`, imkoniyatlar, jarayon, dastur, savollar, kirish, ariza, admin tab, mobil hero, mobil kirish) |
| Ariza oqimi (Playwright) | ✔ Landing → ariza (2 ta) → takroriy raqam bloklandi → dashboard ogohlantirishi → «Talaba qilish» (prefill) → talaba + kartochka → ariza o'chdi: **0 JS xatosi** |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.2.0** |

---

## v2.2.1 — Kirish faqat nick bilan (HEMIS ID — adminga)

**Talab:** «Kirish uchun HEMIS ID va nick degan ekansan, men senga faqat berilgan nick orqali kirsin degandim.
HEMIS ID sini menga tashlashadi, keyinchalik admin uni ro'yxatdan o'tkazadi. Bitta HEMIS ID uchun bitta nick
beriladi. Shu ustida professional tarzda ishla.»

### Model (endi qat'iy)

| Kim | Nima qiladi | Nimani kiritadi |
|---|---|---|
| **Talaba** | HEMIS ID (12 xona) ni **klubga — adminga** topshiradi | — |
| **Admin** | `Talabalar → Talaba qo'shish` (yoki CSV import): ism + **HEMIS ID** | HEMIS ID |
| **Tizim** | Shu HEMIS ID uchun **bitta unikal nick** beradi; takroriy HEMIS ID bloklanadi | — |
| **Talaba** | Saytga **faqat nick** + parol bilan kiradi | **Nick** |

### Nima o'zgardi

| # | O'zgarish | Tafsilot |
|---|---|---|
| 1 | **Kirish qidiruvi rolga qarab** | `authLookup(login, role)`: talaba uchun **faqat nick**; admin uchun email (nick ham mumkin). HEMIS ID va email talaba kirishida **ishlamaydi** |
| 2 | **Aniq himoya va tushuntirish** | HEMIS ID ko'rinishidagi qiymat (12 raqam, bo'sh joyli ham) kiritilsa: «Talaba kirishi faqat NICK bilan. HEMIS ID ni klub adminiga topshiring — u akkaunt ochib, sizga nick beradi.» (`isHemisLike()`) |
| 3 | **Aniq "topilmadi" xabarlari** | Talaba: «Bunday nick topilmadi. Nickni klub adminidan so'rang (masalan: falcon)». Admin: «Bunday email topilmadi…» |
| 4 | **Kirish maydoni** | Yorliq «**Nick (kirish uchun)**», maydon ostida izoh: HEMIS ID kirishda ishlatilmaydi, u faqat ro'yxatga olishda (adminga) topshiriladi. `autofocus` qo'shildi |
| 5 | **Kirish kartochkasi** | «Nick (login)» + «**HEMIS ID (admin uchun)**»; izoh: «Tizimga faqat nick bilan kiradi — HEMIS ID kirishda ishlatilmaydi». Nusxalash: «Kirish: nick falcon \| HEMIS ID (arxiv): …» |
| 6 | **Landing matnlari** | Hero tavsifi, pitch kartasi («Nick — yagona kalit»), jarayon qadami, FAQ (2 javob), ariza rahmat ekrani, yordam modali — hammasi yangi modelga moslandi |
| 7 | **Admin bo'limi matnlari** | Talaba qo'shish oynasi, CSV import, import yakuni ekrani — «kirish faqat nick bilan» deb aniq yozildi |
| 8 | **Toast** | «Talaba qo'shildi • kirish nick: falcon» (`@` belgisi olib tashlandi — nick email emas) |
| 9 | **1 HEMIS = 1 nick qoidasi** | Takroriy HEMIS ID (`hemis-dup`) va CSV fayldagi takrorlar oldin ham, endi kirish mantig'i bilan bir xil modelda: bitta HEMIS ID — bitta akkaunt |

### Tekshiruv natijalari (v2.2.1)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **428 ta, 0 xato** — yangi: HEMIS bilan kirish **rad etiladi** + tushuntirish, nick bilan topiladi, email talaba uchun ishlamaydi, `isHemisLike()` |
| Joylashuv testi | ✔ 175 tekshiruv, 0 toshish (7 o'lcham) |
| Skrinshotlar | ✔ 78 ta (kirish bo'limi yangilandi: `84`, `85`, `88`) |
| Nick-only oqim (Playwright) | ✔ kartochka (nick + HEMIS arxiv) → kirish maydoni matni → **HEMIS ID rad etildi** → noto'g'ri nick maslahati → to'g'ri nick → parol o'rnatish → kabinet → nick+parol bilan qayta kirish → admin email bilan: **0 JS xatosi** |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.2.1** |

---

## v2.3.0 — Dizayn sayqali (professional polish)

**Talab:** «Dizayni ustida professional ravishda ishla, qayta-qayta ko'rib chiq va eng yaxshisini qilib chiq.»

Ish ikki bosqichda: (1) butun interfeys qayta-qayta ko'zdan kechirildi (landing 6 bo'lim, talaba 7 bo'lim,
admin 8 bo'lim, modallar, mobil, light mavzu, 7 xil ekran o'lchami), (2) topilgan nuqsonlar tuzatildi va
dizayn tizimi yagona tilga keltirildi.

### Topilgan nuqsonlar va tuzatishlar

| # | Nuqson | Tuzatish |
|---|---|---|
| 1 | **Emoji shrinkga bog'liq**: salomlashuvdagi 👋 va bo'sh holatlardagi ✅/🎉 ba'zi mashinalarda «tofu» (bo'sh kvadrat) bo'lib chiqardi | Barcha emoji **o'z SVG ikonkalari** bilan almashtirildi (`i-hand`, `i-eye-off` qo'shildi — jami 68 ikona). Endi platforma shriftdan mustaqil |
| 2 | **Kirish kartochkasi bosmaga tayyor emas**: chop etishda yon panel, tugmalar va qorong'i fon ham chiqardi | `print` qatlami: faqat karta oq sahifada, tugmalar `.no-print`, kontur, `print-only` manzil izohi, `body:has(#loginCard)` bilan orqa fon o'chadi. **A4 PDF sifatida tekshirildi** |
| 3 | **Parolni ko'rish imkoni yo'q edi** | Barcha parol maydonlariga ko'z tugmasi (`type=button` — formani yubormaydi), bosilganda `eye-off`ga o'tadi, fokus saqlanadi |
| 4 | **Landing navigatsiyasi «ko'r»** edi — qaysi bo'limdaligi bilinmasdi | Skrol-spy: ko'rinish markazidagi bo'lim navda belgilanadi (`.on`) |
| 5 | **Mobil: «Admin / Mentor» tab yorlig'i ikki qatorga bo'linardi**; qidiruv maydoni matni kesilardi | ≤460px da ikkinchi qism yashiriladi (`<span class="tt2">`), maydon `min-width:0`; qidiruvda qisqa placeholder |
| 6 | **1568×768 noutbukda yon panelning «Chiqish» tugmasi kesilardi** | `.side-nav` skroll konteyneriga olindi, foydalanuvchi bloki doim ko'rinadi; past balandlik uchun zichroq rejim |
| 7 | **Light mavzuda hero chipi ikki qatorga bo'linardi** | `nowrap` + ellipsis |
| 8 | **Skrinshotlar sahifa o'rtasidan olinardi** (brauzer skrolni tiklaydi) | Beta tuzatildi: `history.scrollRestoration='manual'` + har suratdan oldin `scrollTo(0,0)` |
| 9 | **Jadval sarlavhasi skrollda yo'qolardi** | Yopishqoq sarlavha (blur fon), qatorlar hover'da siljib yoritiladi |
| 10 | **Bosish/tortish madaniyati bir xil emas edi** | Tugmaga «sheen» o'tishi, kartalarda 3–4px ko'tarilish, KPI'da gradient chiziq, toast/`ldone` pop — yagona `cubic-bezier(.16,1,.3,1)` tilida |

### Dizayn tizimi (yangi qatlamlar)

| Qatlam | Tafsilot |
|---|---|
| Tipografiya | `text-wrap:balance` sarlavhalarda, `pretty` matnda; `tabular-nums` raqamlarda; `scroll-margin-top` ankerlar uchun |
| Holatlar | `:hover` / `:focus-visible` / `:active` / `[disabled]`, `.inp.err`; `prefers-reduced-motion` va `hover:none` hurmat qilinadi |
| Bosma | Toza kartochka, oq fon, kontrast saqlangan |
| Mobil | Bottom-nav skroll, `:active` bosilish, `≤400px` zichlik |
| Yordam | «Nickni eslay olmadingizmi? — Yordam olish» havolasi (matn + SVG), yordam modali yangilandi |

### Tekshiruv natijalari (v2.3.0)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **443 ta, 0 xato** — yangi 25-guruh: parol ko'zi, emoji yo'qligi, `no-print`/`print-only`, skrol-spy, yordam havolasi |
| Joylashuv testi | ✔ 175 tekshiruv, **0 gorizontal toshish** (390/768/1024/1366/**1568**/1440/1920) |
| Skrinshotlar | ✔ **83 ta** (93 qadam) — yangi: parol ko'zi, kirish kartochkasi, **bosma ko'rinishi (PDF)**, talabalar jadvali, mobil qidiruv |
| PDF tekshiruvi | ✔ Kirish kartochkasi `page.pdf()` bilan A4'da sinaldi: faqat karta, o'qiladigan kontrast |
| Noutbuk sinovi | ✔ 1568×768 va 1366×700: yon panel to'liq ko'rinadi, hero CTA ekranga sig'adi |
| JS xatolari | ✔ 0 (jsdom + playwright) |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.3.0** |

---

## v2.3.1 — Ichki bo'limlar auditi va avtomatik UI tekshiruvi

**Baho (foydalanuvchi):** «Davom et» — v2.3.0 dan keyin hali ko'zdan kechirilmagan qismlar (Adminlar, buyruq
paneli, bildirishnomalar, CSV import, Jamoalar, Sozlamalar, sertifikat, birinchi ishga tushirish, bo'sh holat)
tekshirildi va topilgan nuqsonlar tuzatildi.

### Topilgan nuqsonlar va tuzatishlar

| # | Nuqson | Tuzatish |
|---|---|---|
| 1 | **Adminlar sahifasida KPI kartalari qiymat o'rniga ikona nomlarini ko'rsatardi** («shield», «check», «alert», «award») — `kpi()` argumentlari bir pog'ona siljib ketgan (`kpi(ic, val, lab, d, tone)`) | Argumentlar tartibga solindi: 7 / 7 / 6 / 1 raqamlari + to'g'ri rang toni (`a`, `r`, `c`) |
| 2 | **Adminlar jadvali umumiy ustun kengliklariga sig'masdi**: «Kontent menejer», «Kurator (nazorat)» teglari va ruxsat matni qo'shni ustunga o'tib ketardi | Jadval uchun alohida kengliklar (`.trows.adm`), teglar uchun `overflow:hidden` + ellipsis va to'liq matn `title` tooltip'ida |
| 3 | **«Ruxsatlar» ustuni matni kesilardi** («Talabalar va akkauntlar, Vaz…») | Ustun ixchamlashtirildi — «3 ta ruxsat» / «Barcha huquqlar», to'liq ro'yxat tooltip'da. Matn endi hech qachon kesilmaydi |
| 4 | Bunday nuqsonlar **qo'lda ko'rishda oson ko'zdan qochadi** | Yangi vosita: **`npm run test:ui`** — barcha sahifa va modallarni aylanib chiqib KPI siljishi, ustun matni kesilishi, NaN/undefined va gorizontal toshishni avtomatik topadi |

### Yangi vosita: `npm run test:ui` (sahifa auditi)

`tools/tests/ui-audit.js` — admin 9 bo'lim + talaba 7 bo'lim + 6 modal + buyruq panelini Playwright'da ochib:

| Tekshiruv | Nima ushlaydi |
|---|---|
| KPI qiymati | Qiymat ikona nomiga teng bo'lsa → argumentlar siljigan (`kpi('users','shield',…)`) |
| Ustun matni | `scrollWidth > clientWidth` → matn kesilgan/to'lib-toshgan |
| Matn butunligi | `NaN`, `undefined`, `[object Object]`, `Infinity` |
| Joylashuv | Gorizontal skroll, JS xatolari |

`npm test`ga ham **26-guruh** sifatida qo'shildi (har bir sahifa uchun KPI silkimmagani + matn butunligi + JS xatosi,
jsdom'da): jami **495 tekshiruv**.

### Tekshiruv natijalari (v2.3.1)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **495 ta, 0 xato** (26-guruh: barcha 16 sahifa auditi) |
| Sahifa auditi | ✔ `npm run test:ui` → **nuqson topilmadi** (admin 9 + talaba 7 sahifa + 6 modal) |
| Joylashuv testi | ✔ 175 tekshiruv, 0 gorizontal toshish |
| Skrinshotlar | ✔ **90 ta** (100 qadam) — yangi 7 ta: Adminlar, buyruq paneli, bildirishnomalar, Jamoalar, Sozlamalar, sertifikat, birinchi ishga tushirish |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.3.1** |

---

## v2.3.2 — Kontrast (AA) auditi va faollik taqsimoti

**Baho (foydalanuvchi):** «Dizayni ustida professional ravishda ishla, qayta-qayta ko'rib chiq» — uchinchi
ko'rikdan o'tkazish davomida hali tegilmagan yuzalar (bo'sh platforma holatlari, statistika raqamlarining
haqiqiyligi, ikkala mavzudagi kontrast va o'qilish) tekshirildi.

### Topilgan nuqsonlar va tuzatishlar

| # | Nuqson | Tuzatish |
|---|---|---|
| 1 | **Statistika sahifasidagi «Kohortani ushlab turish» kartasi o'ylab topilgan egri chiziqni ko'rsatardi** — qiymatlar kodda qotib qolgan edi (`[100, 94, 89, 83, 78, …]`), hech qanday ma'lumotga bog'lanmagan. Bu **yolg'on raqam** | Karta **haqiqiy oxirgi faollik taqsimotiga** o'tkazildi: talabalarning `x.last` qiymati olti chelakka (0–1, 2–3, 4–5, 6–7, 8–9, 10+) bo'linadi, har bir ustunda `title="N talaba"`, birinchi qator «Bir hafta ichida faol N/M (%)». Karta nomi **«Faollik taqsimoti»**, tegi «Oxirgi faollik, kun» |
| 2 | Bo'sh platformada (yangi klub, talaba yo'q) Darslar bo'limida **«0 talaba 100% tugatgan»** deb yozilardi — ma'nosiz va chalg'ituvchi | Talaba yo'q bo'lsa: «hali talaba qo'shilmagan» |
| 3 | **Yorug' (light) mavzuda ikkilamchi matn (`--muted` #5E6A88) karta fonida WCAG AA dan past**: 4.20–4.48 (kerak 4.5) | Token quyuqlashtirildi: **#55607C** — eng yomon fonda ham 4.88 (o'lchandi) |
| 4 | Yorug' mavzudagi aksentlar oq fonda o'qilmasdi: pasayish ko'rsatkichi **1.97**, faol ustun sarlavhasi **1.81**, xavfli tugma **1.85** | Mavzuga xos to'q variantlar: `.d.dn-c` #B4123C, `.th.on` #0A5C6E, `.btn-danger` #A8102F, `.btn-ok` #0B6B4A, `.btn-accent` #233100 |
| 5 | «Jamoa uchun alohida belgilangan» qatori **inline `color:#8FE7F6`** bilan yozilgan edi — yorug' mavzuda **1.23**, ya'ni ko'rinmas | Yangi `.hl` utility klassi: dark `#8FE7F6` / light `#0A5566` (o'lchandi: 7.6 — AA dan ancha yuqori) |
| 6 | `npm run test:ui` **kontrastni umuman tekshirmasdi** — bunday nuqsonlar faqat qo'lda ko'zga tashlanardi | Auditga **`contrastScan()`** qo'shildi: har bir sahifa **ikkala mavzuda** ham skanerlanadi (WCAG AA: oddiy matn 4.5, katta matn 3.0). Fon rangi alfa-bojlangan zanjir bo'ylab hisoblanadi, gradient fonli va shaffofligi past elementlar chiqarib tashlanadi |

### Kontrast skaneri qanday ishlaydi

| Qism | Tafsilot |
|---|---|
| O'lchov | Har bir matn tuguni uchun `color` va **haqiqiy** fon (ota-elementlar zanjiri alfa bo'yicha qo'shiladi) → WCAG nisbati |
| Chegaralar | Katta matn (≥18.66px yoki ≥14px + 700) → 3.0, oddiy matn → 4.5 |
| Chiqarib tashlash | `background-image` (gradient) bor elementlar va `opacity < 0.6` — sun'iy signallar bermasligi uchun |
| Tinch holat | Tema almashganda `.card{transition:background .3s}` animatsiyasi o'lchovga tushib qolmasligi uchun skanerdan oldin `prefers-reduced-motion` yoqiladi (dastlab 15 ta **soxta** nuqson shundan chiqqan edi) |
| Diagnostika | `CONTRAST_RAW=1` — har sahifadagi eng past 5 nisbatni ham chiqaradi (keyingi ko'rikda zaxirani ko'rish uchun) |

Yakuniy o'lchov: **barcha 16 sahifa + 6 modal + buyruq paneli, ikkala mavzuda — 0 nuqson**, eng past nisbat
butun ilova bo'ylab **4.97** (dark mavzudagi `--muted`).

### Tekshiruv natijalari (v2.3.2)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **495 ta, 0 xato** (26 guruh) |
| Sahifa auditi + kontrast | ✔ `npm run test:ui` → **nuqson topilmadi** (dark **va** light mavzu) |
| Joylashuv testi | ✔ 175 tekshiruv, 0 gorizontal toshish |
| Skrinshotlar | ✔ **94 ta** (104 qadam) — yangi 4 ta: yorug' mavzu admin, yorug' mavzu statistika, yorug' mavzu vazifa, faollik taqsimoti |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.3.2** |

---

## v2.3.3 — Katta klub unumdorligi, bosma va o'rnatilgan ilova

**Baho (foydalanuvchi):** dizayn ko'rigining to'rtinchi bosqichi — «davom et». Avvalgi uch ko'rik
ko'rinish va o'qilishga qaratilgan edi; bu safar **yuk ostidagi xatti-harakat** (200+ talaba),
**chop etish** va **telefonga o'rnatilgan ilova** rejimi tekshirildi.

### Topilgan nuqsonlar va tuzatishlar

| # | Nuqson | Tuzatish |
|---|---|---|
| 1 | **Modal ochiq holda chop etilganda orqadagi sahifa ham bosilardi** — sertifikat PDF'i 2 varaq bo'lib chiqardi (1-varaqda «Ma'lumot» sahifasi, keyin sertifikat) | `@media print` ga modal-ustuvorlik qo'shildi: `body:has(.mback) #app{display:none}`. Endi modal ochiq holda faqat modal chiqadi — sertifikat **1 varaq** |
| 2 | Kirish kartochkasi chop etilganda **«Chop etish» va «Yopish» tugmalari qog'ozga tushardi** | Tugmalar `.no-print` bilan belgilandi (modal ichidagi tugmalar bosmada ko'rinmaydi) |
| 3 | **Katta ro'yxatda kvadratik (O(N²)) hisob-kitob**: har bir jadval qatorida `lateStudents()` qayta chaqirilardi — 200 talaba + 900 topshiriqda «Talabalar» sahifasi **623 ms**, «Deadline'lar» **524 ms** | Topshiriq indeksi (`st|task` Map) + chizish davri keshi (`rc/rcClear`) qo'shildi; bir chizishda bir xil hisob-kitob bir marta bajariladi. Natija: **623 → 89 ms** va **524 → 25 ms** (7 barobar tez) |
| 4 | `onTimePct()` har topshiriq uchun `Date` obyekti yasardi | ISO sanalarni matn sifatida taqqoslash (`p.at <= dueOf(...)`) — bir xil natija, tez |
| 5 | **O'rnatilgan ilova (PWA) rejimida hech qanday `safe-area` hisobi yo'q edi**: telefonda status-bar/notch ostida qolish xavfi bor edi | `@media (display-mode: standalone), (display-mode: minimal-ui)` bloki: topbar/yon panel/login/landing yuqori xavfsiz hududni, pastki navbat va FAB yon/past hududlarni hisobga oladi. Brauzerda `env()` = 0 — hech narsani o'zgartirmaydi |
| 6 | Jamoalar reytingida nol XP'da `0/0 = NaN` (v2.3.2 da tuzatilgan) — bunday sinf xatolar qaytmasligi uchun **avtomatik nazorat yo'q edi** | `npm test`ga **27-guruh** qo'shildi: 200 talabali holat jsdom'da chiziladi, raqamlar izchilligi (KPI = filtr yorlig'i = qatorlar soni), NaN yo'qligi va 3 sekundlik unumdorlik chegarasi tekshiriladi |

### Uch yangi vosita

| Buyruq | Nima qiladi |
|---|---|
| `npm run test:scale` | 200 talaba / 40 jamoa / 900 topshiriq yasab, 9 admin sahifasini ochadi: chizish vaqti, NaN, matn kesilishi, gorizontal toshish, saralash va filtr tezligi (chegara 900 ms / 1600 ms) |
| `npm run test:print` | **Haqiqiy PDF** chiqaradi (`page.pdf` + `pdftotext`): kartochka va sertifikat **bitta varaqda**, orqa sahifa va navigatsiya bosmaga tushmasligi, matn o'qilishini tekshiradi. `emulateMedia` bilan emas — haqiqiy chop etish CSS'i bilan |
| `npm run test:standalone` | Ilovani `--app=` rejimida (o'rnatilgan ilova kabi) ochadi, CDP orqali **xavfsiz hudud** (status-bar 59px, past 34px) beradi va topbar/yon panel/pastki navbat to'qnashmasligini o'lchaydi. Linux'da DISPLAY yo'q bo'lsa o'zini `xvfb-run` ostida qayta ishga tushiradi |

### O'lchangan natijalar (200 talaba)

| Sahifa | Ilgari | Hozir |
|---|---|---|
| Talabalar (200 qator) | 623 ms | **89 ms** |
| Deadline'lar | 524 ms | **25 ms** |
| Filtr «Jim» | 584 ms | **85 ms** |
| Filtr «Barchasi» | 721 ms | **87 ms** |
| Jamoa a'zolari kesimi | 58 ms | **73 ms** |

### Tekshiruv natijalari (v2.3.3)

| Daraja | Natija |
|---|---|
| Funksional testlar | ✔ **507 ta, 0 xato** (27 guruh; yangi 27-guruh — katta klub) |
| Sahifa auditi + kontrast | ✔ `npm run test:ui` → **0 nuqson** (dark va light) |
| Katta klub | ✔ `npm run test:scale` → **0 nuqson** (200 talaba) |
| Chop etish | ✔ `npm run test:print` → **0 nuqson** (kartochka va sertifikat 1 varaq) |
| O'rnatilgan ilova | ✔ `npm run test:standalone` → **0 nuqson** (safe-area hisobga olingan) |
| Joylashuv testi | ✔ 175 tekshiruv, 0 gorizontal toshish |
| Skrinshotlar | ✔ **96 ta** — yangi: `105-standalone-talaba.png`, `106-standalone-admin-light.png` |
| Versiya izchilligi | ✔ `src` = `sw.js` cache = `package.json` = **2.3.3** |
