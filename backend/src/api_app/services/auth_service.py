from uuid import uuid4

from fastapi import HTTPException, status
from gotrue.errors import AuthApiError
from sqlalchemy.orm import Session

from src.shared.config import settings
from src.shared.email import EmailSendError, is_email_enabled, send_password_reset_email, send_verification_email
from src.shared.models import UserProfile
from src.shared.repositories.auth_token_repository import (
    create_email_verification_token,
    create_password_reset_token,
    get_valid_email_verification_token,
    get_valid_password_reset_token,
    mark_email_verification_token_used,
    mark_password_reset_token_used,
)
from src.shared.repositories.product_repository import get_or_create_user_profile
from src.shared.repositories.user_repository import create_local_user_profile, get_user_profile_by_email
from src.shared.schemas.auth import AuthSessionResponse, AuthUserResponse, MessageResponse
from src.shared.security import create_access_token, create_plain_token, hash_password, hash_token, token_expires_at, verify_password
from src.shared.storage import get_supabase_auth_client


def register_user(db: Session, *, store_name: str, email: str, password: str) -> AuthUserResponse:
    if settings.auth_provider == "local":
        return register_local_user(db, store_name=store_name, email=email, password=password)

    return register_supabase_user(db, store_name=store_name, email=email, password=password)


def register_supabase_user(db: Session, *, store_name: str, email: str, password: str) -> AuthUserResponse:
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


def register_local_user(db: Session, *, store_name: str, email: str, password: str) -> AuthUserResponse:
    normalized_email = email.lower()
    existing_user = get_user_profile_by_email(db, email=normalized_email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email sudah terdaftar.",
        )

    user_profile = create_local_user_profile(
        db,
        user_id=str(uuid4()),
        store_name=store_name,
        email=normalized_email,
        password_hash=hash_password(password),
        is_email_verified=not settings.require_email_verification,
    )
    verification_token = None
    verification_url = None

    if settings.require_email_verification:
        verification_token = create_plain_token()
        create_email_verification_token(
            db,
            user_id=user_profile.user_id,
            token_hash=hash_token(verification_token),
            expires_at=token_expires_at(),
        )
        verification_url = f"{settings.auth_callback_url}?token_hash={verification_token}&type=email"
        try:
            send_verification_email(to_email=user_profile.email, verification_url=verification_url)
        except EmailSendError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(exc),
            ) from exc

    db.commit()

    return AuthUserResponse(
        id=user_profile.user_id,
        email=user_profile.email,
        store_name=user_profile.store_name,
        verification_token=None if is_email_enabled() else verification_token,
        verification_url=None if is_email_enabled() else verification_url,
    )


def login_user(*, email: str, password: str, db: Session | None = None) -> AuthSessionResponse:
    if settings.auth_provider == "local":
        if db is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database session diperlukan untuk login local.",
            )
        return login_local_user(db, email=email, password=password)

    return login_supabase_user(email=email, password=password)


def login_supabase_user(*, email: str, password: str) -> AuthSessionResponse:
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


def login_local_user(db: Session, *, email: str, password: str) -> AuthSessionResponse:
    normalized_email = email.lower()
    user_profile = get_user_profile_by_email(db, email=normalized_email)
    if not user_profile or not user_profile.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )

    if not verify_password(password, user_profile.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )

    if settings.require_email_verification and not user_profile.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email belum diverifikasi.",
        )

    access_token = create_access_token(user_id=user_profile.user_id, email=user_profile.email)

    return AuthSessionResponse(
        access_token=access_token,
        refresh_token="",
        user=AuthUserResponse(
            id=user_profile.user_id,
            email=user_profile.email,
            store_name=user_profile.store_name,
        ),
    )


def request_password_reset(*, email: str, db: Session | None = None) -> MessageResponse | None:
    if settings.auth_provider == "local":
        if db is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database session diperlukan untuk reset password local.",
            )
        return request_local_password_reset(db, email=email)

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

    return None


def request_local_password_reset(db: Session, *, email: str) -> MessageResponse:
    normalized_email = email.lower()
    user_profile = get_user_profile_by_email(db, email=normalized_email)
    if not user_profile:
        return MessageResponse(message="Link reset password telah dikirim jika email terdaftar.")

    plain_token = create_plain_token()
    create_password_reset_token(
        db,
        user_id=user_profile.user_id,
        token_hash=hash_token(plain_token),
        expires_at=token_expires_at(),
    )
    db.commit()

    reset_url = f"{settings.frontend_public_url.rstrip('/')}/auth/reset-password?token_hash={plain_token}"
    try:
        send_password_reset_email(to_email=user_profile.email, reset_url=reset_url)
    except EmailSendError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    if is_email_enabled():
        return MessageResponse(message="Link reset password telah dikirim jika email terdaftar.")

    return MessageResponse(
        message="Token reset password dibuat.",
        reset_token=plain_token,
        reset_url=reset_url,
    )


def reset_password(*, token_hash: str, password: str, db: Session | None = None) -> None:
    if settings.auth_provider == "local":
        if db is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database session diperlukan untuk reset password local.",
            )
        reset_local_password(db, token=token_hash, password=password)
        return

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


def reset_local_password(db: Session, *, token: str, password: str) -> None:
    password_reset_token = get_valid_password_reset_token(db, token_hash=hash_token(token))
    if not password_reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token reset password tidak valid atau sudah kedaluwarsa.",
        )

    user_profile = db.get(UserProfile, password_reset_token.user_id)
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User tidak ditemukan.",
        )

    user_profile.password_hash = hash_password(password)
    mark_password_reset_token_used(db, password_reset_token=password_reset_token)
    db.commit()


def handle_auth_callback(*, token_hash: str, verify_type: str = "email") -> str:
    if settings.auth_provider == "local":
        return handle_local_auth_callback(token=token_hash, verify_type=verify_type)

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


def handle_local_auth_callback(*, token: str, verify_type: str = "email") -> str:
    if verify_type != "email":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipe verifikasi auth tidak didukung.",
        )

    from src.shared.database import SessionLocal

    db = SessionLocal()
    try:
        email_verification_token = get_valid_email_verification_token(db, token_hash=hash_token(token))
        if not email_verification_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token verifikasi email tidak valid atau sudah kedaluwarsa.",
            )

        user_profile = db.get(UserProfile, email_verification_token.user_id)
        if not user_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User tidak ditemukan.",
            )

        user_profile.is_email_verified = True
        mark_email_verification_token_used(db, email_verification_token=email_verification_token)
        db.commit()
    finally:
        db.close()

    return f"{settings.frontend_public_url.rstrip()}/auth/login?verified=1"
