from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "demo-video"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT = OUT_DIR / "xpressintra-demo-video.gif"
LOGO = ROOT / "public" / "xpressbudet-logo-transparent.png"
W, H = 1280, 720
FPS = 4
DURATION = 58


def font(size, bold=False):
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


F = {
    "tiny": font(13, True),
    "small": font(16, True),
    "body": font(20),
    "body_bold": font(20, True),
    "title": font(42, True),
    "hero": font(56, True),
    "phone_title": font(24, True),
}

logo = Image.open(LOGO).convert("RGBA") if LOGO.exists() else None

scenes = [
    (0, 5, "intro", "EkspressIntra", "En intern mobilapp til chauffører, kontor og drift."),
    (5, 12, "home", "Forsiden samler hverdagen", "Dagens beskeder, opgaver og hurtige handlinger ligger klar med det samme."),
    (12, 19, "work", "Mød ind med klare valg", "Arbejdsdagen starter med tydelige valg for GPS, logbog og notifikationer."),
    (19, 27, "map", "Live-kort med frivillig deling", "Kontoret kan følge aktive positioner, mens medarbejderen selv styrer deling og varighed."),
    (27, 35, "pickup", "Afhentningsopgaver trin for trin", "Opgaver får status, afhentningssted, afleveringssted, reference og tjekliste."),
    (35, 43, "chat", "Beskeder uden støj", "Fælleschat, direkte beskeder og notifikationer holder drift og chauffører samlet."),
    (43, 50, "info", "InfoCenter til hurtige svar", "Guides, landeregler, tjeklister og dokumentlinks ligger klar i mobilen."),
    (50, 56, "admin", "Chef-overblik på en rolig måde", "Roller, medarbejdere, køretøjer og rettigheder kan styres med tydelig sikkerhed."),
    (56, 58, "outro", "Klar til sikker demo", "Kan vises som video fra USB uden login, database eller installation."),
]


def current_scene(t):
    for scene in scenes:
        if scene[0] <= t < scene[1]:
            return scene
    return scenes[-1]


def ease(x):
    x = max(0, min(1, x))
    return 3 * x * x - 2 * x * x * x


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paste_logo(img, x, y, width, alpha=255):
    if not logo:
        ImageDraw.Draw(img).text((x, y), "XpressBudet", fill="#f4efe5", font=F["title"])
        return
    ratio = logo.height / logo.width
    mark = logo.resize((width, int(width * ratio)), Image.LANCZOS)
    if alpha < 255:
        layer = Image.new("RGBA", mark.size, (255, 255, 255, 0))
        layer.alpha_composite(mark)
        mask = layer.getchannel("A").point(lambda p: int(p * alpha / 255))
        mark.putalpha(mask)
    img.alpha_composite(mark, (x, y))


def wrap(draw, text, max_width, font_obj):
    words = text.split()
    lines, line = [], ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=font_obj) > max_width and line:
            lines.append(line)
            line = word
        else:
            line = test
    if line:
        lines.append(line)
    return lines


def draw_wrapped(draw, text, x, y, max_width, font_obj, fill, line_height):
    for line in wrap(draw, text, max_width, font_obj):
        draw.text((x, y), line, fill=fill, font=font_obj)
        y += line_height
    return y


def bg(t):
    img = Image.new("RGBA", (W, H), "#071727")
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        shade = int(18 + 24 * y / H)
        draw.line([(0, y), (W, y)], fill=(4, shade, 32, 255))
    for i in range(16):
        x = int((i * 123 + t * 22) % (W + 220)) - 110
        y = 80 + (i % 6) * 88
        color = (244, 166, 65, 34) if i % 2 else (117, 182, 154, 32)
        draw.line([(x, y), (x + 190, y - 46)], fill=color, width=2)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    gd.ellipse((245, 60, 820, 560), fill=(244, 166, 65, 28))
    glow = glow.filter(ImageFilter.GaussianBlur(85))
    img.alpha_composite(glow)
    return img


def phone_card(draw, x, y, w, h, title, body, accent="#f4a641"):
    rounded(draw, (x, y, x + w, y + h), 14, rgba("#102a3e"), rgba("#ffffff", 34), 1)
    rounded(draw, (x + 12, y + 12, x + 42, y + 42), 15, rgba(accent, 42))
    draw.text((x + 23, y + 13), "•", fill=accent, font=F["phone_title"])
    draw.text((x + 54, y + 15), title, fill="#f4efe5", font=F["small"])
    draw_wrapped(draw, body, x + 54, y + 41, w - 68, F["tiny"], "#91a0a9", 16)


def draw_phone(img, key):
    draw = ImageDraw.Draw(img, "RGBA")
    px, py, pw, ph = 92, 62, 304, 615
    rounded(draw, (px, py, px + pw, py + ph), 36, rgba("#09101a"), rgba("#ffffff", 55), 2)
    rounded(draw, (px + 13, py + 36, px + pw - 13, py + ph - 38), 24, rgba("#071727"), rgba("#ffffff", 24), 1)
    rounded(draw, (px + 112, py + 18, px + 192, py + 25), 6, rgba("#ffffff", 45))
    sx, sy, sw, sh = px + 13, py + 36, pw - 26, ph - 74
    draw.rectangle((sx, sy, sx + sw, sy + sh), fill="#071727")

    if key in ("intro", "outro"):
        paste_logo(img, sx + 54, sy + 178, 170)
        draw.text((sx + 54, sy + 310), "Ekspress", fill="#f4efe5", font=F["phone_title"])
        draw.text((sx + 154, sy + 310), "Intra", fill="#f4a641", font=F["phone_title"])
        draw.text((sx + 76, sy + 348), "Sikker intern demo", fill="#91a0a9", font=F["tiny"])
        return

    titles = {"home": "Forside", "work": "Mød ind", "map": "Live-kort", "pickup": "Afhentning", "chat": "Beskeder", "info": "InfoCenter", "admin": "Chef"}
    paste_logo(img, sx + 15, sy + 16, 112)
    rounded(draw, (sx + sw - 54, sy + 18, sx + sw - 18, sy + 54), 18, rgba("#17354c"), rgba("#f4a641", 120), 1)
    draw.text((sx + sw - 43, sy + 28), "TH", fill="#f4efe5", font=F["tiny"])
    draw.text((sx + 16, sy + 76), titles.get(key, "Forside"), fill="#f4efe5", font=F["phone_title"])
    ix, iy, iw = sx + 16, sy + 118, sw - 32

    if key == "home":
        phone_card(draw, ix, iy, iw, 76, "Vigtigt lige nu", "Kontorets beskeder og dagens opgaver.")
        phone_card(draw, ix, iy + 88, iw, 76, "Mine opgaver", "Afhentning og hurtige handlinger.", "#75b69a")
        phone_card(draw, ix, iy + 176, iw, 76, "Fællesskab", "Opslag, reaktioner og kommentarer.")
    elif key == "work":
        phone_card(draw, ix, iy, iw, 86, "Start arbejdsdag", "Vælg GPS, logbog og notifikationer.", "#75b69a")
        for i, label in enumerate(["GPS tilladt", "Logbog aktiv", "Rolige notifikationer"]):
            y = iy + 108 + i * 48
            rounded(draw, (ix, y, ix + iw, y + 38), 12, rgba("#102a3e"), rgba("#ffffff", 30))
            draw.text((ix + 13, y + 10), label, fill="#f4efe5", font=F["tiny"])
            rounded(draw, (ix + iw - 45, y + 9, ix + iw - 14, y + 27), 10, rgba("#75b69a"))
    elif key == "map":
        rounded(draw, (ix, iy, ix + iw, iy + 250), 16, rgba("#0f2a3e"), rgba("#ffffff", 30))
        for i, (label, dx, dy) in enumerate([("TH", 72, 65), ("MA", 164, 118), ("JK", 105, 186), ("PN", 196, 170)]):
            rounded(draw, (ix + dx, iy + dy, ix + dx + 34, iy + dy + 34), 17, rgba("#f4a641" if i % 2 else "#75b69a"))
            draw.text((ix + dx + 8, iy + dy + 9), label, fill="#071727", font=F["tiny"])
        phone_card(draw, ix, iy + 266, iw, 72, "Deling i 30 minutter", "Chaufføren kan stoppe igen.")
    elif key == "pickup":
        phone_card(draw, ix, iy, iw, 76, "Hent reservedel", "Hasselager til Hamburg · XB-2041")
        for i, label in enumerate(["Startet", "Fundet", "Hentet", "Afleveret"]):
            y = iy + 100 + i * 48
            rounded(draw, (ix + 12, y, ix + 38, y + 26), 13, rgba("#75b69a" if i < 2 else "#102a3e"), rgba("#ffffff", 30))
            draw.text((ix + 52, y + 3), label, fill="#f4efe5", font=F["small"])
    elif key == "chat":
        phone_card(draw, ix, iy, iw, 68, "Direkte besked", "Line: Ring når du er tom.")
        phone_card(draw, ix, iy + 82, iw, 68, "Fælleschat", "Peter: Kø ved Bremen.", "#75b69a")
        phone_card(draw, ix, iy + 164, iw, 68, "Regelnyt", "Korte beskeder fra kontoret.")
    elif key == "info":
        for i, label in enumerate(["Uheld", "Forsinkelse", "CMR", "Miljøzoner", "Landeguider"]):
            col, row = i % 2, i // 2
            bx, by = ix + col * 116, iy + row * 82
            rounded(draw, (bx, by, bx + 106, by + 68), 14, rgba("#102a3e"), rgba("#ffffff", 30))
            draw.text((bx + 13, by + 20), label, fill="#f4efe5", font=F["tiny"])
    elif key == "admin":
        phone_card(draw, ix, iy, iw, 70, "Medarbejdere", "Roller og adgang.")
        phone_card(draw, ix, iy + 84, iw, 70, "Køretøjer", "Status og udstyr.", "#75b69a")
        phone_card(draw, ix, iy + 168, iw, 70, "Sikkerhed", "GDPR og regler.")

    draw.rectangle((sx, sy + sh - 55, sx + sw, sy + sh), fill="#071727")
    for i, label in enumerate(["Forside", "Hold", "Kort", "Chat", "Mere"]):
        draw.text((sx + 18 + i * 52, sy + sh - 30), label, fill="#f4a641" if i == 0 else "#91a0a9", font=F["tiny"])


def draw_caption(img, scene, progress):
    draw = ImageDraw.Draw(img, "RGBA")
    _, _, _, title, subtitle = scene
    x, y = 500, 176
    paste_logo(img, x, 82, 170, 235)
    draw.text((x, y - 54), "DEMOVIDEO · SIKKER FREMVISNING", fill="#f4a641", font=F["small"])
    draw_wrapped(draw, title, x, y, 650, F["hero"], "#f4efe5", 62)
    draw_wrapped(draw, subtitle, x, y + 150, 620, F["body"], "#c6d0d2", 30)
    rounded(draw, (x, y + 270, x + 520, y + 282), 8, rgba("#ffffff", 36))
    rounded(draw, (x, y + 270, x + int(520 * progress), y + 282), 8, rgba("#f4a641"))
    draw.text((x, y + 326), "Ingen rigtige data · ingen installation · kan vises fra USB", fill="#91a0a9", font=F["body_bold"])


def frame_at(t):
    img = bg(t)
    scene = current_scene(t)
    progress = (t - scene[0]) / max(0.001, scene[1] - scene[0])
    draw_phone(img, scene[2])
    draw_caption(img, scene, progress)
    return img.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


frames = []
for i in range(DURATION * FPS):
    frames.append(frame_at(i / FPS))

frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=int(1000 / FPS),
    loop=0,
    optimize=True,
)
print(OUT)
