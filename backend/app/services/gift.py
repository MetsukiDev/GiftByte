from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Gift, GiftReservation, GiftContribution, Wishlist


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
    return db.query(Gift).filter(Gift.wishlist_id == wishlist_id).all()


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
    db.delete(gift)
    db.commit()


def reserve_gift(db: Session, gift: Gift, guest_name: str | None, user_id: str | None):
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


def contribute_to_gift(db: Session, gift: Gift, amount: float, user_id: str | None, guest_name: str | None):
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be positive")
    contribution = GiftContribution(
        gift_id=gift.id,
        contributor_user_id=user_id,
        contributor_guest_name=guest_name,
        amount=amount,
    )
    if gift.gift_type == "group" and gift.status in {"available", "funding"}:
        gift.status = "funding"
    db.add(contribution)
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return contribution

