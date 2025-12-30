import csv
import io
from datetime import date
from dateutil.parser import parse as parse_date

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models.watch_event import WatchEvent
from ..models.title import Title
from ..utils.responses import ok, err

# cache invalidation helper (from wrapped.py)
from .wrapped import invalidate_cache


history_bp = Blueprint("history", __name__)

ALLOWED_MEDIA_TYPES = {"movie", "series"}


def _parse_watched_at(value: str) -> date:
    dt = parse_date(value)
    return dt.date()


def _clean_int(value):
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def _clean_float(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def _get_or_create_title_id(name: str, media_type: str) -> int:
    """
    Find or create a Title row and return its id.
    Keeps Title unique by (name, media_type).
    """
    clean_name = (name or "").strip()
    clean_type = (media_type or "").strip().lower()

    existing = Title.query.filter_by(name=clean_name, media_type=clean_type).first()
    if existing:
        return existing.id

    t = Title(name=clean_name, media_type=clean_type)
    db.session.add(t)
    db.session.flush()  # get id without committing yet
    return t.id


@history_bp.post("/")
@jwt_required()
def add_history_item():
    user_id = int(get_jwt_identity())
    body = request.get_json(silent=True) or {}

    title = (body.get("title") or "").strip()
    media_type = (body.get("media_type") or "").strip().lower()
    watched_at_raw = (body.get("watched_at") or "").strip()

    runtime_minutes = _clean_int(body.get("runtime_minutes"))
    episode_count = _clean_int(body.get("episode_count"))
    rating = _clean_float(body.get("rating"))
    provider = (body.get("provider") or "").strip() or None
    notes = (body.get("notes") or "").strip() or None

    if not title or not media_type or not watched_at_raw:
        return err("VALIDATION_ERROR", "title, media_type, and watched_at are required", 400)

    if media_type not in ALLOWED_MEDIA_TYPES:
        return err("VALIDATION_ERROR", "media_type must be 'movie' or 'series'", 400)

    try:
        watched_at = _parse_watched_at(watched_at_raw)
    except Exception:
        return err("VALIDATION_ERROR", "watched_at must be a valid date", 400)

    if rating is not None and (rating < 0 or rating > 10):
        return err("VALIDATION_ERROR", "rating must be between 0 and 10", 400)

    title_id = _get_or_create_title_id(title, media_type)

    event = WatchEvent(
        user_id=user_id,
        title_id=title_id,
        title=title,
        media_type=media_type,
        watched_at=watched_at,
        runtime_minutes=runtime_minutes,
        episode_count=episode_count,
        rating=rating,
        provider=provider,
        notes=notes,
    )
    db.session.add(event)
    db.session.commit()

    # IMPORTANT: cache invalidation for that year
    invalidate_cache(user_id, watched_at.year)

    return ok({"watch_event": event.to_dict()}, status=201)


@history_bp.get("/")
@jwt_required()
def list_history():
    user_id = int(get_jwt_identity())
    year = request.args.get("year", type=int)

    q = WatchEvent.query.filter_by(user_id=user_id)

    if year:
        q = q.filter(db.extract("year", WatchEvent.watched_at) == year)

    events = q.order_by(WatchEvent.watched_at.desc(), WatchEvent.id.desc()).all()
    return ok({"items": [e.to_dict() for e in events], "count": len(events)})


@history_bp.delete("/<int:event_id>")
@jwt_required()
def delete_history_item(event_id: int):
    user_id = int(get_jwt_identity())

    event = WatchEvent.query.filter_by(id=event_id, user_id=user_id).first()
    if not event:
        return err("NOT_FOUND", "watch event not found", 404)

    yr = event.watched_at.year

    db.session.delete(event)
    db.session.commit()

    # IMPORTANT: cache invalidation for that year
    invalidate_cache(user_id, yr)

    return ok({"deleted": True})


@history_bp.post("/upload")
@jwt_required()
def upload_csv():
    user_id = int(get_jwt_identity())

    if "file" not in request.files:
        return err("VALIDATION_ERROR", "missing file field (expected 'file')", 400)

    f = request.files["file"]
    if not f.filename or not f.filename.lower().endswith(".csv"):
        return err("VALIDATION_ERROR", "file must be a .csv", 400)

    content = f.read().decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(content))

    required_cols = {"title", "media_type", "watched_at"}

    if not reader.fieldnames:
        return err("INVALID_CSV", "CSV has no header row", 400)

    # normalize header (strip + lowercase + remove BOM)
    header = {c.strip().lower().lstrip("\ufeff") for c in reader.fieldnames}
    missing = required_cols - header
    if missing:
        return err("INVALID_CSV", f"missing required columns: {', '.join(sorted(missing))}", 400)

    inserted = 0
    skipped = 0
    errors = []
    years_touched = set()

    for idx, row in enumerate(reader, start=2):  # header is row 1
        try:
            # normalize keys to lowercase and strip BOM/spaces
            normalized = {}
            for k, v in row.items():
                key = (k or "").strip().lower().lstrip("\ufeff")
                val = v.strip() if isinstance(v, str) else v
                normalized[key] = val
            row = normalized

            title = (row.get("title") or "").strip()
            media_type = (row.get("media_type") or "").strip().lower()
            watched_at_raw = (row.get("watched_at") or "").strip()

            if not title or not media_type or not watched_at_raw:
                skipped += 1
                errors.append({"row": idx, "reason": "missing title/media_type/watched_at"})
                continue

            if media_type not in ALLOWED_MEDIA_TYPES:
                skipped += 1
                errors.append({"row": idx, "reason": "media_type must be movie or series"})
                continue

            watched_at = _parse_watched_at(watched_at_raw)
            years_touched.add(watched_at.year)

            runtime_minutes = _clean_int(row.get("runtime_minutes"))
            episode_count = _clean_int(row.get("episode_count"))
            rating = _clean_float(row.get("rating"))
            provider = (row.get("provider") or "").strip() or None
            notes = (row.get("notes") or "").strip() or None

            if rating is not None and (rating < 0 or rating > 10):
                skipped += 1
                errors.append({"row": idx, "reason": "rating must be between 0 and 10"})
                continue

            title_id = _get_or_create_title_id(title, media_type)

            event = WatchEvent(
                user_id=user_id,
                title_id=title_id,
                title=title,
                media_type=media_type,
                watched_at=watched_at,
                runtime_minutes=runtime_minutes,
                episode_count=episode_count,
                rating=rating,
                provider=provider,
                notes=notes,
            )
            db.session.add(event)
            inserted += 1

        except Exception as e:
            skipped += 1
            errors.append({"row": idx, "reason": str(e)})

    db.session.commit()

    # IMPORTANT: invalidate cache for all years touched by upload
    for y in years_touched:
        invalidate_cache(user_id, y)

    return ok(
        {
            "inserted": inserted,
            "skipped": skipped,
            "errors": errors[:50],  # cap so response isn't huge
            "years_touched": sorted(list(years_touched)),
        }
    )
