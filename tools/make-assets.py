#!/usr/bin/env python3
"""AI Leaders — brend assetlarini generatsiya qilish (ikonlar + OG rasm).
Ishlatish: python3 tools/make-assets.py
"""
import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')
os.makedirs(OUT, exist_ok=True)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
# Merino & Venice palitrasi: #F5EEDD · #84B3CE · #16587B
PURP, BLUE, CYAN, LIME, DARK = (22, 88, 123), (47, 125, 166), (132, 179, 206), (245, 238, 221), (10, 42, 61)


def gradient(size, c1, c2, diagonal=True):
    w, h = size
    img = Image.new('RGB', size)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = ((x / w) + (y / h)) / 2 if diagonal else x / w
            t = max(0.0, min(1.0, t))
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    return img


def hexagon(cx, cy, r):
    return [(cx + r * math.cos(math.radians(-90 + 60 * i)), cy + r * math.sin(math.radians(-90 + 60 * i))) for i in range(6)]


def hex_line(draw, cx, cy, r, color, width, joint='curve'):
    pts = hexagon(cx, cy, r)
    draw.line(pts + [pts[0]], fill=color, width=width, joint=joint)


def logo(size, bg=True, scale=1.0, transparent=False, square=False):
    """Brend belgisi: hexagon + 'A' + yashil uchqun."""
    S = size * 4  # supersampling (silliq qirralar uchun)
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if bg:
        r = 0 if square else int(S * 0.22)
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=r, fill=DARK + (255,))
    cx = cy = S / 2
    hexr = S * 0.33 * scale
    grad = gradient((S, S), PURP, CYAN).convert('RGBA')
    mask = Image.new('L', (S, S), 0)
    hex_line(ImageDraw.Draw(mask), cx, cy, hexr, 255, max(3, int(S * 0.028)))
    img.paste(grad, (0, 0), mask)
    aw = hexr * 0.62                     # 'A' kengligi
    ay_top = cy - hexr * 0.52
    ay_bot = cy + hexr * 0.52
    lm = Image.new('L', (S, S), 0)
    dm = ImageDraw.Draw(lm)
    dm.line([(cx - aw, ay_bot), (cx, ay_top), (cx + aw, ay_bot)], fill=255, width=max(3, int(S * 0.05)), joint='curve')
    img.paste(grad, (0, 0), lm)
    d.line([(cx - aw * 0.55, cy + hexr * 0.06), (cx + aw * 0.55, cy + hexr * 0.06)],
           fill=LIME + (255,), width=max(3, int(S * 0.042)))
    dot = max(2, int(S * 0.028))
    for (dx, dy), col in [((0, ay_top), LIME), ((-aw, ay_bot), CYAN), ((aw, ay_bot), PURP)]:
        d.ellipse([cx + dx - dot, dy - dot, cx + dx + dot, dy + dot], fill=col + (255,))
    img = img.resize((size, size), Image.LANCZOS)
    if transparent:
        return img
    return img


def save_icon(size, name, pad_ratio=0.0, transparent=False, square=False):
    img = logo(size, bg=True, scale=0.86 if square else (1.0 - pad_ratio), transparent=transparent, square=square)
    img.save(os.path.join(OUT, name))
    return name


def og_image():
    W, H = 1200, 630
    img = Image.new('RGB', (W, H), DARK)
    d = ImageDraw.Draw(img)
    # fon gradientlari
    glow = Image.new('RGB', (W, H), DARK)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W - 620, -260, W + 180, 420], fill=(23, 92, 126))
    gd.ellipse([-260, H - 420, 420, H + 200], fill=(15, 61, 87))
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    img = Image.blend(img, glow, 0.85)
    d = ImageDraw.Draw(img)
    # nozik to'r
    for x in range(0, W, 44):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, 44):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)
    # logo
    lg = logo(210)
    img.paste(lg, (78, 74), lg)
    f_h1 = ImageFont.truetype(FB, 66)
    f_h2 = ImageFont.truetype(FR, 30)
    f_up = ImageFont.truetype(FB, 22)
    f_ch = ImageFont.truetype(FB, 24)
    f_sm = ImageFont.truetype(FR, 22)
    d.text((78, 320), 'AI LEADERS', font=f_h1, fill=(255, 255, 255))
    d.text((80, 398), 'STARTUP CLUB  •  0 DAN STARTAPGACHA', font=f_up, fill=CYAN)
    d.text((80, 448), 'Vazifa va deadline tizimi, jamoaviy loyiha,', font=f_h2, fill=(233, 240, 244))
    d.text((80, 486), 'mentor kuzatuvi va o\u2018quv yo\u2018li xaritasi.', font=f_h2, fill=(233, 240, 244))
    # chiplar
    x = 80
    for txt in ['6 modul', '29 dars', '6 jamoa', 'Demo Day']:
        w = d.textlength(txt, font=f_ch) + 44
        d.rounded_rectangle([x, 540, x + w, 588], radius=24, fill=(17, 56, 79), outline=(132, 179, 206), width=2)
        d.text((x + 22, 551), txt, font=f_ch, fill=(245, 238, 221))
        x += w + 14
    dom = 'ai-leaders-platform.pages.dev'
    d.text((W - 80 - d.textlength(dom, font=f_sm), 26), dom, font=f_sm, fill=(169, 200, 218))
    # aksent chiziq
    d.rounded_rectangle([0, H - 8, W, H], radius=0, fill=PURP)
    d.rounded_rectangle([0, H - 8, W * 0.34, H], radius=0, fill=CYAN)
    d.rounded_rectangle([0, H - 8, W * 0.12, H], radius=0, fill=LIME)
    img.save(os.path.join(OUT, 'og.png'))
    print('  og.png (1200x630)')


print('AI Leaders assetlari generatsiya qilinmoqda...')
save_icon(512, 'icon-512.png')
save_icon(192, 'icon-192.png')
save_icon(180, 'apple-touch-icon.png')
save_icon(32, 'favicon-32.png')
save_icon(512, 'icon-maskable-512.png', pad_ratio=0.2, square=True)   # maskable: to'liq fon + xavfsiz zona
og_image()
print('Tayyor ->', OUT)
