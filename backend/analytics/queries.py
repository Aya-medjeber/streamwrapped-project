# backend/streamwrapped/analytics/queries.py

from django.db.models import F
from .utils import get_year_range

# IMPORTANT:
# Adjust these imports to match your actual app models.
# Example names below:
from streamwrapped.models import WatchHistory, Title  # <-- change if needed


def get_year_sessions(user_id: int, year: int) -> list[dict]:
    start, end = get_year_range(year)

    qs = (
        WatchHistory.objects
        .filter(user_id=user_id, watched_at__gte=start, watched_at__lt=end)
        .values("watched_at", "duration_minutes", "title_id")
    )

    return list(qs)


def get_title_metadata_map(title_ids: list[int]) -> dict:
    """
    Returns:
      {
        title_id: {"title_name": str, "content_type": str, "genres": [str], "cast": [str]}
      }

    NOTE: This assumes Title has:
      - title_name (or name)
      - content_type
      - genres as ArrayField or property returning list[str]
      - cast as ArrayField or property returning list[str]
    If your DB uses join tables, Emmanuel will rewrite this using prefetch.
    """
    if not title_ids:
        return {}

    qs = Title.objects.filter(id__in=title_ids)

    meta = {}
    for t in qs:
        meta[t.id] = {
            "title_name": getattr(t, "title_name", getattr(t, "name", "Unknown Title")),
            "content_type": getattr(t, "content_type", "unknown"),
            "genres": list(getattr(t, "genres", []) or []),
            "cast": list(getattr(t, "cast", []) or []),
        }
    return meta
