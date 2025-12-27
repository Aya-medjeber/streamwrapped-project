# backend/streamwrapped/analytics/tests/test_top_actors.py

from streamwrapped.analytics.metrics.top_actors import compute_top_actors


def test_compute_top_actors_splits_minutes_across_cast():
    sessions = [{"title_id": 200, "duration_minutes": 100}]
    title_metadata_map = {
        200: {"title_name": "Sample Movie", "cast": ["Actor A", "Actor B", "Actor C"]}
    }

    result = compute_top_actors(sessions, title_metadata_map, 2025, top_n=5)
    top = result["top_actors"]

    assert len(top) == 3
    assert top[0]["name"] == "Actor A"
    assert top[0]["minutes"] == 34
    assert top[1]["minutes"] == 33
    assert top[2]["minutes"] == 33


def test_compute_top_actors_empty_when_no_metadata():
    sessions = [{"title_id": 999, "duration_minutes": 50}]
    title_metadata_map = {}

    result = compute_top_actors(sessions, title_metadata_map, 2025)
    assert result["top_actors"] == []
