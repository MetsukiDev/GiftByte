from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class WalletView(BaseModel):
    id: str
    user_id: str
    balance: Decimal
    currency: str
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionView(BaseModel):
    id: str
    wallet_id: str
    type: str
    amount: Decimal
    status: str
    metadata_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

