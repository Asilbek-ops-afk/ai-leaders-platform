# AI Leaders — ishga tushirish rejasi (30 kun)

## 1-hafta: poydevor
- Platformani real ma'lumot bilan to'ldirish (talabalar ro'yxati, telegram username, telefon).
- Klub nomi, logotip va brendni Instagram/Telegramda bir xil qilib qo'yish.
- 1-modul darslarini tekshirish va 1-vazifa deadline'ini belgilash.

## 2-hafta: birinchi oqim
- 10–15 talabadan iborat birinchi guruhni qabul qilish (anketa: maqsad, qurilma, kuniga vaqt).
- Har bir talabaga mentor biriktirish (peer-to-peer: kuchli talaba yangiga yordam beradi).
- Kunlik streak tizimini Telegram orqali eslatib borish (21:00 da standup).

## 3-hafta: jamoa va musobaqa
- 3–4 kishilik jamoalar tuzish, har biriga loyiha g'oyasi berish.
- Jamoalar o'rtasida haftalik XP musobaqasi, g'olib jamoaga kichik sovrin.
- Galereyaga eng yaxshi 3 ishni chiqarish (ijtimoiy tarmoqda e'lon qilish bilan).

## 4-hafta: ommaviy ishga tushirish
- Instagram: har kuni 1 Reels — "talaba loyihasi 2 haftada qanday qurildi" formati.
- Telegram: haftalik e'lon + demo video; qabul havolasi (Google Form → platforma).
- Offline demo-kun: 5 jamoa × 5 daqiqa pitch. Mehmonlar: startup asoschilari, IT kompaniyalar.

## Metrikalar (har hafta oxirida o'lchash)
| Ko'rsatkich | Maqsad (1-oy) |
|---|---|
| Haftalik faol talabalar | 70%+ |
| O'z vaqtida topshirish | 60%+ |
| 1-modulni tugatganlar | 80%+ |
| Loyihasini chiqarganlar | 30%+ |
| 2-guruhga yozilish | 1-oqim bitgach |

## Keyingi bosqich (2–3-oy)
- 2-oqim qabuli + mentorlar sonini oshirish.
- To'lov modeli: birinchi modul bepul → keyingi modullar obuna yoki "ishga joylashgach to'lov".
- Hamkorlik: IT kompaniyalar bilan stajirovka, investorlar bilan Demo Day.

## Texnik keyingi qadam (real backend)
1. Supabase loyihasi ochish → `students`, `groups`, `lessons`, `tasks`, `submissions`, `walls`, `notifications` jadvallari.
2. `src/app-1-core.js` dagi `save()` va `loadState()` ni Supabase chaqiruvlariga almashtirish (qolgan kod o'zgarmaydi).
3. Telegram-bot: deadline eslatmalari va streak uchun (kuniga 21:00 da standup xabari).
