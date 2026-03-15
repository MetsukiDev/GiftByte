from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, HttpUrl


class GiftBase(BaseModel):
    title: str
    description: Optional[str] = None
    product_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    gift_type: str = "single"


class GiftCreate(GiftBase):
    pass


class GiftUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    product_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    gift_type: Optional[str] = None
    status: Optional[str] = None
    external_product_status: Optional[str] = None


class GiftOwnerView(BaseModel):
    id: str
    wishlist_id: str
    title: str
    description: Optional[str] = None
    product_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    gift_type: str
    status: str
    external_product_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GiftPublicView(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    product_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    price: Optional[Decimal] = None
    currency: Optional[str] = None
    gift_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FundingSummary(BaseModel):
    gift_id: str
    total_contributed: Decimal
    currency: Optional[str] = None

