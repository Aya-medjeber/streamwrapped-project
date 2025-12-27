# backend/streamwrapped/analytics/summary.py

from .queries import get_year_sessions, get_title_metadata_map
from .metrics.total_hours import compute_total_hours
from .metrics.top_genres import compute_top_genres
from .metrics.top_actors import compute_top_actors
from .metrics.most_watched import compute_most_watched
from .metrics.binge_streaks import compute_binge_streaks
from .constants import DEFAULT_TOP_N


def build_tagline(top_genres: list[dict], total_hours: float, year: int) -> str:
    """
    Simple fun line for UI. Keep it deterministic and safe.
    """
    if total_hours <= 0:
        return f"Your {year} Wrapped is waiting — start watching!"
    if top_genres:
        return f"You were on a {top_genres[0]['genre']} wave in {year}!"
    return f"You watched {total_hours} hours in {year} — solid year!"


def build_yearly_summary(user_id: int, year: int) -> dict:
    # 1) Fetch sessions
    sessions = get_year_sessions(user_id, year)

    # 2) Build title_id list
    title_ids = []
    for s in sessions:
        t_id = s.get("title_id")
        if isinstance(t_id, int):
            title_ids.append(t_id)

    # 3) Fetch metadata
    title_metadata_map = get_title_metadata_map(list(set(title_ids)))

    # 4) Compute metrics
    total = compute_total_hours(sessions, year)
    genres = compute_top_genres(sessions, title_metadata_map, year, top_n=DEFAULT_TOP_N)
    actors = compute_top_actors(sessions, title_metadata_map, year, top_n=DEFAULT_TOP_N)
    most = compute_most_watched(sessions, title_metadata_map, year)
    binge = compute_binge_streaks(sessions, year)

    # 5) Fun extras (simple, realistic)
    total_watch_sessions = len(sessions)
    total_titles_watched = len(set(title_ids)) if title_ids else 0

    # average minutes per day in that year (rough but fine for MVP)
    # Use 365 (ignore leap year for simplicity)
    avg_minutes_per_day = round(total["total_minutes"] / 365.0, 1) if total["total_minutes"] > 0 else 0.0

    tagline = build_tagline(genres["top_genres"], total["total_hours"], year)

    # 6) Build final payload (frontend-friendly)
    return {
        "year": year,
        "summary": {
            "total_minutes": total["total_minutes"],
            "total_hours": total["total_hours"],
            "total_watch_sessions": total_watch_sessions,
            "total_titles_watched": total_titles_watched,
            "avg_minutes_per_day": avg_minutes_per_day,

            "most_watched": most["most_watched"],

            "top_genres": [
                {"genre": g["genre"], "hours": g["hours"], "rank": g["rank"]}
                for g in genres["top_genres"]
            ],
            "top_actors": [
                {"name": a["name"], "hours": a["hours"], "rank": a["rank"]}
                for a in actors["top_actors"]
            ],

            "binge": {
                "longest_streak_days": binge["binge_streaks"]["longest_streak_days"],
                "start_date": binge["binge_streaks"]["start_date"],
                "end_date": binge["binge_streaks"]["end_date"]
            },

            "tagline": tagline
        }
    }
