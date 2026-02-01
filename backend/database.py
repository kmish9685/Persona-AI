import os
import requests
import json
from datetime import date, datetime
from dotenv import load_dotenv

load_dotenv()

# Config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DAILY_FREE_LIMIT = 10
GLOBAL_SAFETY_CAP = 1000

# Helpers
def get_today_str():
    return date.today().isoformat()

def supabase_request(method, endpoint, data=None, params=None):
    if not SUPABASE_URL or not SUPABASE_KEY or "your_supabase" in SUPABASE_URL:
        return None
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    
    try:
        print(f"Supabase Request: {method} {url}")
        if method == "GET":
            resp = requests.get(url, headers=headers, params=params, timeout=10)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=data, timeout=10)
        elif method == "PATCH":
            resp = requests.patch(url, headers=headers, params=params, json=data, timeout=10)
            
        print(f"Supabase Response: {resp.status_code}")
        if resp.status_code >= 300:
            print(f"Supabase Error Body: {resp.text}")
            return None
        return resp.json()
    except Exception as e:
        print(f"Supabase HTTP Error: {e}")
        return None

def check_global_cap():
    """Checks if system-wide safety limit is breached."""
    today = get_today_str()
    # QUERY: global_stats?date=eq.today&select=total_requests
    data = supabase_request("GET", "global_stats", params={"date": f"eq.{today}", "select": "total_requests"})
    
    if data and len(data) > 0:
        total = data[0].get('total_requests', 0)
        if total >= GLOBAL_SAFETY_CAP:
            return False
    elif data == []:
         # Create row
         supabase_request("POST", "global_stats", data={"date": today, "total_requests": 0})
         
    return True

def increment_global_stats():
    """Increments total system requests."""
    today = get_today_str()
    # For MVP via REST: Fetch count then update (Race condition permissible for MVP safety cap)
    data = supabase_request("GET", "global_stats", params={"date": f"eq.{today}", "select": "total_requests"})
    if data and len(data) > 0:
        new_total = data[0]['total_requests'] + 1
        supabase_request("PATCH", "global_stats", params={"date": f"eq.{today}"}, data={"total_requests": new_total})

def check_can_chat(identifier: str) -> dict:
    """
    Core Logic using REST API
    Identifier can be IP address or Email
    """
    # Fail OPEN if no keys configured
    if not SUPABASE_URL or "your_" in SUPABASE_URL:
        return {'allowed': True, 'plan': 'dev', 'remaining': 999}

    # 1. Global Safety Cap Check
    if not check_global_cap():
        pass 

    try:
        # Determine if identifier is IP or Email
        is_email = "@" in identifier
        query_params = {"email": f"eq.{identifier}"} if is_email else {"ip_address": f"eq.{identifier}"}
        
        today = get_today_str()
        users = supabase_request("GET", "users", params=query_params)
        
        user = None
        if not users:
            # Create User
            new_user = {
                'plan': 'free', 
                'msg_count': 0, 
                'last_active_date': today,
                'created_at': datetime.utcnow().isoformat()
            }
            if is_email:
                new_user['email'] = identifier
            else:
                new_user['ip_address'] = identifier
                
            supabase_request("POST", "users", data=new_user)
            user = new_user
        else:
            user = users[0]

        # Reset count if new day
        if user.get('last_active_date') != today:
            user['msg_count'] = 0
            user['last_active_date'] = today
            # Update
            supabase_request("PATCH", "users", params=query_params, data={"msg_count": 0, "last_active_date": today})

        # 2. Check Logic
        if user.get('plan') == 'pro':
            increment_global_stats()
            return {'allowed': True, 'plan': 'pro', 'remaining': 9999}
        
        # Free User Checks
        if not check_global_cap():
             return {'allowed': False, 'reason': 'global_cap_reached', 'plan': 'free'}

        if user.get('msg_count', 0) >= DAILY_FREE_LIMIT:
            return {'allowed': False, 'reason': 'daily_limit_reached', 'plan': 'free', 'remaining': 0}
            
        # ALLOWED -> Increment
        new_count = user['msg_count'] + 1
        supabase_request("PATCH", "users", params=query_params, data={"msg_count": new_count})
        increment_global_stats()
        
        return {'allowed': True, 'plan': 'free', 'remaining': DAILY_FREE_LIMIT - new_count}

    except Exception as e:
        print(f"Logic Error: {e}")
        return {'allowed': True, 'plan': 'error_fallback', 'remaining': 5}

def save_contact_submission(name: str, email: str, message: str, ip_address: str = None, user_agent: str = None) -> dict:
    """
    Saves a contact form submission to the database.
    Returns success status and submission ID.
    """
    if not SUPABASE_URL or "your_supabase" in SUPABASE_URL:
        return {"success": False, "error": "Database not configured"}
    
    submission_data = {
        "name": name,
        "email": email,
        "message": message,
        "ip_address": ip_address,
        "user_agent": user_agent
    }
    
    result = supabase_request("POST", "contact_submissions", data=submission_data)
    
    if result and len(result) > 0:
        return {"success": True, "id": result[0].get("id")}
    else:
        return {"success": False, "error": "Failed to save submission"}
