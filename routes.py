from flask import render_template, request, send_file
from ascii_generator import generate_ascii_image

def setup_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/projects.html')
    def project():
        return render_template('projects.html')

    @app.route('/ascii-generator.html')
    def ascii_generator_page():
        return render_template('ascii-generator.html')

    @app.route('/upload', methods=['POST'])
    def upload_file():
        # Get form data
        scaleFactor = float(request.form.get('scaleFactor')) / 100.0
        oneCharWidth = int(request.form.get('oneCharWidth'))
        oneCharHeight = int(request.form.get('oneCharHeight'))
        remove_bg = 'removeBg' in request.form
        use_color = 'colorOption' in request.form

        # Get the uploaded file
        if 'file' not in request.files or request.files['file'].filename == '':
            return 'No selected file'

        file = request.files['file']

        # Call the ASCII image generator function
        ascii_image = generate_ascii_image(file, scaleFactor, oneCharWidth, oneCharHeight, remove_bg, use_color)

        # Trigger image download
        return send_file(ascii_image, as_attachment=True, download_name='ascii_image.png', mimetype='image/png')
