# backend/streamwrapped/analytics/metrics/binge_streaks.py

from datetime import timedelta, date


def compute_binge_streaks(sessions: list[dict], year: int) -> dict:
    """
    Computes longest consecutive-day watch streak for the given year.

    sessions rows expected to include:
      - watched_at: datetime
    """
    watched_dates: set[date] = set()

    for session in sessions:
        watched_at = session.get("watched_at")
        if watched_at is None:
            continue

        # watched_at should be a datetime; datetime.date() gives date part
        try:
            watched_dates.add(watched_at.date())
        except Exception:
            continue

    if not watched_dates:
        return {
            "year": year,
            "binge_streaks": {
                "longest_streak_days": 0,
                "start_date": None,
                "end_date": None,
                "current_streak_days": 0
            }
        }

    sorted_dates = sorted(watched_dates)

    # Track longest streak
    longest_len = 1
    longest_start = sorted_dates[0]
    longest_end = sorted_dates[0]

    # Track current streak as we iterate
    current_len = 1
    current_start = sorted_dates[0]

    for i in range(1, len(sorted_dates)):
        prev_day = sorted_dates[i - 1]
        day = sorted_dates[i]

        if day == prev_day + timedelta(days=1):
            # streak continues
            current_len += 1
        else:
            # streak breaks, reset
            current_len = 1
            current_start = day

        # update longest if needed
        if current_len > longest_len:
            longest_len = current_len
            longest_start = current_start
            longest_end = day

    # Determine "current streak" based on last watched day in the year list.
    # If the last watched day is yesterday or today relative to the end of year,
    # it could be "active", but since we're computing for a year, we’ll define:
    # current_streak_days = streak ending on the last watched day in this dataset.
    # So we recompute it by scanning backwards.
    last_day = sorted_dates[-1]
    current_streak = 1
    for j in range(len(sorted_dates) - 2, -1, -1):
        if sorted_dates[j] == last_day - timedelta(days=current_streak):
            current_streak += 1
        else:
            break

    return {
        "year": year,
        "binge_streaks": {
            "longest_streak_days": longest_len,
            "start_date": longest_start.isoformat(),
            "end_date": longest_end.isoformat(),
            "current_streak_days": current_streak
        }
    }
