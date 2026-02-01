
Read guidelines.md first.

## TASK: Add Razorpay Payments with Message Limits

Implement message limits (10/day free) and one paid plan (₹299/month unlimited). Razorpay checkout modal, webhook verification, credit tracking.

### Technical Requirements:

**Tech Stack:**
- Payment: Razorpay (India)
- Database: Supabase (free tier)
- Backend: Add to existing FastAPI
- Frontend: Add paywall UI to Next.js

**File Locations:**
- Backend API: backend/payments.py
- Webhook: backend/webhooks/razorpay.py
- Frontend: src/components/Paywall.tsx
- Database: supabase/schema.sql
- Types: src/types/payment.ts

**Exact Functionality:**
1. Track message count per user (IP-based for now)
2. Block after 10 messages with paywall modal
3. Razorpay checkout for ₹299/month plan
4. Webhook adds unlimited access to user
5. Resume chatting immediately after payment

**User Flow:**
1. User sends 10th message
2. Response blocked, paywall modal appears
3. Shows: "₹299/month unlimited messages"
4. Clicks "Upgrade"
5. Razorpay modal opens
6. Completes payment
7. Modal closes, unlimited access granted
8. Can send message immediately

**Code Structure:**
```python
# backend/payments.py
@app.post("/payments/create-order")
async def create_order(user_ip: str):
    # 1. Create Razorpay order
    # 2. Return order_id
    pass

# backend/webhooks/razorpay.py
@app.post("/webhooks/razorpay")
async def handle_webhook(request: Request):
    # 1. Verify signature
    # 2. Update user to unlimited
    # 3. Log transaction
    pass

# backend/middleware.py
def check_message_limit(user_ip: str) -> bool:
    # 1. Get message count today
    # 2. Check if paid user
    # 3. Return True/False
    pass
```
```typescript
// src/components/Paywall.tsx
export function Paywall({ onClose }: { onClose: () => void }) {
  async function handlePurchase() {
    // 1. Create order via API
    // 2. Open Razorpay modal
    // 3. On success, close paywall
  }

  return (
    // Modal UI
  );
}
```

---

## BACKGROUND: Context & Resources

### Files to Reference:
- backend/main.py (add middleware here)
- src/components/Chat.tsx (show paywall here)

### Documentation Links:
- Razorpay Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- Razorpay Webhooks: https://razorpay.com/docs/webhooks/
- Supabase: https://supabase.com/docs

### Database Schema:
```sql
-- supabase/schema.sql
CREATE TABLE users (
  ip_address TEXT PRIMARY KEY,
  plan TEXT DEFAULT 'free', -- 'free' or 'unlimited'
  messages_today INT DEFAULT 0,
  last_message_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip TEXT REFERENCES users(ip_address),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INT, -- in paise (29900 = ₹299)
  status TEXT, -- 'created', 'captured', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Pricing (EXACT):
- **Free Plan**: 10 messages per day (IP-based)
- **Unlimited Plan**: ₹299/month, unlimited messages
- No other plans
- No discounts
- Test mode first

### Current State:
- Backend has /chat endpoint
- Frontend has chat UI
- Need: limits + payment flow

### Razorpay Test Card:
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

---

## DO NOT:

### Don't Add These Features:
- ❌ Multiple pricing tiers
- ❌ Annual billing
- ❌ Discount codes
- ❌ Referral system
- ❌ Credit packs (only unlimited plan)

### Don't Modify These:
- ❌ Don't change existing chat flow (only add limit check)
- ❌ Don't add user accounts yet (IP-based fine)

### Don't Use These Approaches:
- ❌ No Stripe (Razorpay only for India)
- ❌ No client-side payment verification (server-side only)
- ❌ No storing card details anywhere

### Don't Over-Engineer:
- ❌ No subscription management UI yet
- ❌ No invoice generation
- ❌ No email receipts
- ❌ No payment retries (one-time purchase)

### Critical Rules:
- ❌ NEVER trust client payment status (verify webhook)
- ❌ NEVER expose Razorpay key_secret to frontend
- ❌ ALWAYS verify webhook signature (prevent fraud)
- ❌ NEVER grant access before payment captured

---

## SUCCESS CRITERIA: How I'll Know It Works

When you're done, I should be able to:
1. ✅ Send 10 free messages successfully
2. ✅ 11th message shows paywall modal
3. ✅ Click "Upgrade" opens Razorpay test modal
4. ✅ Complete test payment with test card
5. ✅ Paywall closes, unlimited access granted
6. ✅ Can send unlimited messages
7. ✅ Transaction logged in database

### Testing Checklist:
- [ ] Free user gets exactly 10 messages
- [ ] 11th message triggers paywall
- [ ] Razorpay modal opens correctly
- [ ] Test payment succeeds
- [ ] Webhook receives payment event
- [ ] Signature verification passes
- [ ] User upgraded to unlimited
- [ ] Transaction recorded in DB
- [ ] Can send messages immediately after payment
- [ ] Different IP gets own 10 free messages

### Edge Cases:
- [ ] Failed payment doesn't grant access
- [ ] Duplicate webhook calls ignored (idempotency)
- [ ] Invalid signature rejected
- [ ] Expired order shows error

### What "Done" Looks Like:
- Paywall modal clean and clear
- Razorpay integration seamless
- Payment flow <60 seconds end-to-end
- No bugs in webhook handling
- Database tracking accurate

---

## DELIVERY FORMAT:

After implementing:
1. **Show files** (payments.py, webhooks/razorpay.py, Paywall.tsx, schema.sql)
2. **Dependencies** (razorpay Python SDK, Supabase client)
3. **Environment variables needed**:
```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   SUPABASE_URL=...
   SUPABASE_KEY=...
```
4. **Setup steps**:
   - Create Razorpay account
   - Get test API keys
   - Set up Supabase project
   - Run schema.sql
   - Add webhook URL to Razorpay dashboard
5. **Test instructions**:
```bash
   # Test free limit
   Send 10 messages → should work
   Send 11th → paywall appears
   
   # Test payment
   Click "Upgrade"
   Use card: 4111 1111 1111 1111
   Complete payment
   Verify unlimited access
   
   # Check database
   SELECT * FROM users WHERE ip_address='your_ip';
   SELECT * FROM transactions ORDER BY created_at DESC;
```

Reply with:
"✅ Payments + Limits implemented - ready to test"

Webhook URL for Razorpay dashboard:
`https://your-backend-url.com/webhooks/razorpay`

If blocked:
"🚫 Blocked: Need Razorpay account setup - Create at https://dashboard.razorpay.com"
