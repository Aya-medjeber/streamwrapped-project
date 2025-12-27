# backend/streamwrapped/analytics/utils.py

from datetime import datetime, timezone
from .constants import HOURS_ROUND_DECIMALS


def minutes_to_hours(total_minutes: int) -> float:
    """
    Convert minutes to hours, rounded to HOURS_ROUND_DECIMALS.
    """
    if total_minutes <= 0:
        return 0.0
    hours = total_minutes / 60.0
    return round(hours, HOURS_ROUND_DECIMALS)


def get_year_range(year: int) -> tuple[datetime, datetime]:
    """
    Returns a (start, end) datetime range for filtering the given year in UTC.
    End is exclusive: [start, end)
    """
    start = datetime(year, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    end = datetime(year + 1, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    return start, end
