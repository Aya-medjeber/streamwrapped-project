# backend/streamwrapped/views_wrapped.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from streamwrapped.analytics.summary_cached import get_or_build_yearly_summary


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wrapped_year_summary(request, year: int):
    """
    GET /api/wrapped/<year>/summary/
    Returns cached or freshly computed yearly summary for the authenticated user.
    """
    # Basic validation
    if year < 2000 or year > 2100:
        return Response(
            {"detail": "Invalid year."},
            status=status.HTTP_400_BAD_REQUEST
        )

    payload = get_or_build_yearly_summary(request.user.id, year)
    return Response(payload, status=status.HTTP_200_OK)
