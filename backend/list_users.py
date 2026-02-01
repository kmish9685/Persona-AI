import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Service Role Key

def list_all_users():
    # 1. Fetch from public.users (Our Metadata Table)
    url = f"{SUPABASE_URL}/rest/v1/users?select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    
    print(f"Checking Database Table: {url}")
    try:
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            users = resp.json()
            print(f"\n✅ DATABASE IS HEALTHY! Found {len(users)} users in your table:")
            print("-" * 50)
            for u in users:
                print(f"• Email: {u.get('email')} | Plan: {u.get('plan')} | ID: {u.get('id')}")
            print("-" * 50)
        else:
            print(f"❌ Error fetching users: {resp.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_all_users()
