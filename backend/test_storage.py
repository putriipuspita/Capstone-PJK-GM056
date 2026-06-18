import sys
import os

# Set working directory to backend
sys.path.insert(0, os.path.abspath("."))

from src.shared.storage import upload_avatar_file

try:
    url = upload_avatar_file(content=b"test image content", file_name="test.jpg", user_id="test-user")
    print("SUCCESS. URL:", url)
except Exception as e:
    print("FAILED:", str(e))
    import traceback
    traceback.print_exc()
