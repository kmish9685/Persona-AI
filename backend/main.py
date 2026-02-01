from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq_handler import call_groq
# HUGGING FACE (Network issues - DNS resolution failed)
# from huggingface_handler import call_huggingface
from database import check_can_chat, save_contact_submission
import json
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enhanced CORS for production and development
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://personai.fun",
    "https://www.personai.fun",
    "https://persona-ai-dually-vercel.app",  # Vercel auto-generated domain
    "*"  # Remove this in production for security
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

def load_persona():
    try:
        with open("persona.json", "r") as f:
            return json.load(f)
    except:
        return {}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response Status: {response.status_code}")
    return response

@app.get("/health")
async def health_check():
    return {"status": "ok", "backend": "serverless-gemini"}

from auth import router as auth_router
from middleware.auth_middleware import get_user_identifier

app.include_router(auth_router)

@app.post("/chat")
async def chat(request: ChatRequest, raw_request: Request):
    print(f"Received Message: {request.message}")
    
    # 1. Load persona rules
    rules = load_persona()
    
    # 2. Check Limits (Database)
    # Get user_identifier (Email if logged in, IP if not)
    user_identifier = get_user_identifier(raw_request)
    # Note: check_can_chat logic needs to handle this identifier (which might be email or IP)
    # Our Schema update supports checking both via the relaxed constraint
    # But database.py check_can_chat likely assumes IP. 
    # For MVP: We pass identifier as 'ip'. Schema is flexible.
    
    limit_status = check_can_chat(user_identifier)
    
    if not limit_status['allowed']:
        # Return 402 Payment Required with details
        raise HTTPException(status_code=402, detail=limit_status)

    # 3. Build system prompt
    base_prompt = rules.get("system_prompt_template", "You are a helpful assistant.")
    
    # 4. Call Groq API (Llama 3.3 70B)
    response_text = call_groq(base_prompt, request.message, rules)
    # HUGGING FACE (dormant): response_text = call_huggingface(base_prompt, request.message, rules)
    print(f"Generated Response: {response_text[:50]}...") # Log partial response
    
    # 5. Return
    return {
        "response": response_text,
        "remaining_free": limit_status.get('remaining', 0),
        "plan": limit_status.get('plan', 'unknown')
    }

# --- Contact Form Route ---

@app.post("/contact")
async def submit_contact(request: ContactRequest, raw_request: Request):
    """Handle contact form submissions from landing page"""
    
    # Basic validation
    if not request.name or not request.email or not request.message:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    if len(request.message) > 5000:
        raise HTTPException(status_code=400, detail="Message too long (max 5000 characters)")
    
    # Get client info for tracking
    client_ip = raw_request.client.host if raw_request.client else None
    user_agent = raw_request.headers.get("user-agent", "")
    
    # Save to database
    result = save_contact_submission(
        name=request.name,
        email=request.email,
        message=request.message,
        ip_address=client_ip,
        user_agent=user_agent
    )
    
    if result.get("success"):
        return {"status": "success", "message": "Thank you for reaching out!"}
    else:
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

# --- Payment Routes ---

@app.post("/payments/create-order")
async def create_payment_order():
    from payments import create_order
    order = create_order()
    if "error" in order:
        raise HTTPException(status_code=500, detail=order["error"])
    return order

@app.post("/webhooks/razorpay")
async def razorpay_webhook(request: Request):
    # In a real app, verify signature here
    # body = await request.body()
    # verify_signature(body, request.headers.get('X-Razorpay-Signature'))
    
    # Logic to upgrade user to 'pro' using database.py (omitted for brevity in this step)
    return {"status": "ok"}

# --- Gumroad Webhook & Activation Routes ---

@app.post("/webhooks/gumroad")
async def gumroad_webhook(request: Request):
    """
    Handle Gumroad webhook events (purchase, refund, cancellation).
    Called by Gumroad when a sale or refund occurs.
    """
    try:
        from gumroad_handler import verify_sale, grant_premium_access, revoke_premium_access
        from database import get_supabase_client
        
        body = await request.json()
        
        # Extract sale info from webhook
        sale_id = body.get("sale_id")
        seller_id = body.get("seller_id")
        product_permalink = body.get("product_permalink")
        email = body.get("email")
        refunded = body.get("refunded", False)
        disputed = body.get("disputed", False)
        
        if not sale_id:
            raise HTTPException(status_code=400, detail="Missing sale_id")
        
        # Verify sale with Gumroad API
        sale_data = verify_sale(sale_id)
        if not sale_data:
            raise HTTPException(status_code=400, detail="Invalid sale")
        
        supabase = get_supabase_client()
        
        # Handle refund/dispute
        if refunded or disputed:
            success = revoke_premium_access(sale_id, supabase)
            return {"status": "revoked" if success else "error"}
        
        # Handle new purchase
        # Note: We don't auto-grant here because we need email verification
        # The user will click the activation link from Gumroad receipt
        return {"status": "received"}
        
    except Exception as e:
        print(f"Gumroad webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/activate-premium")
async def activate_premium(request: Request):
    """
    Activate premium access after Gumroad purchase.
    Called when user clicks activation link from Gumroad receipt.
    """
    try:
        from gumroad_handler import verify_sale, grant_premium_access, get_sale_email
        from database import get_supabase_client
        from middleware.auth_middleware import get_user_from_token
        
        body = await request.json()
        sale_id = body.get("sale_id")
        user_email = body.get("user_email")  # From logged-in user
        
        if not sale_id:
            raise HTTPException(status_code=400, detail="Missing sale_id")
        
        # Verify sale exists
        sale_data = verify_sale(sale_id)
        if not sale_data:
            raise HTTPException(status_code=400, detail="Invalid sale")
        
        # Get buyer email from Gumroad
        gumroad_email = get_sale_email(sale_id)
        if not gumroad_email:
            raise HTTPException(status_code=400, detail="Could not retrieve purchase email")
        
        # Check if emails match
        if user_email and user_email.lower() != gumroad_email.lower():
            return {
                "status": "email_mismatch",
                "gumroad_email": gumroad_email,
                "user_email": user_email,
                "message": "Please sign in with the email you used on Gumroad"
            }
        
        # Grant premium access
        supabase = get_supabase_client()
        success = grant_premium_access(gumroad_email, sale_id, supabase)
        
        if success:
            return {
                "status": "success",
                "message": "Premium access activated!",
                "email": gumroad_email
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to activate premium")
            
    except Exception as e:
        print(f"Activation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/verify-gumroad-purchase")
async def verify_gumroad_purchase_manual(request: Request):
    """
    Manual verification endpoint for email mismatch cases.
    User confirms "Yes, this is my purchase" even though emails don't match.
    """
    try:
        from gumroad_handler import verify_sale, grant_premium_access
        from database import get_supabase_client
        
        body = await request.json()
        sale_id = body.get("sale_id")
        user_email = body.get("user_email")
        confirmed = body.get("confirmed", False)
        
        if not sale_id or not user_email or not confirmed:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Verify sale exists
        sale_data = verify_sale(sale_id)
        if not sale_data:
            raise HTTPException(status_code=400, detail="Invalid sale")
        
        # Grant access to the user's email (manual override)
        supabase = get_supabase_client()
        success = grant_premium_access(user_email, sale_id, supabase)
        
        if success:
            return {
                "status": "success",
                "message": "Premium access activated via manual verification"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to activate premium")
            
    except Exception as e:
        print(f"Manual verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/detect-country")
async def detect_country(request: Request):
    """
    Detect user's country from IP address for payment provider selection.
    """
    try:
        from geolocation import get_country_from_ip, get_payment_provider
        
        client_ip = request.client.host if request.client else None
        
        if not client_ip:
            return {"country": None, "payment_provider": "gumroad"}
        
        country = get_country_from_ip(client_ip)
        provider = get_payment_provider(client_ip)
        
        return {
            "country": country,
            "payment_provider": provider,
            "is_india": country == "IN"
        }
        
    except Exception as e:
        print(f"Country detection error: {e}")
        # Default to Gumroad on error
        return {"country": None, "payment_provider": "gumroad"}

if __name__ == "__main__":
    # Running on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)

