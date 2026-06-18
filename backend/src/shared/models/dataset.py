from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.shared.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    total_reviews: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    product = relationship("Product", back_populates="datasets")
    reviews = relationship("Review", back_populates="dataset")
    analysis_runs = relationship("AnalysisRun", back_populates="dataset")
