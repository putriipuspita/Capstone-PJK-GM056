from email.message import EmailMessage
from smtplib import SMTP, SMTPException
from socket import timeout as SocketTimeout

from src.shared.config import settings


class EmailSendError(RuntimeError):
    pass


def is_email_enabled() -> bool:
    return bool(settings.smtp_host and settings.smtp_from_email)


def send_email(*, to_email: str, subject: str, html_body: str, text_body: str) -> None:
    if not is_email_enabled():
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = to_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        with SMTP(settings.smtp_host, settings.smtp_port, timeout=settings.smtp_timeout_seconds) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_username and settings.smtp_password:
                smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)
    except (OSError, SMTPException, SocketTimeout) as exc:
        raise EmailSendError(f"Gagal mengirim email lewat SMTP: {exc}") from exc


def send_verification_email(*, to_email: str, verification_url: str) -> None:
    send_email(
        to_email=to_email,
        subject="Verifikasi Email SENTIX",
        text_body=f"Klik link berikut untuk verifikasi email SENTIX: {verification_url}",
        html_body=f"""
        <h2>Verifikasi Email SENTIX</h2>
        <p>Klik tombol berikut untuk mengaktifkan akun Anda:</p>
        <p><a href="{verification_url}">Verifikasi Email</a></p>
        <p>Jika Anda tidak membuat akun SENTIX, abaikan email ini.</p>
        """,
    )


def send_password_reset_email(*, to_email: str, reset_url: str) -> None:
    send_email(
        to_email=to_email,
        subject="Reset Password SENTIX",
        text_body=f"Klik link berikut untuk mengganti password SENTIX: {reset_url}",
        html_body=f"""
        <h2>Reset Password SENTIX</h2>
        <p>Klik tombol berikut untuk mengganti password:</p>
        <p><a href="{reset_url}">Reset Password</a></p>
        <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
        """,
    )
