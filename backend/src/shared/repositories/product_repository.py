from sqlalchemy import select
from sqlalchemy.orm import Session

from src.shared.models import Product, UserProfile


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
