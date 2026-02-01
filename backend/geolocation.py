import requests
from typing import Optional


def get_country_from_ip(ip_address: str) -> Optional[str]:
    """
    Detect country from IP address using ipapi.co free API.
    
    Args:
        ip_address: User's IP address
    
    Returns:
        Two-letter country code (e.g., 'IN', 'US') or None if detection fails
    """
    try:
        # Use ipapi.co free tier (1,000 requests/day)
        response = requests.get(f"https://ipapi.co/{ip_address}/country/", timeout=2)
        
        if response.status_code == 200:
            country_code = response.text.strip()
            return country_code if country_code else None
        
        return None
    except Exception as e:
        print(f"Error detecting country from IP: {e}")
        return None


def is_indian_user(ip_address: str) -> bool:
    """
    Check if user is from India based on IP address.
    
    Args:
        ip_address: User's IP address
    
    Returns:
        True if user is from India, False otherwise
    """
    country = get_country_from_ip(ip_address)
    return country == "IN" if country else False


def get_payment_provider(ip_address: str) -> str:
    """
    Determine which payment provider to use based on user location.
    
    Args:
        ip_address: User's IP address
    
    Returns:
        'razorpay' for Indian users, 'gumroad' for international users
    """
    if is_indian_user(ip_address):
        return "razorpay"
    return "gumroad"
