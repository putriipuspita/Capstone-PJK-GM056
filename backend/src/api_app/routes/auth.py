from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from src.api_app.services.auth_service import (
    handle_auth_callback,
    login_user,
    register_user,
    request_password_reset,
    reset_password,
)
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.schemas.auth import (
    AuthSessionResponse,
    AuthUserResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
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


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    response = request_password_reset(email=payload.email, db=db)
    if response:
        return response
    return MessageResponse(message="Link reset password telah dikirim jika email terdaftar.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_user_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    reset_password(token_hash=payload.token_hash, password=payload.password, db=db)
    return MessageResponse(message="Password berhasil diubah.")


@router.get("/callback")
def auth_callback(token_hash: str, type: str = "email") -> RedirectResponse:
    redirect_url = handle_auth_callback(token_hash=token_hash, verify_type=type)
    return RedirectResponse(url=redirect_url)
