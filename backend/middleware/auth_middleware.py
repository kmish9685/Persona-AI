from fastapi import Request
import jwt
import os
from datetime import datetime

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
JWT_ALGORITHM = "HS256"

def get_user_identifier(request: Request) -> str:
    """
    Returns user email if logged in (valid JWT), otherwise IP address.
    This allows backward compatibility with IP-based tracking.
    """
    token = request.cookies.get("auth_token")
    
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            
            # Check if expired (should be handled by jwt.decode but good to be explicit)
            if "exp" in payload and datetime.utcnow().timestamp() > payload["exp"]:
                return request.client.host  # Expired, fallback to IP
                
            return payload.get("email", request.client.host)  # Valid logged-in user
        except Exception:
            pass
    
    return request.client.host  # Fallback to IP
