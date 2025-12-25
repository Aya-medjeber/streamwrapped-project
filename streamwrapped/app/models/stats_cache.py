from datetime import datetime
from ..extensions import db

class StatsCache(db.Model):
    __tablename__ = "stats_cache"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    year = db.Column(db.Integer, nullable=False, index=True)

    # JSON stored as TEXT for SQLite compatibility
    data = db.Column(db.Text, nullable=False)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "year", name="uq_stats_cache_user_year"),
    )
