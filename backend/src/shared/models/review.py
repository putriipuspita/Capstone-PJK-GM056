from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.shared.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    dataset_id: Mapped[str] = mapped_column(ForeignKey("datasets.id"), nullable=False)
    review_date: Mapped[str | None] = mapped_column(String(50), nullable=True)
    review_text: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sentiment: Mapped[str | None] = mapped_column(String(20), nullable=True)
    confidence: Mapped[float | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    dataset = relationship("Dataset", back_populates="reviews")
