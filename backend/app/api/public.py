from fastapi import APIRouter

from app.api.deps import DbSession
from app.schemas.wishlist import WishlistPublicView
from app.services import wishlist as wishlist_service


router = APIRouter(tags=["public"])


@router.get("/public/{public_slug}", response_model=WishlistPublicView)
def get_public_wishlist(public_slug: str, db: DbSession):
    """
    Public wishlist access without authentication.
    Only wishlists that are marked public & published are returned.
    """
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    return wl

