from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from src.api_app.services.auth_service import (
    change_local_password,
    handle_auth_callback,
    login_user,
    logout_all_local_sessions,
    logout_local_session,
    register_user,
    request_email_verification,
    request_password_reset,
    refresh_local_session,
    reset_password,
    update_profile,
)
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.schemas.auth import (
    AuthSessionResponse,
    AuthUserResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthUserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthUserResponse:
    return register_user(
        db,
        store_name=payload.store_name,
        email=payload.email,
        password=payload.password,
    )


@router.post("/login", response_model=AuthSessionResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthSessionResponse:
    return login_user(email=payload.email, password=payload.password, db=db)


@router.get("/me", response_model=AuthUserResponse)
def get_me(current_user: CurrentUser = Depends(get_current_user)) -> AuthUserResponse:
    return AuthUserResponse(
        id=current_user.user_id,
        email=current_user.email,
        store_name=current_user.store_name,
    )


@router.patch("/me", response_model=AuthUserResponse)
def update_me(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> AuthUserResponse:
    return update_profile(
        db,
        user_id=current_user.user_id,
        store_name=payload.store_name,
    )


@router.post("/refresh", response_model=AuthSessionResponse)
def refresh_session(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> AuthSessionResponse:
    return refresh_local_session(db, refresh_token=payload.refresh_token)


@router.post("/logout", response_model=MessageResponse)
def logout(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> MessageResponse:
    logout_local_session(db, refresh_token=payload.refresh_token)
    return MessageResponse(message="Logout berhasil.")


@router.post("/logout-all", response_model=MessageResponse)
def logout_all(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    logout_all_local_sessions(db, user_id=current_user.user_id)
    return MessageResponse(message="Semua sesi berhasil logout.")


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    change_local_password(
        db,
        user_id=current_user.user_id,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    return MessageResponse(message="Password berhasil diubah.")


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    response = request_password_reset(email=payload.email, db=db)
    if response:
        return response
    return MessageResponse(message="Link reset password telah dikirim jika email terdaftar.")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(payload: ResendVerificationRequest, db: Session = Depends(get_db)) -> MessageResponse:
    return request_email_verification(email=payload.email, db=db)


@router.post("/reset-password", response_model=MessageResponse)
def reset_user_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    reset_password(token_hash=payload.token_hash, password=payload.password, db=db)
    return MessageResponse(message="Password berhasil diubah.")


@router.get("/callback")
def auth_callback(token_hash: str, type: str = "email") -> RedirectResponse:
    redirect_url = handle_auth_callback(token_hash=token_hash, verify_type=type)
    return RedirectResponse(url=redirect_url)
