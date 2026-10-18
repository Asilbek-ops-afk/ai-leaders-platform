#!/usr/bin/env node
/* AI Leaders — build: src/*.js + src/style.css -> index.html (bitta mustaqil fayl) */
const fs = require('fs'), path = require('path');
const root = __dirname, src = path.join(root, 'src'), server = path.join(root, 'server');
const order = ['app-1-core.js', 'app-2-student.js', 'app-3-admin.js', 'app-4-app.js', 'app-5-craft.js', 'app-6-auth.js'];
/* style.css + premium.css — bitta uslublar to'plami (premium keyin qo'shiladi) */
const css = ['style.css', 'premium.css', 'craft.css', 'reg.css'].map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
const js = order.map(f => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
if (js.includes('</script')) throw new Error('XATO: JS ichida </script> bor — inline qilib bo‘lmaydi');
const tpl = fs.readFileSync(path.join(src, 'template.html'), 'utf8');
const out = tpl.replace('/*__CSS__*/', css).replace('/*__JS__*/', js);
fs.writeFileSync(path.join(root, 'index.html'), out);
/* deploy papkasi (Cloudflare Pages uchun) */
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), out);
fs.copyFileSync(path.join(root, 'manifest.webmanifest'), path.join(dist, 'manifest.webmanifest'));
fs.copyFileSync(path.join(root, 'sw.js'), path.join(dist, 'sw.js'));
/* Cloudflare Pages Advanced Mode: /api/email server worker (secrets faqat Cloudflare'da) */
fs.copyFileSync(path.join(server, 'email-worker.js'), path.join(dist, '_worker.js'));
fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'assets'))) {
  fs.copyFileSync(path.join(root, 'assets', f), path.join(dist, 'assets', f));
}
fs.writeFileSync(path.join(dist, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: geolocation=(), microphone=(), camera=()',
  '  X-Frame-Options: SAMEORIGIN',
  '',
  '/index.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  '/sw.js',
  '  Cache-Control: no-cache',
  '',
  '/assets/*',
  '  Cache-Control: public, max-age=604800, immutable',
  ''].join('\n'));
const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log('✔ index.html yaratildi: ' + kb + ' KB, ' + out.split('\n').length + ' qator');
