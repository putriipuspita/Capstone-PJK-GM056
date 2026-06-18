from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.shared.models import AnalysisRun, Product, UserProfile


def get_or_create_user_profile(
    db: Session,
    *,
    user_id: str,
    store_name: str,
    email: str,
) -> UserProfile:
    user_profile = db.get(UserProfile, user_id)
    if user_profile:
        return user_profile

    user_profile = UserProfile(
        user_id=user_id,
        store_name=store_name,
        email=email,
    )
    db.add(user_profile)
    db.flush()
    return user_profile


def get_or_create_product(db: Session, *, user_id: str, product_name: str) -> Product:
    statement = select(Product).where(Product.user_id == user_id, Product.name == product_name)
    product = db.execute(statement).scalar_one_or_none()
    if product:
        return product

    product = Product(user_id=user_id, name=product_name)
    db.add(product)
    db.flush()
    return product


def list_products_with_analysis_stats(db: Session, *, user_id: str) -> list[dict]:
    statement = (
        select(
            Product.id,
            Product.name,
            func.count(AnalysisRun.id).label("total_analyses"),
            func.max(AnalysisRun.created_at).label("latest_analysis_at"),
        )
        .outerjoin(AnalysisRun, AnalysisRun.product_id == Product.id)
        .where(Product.user_id == user_id)
        .group_by(Product.id, Product.name)
        .order_by(func.max(AnalysisRun.created_at).desc().nullslast(), Product.name.asc())
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "total_analyses": row.total_analyses,
            "latest_analysis_at": row.latest_analysis_at,
        }
        for row in db.execute(statement).all()
    ]
