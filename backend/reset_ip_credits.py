import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def reset_ip_credits(ip_address):
    """Reset message count for a specific IP address"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Update the user's msg_count to 0
    url = f"{SUPABASE_URL}/rest/v1/users"
    params = {"ip_address": f"eq.{ip_address}"}
    data = {"msg_count": 0}
    
    try:
        resp = requests.patch(url, headers=headers, params=params, json=data)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
        
        if resp.status_code in [200, 204]:
            print(f"✅ Successfully reset credits for IP: {ip_address}")
        else:
            print(f"❌ Failed to reset credits")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Get your current IP (you can also hardcode it)
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    print(f"Detected local IP: {local_ip}")
    print("If this is not your public IP, enter it manually below:")
    
    ip = input("Enter IP to reset (or press Enter to use detected IP): ").strip()
    if not ip:
        ip = local_ip
    
    reset_ip_credits(ip)
