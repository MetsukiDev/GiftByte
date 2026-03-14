"""Contribution routes."""

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contribution as ContributionModel, Wallet, Transaction, Gift
from app.schemas import ContributionCreate, ContributionResponse

router = APIRouter(prefix="/contributions", tags=["contributions"])


@router.post("", response_model=ContributionResponse)
def create_contribution(data: ContributionCreate, db: Session = Depends(get_db)):
    """
    Add a money contribution to a gift. Debits the user's wallet and records
    the contribution (owner cannot see who contributed).
    """
    gift = db.query(Gift).filter(Gift.id == data.gift_id).first()
    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    wallet = db.query(Wallet).filter(Wallet.user_id == data.user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="User wallet not found")
    if wallet.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    contribution = ContributionModel(
        gift_id=data.gift_id,
        user_id=data.user_id,
        amount=data.amount,
    )
    db.add(contribution)
    db.flush()

    wallet.balance -= data.amount
    tx = Transaction(
        wallet_id=wallet.id,
        amount=-data.amount,
        kind="contribution",
        reference_id=contribution.id,
    )
    db.add(tx)

    # Credit the event owner's wallet (simplified: we don't have gift->event->owner here in one go)
    event_owner_id = gift.event.owner_id
    owner_wallet = db.query(Wallet).filter(Wallet.user_id == event_owner_id).first()
    if owner_wallet:
        owner_wallet.balance += data.amount
        db.add(
            Transaction(
                wallet_id=owner_wallet.id,
                amount=data.amount,
                kind="contribution_in",
                reference_id=contribution.id,
            )
        )

    db.commit()
    db.refresh(contribution)
    return contribution
