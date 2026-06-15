from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.shared.config import settings
from src.shared.database import get_db
from src.shared.models import UserProfile
from src.shared.storage import get_supabase_auth_client


security = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    user_id: str
    email: str
    store_name: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> CurrentUser:
    if not isinstance(credentials, HTTPAuthorizationCredentials):
        credentials = None

    if credentials:
        if settings.auth_provider == "local":
            return get_current_local_user(credentials.credentials, db)

        user = get_supabase_auth_client().auth.get_user(credentials.credentials).user
        email = user.email or settings.dev_user_email
        store_name = user.user_metadata.get("store_name") or user.user_metadata.get("namaToko") or email
        return CurrentUser(user_id=user.id, email=email, store_name=store_name)

    if not settings.allow_dev_auth_fallback:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token autentikasi diperlukan.",
        )

    return CurrentUser(
        user_id=settings.dev_user_id,
        email=settings.dev_user_email,
        store_name=settings.dev_store_name,
    )


def get_current_local_user(token: str, db: Session) -> CurrentUser:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid.",
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid.",
        )

    user_profile = db.get(UserProfile, user_id)
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan.",
        )

    return CurrentUser(
        user_id=user_profile.user_id,
        email=user_profile.email,
        store_name=user_profile.store_name,
    )
