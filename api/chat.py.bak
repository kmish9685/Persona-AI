from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api._lib.groq_handler import call_groq
from api._lib.database import check_can_chat

def load_persona():
    try:
        persona_path = os.path.join(os.path.dirname(__file__), '_lib', 'persona.json')
        with open(persona_path, 'r') as f:
            return json.load(f)
    except:
        return {}

def get_client_ip(handler):
    forwarded = handler.headers.get('X-Forwarded-For')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return handler.headers.get('X-Real-IP', 'unknown')

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Cookie')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
    
    def do_POST(self):
        try:
            # Parse request
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            message = data.get('message')
            
            if not message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Message is required"}).encode())
                return
            
            # Load persona
            rules = load_persona()
            
            # Check limits
            client_ip = get_client_ip(self)
            limit_status = check_can_chat(client_ip)
            
            if not limit_status['allowed']:
                self.send_response(402)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": limit_status.get('reason', 'Limit reached')}).encode())
                return
            
            # Call Groq
            base_prompt = rules.get("system_prompt_template", "You are a helpful assistant.")
            response_text = call_groq(base_prompt, message, rules)
            
            # Return response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "response": response_text,
                "remaining_free": limit_status.get('remaining', 0),
                "plan": limit_status.get('plan', 'unknown')
            }
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            print(f"Chat Error: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
