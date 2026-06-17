from sqlalchemy.orm import Session

from src.shared.repositories.testimonial_repository import (
    create_testimonial,
    get_published_testimonials,
)
from src.shared.schemas.testimonial import TestimonialCreate, TestimonialResponse


def submit_testimonial(db: Session, *, user_id: str, payload: TestimonialCreate) -> TestimonialResponse:
    testimonial = create_testimonial(db, user_id=user_id, payload=payload)
    return TestimonialResponse.model_validate(testimonial)


def fetch_published_testimonials(db: Session, limit: int = 10) -> list[TestimonialResponse]:
    testimonials = get_published_testimonials(db, limit=limit)
    return [TestimonialResponse.model_validate(t) for t in testimonials]
