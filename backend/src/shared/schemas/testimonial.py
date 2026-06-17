from datetime import datetime

from pydantic import BaseModel, Field


class TestimonialCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    role: str | None = Field(default=None, max_length=255)
    message: str = Field(min_length=5)
    rating: int = Field(ge=1, le=5)


class TestimonialResponse(BaseModel):
    id: str
    user_id: str
    name: str
    role: str | None
    message: str
    rating: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True
