# backend/streamwrapped/models.py

from django.conf import settings
from django.db import models


class StatsCache(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    year = models.IntegerField()
    payload = models.JSONField()
    last_computed_at = models.DateTimeField(auto_now=True)
    source_last_watched_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "year")

    def __str__(self):
        return f"StatsCache(user={self.user_id}, year={self.year})"
