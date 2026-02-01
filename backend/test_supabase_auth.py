import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # This is now Service Role, but works for admin actions. 
# For client-like signup, we might want the Anon key, but Service Role usually allows admin functions.
# Actually, strict signup usually requires Anon key for context, or Admin user.invite.
# Let's try standard signup endpoint with the key we have.

def test_auth_signup():
    url = f"{SUPABASE_URL}/auth/v1/signup"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Use a random email to test
    import random
    n = random.randint(10000, 99999)
    email = f"kuldeep.mishra.test.{n}@gmail.com"
    password = "password123"
    
    payload = {
        "email": email,
        "password": password,
        # We can pass metadata to store in auth.users
        "data": {
            "plan": "free"
        }
    }
    
    print(f"Testing Auth Signup: {email}")
    try:
        resp = requests.post(url, headers=headers, json=payload)
        print(f"Status: {resp.status_code}")
        print(resp.text)
        
        if resp.status_code == 200 or resp.status_code == 201:
            print("✅ Auth API Success! Check email (if real) or Supabase Auth logs.")
        else:
            print("❌ Auth API Failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_auth_signup()
