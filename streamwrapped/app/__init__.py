from flask import Flask
from dotenv import load_dotenv

from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(Config)

    # init extensions
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprints (INSIDE create_app)
    from . import models  # noqa: F401
    from .routes.auth import auth_bp
    from .routes.history import history_bp
    from .routes.wrapped import wrapped_bp

    app.register_blueprint(wrapped_bp, url_prefix="/wrapped")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(history_bp, url_prefix="/history")

    # health check
    @app.get("/health")
    def health():
        return {"success": True, "data": {"status": "ok"}}, 200

    return app
