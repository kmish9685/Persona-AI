import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Service Role Key

def force_create_user():
    # Admin Endpoint: /auth/v1/admin/users
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    email = "kmish9685@gmail.com"
    password = "password123" # Temporary password
    
    payload = {
        "email": email,
        "password": password,
        "email_confirm": True, # BYPASSES EMAIL SENDING
        "user_metadata": {
            "plan": "free"
        }
    }
    
    print(f"Force Creating User: {email}")
    try:
        resp = requests.post(url, headers=headers, json=payload)
        print(f"Status: {resp.status_code}")
        print(resp.text)
        
        if resp.status_code == 200 or resp.status_code == 201:
            print("✅ User Created & Verified! You can now LOGIN.")
        else:
            print("❌ Creation Failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    force_create_user()
