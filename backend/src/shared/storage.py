from datetime import datetime
from uuid import uuid4

from supabase import Client, create_client

from src.shared.config import settings


_client: Client | None = None


def get_supabase_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client


def upload_csv_file(*, content: bytes, file_name: str, user_id: str, product_id: str) -> str:
    storage_path = _build_storage_path(file_name=file_name, user_id=user_id, product_id=product_id)
    client = get_supabase_client()
    client.storage.from_(settings.supabase_storage_bucket).upload(
        path=storage_path,
        file=content,
        file_options={
            "content-type": "text/csv",
            "upsert": "false",
        },
    )
    return storage_path


def _build_storage_path(*, file_name: str, user_id: str, product_id: str) -> str:
    safe_file_name = file_name.replace("\\", "_").replace("/", "_")
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = str(uuid4())
    return f"{user_id}/{product_id}/{timestamp}-{unique_id}-{safe_file_name}"
