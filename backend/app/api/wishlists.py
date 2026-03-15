from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.models import Wishlist
from app.schemas.wishlist import (
    WishlistCreate,
    WishlistUpdate,
    WishlistOwnerView,
    WishlistPublicView,
)
from app.services import wishlist as wishlist_service


router = APIRouter(prefix="/wishlists", tags=["wishlists"])


@router.post("", response_model=WishlistOwnerView)
def create_wishlist(
    data: WishlistCreate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.create_wishlist(db, owner_id=current_user.id, data=data)
    return wl


@router.get("/me", response_model=list[WishlistOwnerView])
def list_my_wishlists(
    db: DbSession,
    current_user=Depends(get_current_user),
):
    return list(wishlist_service.list_my_wishlists(db, owner_id=current_user.id))


@router.get("/{wishlist_id}", response_model=WishlistOwnerView)
def get_wishlist(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    return wl


@router.patch("/{wishlist_id}", response_model=WishlistOwnerView)
def update_wishlist_endpoint(
    wishlist_id: str,
    data: WishlistUpdate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    return wishlist_service.update_wishlist(db, wl, data)


@router.post("/{wishlist_id}/publish", response_model=WishlistOwnerView)
def publish_wishlist_endpoint(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    return wishlist_service.publish_wishlist(db, wl)


@router.get("/public/{public_slug}", response_model=WishlistPublicView)
def get_public_wishlist(public_slug: str, db: DbSession):
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    return wl

