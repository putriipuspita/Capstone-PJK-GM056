from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from src.shared.models import EmailVerificationToken, PasswordResetToken, RefreshTokenSession


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


def create_refresh_token_session(
    db: Session,
    *,
    user_id: str,
    token_hash: str,
    expires_at: datetime,
) -> RefreshTokenSession:
    refresh_token_session = RefreshTokenSession(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(refresh_token_session)
    db.flush()
    return refresh_token_session


def get_valid_refresh_token_session(db: Session, *, token_hash: str) -> RefreshTokenSession | None:
    statement = select(RefreshTokenSession).where(
        RefreshTokenSession.token_hash == token_hash,
        RefreshTokenSession.revoked_at.is_(None),
        RefreshTokenSession.expires_at > datetime.utcnow(),
    )
    return db.execute(statement).scalar_one_or_none()


def list_active_refresh_token_sessions(db: Session, *, user_id: str) -> list[RefreshTokenSession]:
    statement = (
        select(RefreshTokenSession)
        .where(
            RefreshTokenSession.user_id == user_id,
            RefreshTokenSession.revoked_at.is_(None),
            RefreshTokenSession.expires_at > datetime.utcnow(),
        )
        .order_by(RefreshTokenSession.created_at.desc())
    )
    return list(db.execute(statement).scalars().all())


def revoke_refresh_token_session(db: Session, *, refresh_token_session: RefreshTokenSession) -> None:
    refresh_token_session.revoked_at = datetime.utcnow()
    db.flush()


def revoke_user_refresh_token_sessions(db: Session, *, user_id: str) -> None:
    statement = select(RefreshTokenSession).where(
        RefreshTokenSession.user_id == user_id,
        RefreshTokenSession.revoked_at.is_(None),
    )
    revoked_at = datetime.utcnow()
    for refresh_token_session in db.execute(statement).scalars().all():
        refresh_token_session.revoked_at = revoked_at

    db.flush()


def delete_expired_auth_tokens(db: Session) -> dict[str, int]:
    now = datetime.utcnow()
    deleted_email_tokens = db.execute(
        delete(EmailVerificationToken).where(EmailVerificationToken.expires_at <= now)
    ).rowcount
    deleted_password_tokens = db.execute(
        delete(PasswordResetToken).where(PasswordResetToken.expires_at <= now)
    ).rowcount
    deleted_refresh_sessions = db.execute(
        delete(RefreshTokenSession).where(RefreshTokenSession.expires_at <= now)
    ).rowcount
    db.flush()

    return {
        "email_verification_tokens": deleted_email_tokens or 0,
        "password_reset_tokens": deleted_password_tokens or 0,
        "refresh_token_sessions": deleted_refresh_sessions or 0,
    }
