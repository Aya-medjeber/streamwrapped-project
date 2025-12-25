import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///streamwrapped.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")

    access_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "60"))
    refresh_days = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", "14"))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=access_minutes)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=refresh_days)
