/* ============================================================================
   AI LEADERS — Cloudflare Pages email endpoint
   POST /api/email  → Resend transactional email API

   Maxfiy qiymatlar faqat Cloudflare Pages secrets sifatida beriladi:
   - RESEND_API_KEY
   - EMAIL_FROM       masalan: AI Leaders <noreply@aileaders.uz>
   - EMAIL_REPLY_TO   (ixtiyoriy)

   Bu fayl build vaqtida dist/_worker.js ga nusxalanadi. Kalitlar hech qachon
   brauzerga yoki Git repoga chiqmaydi.
   ========================================================================== */

const EMAIL_KINDS = new Set([
  'reg-code', 'approved', 'welcome', 'rejected', 'reset', 'reset-done',
  'custom', 'test', 'profile-updated', 'phone-change-code', 'phone-changed'
]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=UTF-8', 'cache-control': 'no-store' }
  });
}
function safeText(v, max) { return String(v == null ? '' : v).trim().slice(0, max); }
function escapeHtml(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function emailHtml(subject, text) {
  const body = escapeHtml(text).replace(/\n/g, '<br>');
  return '<!doctype html><html lang="uz"><body style="margin:0;background:#0a0f1e;color:#eef2ff;font-family:Arial,sans-serif">' +
    '<div style="max-width:600px;margin:0 auto;padding:28px 16px">' +
    '<div style="padding:22px 24px;border:1px solid #28345d;border-radius:18px;background:#10182c">' +
    '<div style="font-weight:800;letter-spacing:.09em;color:#c6ff4f;font-size:12px">AI LEADERS · STARTUP CLUB</div>' +
    '<h1 style="font-size:22px;line-height:1.3;margin:18px 0 14px;color:#fff">' + escapeHtml(subject) + '</h1>' +
    '<div style="font-size:15px;line-height:1.75;color:#d7def5">' + body + '</div>' +
    '<hr style="border:0;border-top:1px solid #28345d;margin:22px 0 15px">' +
    '<div style="font-size:12px;line-height:1.55;color:#9ba8cd">Bu avtomatik xabar AI Leaders Startup Club platformasidan yuborildi. Agar bu so‘rov sizdan bo‘lmasa, xatni e’tiborsiz qoldiring yoki klub administratori bilan bog‘laning.</div>' +
    '</div></div></body></html>';
}
function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch (e) { return false; }
}

async function sendWithResend(env, message) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return { configured: false };
  const payload = {
    from: env.EMAIL_FROM,
    to: [message.to],
    subject: message.subject,
    text: message.text,
    html: emailHtml(message.subject, message.text)
  };
  if (env.EMAIL_REPLY_TO) payload.reply_to = env.EMAIL_REPLY_TO;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  let data = {};
  try { data = await response.json(); } catch (e) { }
  if (!response.ok) return { configured: true, ok: false, status: response.status, provider: data };
  return { configured: true, ok: true, id: data.id || '' };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/email') return env.ASSETS.fetch(request);

    if (request.method === 'GET') {
      /* API keyni hech qachon oshkor qilmaydi; admin faqat konfiguratsiya holatini ko‘radi. */
      return json({ ok: true, configured: !!(env.RESEND_API_KEY && env.EMAIL_FROM), provider: 'resend' });
    }
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
    /* Brauzerdan faqat shu Pages domeni so‘rov yuborishi mumkin. */
    if (!sameOrigin(request)) return json({ ok: false, error: 'origin_forbidden' }, 403);

    let body;
    try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad_json' }, 400); }
    const kind = safeText(body.kind, 40);
    const to = safeText(body.to, 254).toLowerCase();
    const subject = safeText(body.subject, 180);
    const text = safeText(body.text, 8000);
    if (!EMAIL_KINDS.has(kind)) return json({ ok: false, error: 'kind_forbidden' }, 400);
    if (!EMAIL_RE.test(to) || !subject || !text) return json({ ok: false, error: 'invalid_message' }, 400);

    const result = await sendWithResend(env, { to, subject, text });
    if (!result.configured) return json({ ok: false, error: 'not_configured' }, 503);
    if (!result.ok) {
      /* Provider xatosining ichki tafsilotini tashqariga chiqarmaymiz. */
      return json({ ok: false, error: 'provider_failed', status: result.status }, 502);
    }
    return json({ ok: true, id: result.id });
  }
};
