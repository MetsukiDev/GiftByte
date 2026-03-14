"""Pydantic schemas for request/response validation."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, EmailStr


# ----- Users -----
class UserRegister(BaseModel):
    email: EmailStr
    display_name: str


class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# ----- Events -----
class EventCreate(BaseModel):
    owner_id: str
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None


class EventResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ----- Gifts -----
class GiftCreate(BaseModel):
    event_id: str
    title: str
    description: Optional[str] = None
    target_amount: Optional[Decimal] = None
    link_url: Optional[str] = None


class GiftResponse(BaseModel):
    id: str
    event_id: str
    title: str
    description: Optional[str] = None
    target_amount: Optional[Decimal] = None
    link_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class GiftWithProgress(GiftResponse):
    """Gift with reserved flag and contribution progress (no donor identity)."""
    is_reserved: bool = False
    contributed_amount: Decimal = Decimal("0")


# ----- Contributions -----
class ContributionCreate(BaseModel):
    gift_id: str
    user_id: str
    amount: Decimal


class ContributionResponse(BaseModel):
    id: str
    gift_id: str
    amount: Decimal
    created_at: datetime

    class Config:
        from_attributes = True
