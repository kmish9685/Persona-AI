from http.server import BaseHTTPRequestHandler
import json
import os
import re
from supabase import create_client, Client

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment variables")
    
    return create_client(url, key)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle email capture"""
        try:
            # Parse request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            
            # Validate email
            email = data.get('email', '').strip().lower()
            source = data.get('source', 'unknown')
            
            if not email:
                self.send_error_response(400, "Email is required")
                return
            
            if not EMAIL_REGEX.match(email):
                self.send_error_response(400, "Invalid email format")
                return
            
            # Initialize Supabase
            supabase = get_supabase_client()
            
            # Insert email (upsert to handle duplicates)
            result = supabase.table('emails').upsert({
                'email': email,
                'source': source
            }, on_conflict='email').execute()
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "success": True,
                "message": "Email captured successfully"
            }
            self.wfile.write(json.dumps(response).encode())
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            print(f"Error capturing email: {str(e)}")
            self.send_error_response(500, "Internal server error")
    
    def send_error_response(self, code: int, message: str):
        """Send error response"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "success": False,
            "error": message
        }
        self.wfile.write(json.dumps(response).encode())
