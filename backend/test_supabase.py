import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def test_connection():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Credentials")
        return

    print(f"Connecting to {SUPABASE_URL}...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    
    try:
        # Try a simple SELECT
        resp = requests.get(f"{SUPABASE_URL}/rest/v1/users", headers=headers, params={"select": "count", "limit": "1"})
        
        print(f"Status: {resp.status_code}")
        if resp.status_code < 300:
            print("✅ Connection Successful!")
            print(resp.text)
        else:
            print(f"❌ Connection Failed: {resp.text}")
            
    except Exception as e:
        print(f"❌ Network Error: {e}")

if __name__ == "__main__":
    test_connection()
