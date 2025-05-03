from PIL import Image, ImageDraw
import GetCharacter as GC

def mapping(im, width, height, font, txt_file, oneCharWidth, oneCharHeight, interval, charArray, use_color):
    """
    Map the image to ASCII characters and generate either colored or grayscale ASCII art based on use_color flag.

    Parameters:
    - im: Input image
    - width: Width of the image in characters
    - height: Height of the image in characters
    - font: Font to be used for drawing text
    - txt_file: File where ASCII text output is written
    - oneCharWidth: Width of one ASCII character in pixels
    - oneCharHeight: Height of one ASCII character in pixels
    - interval: Interval to map grayscale values to characters
    - charArray: Array of ASCII characters to be used
    - use_color: Boolean flag indicating whether to generate colored or grayscale ASCII
    """
    pix = im.load()
    imageOutput = Image.new('RGB', (oneCharWidth * width, oneCharHeight * height), color=(0, 0, 0))
    d = ImageDraw.Draw(imageOutput)

    for i in range(height):
        for j in range(width):
            r, g, b = pix[j, i]
            gray = int((r + g + b) / 3)
            pix[j, i] = (gray, gray, gray)
            char = GC.getChar(gray, interval, charArray)
            txt_file.write(char)
            #if someone wants color use -> (fill = (r, g, b))
            if use_color:
                d.text((j * oneCharWidth, i * oneCharHeight), char, font=font, fill=(r, g, b))
            else:
                 d.text((j * oneCharWidth, i * oneCharHeight), char, font=font, fill=(gray, gray, gray))
        txt_file.write('\n')

    return imageOutput
