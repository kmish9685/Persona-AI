
Read guidelines.md first.

## TASK: Create ComfyUI Workflow for Persona Enforcement

Build a ComfyUI workflow that acts as a processor between user input and LLM output. Workflow must inject persona rules, enforce response constraints, and prevent generic AI behavior.

### Technical Requirements:

**Tech Stack:**
- ComfyUI (local installation)
- JSON workflow file
- Python custom node (if needed)
- Integration: Backend calls ComfyUI API

**File Locations:**
- Workflow: comfyui/workflows/persona_enforcer.json
- Custom Node: comfyui/custom_nodes/persona_rules.py
- Integration: backend/comfyui_handler.py

**Exact Functionality:**
1. Receive text input from backend
2. Load persona.json rules
3. Build enforced system prompt
4. Send to local LLM (Ollama)
5. Validate output against rules
6. Cut response at 120 words exactly
7. Strip any forbidden phrases
8. Return clean output

**User Flow:**
1. Backend sends message to ComfyUI API
2. ComfyUI loads workflow: persona_enforcer.json
3. Workflow injects persona rules into prompt
4. LLM generates response
5. Workflow validates response
6. Returns enforced output to backend

**Workflow Structure:**
```
Input Text Node
    ↓
Load Persona Rules Node
    ↓
Build System Prompt Node
    ↓
LLM Call Node (Ollama)
    ↓
Response Validator Node
    ↓
Word Limit Enforcer Node
    ↓
Forbidden Phrase Stripper Node
    ↓
Output Text Node
```

---

## BACKGROUND: Context & Resources

### Files to Reference:
- backend/persona.json (persona rules to enforce)
- backend/llm_handler.py (current LLM call logic)

### Documentation Links:
- ComfyUI API: https://github.com/comfyanonymous/ComfyUI
- Custom Nodes Guide: https://docs.comfy.org/essentials/custom_nodes

### Design Reference:
Simple linear workflow (no branching). Each node enforces one rule. Workflow should be reusable with different persona.json files later.

### Current State:
- Backend working with direct Ollama calls
- Need: ComfyUI as middleware for better control
- persona.json already defined

### Example Enforcement:
```python
# Input from user
"Should I hire a co-founder?"

# After persona rules injection
System Prompt: "You are a brutally honest startup advisor. Rules: max 120 words, no hedging, no follow-up questions, start with verdict, no politeness. Forbidden phrases: 'it depends', 'you might want to'..."

# LLM generates
"It depends on your current stage and skills..."

# Workflow strips forbidden phrase and regenerates
"No, not yet. You're at idea stage with zero revenue. Co-founders add complexity you can't afford. Build solo until you hit ₹10k MRR or have clear technical gaps you can't fill. Then hire, don't partner."
```

---

## DO NOT:

### Don't Add These Features:
- ❌ Multiple workflows (only ONE for now)
- ❌ UI/visual workflow editor (JSON only)
- ❌ Image generation nodes
- ❌ Complex branching logic

### Don't Modify These:
- ❌ Don't change backend/persona.json structure
- ❌ Don't modify core ComfyUI code

### Don't Use These Approaches:
- ❌ No cloud ComfyUI instances
- ❌ No paid ComfyUI extensions
- ❌ No LangChain integration

### Don't Over-Engineer:
- ❌ No complex node networks
- ❌ No caching between nodes
- ❌ No error retry loops (fail fast)
- ❌ Linear workflow only (input → process → output)

### Critical Rules:
- ❌ NEVER bypass persona rules enforcement
- ❌ NEVER allow responses >120 words
- ❌ NEVER let forbidden phrases pass through
- ❌ Workflow must work offline (local only)

---

## SUCCESS CRITERIA: How I'll Know It Works

When you're done, I should be able to:
1. ✅ Load persona_enforcer.json in ComfyUI
2. ✅ Send test input via ComfyUI API
3. ✅ Get enforced output (rules applied)
4. ✅ Backend successfully calls ComfyUI instead of direct Ollama
5. ✅ Response quality improves (more consistent persona)

### Testing Checklist:
- [ ] Workflow loads without errors
- [ ] All nodes execute in sequence
- [ ] Persona rules read from persona.json
- [ ] Forbidden phrases never in output
- [ ] Response length exactly ≤ 120 words
- [ ] Backend integration works
- [ ] Workflow runs in <10 seconds

### Test Cases:
```json
// Test 1 - Should enforce word limit
Input: "Explain product-market fit"
Before ComfyUI: 250 word response
After ComfyUI: 118 word response ✓

// Test 2 - Should strip forbidden phrases
Input: "Should I pivot?"
Before: "Well, it depends on many factors..."
After: "Not enough data to decide. Show me: current revenue, user retention..." ✓

// Test 3 - Should enforce tone
Input: "I'm scared to launch"
Before: "I understand your concern. Launching can be..."
After: "Fear is irrelevant. Set launch date. Ship in 48 hours. Feedback beats planning." ✓
```

### What "Done" Looks Like:
- ComfyUI workflow file exists and loads
- Backend calls ComfyUI API successfully
- Responses feel MORE consistent and sharp
- Persona rules never violated

---

## DELIVERY FORMAT:

After implementing:
1. **Show files** (workflow JSON, custom node if created, integration code)
2. **Dependencies** (ComfyUI Python packages)
3. **Commands**:
```bash
   # Start ComfyUI
   cd ComfyUI
   python main.py
   
   # Update backend to use ComfyUI
   # (show exact code changes)
```
4. **Test workflow** (curl command to ComfyUI API)
5. **Integration test** (backend → ComfyUI → response)

Reply with:
"✅ ComfyUI Persona Enforcement implemented - ready to test"

If blocked:
"🚫 Blocked: [issue] - Need: [requirement]"
