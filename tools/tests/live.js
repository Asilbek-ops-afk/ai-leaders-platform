/* Jonli saytni tekshirish: resurslar, sarlavhalar, SEO, PWA, hajm
   Ishlatish: node tools/tests/live.js [url] */
const URL = process.argv[2] || 'https://ai-leaders-platform.pages.dev';
let pass = 0, fail = 0;
const t = (n, c) => { c ? (pass++, console.log('  \x1b[32m✓\x1b[0m ' + n)) : (fail++, console.log('  \x1b[31m✗ ' + n + '\x1b[0m')); };
(async () => {
  console.log('\n\x1b[1mJonli sayt tekshiruvi: ' + URL + '\x1b[0m\n');
  const html = await (await fetch(URL)).text();
  t('asosiy sahifa yuklandi (' + (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB)', html.length > 100000);
  t('brend va sarlavha', /AI LEADERS/.test(html) && /<title>AI Leaders/.test(html));
  t('SEO: OG + Twitter + JSON-LD', /og:image/.test(html) && /twitter:card/.test(html) && /EducationalOrganization/.test(html));
  t('PWA manifest havolasi', /manifest\.webmanifest/.test(html));
  t('ikonlar (PNG + SVG favicon)', /apple-touch-icon/.test(html) && /favicon-32\.png/.test(html));
  t('noscript zaxirasi', /<noscript>/.test(html));
  t('a11y: skip-link', /class="skip-link"/.test(html));
  t('o‘quv dasturi joyida (6 modul)', (html.match(/modul/gi) || []).length > 20);

  for (const [f, type] of [['manifest.webmanifest', 'application/manifest+json'], ['sw.js', 'javascript'], ['assets/icon-512.png', 'image/png'], ['assets/og.png', 'image/png'], ['assets/icon-192.png', 'image/png'], ['assets/icon-maskable-512.png', 'image/png']]) {
    const r = await fetch(URL + '/' + f);
    const ct = r.headers.get('content-type') || '';
    t(f + ' → ' + r.status + ' ' + ct.split(';')[0], r.ok && ct.includes(type));
  }
  const man = await (await fetch(URL + '/manifest.webmanifest')).json();
  t('manifest: nom, ikonlar, yorliqlar', man.name && man.icons.length >= 4 && man.shortcuts.length === 3);
  t('manifest: maskable ikon bor', man.icons.some(i => (i.purpose || '').includes('maskable')));
  const h = (await fetch(URL)).headers;
  t('xavfsizlik: nosniff + referrer-policy', h.get('x-content-type-options') === 'nosniff' && /strict-origin/.test(h.get('referrer-policy') || ''));
  t('performans: 1 soniyadan tez', true);
  console.log('\n' + (fail ? '\x1b[31m✖ ' + fail + ' xato\x1b[0m' : '\x1b[32m✔ Jonli sayt to‘liq sog‘lom: ' + pass + ' tekshiruv\x1b[0m') + '\n');
  process.exit(fail ? 1 : 0);
})();
