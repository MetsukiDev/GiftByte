from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.schemas.auth import RegisterRequest, LoginRequest, Token, UserPublic
from app.services import auth as auth_service


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic)
def register(data: RegisterRequest, db: DbSession):
    user = auth_service.register_user(db, email=data.email, password=data.password, nickname=data.nickname)
    return user


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: DbSession):
    access_token = auth_service.authenticate_user(db, email=data.email, password=data.password)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserPublic)
def me(current_user=Depends(get_current_user)):
    return current_user

