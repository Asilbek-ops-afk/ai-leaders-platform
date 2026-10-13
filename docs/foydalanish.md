# AI Leaders — foydalanish yo'riqnomasi (klub admini uchun)

Bu hujjat platformani **kundalik ishda** qanday ishlatish kerakligini tushuntiradi.

## 1. Kirish va rollar

| Rol | Kim uchun | Nima qiladi |
|---|---|---|
| **Student** | Klub a'zosi | Darslarni o'tadi, vazifa topshiradi, jamoada ishlaydi |
| **Admin / Mentor** | Siz, mentorlar | Vazifa beradi, tekshiradi, jamoalar va statistikani boshqaradi |

Demo versiyada parol yo'q: kirish ekranida rolni tanlaysiz. Real versiyada (Supabase) har bir
foydalanuvchi o'z email/telegram bilan kiradi va faqat o'z bo'limlarini ko'radi.

## 2. Haftalik ish jarayoni (tavsiya etilgan ritm)

**Dushanba** — yangi modul darsi va vazifa berish:
`Vazifalar → Yangi vazifa` (modul, deadline, kimga) → talabalarga bildirishnoma avtomatik ketadi.

**Seshanba–Payshanba** — kuzatuv:
`Dashboard` da tekshirish navbati va kechikkanlarni ko'rasiz. `Talabalar → Kechikkan` filtri
bilan kim yordamga muhtojligini aniqlaysiz, 🔔 tugmasi orqali eslatma yuborasiz.

**Juma** — tekshirish va baholash:
`Vazifalar → Tekshirish` → havolani ochib ko'rasiz, 0–100 baho va izoh yozasiz.
Qabul qilingan vazifa talabaga +60 XP beradi va keyingi modulni ochadi.

**Shanba** — jamoa kuni:
`Jamoalar` bo'limida har jamoa loyihasiga 15 daqiqa ajratasiz. Jamoalar devorida standup yozuvlarini tekshirasiz.

**Yakshanba** — xulosa:
`Statistika` → haftalik faollik, o'z vaqtida topshirish %, reyting. `CSV hisobot` yuklab olasiz.

## 3. Jamoani tuzish qoidalari

- Har jamoada **3–4 kishi**: 1 builder (texnik), 1 dizayner, 1 growth (marketing/sotuv).
- Har bir yangi talabaga **mentor yoki kuchli talaba** juft qilib beriladi (peer-to-peer modeli).
- Jamoa nomi qisqa bo'lsin (Nova, Orbit, Vertex) — bu brend bo'ladi.
- Birinchi jamoaviy vazifa: "muammoni 3 gapda yozing" — bu eng qiyin qismi.

## 4. Deadline siyosati (klub ichidagi qoida)

| Holat | Harakat |
|---|---|
| 3 kun qoldi | Tizim avtomatik eslatadi (bildirishnoma) |
| Muddati o'tdi | Status "Kechikkan" bo'ladi, mentor 🔔 orqali bog'lanadi |
| Jamoa individual surish so'raydi | `Deadline belgilash` → jamoaga alohida sana beriladi |
| 2 hafta jimlik | Talaba "Jim" filtriga tushadi → mentor qo'ng'iroq qiladi |

## 5. Baholash mezonlari (0–100)

| Ball | Ma'nosi |
|---|---|
| 90–100 | Namunali — Galereyaga chiqarish mumkin |
| 75–89 | Yaxshi — kichik izohlar bilan qabul |
| 60–74 | Bajarilgan, lekin sayoz — qayta ishlashga yuborish |
| < 60 | Qayta ishlash: aniq 3 ta tuzatish yozib bering |

**Muhim:** izoh har doim 3 qismdan bo'lsin — (1) nima yaxshi bo'ldi, (2) nima yaxshilanadi, (3) keyingi qadam.

## 6. O'quvchini ushlab turish usullari (platforma ichida)

1. **Kunlik questlar** — talaba har kuni bir marta kirsa, +XP oladi. Streak uzilmasligi muhim.
2. **Haftalik reyting** — `Friends → Reyting`. G'olibni Telegramda e'lon qiling.
3. **Jamoalar musobaqasi** — jamoalar XP bo'yicha yarishadi; yutgan jamoa Demo Day'da stend oladi.
4. **Galereya** — haftada 1–2 loyihani chiqaring; bu talaba uchun kuchli motivatsiya.
5. **Sertifikat** — har modul oxirida; chop etib, qo'lda topshirish mumkin (offline uchrashuvda).
6. **Demo Day** — oyiga bir marta offline: 5 jamoa × 5 daqiqa pitch.

## 7. Zaxira va xavfsizlik

- **Har hafta** `Sozlamalar → Zaxira nusxa yuklab olish (JSON)` ni bosib faylni Google Drive'ga saqlang.
- Zaxiradan tiklash: o'sha sahifadagi `Zaxiradan tiklash` maydoniga faylni tanlang.
- Demo rejim ma'lumotlari faqat brauzerda saqlanadi — boshqa kompyuterda ko'rinmaydi.
  Ko'p qurilmali ishlash uchun Supabase'ga o'tish kerak (`schema/supabase.sql`).

## 8. Tez-tez beriladigan savollar

**Talaba darsni ko'ra olmayapti?** — Modul qulfi: oldingi modul vazifasi qabul qilinmagan.
`Vazifalar` bo'limida uni tekshirib, qabul qilib qo'ying.

**Bahoni o'zgartirish kerak?** — Ilgari baholangan topshiriqni oching → `Bahoni tahrirlash`.

**Talabani boshqa jamoaga o'tkazish?** — `Talabalar → Profil → Jamoa o'zgartirish`.

**Noto'g'ri ma'lumot kirib qoldi?** — `Sozlamalar → Demo ma'lumotlarga qaytarish` (ehtiyot bo'ling: hammasi o'chadi,
shuning uchun avval zaxira oling).
