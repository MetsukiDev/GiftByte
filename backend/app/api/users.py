from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.models import User
from app.schemas.user import UserMe, UserUpdate


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserMe)
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserMe)
def update_me(
    data: UserUpdate,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    user: User = current_user
    if data.nickname is not None:
        user.nickname = data.nickname
    if data.avatar_url is not None:
        user.avatar_url = str(data.avatar_url)
    if data.payout_method is not None:
        user.payout_method = data.payout_method
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

