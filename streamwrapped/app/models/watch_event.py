from datetime import datetime
from ..extensions import db

class WatchEvent(db.Model):
    __tablename__ = "watch_events"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    title = db.Column(db.String(255), nullable=False)
    media_type = db.Column(db.String(20), nullable=False)  # movie | series
    watched_at = db.Column(db.Date, nullable=False, index=True)

    runtime_minutes = db.Column(db.Integer, nullable=True)
    episode_count = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    provider = db.Column(db.String(60), nullable=True)
    notes = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "media_type": self.media_type,
            "watched_at": self.watched_at.isoformat(),
            "runtime_minutes": self.runtime_minutes,
            "episode_count": self.episode_count,
            "rating": self.rating,
            "provider": self.provider,
            "notes": self.notes,
        }
