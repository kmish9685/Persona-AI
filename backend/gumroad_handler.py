import os
import requests
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GUMROAD_ACCESS_TOKEN = os.getenv("GUMROAD_ACCESS_TOKEN")
GUMROAD_PRODUCT_PERMALINK = "persona-ai"  # From your Gumroad URL


def verify_sale(sale_id: str) -> Optional[Dict[str, Any]]:
    """
    Verify a Gumroad sale using the API.
    Returns sale data if valid, None if invalid.
    """
    if not GUMROAD_ACCESS_TOKEN:
        print("ERROR: GUMROAD_ACCESS_TOKEN not configured")
        return None
    
    try:
        url = f"https://api.gumroad.com/v2/sales/{sale_id}"
        headers = {"Authorization": f"Bearer {GUMROAD_ACCESS_TOKEN}"}
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                return data.get("sale")
        
        return None
    except Exception as e:
        print(f"Error verifying Gumroad sale: {e}")
        return None


def get_sale_email(sale_id: str) -> Optional[str]:
    """
    Get the buyer's email from a Gumroad sale.
    """
    sale = verify_sale(sale_id)
    if sale:
        return sale.get("email")
    return None


def is_sale_refunded(sale_id: str) -> bool:
    """
    Check if a Gumroad sale has been refunded.
    """
    sale = verify_sale(sale_id)
    if sale:
        return sale.get("refunded", False) or sale.get("disputed", False)
    return False


def grant_premium_access(user_email: str, sale_id: str, supabase_client) -> bool:
    """
    Grant premium access to a user after Gumroad purchase.
    
    Args:
        user_email: User's email address
        sale_id: Gumroad sale ID
        supabase_client: Supabase client instance
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Update user to premium
        result = supabase_client.table("users").update({
            "plan": "pro",
            "gumroad_sale_id": sale_id,
            "payment_provider": "gumroad",
            "msg_count": 0  # Reset message count
        }).eq("email", user_email).execute()
        
        if result.data:
            # Record transaction
            supabase_client.table("transactions").insert({
                "user_ip": None,  # Email-based user, no IP tracking
                "gumroad_sale_id": sale_id,
                "amount": 699,  # $6.99 in cents
                "status": "paid",
                "payment_provider": "gumroad"
            }).execute()
            
            return True
        
        return False
    except Exception as e:
        print(f"Error granting premium access: {e}")
        return False


def revoke_premium_access(sale_id: str, supabase_client) -> bool:
    """
    Revoke premium access after a refund.
    
    Args:
        sale_id: Gumroad sale ID
        supabase_client: Supabase client instance
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Find user with this sale ID
        user_result = supabase_client.table("users").select("*").eq("gumroad_sale_id", sale_id).execute()
        
        if user_result.data:
            user = user_result.data[0]
            
            # Downgrade to free plan
            supabase_client.table("users").update({
                "plan": "free",
                "gumroad_sale_id": None,
                "payment_provider": "razorpay"  # Reset to default
            }).eq("id", user["id"]).execute()
            
            # Update transaction status
            supabase_client.table("transactions").update({
                "status": "refunded"
            }).eq("gumroad_sale_id", sale_id).execute()
            
            return True
        
        return False
    except Exception as e:
        print(f"Error revoking premium access: {e}")
        return False
