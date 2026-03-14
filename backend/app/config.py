"""Application configuration.

Loads .env using python-dotenv. By default load_dotenv() uses the current
working directory, so run uvicorn from the backend directory:
  cd backend && python -m uvicorn app.main:app --reload
Avoids path-based loading to prevent encoding errors on Windows with non-ASCII paths.
"""

import os

from dotenv import load_dotenv

# Load .env from cwd; use UTF-8 so DATABASE_URL is read correctly (save .env as UTF-8 on Windows)
load_dotenv(encoding="utf-8")


class Settings:
    """App settings from environment. DATABASE_URL from .env or env."""

    database_url: str = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/giftbyte",
    )


settings = Settings()
