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
3. **Hozirgi demo ma'lumotlar** (18 talaba, 6 jamoa) taqdiri.
4. **MVP qamrovi:** asosiy / +Telegram eslatmalar / +to'liq Telegram bot.

> Savollarga javob bergach, 1-bosqichdan darhol boshlaymiz. Real ma'lumotlar jadvali (talaba ismlari, telefonlari, jamoalar)
> tayyor bo'lsa — 5-bosqichda uni tartib bilan bazaga joylashtiraman.

---

## 7. Tanlangan qarorlar (foydalanuvchi javoblari)

| Savol | Qaror | Izoh |
|---|---|---|
| Ma'lumotlar bazasi | **Hozircha lokal** (brauzer xotirasi) | Login tizimi shunday quriladiki, keyin bazaga o'tilganda qayta yozilmaydi. Baza kalitlari tayyor bo'lsa — 15 daqiqada ulanadi. |
| Kirish usuli | **HEMIS ID + unikal nick** | Talaba bizga HEMIS ID topshiradi → biz bazaga kiritamiz → har bir HEMIS ID uchun **bitta alohida nick** beriladi (21-school uslubida). Bitta HEMIS ID = bitta foydalanuvchi. |
| Demo ma'lumotlar | **Real ma'lumot kelguncha qolsin** | Siz jadvalni berganingizda ustiga real ma'lumot qo'shiladi, namunalar keyin o'chiriladi. |
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
