from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.api_app.services.user_service import (
    change_password,
    clear_user_data,
    delete_user_account,
    get_profile,
    update_profile,
    upload_avatar,
)
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db

router = APIRouter(prefix="/users", tags=["users"])


# Schemas
class UserProfileResponse(BaseModel):
    user_id: str
    store_name: str
    email: str
    profile_image_url: str | None


class UpdateProfileRequest(BaseModel):
    store_name: str
    email: str | None = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class MessageResponse(BaseModel):
    message: str


@router.get("/me", response_model=UserProfileResponse)
def get_me(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> UserProfileResponse:
    profile = get_profile(db, current_user.user_id)
    return UserProfileResponse(
        user_id=profile.user_id,
        store_name=profile.store_name,
        email=profile.email,
        profile_image_url=profile.profile_image_url,
    )


@router.put("/profile", response_model=UserProfileResponse)
def update_me(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> UserProfileResponse:
    profile = update_profile(db, current_user.user_id, payload.store_name, payload.email)
    return UserProfileResponse(
        user_id=profile.user_id,
        store_name=profile.store_name,
        email=profile.email,
        profile_image_url=profile.profile_image_url,
    )


@router.post("/profile-picture", response_model=MessageResponse)
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    valid_extensions = (".jpg", ".jpeg", ".png", ".webp")
    if not file.filename or not file.filename.lower().endswith(valid_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File harus berformat gambar (.jpg, .png, .webp).",
        )

    content = await file.read()
    public_url = upload_avatar(db, current_user.user_id, file.filename, content)
    return MessageResponse(message=public_url)


@router.put("/password", response_model=MessageResponse)
def update_password(
    payload: ChangePasswordRequest,
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    change_password(
        user_id=current_user.user_id,
        email=current_user.email,
        old_password=payload.old_password,
        new_password=payload.new_password,
    )
    return MessageResponse(message="Password berhasil diubah.")


@router.delete("/data", response_model=MessageResponse)
def clear_data(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    clear_user_data(db, current_user.user_id)
    return MessageResponse(message="Seluruh data analisis berhasil dibersihkan.")


@router.delete("/account", response_model=MessageResponse)
def delete_account(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> MessageResponse:
    delete_user_account(db, current_user.user_id)
    return MessageResponse(message="Akun berhasil dihapus secara permanen.")
