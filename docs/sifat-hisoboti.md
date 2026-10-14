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

### B. Nima qo'shildi

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
| Statik himoya | ✔ Takroriy funksiya nomlarini topadigan test (shadowing xatosi qaytmasin) |
| O'lchamlar | ✔ 1920×1080, 1568×768 (foydalanuvchi noutbuki), 1440×900, 1366×768, 1024×800, 390×844 |
| Rollar sinovi | ✔ Founder/mentor/kontent/kurator: ko'rinadigan bo'limlar, bloklangan amallar, qulflar |
| Parol oqimi | ✔ Eski parol tekshiruvi, qisqa parol rad etilishi, mos kelmagan takror, tiklashdan keyin birinchi kirish |

### Foydalanish (namuna rejimi)

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
