from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Sentix API"
    app_env: str = "development"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+psycopg://postgres:password@localhost:5432/sentix"
    sentiment_predictor_provider: str = "dummy"
    sentiment_batch_size: int = 32
    huggingface_api_token: str | None = None
    huggingface_model_id: str | None = None
    huggingface_timeout_seconds: int = 60
    huggingface_batch_size: int = 32
    huggingface_id2label: str = "negatif,netral,positif"
    gemini_api_key: str | None = None
    dev_user_id: str = "00000000-0000-0000-0000-000000000001"
    dev_store_name: str = "Sentix Demo Store"
    dev_user_email: str = "demo@sentix.local"
    supabase_url: str = "https://your-project.supabase.co"
    supabase_anon_key: str = "your-anon-key"
    supabase_service_role_key: str = "your-service-role-key"
    supabase_storage_bucket: str = "uploads"
    backend_public_url: str = "https://hara25-analisis-sentimen.hf.space"
    frontend_public_url: str = "http://localhost:3000"

    @property
    def auth_callback_url(self) -> str:
        return f"{self.backend_public_url.rstrip('/')}{self.api_prefix}/auth/callback"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
