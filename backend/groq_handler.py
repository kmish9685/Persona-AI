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
        # ELON-ORIENTED PROMPT: First-principles + SpaceX/Tesla thinking
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
        
        # DEBUG: Print what we're actually sending
        print(f"[DEBUG] Using model: llama-3.3-70b-versatile")
        print(f"[DEBUG] User question: {user_message}")
        
        # Minimal system prompt
        messages = [
            {"role": "system", "content": "You are a helpful assistant. Follow the user's instructions exactly."},
            {"role": "user", "content": enforced_user_message}
        ]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Current model (cheap + fast + effective)
            messages=messages,
            temperature=0.4,  # Balanced for reasoning + style
            max_tokens=300,   # More room for detailed reasoning
            top_p=0.95,
            stream=False,
            stop=None,
        )

        response_text = completion.choices[0].message.content
        
        # DEBUG: Print response
        print(f"[DEBUG] Raw response length: {len(response_text)} chars")
        print(f"[DEBUG] Response preview: {response_text[:200]}")
        
        if not response_text:
             return "Error: Empty response from Groq."

        # Validate and return
        return validate_response(response_text, rules)

    except Exception as e:
        return f"Error calling Groq: {str(e)}"
