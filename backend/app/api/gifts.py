from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.schemas.gift import (
    GiftCreate,
    GiftUpdate,
    GiftOwnerView,
    GiftPublicView,
    FundingSummary,
)
from app.services import gift as gift_service
from app.services import wishlist as wishlist_service
from app.api.ws import manager
from app.schemas.gift import FundingSummary
from pydantic import BaseModel


class ContributionRequest(BaseModel):
    amount: float
    use_wallet: bool = False


router = APIRouter(tags=["gifts"])


@router.post("/wishlists/{wishlist_id}/gifts", response_model=GiftOwnerView)
async def create_gift_endpoint(
    wishlist_id: str,
    data: GiftCreate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wishlist = gift_service.ensure_wishlist_owner(db, wishlist_id, current_user.id)
    gift = gift_service.create_gift(db, wishlist, data)
    # Broadcast gift_created event
    await manager.broadcast(
        wishlist_id=wishlist.id,
        message={
            "type": "gift_created",
            "wishlist_id": wishlist.id,
            "gift_id": gift.id,
            "data": GiftPublicView.model_validate(gift).model_dump(),
        },
    )
    return gift


@router.get("/wishlists/{wishlist_id}/gifts", response_model=list[GiftPublicView])
def list_wishlist_gifts_public(
    wishlist_id: str,
    db: DbSession,
):
    """
    Public listing: no reserver / contributor identities are exposed.
    Only wishlists that are published & public can be viewed without auth.
    """
    wishlist = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    if not (wishlist.is_public and wishlist.status == "published"):
        # Do not leak existence of private or draft wishlists
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Wishlist not found",
        )
    gifts = gift_service.list_gifts_for_wishlist(db, wishlist.id)
    return gifts


@router.patch("/gifts/{gift_id}", response_model=GiftOwnerView)
async def update_gift_endpoint(
    gift_id: str,
    data: GiftUpdate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    gift = gift_service.update_gift(db, gift, data)
    await manager.broadcast(
        wishlist_id=wishlist.id,
        message={
            "type": "gift_updated",
            "wishlist_id": wishlist.id,
            "gift_id": gift.id,
            "data": GiftPublicView.model_validate(gift).model_dump(),
        },
    )
    return gift


@router.delete("/gifts/{gift_id}")
async def delete_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    gift_service.delete_gift(db, gift)
    await manager.broadcast(
        wishlist_id=wishlist.id,
        message={
            "type": "gift_archived",
            "wishlist_id": wishlist.id,
            "gift_id": gift.id,
            "data": {"id": gift.id},
        },
    )
    return {"detail": "deleted"}


@router.post("/gifts/{gift_id}/reserve")
async def reserve_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    guest_name = None
    reservation = gift_service.reserve_gift(db, gift, guest_name=guest_name, user_id=current_user.id)
    await manager.broadcast(
        wishlist_id=gift.wishlist_id,
        message={
            "type": "gift_reserved",
            "wishlist_id": gift.wishlist_id,
            "gift_id": gift.id,
            "data": {"gift_id": gift.id},
        },
    )
    return {"detail": "reserved"}


@router.post("/gifts/{gift_id}/unreserve")
async def unreserve_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    # Only owner can forcibly clear reservations in this MVP
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    gift_service.unreserve_gift(db, gift)
    await manager.broadcast(
        wishlist_id=wishlist.id,
        message={
            "type": "gift_unreserved",
            "wishlist_id": wishlist.id,
            "gift_id": gift.id,
            "data": {"gift_id": gift.id},
        },
    )
    return {"detail": "unreserved"}


@router.post("/gifts/{gift_id}/contribute")
async def contribute_gift_endpoint(
    gift_id: str,
    data: ContributionRequest,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    contribution = gift_service.contribute_to_gift(
        db,
        gift,
        amount=data.amount,
        user_id=current_user.id,
        guest_name=None,
        use_wallet=data.use_wallet,
    )
    # Broadcast contribution and potential funding status change
    await manager.broadcast(
        wishlist_id=gift.wishlist_id,
        message={
            "type": "contribution_added",
            "wishlist_id": gift.wishlist_id,
            "gift_id": gift.id,
            "data": {"gift_id": gift.id, "amount": data.amount},
        },
    )
    if gift.status == "funded":
        await manager.broadcast(
            wishlist_id=gift.wishlist_id,
            message={
                "type": "gift_funded",
                "wishlist_id": gift.wishlist_id,
                "gift_id": gift.id,
                "data": {"gift_id": gift.id},
            },
        )
    return {"detail": "contributed"}


@router.get("/gifts/{gift_id}/funding-summary", response_model=FundingSummary)
def funding_summary_endpoint(
    gift_id: str,
    db: DbSession,
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    total = wishlist_service.calculate_funding_summary(db, gift)
    target = gift.price
    progress = None
    if target and float(target) > 0:
        progress = float(total) / float(target)
    return FundingSummary(
        gift_id=gift.id,
        total_contributed=total,
        target_amount=target,
        progress=progress,
        currency=gift.currency,
    )

