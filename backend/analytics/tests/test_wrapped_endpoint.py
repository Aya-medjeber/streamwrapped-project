# backend/streamwrapped/tests/test_wrapped_endpoint.py

import json
from datetime import datetime, timezone

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from streamwrapped.models import WatchHistory, Title, StatsCache


@pytest.mark.django_db
def test_wrapped_summary_endpoint_returns_200():
    User = get_user_model()
    user = User.objects.create_user(username="testuser", password="pass1234")

    # Create title metadata
    t1 = Title.objects.create(
        title_name="Movie A",
        content_type="movie",
        genres=["Action"],
        cast=["Actor X"]
    )

    # Create watch history
    WatchHistory.objects.create(
        user=user,
        title=t1,
        watched_at=datetime(2025, 1, 1, 10, 0, tzinfo=timezone.utc),
        duration_minutes=60,
        content_type="movie"
    )

    client = APIClient()

    # If your project uses JWT, Abdul will replace this with actual JWT token auth.
    # For now, force auth for integration test simplicity:
    client.force_authenticate(user=user)

    resp = client.get("/api/wrapped/2025/summary/")
    assert resp.status_code == 200

    data = resp.json()
    assert data["year"] == 2025
    assert data["summary"]["total_minutes"] == 60
    assert data["summary"]["most_watched"]["title_name"] == "Movie A"
