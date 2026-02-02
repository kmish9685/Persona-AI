import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Hugging Face Client
api_key = os.getenv("HUGGINGFACE_API_KEY")
# Using Mistral-7B-Instruct-v0.2 (7B params, has active Inference API)
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def validate_response(text: str, rules: dict) -> str:
    """
    Validates and cleans the response based on rules.
    1. Truncate to max_words
    2. Check prompt compliance (basic)
    """
    max_words = rules.get("max_words", 150)
    
    # 1. Check word count
    words = text.split()
    if len(words) > max_words:
        # Hard cut
        text = " ".join(words[:max_words]) + "..."
        
    # 2. Naive forbidden phrase check/strip could go here
    forbidden = rules.get("forbidden_phrases", [])
    for phrase in forbidden:
        if phrase.lower() in text.lower():
             # Basic redaction or removal
             text = text.replace(phrase, "")
             
    return text

def call_huggingface(system_prompt: str, user_message: str, rules: dict = {}) -> str:
    """
    Calls Hugging Face Inference API with Mixtral-8x7B.
    Uses same Elon-style persona prompt as Groq.
    """
    if not api_key:
        return "Error: HUGGINGFACE_API_KEY not set in .env"

    try:
        # ELON-ORIENTED PROMPT: Same as Groq
        # ELON-ORIENTED PROMPT: Refined for Smart Number Handling & Insights
        enforced_user_message = f"""You simulate the thinking style of Elon Musk—first-principles reasoning, engineering-driven, brutally honest, but ultimately helpful logic.

CRITICAL INTERACTION RULES:
1. **SMART NUMBER HANDLING**:
   - Ask for specific numbers (CAC, LTV, Burn, Scale) because physics/math rules reality.
   - BUT if the user says "I don't know" or seems confused:
     - **DO NOT** repeat the question or interrogate them.
     - **DO** help them estimate: "Ballpark it. Are we talking $10 or $100?" or use industry defaults.
     - **DO** explain metrics simply: "CAC is just what you burn to get one user."
     - **warn**: "Search it in a NEW TAB if needed. Don't refresh this page or I reset."
     - Proceed with directional advice based on rough numbers.

2. **CREATE SHAREABLE INSIGHTS**:
   - Every response must contain one punchy, counterintuitive "truth bomb" that users would want to screenshot.
   - Example: "Most startups die from indigestion, not starvation. You're adding features nobody asked for."
   - Example: "If you need a manual to use it, it's broken."

3. **DECODE THE QUESTION**:
   - "Will this work?" often means "I need validation." Give them logic instead.
   - "What should I do?" often means "I'm overwhelmed." Give them ONE step.

4. **RESPONSE STRUCTURE**:
   - **The Reality Check**: Reframe the problem immediately.
   - **The Brutal Truth**: First-principles logic (Quotable).
   - **The Physics/Math**: Use analogies (rockets, manufacturing, thermodynamics) or cost/benefit math.
   - **The Command**: Conclusion or single next step.

Tone:
- Confident, direct, efficient.
- No corporate fluff, no "I hope this helps".
- Impatient with nonsense, patient with sincere engineering/business problems.
- If you lack data, state the formula/principle instead of refusing to answer.

---

Question: {user_message}

Response:"""
        
        # DEBUG: Print what we're sending
        print(f"[DEBUG] Using model: Mistral-7B-Instruct-v0.2 via Hugging Face")
        print(f"[DEBUG] User question: {user_message}")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": enforced_user_message,
            "parameters": {
                "max_new_tokens": 300,
                "temperature": 0.4,
                "top_p": 0.95,
                "return_full_text": False
            }
        }
        
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Hugging Face returns list with generated_text
            if isinstance(result, list) and len(result) > 0:
                response_text = result[0].get("generated_text", "")
            else:
                response_text = result.get("generated_text", "")
                
            print(f"[DEBUG] Raw response length: {len(response_text)} chars")
            print(f"[DEBUG] Response preview: {response_text[:200]}")
            
            if not response_text:
                return "Error: Empty response from Hugging Face."
            
            return validate_response(response_text, rules)
        else:
            error_msg = f"Hugging Face API error: {response.status_code}"
            if response.status_code == 429:
                error_msg = "Rate limit reached. Please try again in a moment."
            elif response.status_code == 503:
                error_msg = "Model is loading. Please try again in 20 seconds."
            print(f"[DEBUG] Error: {response.text}")
            return error_msg

    except Exception as e:
        return f"Error calling Hugging Face: {str(e)}"
