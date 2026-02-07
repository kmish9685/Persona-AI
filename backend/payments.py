import razorpay
import os
from dotenv import load_dotenv

load_dotenv()

KEY_ID = os.getenv("RAZORPAY_KEY_ID")
KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = None
if KEY_ID and "your_razorpay" not in KEY_ID:
    client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))

def create_order(amount_paise: int = 9900):
    if not client:
        return {"error": "Razorpay keys not configured"}
    
    data = {
        "amount": amount_paise,
        "currency": "INR",
        "payment_capture": 1 # Auto capture
    }
    order = client.order.create(data=data)
    return order

def verify_signature(body: bytes, signature: str):
    if not client: return False
    return client.utility.verify_webhook_signature(body, signature, os.getenv("RAZORPAY_WEBHOOK_SECRET", "secret"))
