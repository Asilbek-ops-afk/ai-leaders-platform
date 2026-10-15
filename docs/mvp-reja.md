# AI Leaders — demo'dan haqiqiy MVP'ga o'tish rejasi

> **Vazifa:** hozirgi sayt "demo" emas, **haqiqiy ishlaydigan MVP** bo'lishi kerak:
> bir nechta qurilmada, haqiqiy login bilan, haqiqiy ma'lumotlar bazasida.

---

## 1. Hozirgi holat (nima bor)

| Qism | Holat | MVP uchun yetadimi? |
|---|---|---|
| Interfeys: talaba kabineti (7 bo'lim) + admin panel (8 bo'lim) | ✅ to'liq ishlaydi | Ha — o'zgarmaydi |
| Gamification: XP, coin, streak, reyting, questlar, yutuqlar | ✅ | Ha |
| Vazifa → deadline → tekshirish → baho zanjiri | ✅ | Ha |
| Dizayn: mobil-birinchi + noutbuk rejimi | ✅ | Ha |
| **Ma'lumotlar xotirasi** | ⚠️ faqat brauzerda (`localStorage`) — boshqa qurilmada ko'rinmaydi | ❌ **almashtiriladi** |
| **Kirish tizimi** | ⚠️ parolsiz, rolni tanlab kirish (demo) | ❌ **almashtiriladi** |
| **Fayl yuklash** | ⚠️ dataURL, ≤900 KB | ❌ **almashtiriladi** |
| Baza sxemasi | ✅ `schema/supabase.sql` — 19 jadval, 26 RLS siyosat, storage ko'rsatmasi | Tayyor |

**Xulosa:** interfeysning ~90% o'zgarishsiz qoladi. Faqat **ma'lumot qatlami** (data layer), **kirish tizimi** va **fayl xotirasi** haqiqiy bo'ladi.

---

## 2. MVP qanday ishlaydi (natija)

1. **Talaba** telefonda parol bilan kiradi → darsni tugatadi, vazifa + fayl topshiradi.
2. **Admin** o'z noutbukida **shu zahoti** ko'radi (yangi topshiriq, bildirishnoma).
3. **Baho va izoh** mentor tomonidan yoziladi → talaba telefonda darhol ko'radi.
4. **Har kim faqat o'ziga tegishlisini ko'radi** (RLS): talaba boshqalarning bahosi/faylini ko'rmaydi, admin hammasini ko'radi.
5. **Admin talaba qo'shadi**: ism, telefon, jamoa → tizim unga login ma'lumotlarini beradi.
6. Internet uzilsa — sayt oldingi ma'lumotni ko'rsatib turadi, ulanish tiklanganda o'zgarishlar yuboriladi.

---

## 3. Texnik reja (7 bosqich)

| # | Ish | Nima qilinadi | Kim | Vaqt |
|---|---|---|---|---|
| 1 | **Baza loyihasi** | Supabase (bepul tarif) loyihasi ochiladi → `URL` + `anon key` olinadi | Siz (5 daqiqa) yoki men qo'llanma beraman | 5 daq |
| 2 | **Sxemani yuklash** | 19 jadval + 26 RLS siyosat + `submissions` fayl bucket'i | Men | 30 daq |
| 3 | **Kirish tizimi** | Email+parol, sessiya, 3 rol (admin / mentor / talaba), birinchi admin akkaunti | Men | 2 soat |
| 4 | **Ma'lumot qatlami** | `loadState()/save()` o'rniga Supabase adapteri + oflayn kesh + sinxronizatsiya, real-vaqt obuna (yangi topshiriq darhol ko'rinadi) | Men | 4–6 soat |
| 5 | **Real ma'lumot importi** | Siz bergan talaba/guruh jadvali → bazaga tartib bilan joylash; demo belgilari olib tashlanadi | Men | 1 soat |
| 6 | **Sinov** | 2 qurilma (telefon+noutbuk) testi, 3 rol, 230+ avtomatik test, xavfsizlik tekshiruvi | Men | 1 soat |
| 7 | **Deploy** | Cloudflare Pages'ga chiqarish + jonli tekshiruv | Men | 20 daq |

**Umumiy vaqt:** baza kalitlari qo'lda bo'lsa — **1 ish kuni**. Sayt shu vaqt ichida ham ishlab turadi (uzilish bo'lmaydi): yangi versiya tayyor bo'lgach almashtiriladi.

---

## 4. Xavfsizlik (MVP'da nima o'zgaradi)

- Har talabaning **o'z akkaunti** va paroli.
- Ma'lumotlarga ruxsat **baza darajasida** (RLS) — kod xatosi bo'lsa ham talaba begona ma'lumotni o'qiy olmaydi.
- Fayllar **private bucket**da; havola faqat egasi va mentor/admin uchun.
- Xizmat kaliti (service key) **hech qachon** frontendga chiqmaydi.
- Zaxira: Supabase avtomatik kunlik backup + qo'lda `CSV/JSON` eksport (hozirgi funksiya qoladi).

---

## 5. Keyin (MVP'dan keyingi bosqichlar)

- **Telegram eslatmalar**: deadline 24 soat qolganda; yangi baho kelganda (bot orqali).
- **Telegram bot to'liq**: botdan vazifa topshirish va reyting ko'rish.
- **Video darslar**: YouTube/Vimeo private havolalar (hozir "video" darslar mock).
- **Sertifikat PDF** generatsiyasi (hozir chop etish oynasi).
- **Analitika**: modul bo'yicha qiyinchilik nuqtalari, talabani ushlab turish (retention) hisobotlari.

---

## 6. Sizdan kerak bo'lgan qarorlar

Rejani boshlash uchun 4 ta savolga javob kerak (keyingi xabarda so'rayman):

1. **Baza:** Supabase (tavsiya) / Cloudflare D1 / hozircha lokal.
2. **Kirish usuli:** email+parol / telefon+parol / Telegram kod.
3. ~~Hozirgi demo ma'lumotlar taqdiri~~ → **hal qilindi (v2.0.0): namuna ma'lumot butunlay o'chirildi.**
4. **MVP qamrovi:** asosiy / +Telegram eslatmalar / +to'liq Telegram bot.

> Savollarga javob bergach, 1-bosqichdan darhol boshlaymiz. Real ma'lumotlar jadvali (talaba ismlari, telefonlari, jamoalar)
> tayyor bo'lsa — 5-bosqichda uni tartib bilan bazaga joylashtiraman.

---

## 7. Tanlangan qarorlar (foydalanuvchi javoblari)

| Savol | Qaror | Izoh |
|---|---|---|
| Ma'lumotlar bazasi | **Hozircha lokal** (brauzer xotirasi) | Login tizimi shunday quriladiki, keyin bazaga o'tilganda qayta yozilmaydi. Baza kalitlari tayyor bo'lsa — 15 daqiqada ulanadi. |
| Kirish usuli | **HEMIS ID + unikal nick** | Talaba bizga HEMIS ID topshiradi → biz bazaga kiritamiz → har bir HEMIS ID uchun **bitta alohida nick** beriladi (21-school uslubida). Bitta HEMIS ID = bitta foydalanuvchi. |
| Landing sahifa | **v2.2.0: tizimga kirilmagan foydalanuvchi uchun landing** — hero, imkoniyatlar, jarayon, dastur, FAQ va skrollda 3D ochiladigan kirish/ariza bo'limi. Talabgor «Ariza» qoldiradi, admin uni bir tugma bilan talabaga aylantiradi |
| Namuna ma'lumotlar | **Butunlay olib tashlandi (v2.0.0)** | Platforma bo'sh boshlanadi: birinchi ochilishda **Founder akkaunti** yaratiladi. Namuna ma'lumot faqat `tools/tests/fixtures.js` ichida (test uchun). |
| MVP qamrovi | **Asosiy** | Baza + login + talaba kabineti + admin panel + fayl yuklash + xavfsizlik. |

### Muhim eslatma (lokal rejim)
Lokal rejimda har bir qurilma o'z ma'lumotini saqlaydi: talaba telefonda topshirgan vazifa adminning
noutbukida ko'rinmaydi. Ko'p qurilmali ishlash uchun baza (Supabase) kerak — u tayyor bo'lishi bilan
o'tish **15 daqiqalik ish** (sxema va login tizimi shunga tayyor quriladi).

### HEMIS + nick tizimi (loyiha chizig'i)
1. **Admin → Talaba qo'shish**: Ism, familiya, telefon, **HEMIS ID**, jamoa.
2. Tizim shu HEMIS ID uchun **takrorlanmaydigan nick** generatsiya qiladi (misol: `lochin7`).
3. Admin **"Kirish kartochkasi"** ni ko'radi: *Nick + parol* → chop etish / nusxalash / Telegramga yuborish.
4. **Talaba kirishi**: Nick (yoki HEMIS ID) + parol. HEMIS ID tashqariga oshkor qilinmaydi — faqat baza ichida saqlanadi.
5. Bir HEMIS ID ikkinchi marta kiritilsa — tizim ogohlantiradi (takror taqiqlanadi).

---

## 8. Real ma'lumotlarni qabul qilish tartibi (tayyor)

Platformada namuna ma'lumot **yo'q** (v2.0.0 da butunlay olib tashlandi). Haqiqiy ro'yxat endi **platformaning o'zida** yuklanadi (v2.1.0):

**Sifat nazorati (v2.3.1):** har bir sahifa va modal uchun avtomatik audit — `npm run test:ui` KPI qiymatlari
siljishini, jadval ustunlarida matn kesilishini, `NaN/undefined` va gorizontal toshishni topadi; `npm test`da
26-guruh sifatida ham ishlaydi.

**Dizayn (v2.3.0):** interfeys qayta-qayta ko'zdan kechirildi va yagona dizayn tiliga keltirildi — emoji o'rniga
68 ta o'z SVG ikonkasi, parol ko'zi, bosmaga tayyor kirish kartochkasi (A4), skrol-spy navigatsiya, mikro-animatsiya,
yopishqoq jadval sarlavhasi, laptop zichligi (1568×768) va mobil sayqal.

**Kirish modeli (v2.2.1):** talaba **faqat nick** bilan kiradi. HEMIS ID ni talaba klubga (adminga) topshiradi;
admin uni ro'yxatga olishda kiritadi va tizim **bitta unikal nick** beradi (bitta HEMIS ID = bitta nick = bitta akkaunt).

**Admin → Talabalar → «CSV import»** → fayl tanlanadi → tekshiruv hisoboti (qabul/xato/ogohlantirish)
→ tasdiqlangach talabalar, akkauntlar va jamoalar avtomatik yaratiladi, kirish kartochkalari chiqadi.
Kod o'zgartirish yoki qayta deploy **kerak emas**. Xato fayl yuklansa — «Importni bekor qilish» tugmasi shu import natijasini butunlay qaytaradi. (CLI varianti `tools/import-talabalar.js` arxiv sifatida qoladi.)

| # | Qadam | Kim | Vaqt |
|---|---|---|---|
| 1 | Ma'lumot faylini yuborasiz (Excel / CSV / Google Sheet) | Siz | — |
| 2 | `node tools/import-talabalar.js <fayl> --write` — tekshiruv + nick generatsiyasi | Men | 2 daq |
| 3 | Hisobotdagi xatolarni tuzatamiz (12 xona bo'lmagan HEMIS, takrorlar, bo'sh ism) | Birga | 5 daq |
| 4 | Real ma'lumot bazaga joylanadi (`--write`), har biriga nick + kirish kartochkasi | Men | 20 daq |
| 5 | Jamoalar va mentorlar haqiqiy ro'yxatga moslanadi | Men | 10 daq |
| 6 | Har talaba uchun **Kirish kartochkasi** (nick + HEMIS) tayyorlanadi | Men | 5 daq |
| 7 | Testlar (261 ta) + qayta deploy + jonli tekshiruv | Men | 15 daq |

**Kerakli ustunlar (shablon: `docs/talabalar-shabloni.csv`):**

| Ustun | Majburiy? | Izoh |
|---|---|---|
| `ism_familiya` | ✅ | To'liq ism |
| `hemis_id` | ✅ | Aynan 12 xona raqam |
| `telefon` | ➖ | Takrorlanmasa yaxshi |
| `jamoa` | ➖ | Bo'sh qolsa «jamoasiz» |
| `telegram` | ➖ | @username |
| `maqsad` | ➖ | Nima uchun o'qiyapti |

**Vosita imkoniyatlari** (`tools/import-talabalar.js`):
- Ajratuvchi: `,` `;` yoki Tab — avtomatik aniqlanadi (Excel'dan saqlangan CSV ham ishlaydi)
- Ustunlarning turli nomlarini taniydi (`ism`, `F.I.Sh`, `name`, `talaba`...)
- Xatolar: 12 xona bo'lmagan HEMIS, takrorlangan HEMIS, bo'sh/qisqa ism → **import qilinmaydi**
- Ogohlantirishlar: telefonsiz talaba, takrorlangan telefon, jamoasiz talaba
- Har talabaga ilovadagi bir xil so'z ro'yxatidan **unikal nick** beriladi
- `--write` bilan `data/talabalar.json` yoziladi (keyingi qadamga tayyor)

**Adminlar bo'yicha ham shu tartib:** ism + email + rol (7 rol mavjud: founder, bosh mentor, mentor, kontent menejer, kurator va h.k.)
→ platformada **Adminlar → Admin qo'shish** orqali kiritamiz, har biriga kirish kartochkasi va ruxsatlar to'plami beriladi.
Hozir faqat siz yaratgan Founder akkaunti mavjud.
