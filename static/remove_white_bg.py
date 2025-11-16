from PIL import Image
import sys

def remove_white_bg(input_path, output_path, threshold=240):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.getdata()

    new_pixels = []
    for r, g, b, a in pixels:
        # remove white / near-white
        if r > threshold and g > threshold and b > threshold:
            new_pixels.append((255, 255, 255, 0))
        else:
            new_pixels.append((r, g, b, a))

    img.putdata(new_pixels)
    img.save(output_path, "PNG")
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python static/remove_white_bg.py <input_image> <output_image>")
        sys.exit(1)

    input_img = sys.argv[1]
    output_img = sys.argv[2]

    remove_white_bg(input_img, output_img)
