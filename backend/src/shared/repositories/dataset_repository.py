from sqlalchemy.orm import Session

from src.shared.models import Dataset, Review
from src.utils.csv_reader import ReviewRow


def create_dataset(
    db: Session,
    *,
    product_id: str,
    file_name: str,
    total_reviews: int,
    storage_path: str | None = None,
) -> Dataset:
    dataset = Dataset(
        product_id=product_id,
        file_name=file_name,
        storage_path=storage_path,
        total_reviews=total_reviews,
    )
    db.add(dataset)
    db.flush()
    return dataset


def create_reviews(db: Session, *, dataset_id: str, rows: list[ReviewRow]) -> list[Review]:
    reviews = [
        Review(
            dataset_id=dataset_id,
            review_date=row.review_date,
            review_text=row.review_text,
            rating=_parse_rating(row.rating),
        )
        for row in rows
    ]
    db.add_all(reviews)
    db.flush()
    return reviews


def get_reviews_by_dataset(db: Session, *, dataset_id: str) -> list[Review]:
    return db.query(Review).filter(Review.dataset_id == dataset_id).order_by(Review.created_at.asc()).all()


def _parse_rating(value: str) -> int | None:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None
