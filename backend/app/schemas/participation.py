from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel


class ParticipationItem(BaseModel):
    wishlist_id: str
    wishlist_title: str
    # Only present when wishlist is published and has a slug — never None for archived/draft
    wishlist_slug: Optional[str] = None
    gift_id: str
    gift_title: str
    gift_status: str
    participation_type: Literal["reserved", "contributed"]
    # Only set for contributions
    amount: Optional[Decimal] = None
