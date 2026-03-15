from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, HttpUrl


class UserMe(BaseModel):
    id: str
    email: EmailStr
    nickname: str
    avatar_url: Optional[HttpUrl] = None
    payout_method: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None
    payout_method: Optional[str] = None

