from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models.title import Title
from ..models.watch_event import WatchEvent
from ..utils.responses import ok, err

# cache invalidation helper (from wrapped.py)
from .wrapped import invalidate_cache


titles_bp = Blueprint("titles", __name__)

ALLOWED_MEDIA_TYPES = {"movie", "series"}


def _clean_list(value):
    """
    Accept list OR comma-separated string; always return a cleaned list of strings.
    """
    if value is None:
        return []

    if isinstance(value, str):
        # allow "Action, Drama" format
        parts = [p.strip() for p in value.split(",")]
        return [p for p in parts if p]

    if isinstance(value, list):
        cleaned = []
        for x in value:
            if isinstance(x, str):
                s = x.strip()
                if s:
                    cleaned.append(s)
        return cleaned

    return []


def _invalidate_cache_for_title(title_id: int):
    """
    Metadata changes affect wrapped analytics.
    Invalidate cache for every (user, year) that has watch_events linked to this title.
    """
    rows = (
        db.session.query(
            WatchEvent.user_id,
            db.extract("year", WatchEvent.watched_at).label("yr"),
        )
        .filter(WatchEvent.title_id == title_id)
        .distinct()
        .all()
    )

    for user_id, yr in rows:
        try:
            invalidate_cache(int(user_id), int(yr))
        except Exception:
            pass


@titles_bp.get("/")
@jwt_required()
def list_titles():
    """
    Optional convenience: list titles (supports ?q= search and ?media_type= filter).
    """
    q = (request.args.get("q") or "").strip()
    media_type = (request.args.get("media_type") or "").strip().lower() or None

    query = Title.query

    if media_type:
        if media_type not in ALLOWED_MEDIA_TYPES:
            return err("VALIDATION_ERROR", "media_type must be 'movie' or 'series'", 400)
        query = query.filter(Title.media_type == media_type)

    if q:
        query = query.filter(Title.name.ilike(f"%{q}%"))

    items = query.order_by(Title.name.asc()).limit(200).all()
    return ok({"items": [t.to_dict() for t in items], "count": len(items)})


@titles_bp.get("/<int:title_id>")
@jwt_required()
def get_title(title_id: int):
    t = Title.query.get(title_id)
    if not t:
        return err("NOT_FOUND", "title not found", 404)
    return ok({"title": t.to_dict()})


@titles_bp.put("/<int:title_id>")
@jwt_required()
def update_title_metadata(title_id: int):
    """
    Update genres + cast for a title.
    Body example:
      { "genres": ["Sci-Fi","Thriller"], "cast": ["Leonardo DiCaprio"] }
    """
    t = Title.query.get(title_id)
    if not t:
        return err("NOT_FOUND", "title not found", 404)

    body = request.get_json(silent=True) or {}

    # allow both list or comma-separated string
    genres = _clean_list(body.get("genres"))
    cast = _clean_list(body.get("cast"))

    # update only if present in request
    if "genres" in body:
        t.set_genres(genres)
    if "cast" in body:
        t.set_cast(cast)

    db.session.commit()

    _invalidate_cache_for_title(title_id)

    return ok({"title": t.to_dict()})
