from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.models import Gift, GiftReservation, GiftContribution, Wishlist, WishlistFollow
from app.schemas.participation import ParticipationItem

router = APIRouter(prefix="/participation", tags=["participation"])


@router.get("/me", response_model=list[ParticipationItem])
def get_my_participation(
    db: DbSession,
    current_user=Depends(get_current_user),
):
    """
    Returns all gifts where the current user has an active reservation
    or has made a contribution, excluding their own wishlists.
    Archived wishlists are included in results (participation history)
    but wishlist_slug is only set when the wishlist is published and public.
    """
    items: list[ParticipationItem] = []

    # Active reservations made by this user on other people's wishlists
    reservations = (
        db.query(GiftReservation)
        .join(Gift, Gift.id == GiftReservation.gift_id)
        .join(Wishlist, Wishlist.id == Gift.wishlist_id)
        .filter(
            GiftReservation.reserved_by_user_id == current_user.id,
            GiftReservation.cancelled_at.is_(None),
            Wishlist.owner_id != current_user.id,
            Gift.status != "archived",
        )
        .all()
    )
    for r in reservations:
        gift: Gift = r.gift
        wishlist: Wishlist = gift.wishlist
        # Only expose slug when wishlist is still published and public
        slug = (
            wishlist.public_slug
            if wishlist.is_public and wishlist.status == "published"
            else None
        )
        items.append(
            ParticipationItem(
                wishlist_id=wishlist.id,
                wishlist_title=wishlist.title,
                wishlist_slug=slug,
                gift_id=gift.id,
                gift_title=gift.title,
                gift_status=gift.status,
                participation_type="reserved",
                amount=None,
            )
        )

    # Contributions made by this user on other people's wishlists
    # Group by gift to avoid one row per contribution — sum amounts per gift
    from sqlalchemy import func

    contribution_rows = (
        db.query(
            GiftContribution.gift_id,
            func.sum(GiftContribution.amount).label("total"),
        )
        .filter(GiftContribution.contributor_user_id == current_user.id)
        .group_by(GiftContribution.gift_id)
        .all()
    )

    for gift_id, total in contribution_rows:
        gift = db.get(Gift, gift_id)
        if gift is None or gift.status == "archived":
            continue
        wishlist = db.get(Wishlist, gift.wishlist_id)
        if wishlist is None or wishlist.owner_id == current_user.id:
            continue
        slug = (
            wishlist.public_slug
            if wishlist.is_public and wishlist.status == "published"
            else None
        )
        items.append(
            ParticipationItem(
                wishlist_id=wishlist.id,
                wishlist_title=wishlist.title,
                wishlist_slug=slug,
                gift_id=gift.id,
                gift_title=gift.title,
                gift_status=gift.status,
                participation_type="contributed",
                amount=total,
            )
        )

    # Followed wishlists — one entry per wishlist (no gift_id)
    follows = (
        db.query(WishlistFollow)
        .filter(WishlistFollow.user_id == current_user.id)
        .all()
    )
    for follow in follows:
        wishlist = db.get(Wishlist, follow.wishlist_id)
        if wishlist is None or wishlist.status == "archived":
            continue
        slug = (
            wishlist.public_slug
            if wishlist.is_public and wishlist.status == "published"
            else None
        )
        items.append(
            ParticipationItem(
                wishlist_id=wishlist.id,
                wishlist_title=wishlist.title,
                wishlist_slug=slug,
                gift_id=None,
                gift_title=None,
                gift_status=None,
                participation_type="followed",
                amount=None,
            )
        )

    return items
