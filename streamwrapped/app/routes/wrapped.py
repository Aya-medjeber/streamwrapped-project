import json
from datetime import datetime

from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.watch_event import WatchEvent
from ..models.stats_cache import StatsCache
from ..services.analytics import build_wrapped_summary
from ..utils.responses import ok

wrapped_bp = Blueprint("wrapped", __name__)

def _get_cached(user_id: int, year: int):
    return StatsCache.query.filter_by(user_id=user_id, year=year).first()

def invalidate_cache(user_id: int, year: int):
    StatsCache.query.filter_by(user_id=user_id, year=year).delete()
    db.session.commit()

@wrapped_bp.get("/<int:year>")
@jwt_required()
def wrapped_year(year: int):
    user_id = int(get_jwt_identity())

    cached = _get_cached(user_id, year)
    if cached:
        return ok({"cached": True, "summary": json.loads(cached.data)})

    events = (
        WatchEvent.query.filter_by(user_id=user_id)
        .filter(db.extract("year", WatchEvent.watched_at) == year)
        .all()
    )

    summary = build_wrapped_summary(events, year)

    new_cache = StatsCache(
        user_id=user_id,
        year=year,
        data=json.dumps(summary),
        updated_at=datetime.utcnow(),
    )
    db.session.add(new_cache)
    db.session.commit()

    return ok({"cached": False, "summary": summary})
