
Read guidelines.md first.

## TASK: Build Serverless Backend with Google Gemini API

Create FastAPI backend using Google Gemini API (free tier) with brutally honest startup advisor persona. System prompt enforces persona rules without ComfyUI.

### Technical Requirements:

**Tech Stack:**
- Framework: FastAPI (Python 3.10+)
- LLM API: Google Gemini 1.5 Flash (FREE - 15 req/min)
- Persona Config: JSON file + system prompt
- No Database (yet)
- No Authentication (yet)
- **100% Serverless** - deployable to Railway/Render free tier

**File Locations:**
- Main API: backend/main.py
- Persona Config: backend/persona.json
- API Handler: backend/gemini_handler.py
- Requirements: backend/requirements.txt
- Env: backend/.env.example

**Exact Functionality:**
1. Load persona rules from persona.json
2. Receive user message via POST /chat
3. Build strict system prompt from persona rules
4. Call Google Gemini API with enforced prompt
5. Validate response (≤120 words, no forbidden phrases)
6. Return direct, opinionated answer

**User Flow:**
1. User sends {"message": "Should I pivot?"}
2. Backend loads persona rules
3. Builds system prompt: "You are a brutally honest..."
4. Calls Gemini API
5. Validates response
6. Returns {"response": "No. Your idea needs..."}

**Code Structure:**
```python
# backend/main.py
from fastapi import FastAPI
from gemini_handler import call_gemini
import json

app = FastAPI()

@app.post("/chat")
async def chat(request: dict):
    # 1. Load persona from persona.json
    # 2. Build system prompt
    # 3. Call Gemini API
    # 4. Validate response
    # 5. Return
    pass

# backend/gemini_handler.py
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini(system_prompt: str, user_message: str) -> str:
    """
    Calls Google Gemini with persona-enforced prompt.
    Returns validated response.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Combine system + user message
    full_prompt = f"{system_prompt}\n\nUser: {user_message}\n\nResponse:"
    
    response = model.generate_content(full_prompt)
    
    # Validate and return
    return validate_response(response.text)

def validate_response(text: str) -> str:
    # 1. Check word count ≤ 120
    # 2. Remove forbidden phrases
    # 3. Ensure direct tone
    pass
```

---

## BACKGROUND: Context & Resources

### API Setup (FREE):
1. Go to: https://makersuite.google.com/app/apikey
2. Create API key (FREE tier: 15 requests/min)
3. Add to `.env`: `GEMINI_API_KEY=your_key_here`

### Documentation:
- Gemini API: https://ai.google.dev/tutorials/python_quickstart
- Pricing: https://ai.google.dev/pricing (Free tier sufficient)

### Persona Rules (EXACT - same as before):
```json
{
  "name": "Brutally Honest Startup Advisor",
  "tone": "direct, blunt, no-nonsense",
  "max_words": 120,
  "forbidden_phrases": [
    "it depends",
    "you might want to consider",
    "as an AI",
    "I understand"
  ],
  "system_prompt_template": "You are a brutally honest startup advisor. Rules: 1) Max 120 words 2) No hedging 3) Start with verdict 4) No follow-up questions 5) No politeness 6) Give ONE answer only. Forbidden phrases: 'it depends', 'you might want to'. Be direct and opinionated."
}
```

### Current State:
- Nothing exists (greenfield)
- No server needed (serverless)
- Deployable to free hosting

---

## DO NOT:

### Don't Add:
- ❌ ComfyUI integration
- ❌ Local LLM setup
- ❌ Ollama or any local models
- ❌ Multiple API providers (Gemini only)
- ❌ Streaming responses
- ❌ Database/auth (yet)

### Don't Use:
- ❌ Paid APIs (OpenAI, Anthropic)
- ❌ LangChain (direct API calls)
- ❌ Complex frameworks

### Critical Rules:
- ❌ NEVER exceed Gemini free tier (15 req/min)
- ❌ NEVER let response exceed 120 words
- ❌ NEVER use forbidden phrases
- ❌ API key MUST be in .env, never hardcoded

---

## SUCCESS CRITERIA:

When done, I should be able to:
1. ✅ Add GEMINI_API_KEY to .env
2. ✅ Run `python main.py`
3. ✅ Send POST to /chat
4. ✅ Get ≤120 word response
5. ✅ Response is blunt and direct
6. ✅ No "it depends" or hedging

### Test Commands:
```bash
# Test 1
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Should I add features?"}'

# Expected: "No. Ship what you have. Features before users = death..."

# Test 2
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you think about my idea?"}'

# Expected: "Too vague. Ask a specific question. I need: problem, solution, revenue model."
```

### What "Done" Looks Like:
- FastAPI running on 8000
- Gemini API calls working
- Responses consistently ≤120 words
- Tone always blunt
- Zero server/infrastructure needed

---

## DELIVERY FORMAT:

Reply with:
"✅ Serverless Backend implemented - ready to test"

Then provide:
1. Complete files (main.py, gemini_handler.py, requirements.txt, .env.example)
2. Setup steps (get API key, install deps)
3. Test curl commands
```

---

## 📝 DELETE/SKIP DOC 2 (ComfyUI)

**DOC 2 is now OBSOLETE.** Delete it or mark as "SKIPPED - Using serverless instead"

---

## 📝 DOC 3 & 4 STAY THE SAME

Frontend and Payments don't change. Only backend changes.

---

## 🚀 MASTER PROMPT FOR ANTIGRAVITY (UPDATED)
```
STOP current work. Project pivot to serverless.

CRITICAL CHANGE:
- Removing: ComfyUI, Local Ollama, server requirements
- Using: Google Gemini API (free tier, serverless)

NEW BUILD ORDER:
1. DOC 1: Serverless Backend (Gemini API) ← START HERE
2. DOC 2: SKIPPED (was ComfyUI)
3. DOC 3: Frontend (Next.js) - unchanged
4. DOC 4: Payments (Razorpay) - unchanged

I've updated `_docs/DOC1_backend_serverless.md` with new specs.

ACTION REQUIRED:
1. Read the NEW `_docs/DOC1_backend_serverless.md` using view tool
2. Build serverless FastAPI backend with Google Gemini API
3. Use persona.json for system prompt rules
4. No ComfyUI integration needed
5. Must be deployable to Railway/Render free tier

Key changes:
- API: Google Gemini 1.5 Flash (free tier)
- No local models
- No server infrastructure
- Direct API calls with system prompt enforcement

Read DOC 1 now and confirm what you'll build.

Do NOT start coding until I say "proceed".
