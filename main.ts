#!/usr/bin/env python3
"""
Generate a 1024x1024 PNG news front page for Friday 20 November 2026.
No external assets, no compression tricks - just text drawn directly.
Requires Pillow: pip install pillow (or apk add py3-pillow)
"""

from PIL import Image, ImageDraw, ImageFont

# Image dimensions
W = H = 1024

# Color palette
NAVY = (10, 20, 40)
INK = (230, 234, 240)
ACCENT = (232, 130, 30)      # orange
GOLD = (240, 200, 90)
CARD = (18, 28, 52)
CARD2 = (22, 34, 60)
LINE = (60, 75, 110)
GREY = (150, 160, 180)

# Font paths (adjust if your system differs)
FB = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"   # bold
FR = "/usr/share/fonts/liberation/LiberationSans-Regular.ttf"  # regular

def F(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, font, maxw):
    """Wrap text so each line fits within maxw pixels."""
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def main():
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Fonts
    title_font = F(FB, 56)
    sub_font = F(FR, 24)
    h2_font = F(FB, 30)
    tag_font = F(FB, 17)
    body_font = F(FR, 20)
    bodyb_font = F(FB, 20)
    small_font = F(FR, 16)

    # ── Masthead ──
    d.rectangle([0, 0, W, 120], fill=NAVY)
    d.rectangle([0, 120, W, 128], fill=ACCENT)
    d.text((40, 30), "WORLD NEWS", font=title_font, fill=INK)
    d.text((40, 86), "Friday 20 November 2026  •  make.fun news image",
           font=sub_font, fill=GOLD)

    # ── Stories ──
    cx, cy = 40, 150
    cw, ch = 472, 138
    gap = 24

    stories = [
        ("WORLD", "Trump, Xi and Putin meet in Shenzhen",
         "Leaders press for nuclear-arms cuts, more global oil supply; Ukraine and Iran on the agenda.",
         ACCENT),
        ("ASIA", "UN court: Myanmar committed Rohingya genocide",
         "Top court rules Myanmar committed genocide against Rohingya Muslims in 2017.",
         GOLD),
        ("TECH", "Anthropic makes record public debut",
         "AI company's share sale prices above range; shares surge on first day of trading.",
         ACCENT),
        ("US", "JPMorgan Chase customer data leaked",
         "Hackers post contact details of thousands of customers; Visa and Mastercard also targeted.",
         GOLD),
        ("US", "Cyber chief Sean Cairncross steps down",
         "Trump's national cyber director resigns as administration works to calm cyber fears.",
         ACCENT),
        ("US", "Shutdown clock ticks toward 11 December",
         "Congress must pass a stopgap funding bill to avert a government shutdown.",
         GOLD),
    ]

    for i, (region, head, sumry, accent) in enumerate(stories):
        col = i % 2
        row = i // 2
        x = cx + col * (cw + gap)
        y = cy + row * (ch + gap)

        # Main story spans both columns (first story)
        cw2 = cw * 2 + gap if i == 0 else cw

        d.rounded_rectangle([x, y, x + cw2, y + ch], radius=10,
                            fill=CARD if i % 2 == 0 else CARD2)
        d.rectangle([x, y, x + 8, y + ch], fill=accent)

        d.text((x + 24, y + 14), region, font=tag_font, fill=accent)
        d.text((x + 24, y + 44), head, font=h2_font, fill=INK)

        maxw = cw2 - 48
        lines = wrap(d, sumry, body_font, maxw)
        yy = y + 82
        for ln in lines[:3]:
            d.text((x + 24, yy), ln, font=body_font, fill=(200, 208, 220))
            yy += 25

    # ── Footer ──
    fy = H - 56
    d.rectangle([0, fy, W, H], fill=(8, 16, 32))
    d.text((40, fy + 14), "One day's news — 20 November 2026",
           font=bodyb_font, fill=INK)
    d.text((W - 300, fy + 16), "make.fun • picture of the day",
           font=small_font, fill=GREY)

    img.save("entry.png", "PNG", optimize=True)
    print("Saved entry.png:", img.size, img.size[0] * img.size[1], "pixels")


if __name__ == "__main__":
    main()
