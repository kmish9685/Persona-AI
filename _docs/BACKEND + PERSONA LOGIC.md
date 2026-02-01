
Read guidelines.md first.

## TASK: Build Backend API with Local LLM Integration

Create a FastAPI backend that connects to local Ollama (Mistral 7B) with ONE brutally honest startup advisor persona. Backend must enforce strict persona rules and return short, direct, opinionated responses.

### Technical Requirements:

**Tech Stack:**
- Framework: FastAPI (Python 3.10+)
- LLM: Ollama with Mistral 7B
- Persona Config: JSON file-based rules
- No Database (yet)
- No Authentication (yet)

**File Locations:**
- Main API: backend/main.py
- Persona Config: backend/persona.json
- LLM Handler: backend/llm_handler.py
- Requirements: backend/requirements.txt

**Exact Functionality:**
1. Load persona rules from persona.json on startup
2. Receive user message via POST /chat endpoint
3. Inject persona rules into system prompt
4. Send to local Ollama Mistral 7B
5. Enforce max 120 words response
6. Return direct, opinionated answer with NO disclaimers

**User Flow:**
1. User sends message to POST /chat with {"message": "Should I pivot?"}
2. Backend injects persona rules into prompt
3. Ollama generates response (locally, no API cost)
4. Response trimmed to 120 words max
5. Returns {"response": "Yes. Your idea is..."}

**Code Structure:**
```python
# backend/main.py
@app.post("/chat")
async def chat(request: ChatRequest):
    # 1. Load persona rules from persona.json
    # 2. Build system prompt with rules
    # 3. Call Ollama with user message
    # 4. Enforce 120 word limit
    # 5. Return response
    pass

# backend/llm_handler.py
def call_ollama(system_prompt: str, user_message: str) -> str:
    # 1. Connect to local Ollama
    # 2. Send message with persona rules
    # 3. Get response
    # 4. Validate length
    # 5. Return text
    pass
```

---

## BACKGROUND: Context & Resources

### Files to Reference:
- None (greenfield project)

### Documentation Links:
- Ollama Python API: https://github.com/ollama/ollama-python
- FastAPI: https://fastapi.tiangolo.com/

### Persona Rules (EXACT):
```json
{
  "name": "Brutally Honest Startup Advisor",
  "tone": "direct, blunt, no-nonsense",
  "max_words": 120,
  "style": "first principles thinking, zero fluff",
  "forbidden_phrases": [
    "it depends",
    "you might want to consider",
    "there are many factors",
    "I understand your concern",
    "let me help you",
    "as an AI"
  ],
  "allowed_behaviors": [
    "call out bad thinking",
    "refuse weak questions",
    "give ONE answer only",
    "push back on user",
    "say 'wrong' directly"
  ],
  "response_rules": [
    "Start with verdict first",
    "No hedging words",
    "No follow-up questions",
    "No politeness",
    "One hard answer only"
  ]
}
```

### Current State:
- Nothing exists yet
- Ollama already installed locally (assume this)
- Mistral 7B model already pulled (assume this)

### Example Interaction:
```
User: "Should I add voice features to my MVP?"
Bad Response: "Well, it depends on your users..."
Good Response: "No. Your MVP needs revenue validation first, not features. Voice is expensive and distracting. Focus on getting 10 paying users with text-only. Add voice after ₹50k MRR."
```

---

## DO NOT:

### Don't Add These Features:
- ❌ User authentication
- ❌ Database storage
- ❌ Chat history/memory
- ❌ Multiple personas
- ❌ Streaming responses
- ❌ Rate limiting (comes later)

### Don't Modify These:
- ❌ Don't install paid APIs (OpenAI, Anthropic)
- ❌ Don't use cloud LLMs

### Don't Use These Approaches:
- ❌ No LangChain (direct Ollama calls only)
- ❌ No vector databases
- ❌ No complex prompt frameworks
- ❌ No RAG or embeddings

### Don't Over-Engineer:
- ❌ No async task queues
- ❌ No caching (premature)
- ❌ No logging frameworks (print statements fine)
- ❌ Keep it under 200 lines total

### Critical Rules:
- ❌ NEVER let response exceed 120 words (hard cut)
- ❌ NEVER use forbidden phrases from persona.json
- ❌ NEVER ask follow-up questions in responses
- ❌ NEVER be polite or use disclaimers

---

## SUCCESS CRITERIA: How I'll Know It Works

When you're done, I should be able to:
1. ✅ Run `python backend/main.py` and see "Server running on 8000"
2. ✅ Send POST to localhost:8000/chat with test message
3. ✅ Get response under 120 words, direct tone, no fluff
4. ✅ See persona rules enforced (no forbidden phrases)
5. ✅ Test in terminal with curl command

### Testing Checklist:
- [ ] Server starts without errors
- [ ] Ollama connection works
- [ ] Response length always ≤ 120 words
- [ ] Tone is blunt and direct
- [ ] No "it depends" or hedging
- [ ] No follow-up questions in response
- [ ] Forbidden phrases never appear

### Test Messages:
```bash
# Test 1 - Should be blunt
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Should I add more features to my MVP?"}'

# Expected: "No. Ship what you have..."

# Test 2 - Should refuse weak question
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you think about my idea?"}'

# Expected: "Too vague. Ask a specific question..."

# Test 3 - Should give ONE answer
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Marketing or product first?"}'

# Expected: "Product. You have nothing to market..."
```

### What "Done" Looks Like:
- Terminal shows: FastAPI running on localhost:8000
- curl commands return JSON: {"response": "..."}
- Responses feel like talking to harsh senior, not chatbot
- Word count always ≤ 120
- Zero friendly language

---

## DELIVERY FORMAT:

After implementing:
1. **Show created files** (4 files: main.py, llm_handler.py, persona.json, requirements.txt)
2. **List dependencies** (fastapi, uvicorn, ollama-python)
3. **Commands to run**:
```bash
   cd backend
   pip install -r requirements.txt
   python main.py
```
4. **How to test** (exact curl commands above)
5. **Known limitations**: Slow on first request (Ollama model loading)

Reply with:
"✅ Backend + Persona Logic implemented - ready to test"

If blocked, tell me:
"🚫 Blocked: [issue] - Need: [what you need]"Read guidelines.md first.

## TASK: Build Backend API with Local LLM Integration

Create a FastAPI backend that connects to local Ollama (Mistral 7B) with ONE brutally honest startup advisor persona. Backend must enforce strict persona rules and return short, direct, opinionated responses.

### Technical Requirements:

**Tech Stack:**
- Framework: FastAPI (Python 3.10+)
- LLM: Ollama with Mistral 7B
- Persona Config: JSON file-based rules
- No Database (yet)
- No Authentication (yet)

**File Locations:**
- Main API: backend/main.py
- Persona Config: backend/persona.json
- LLM Handler: backend/llm_handler.py
- Requirements: backend/requirements.txt

**Exact Functionality:**
1. Load persona rules from persona.json on startup
2. Receive user message via POST /chat endpoint
3. Inject persona rules into system prompt
4. Send to local Ollama Mistral 7B
5. Enforce max 120 words response
6. Return direct, opinionated answer with NO disclaimers

**User Flow:**
1. User sends message to POST /chat with {"message": "Should I pivot?"}
2. Backend injects persona rules into prompt
3. Ollama generates response (locally, no API cost)
4. Response trimmed to 120 words max
5. Returns {"response": "Yes. Your idea is..."}

**Code Structure:**
```python
# backend/main.py
@app.post("/chat")
async def chat(request: ChatRequest):
    # 1. Load persona rules from persona.json
    # 2. Build system prompt with rules
    # 3. Call Ollama with user message
    # 4. Enforce 120 word limit
    # 5. Return response
    pass

# backend/llm_handler.py
def call_ollama(system_prompt: str, user_message: str) -> str:
    # 1. Connect to local Ollama
    # 2. Send message with persona rules
    # 3. Get response
    # 4. Validate length
    # 5. Return text
    pass
```

---

## BACKGROUND: Context & Resources

### Files to Reference:
- None (greenfield project)

### Documentation Links:
- Ollama Python API: https://github.com/ollama/ollama-python
- FastAPI: https://fastapi.tiangolo.com/

### Persona Rules (EXACT):
```json
{
  "name": "Brutally Honest Startup Advisor",
  "tone": "direct, blunt, no-nonsense",
  "max_words": 120,
  "style": "first principles thinking, zero fluff",
  "forbidden_phrases": [
    "it depends",
    "you might want to consider",
    "there are many factors",
    "I understand your concern",
    "let me help you",
    "as an AI"
  ],
  "allowed_behaviors": [
    "call out bad thinking",
    "refuse weak questions",
    "give ONE answer only",
    "push back on user",
    "say 'wrong' directly"
  ],
  "response_rules": [
    "Start with verdict first",
    "No hedging words",
    "No follow-up questions",
    "No politeness",
    "One hard answer only"
  ]
}
```

### Current State:
- Nothing exists yet
- Ollama already installed locally (assume this)
- Mistral 7B model already pulled (assume this)

### Example Interaction:
```
User: "Should I add voice features to my MVP?"
Bad Response: "Well, it depends on your users..."
Good Response: "No. Your MVP needs revenue validation first, not features. Voice is expensive and distracting. Focus on getting 10 paying users with text-only. Add voice after ₹50k MRR."
```

---

## DO NOT:

### Don't Add These Features:
- ❌ User authentication
- ❌ Database storage
- ❌ Chat history/memory
- ❌ Multiple personas
- ❌ Streaming responses
- ❌ Rate limiting (comes later)

### Don't Modify These:
- ❌ Don't install paid APIs (OpenAI, Anthropic)
- ❌ Don't use cloud LLMs

### Don't Use These Approaches:
- ❌ No LangChain (direct Ollama calls only)
- ❌ No vector databases
- ❌ No complex prompt frameworks
- ❌ No RAG or embeddings

### Don't Over-Engineer:
- ❌ No async task queues
- ❌ No caching (premature)
- ❌ No logging frameworks (print statements fine)
- ❌ Keep it under 200 lines total

### Critical Rules:
- ❌ NEVER let response exceed 120 words (hard cut)
- ❌ NEVER use forbidden phrases from persona.json
- ❌ NEVER ask follow-up questions in responses
- ❌ NEVER be polite or use disclaimers

---

## SUCCESS CRITERIA: How I'll Know It Works

When you're done, I should be able to:
1. ✅ Run `python backend/main.py` and see "Server running on 8000"
2. ✅ Send POST to localhost:8000/chat with test message
3. ✅ Get response under 120 words, direct tone, no fluff
4. ✅ See persona rules enforced (no forbidden phrases)
5. ✅ Test in terminal with curl command

### Testing Checklist:
- [ ] Server starts without errors
- [ ] Ollama connection works
- [ ] Response length always ≤ 120 words
- [ ] Tone is blunt and direct
- [ ] No "it depends" or hedging
- [ ] No follow-up questions in response
- [ ] Forbidden phrases never appear

### Test Messages:
```bash
# Test 1 - Should be blunt
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Should I add more features to my MVP?"}'

# Expected: "No. Ship what you have..."

# Test 2 - Should refuse weak question
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you think about my idea?"}'

# Expected: "Too vague. Ask a specific question..."

# Test 3 - Should give ONE answer
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Marketing or product first?"}'

# Expected: "Product. You have nothing to market..."
```

### What "Done" Looks Like:
- Terminal shows: FastAPI running on localhost:8000
- curl commands return JSON: {"response": "..."}
- Responses feel like talking to harsh senior, not chatbot
- Word count always ≤ 120
- Zero friendly language

---

## DELIVERY FORMAT:

After implementing:
1. **Show created files** (4 files: main.py, llm_handler.py, persona.json, requirements.txt)
2. **List dependencies** (fastapi, uvicorn, ollama-python)
3. **Commands to run**:
```bash
   cd backend
   pip install -r requirements.txt
   python main.py
```
4. **How to test** (exact curl commands above)
5. **Known limitations**: Slow on first request (Ollama model loading)

Reply with:
"✅ Backend + Persona Logic implemented - ready to test"

If blocked, tell me:
"🚫 Blocked: [issue] - Need: [what you need]"
