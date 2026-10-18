# Haqiqiy Gmail xabarlari — server sozlamasi

AI Leaders ro‘yxatdan o‘tish kodi, parolni tiklash kodi, ariza holati va profil/telefon o‘zgarishi haqidagi xabarlarni **Cloudflare Pages → `/api/email` → Resend** orqali yuboradi. API kalit brauzerga chiqmaydi.

> Muhim: `Gmail` talabaning **qabul qiluvchi** manzili bo‘lishi mumkin. Xatni jo‘natuvchi manzil esa Resend’da tasdiqlangan klub domeni yoki email bo‘lishi kerak. Gmail parolini sayt kodiga yozish mumkin emas.

## 1. Resend’ni tayyorlash

1. Resend’da akkaunt oching va `aileaders.uz` domenini qo‘shib, ko‘rsatilgan DNS yozuvlarini domen DNS’iga kiriting.
2. Domen tasdiqlangach jo‘natuvchini tanlang, masalan: `AI Leaders <noreply@aileaders.uz>`.
3. `Sending access` huquqli API key yarating.

Agar domen hali bo‘lmasa, Resend test rejimida faqat tasdiqlangan o‘z emailingizga yuborishi mumkin. Talabalarning turli Gmail manzillariga haqiqiy yuborish uchun tasdiqlangan domen kerak.

## 2. Cloudflare Pages secrets qo‘shish

Quyidagi buyruqlarni loyiha ildizida bajaring. Qiymatlar terminalda yashirin kiritiladi va Git’ga yozilmaydi:

```bash
npx wrangler@3 pages secret put RESEND_API_KEY --project-name=ai-leaders-platform
npx wrangler@3 pages secret put EMAIL_FROM --project-name=ai-leaders-platform
npx wrangler@3 pages secret put EMAIL_REPLY_TO --project-name=ai-leaders-platform
```

`EMAIL_FROM` uchun misol:

```text
AI Leaders <noreply@aileaders.uz>
```

`EMAIL_REPLY_TO` uchun, masalan, klub administratori Gmail manzili kiritiladi.

## 3. Tekshirish

1. Pages’ni deploy qiling.
2. Platformada **Admin → Sozlamalar → Email va xabarlar** bo‘limini oching.
3. Sinov uchun qabul qiluvchi Gmail manzilini kiriting va **Sinov xabari** tugmasini bosing.
4. Xat Inbox’da bo‘lmasa, Spam/Promotions’ni tekshiring.

`GET /api/email` faqat `configured: true/false` holatini qaytaradi; API key yoki boshqa secret hech qachon qaytmaydi.

## Xavfsizlik chegarasi

Ushbu reliz email jo‘natish kalitini serverga olib chiqadi. Ammo talaba ma’lumotlari hali MVP sifatida browser `localStorage`ida turadi. Katta oqimda keyingi zarur qadam — akkauntlar, kodlar va arizalarni Supabase/Postgres’ga ko‘chirish hamda rate-limit/Turnstile qo‘shishdir.
