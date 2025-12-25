from __future__ import annotations
from dataclasses import dataclass
from datetime import date, timedelta
from typing import List, Dict, Any

DEFAULT_EPISODE_MINUTES = 45

def minutes_for_event(e) -> int:
    # Prefer explicit runtime_minutes
    if e.runtime_minutes is not None:
        return max(0, int(e.runtime_minutes))
    # Fall back to episode_count estimate
    if e.episode_count is not None:
        return max(0, int(e.episode_count) * DEFAULT_EPISODE_MINUTES)
    return 0

def longest_streak(days: List[date]) -> Dict[str, Any]:
    if not days:
        return {"max_days": 0, "start": None, "end": None}

    days = sorted(set(days))
    best_len = 1
    best_start = days[0]
    best_end = days[0]

    cur_len = 1
    cur_start = days[0]

    for i in range(1, len(days)):
        if days[i] == days[i - 1] + timedelta(days=1):
            cur_len += 1
        else:
            if cur_len > best_len:
                best_len = cur_len
                best_start = cur_start
                best_end = days[i - 1]
            cur_len = 1
            cur_start = days[i]

    # final check
    if cur_len > best_len:
        best_len = cur_len
        best_start = cur_start
        best_end = days[-1]

    return {
        "max_days": best_len,
        "start": best_start.isoformat(),
        "end": best_end.isoformat(),
    }

def build_wrapped_summary(events, year: int) -> Dict[str, Any]:
    # events: list of WatchEvent objects
    total_minutes = 0
    title_minutes: Dict[str, int] = {}
    media_breakdown = {"movie": {"count": 0, "minutes": 0}, "series": {"count": 0, "minutes": 0}}
    watched_days: List[date] = []

    for e in events:
        m = minutes_for_event(e)
        total_minutes += m

        title_minutes[e.title] = title_minutes.get(e.title, 0) + m

        mt = (e.media_type or "").lower()
        if mt in media_breakdown:
            media_breakdown[mt]["count"] += 1
            media_breakdown[mt]["minutes"] += m

        watched_days.append(e.watched_at)

    total_titles = len(set([e.title for e in events]))

    top_titles = sorted(
        [{"title": t, "minutes": mins} for t, mins in title_minutes.items()],
        key=lambda x: x["minutes"],
        reverse=True,
    )[:10]

    unique_days = sorted(set(watched_days))
    binge = longest_streak(unique_days)
    watch_days = len(unique_days)
    avg_minutes_per_day = round(total_minutes / watch_days, 2) if watch_days else 0

    return {
        "year": year,
        "total_minutes": total_minutes,
        "total_titles": total_titles,
        "watch_days": watch_days,
        "avg_minutes_per_day": avg_minutes_per_day,
        "media_type_breakdown": media_breakdown,
        "top_titles": top_titles,
        "binge_streak": binge,
        "assumptions": {
            "default_episode_minutes": DEFAULT_EPISODE_MINUTES,
            "series_minutes_if_missing_runtime": "episode_count * default_episode_minutes",
        },
    }
