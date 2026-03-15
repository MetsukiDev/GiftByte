from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Wallet, Transaction, User


def get_or_create_wallet(db: Session, user: User) -> Wallet:
    if user.wallet:
        return user.wallet
    wallet = Wallet(user_id=user.id)
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return wallet


def mock_topup(db: Session, wallet: Wallet, amount: float, currency: str) -> Transaction:
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be positive")
    if currency != wallet.currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Currency mismatch with wallet",
        )
    wallet.balance += amount
    tx = Transaction(
        wallet_id=wallet.id,
        type="topup",
        amount=amount,
        status="completed",
        metadata_json=None,
    )
    db.add(wallet)
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

