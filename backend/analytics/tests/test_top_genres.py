# backend/streamwrapped/analytics/tests/test_top_genres.py

from streamwrapped.analytics.metrics.top_genres import compute_top_genres


def test_compute_top_genres_splits_minutes_across_genres():
    sessions = [{"title_id": 99, "duration_minutes": 121}]
    title_metadata_map = {
        99: {"title_name": "Dune", "genres": ["Sci-Fi", "Adventure"]}
    }

    result = compute_top_genres(sessions, title_metadata_map, 2025, top_n=5)
    top = result["top_genres"]

    # 121 minutes split across 2 genres -> 61 and 60 (remainder goes to first)
    assert top[0]["genre"] in ("Adventure", "Sci-Fi")
    assert sorted([top[0]["minutes"], top[1]["minutes"]]) == [60, 61]


def test_compute_top_genres_skips_missing_metadata():
    sessions = [{"title_id": 123, "duration_minutes": 50}]
    title_metadata_map = {}

    result = compute_top_genres(sessions, title_metadata_map, 2025)
    assert result["top_genres"] == []
