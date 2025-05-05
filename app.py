from flask import Flask
from flask_caching import Cache
from ascii_gen.routes import ascii_bp
from music.routes import music_bp
from pages.routes import pages_bp

cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config['CACHE_TYPE'] = 'simple'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300
    cache.init_app(app)

    app.register_blueprint(ascii_bp)
    app.register_blueprint(music_bp, url_prefix='/music')
    app.register_blueprint(pages_bp)

    @app.route('/expensive-endpoint')
    @cache.cached(timeout=60)
    def expensive_endpoint():
        app.logger.info('Running expensive operation...')
        return 'This is an expensive result'

    @app.route('/health')
    def health():
        return 'OK', 200

    return app

# Only for local development
#if __name__ == "__main__":
 #   app = create_app()
  #  app.run(debug=True)

