# backend/streamwrapped/urls.py

from django.urls import path
from .views_wrapped import wrapped_year_summary

urlpatterns = [
    path("api/wrapped/<int:year>/summary/", wrapped_year_summary, name="wrapped-year-summary"),
]
