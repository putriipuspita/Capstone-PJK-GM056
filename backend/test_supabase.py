import os
from supabase import create_client

def load_env():
    env_vars = {}
    with open(".env", "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env_vars[k.strip()] = v.strip().strip("'").strip('"')
    return env_vars

env = load_env()
url = env.get("SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_ROLE_KEY")

client = create_client(url, key)

try:
    res = client.storage.from_("uploads").upload(
        path="test_avatar.jpg",
        file=b"test data",
        file_options={"content-type": "image/jpeg"}
    )
    print("SUCCESS", res)
except Exception as e:
    print("FAILED", type(e).__name__, str(e))

