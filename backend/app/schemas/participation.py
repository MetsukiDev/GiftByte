from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel


class ParticipationItem(BaseModel):
    wishlist_id: str
    wishlist_title: str
    # Only present when wishlist is published and has a slug
    wishlist_slug: Optional[str] = None
    # None for followed-only items (no specific gift)
    gift_id: Optional[str] = None
    gift_title: Optional[str] = None
    gift_status: Optional[str] = None
    participation_type: Literal["reserved", "contributed", "followed"]
    # Only set for contributions
    amount: Optional[Decimal] = None
