from flask import Flask
from dotenv import load_dotenv

from .config import Config
from .extensions import db, migrate, jwt, cors

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(Config)

    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.get("/health")
    def health():
        return {"success": True, "data": {"status": "ok"}}, 200

    return app
