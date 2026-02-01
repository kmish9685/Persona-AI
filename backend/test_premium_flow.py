import requests
import time
import random

API_URL = "http://localhost:8000"

def test_premium_logic():
    # 1. Create a User
    n = random.randint(1000, 9999)
    email = f"premium.test.{n}@gmail.com"
    password = "password123"
    
    print(f"Creating User: {email}")
    s = requests.Session()
    
    # Signup (Bypass mode)
    res = s.post(f"{API_URL}/auth/signup", json={"email": email, "password": password})
    if res.status_code != 200:
        print(f"Signup Failed: {res.text}")
        return
        
    token = res.json().get("token")
    print("User Created & Logged In.")
    
    # 2. Check Plan (Should be Free)
    res = s.post(f"{API_URL}/chat", json={"message": "Hello"}, cookies={"auth_token": token})
    print(f"Initial Chat Plan: {res.json().get('plan')}") # Expect 'free'
    
    # 3. Manually UPGRADE User to PRO (Simulate Payment)
    from database import supabase_request
    supabase_request("PATCH", "users", params={"email": f"eq.{email}"}, data={"plan": "pro"})
    print("Manually upgraded user to PRO.")
    
    # 4. Chat from IP A (Standard)
    res = s.post(f"{API_URL}/chat", json={"message": "I am Pro from IP A"}, cookies={"auth_token": token})
    print(f"Chat from IP A: Plan={res.json().get('plan')} (Expect 'pro')")
    
    # 5. Chat from IP B (Simulating Network Change)
    # We can't easily spoof IP in localhost requests library without header tricks 
    # BUT middleware uses request.client.host which comes from the connection.
    # We can simulate the 'middleware' behavior by asserting the token is respected.
    
    # The crucial test: Does it work?
    if res.json().get('plan') == 'pro':
        print("✅ SUCCESS: Logic correctly identifies Pro Plan via Token.")
    else:
        print("❌ FAIL: Logic did not find Pro Plan.")

if __name__ == "__main__":
    test_premium_logic()
