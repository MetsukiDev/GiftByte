from datetime import datetime
from uuid import uuid4

from sqlalchemy import String, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Gift(Base):
    __tablename__ = "gifts"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    wishlist_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("wishlists.id"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    product_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    currency: Mapped[str | None] = mapped_column(String(8), nullable=True)
    gift_type: Mapped[str] = mapped_column(String(16), default="single", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="available", nullable=False)
    external_product_status: Mapped[str] = mapped_column(
        String(32), default="active", nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    wishlist = relationship("Wishlist", back_populates="gifts")
    reservations = relationship(
        "GiftReservation", back_populates="gift", cascade="all, delete-orphan"
    )
    contributions = relationship(
        "GiftContribution", back_populates="gift", cascade="all, delete-orphan"
    )


class GiftReservation(Base):
    __tablename__ = "gift_reservations"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    gift_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("gifts.id"), nullable=False, index=True
    )
    reserved_by_user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id"), nullable=True
    )
    reserved_by_guest_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    gift = relationship("Gift", back_populates="reservations")


class GiftContribution(Base):
    __tablename__ = "gift_contributions"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    gift_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("gifts.id"), nullable=False, index=True
    )
    contributor_user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id"), nullable=True
    )
    contributor_guest_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    gift = relationship("Gift", back_populates="contributions")

