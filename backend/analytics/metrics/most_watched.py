# backend/streamwrapped/analytics/metrics/most_watched.py

from ..utils import minutes_to_hours


def compute_most_watched(
    sessions: list[dict],
    title_metadata_map: dict,
    year: int
) -> dict:
    """
    Returns the most-watched title by total minutes.
    Tie-breaker: number of watch sessions.

    title_metadata_map expected shape:
      {
        title_id: {
          "title_name": str,
          "content_type": str  # "movie" or "show"
        }
      }
    """
    title_minutes: dict[int, int] = {}
    title_sessions: dict[int, int] = {}

    for session in sessions:
        title_id = session.get("title_id")
        minutes = session.get("duration_minutes", 0)

        if title_id is None:
            continue
        if not (isinstance(minutes, int) and minutes > 0):
            continue

        title_minutes[title_id] = title_minutes.get(title_id, 0) + minutes
        title_sessions[title_id] = title_sessions.get(title_id, 0) + 1

    if not title_minutes:
        return {
            "year": year,
            "most_watched": None
        }

    # Pick best title_id: highest minutes, then highest sessions
    best_title_id = None
    best_minutes = -1
    best_sessions = -1

    for t_id, mins in title_minutes.items():
        sess_count = title_sessions.get(t_id, 0)

        if mins > best_minutes:
            best_title_id = t_id
            best_minutes = mins
            best_sessions = sess_count
        elif mins == best_minutes and sess_count > best_sessions:
            best_title_id = t_id
            best_sessions = sess_count

    meta = title_metadata_map.get(best_title_id, {})
    title_name = meta.get("title_name", "Unknown Title")
    content_type = meta.get("content_type", "unknown")

    return {
        "year": year,
        "most_watched": {
            "title_id": best_title_id,
            "title_name": title_name,
            "content_type": content_type,
            "minutes": best_minutes,
            "hours": minutes_to_hours(best_minutes),
            "watch_sessions": best_sessions
        }
    }
