from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.shared.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.user_id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user_profile = relationship("UserProfile", back_populates="products")
    datasets = relationship("Dataset", back_populates="product")
    analysis_runs = relationship("AnalysisRun", back_populates="product")
