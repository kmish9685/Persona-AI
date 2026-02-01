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
