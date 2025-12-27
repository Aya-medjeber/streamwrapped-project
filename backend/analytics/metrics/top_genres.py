# backend/streamwrapped/analytics/metrics/top_genres.py

from ..utils import minutes_to_hours


def compute_top_genres(
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
          "genres": [str, ...]
        }
      }
    """
    genre_minutes: dict[str, int] = {}

    for session in sessions:
        title_id = session.get("title_id")
        minutes = session.get("duration_minutes", 0)

        if not (isinstance(minutes, int) and minutes > 0 and title_id is not None):
            continue

        meta = title_metadata_map.get(title_id, {})
        genres = meta.get("genres", [])

        # If no genres, skip (or you can bucket into "Unknown")
        if not genres:
            continue

        # Split minutes across genres to avoid double-counting
        split = max(1, len(genres))
        minutes_per_genre = minutes // split
        remainder = minutes % split

        for i, genre in enumerate(genres):
            if not isinstance(genre, str) or not genre.strip():
                continue

            genre = genre.strip()

            add_minutes = minutes_per_genre
            # distribute remainder minutes to first genres
            if i < remainder:
                add_minutes += 1

            genre_minutes[genre] = genre_minutes.get(genre, 0) + add_minutes

    # Sort genres by minutes desc, then name asc for stability
    sorted_items = sorted(
        genre_minutes.items(),
        key=lambda x: (-x[1], x[0].lower())
    )

    top = []
    for idx, (genre, mins) in enumerate(sorted_items[:top_n], start=1):
        top.append({
            "genre": genre,
            "minutes": mins,
            "hours": minutes_to_hours(mins),
            "rank": idx
        })

    return {
        "year": year,
        "top_genres": top
    }
