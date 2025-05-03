from flask import Blueprint, request, send_file, jsonify
import yt_dlp as youtube_dl
import os

music_bp = Blueprint('music', __name__, static_folder='static', static_url_path='/music/static')

# Create a download folder if it doesn't exist
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@music_bp.route("/download_audio", methods=["POST"])
def download_audio():
    video_url = request.form.get("video_url")
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    # Log the received URL for debugging purposes
    print("Received YouTube URL:", video_url)

    try:
        # Set download options for yt-dlp
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
        }

        # Download the audio from the provided YouTube URL
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            file_path = ydl.prepare_filename(info)
            mp3_path = os.path.splitext(file_path)[0] + ".mp3"  # Ensure the output file is mp3

        # Check if the file exists and send it
        if os.path.exists(mp3_path):
            return send_file(mp3_path, as_attachment=True, download_name="downloaded_audio.mp3", mimetype="audio/mpeg")
        else:
            return jsonify({"error": "Failed to download or convert the audio"}), 500

    except youtube_dl.DownloadError as e:
        return jsonify({"error": f"Download error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

