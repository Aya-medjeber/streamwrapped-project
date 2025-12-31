# blueprint package

from .auth import auth_bp
from .history import history_bp
from .wrapped import wrapped_bp
from .titles import titles_bp  

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(history_bp, url_prefix="/history")
    app.register_blueprint(wrapped_bp, url_prefix="/wrapped")
    app.register_blueprint(titles_bp, url_prefix="/titles")  
