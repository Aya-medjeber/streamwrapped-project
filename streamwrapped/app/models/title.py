from datetime import datetime
import json

from ..extensions import db


class Title(db.Model):
    __tablename__ = "titles"

    id = db.Column(db.Integer, primary_key=True)

    # Human-readable title name (e.g., "Breaking Bad")
    name = db.Column(db.String(255), nullable=False, index=True)

    # movie | series (match WatchEvent.media_type)
    media_type = db.Column(db.String(20), nullable=False, index=True)

    # Store lists as JSON text for SQLite compatibility
    genres_json = db.Column(db.Text, nullable=False, default="[]")
    cast_json = db.Column(db.Text, nullable=False, default="[]")

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("name", "media_type", name="uq_titles_name_media_type"),
    )

    def get_genres(self):
        try:
            v = json.loads(self.genres_json or "[]")
            return v if isinstance(v, list) else []
        except Exception:
            return []

    def set_genres(self, genres):
        cleaned = [g.strip() for g in (genres or []) if isinstance(g, str) and g.strip()]
        self.genres_json = json.dumps(cleaned)

    def get_cast(self):
        try:
            v = json.loads(self.cast_json or "[]")
            return v if isinstance(v, list) else []
        except Exception:
            return []

    def set_cast(self, cast):
        cleaned = [c.strip() for c in (cast or []) if isinstance(c, str) and c.strip()]
        self.cast_json = json.dumps(cleaned)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "media_type": self.media_type,
            "genres": self.get_genres(),
            "cast": self.get_cast(),
        }
