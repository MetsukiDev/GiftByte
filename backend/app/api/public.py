from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.api.deps import DbSession
from app.schemas.wishlist import WishlistPublicView
from app.services import wishlist as wishlist_service
from app.services import gift as gift_service
from app.api.ws import manager


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
):
    """Guest-friendly reserve — no auth required. Wishlist must be published."""
    gift = gift_service.get_gift_or_404(db, gift_id)
    # Ensure the wishlist is published/public before allowing guest actions
    wishlist = gift.wishlist
    if not (wishlist.is_public and wishlist.status == "published"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    gift_service.reserve_gift(db, gift, guest_name=data.guest_name, user_id=None)
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
):
    """Guest-friendly contribute — no auth required. Wishlist must be published."""
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    if not (wishlist.is_public and wishlist.status == "published"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    gift_service.contribute_to_gift(
        db, gift, amount=data.amount, user_id=None, guest_name=data.guest_name, use_wallet=False
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

