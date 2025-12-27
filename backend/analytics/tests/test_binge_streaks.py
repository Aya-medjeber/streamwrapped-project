# backend/streamwrapped/analytics/tests/test_binge_streaks.py

from datetime import datetime, timezone
from streamwrapped.analytics.metrics.binge_streaks import compute_binge_streaks


def test_compute_binge_streaks_longest():
    sessions = [
        {"watched_at": datetime(2025, 3, 10, 10, 0, tzinfo=timezone.utc)},
        {"watched_at": datetime(2025, 3, 11, 10, 0, tzinfo=timezone.utc)},
        {"watched_at": datetime(2025, 3, 12, 10, 0, tzinfo=timezone.utc)},
        {"watched_at": datetime(2025, 3, 14, 10, 0, tzinfo=timezone.utc)},
    ]

    result = compute_binge_streaks(sessions, 2025)
    binge = result["binge_streaks"]

    assert binge["longest_streak_days"] == 3
    assert binge["start_date"] == "2025-03-10"
    assert binge["end_date"] == "2025-03-12"
    assert binge["current_streak_days"] == 1


def test_compute_binge_streaks_empty():
    result = compute_binge_streaks([], 2025)
    binge = result["binge_streaks"]
    assert binge["longest_streak_days"] == 0
    assert binge["start_date"] is None
    assert binge["end_date"] is None
    assert binge["current_streak_days"] == 0
