import os
import jwt
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("SUPABASE_KEY")
if not key:
    print("No Key Found")
    exit()

try:
    # Decode without verifying signature just to read payload
    payload = jwt.decode(key, options={"verify_signature": False})
    print(f"Key Role: {payload.get('role')}")
    print(f"Key Iss: {payload.get('iss')}")
except Exception as e:
    print(f"Error decoding: {e}")
