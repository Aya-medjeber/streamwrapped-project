# backend/streamwrapped/analytics/summary_cached.py

from .cache import get_cached_summary, save_cached_summary
from .summary import build_yearly_summary


def get_or_build_yearly_summary(user_id: int, year: int) -> dict:
    cached = get_cached_summary(user_id, year)
    if cached is not None:
        return cached

    payload = build_yearly_summary(user_id, year)
    save_cached_summary(user_id, year, payload)
    return payload
