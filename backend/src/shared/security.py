from datetime import datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe

import jwt
from passlib.context import CryptContext

from src.shared.config import settings


password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


def create_access_token(*, user_id: str, email: str) -> str:
    expires_at = datetime.utcnow() + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expires_at,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_plain_token() -> str:
    return token_urlsafe(32)


def hash_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def token_expires_at() -> datetime:
    return datetime.utcnow() + timedelta(minutes=settings.auth_token_expire_minutes)
