from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Gift, GiftReservation, GiftContribution, Wishlist, Wallet, Transaction


def ensure_wishlist_owner(db: Session, wishlist_id: str, user_id: str) -> Wishlist:
    wishlist = db.get(Wishlist, wishlist_id)
    if not wishlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    if wishlist.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not wishlist owner")
    return wishlist


def create_gift(db: Session, wishlist: Wishlist, data) -> Gift:
    gift = Gift(
        wishlist_id=wishlist.id,
        title=data.title,
        description=data.description,
        product_url=str(data.product_url) if data.product_url else None,
        image_url=str(data.image_url) if data.image_url else None,
        price=data.price,
        currency=data.currency,
        gift_type=data.gift_type,
    )
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return gift


def list_gifts_for_wishlist(db: Session, wishlist_id: str) -> list[Gift]:
    # Do not return archived gifts to public/owner listings.
    return (
        db.query(Gift)
        .filter(Gift.wishlist_id == wishlist_id, Gift.status != "archived")
        .all()
    )


def get_gift_or_404(db: Session, gift_id: str) -> Gift:
    gift = db.get(Gift, gift_id)
    if not gift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found")
    return gift


def update_gift(db: Session, gift: Gift, data) -> Gift:
    if data.title is not None:
        gift.title = data.title
    if data.description is not None:
        gift.description = data.description
    if data.product_url is not None:
        gift.product_url = str(data.product_url)
    if data.image_url is not None:
        gift.image_url = str(data.image_url)
    if data.price is not None:
        gift.price = data.price
    if data.currency is not None:
        gift.currency = data.currency
    if data.gift_type is not None:
        gift.gift_type = data.gift_type
    if data.status is not None:
        gift.status = data.status
    if data.external_product_status is not None:
        gift.external_product_status = data.external_product_status
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return gift


def delete_gift(db: Session, gift: Gift):
    # Soft-delete by archiving so historical reservations / contributions remain valid.
    gift.status = "archived"
    db.add(gift)
    db.commit()


def is_reservation_owner(db: Session, gift: Gift, user_id: str) -> bool:
    """Return True if user_id holds the active reservation on this gift."""
    reservation = (
        db.query(GiftReservation)
        .filter(
            GiftReservation.gift_id == gift.id,
            GiftReservation.cancelled_at.is_(None),
            GiftReservation.reserved_by_user_id == user_id,
        )
        .first()
    )
    return reservation is not None


def reserve_gift(db: Session, gift: Gift, guest_name: str | None, user_id: str | None):
    if gift.gift_type == "group":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group gifts use contributions, not reservations",
        )
    existing = (
        db.query(GiftReservation)
        .filter(GiftReservation.gift_id == gift.id, GiftReservation.cancelled_at.is_(None))
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Gift already reserved")
    reservation = GiftReservation(
        gift_id=gift.id,
        reserved_by_user_id=user_id,
        reserved_by_guest_name=guest_name,
    )
    gift.status = "reserved"
    db.add(reservation)
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return reservation


def unreserve_gift(db: Session, gift: Gift):
    reservation = (
        db.query(GiftReservation)
        .filter(GiftReservation.gift_id == gift.id, GiftReservation.cancelled_at.is_(None))
        .first()
    )
    if not reservation:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Gift is not reserved")
    reservation.cancelled_at = datetime.utcnow()
    gift.status = "available"
    db.add(reservation)
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return reservation


def contribute_to_gift(
    db: Session,
    gift: Gift,
    amount: float,
    user_id: str | None,
    guest_name: str | None,
    use_wallet: bool = False,
):
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be positive")
    if gift.gift_type != "group":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only group gifts accept contributions",
        )
    if gift.status == "funded":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gift is already fully funded",
        )
    # Optionally deduct from contributor wallet (if authenticated and opted in)
    if use_wallet and user_id is not None:
        wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
        if not wallet:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contributor wallet not found")
        if wallet.balance < amount:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient wallet balance")
        wallet.balance -= amount
        tx = Transaction(
            wallet_id=wallet.id,
            type="contribution_hold",
            amount=amount,
            status="completed",
            metadata_json=None,
        )
        db.add(wallet)
        db.add(tx)

    contribution = GiftContribution(
        gift_id=gift.id,
        contributor_user_id=user_id,
        contributor_guest_name=guest_name,
        amount=amount,
    )
    # Update gift funding status based on total contributed vs price.
    if gift.price is not None:
        # Sum existing contributions and this one.
        # Using simple Python sum here; for large data consider an aggregate query.
        existing_total = sum(float(c.amount) for c in gift.contributions)
        new_total = existing_total + float(amount)
        target = float(gift.price)
        if new_total >= target:
            gift.status = "funded"
        elif gift.status in {"available", "funding"}:
            gift.status = "funding"
    else:
        if gift.status in {"available", "funding"}:
            gift.status = "funding"
    db.add(contribution)
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return contribution

