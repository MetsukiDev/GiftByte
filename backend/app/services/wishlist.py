import secrets
import string
from typing import Iterable

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Wishlist, Gift, GiftReservation, GiftContribution


SLUG_CHARS = string.ascii_lowercase + string.digits


def _generate_slug() -> str:
    return "".join(secrets.choice(SLUG_CHARS) for _ in range(10))


def generate_unique_slug(db: Session) -> str:
    while True:
        slug = _generate_slug()
        if not db.query(Wishlist).filter(Wishlist.public_slug == slug).first():
            return slug


def ensure_owner(wishlist: Wishlist, user_id: str):
    if wishlist.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not wishlist owner")


def create_wishlist(db: Session, owner_id: str, data) -> Wishlist:
    wishlist = Wishlist(
        owner_id=owner_id,
        title=data.title,
        description=data.description,
        event_date=data.event_date,
        is_public=data.is_public,
        cover_image_url=str(data.cover_image_url) if data.cover_image_url else None,
    )
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist


def list_my_wishlists(db: Session, owner_id: str) -> Iterable[Wishlist]:
    return db.query(Wishlist).filter(Wishlist.owner_id == owner_id).order_by(Wishlist.created_at.desc()).all()


def get_wishlist_or_404(db: Session, wishlist_id: str) -> Wishlist:
    wishlist = db.get(Wishlist, wishlist_id)
    if not wishlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    return wishlist


def update_wishlist(db: Session, wishlist: Wishlist, data) -> Wishlist:
    if data.title is not None:
        wishlist.title = data.title
    if data.description is not None:
        wishlist.description = data.description
    if data.event_date is not None:
        wishlist.event_date = data.event_date
    if data.is_public is not None:
        wishlist.is_public = data.is_public
    if data.cover_image_url is not None:
        wishlist.cover_image_url = str(data.cover_image_url)
    if data.status is not None:
        wishlist.status = data.status
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist


def publish_wishlist(db: Session, wishlist: Wishlist) -> Wishlist:
    if not wishlist.public_slug:
        wishlist.public_slug = generate_unique_slug(db)
    wishlist.is_public = True
    wishlist.status = "published"
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist


def get_public_wishlist_by_slug(db: Session, slug: str) -> Wishlist:
    wishlist = db.query(Wishlist).filter(Wishlist.public_slug == slug, Wishlist.is_public.is_(True)).first()
    if not wishlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist not found")
    return wishlist


def calculate_funding_summary(db: Session, gift: Gift) -> float:
    total = (
        db.query(func.coalesce(func.sum(GiftContribution.amount), 0))
        .filter(GiftContribution.gift_id == gift.id)
        .scalar()
    )
    return float(total or 0)

