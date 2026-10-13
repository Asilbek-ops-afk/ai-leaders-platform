#!/usr/bin/env node
/* AI Leaders — build: src/*.js + src/style.css -> index.html (bitta mustaqil fayl) */
const fs = require('fs'), path = require('path');
const root = __dirname, src = path.join(root, 'src');
const order = ['app-1-core.js', 'app-2-student.js', 'app-3-admin.js', 'app-4-app.js'];
const css = fs.readFileSync(path.join(src, 'style.css'), 'utf8');
const js = order.map(f => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
if (js.includes('</script')) throw new Error('XATO: JS ichida </script> bor — inline qilib bo‘lmaydi');
const tpl = fs.readFileSync(path.join(src, 'template.html'), 'utf8');
const out = tpl.replace('/*__CSS__*/', css).replace('/*__JS__*/', js);
fs.writeFileSync(path.join(root, 'index.html'), out);
const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log('✔ index.html yaratildi: ' + kb + ' KB, ' + out.split('\n').length + ' qator');
