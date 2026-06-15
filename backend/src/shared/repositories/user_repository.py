from sqlalchemy import select
from sqlalchemy.orm import Session

from src.shared.models import UserProfile


def get_user_profile_by_email(db: Session, *, email: str) -> UserProfile | None:
    statement = select(UserProfile).where(UserProfile.email == email)
    return db.execute(statement).scalar_one_or_none()


def create_local_user_profile(
    db: Session,
    *,
    user_id: str,
    store_name: str,
    email: str,
    password_hash: str,
    is_email_verified: bool,
) -> UserProfile:
    user_profile = UserProfile(
        user_id=user_id,
        store_name=store_name,
        email=email,
        password_hash=password_hash,
        is_email_verified=is_email_verified,
    )
    db.add(user_profile)
    db.flush()
    return user_profile


def update_user_profile(
    db: Session,
    *,
    user_profile: UserProfile,
    store_name: str,
) -> UserProfile:
    user_profile.store_name = store_name
    db.flush()
    return user_profile
