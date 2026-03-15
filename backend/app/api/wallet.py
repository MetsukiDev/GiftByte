from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import DbSession, get_current_user
from app.schemas.wallet import WalletView, TransactionView
from app.services import wallet as wallet_service


router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("/me", response_model=WalletView)
def get_my_wallet(
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wallet = wallet_service.get_or_create_wallet(db, current_user)
    return wallet


@router.get("/me/transactions", response_model=list[TransactionView])
def get_my_wallet_transactions(
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wallet = wallet_service.get_or_create_wallet(db, current_user)
    return wallet.transactions


@router.post("/mock-topup", response_model=TransactionView)
def mock_topup_endpoint(
    amount: float,
    db: DbSession,
    current_user=Depends(get_current_user),
):
    wallet = wallet_service.get_or_create_wallet(db, current_user)
    tx = wallet_service.mock_topup(db, wallet, amount)
    return tx

