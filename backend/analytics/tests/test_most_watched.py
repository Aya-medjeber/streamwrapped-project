# backend/streamwrapped/analytics/tests/test_most_watched.py

from streamwrapped.analytics.metrics.most_watched import compute_most_watched


def test_compute_most_watched_by_minutes():
    sessions = [
        {"title_id": 1, "duration_minutes": 60},
        {"title_id": 2, "duration_minutes": 120},
    ]
    meta = {
        1: {"title_name": "Title 1", "content_type": "movie"},
        2: {"title_name": "Title 2", "content_type": "show"},
    }

    result = compute_most_watched(sessions, meta, 2025)
    assert result["most_watched"]["title_id"] == 2
    assert result["most_watched"]["minutes"] == 120
    assert result["most_watched"]["watch_sessions"] == 1


def test_compute_most_watched_tie_breaker_sessions():
    # Both titles have 120 minutes, but title 1 has 2 sessions => should win
    sessions = [
        {"title_id": 1, "duration_minutes": 60},
        {"title_id": 1, "duration_minutes": 60},
        {"title_id": 2, "duration_minutes": 120},
    ]
    meta = {
        1: {"title_name": "Title 1", "content_type": "movie"},
        2: {"title_name": "Title 2", "content_type": "movie"},
    }

    result = compute_most_watched(sessions, meta, 2025)
    assert result["most_watched"]["title_id"] == 1
    assert result["most_watched"]["minutes"] == 120
    assert result["most_watched"]["watch_sessions"] == 2


def test_compute_most_watched_empty():
    result = compute_most_watched([], {}, 2025)
    assert result["most_watched"] is None
