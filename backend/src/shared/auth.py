from dataclasses import dataclass

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.shared.config import settings
from src.shared.storage import get_supabase_client


security = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    user_id: str
    email: str
    store_name: str


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> CurrentUser:
    if not isinstance(credentials, HTTPAuthorizationCredentials):
        credentials = None

    if credentials:
        user = get_supabase_client().auth.get_user(credentials.credentials).user
        email = user.email or settings.dev_user_email
        store_name = user.user_metadata.get("store_name") or user.user_metadata.get("namaToko") or email
        return CurrentUser(user_id=user.id, email=email, store_name=store_name)

    return CurrentUser(
        user_id=settings.dev_user_id,
        email=settings.dev_user_email,
        store_name=settings.dev_store_name,
    )
