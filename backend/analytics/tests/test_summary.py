# backend/streamwrapped/analytics/tests/test_summary.py

from datetime import datetime, timezone
from streamwrapped.analytics import summary as summary_module


def test_build_yearly_summary_with_fake_data(monkeypatch):
    fake_sessions = [
        {"title_id": 1, "duration_minutes": 60, "watched_at": datetime(2025, 1, 1, 10, 0, tzinfo=timezone.utc)},
        {"title_id": 2, "duration_minutes": 120, "watched_at": datetime(2025, 1, 2, 10, 0, tzinfo=timezone.utc)},
    ]
    fake_meta = {
        1: {"title_name": "Movie A", "content_type": "movie", "genres": ["Action"], "cast": ["Actor X"]},
        2: {"title_name": "Show B", "content_type": "show", "genres": ["Drama"], "cast": ["Actor Y", "Actor Z"]},
    }

    monkeypatch.setattr(summary_module, "get_year_sessions", lambda user_id, year: fake_sessions)
    monkeypatch.setattr(summary_module, "get_title_metadata_map", lambda title_ids: fake_meta)

    payload = summary_module.build_yearly_summary(user_id=7, year=2025)

    assert payload["year"] == 2025
    assert payload["summary"]["total_minutes"] == 180
    assert payload["summary"]["most_watched"]["title_name"] in ("Movie A", "Show B")
    assert "top_genres" in payload["summary"]
    assert "top_actors" in payload["summary"]
    assert "binge" in payload["summary"]
    assert isinstance(payload["summary"]["tagline"], str)
