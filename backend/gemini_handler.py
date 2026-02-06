import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini Client
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

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

def call_gemini(system_prompt: str, user_message: str, rules: dict = {}) -> str:
    """
    Calls Gemini API with Elon-style persona prompt.
    """
    if not api_key:
        return "Error: GOOGLE_API_KEY not set in .env"

    try:
        # User message wrapper (reinforcement)
        enforced_user_message = f"""[USER QUESTION]: {user_message}

[INSTRUCTION]: Answer this as Elon Musk would. 
- Use First Principles. 
- Be barely polite, or not polite at all.
- Focus on physics, cost, and truth.
- No "AI" disclaimers.
- Make it quotable."""
        
        # DEBUG: Print what we're actually sending
        print(f"[DEBUG] Using model: gemini-1.5-pro")
        print(f"[DEBUG] User question: {user_message}")
        print(f"[DEBUG] System Prompt: {system_prompt[:50]}...")
        
        # Configure model with system instruction
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            system_instruction=system_prompt  # Pass the real system prompt here
        )
        
        response = model.generate_content(
            enforced_user_message,
            generation_config=genai.types.GenerationConfig(
                temperature=0.9,  # Higher temperature for more "red pilled" creativity
                max_output_tokens=300,
                top_p=0.95,
            )
        )

        response_text = response.text
        
        # DEBUG: Print response
        print(f"[DEBUG] Raw response length: {len(response_text)} chars")
        
        if not response_text:
             return "Error: Empty response from Gemini."

        # Validate and return
        return validate_response(response_text, rules)

    except Exception as e:
        return f"Error calling Gemini: {str(e)}"
