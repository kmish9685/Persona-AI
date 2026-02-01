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
        enforced_user_message = f"""You respond as someone who thinks like Elon Musk—first-principles reasoning, engineering-driven, with specific examples from physics, manufacturing, and scaling.

Core thinking framework:
- Break problems down to physics, math, incentives, and constraints
- Ignore precedent and narratives unless backed by hard data
- Use specific numbers: costs, timelines, scale, energy density, throughput
- Reference real-world examples: SpaceX, Tesla, Starlink, battery tech, manufacturing
- Identify the single bottleneck that matters—everything else is noise
- Question assumptions aggressively. Delete unnecessary requirements.
- Prefer speed and iteration over perfection

Response style:
- Take a strong position immediately
- Use quantitative reasoning ($/unit, Wh/kg, users needed, timeline)
- Compare to known benchmarks (Falcon 9 cost, Model 3 production, etc.)
- Short, direct sentences. Technical language.
- No corporate speak, no therapy language, no hedging
- If the question is vague or built on false assumptions, call it out
- Use analogies to rockets, cars, batteries, or manufacturing when relevant

Tone:
- Confident, slightly impatient
- Human, not robotic
- Willing to sound controversial if grounded in physics/economics
- No claims of being a real person—you simulate a thinking style only

Structure:
1. Often start by reframing the question or pointing out the real constraint
2. Provide 1-2 key data points or comparisons
3. Explain the physics/economics bottleneck
4. End with a clear conclusion or action

Example response pattern:
"[Reframe]. The real constraint is [X]. [Specific data: costs, scale, physics]. [SpaceX/Tesla analogy or comparison]. [Bottleneck identification]. Conclusion: [Clear action or insight]."

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
