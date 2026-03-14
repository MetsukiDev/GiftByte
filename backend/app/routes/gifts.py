"""Gift routes."""

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Gift, Reservation, Contribution
from app.schemas import GiftCreate, GiftResponse, GiftWithProgress

router = APIRouter(tags=["gifts"])


@router.post("/gifts", response_model=GiftResponse)
def create_gift(data: GiftCreate, db: Session = Depends(get_db)):
    """Create a gift for an event."""
    gift = Gift(
        event_id=data.event_id,
        title=data.title,
        description=data.description,
        target_amount=data.target_amount,
        link_url=data.link_url,
    )
    db.add(gift)
    db.commit()
    db.refresh(gift)
    return gift


@router.get("/events/{event_id}/gifts", response_model=list[GiftWithProgress])
def list_event_gifts(event_id: str, db: Session = Depends(get_db)):
    """List gifts for an event with progress (reserved flag, contributed amount). No donor identity."""
    gifts = db.query(Gift).filter(Gift.event_id == event_id).all()
    result = []
    for g in gifts:
        is_reserved = db.query(Reservation).filter(Reservation.gift_id == g.id).first() is not None
        contributed = (
            db.query(func.coalesce(func.sum(Contribution.amount), 0))
            .filter(Contribution.gift_id == g.id)
            .scalar()
            or Decimal("0")
        )
        result.append(
            GiftWithProgress(
                id=g.id,
                event_id=g.event_id,
                title=g.title,
                description=g.description,
                target_amount=g.target_amount,
                link_url=g.link_url,
                created_at=g.created_at,
                is_reserved=is_reserved,
                contributed_amount=contributed,
            )
        )
    return result
