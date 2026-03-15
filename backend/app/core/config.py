"""Application configuration for GiftByte MVP.

Uses python-dotenv to load environment variables from a .env file located in the
backend directory. Keep DATABASE_URL and JWT secrets here (never commit the real
.env – use .env.example instead).
"""

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent.parent  # giftbyte/backend
ENV_PATH = BASE_DIR / ".env"

# Load .env once on import
if ENV_PATH.exists():
    load_dotenv(ENV_PATH, encoding="utf-8")


class Settings:
    """Strongly-typed settings for the application."""

    # Core
    app_name: str = "GiftByte"
    env: str = os.getenv("ENV", "development")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/giftbyte",
    )

    # Security / JWT
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expires_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "60")
    )

    # CORS
    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()

