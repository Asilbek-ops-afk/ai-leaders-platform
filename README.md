# AI Leaders — Startup Club platformasi

> **0 dan startapgacha** — boshlovchilarni startuplarga tayyorlaydigan klub uchun to'liq ishlaydigan o'quv platformasi.
> Talaba kabineti (7 bo'lim) + Admin/Mentor paneli (8 bo'lim), gamification, vazifa–deadline tizimi va jamoaviy ishlash.

| | |
|---|---|
| 🌐 **Jonli sayt** | **https://ai-leaders-platform.pages.dev** |
| 💻 **Kod** | https://github.com/Asilbek-ops-afk/ai-leaders-platform |
| 🧪 **Testlar** | `npm test` → **495 ta tekshiruv, 0 xato** • `npm run test:ui` → **sahifa auditi + WCAG AA kontrast (dark & light)** |
| 🔐 **Kirish** | Talaba: **faqat nick** + parol (HEMIS ID kirishda ishlatilmaydi) • Admin: email + parol |
| 📱 **PWA** | Telefonda "Bosh ekranga qo'shish" — oflayn ham ishlaydi |
| 🚀 **Birinchi kirish** | Platforma **bo'sh boshlanadi** — birinchi ochilishda **Founder akkaunti** yaratasiz |
| 📦 **Hajm** | Bitta `index.html` (~330 KB), tashqi kutubxonasiz |
| 🎨 **Dizayn** | Dark/light mavzu, o'z ikonalar to'plami (68 SVG), mikro-animatsiya, `prefers-reduced-motion` qo'llab-quvvatlanadi |

---

## Mundarija
1. [Nima bor?](#nima-bor)
2. [Talaba kabineti](#1-talaba-kabineti-7-boʻlim)
3. [Admin paneli](#2-admin--mentor-paneli-8-boʻlim)
4. [Gamification](#3-gamification-oʻquvchini-ushlab-turish)
5. [Noutbuk rejimi](#4-noutbuk-va-kompyuter-rejimi)
6. [Texnik tuzilma](#texnik-tuzilma)
7. [Ishga tushirish va buyruqlar](#ishga-tushirish)
8. [Testlar va skrinshotlar](#testlar)
9. [Real bazaga o'tish (Supabase)](#real-bazaga-otish)
10. [Birinchi ishga tushirish](#birinchi-ishga-tushirish)
11. [Yo'l xaritasi](#yol-xaritasi)

---

## Nima bor?

Platforma **uchta asosiy g'oyani** hal qiladi:
- **Yo'l xaritasi** — 0 dan boshlovchi "keyingi qadamim nima?" degan savolga javob topadi.
- **Intizom** — vazifa → deadline → tekshirish → baho → keyingi modul zanjiri.
- **Jamoa** — yolg'iz o'qish emas, startap mashqi: jamoa, devor, mentor, Demo Day.

Barcha sahifalar **mobil-birinchi** (talabalar asosan telefondan kiradi) va **noutbukda ham to'liq qulay**
(keng ekran tuzilishi, yig'iladigan yon panel, `Ctrl/⌘ + K` buyruq paneli, klaviatura yorliqlari, saralanadigan jadvallar).
Ikki rejimli: **dark / light**.

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

### 4. Noutbuk va kompyuter rejimi

Telefon ko'rinishi o'zgarmagan — noutbukda esa qo'shimcha qulayliklar **avtomatik** (981 px dan keng ekranlarda) yoqiladi:

| Imkoniyat | Tafsilot |
|---|---|
| 🖥 **Keng ekran tuzilishi** | Asosiy ustun + o'ng yon panel (≥1280 px); kontent `1460 / 1680 / 1860 px` gacha kengayadi, oraliqlar mutanosib |
| 📐 **2–3 ustunli to'rlar** | ≥1400 px da vazifalar 2 ustun, modullar 3 ustun, galereya zichroq |
| ⬅️ **Yig'iladigan yon panel** | Sarlavhadagi tugma yoki `Ctrl+K → "Yon panelni yig'ish"`; holat eslab qolinadi (ish maydoni 80 px panel bilan kengayadi) |
| ⌨️ **Buyruq paneli** | `Ctrl/⌘ + K` — bo'limlar, darslar, vazifalar, talabalar, tez amallar bir joyda; ↑ ↓ va `Enter` bilan boshqariladi |
| 🧭 **Klaviatura yorliqlari** | `/` qidiruv, `Alt+1…8` bo'limlar, `N` bildirishnomalar, `T` dark/light, `?` yorliqlar oynasi, `Esc` modalni yopish |
| 🔤 **Saralanadigan jadvallar** | Admin «Talabalar» jadvalida ustun nomini bosing (ism, jamoa, progress, baho); telefonda esa «Saralash» tanlagichi (XP, streak ham) |
| 📏 **Kompakt rejim** | Balandligi 850 px dan kam noutbuklarda (masalan 1366×768) oraliqlar avtomatik zichlashadi |
| ⬆️ **«Yuqoriga» tugmasi** | Uzoq ro'yxatlarda pastda o'ng burchakda paydo bo'ladi |
| 🦶 **Sahifa paneli** | Har sahifa oxirida brend + tezkor havolalar + versiya (telefonda yashirilgan) |

Yorliqlar oynasini sayt ichidan ko'rish: yuqori paneldagi `?` tugmasi yoki `Shift + /` (ya'ni `?`).

---

### 5. Kirish tizimi va akkauntlar (MVP)

**Talabalar** klubga HEMIS ID topshiradi → admin platformaga kiritadi → tizim har bir HEMIS ID uchun
**unikal nick** beradi (21-school uslubida). Parolni talaba **birinchi kirishda o'zi** o'rnatadi —
admin parol tarqatmaydi.

| Qadam | Kim | Nima bo'ladi |
|---|---|---|
| 1 | Talaba | HEMIS ID (12 xona) ni **klubga (adminga) topshiradi** — bu kirish uchun emas |
| 2 | Admin | `Talabalar → Talaba qo'shish`: ism, HEMIS ID, telefon, jamoa |
| 3 | Tizim | Shu HEMIS ID uchun **takrorlanmas nick** yaratadi + **Kirish kartochkasi** (chop etish/nusxalash) |
| 4 | Talaba | Saytga **faqat nick** bilan kiradi → parolni o'zi o'rnatadi |
| 5 | Keyingi kirishlar | Nick + o'zi tanlagan parol |

**Admin va mentorlar** (7 kishi) email + parol bilan kiradi. Ular uchun alohida **Adminlar** bo'limi bor:
rol (Founder, Bosh mentor, Mentor, Kontent menejer, Kurator), ruxsatlar, bloklash/o'chirish, kirish kartochkalari.
Bo'limni faqat **Founder** ko'radi va boshqaradi.

> ⚠️ **Muhim:** hozir ma'lumotlar brauzer xotirasida (`localStorage`) saqlanadi — bu MVP ning 1-bosqichi,
> interfeys va login tizimi to'liq ishlaydi. Ko'p qurilmali ishlash (talaba telefonda topshiradi → admin
> noutbukda ko'radi) uchun **Supabase** bazasi ulanadi: `schema/supabase.sql` tayyor, adapter yozilgan —
> kalitlar kiritilishi bilan 15 daqiqada ishga tushadi. Batafsil: `docs/mvp-reja.md`.

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
│       ├── run.js             # 495 ta avtomatik test (jsdom)
│       ├── ui-audit.js        # sahifa auditi: KPI siljishi, matn kesilishi, toshish (playwright)
│       ├── layout.js          # 175 joylashuv (overflow) tekshiruvi (playwright)
│       ├── live.js            # 18 ta jonli sayt tekshiruvi
│       ├── fixtures.js        # test uchun namuna ma'lumot (manba kodda YO'Q)
│       └── screens.js         # 88 qadam / 78 skrinshot (playwright) → docs/screens/
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
npm test            # 495 ta avtomatik test (jsdom kerak: npm install)
npm run test:ui     # sahifa auditi + kontrast skaneri (playwright kerak)
npm run test:layout # 175 ta joylashuv tekshiruvi (playwright: npx playwright install chromium)
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
26 guruh, **495 ta tekshiruv**: bo'sh platforma va Founder yaratish, namuna holat migratsiyasi,
**CSV import** (fayl → tekshiruv hisoboti → akkauntlar + kartochkalar), **chekka holatlar**
(vazifasiz jamoa, yetim a'zo, bo'sh tuzilmalarda `NaN`siz hisoblar),
kirish va rol himoyasi, 7 talaba bo'limi, 8 admin bo'limi,
vazifa topshirish → tekshirish → baholash zanjiri, modul qulfi, quiz, kunlik questlar,
fayl biriktirish, jamoa devori va jamoaviy topshirish, kalendar navigatsiyasi, eksport/zaxira,
sozlamalar saqlanishi, sana mantig'i, PWA/SEO teglari, buzilgan `localStorage`'dan tiklanish.

**2) `node tools/tests/screens.js` — vizual QA (playwright, Chromium)**
**94 ta skrinshot** (104 qadam): 15 desktop sahifa, 6 mobil ko'rinish, 7 modal/light-tema holati, **10 noutbuk ko'rinishi**, **v2.x bo'sh platforma holatlari**, **CSV import oynasi**, **v2.3.0 dizayn sayqali** (parol ko'zi, kirish kartochkasi + bosma ko'rinishi, jadval, mobil qidiruv), **v2.3.1 ichki bo'limlar** (Adminlar, buyruq paneli, bildirishnomalar, Jamoalar, Sozlamalar, sertifikat, birinchi ishga tushirish) va **v2.3.2 yorug' mavzu** (admin, statistika, vazifa) + **faollik taqsimoti**
(1920×1080, 1440×900, 1366×768 — keng ekran tuzilishi, yig'ilgan yon panel, buyruq paneli, yorliqlar oynasi, light tema)
→ `docs/screens/`.

**3) `npm run test:layout` — joylashuv tekshiruvi (playwright)**
7 o'lcham (390×844 → 1920×1080) × 17 sahifa (7 admin + 7 talaba + 3 bo'sh platforma): gorizontal toshish (overflow) bo'lmasligini o'lchaydi.
Admin va talaba bo'limlari ketma-ket ochiladi, har biri uchun `document.scrollWidth` solishtiriladi.

**4) `node tools/tests/live.js [url]` — jonli sayt tekshiruvi**
18 ta tekshiruv: sahifa yuklanishi, brend, SEO/PWA teglari, manifest, service worker, rasm va sarlavha (header) sozlamalari.

**5) `npm run test:remote` — jonli saytda to'liq funksional testlar**
Xuddi `npm test` kabi to'liq to'plam (495 ta), lekin lokal `index.html` o'rniga **internetdagi** sahifa yuklab olinadi
(`TEST_URL=<url> node tools/tests/run.js`). Deploydan keyin «haqiqatan shu versiya chiqdimi?» degan savolga javob beradi.

---

## Real bazaga o'tish

Hozircha barcha ma'lumot brauzer xotirasida (`localStorage`, kalit `ai-leaders-platform-v1`) saqlanadi.
Real ko'p foydalanuvchili ish uchun:

1. **Supabase** loyihasi oching → SQL Editor → `schema/supabase.sql` ni to'liq ishga tushiring.
   Sxemada tayyor: **19 jadval**, 3 ta view (statistika, reyting, kechikkanlar), **RLS siyosatlari**
   (talaba faqat o'zini ko'radi, mentor hammasini), PL/pgSQL funksiyalar (`fn_complete_lesson`, `fn_module_unlocked`),
   Storage siyosatlari va zaxira jadval to'ldirish yo'riqnomasi.
2. `src/app-1-core.js` dagi **`loadState()`** va **`save()`** funksiyalarini Supabase chaqiruvlariga almashtiring —
   qolgan kod (butun UI) o'zgarishsiz qoladi, chunki butun holat bitta `S` obyektida.
3. Fayllar uchun Supabase Storage (`submissions` bucket) ishlatilsin — hozir kichik fayllar dataURL sifatida saqlanadi.
4. **Telegram-bot** ulash: deadline eslatmalari va kunlik standup (21:00).

---

## Birinchi ishga tushirish

Platformada **hech qanday namuna (demo) ma'lumot yo'q** — birinchi ochilganda maxsus ekran chiqadi
va siz **Founder akkauntini** yaratasiz (ism, email, parol). Founder — platformaning to'liq huquqli egasi:
talaba qo'shadi, jamoa tuzadi, vazifa beradi, adminlarni tayinlaydi.

| Qadam | Nima qilinadi |
|---|---|
| 1 | **Talaba qo'shish** — admin HEMIS ID (12 xona) kiritadi, tizim unikal nick beradi, kirish kartochkasi chiqadi |
| 2 | **Jamoa tuzish** — 3–4 talaba, mentor juftligi, jamoa devori |
| 3 | **Vazifa + deadline** — modulga bog'lanadi, talabalar topshiradi, admin/mentor baholaydi |
| 4 | **Admin va mentor qo'shish** — har biriga alohida rol va ruxsat beriladi |

## Landing sahifa (v2.2.0)

Tizimga kirmagan foydalanuvchi endi **landing sahifani** ko'radi: yopishqoq navigatsiya va o'qish
progressi, hero (qahramon) bloki, «Klub nima beradi» 6 karta, 4 qadamli jarayon, o'quv dasturi
(bazadagi 6 modul), savol-javob akkordeoni — va eng pastda **Kirish / Ro'yxatdan o'tish** bo'limi.

**Skrollda kreativ ochilish:** kirish bo'limiga yetib kelganda tepadan yorug'lik chizig'i tushadi,
fon porlaydi va **karta 3D burilib ochiladi** (perspective + rotateX), maydonlar ketma-ket chiqadi.
Animatsiya `prefers-reduced-motion` sozlamasini hurmat qiladi.

Uch tab: **Talaba** (nick/HEMIS ID + parol), **Admin / Mentor** (email + parol) va **Ariza**
(ro'yxatdan o'tish). Ariza **Admin → Talabalar → «Yangi arizalar»** blokida ko'rinadi: bir tugma
bilan talabaga aylantiriladi (ism, telefon, telegram, maqsad avtomatik to'ldiriladi — faqat HEMIS ID
kiritasiz), shundan keyin kirish kartochkasi chiqadi. Dashboard ham yangi arizalar haqida ogohlantiradi.

### Dizayn tizimi (v2.3.0 sayqali)

| Qatlam | Tafsilot |
|---|---|
| **Tipografiya** | Sarlavhalarda `text-wrap: balance`, matnda `pretty`; raqamlar `tabular-nums` (jadval, KPI, streak uzilmaydi) |
| **Rang va chuqurlik** | Brend gradienti (`#7C5CFF → #22D3EE`) + yashil aksent (`#C6FF4F`); kartalar hover'da 3–4px ko'tariladi, KPI'da yuqori gradient chiziq yonadi |
| **Mikro-animatsiya** | Yagona harakat tili (`cubic-bezier(.16,1,.3,1)`): tugma «sheen», ikona siljishi, salomlashuvdagi SVG qo'l hilpiragi, toast/finish pop effektlari |
| **Ikonkalar** | 68 ta o'z SVG ikonkasi — **emoji o'rniga** hamma joyda (salomlashuv, bo'sh holatlar, baho, toastlar). Tizim shriftiga bog'liq emas |
| **Holatlar** | `:hover`/`:focus-visible`/`:disabled`/`:active` to'liq; `prefers-reduced-motion` va `hover:none` (telefon) hisobga olingan |
| **Kirish formasi** | Parolni ko'rsatish tugmasi (👁 SVG), «Nickni eslay olmadingizmi? — Yordam olish» havolasi |
| **Landing** | Skrol-spy navigatsiya (faol bo'lim belgilanadi), progress chizig'i, 3D ochilish animatsiyasi |
| **Jadval** | Yopishqoq sarlavha, hover qatori, `table-scroll` bilan gorizontal skroll |
| **Yon panel** | Menyu skroll bo'ladi, foydalanuvchi bloki doim ko'rinadi; past balandlikdagi noutbuklarda zichroq (1568×768 sinovdan o'tgan) |
| **Bosma (print)** | Kirish kartochkasi toza oq sahifada chiqadi: orqa fon o'chadi, tugmalar `.no-print`, karta konturi A4'ga sig'adi + `print-only` manzil izohi |
| **Mobil** | Bottom-nav 5 bo'lim, FAB, qisqa qidiruv maydoni, tab yorliqlari siqilmaydi (≤460px) |

**Nima uchun HEMIS ID kirishda ishlatilmaydi?** HEMIS ID — talabaning identifikatori, uni talaba klubga
topshiradi va admin akkaunt ochishda kiritadi. Kirish uchun esa har bir HEMIS ID uchun **bitta unikal nick**
beriladi: bitta HEMIS ID = bitta nick = bitta akkaunt (takroriy ro'yxatga olish bloklanadi). Talaba HEMIS ID ni
kirish maydoniga yozsa, platforma aniq tushuntiradi va adminga yo'naltiradi.

**Real talabalar ro'yxatini ommaviy yuklash** (CSV: ism, HEMIS ID, telefon, jamoa, telegram, maqsad):

```bash
node tools/import-talabalar.js docs/talabalar-shabloni.csv          # sinov (yozmaydi)
node tools/import-talabalar.js docs/talabalar-shabloni.csv --write   # bazaga yozadi
```

**Endi xuddi shu CSV'ni platformaning o'zida yuklash mumkin** — Admin → **Talabalar** → **CSV import**:
fayl tanlanadi, hisobot ko'rsatiladi (nechta qabul qilinadi, qaysi qatorlarda xato/ogohlantirish),
tasdiqlangach talabalar + akkauntlar + jamoalar avtomatik yaratiladi va kirish kartochkalari chiqadi.
Ya'ni yangi oqim uchun kod o'zgartirish yoki qayta deploy kerak emas.

**Xato fayl yuklandi?** Yakuniy oynada va Talabalar sahifasida **«Importni bekor qilish»** tugmasi bor:
u shu import yaratgan talaba, akkaunt va jamoalarni o'chiradi — keyin qo'lda qo'shilganlarga tegmaydi
(har bir import qatori `imp` belgisi bilan saqlanadi).

CLI varianti (`tools/import-talabalar.js`) tekshirilgan ro'yxat arxivi sifatida qoladi:
platformada Founder akkaunti bo'lishi kerak (`localStorage` zaxirasidan yoki brauzerdan eksport qilingan
JSON bilan ishlaydi).

**Namuna ma'lumot faqat testlarda:** `tools/tests/fixtures.js` (18 talaba, 7 admin, 6 jamoa,
topshiriqlar, deadline'lar). U **manba kodga (`src/`) kirmaydi** — `npm test` ichidagi statik qo'riqchi
buni har safar tekshiradi (`21. Statik qo'riqchi` guruhi).

**Eski versiyadan yangilanish:** ilgari ochilgan brauzerlarda namuna ma'lumot bo'lsa, sayt birinchi
yuklanishida ular **avtomatik o'chiriladi** (haqiqiy akkauntlar va ularning profillari saqlanadi),
keyin Founder ekrani chiqadi.

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

© 2026 **AI Leaders Startup Club** — Toshkent. Brend, dizayn va kod ushbu klub uchun yaratilgan.
