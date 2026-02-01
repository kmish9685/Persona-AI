import requests
import time

BASE_URL = "http://localhost:8000"

def test_signup():
    email = f"test_{int(time.time())}@example.com"
    password = "password123"
    
    print(f"Testing signup with {email}...")
    
    try:
        res = requests.post(f"{BASE_URL}/auth/signup", json={
            "email": email, 
            "password": password
        })
        
        if res.status_code == 200:
            print("✅ Signup Success!")
            print(res.json())
        else:
            print(f"❌ Signup Failed: {res.status_code}")
            print(res.text)
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_signup()
