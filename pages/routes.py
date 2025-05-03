from flask import Blueprint, render_template, send_from_directory
import os

pages_bp = Blueprint('pages',__name__)

@pages_bp.route('/')
def index():
        return render_template('index.html')

@pages_bp.route('/projects.html')
def project():
        return render_template('projects.html')

@pages_bp.route('/ascii-generator.html')
def ascii_generator_page():
        return render_template('ascii-generator.html')

@pages_bp.route('/about.html')
def about_page():
        return render_template('about.html')

@pages_bp.route('/Music.html')
def music_page():
        return render_template('Music.html')

@pages_bp.route('/falling_sand.html')
def falling_sand_page():
        return render_template('falling_sand.html')

@pages_bp.route('/art.html')
def art_page():
        return render_template('art.html')

@pages_bp.route('/blog.html')
def blog_page():
        return render_template('blog.html')

@pages_bp.route('/download/<filename>')
def download_file(filename):
        return send_from_directory('static/downloads', filename, as_attachment=True)
        # Serve the file from the 'static/downloads' directory
        #path = f'static/downloads/{filename}'
        #return send_file(path, as_attachment=True)
