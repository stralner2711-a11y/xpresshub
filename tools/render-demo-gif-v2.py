from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "demo-video"
SCREEN_DIR = OUT_DIR / "screens"
OUT = OUT_DIR / "xpressintra-demo-video-v2.gif"
LOGO = ROOT / "public" / "xpressbudet-logo-transparent.png"

W, H = 1280, 720
FPS = 5
DURATION = 42


def font(size, bold=False):
    for path in [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F = {
    "label": font(17, True),
    "body": font(26),
    "body_bold": font(26, True),
    "title": font(58, True),
    "hero": font(70, True),
    "small": font(18),
}

logo = Image.open(LOGO).convert("RGBA")

scenes = [
    (0, 4, "intro", "XpressIntra", "En sikker visuel demo af medarbejderappen."),
    (4, 11, "home", "Forside", "Dagens overblik, vigtige beskeder og hurtige handlinger samlet ét sted."),
    (11, 18, "work", "Mød ind", "Chaufføren starter arbejdsdagen og vælger selv GPS, logbog og notifikationer."),
    (18, 25, "map", "Live-kort", "Frivillig positionsdeling gør det nemmere for kontoret at hjælpe i driften."),
    (25, 32, "chat", "Beskeder", "Fælleschat, direkte beskeder og regelnyt uden at blande private kanaler."),
    (32, 38, "info", "InfoCenter", "Guides, tjeklister og dokumentlinks kan findes hurtigt fra mobilen."),
    (38, 42, "more", "Kontrolcenter", "Chef og kontor får overblik over drift, sikkerhed og appens indstillinger."),
]


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def ease(x):
    x = max(0, min(1, x))
    return 1 - (1 - x) ** 3


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


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


def draw_text(draw, text, x, y, max_width, font_obj, fill, line_height):
    for line in wrap(draw, text, max_width, font_obj):
        draw.text((x, y), line, fill=fill, font=font_obj)
        y += line_height
    return y


def paste_logo(img, x, y, width, alpha=255):
    ratio = logo.height / logo.width
    mark = logo.resize((width, int(width * ratio)), Image.LANCZOS)
    if alpha < 255:
        mark.putalpha(mark.getchannel("A").point(lambda p: int(p * alpha / 255)))
    img.alpha_composite(mark, (x, y))


def bg(t):
    img = Image.new("RGBA", (W, H), "#06111d")
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        r = int(5 + y * 3 / H)
        g = int(16 + y * 15 / H)
        b = int(29 + y * 20 / H)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    gd.ellipse((560, 70, 1220, 690), fill=(244, 166, 65, 28))
    gd.ellipse((-170, 260, 470, 880), fill=(117, 182, 154, 22))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(90)))

    draw = ImageDraw.Draw(img, "RGBA")
    for i in range(8):
        y = 90 + i * 74
        offset = int((t * 20 + i * 43) % 180)
        color = (244, 166, 65, 24) if i % 2 else (117, 182, 154, 22)
        draw.line([(760 + offset, y), (1210 + offset, y - 44)], fill=color, width=2)
    return img


def screen_for(key):
    file = SCREEN_DIR / f"{key}.png"
    if not file.exists():
        file = SCREEN_DIR / "home.png"
    return Image.open(file).convert("RGBA")


def draw_phone(img, key, local_progress):
    draw = ImageDraw.Draw(img, "RGBA")
    px, py, pw, ph = 86, 42, 356, 636
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    rounded(sd, (px + 24, py + 28, px + pw + 24, py + ph + 28), 52, (0, 0, 0, 125))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(24)))

    rounded(draw, (px, py, px + pw, py + ph), 48, rgba("#0a111b"), rgba("#ffffff", 64), 2)
    rounded(draw, (px + 13, py + 42, px + pw - 13, py + ph - 34), 32, rgba("#071727"), rgba("#ffffff", 26), 1)
    rounded(draw, (px + 126, py + 19, px + 230, py + 27), 8, rgba("#ffffff", 54))
    rounded(draw, (px + 118, py + ph - 19, px + 238, py + ph - 14), 999, rgba("#ffffff", 62))

    sx, sy, sw, sh = px + 13, py + 42, pw - 26, ph - 76
    if key == "intro":
        rounded(draw, (sx, sy, sx + sw, sy + sh), 32, rgba("#071727"))
        paste_logo(img, sx + 58, sy + 175, 210)
        draw.text((sx + 54, sy + 326), "Xpress", fill="#f4efe5", font=F["body_bold"])
        draw.text((sx + 148, sy + 326), "Intra", fill="#f4a641", font=F["body_bold"])
        draw.text((sx + 84, sy + 370), "Mobilapp-demo", fill="#91a0a9", font=F["small"])
        return

    shot = screen_for(key)
    shot = ImageOps.fit(shot, (sw, sh), method=Image.LANCZOS, centering=(0.5, 0.0))
    mask = Image.new("L", (sw, sh), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, sw, sh), radius=32, fill=255)
    framed = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    framed.alpha_composite(shot)
    framed.putalpha(mask)
    img.alpha_composite(framed, (sx, sy))

    shine = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shine, "RGBA")
    sweep_x = int(-sw + local_progress * sw * 2.2)
    sd.polygon([(sweep_x, 0), (sweep_x + 70, 0), (sweep_x + 10, sh), (sweep_x - 60, sh)], fill=(255, 255, 255, 20))
    shine.putalpha(Image.composite(shine.getchannel("A"), Image.new("L", (sw, sh), 0), mask))
    img.alpha_composite(shine, (sx, sy))


def scene_at(t):
    for scene in scenes:
        if scene[0] <= t < scene[1]:
            return scene
    return scenes[-1]


def draw_caption(img, scene, progress, local):
    draw = ImageDraw.Draw(img, "RGBA")
    _, _, key, title, subtitle = scene
    x, y = 520, 118
    if key == "intro":
        paste_logo(img, x, 118, 260)
        draw.text((x, 262), "Xpress", fill="#f4efe5", font=F["hero"])
        draw.text((x + 240, 262), "Intra", fill="#f4a641", font=F["hero"])
        draw_text(draw, subtitle, x, 360, 590, F["body"], "#c6d0d2", 36)
        rounded(draw, (x, 462, x + 420, 474), 999, rgba("#ffffff", 38))
        rounded(draw, (x, 462, x + int(420 * progress), 474), 999, rgba("#f4a641"))
        return

    draw.text((x, y), "ROLIG DEMO AF BRUGERFLADEN", fill="#f4a641", font=F["label"])
    draw.text((x, y + 58), title, fill="#f4efe5", font=F["title"])
    draw_text(draw, subtitle, x, y + 148, 640, F["body"], "#cbd6dc", 36)

    rounded(draw, (x, y + 302, x + 520, y + 314), 999, rgba("#ffffff", 34))
    rounded(draw, (x, y + 302, x + int(520 * progress), y + 314), 999, rgba("#f4a641"))

    chips = ["Ingen rigtige data", "Ingen installation", "Mail-venlig demo"]
    for i, chip in enumerate(chips):
        cx = x + i * 186
        rounded(draw, (cx, y + 370, cx + 166, y + 410), 20, rgba("#102a3e"), rgba("#ffffff", 30))
        draw.text((cx + 16, y + 380), chip, fill="#d7e0e5", font=F["small"])


def frame_at(t):
    img = bg(t)
    scene = scene_at(t)
    start, end, key, _, _ = scene
    raw_progress = (t - start) / max(0.001, end - start)
    progress = ease(raw_progress)
    draw_phone(img, key, progress)
    draw_caption(img, scene, progress, t - start)
    return img.convert("P", palette=Image.Palette.ADAPTIVE, colors=180)


frames = [frame_at(i / FPS) for i in range(DURATION * FPS)]
frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=int(1000 / FPS),
    loop=0,
    optimize=True,
)
print(OUT)
