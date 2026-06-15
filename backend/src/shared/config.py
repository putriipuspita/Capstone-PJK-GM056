from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Sentix API"
    app_env: str = "development"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+psycopg://postgres:password@localhost:5432/sentix"
    auth_provider: str = "supabase"
    storage_provider: str = "supabase"
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 20
    max_upload_reviews: int = 100000
    sentiment_predictor_provider: str = "dummy"
    sentiment_batch_size: int = 256
    indobert_model_path: str | None = None
    indobert_max_length: int = 128
    indobert_id2label: str = "negative,neutral,positive"
    recommendation_provider: str = "rule_based"
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    gemini_timeout_seconds: int = 30
    jwt_secret_key: str = "change-this-secret"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440
    jwt_refresh_token_expire_minutes: int = 10080
    auth_token_expire_minutes: int = 60
    require_email_verification: bool = False
    allow_dev_auth_fallback: bool = True
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_from_name: str = "SENTIX"
    smtp_use_tls: bool = True
    smtp_timeout_seconds: int = 15
    dev_user_id: str = "00000000-0000-0000-0000-000000000001"
    dev_store_name: str = "Sentix Demo Store"
    dev_user_email: str = "demo@sentix.local"
    supabase_url: str = "https://your-project.supabase.co"
    supabase_anon_key: str = "your-anon-key"
    supabase_service_role_key: str = "your-service-role-key"
    supabase_storage_bucket: str = "uploads"
    backend_public_url: str = "http://127.0.0.1:8000"
    frontend_public_url: str = "http://localhost:3000"

    @property
    def auth_callback_url(self) -> str:
        return f"{self.backend_public_url.rstrip('/')}{self.api_prefix}/auth/callback"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
