"""Database configuration and session management.

- Engine is created using DATABASE_URL from app.config (loaded from .env via python-dotenv).
- get_db() is a generator dependency: FastAPI uses it with Depends(get_db) so each
  request gets its own session, and the session is always closed in a 'finally' block
  (safe session handling). Do not use the session after the request ends.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verify connections before use (handles stale DB connections)
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that yields a database session. Session is closed when the request ends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
