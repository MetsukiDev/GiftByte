from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.api.deps import DbSession, get_current_user, get_optional_user
from app.schemas.wishlist import WishlistPublicView
from app.services import wishlist as wishlist_service
from app.services import gift as gift_service
from app.api.ws import manager
from app.models import WishlistFollow
from sqlalchemy.exc import IntegrityError


router = APIRouter(tags=["public"])


class GuestReserveRequest(BaseModel):
    guest_name: Optional[str] = None


class GuestContributeRequest(BaseModel):
    amount: float
    guest_name: Optional[str] = None


@router.get("/public/{public_slug}", response_model=WishlistPublicView)
def get_public_wishlist(public_slug: str, db: DbSession):
    """
    Public wishlist access without authentication.
    Only wishlists that are marked public & published are returned.
    """
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    return wl


@router.post("/public/gifts/{gift_id}/reserve")
async def public_reserve_gift(
    gift_id: str,
    data: GuestReserveRequest,
    db: DbSession,
    current_user=Depends(get_optional_user),
):
    """Reserve a gift. Auth optional — if authenticated, reservation is linked to account."""
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    if not (wishlist.is_public and wishlist.status == "published"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    user_id = current_user.id if current_user else None
    # Use guest_name only for anonymous reservations
    guest_name = data.guest_name if user_id is None else None
    gift_service.reserve_gift(db, gift, guest_name=guest_name, user_id=user_id)
    await manager.broadcast(
        wishlist_id=gift.wishlist_id,
        message={"type": "gift_reserved", "wishlist_id": gift.wishlist_id, "gift_id": gift.id, "data": {"gift_id": gift.id}},
    )
    return {"detail": "reserved"}


@router.post("/public/gifts/{gift_id}/contribute")
async def public_contribute_gift(
    gift_id: str,
    data: GuestContributeRequest,
    db: DbSession,
    current_user=Depends(get_optional_user),
):
    """Contribute to a group gift. Auth optional — if authenticated, contribution is linked to account."""
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    if not (wishlist.is_public and wishlist.status == "published"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    user_id = current_user.id if current_user else None
    # Use guest_name only for anonymous contributions
    guest_name = data.guest_name if user_id is None else None
    gift_service.contribute_to_gift(
        db, gift, amount=data.amount, user_id=user_id, guest_name=guest_name, use_wallet=False
    )
    await manager.broadcast(
        wishlist_id=gift.wishlist_id,
        message={"type": "contribution_added", "wishlist_id": gift.wishlist_id, "gift_id": gift.id, "data": {"gift_id": gift.id, "amount": data.amount}},
    )
    if gift.status == "funded":
        await manager.broadcast(
            wishlist_id=gift.wishlist_id,
            message={"type": "gift_funded", "wishlist_id": gift.wishlist_id, "gift_id": gift.id, "data": {"gift_id": gift.id}},
        )
    return {"detail": "contributed"}



# ── Follow / Save wishlist (auth required) ──────────────────────────────────

@router.get("/public/{public_slug}/follow-status")
def get_follow_status(
    public_slug: str,
    db: DbSession,
    current_user=Depends(get_optional_user),
):
    """Return whether the current user follows this wishlist. Returns false for guests."""
    if current_user is None:
        return {"following": False}
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    follow = (
        db.query(WishlistFollow)
        .filter(
            WishlistFollow.user_id == current_user.id,
            WishlistFollow.wishlist_id == wl.id,
        )
        .first()
    )
    return {"following": follow is not None}
@router.post("/public/{public_slug}/follow", status_code=status.HTTP_201_CREATED)
def follow_wishlist(
    public_slug: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    """Save / follow a public wishlist. Idempotent."""
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    if wl.owner_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot follow your own wishlist.",
        )
    follow = WishlistFollow(user_id=current_user.id, wishlist_id=wl.id)
    db.add(follow)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # already following — idempotent
    return {"detail": "following"}


@router.delete("/public/{public_slug}/follow", status_code=status.HTTP_200_OK)
def unfollow_wishlist(
    public_slug: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    """Unfollow / unsave a public wishlist."""
    wl = wishlist_service.get_public_wishlist_by_slug(db, public_slug)
    db.query(WishlistFollow).filter(
        WishlistFollow.user_id == current_user.id,
        WishlistFollow.wishlist_id == wl.id,
    ).delete()
    db.commit()
    return {"detail": "unfollowed"}
