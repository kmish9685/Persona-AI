
Read guidelines.md first.

## TASK: Build Minimal Chat Frontend (Linear-Inspired)

Create a single-page chat interface replicating Linear's clean, minimal aesthetic. One input box, one output area, zero distractions. Must connect to backend API.

### Technical Requirements:

**Tech Stack:**
- Framework: Next.js 14 App Router
- Styling: Tailwind CSS only (no shadcn yet)
- State: React useState (no complex state)
- API Calls: fetch (no axios)

**File Locations:**
- Page: src/app/page.tsx
- Component: src/components/Chat.tsx
- Types: src/types/chat.ts
- API Client: src/lib/api.ts

**Exact Functionality:**
1. Single page with centered chat interface
2. Input box at bottom (like Linear command palette)
3. Message appears above after send
4. Response streams in below user message
5. No sidebar, no headers, no navigation
6. Loading state while waiting for response

**User Flow:**
1. User lands on page → sees empty chat with input
2. Types message → presses Enter or clicks Send
3. Message appears in chat area
4. Loading indicator shows
5. Response appears below user message
6. Input clears, ready for next message

**Code Structure:**
```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-[#18181B]">
      <Chat />
    </main>
  );
}

// src/components/Chat.tsx
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    // 1. Add user message to state
    // 2. Call backend API
    // 3. Add response to state
    // 4. Clear input
  }

  return (
    // Chat UI
  );
}
```

---

## BACKGROUND: Context & Resources

### Design Reference:
**Linear Command Palette Style:**
- Dark background: #18181B (zinc-900)
- Input box: subtle border, focus state glow
- Text: white (#FAFAFA)
- Minimal padding, centered layout
- No chat bubbles (just text blocks)
- Monospace font for AI responses

**Exact Look:**
```
┌─────────────────────────────┐
│                             │
│  [Previous messages here]   │
│                             │
│  User: Should I pivot?      │
│                             │
│  AI: No. Your MVP needs...  │
│                             │
│                             │
│  ┌─────────────────────┐   │
│  │ Type message...     │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### Files to Reference:
- None (new project)

### Documentation Links:
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind Dark Mode: https://tailwindcss.com/docs/dark-mode

### Current State:
- Backend running on localhost:8000
- POST /chat endpoint ready
- Need: Frontend to call it

### Example API Call:
```typescript
// src/lib/api.ts
export async function sendMessage(message: string): Promise<string> {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  
  const data = await response.json();
  return data.response;
}
```

---

## DO NOT:

### Don't Add These Features:
- ❌ Chat history/persistence
- ❌ User authentication
- ❌ Multiple chat threads
- ❌ Message editing
- ❌ Copy button
- ❌ Regenerate button
- ❌ Settings panel

### Don't Modify These:
- ❌ Don't add routing (single page only)
- ❌ Don't add database calls

### Don't Use These Approaches:
- ❌ No shadcn/ui yet (Tailwind only)
- ❌ No chat bubbles (Linear style is flat text)
- ❌ No animations (keep instant)
- ❌ No markdown rendering yet

### Don't Over-Engineer:
- ❌ No Context API
- ❌ No Zustand/Redux
- ❌ No separate API layer (one fetch call fine)
- ❌ No error boundaries (console.error fine)

### Critical Rules:
- ❌ NEVER add features not in spec
- ❌ NEVER use libraries beyond Next.js + Tailwind
- ❌ NEVER deviate from Linear aesthetic
- ❌ Keep total lines under 150

---

## SUCCESS CRITERIA: How I'll Know It Works

When you're done, I should be able to:
1. ✅ Run `npm run dev` and see chat at localhost:3000
2. ✅ Type message and press Enter
3. ✅ See my message appear above input
4. ✅ See loading state briefly
5. ✅ See AI response appear below my message
6. ✅ Send another message immediately

### Testing Checklist:
- [ ] Page loads with empty chat
- [ ] Input box focused on load
- [ ] Typing shows text in input
- [ ] Enter key sends message
- [ ] Message appears in chat
- [ ] Loading indicator shows
- [ ] Response appears
- [ ] Input clears after send
- [ ] Can send multiple messages

### Visual Test:
- [ ] Dark background (#18181B)
- [ ] White text (#FAFAFA)
- [ ] Input has subtle border
- [ ] Focus state visible
- [ ] Layout centered
- [ ] Mobile responsive (works on phone)

### What "Done" Looks Like:
- Clean, minimal interface
- Looks like Linear command palette
- Fast, no lag
- Works on mobile
- No errors in console

---

## DELIVERY FORMAT:

After implementing:
1. **Show files** (page.tsx, Chat.tsx, api.ts, types.ts)
2. **Dependencies** (just Next.js, Tailwind, TypeScript)
3. **Commands**:
```bash
   npm install
   npm run dev
```
4. **Test steps**:
   - Open localhost:3000
   - Type "Should I add features?"
   - Press Enter
   - See response appear
5. **Screenshot** (optional but helpful)

Reply with:
"✅ Frontend Chat Interface implemented - ready to test"

If blocked:
"🚫 Blocked: [issue] - Need: [requirement]"
