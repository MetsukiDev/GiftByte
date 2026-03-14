"""Event routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Event, User
from app.schemas import EventCreate, EventResponse

router = APIRouter(prefix="/events", tags=["events"])


@router.post("", response_model=EventResponse)
def create_event(data: EventCreate, db: Session = Depends(get_db)):
    """Create a new event (celebration wishlist)."""
    if not db.query(User).filter(User.id == data.owner_id).first():
        raise HTTPException(status_code=404, detail="Owner user not found")
    event = Event(
        owner_id=data.owner_id,
        title=data.title,
        description=data.description,
        event_date=data.event_date,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: str, db: Session = Depends(get_db)):
    """Get event by id."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
