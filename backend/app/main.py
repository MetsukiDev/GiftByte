"""GiftByte API — cyberpunk wishlist platform.

Fixes applied for "Application startup failed":
- Import routes from app.routes (not app.routers) to match project structure.
- All models are imported so Base.metadata.create_all() creates every table.
- Lifespan wraps create_all in try/except; optional SKIP_DB_INIT=1 lets server start without DB.
- Config loads .env via python-dotenv (UTF-8) so DATABASE_URL is set correctly.
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import Base, engine
# Import all models so they are registered with Base before create_all()
from app.models import (
    User,
    Event,
    Gift,
    Reservation,
    Contribution,
    Wallet,
    Transaction,
)
from app.routes import users, events, gifts, contributions

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create SQLAlchemy tables on startup. Safe session handling is via get_db() in routes."""
    if os.environ.get("SKIP_DB_INIT") == "1":
        logger.warning("SKIP_DB_INIT=1: skipping table creation. Set DATABASE_URL and restart without it for DB.")
        yield
        return
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created or already exist.")
    except Exception as e:
        logger.exception("Database startup failed.")
        # Avoid embedding exception message (can contain non-UTF-8 bytes on Windows and break startup)
        raise RuntimeError(
            "Database startup failed. Check DATABASE_URL in .env (save .env as UTF-8) and that PostgreSQL is running."
        )
    yield


app = FastAPI(
    title="GiftByte",
    description="Cyberpunk themed wishlist platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Include all route modules (users, events, gifts, contributions)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(gifts.router)
app.include_router(contributions.router)


@app.get("/")
def root():
    return {"app": "GiftByte", "docs": "/docs"}
