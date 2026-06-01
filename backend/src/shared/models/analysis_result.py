from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.shared.database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    analysis_run_id: Mapped[str] = mapped_column(ForeignKey("analysis_runs.id"), unique=True, nullable=False)
    summary: Mapped[dict] = mapped_column(JSON, nullable=False)
    trends: Mapped[list] = mapped_column(JSON, nullable=False)
    aspect_insights: Mapped[list] = mapped_column(JSON, nullable=False)
    complaints: Mapped[list] = mapped_column(JSON, nullable=False)
    strengths: Mapped[list] = mapped_column(JSON, nullable=False)
    recommendations: Mapped[list] = mapped_column(JSON, nullable=False)
    sample_predictions: Mapped[list] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    analysis_run = relationship("AnalysisRun", back_populates="result")
