from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, HttpUrl


class WishlistBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    is_public: bool = False
    cover_image_url: Optional[HttpUrl] = None


class WishlistCreate(WishlistBase):
    pass


class WishlistUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    is_public: Optional[bool] = None
    cover_image_url: Optional[HttpUrl] = None
    status: Optional[str] = None


class WishlistOwnerView(BaseModel):
    id: str
    owner_id: str
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    is_public: bool
    public_slug: Optional[str] = None
    cover_image_url: Optional[HttpUrl] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WishlistPublicView(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    cover_image_url: Optional[HttpUrl] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class GiftFundingItem(BaseModel):
    gift_id: str
    title: str
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    gift_type: str
    status: str
    total_contributed: Decimal
    progress: Optional[float] = None


class WishlistFundingOverview(BaseModel):
    wishlist_id: str
    total_contributed: Decimal
    currency: Optional[str] = None
    gifts: list[GiftFundingItem]

