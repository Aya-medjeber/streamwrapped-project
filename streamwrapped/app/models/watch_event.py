from datetime import datetime
from ..extensions import db


class WatchEvent(db.Model):
    __tablename__ = "watch_events"

    id = db.Column(db.Integer, primary_key=True)

    # user reference
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # title metadata reference
    title_id = db.Column(
        db.Integer,
        db.ForeignKey("titles.id"),
        nullable=True,
        index=True,
    )

    # keep original title string for backward compatibility
    title = db.Column(db.String(255), nullable=False)

    media_type = db.Column(
        db.String(20),
        nullable=False,
        index=True,  # movie | series
    )

    watched_at = db.Column(
        db.Date,
        nullable=False,
        index=True,
    )

    runtime_minutes = db.Column(db.Integer, nullable=True)
    episode_count = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    provider = db.Column(db.String(60), nullable=True)
    notes = db.Column(db.String(255), nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # relationship to Title
    # (foreign_keys explicit so SQLAlchemy always knows which column to join on)
    title_ref = db.relationship(
        "Title",
        foreign_keys=[title_id],
        lazy="joined",
    )

    def to_dict(self):
        title_meta = None
        if self.title_ref:
            # title_ref.to_dict() exists in your Title model ✅
            title_meta = self.title_ref.to_dict()

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
            "title_id": self.title_id,
            "title_meta": title_meta,
        }
