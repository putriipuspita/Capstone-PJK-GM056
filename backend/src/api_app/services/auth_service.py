from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.shared.repositories.product_repository import get_or_create_user_profile
from src.shared.schemas.auth import AuthSessionResponse, AuthUserResponse
from src.shared.storage import get_supabase_client


def register_user(db: Session, *, store_name: str, email: str, password: str) -> AuthUserResponse:
    try:
        response = get_supabase_client().auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {"data": {"store_name": store_name}},
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registrasi gagal: {exc}",
        ) from exc

    if not response.user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registrasi gagal.",
        )

    get_or_create_user_profile(
        db,
        user_id=response.user.id,
        store_name=store_name,
        email=response.user.email or email,
    )
    db.commit()

    return AuthUserResponse(
        id=response.user.id,
        email=response.user.email or email,
        store_name=store_name,
    )


def login_user(*, email: str, password: str) -> AuthSessionResponse:
    try:
        response = get_supabase_client().auth.sign_in_with_password(
            {
                "email": email,
                "password": password,
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login gagal: {exc}",
        ) from exc

    if not response.session or not response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )

    store_name = response.user.user_metadata.get("store_name") if response.user.user_metadata else None

    return AuthSessionResponse(
        access_token=response.session.access_token,
        refresh_token=response.session.refresh_token,
        user=AuthUserResponse(
            id=response.user.id,
            email=response.user.email or email,
            store_name=store_name,
        ),
    )


def request_password_reset(*, email: str) -> None:
    try:
        get_supabase_client().auth.reset_password_for_email(email)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Permintaan reset password gagal: {exc}",
        ) from exc
