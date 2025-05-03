from flask import render_template, request, send_file, redirect, url_for, jsonify
from ascii_generator import generate_ascii_image
import yt_dlp as youtube_dl
import os

    # Define a path for downloadable content that is writable
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

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
    
    @app.route('/about.html')
    def about_page():
        return render_template('about.html')
    
    @app.route('/Music.html')
    def music_page():
        return render_template('Music.html')
    
    @app.route('/falling_sand.html')
    def falling_sand_page():
        return render_template('falling_sand.html')
    
    @app.route('/art.html')
    def art_page():
        return render_template('art.html')
    
    @app.route('/download/<filename>')
    def download_file(filename):
        # Serve the file from the 'static/downloads' directory
        path = f'static/downloads/{filename}'
        return send_file(path, as_attachment=True)

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


    @app.route("/download_audio", methods=["POST"])
    def download_audio():
        video_url = request.form.get("video_url")
        if not video_url:
            return jsonify({"error": "No URL provided"}), 400

        try:
            # Set download options
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
            }

            with youtube_dl.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                file_path = ydl.prepare_filename(info).replace(".webm", ".mp3")

            return send_file(file_path, as_attachment=True, download_name="downloaded_audio.mp3", mimetype="audio/mpeg")
        except Exception as e:
            return jsonify({"error": str(e)}), 500
