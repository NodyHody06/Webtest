from flask import Flask
from ascii_gen.routes import ascii_bp
from music.routes import music_bp
from pages.routes import pages_bp

#app = Flask(__name__, static_folder='static')
#setup_routes(app)

#def create_app():
app = Flask(__name__)

#Register blueprints
app.register_blueprint(ascii_bp)
app.register_blueprint(music_bp, url_prefix='/music')
app.register_blueprint(pages_bp)

   #return app


'''if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)'''
