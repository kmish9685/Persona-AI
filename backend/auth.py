from fastapi import APIRouter, HTTPException, Response, Request, Depends
from pydantic import BaseModel, EmailStr
import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from database import supabase_request, SUPABASE_URL, SUPABASE_KEY

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7

# Setup
router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MigrationRequest(BaseModel):
    email: EmailStr

# Helpers
def generate_jwt(email: str) -> str:
    expiration = datetime.utcnow() + timedelta(days=JWT_EXPIRATION_DAYS)
    payload = {
        "email": email,
        "exp": expiration
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

# Use pbkdf2_sha256 to avoid bcrypt DLL issues on Windows/Python 3.14
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Endpoints
import requests
# ... existing imports ...
from database import supabase_request, SUPABASE_URL, SUPABASE_KEY

# ... existing code ...

# Endpoints
@router.post("/signup")
async def signup(user: UserSignup, request: Request, response: Response):
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # 1. Admin Auto-Confirm Signup (Bypass Email Rate Limit)
    # Using Service Key to Force Create User
    auth_url = f"{SUPABASE_URL}/auth/v1/admin/users"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "email": user.email,
        "password": user.password,
        "email_confirm": True, # <--- KEY: Bypass Verification
        "user_metadata": { "plan": "free" }
    }
    
    try:
        # Note: requests.post is blocking, but fast enough for this MVP step
        auth_res = requests.post(auth_url, headers=headers, json=payload)
        auth_data = auth_res.json()
        
        if auth_res.status_code >= 400:
            msg = auth_data.get("msg") or auth_data.get("error_description") or "Signup failed"
            if "already registered" in str(msg):
                raise HTTPException(status_code=400, detail="User already exists")
            raise Exception(msg)
            
        # 2. Sync to public.users 
        # (Admin Create returns 'user' object wrapper sometimes, or direct fields depending on version, 
        # usually /admin/users returns user object directly or inside data)
        user_id = auth_data.get("id") or auth_data.get("user", {}).get("id")
        
        if user_id:
            new_user = {
                "id": user_id, 
                "email": user.email,
                "created_at": datetime.utcnow().isoformat(),
                "plan": "free" 
            }
            db_res = supabase_request("POST", "users", data=new_user)

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Signup Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    # 3. Auto-Login: Generate Session
    token = generate_jwt(user.email)
    
    # 4. Set Cookie
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False
    )

    # 5. Return Success (With Token, No Verification Required)
    return {
        "user": {"email": user.email, "plan": "free"},
        "token": token,
        "verification_required": False
    }

@router.post("/login")
async def login(user: UserLogin, response: Response):
    # 1. Native Supabase Login
    auth_url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {"email": user.email, "password": user.password}
    
    try:
        auth_res = requests.post(auth_url, headers=headers, json=payload)
        auth_data = auth_res.json()
        
        if auth_res.status_code >= 400:
             msg = auth_data.get("error_description") or "Invalid credentials"
             raise HTTPException(status_code=400, detail=msg)
             
        # Success! Supabase verified password & email status
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

    # 2. Get User Plan from DB
    users = supabase_request("GET", "users", params={"email": f"eq.{user.email}"})
    db_user = users[0] if users and len(users) > 0 else {"email": user.email, "plan": "free"}

    # 3. Generate Session
    token = generate_jwt(user.email)

    # 4. Set Cookie
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        max_age=JWT_EXPIRATION_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False 
    )

    return {
        "user": {
            "email": db_user["email"],
            "plan": db_user.get("plan", "free")
        },
        "token": token
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("auth_token")
    return {"message": "Logged out"}

@router.get("/me")
async def get_current_user(request: Request):
    token = request.cookies.get("auth_token")
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email = payload.get("email")
        
        # Get fresh data from DB
        users = supabase_request("GET", "users", params={"email": f"eq.{email}"})
        if users and len(users) > 0:
            user = users[0]
            return {"email": user["email"], "plan": user.get("plan", "free")}
    except:
        return None
        
    return None

@router.post("/migrate-premium")
async def migrate_premium(migration: MigrationRequest, request: Request):
    token = request.cookies.get("auth_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")
        
    # Verify current user matches request
    payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    if payload["email"] != migration.email:
        raise HTTPException(status_code=403, detail="User mismatch")

    ip_address = request.client.host
    
    # 1. Verify IP has premium
    ip_users = supabase_request("GET", "users", params={"ip_address": f"eq.{ip_address}", "select": "plan"})
    if not ip_users or len(ip_users) == 0 or ip_users[0]["plan"] != "pro":
        raise HTTPException(status_code=400, detail="No premium status found on this IP")
        
    # 2. Transfer Premium
    # PATCH /users?email=eq.email
    supabase_request("PATCH", "users", params={"email": f"eq.{migration.email}"}, data={"plan": "pro"})
    
    return {"success": True, "message": "Premium transferred"}
