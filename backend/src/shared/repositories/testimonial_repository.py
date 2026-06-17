from sqlalchemy import select
from sqlalchemy.orm import Session

from src.shared.models.testimonial import Testimonial
from src.shared.schemas.testimonial import TestimonialCreate


def create_testimonial(db: Session, *, user_id: str, payload: TestimonialCreate) -> Testimonial:
    testimonial = Testimonial(
        user_id=user_id,
        name=payload.name,
        role=payload.role,
        message=payload.message,
        rating=payload.rating,
        is_published=False,  # Needs manual approval
    )
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


def get_published_testimonials(db: Session, limit: int = 10) -> list[Testimonial]:
    query = (
        select(Testimonial)
        .where(Testimonial.is_published == True)
        .order_by(Testimonial.created_at.desc())
        .limit(limit)
    )
    return list(db.execute(query).scalars().all())
