import requests
import random

API_URL = "http://localhost:8000"

def test_bypass_signup():
    n = random.randint(100000, 999999)
    email = f"bypass.test.{n}@gmail.com"
    password = "password123"
    
    print(f"Testing Bypass Signup for: {email}")
    
    try:
        res = requests.post(f"{API_URL}/auth/signup", json={
            "email": email, 
            "password": password
        })
        
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
        
        data = res.json()
        
        if "token" in data and data.get("verification_required") is False:
            print("✅ SUCCESSS: Token received immediately! Verification Bypassed.")
        elif data.get("verification_required") is True:
            print("❌ FAILED: Still asking for verification.")
        else:
            print("⚠️ Unknown Response structure")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_bypass_signup()
