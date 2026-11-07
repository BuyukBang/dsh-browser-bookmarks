"""Generate a 180x180 market tile icon: gold star on dark rounded square."""
import math
from PIL import Image, ImageDraw

S = 4  # supersample factor
SIZE = 180 * S
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Rounded dark tile background
bg = (30, 30, 36, 255)  # #1e1e24
radius = 40 * S
d.rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=radius, fill=bg)

# Subtle border
d.rounded_rectangle([2 * S, 2 * S, SIZE - 3 * S, SIZE - 3 * S],
                    radius=radius - 2 * S, outline=(255, 255, 255, 28), width=2 * S)

# Five-point star
cx, cy = SIZE / 2, SIZE / 2 + 4 * S
R, r = 62 * S, 24.5 * S
pts = []
for i in range(10):
    ang = -math.pi / 2 + i * math.pi / 5
    rad = R if i % 2 == 0 else r
    pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))

gold = (234, 179, 8, 255)  # #eab308 (matches plugin active-star color)
d.polygon(pts, fill=gold)

img = img.resize((180, 180), Image.LANCZOS)
img.save(r"C:\Users\admin\.dsh\plugins\dsh-browser-bookmarks\assets\icon-180.png")
print("written")
