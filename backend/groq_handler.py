import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Configure Groq Client
client = None
api_key = os.getenv("GROQ_API_KEY")

if api_key:
    client = Groq(api_key=api_key)

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

def call_groq(system_prompt: str, user_message: str, rules: dict = {}) -> str:
    """
    Calls Groq API with Elon-style persona prompt.
    Uses 70B model for better reasoning + persona adherence.
    """
    if not client:
        return "Error: GROQ_API_KEY not set in .env"

    try:
        # User message wrapper (reinforcement logic similar to what we added for Gemini)
        enforced_user_message = f"""[USER QUESTION]: {user_message}

[INSTRUCTION]: Answer this as Elon Musk would. 
- Use First Principles. 
- Be barely polite, or not polite at all.
- Focus on physics, cost, and truth.
- PROVIDE PROOF: Cite dates, events, historical parallels, or specific reports. Do not just state opinions.
- NO "AI" disclaimers.
- Make it quotable."""
        
        # DEBUG: Print what we're actually sending
        print(f"[DEBUG] Using model: llama-3.3-70b-versatile")
        print(f"[DEBUG] User question: {user_message}")
        print(f"[DEBUG] System Prompt: {system_prompt[:50]}...")
        
        # Minimal system prompt structure for Groq
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": enforced_user_message}
        ]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Current model (cheap + fast + effective)
            messages=messages,
            temperature=0.9,  # Higher temperature for "red pilled" creativity
            max_tokens=300,   # More room for detailed reasoning
            top_p=0.95,
            stream=False,
            stop=None,
        )

        response_text = completion.choices[0].message.content
        
        # DEBUG: Print response
        print(f"[DEBUG] Raw response length: {len(response_text)} chars")
        
        if not response_text:
             return "Error: Empty response from Groq."

        # Validate and return
        return validate_response(response_text, rules)

    except Exception as e:
        return f"Error calling Groq: {str(e)}"
