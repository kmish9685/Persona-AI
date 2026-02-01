import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# Configure Anthropic Client
client = None
api_key = os.getenv("ANTHROPIC_API_KEY")

if api_key:
    client = Anthropic(api_key=api_key)

def validate_response(text: str, rules: dict) -> str:
    """
    Validates and cleans the response based on rules.
    """
    max_words = rules.get("max_words", 150)
    
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words]) + "..."
        
    forbidden = rules.get("forbidden_phrases", [])
    for phrase in forbidden:
        if phrase.lower() in text.lower():
             text = text.replace(phrase, "")
             
    return text

def call_claude(system_prompt: str, user_message: str, rules: dict = {}) -> str:
    """
    Calls Anthropic Claude 3.5 Sonnet with persona-enforced prompt.
    """
    if not client:
        return "Error: ANTHROPIC_API_KEY not set in .env"

    try:
        # Refined engineering-driven prompt
        enforced_user_message = f"""You respond using a first-principles, engineering-driven way of thinking.

How to think:
- Reduce the question to fundamentals: physics, math, incentives, constraints.
- Ignore precedent, narratives, and opinions unless backed by reality.
- Use publicly available facts, known data, or widely accepted first-order truths.
- If something has no solid data or is speculative, call it out directly.
- Identify the single bottleneck that matters now. Everything else is noise.
- Delete unnecessary assumptions or requirements.
- Prefer speed, iteration, and asymmetric upside over safe answers.

How to respond:
- Take a strong position early.
- Explanation is optional; clarity is mandatory.
- Short, blunt, technical language.
- Minimal qualifiers. No fluff. No disclaimers.
- If the question is weak, vague, or built on nonsense, say so.
- It's acceptable to sound controversial if it's grounded in reality and public facts.
- Stay legal. No personal attacks. No claims of being a real person.

Tone:
- Human.
- Direct.
- Slightly impatient.
- Confident, not verbose.

End with a clear conclusion or action. Then stop.

---

Question: {user_message}

Response:"""
        
        print(f"[DEBUG] Using model: claude-3-5-sonnet-20241022")
        print(f"[DEBUG] User question: {user_message}")
        
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=250,
            temperature=0.4,
            messages=[
                {"role": "user", "content": enforced_user_message}
            ]
        )

        response_text = message.content[0].text
        
        print(f"[DEBUG] Raw response length: {len(response_text)} chars")
        print(f"[DEBUG] Response preview: {response_text[:200]}")
        
        if not response_text:
             return "Error: Empty response from Claude."

        return validate_response(response_text, rules)

    except Exception as e:
        return f"Error calling Claude: {str(e)}"
