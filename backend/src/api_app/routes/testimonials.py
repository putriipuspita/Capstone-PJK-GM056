from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api_app.services.testimonial_service import (
    fetch_published_testimonials,
    submit_testimonial,
)
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.schemas.testimonial import TestimonialCreate, TestimonialResponse


router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.post("", response_model=TestimonialResponse)
def create_testimonial(
    payload: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> TestimonialResponse:
    return submit_testimonial(db, user_id=current_user.user_id, payload=payload)


@router.get("", response_model=list[TestimonialResponse])
def get_public_testimonials(
    limit: int = 10,
    db: Session = Depends(get_db),
) -> list[TestimonialResponse]:
    # Endpoint ini bersifat publik (tidak memerlukan get_current_user)
    return fetch_published_testimonials(db, limit=limit)
