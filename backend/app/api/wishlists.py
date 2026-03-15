from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status as http_status

from app.api.deps import DbSession, get_current_user
from app.models import Wishlist, Wallet, Transaction
from app.schemas.wishlist import (
    WishlistCreate,
    WishlistUpdate,
    WishlistOwnerView,
    WishlistPublicView,
    WishlistFundingOverview,
)
from app.services import wishlist as wishlist_service
from app.api.ws import manager


router = APIRouter(prefix="/wishlists", tags=["wishlists"])


@router.post("", response_model=WishlistOwnerView)
async def create_wishlist(
    data: WishlistCreate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.create_wishlist(db, owner_id=current_user.id, data=data)
    await manager.broadcast(
        wishlist_id=wl.id,
        message={
            "type": "wishlist_updated",
            "wishlist_id": wl.id,
            "data": WishlistPublicView.model_validate(wl).model_dump(),
        },
    )
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
async def update_wishlist_endpoint(
    wishlist_id: str,
    data: WishlistUpdate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    wl = wishlist_service.update_wishlist(db, wl, data)
    await manager.broadcast(
        wishlist_id=wl.id,
        message={
            "type": "wishlist_updated",
            "wishlist_id": wl.id,
            "data": WishlistPublicView.model_validate(wl).model_dump(),
        },
    )
    return wl


@router.post("/{wishlist_id}/publish", response_model=WishlistOwnerView)
async def publish_wishlist_endpoint(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    wl = wishlist_service.publish_wishlist(db, wl)
    await manager.broadcast(
        wishlist_id=wl.id,
        message={
            "type": "wishlist_updated",
            "wishlist_id": wl.id,
            "data": WishlistPublicView.model_validate(wl).model_dump(),
        },
    )
    return wl


@router.post("/{wishlist_id}/release-funds")
async def release_funds(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    now = datetime.utcnow()
    if wl.funds_released:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Funds already released",
        )
    if wl.event_date and wl.event_date > now and wl.status != "closed":
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Funds can be released only after event date or when wishlist is closed",
        )

    overview = wishlist_service.funding_overview_for_wishlist(db, wl)
    total = float(overview.total_contributed)
    if total <= 0:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="No funds to release",
        )

    # Credit owner's wallet with a payout transaction
    from app.services import wallet as wallet_service

    owner_wallet = wallet_service.get_or_create_wallet(db, current_user)
    owner_wallet.balance += total
    payout_tx = Transaction(
        wallet_id=owner_wallet.id,
        type="payout",
        amount=total,
        status="completed",
        metadata_json=f'{{"wishlist_id": "{wl.id}"}}',
    )
    wl.funds_released = True
    wl.funds_released_at = now
    wl.status = "closed"

    db.add(owner_wallet)
    db.add(payout_tx)
    db.add(wl)
    db.commit()

    await manager.broadcast(
        wishlist_id=wl.id,
        message={
            "type": "wishlist_funds_released",
            "wishlist_id": wl.id,
            "data": {
                "wishlist_id": wl.id,
                "total_released": total,
            },
        },
    )
    return {"detail": "funds_released", "total_released": total}


@router.get("/{wishlist_id}/funding-overview", response_model=WishlistFundingOverview)
def funding_overview(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    return wishlist_service.funding_overview_for_wishlist(db, wl)


@router.delete("/{wishlist_id}")
def delete_wishlist_endpoint(
    wishlist_id: str,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wl = wishlist_service.get_wishlist_or_404(db, wishlist_id)
    wishlist_service.ensure_owner(wl, current_user.id)
    wishlist_service.archive_wishlist(db, wl)
    return {"detail": "deleted"}

