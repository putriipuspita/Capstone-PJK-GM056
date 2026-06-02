from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api_app.services.auth_service import login_user, register_user, request_password_reset
from src.shared.database import get_db
from src.shared.schemas.auth import (
    AuthSessionResponse,
    AuthUserResponse,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
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
def login(payload: LoginRequest) -> AuthSessionResponse:
    return login_user(email=payload.email, password=payload.password)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest) -> MessageResponse:
    request_password_reset(email=payload.email)
    return MessageResponse(message="Link reset password telah dikirim jika email terdaftar.")
