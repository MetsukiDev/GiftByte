"""GiftByte API — cyberpunk wishlist platform MVP backend.

Structure:
- core/        config, database, security
- models/      SQLAlchemy models
- schemas/     Pydantic request/response models
- api/         FastAPI routers (HTTP + WebSocket)
- services/    Business logic and permission checks
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
from app.api import auth, users, wishlists, gifts, wallet, ws, public
from app.models import *  # noqa: F401,F403  (needed so Base.metadata sees all models)


settings = get_settings()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create SQLAlchemy tables on startup."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created or already exist.")
    yield


app = FastAPI(
    title=settings.app_name,
    description="Cyberpunk themed wishlist platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(wishlists.router)
app.include_router(gifts.router)
app.include_router(wallet.router)
app.include_router(ws.router)
app.include_router(public.router)


@app.get("/")
def root():
    return {"app": settings.app_name, "docs": "/docs"}
