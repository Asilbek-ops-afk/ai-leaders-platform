#!/usr/bin/env node
/* ============================================================================
   AI Leaders — real ma'lumotlarni qabul qilish vositasi
   ----------------------------------------------------------------------------
   Ishlatish:
     node tools/import-talabalar.js data/talabalar.csv            # tekshirish + hisobot
     node tools/import-talabalar.js data/talabalar.csv --write    # data/talabalar.json yozadi
     node tools/import-talabalar.js data/talabalar.xlsx           # (avval CSV ga o'giring)

   Nima qiladi:
     1) CSV ni o'qiydi (ajratuvchi: , ; \t — avtomatik aniqlanadi)
     2) Har qatorni tekshiradi: ism, HEMIS ID (12 xona, takrorlanmas), telefon, jamoa
     3) Har HEMIS ID uchun unikal nick yaratadi (ilovadagi bir xil so'z ro'yxatidan)
     4) Jamoa va mentorlarni mavjud tuzilmaga moslaydi
     5) Hisobot chiqaradi: xatolar, takrorlar, jamoa bo'yicha taqsimot
     6) --write bilan data/talabalar.json tayyorlaydi (keyin ilova seed'iga joylanadi)
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'app-1-core.js');

/* --- Nick so'z ro'yxatini ilovaning o'zidan olamiz (yagona manba) --- */
function loadNickWords() {
  try {
    const src = fs.readFileSync(SRC, 'utf8');
    const m = src.match(/const NICK_WORDS = \(([\s\S]*?)\)\.split/);
    if (!m) return ['falcon', 'onyx', 'comet', 'zephyr', 'nova'];
    const words = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]).join(' ').split(/\s+/);
    return [...new Set(words)].filter(Boolean);
  } catch (e) { return ['falcon', 'onyx', 'comet', 'zephyr', 'nova']; }
}

/* --- CSV o'qish (qo'shtirnoq ichidagi ajratuvchilarni ham to'g'ri o'qiydi) --- */
function detectSep(line) {
  const cand = [',', ';', '\t'];
  let best = ',', bestN = -1;
  cand.forEach(c => { const n = line.split(c).length; if (n > bestN) { bestN = n; best = c; } });
  return best;
}
function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = clean.split('\n').filter(l => l.trim() !== '');
  if (!lines.length) return [];
  const sep = detectSep(lines[0]);
  const rows = [];
  let cur = [], cell = '', inQ = false;
  const push = () => { cur.push(cell.trim()); cell = ''; };
  const pushRow = () => { if (cur.length) { rows.push(cur); cur = []; } };
  for (const line of lines) {
    inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cell += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === sep) push();
      else cell += ch;
    }
    push(); pushRow();
  }
  return rows;
}

const digits = v => String(v == null ? '' : v).replace(/\D/g, '');
const norm = v => String(v == null ? '' : v).trim();

/* --- Ustun nomlarini moslash (turli variantlar bilan ishlaydi) --- */
const ALIASES = {
  name: ['ism', 'ism_familiya', 'ism familiya', 'f.i.sh', 'fish', 'name', 'talaba', 'fio'],
  hemis: ['hemis', 'hemis_id', 'hemisid', 'hemis id', 'hemis raqami', 'id'],
  phone: ['telefon', 'phone', 'tel', 'raqam', 'telefon raqami'],
  group: ['jamoa', 'group', 'guruh', 'komanda', 'team'],
  tg: ['telegram', 'tg', 'telegram_username', 'username'],
  goal: ['maqsad', 'goal', 'maqsadi', 'izoh']
};
function mapHeader(cells) {
  const map = {};
  cells.forEach((c, i) => {
    const low = norm(c).toLowerCase();
    for (const key of Object.keys(ALIASES)) {
      if (map[key] !== undefined) continue;
      if (ALIASES[key].some(a => low === a || low.startsWith(a))) { map[key] = i; break; }
    }
  });
  return map;
}
function makeNickGen(words, taken) {
  const free = words.filter(w => !taken.has(w));
  const pick = () => {
    if (free.length) { const i = Math.floor(Math.random() * free.length); return free.splice(i, 1)[0]; }
    let n = 2; while (taken.has('leader' + n)) n++;
    return 'leader' + n;
  };
  return () => { let n = pick(); while (taken.has(n)) n = pick(); taken.add(n); return n; };
}

function main() {
  const args = process.argv.slice(2);
  const file = args.find(a => !a.startsWith('--'));
  const write = args.includes('--write');
  if (!file) {
    console.log('\nIshlatish: node tools/import-talabalar.js <fayl.csv> [--write]\n');
    console.log('Shablon: docs/talabalar-shabloni.csv\n');
    process.exit(2);
  }
  if (!fs.existsSync(file)) { console.error('✖ Fayl topilmadi: ' + file); process.exit(2); }
  if (/\.xlsx?$/i.test(file)) {
    console.error('\n✖ Excel fayl to‘g‘ridan-to‘g‘ri o‘qilmaydi.');
    console.error('  Excel → «Save as / Save as CSV» qilib saqlang, keyin shu skriptni ishlating.\n');
    process.exit(2);
  }

  const rows = parseCSV(fs.readFileSync(file, 'utf8'));
  if (rows.length < 2) { console.error('✖ Faylda sarlavha va kamida bitta qator bo‘lishi kerak.'); process.exit(2); }

  const map = mapHeader(rows[0]);
  const missing = ['name', 'hemis'].filter(k => map[k] === undefined);
  if (missing.length) {
    console.error('✖ Ustunlar topilmadi: ' + missing.join(', '));
    console.error('  Sarlavha qatorida kamida «ism_familiya» va «hemis_id» bo‘lishi kerak.');
    console.error('  Sizning sarlavha: ' + rows[0].join(' | '));
    process.exit(2);
  }

  const words = loadNickWords();
  const taken = new Set();
  const nextNick = makeNickGen(words, taken);
  const ok = [], errors = [], warnings = [], seenHemis = new Map(), seenPhone = new Map();

  rows.slice(1).forEach((r, i) => {
    const lineNo = i + 2;
    const name = norm(r[map.name]);
    const hemis = digits(r[map.hemis]);
    const phone = map.phone !== undefined ? norm(r[map.phone]) : '';
    const group = map.group !== undefined ? norm(r[map.group]) : '';
    const tg = map.tg !== undefined ? norm(r[map.tg]) : '';
    const goal = map.goal !== undefined ? norm(r[map.goal]) : '';

    if (/^namuna/i.test(name) || /^namuna/i.test(norm(r[map.name]).slice(0, 12))) {
      warnings.push('Qator ' + lineNo + ': shablon namunasi — keyin o‘chiriladi'); return;
    }
    if (!name || name.length < 3) { errors.push('Qator ' + lineNo + ': ism juda qisqa («' + name + '»)'); return; }
    if (!hemis) { errors.push('Qator ' + lineNo + ': HEMIS ID yo‘q'); return; }
    if (hemis.length !== 12) { errors.push('Qator ' + lineNo + ': HEMIS ID ' + hemis.length + ' xona (12 bo‘lishi shart) — ' + hemis); return; }
    if (seenHemis.has(hemis)) { errors.push('Qator ' + lineNo + ': HEMIS ID takrorlandi (' + hemis + ') — birinchi marta ' + seenHemis.get(hemis) + '-qatorda'); return; }
    seenHemis.set(hemis, lineNo);
    if (phone) {
      const pd = digits(phone);
      if (seenPhone.has(pd)) warnings.push('Qator ' + lineNo + ': telefon takrorlangan (' + phone + ') — ' + seenPhone.get(pd) + '-qatorda');
      else seenPhone.set(pd, lineNo);
    } else warnings.push('Qator ' + lineNo + ': telefon yo‘q (talaba keyin kiritishi mumkin)');
    if (!group) warnings.push('Qator ' + lineNo + ': jamoa ko‘rsatilmagan — «jamoasiz» sifatida qo‘shiladi');

    ok.push({ name, hemisId: hemis, phone: phone || null, group: group || null, tg: tg || null, goal: goal || null, nick: nextNick(), hemisShort: '•••• ' + hemis.slice(-4) });
  });

  /* Jamoa bo'yicha taqsimot */
  const byGroup = {};
  ok.forEach(s2 => { const g = s2.group || '(jamoasiz)'; byGroup[g] = (byGroup[g] || 0) + 1; });

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  AI LEADERS — TALABALAR IMPORT HISOBOTI');
  console.log('════════════════════════════════════════════════════════');
  console.log('  Fayl:            ' + file);
  console.log('  O‘qilgan qator:  ' + (rows.length - 1));
  console.log('  Qabul qilindi:   ' + ok.length);
  console.log('  Xato:            ' + errors.length);
  console.log('  Ogohlantirish:   ' + warnings.length);
  console.log('────────────────────────────────────────────────────────');
  if (ok.length) {
    console.log('  Jamoalar bo‘yicha:');
    Object.keys(byGroup).sort().forEach(g => console.log('    • ' + g.padEnd(14) + byGroup[g] + ' ta'));
    console.log('────────────────────────────────────────────────────────');
    console.log('  Birinchi 5 talaba (nick bilan):');
    ok.slice(0, 5).forEach(s2 => console.log('    ' + s2.nick.padEnd(12) + s2.name.padEnd(24) + s2.hemisShort + (s2.group ? '  • ' + s2.group : '')));
    if (ok.length > 5) console.log('    … yana ' + (ok.length - 5) + ' ta');
  }
  if (warnings.length) { console.log('────────────────────────────────────────────────────────'); console.log('  Ogohlantirishlar:'); warnings.slice(0, 12).forEach(w => console.log('    ! ' + w)); if (warnings.length > 12) console.log('    … yana ' + (warnings.length - 12)); }
  if (errors.length) { console.log('────────────────────────────────────────────────────────'); console.log('  XATOLAR (tuzatilmasa import qilinmaydi):'); errors.slice(0, 20).forEach(e => console.log('    ✖ ' + e)); if (errors.length > 20) console.log('    … yana ' + (errors.length - 20)); }
  console.log('════════════════════════════════════════════════════════\n');

  if (write) {
    if (errors.length) { console.error('✖ Xatolar bor — fayl yozilmadi. Avval ularni tuzating.'); process.exit(1); }
    const out = {
      meta: { source: path.basename(file), generated: new Date().toISOString().slice(0, 10), count: ok.length, version: 1 },
      students: ok,
      groups: [...new Set(ok.map(s2 => s2.group).filter(Boolean))]
    };
    const outFile = path.join(ROOT, 'data', 'talabalar.json');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log('✔ Yozildi: ' + path.relative(ROOT, outFile) + '  (' + ok.length + ' talaba, ' + out.groups.length + ' jamoa)\n');
    console.log('  Keyingi qadam: bu fayl ilova seed‘iga joylanadi (namunalar o‘chirilib) va sayt qayta deploy qilinadi.\n');
  }
  process.exit(errors.length ? 1 : 0);
}
main();
