from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    store_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token_hash: str = Field(min_length=1)
    password: str = Field(min_length=6, max_length=72)


class AuthUserResponse(BaseModel):
    id: str
    email: str
    store_name: str | None = None


class AuthSessionResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: AuthUserResponse


class MessageResponse(BaseModel):
    message: str
