from fastapi import APIRouter, Depends
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


router = APIRouter(tags=["gifts"])


@router.post("/wishlists/{wishlist_id}/gifts", response_model=GiftOwnerView)
def create_gift_endpoint(
    wishlist_id: str,
    data: GiftCreate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wishlist = gift_service.ensure_wishlist_owner(db, wishlist_id, current_user.id)
    gift = gift_service.create_gift(db, wishlist, data)
    return gift


@router.get("/wishlists/{wishlist_id}/gifts", response_model=list[GiftPublicView])
def list_wishlist_gifts_public(
    wishlist_id: str,
    db: DbSession,
):
    # Public listing: we don't expose reserver / contributor identities in this schema.
    wishlist = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    gifts = gift_service.list_gifts_for_wishlist(db, wishlist.id)
    return gifts


@router.patch("/gifts/{gift_id}", response_model=GiftOwnerView)
def update_gift_endpoint(
    gift_id: str,
    data: GiftUpdate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    return gift_service.update_gift(db, gift, data)


@router.delete("/gifts/{gift_id}")
def delete_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    gift_service.delete_gift(db, gift)
    return {"detail": "deleted"}


@router.post("/gifts/{gift_id}/reserve")
def reserve_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    guest_name = None
    gift_service.reserve_gift(db, gift, guest_name=guest_name, user_id=current_user.id)
    return {"detail": "reserved"}


@router.post("/gifts/{gift_id}/unreserve")
def unreserve_gift_endpoint(
    gift_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    wishlist = gift.wishlist
    # Only owner can forcibly clear reservations in this MVP
    gift_service.ensure_wishlist_owner(db, wishlist.id, current_user.id)
    gift_service.unreserve_gift(db, gift)
    return {"detail": "unreserved"}


@router.post("/gifts/{gift_id}/contribute")
def contribute_gift_endpoint(
    gift_id: str,
    amount: float,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    gift_service.contribute_to_gift(db, gift, amount=amount, user_id=current_user.id, guest_name=None)
    return {"detail": "contributed"}


@router.get("/gifts/{gift_id}/funding-summary", response_model=FundingSummary)
def funding_summary_endpoint(
    gift_id: str,
    db: DbSession,
):
    gift = gift_service.get_gift_or_404(db, gift_id)
    total = wishlist_service.calculate_funding_summary(db, gift)
    return FundingSummary(gift_id=gift.id, total_contributed=total, currency=gift.currency)

