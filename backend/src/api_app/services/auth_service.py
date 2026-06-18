from fastapi import HTTPException, status
from gotrue.errors import AuthApiError
from sqlalchemy.orm import Session

from src.shared.config import settings
from src.shared.repositories.product_repository import get_or_create_user_profile
from src.shared.schemas.auth import AuthSessionResponse, AuthUserResponse
from src.shared.storage import get_supabase_auth_client


def register_user(db: Session, *, store_name: str, email: str, password: str) -> AuthUserResponse:
    try:
        response = get_supabase_auth_client().auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {
                    "data": {"store_name": store_name},
                    "email_redirect_to": settings.auth_callback_url,
                },
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
        response = get_supabase_auth_client().auth.sign_in_with_password(
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
        get_supabase_auth_client().auth.reset_password_for_email(
            email,
            {
                "redirect_to": settings.auth_callback_url,
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Permintaan reset password gagal: {exc}",
        ) from exc


def reset_password(*, token_hash: str, password: str) -> None:
    client = get_supabase_auth_client()
    try:
        response = client.auth.verify_otp(
            {
                "token_hash": token_hash,
                "type": "recovery",
            }
        )
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token reset password tidak valid.",
            )

        client.auth.set_session(response.session.access_token, response.session.refresh_token)
        client.auth.update_user({"password": password})
        client.auth.sign_out()
    except AuthApiError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Reset password gagal: {exc}",
        ) from exc


def handle_auth_callback(*, token_hash: str, verify_type: str = "email") -> str:
    try:
        get_supabase_auth_client().auth.verify_otp(
            {
                "token_hash": token_hash,
                "type": verify_type,
            }
        )
    except AuthApiError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Verifikasi auth gagal: {exc}",
        ) from exc

    return f"{settings.frontend_public_url.rstrip()}/auth/login?verified=1"


def verify_signup_otp(*, email: str, otp: str) -> AuthSessionResponse:
    try:
        response = get_supabase_auth_client().auth.verify_otp(
            {
                "email": email,
                "token": otp,
                "type": "signup",
            }
        )
    except AuthApiError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Verifikasi OTP gagal: Kode salah atau kadaluarsa. ({exc})",
        ) from exc

    if not response.session or not response.user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verifikasi OTP gagal: Session tidak ditemukan.",
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


def resend_signup_otp(*, email: str) -> None:
    try:
        get_supabase_auth_client().auth.resend(
            {
                "email": email,
                "type": "signup",
            }
        )
    except AuthApiError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Gagal mengirim ulang OTP: {exc}",
        ) from exc
