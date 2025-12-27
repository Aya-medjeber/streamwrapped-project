# backend/streamwrapped/analytics/metrics/top_actors.py

from ..utils import minutes_to_hours


def compute_top_actors(
    sessions: list[dict],
    title_metadata_map: dict,
    year: int,
    top_n: int = 5
) -> dict:
    """
    title_metadata_map expected shape:
      {
        title_id: {
          "title_name": str,
          "cast": [str, ...]
        }
      }
    """
    actor_minutes: dict[str, int] = {}

    for session in sessions:
        title_id = session.get("title_id")
        minutes = session.get("duration_minutes", 0)

        if not (isinstance(minutes, int) and minutes > 0 and title_id is not None):
            continue

        meta = title_metadata_map.get(title_id, {})
        cast = meta.get("cast", [])

        if not cast:
            continue

        # Split minutes across cast members to avoid double-counting
        split = max(1, len(cast))
        minutes_per_actor = minutes // split
        remainder = minutes % split

        for i, actor in enumerate(cast):
            if not isinstance(actor, str) or not actor.strip():
                continue

            actor = actor.strip()

            add_minutes = minutes_per_actor
            if i < remainder:
                add_minutes += 1

            actor_minutes[actor] = actor_minutes.get(actor, 0) + add_minutes

    # Sort: minutes desc, then actor name asc for stability
    sorted_items = sorted(
        actor_minutes.items(),
        key=lambda x: (-x[1], x[0].lower())
    )

    top = []
    for idx, (name, mins) in enumerate(sorted_items[:top_n], start=1):
        top.append({
            "name": name,
            "minutes": mins,
            "hours": minutes_to_hours(mins),
            "rank": idx
        })

    return {
        "year": year,
        "top_actors": top
    }
