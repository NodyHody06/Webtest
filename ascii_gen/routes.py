from flask import Blueprint, request, send_file
from ascii_generator import generate_ascii_image

ascii_bp = Blueprint('ascii',__name__)

@ascii_bp.route('/upload',methods=['POST'])
def upload_file():
        try: 
        
            # Get form data
            scaleFactor = float(request.form.get('scaleFactor')) / 100.0
            oneCharWidth = int(request.form.get('oneCharWidth'))
            oneCharHeight = int(request.form.get('oneCharHeight'))
            remove_bg = 'removeBg' in request.form
            use_color = 'colorOption' in request.form

            # Get the uploaded file
            if 'file' not in request.files or request.files['file'].filename == '':
                    return 'No selected file', 400

            file = request.files['file']

            # Call the ASCII image generator function
            ascii_image = generate_ascii_image(file, scaleFactor, oneCharWidth, oneCharHeight, remove_bg, use_color)

            # Trigger image download
            return send_file(ascii_image, as_attachment=True, download_name='ascii_image.png', mimetype='image/png')    
        
        except Exception as e:
            return f"An error occurred: {str(e)}", 500


