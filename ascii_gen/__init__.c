import io
from PIL import Image, ImageFont
from rembg import remove
import resize as RS
import pixel_mapping as PM

def generate_ascii_image(file, scaleFactor, oneCharWidth, oneCharHeight, remove_bg, use_color):
    # ASCII Art Parameters
    chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "[::-1]
    charArray = list(chars)
    charlength = len(charArray)
    interval = charlength / 256

    # Open the uploaded image
    im = Image.open(file)

    # Remove background if the checkbox is checked
    if remove_bg:
        im = remove(im)

    if im.mode != 'RGB':
        im = im.convert('RGB')

    # Load the font for ASCII art
    font = ImageFont.truetype('font/lucon.ttf', 21)

    # Resize the image based on form inputs
    im = RS.resize_image(im, scaleFactor, oneCharWidth, oneCharHeight)
    width, height = im.size

    # Generate ASCII image
    txt_file = io.StringIO()
    image_output = PM.mapping(im, width, height, font, txt_file, oneCharWidth, oneCharHeight, interval, charArray, use_color)

    # Save the resulting ASCII image to a BytesIO object
    img_io = io.BytesIO()
    image_output.save(img_io, format='PNG')
    img_io.seek(0)

    return img_io
