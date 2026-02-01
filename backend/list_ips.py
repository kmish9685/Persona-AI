import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def list_all_ips():
    """List all IP addresses in the database"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/users?select=ip_address,msg_count,plan"
    
    try:
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            users = resp.json()
            print(f"\n📊 Found {len(users)} IP addresses:\n")
            for user in users:
                if user.get('ip_address'):
                    print(f"IP: {user['ip_address']} | Messages: {user.get('msg_count', 0)} | Plan: {user.get('plan', 'free')}")
        else:
            print(f"Error: {resp.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_all_ips()
