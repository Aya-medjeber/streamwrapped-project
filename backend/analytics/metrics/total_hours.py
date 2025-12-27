# backend/streamwrapped/analytics/metrics/total_hours.py

from ..utils import minutes_to_hours


def compute_total_hours(sessions: list[dict], year: int) -> dict:
    """
    sessions: list of dict rows like:
      {
        "watched_at": datetime,
        "duration_minutes": int,
        "title_id": int,
        ...
      }
    """
    total_minutes = 0

    for session in sessions:
        minutes = session.get("duration_minutes", 0)
        if isinstance(minutes, int) and minutes > 0:
            total_minutes += minutes

    return {
        "year": year,
        "total_minutes": total_minutes,
        "total_hours": minutes_to_hours(total_minutes),
    }
