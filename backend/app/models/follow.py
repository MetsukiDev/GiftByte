from datetime import datetime
from uuid import uuid4

from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class WishlistFollow(Base):
    __tablename__ = "wishlist_follows"
    __table_args__ = (
        UniqueConstraint("user_id", "wishlist_id", name="uq_wishlist_follow"),
    )

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("users.id"), nullable=False, index=True
    )
    wishlist_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("wishlists.id"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
    wishlist = relationship("Wishlist")
