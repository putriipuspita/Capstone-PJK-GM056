from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.shared.models import EmailVerificationToken, PasswordResetToken


def create_email_verification_token(
    db: Session,
    *,
    user_id: str,
    token_hash: str,
    expires_at: datetime,
) -> EmailVerificationToken:
    email_verification_token = EmailVerificationToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(email_verification_token)
    db.flush()
    return email_verification_token


def get_valid_email_verification_token(db: Session, *, token_hash: str) -> EmailVerificationToken | None:
    statement = select(EmailVerificationToken).where(
        EmailVerificationToken.token_hash == token_hash,
        EmailVerificationToken.used_at.is_(None),
        EmailVerificationToken.expires_at > datetime.utcnow(),
    )
    return db.execute(statement).scalar_one_or_none()


def mark_email_verification_token_used(
    db: Session,
    *,
    email_verification_token: EmailVerificationToken,
) -> None:
    email_verification_token.used_at = datetime.utcnow()
    db.flush()


def create_password_reset_token(
    db: Session,
    *,
    user_id: str,
    token_hash: str,
    expires_at: datetime,
) -> PasswordResetToken:
    password_reset_token = PasswordResetToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(password_reset_token)
    db.flush()
    return password_reset_token


def get_valid_password_reset_token(db: Session, *, token_hash: str) -> PasswordResetToken | None:
    statement = select(PasswordResetToken).where(
        PasswordResetToken.token_hash == token_hash,
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.utcnow(),
    )
    return db.execute(statement).scalar_one_or_none()


def mark_password_reset_token_used(db: Session, *, password_reset_token: PasswordResetToken) -> None:
    password_reset_token.used_at = datetime.utcnow()
    db.flush()
