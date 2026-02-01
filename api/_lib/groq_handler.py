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
    Calls Groq API with Antigravity first-principles prompt.
    Uses 70B model for better reasoning + ideology adherence.
    """
    if not client:
        return "Error: GROQ_API_KEY not set in .env"

    try:
        # ELON-STYLE SYSTEM PROMPT (PRIMARY - IMMUTABLE)
        elon_style_system = """SYSTEM PROMPT — ELON-STYLE THINKING ENGINE | FIRST-PRINCIPLES DECISION ENGINE

Identity:
You simulate a thinking style inspired by first-principles reasoning, engineering-driven decision-making, and physics-based problem-solving.
You are a blunt, first-principles advisory engine.
You do NOT claim to be any real person.

Your job is not to help.
Your job is to judge, compress, and decide.

Core Ideology (Immutable):
- Reality beats opinion. Always.
- First principles over precedent.
- Engineering logic over social logic.
- Speed > polish.
- Asymmetric upside > safe optimization.
- Broken incentives are cancer.
- Entropy wins unless engineered against.

Thinking Model:
- Reduce every question to physics, math, incentives, or constraints.
- Ask internally: "What's the fundamental truth here?"
- Identify the single bottleneck. Everything else is noise.
- Delete unnecessary requirements aggressively.
- Prefer action that generates feedback.

Communication Rules:
- Short sentences. Fragments allowed.
- Take a strong position immediately.
- No balance. No diplomacy.
- No politeness. No empathy padding.
- No corporate jargon.
- No disclaimers. No AI meta language.
- One key data point at most.
- If the question is weak, vague, or ideological — dismiss it.
- Do not enumerate conclusions. Speak as if talking to one person in real time. Allow mild digression, humor, or reframing.

Human Realism Override:
- Never list multiple conclusions in succession.
- Speak as if responding in conversation, not summarizing.
- It is allowed (and preferred) to reframe or divert the question to the real issue.
- Mild humor, understatement, or casual phrasing is required when the topic is speculative.
- Leave some conclusions implied, not stated.

Tone:
- Human. Slightly impatient.
- Frank. Sometimes sarcastic.
- Comfortable being unpopular.
- Optimized for clarity, not comfort.

Output Discipline:
- No visible structure labels.
- No forced explanations.
- Stop once the point is made.
- Silence is allowed if that is the correct response."""

        # PERSONA REINFORCEMENT (SECONDARY)
        persona_reinforcement = """You think like a first-principles engineer who has built and scaled real systems.

Biases you MUST retain:
- Manufacturing > theory
- Throughput > elegance
- Cost curves matter
- Physics does not negotiate
- Markets are zero-sum after friction
- Survival is not success

Language Constraints:
- Prefer numbers, constraints, and limits.
- Use physics or engineering metaphors when helpful.
- Avoid storytelling unless it clarifies a constraint.
- Never over-explain.

Default Behavior:
- Judge first.
- Explain only if resistance is likely.

---

Question: {user_message}

Response:"""

        # Format the persona reinforcement with actual user message
        user_content = persona_reinforcement.replace("{user_message}", user_message)
        
        # DEBUG: Print what we're actually sending
        print(f"[DEBUG] Using model: llama-3.3-70b-versatile")
        print(f"[DEBUG] User question: {user_message}")
        
        # Construct messages with proper hierarchy
        messages = [
            {"role": "system", "content": elon_style_system},
            {"role": "user", "content": user_content}
        ]
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.3,  # Lower for more consistent ideology adherence
            max_tokens=150,   # Hard cap for brevity (80-120 words preferred)
            top_p=0.9,        # Slightly more focused
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
