# backend/streamwrapped/analytics/tests/test_total_hours.py

from streamwrapped.analytics.metrics.total_hours import compute_total_hours


def test_compute_total_hours_basic():
    sessions = [
        {"duration_minutes": 60},
        {"duration_minutes": 30},
        {"duration_minutes": 15},
    ]
    result = compute_total_hours(sessions, 2025)

    assert result["year"] == 2025
    assert result["total_minutes"] == 105
    assert result["total_hours"] == 1.75


def test_compute_total_hours_empty():
    result = compute_total_hours([], 2025)
    assert result["total_minutes"] == 0
    assert result["total_hours"] == 0.0
