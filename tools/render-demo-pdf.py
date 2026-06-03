from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "demo-video"
SCREEN_DIR = OUT_DIR / "screens"
LOGO = ROOT / "public" / "xpressbudet-logo-transparent.png"
PREVIEW_DIR = OUT_DIR / "pdf-preview"
PAGE_DIR = OUT_DIR / "pdf-pages"

W, H = 1920, 1080
NAVY = "#071727"
NAVY_2 = "#0d2436"
CREAM = "#f4efe5"
MUTED = "#aebdcc"
AMBER = "#f4a641"
GREEN = "#75b69a"


def font(size, bold=False):
    paths = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for path in paths:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F = {
    "eyebrow": font(25, True),
    "hero": font(86, True),
    "title": font(62, True),
    "subtitle": font(34),
    "body": font(29),
    "body_bold": font(29, True),
    "body_mid": font(25),
    "body_mid_bold": font(25, True),
    "small": font(22),
    "tiny": font(19),
    "chip": font(22, True),
    "metric": font(54, True),
    "page": font(18, True),
}

logo = Image.open(LOGO).convert("RGBA")

slides = [
    {
        "kind": "cover",
        "title_a": "Xpress",
        "title_b": "Intra",
        "subtitle": "Visuel demo af en intern kommunikationsapp for chauffører, kontor og ledelse.",
        "proof": "Kommunikation · opslag · dokumenter · sikker adgang",
    },
    {
        "kind": "problem",
        "title": "Det handler ikke om flådestyring. Det handler om kommunikation.",
        "subtitle": "Når flådesystemet allerede styrer biler og opgaver, skal XpressIntra samle de interne beskeder, opslag, dokumenter og medarbejderkontakt.",
        "points": [
            ("Kontoret", "sender fælles beskeder til de rigtige hold."),
            ("Chaufføren", "finder beskeder, kontakt og vigtig information."),
            ("Ledelsen", "styrer roller, adgang og dokumentation."),
        ],
    },
    {
        "kind": "driver",
        "screen": "home",
        "screen_alt": "work",
        "title": "Chaufførflowet skal være enkelt",
        "subtitle": "Mød ind, se opslag, skriv til kontoret og find dokumenter uden ekstra systemstøj.",
        "steps": ["Mød ind", "Se opslag", "Skriv", "Find info", "Afslut"],
    },
    {
        "kind": "office",
        "screen": "chat",
        "screen_alt": "info",
        "title": "Kontoret får én intern kanal ved siden af flådesystemet",
        "subtitle": "Formålet er ikke at erstatte eksisterende driftssystemer, men at gøre beskeder, opslag, kontakt og adgang lettere at styre.",
        "points": ["Fælles beskeder", "Direkte kontakt", "Dokumenter", "Sikker adgang"],
    },
    {
        "kind": "pilot",
        "title": "Datasikkerhed og kontrol",
        "subtitle": "Appen skal bygges, så medarbejderdata kun bruges til intern kommunikation og kun kan ses af de rigtige personer.",
        "phases": [
            ("1", "Sikkert login", "Kun godkendte medarbejdere får adgang."),
            ("2", "Rollebaseret adgang", "Chauffør, kontor og chef ser forskelligt indhold."),
            ("3", "Databegrænsning", "Kun nødvendige oplysninger gemmes."),
            ("4", "Privatliv", "Private beskeder og noter holdes adskilt."),
            ("5", "Log og ansvar", "Adminhandlinger kan dokumenteres."),
            ("6", "Slettefrister", "Gamle data slettes eller arkiveres efter aftale."),
        ],
    },
]


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient_bg():
    img = Image.new("RGBA", (W, H), NAVY)
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        g = int(17 + y * 16 / H)
        b = int(31 + y * 20 / H)
        draw.line([(0, y), (W, y)], fill=(5, g, b, 255))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    gd.ellipse((850, -160, 2150, 960), fill=rgba(AMBER, 28))
    gd.ellipse((-320, 420, 720, 1320), fill=rgba(GREEN, 22))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(110)))
    draw = ImageDraw.Draw(img, "RGBA")
    for i in range(8):
        y = 140 + i * 98
        color = rgba(AMBER if i % 2 else GREEN, 28)
        draw.line([(1180, y), (1860, y - 72)], fill=color, width=2)
    return img


def paste_logo(img, x, y, width, alpha=255):
    ratio = logo.height / logo.width
    mark = logo.resize((width, int(width * ratio)), Image.LANCZOS)
    if alpha < 255:
        mark.putalpha(mark.getchannel("A").point(lambda p: int(p * alpha / 255)))
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


def phone_frame(img, screen_name, x=1270, y=76, w=390, h=820):
    draw = ImageDraw.Draw(img, "RGBA")
    top = int(w * 0.13)
    bottom = int(w * 0.11)
    pad = max(14, int(w * 0.035))
    radius = max(38, int(w * 0.14))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow, "RGBA")
    rounded(sd, (x + 30, y + 38, x + w + 30, y + h + 38), radius, (0, 0, 0, 130))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(28)))
    rounded(draw, (x, y, x + w, y + h), radius, rgba("#08101a"), rgba("#ffffff", 68), 2)
    rounded(draw, (x + pad, y + top, x + w - pad, y + h - bottom), max(28, int(w * 0.09)), rgba(NAVY), rgba("#ffffff", 28), 1)
    notch_w = int(w * 0.28)
    notch_h = max(7, int(w * 0.022))
    rounded(draw, (x + (w - notch_w) // 2, y + int(w * 0.065), x + (w + notch_w) // 2, y + int(w * 0.065) + notch_h), 999, rgba("#ffffff", 70))
    home_w = int(w * 0.32)
    rounded(draw, (x + (w - home_w) // 2, y + h - int(w * 0.07), x + (w + home_w) // 2, y + h - int(w * 0.055)), 999, rgba("#ffffff", 68))

    screenshot = Image.open(SCREEN_DIR / f"{screen_name}.png").convert("RGBA")
    sx, sy, sw, sh = x + pad, y + top, w - pad * 2, h - top - bottom
    shot = screenshot.resize((sw, int(screenshot.height * sw / screenshot.width)), Image.LANCZOS)
    shot = shot.crop((0, 0, sw, min(sh, shot.height)))
    if shot.height < sh:
        fill = Image.new("RGBA", (sw, sh), rgba(NAVY))
        fill.alpha_composite(shot)
        shot = fill
    mask = Image.new("L", (sw, sh), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, sw, sh), radius=38, fill=255)
    framed = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    framed.alpha_composite(shot)
    framed.putalpha(mask)
    img.alpha_composite(framed, (sx, sy))


def slide_number(draw, n):
    draw.text((W - 136, H - 70), f"{n:02d}", fill=rgba("#ffffff", 105), font=F["page"])


def cover_slide(data):
    img = gradient_bg()
    draw = ImageDraw.Draw(img, "RGBA")
    paste_logo(img, 120, 112, 340)
    draw.text((120, 315), data["title_a"], fill=CREAM, font=F["hero"])
    draw.text((430, 315), data["title_b"], fill=AMBER, font=F["hero"])
    draw_wrapped(draw, data["subtitle"], 126, 455, 830, F["subtitle"], "#d8e1e6", 48)
    rounded(draw, (126, 642, 920, 752), 28, rgba(NAVY_2, 210), rgba("#ffffff", 32), 1)
    draw.text((166, 674), data["proof"], fill=CREAM, font=F["body_bold"])
    phone_frame(img, "home", 1240, 55, 430, 860)
    return img.convert("RGB")


def problem_slide(data, n):
    img = gradient_bg()
    draw = ImageDraw.Draw(img, "RGBA")
    paste_logo(img, 120, 100, 260)
    draw.text((120, 248), "HVORFOR", fill=AMBER, font=F["eyebrow"])
    draw_wrapped(draw, data["title"], 120, 315, 1060, F["title"], CREAM, 74)
    draw_wrapped(draw, data["subtitle"], 124, 518, 990, F["subtitle"], "#cbd6dc", 48)
    y = 720
    for label, body in data["points"]:
        rounded(draw, (124, y, 1170, y + 82), 24, rgba(NAVY_2, 220), rgba("#ffffff", 34), 1)
        draw.text((160, y + 22), label, fill=AMBER, font=F["body_bold"])
        draw_wrapped(draw, body, 370, y + 22, 720, F["body"], CREAM, 36)
        y += 104
    slide_number(draw, n)
    return img.convert("RGB")


def driver_slide(data, n):
    img = gradient_bg()
    draw = ImageDraw.Draw(img, "RGBA")
    phone_frame(img, data["screen_alt"], 78, 54, 560, 960)
    x = 760
    paste_logo(img, x, 100, 245)
    draw.text((x, 254), "PILOTFLOW", fill=AMBER, font=F["eyebrow"])
    draw_wrapped(draw, data["title"], x, 315, 860, F["title"], CREAM, 76)
    draw_wrapped(draw, data["subtitle"], x, 500, 780, F["subtitle"], "#cbd6dc", 48)
    y = 725
    for index, step in enumerate(data["steps"], start=1):
        cx = x + (index - 1) * 158
        rounded(draw, (cx, y, cx + 128, y + 122), 30, rgba(NAVY_2, 230), rgba("#ffffff", 38), 1)
        rounded(draw, (cx + 36, y + 18, cx + 92, y + 74), 28, rgba(AMBER))
        draw.text((cx + 55, y + 31), str(index), fill="#241a0d", font=F["body_bold"])
        lines = wrap(draw, step, 104, F["small"])
        text_y = y + 86 if len(lines) == 1 else y + 78
        for line in lines:
            text_w = draw.textlength(line, font=F["small"])
            draw.text((cx + (128 - text_w) / 2, text_y), line, fill=CREAM, font=F["small"])
            text_y += 25
    slide_number(draw, n)
    return img.convert("RGB")


def office_slide(data, n):
    img = gradient_bg()
    draw = ImageDraw.Draw(img, "RGBA")
    phone_frame(img, data["screen"], 78, 54, 560, 960)
    x = 760
    paste_logo(img, x, 100, 245)
    draw.text((x, 254), "KONTOR OG LEDELSE", fill=AMBER, font=F["eyebrow"])
    draw_wrapped(draw, data["title"], x, 315, 870, F["title"], CREAM, 76)
    draw_wrapped(draw, data["subtitle"], x, 500, 780, F["subtitle"], "#cbd6dc", 48)
    y = 735
    for i, point in enumerate(data["points"]):
        bx = x + (i % 2) * 360
        by = y + (i // 2) * 92
        rounded(draw, (bx, by, bx + 320, by + 68), 20, rgba(NAVY_2, 230), rgba("#ffffff", 36), 1)
        rounded(draw, (bx + 20, by + 25, bx + 34, by + 39), 7, rgba(AMBER))
        draw.text((bx + 54, by + 18), point, fill=CREAM, font=F["body_bold"])
    slide_number(draw, n)
    return img.convert("RGB")


def pilot_slide(data, n):
    img = gradient_bg()
    draw = ImageDraw.Draw(img, "RGBA")
    paste_logo(img, 120, 100, 280)
    draw.text((120, 260), "SIKKERHED", fill=AMBER, font=F["eyebrow"])
    draw_wrapped(draw, data["title"], 120, 325, 920, F["title"], CREAM, 76)
    draw_wrapped(draw, data["subtitle"], 124, 500, 900, F["subtitle"], "#cbd6dc", 48)
    x0, y0 = 118, 640
    for i, (num, title, body) in enumerate(data["phases"]):
        x = x0 + (i % 2) * 850
        y = y0 + (i // 2) * 128
        rounded(draw, (x, y, x + 790, y + 108), 24, rgba(NAVY_2, 225), rgba("#ffffff", 34), 1)
        rounded(draw, (x + 24, y + 25, x + 76, y + 77), 26, rgba(AMBER))
        draw.text((x + 43, y + 38), num, fill="#241a0d", font=F["body_bold"])
        draw.text((x + 104, y + 20), title, fill=CREAM, font=F["body_mid_bold"])
        draw_wrapped(draw, body, x + 104, y + 61, 610, F["small"], MUTED, 27)
    slide_number(draw, n)
    return img.convert("RGB")


renderers = {
    "cover": cover_slide,
    "problem": problem_slide,
    "driver": driver_slide,
    "office": office_slide,
    "pilot": pilot_slide,
}

pages = []
for idx, slide in enumerate(slides, start=1):
    pages.append(renderers[slide["kind"]](slide, idx) if slide["kind"] != "cover" else cover_slide(slide))

PAGE_DIR.mkdir(parents=True, exist_ok=True)
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
for old in list(PAGE_DIR.glob("page-*.png")) + list(PREVIEW_DIR.glob("slide-*.png")):
    old.unlink()
for idx, page in enumerate(pages, start=1):
    page.save(PAGE_DIR / f"page-{idx:02d}.png")
    page.resize((640, 360), Image.LANCZOS).save(PREVIEW_DIR / f"slide-{idx:02d}.png")

print(PAGE_DIR)
