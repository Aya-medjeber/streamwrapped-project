# backend/streamwrapped/analytics/cache.py

from django.db.models import Max
from streamwrapped.models import WatchHistory, StatsCache
from .utils import get_year_range


def get_latest_watched_at(user_id: int, year: int):
    start, end = get_year_range(year)
    return (
        WatchHistory.objects
        .filter(user_id=user_id, watched_at__gte=start, watched_at__lt=end)
        .aggregate(latest=Max("watched_at"))
        .get("latest")
    )


def get_cached_summary(user_id: int, year: int) -> dict | None:
    cache = StatsCache.objects.filter(user_id=user_id, year=year).first()
    if not cache:
        return None

    latest_watched_at = get_latest_watched_at(user_id, year)

    # If user has no watch history, cache is valid
    if latest_watched_at is None:
        return cache.payload

    # If cache was built using data at least as new as latest watch event -> valid
    if cache.source_last_watched_at and cache.source_last_watched_at >= latest_watched_at:
        return cache.payload

    # Otherwise, stale
    return None


def save_cached_summary(user_id: int, year: int, payload: dict) -> None:
    latest_watched_at = get_latest_watched_at(user_id, year)

    StatsCache.objects.update_or_create(
        user_id=user_id,
        year=year,
        defaults={
            "payload": payload,
            "source_last_watched_at": latest_watched_at,
        }
    )
