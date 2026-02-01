
Read guidelines.md first.

## TASK: Add Email/Password Authentication (Non-Breaking)

Add complete authentication system (login, signup, forgot password) that works ALONGSIDE existing IP-based tracking. Existing users keep working, new users can optionally create accounts.

### Technical Requirements:

**Tech Stack:**
- Backend: FastAPI + JWT tokens
- Database: Supabase Auth (built-in auth system)
- Frontend: Next.js auth context + modals
- Email: Supabase email service (free tier)
- Sessions: HTTP-only cookies + JWT (7-day expiry)

**File Locations:**
- Backend Auth: backend/auth.py
- Auth Middleware: backend/middleware/auth_middleware.py
- Frontend Context: frontend/src/contexts/AuthContext.tsx
- Login Modal: frontend/src/components/auth/LoginModal.tsx
- Signup Modal: frontend/src/components/auth/SignupModal.tsx
- Forgot Password: frontend/src/components/auth/ForgotPasswordModal.tsx
- Premium Migration Modal: frontend/src/components/auth/MigrationModal.tsx
- Header Component: frontend/src/components/Header.tsx
- Types: frontend/src/types/auth.ts

**Authentication Rules (YOUR CHOICES):**
✅ Email verification: OPTIONAL (send email but don't block access)
✅ Password requirements: Minimum 8 characters only
✅ Session duration: 7 days (JWT expires after 7 days)
✅ Premium migration: ASK USER TO CONFIRM before transfer
✅ Header UI: Dynamic (login buttons OR user email dropdown)

**Exact Functionality:**
1. User can browse site without account (IP-based limits still work)
2. User can sign up with email/password (min 8 chars)
3. Verification email sent but NOT required to use site
4. User can log in with email/password
5. JWT token stored in HTTP-only cookie (7-day expiry)
6. Forgot password sends reset email
7. Premium purchases linked to account (not IP)
8. Migration: when IP-based premium user signs up, show confirmation modal

**User Flow - Sign Up:**
1. User clicks "Sign Up" button in header
2. Modal opens with email/password fields
3. User enters email + password (min 8 chars)
4. Backend creates account in Supabase
5. Verification email sent (but not required)
6. User immediately logged in (JWT set, 7-day expiry)
7. Modal closes, user continues chatting
8. Header now shows user email + dropdown

**User Flow - Login:**
1. User clicks "Log In" button
2. Modal opens with email/password fields
3. User enters credentials
4. Backend verifies with Supabase
5. JWT token set in HTTP-only cookie (7-day expiry)
6. User data loaded (plan, messages_today)
7. Modal closes, premium features unlocked (if applicable)
8. Header shows user email + dropdown

**User Flow - Premium Migration:**
1. IP-based premium user (already paid) signs up with email
2. Backend detects: this IP has premium status
3. Show MigrationModal: "We found premium linked to your IP. Transfer to this account?"
4. User clicks "Confirm Transfer"
5. Premium status moved from IP to email account
6. Old IP loses premium, new email gets premium
7. Confirmation message shown

**User Flow - Header (Logged Out):**
```
┌─────────────────────────────────┐
│ Persona AI    [Log In] [Sign Up]│
└─────────────────────────────────┘
```

**User Flow - Header (Logged In):**
```
┌─────────────────────────────────────┐
│ Persona AI        user@email.com ▾ │
│                   ┌─────────────┐  │
│                   │ Account     │  │
│                   │ Logout      │  │
│                   └─────────────┘  │
└─────────────────────────────────────┘
```

**Code Structure:**
```python
# backend/auth.py
from fastapi import APIRouter, HTTPException, Response, Request
from supabase import create_client
import jwt
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth")

SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7  # 7-day session

@router.post("/signup")
async def signup(email: str, password: str, request: Request, response: Response):
    # 1. Validate email format
    # 2. Check password length >= 8
    # 3. Create user in Supabase Auth
    # 4. Send verification email (optional verification)
    # 5. Check if current IP has premium status
    # 6. Generate JWT (7-day expiry)
    # 7. Set HTTP-only cookie
    # 8. Return: user data + has_premium_migration flag
    pass

@router.post("/login")
async def login(email: str, password: str, response: Response):
    # 1. Verify credentials with Supabase
    # 2. Generate JWT (7-day expiry)
    # 3. Set HTTP-only cookie
    # 4. Return user data
    pass

@router.post("/forgot-password")
async def forgot_password(email: str):
    # 1. Check if user exists (don't reveal if not)
    # 2. Send reset email via Supabase
    # 3. Return generic success message
    pass

@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    # 1. Verify reset token
    # 2. Check password length >= 8
    # 3. Update password in Supabase
    # 4. Invalidate old token
    # 5. Return success
    pass

@router.post("/migrate-premium")
async def migrate_premium(request: Request, user_email: str):
    # 1. Get current IP from request
    # 2. Verify IP has premium status
    # 3. Transfer premium from IP to email
    # 4. Update database
    # 5. Return success
    pass

@router.post("/logout")
async def logout(response: Response):
    # 1. Clear HTTP-only cookie
    # 2. Return success
    pass

@router.get("/me")
async def get_current_user(request: Request):
    # 1. Get JWT from cookie
    # 2. Verify token (check 7-day expiry)
    # 3. Get user data from Supabase
    # 4. Return user profile
    pass

def generate_jwt(email: str) -> str:
    """Generate JWT with 7-day expiry"""
    expiration = datetime.utcnow() + timedelta(days=7)
    payload = {
        "email": email,
        "exp": expiration
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

# backend/middleware/auth_middleware.py
def get_user_identifier(request: Request) -> str:
    """
    Returns user email if logged in, otherwise IP address.
    This allows backward compatibility with IP-based tracking.
    """
    token = request.cookies.get("auth_token")
    
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            
            # Check if expired (7 days)
            if datetime.utcnow() > datetime.fromtimestamp(payload["exp"]):
                return request.client.host  # Expired, fallback to IP
                
            return payload["email"]  # Valid logged-in user
        except:
            pass
    
    return request.client.host  # Fallback to IP
```
```typescript
// frontend/src/components/Header.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './auth/LoginModal';
import { SignupModal } from './auth/SignupModal';

export function Header() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-semibold">Persona AI</h1>

        {/* Auth Buttons (Logged Out) */}
        {!user && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Log In
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* User Dropdown (Logged In) */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              {user.email}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {/* Navigate to account */}}
                >
                  Account
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </header>
  );
}

// frontend/src/components/auth/MigrationModal.tsx
interface MigrationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MigrationModal({ isOpen, onConfirm, onCancel }: MigrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Premium Status Found</h2>
        
        <p className="text-gray-700 mb-6">
          We found premium status linked to your current IP address. Would you like to transfer it to this account?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## BACKGROUND: Context & Resources

### Database Schema Update:
```sql
-- Add auth columns to existing users table
ALTER TABLE users ADD COLUMN email TEXT UNIQUE;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Allow IP or email as identifier
ALTER TABLE users ALTER COLUMN ip_address DROP NOT NULL;

-- Add constraint: must have either IP or email
ALTER TABLE users ADD CONSTRAINT user_identifier_check 
  CHECK (ip_address IS NOT NULL OR email IS NOT NULL);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_ip ON users(ip_address);
```

### Environment Variables:
```bash
# backend/.env
SECRET_KEY=your-secret-key-here  # Generate: openssl rand -hex 32
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Password Validation (Simple):
```python
def validate_password(password: str) -> bool:
    """Minimum 8 characters only"""
    return len(password) >= 8
```

---

## DO NOT:

### Don't Add:
- ❌ Social login (Google/Facebook)
- ❌ Email verification requirement (it's optional)
- ❌ Complex password rules (just min 8 chars)
- ❌ Two-factor authentication
- ❌ Account deletion
- ❌ Username field (email only)

### Don't Modify:
- ❌ Don't break IP-based chat flow
- ❌ Don't require login to use chat
- ❌ Don't change payment flow

### Don't Use:
- ❌ NextAuth.js (too heavy)
- ❌ localStorage for tokens (security risk)
- ❌ Session storage

### Critical Rules:
- ❌ NEVER require email verification to chat
- ❌ NEVER enforce complex password rules
- ❌ NEVER auto-migrate premium without asking
- ❌ JWT MUST expire after exactly 7 days
- ❌ Auth MUST be optional (site works without login)

---

## SUCCESS CRITERIA:

### Signup Flow:
1. ✅ Click "Sign Up" → modal opens
2. ✅ Enter email + 8-char password → works
3. ✅ Enter 7-char password → shows error "Minimum 8 characters"
4. ✅ After signup → immediately logged in (no verification required)
5. ✅ Verification email sent (background, non-blocking)
6. ✅ Header shows user email + dropdown
7. ✅ If IP had premium → migration modal shows

### Login Flow:
1. ✅ Click "Log In" → modal opens
2. ✅ Enter credentials → logged in
3. ✅ JWT cookie set (7-day expiry)
4. ✅ Header shows email + dropdown
5. ✅ Wrong password → clear error message

### Session Persistence:
1. ✅ User logs in → stays logged in for 7 days
2. ✅ After 7 days → auto-logged out
3. ✅ Closing browser → still logged in (next visit)
4. ✅ Logout button → immediately logged out

### Premium Migration:
1. ✅ IP-based premium user signs up
2. ✅ Migration modal shows automatically
3. ✅ User clicks "Confirm" → premium transferred
4. ✅ User clicks "Cancel" → keeps IP-based premium
5. ✅ No accidental transfers

### Header UI:
1. ✅ Logged out: Shows "Log In" + "Sign Up" buttons
2. ✅ Logged in: Shows email + dropdown arrow
3. ✅ Click dropdown → shows "Account" + "Logout"
4. ✅ Click "Logout" → logged out, header resets

### Backward Compatibility:
1. ✅ Anonymous users still chat (IP-based)
2. ✅ Existing IP-based premium still works
3. ✅ No breaking changes to chat flow

DELIVERY:
Reply: "✅ Authentication system implemented - ready to test"

Then provide test user credentials and migration test instructions.
```

---

## 🤖 ANTIGRAVITY PROMPT 1: BUILD AUTH SYSTEM
```
NEW FEATURE: Authentication System

I have a complete specification at: _docs/DOC5_authentication_final.md

READ THE DOC FIRST:
Use view tool to read _docs/DOC5_authentication_final.md completely.

CRITICAL SETTINGS (already decided):
✅ Email verification: Optional (send email but don't require)
✅ Password: Minimum 8 characters only
✅ Session: 7-day JWT expiry
✅ Premium migration: Ask user to confirm
✅ Header: Dynamic (login buttons OR email dropdown)

AFTER READING:
Build the complete authentication system:

Backend Files:
- backend/auth.py (all auth endpoints)
- backend/middleware/auth_middleware.py (get user identifier)
- Update backend/main.py (add auth routes)

Frontend Files:
- frontend/src/contexts/AuthContext.tsx
- frontend/src/components/auth/LoginModal.tsx
- frontend/src/components/auth/SignupModal.tsx
- frontend/src/components/auth/ForgotPasswordModal.tsx
- frontend/src/components/auth/MigrationModal.tsx
- frontend/src/components/Header.tsx (dynamic auth UI)
- frontend/src/types/auth.ts

Database:
- Show SQL migration to add email columns

Environment:
- Update .env.example with new variables

REQUIREMENTS:
1. Follow ALL rules from the doc
2. Use exact settings specified above
3. Don't add features beyond doc spec
4. Ensure backward compatibility (IP tracking still works)

Wait for my "proceed" before building.

Confirm you've read the doc and understand the requirements.
```

---

## 🤖 ANTIGRAVITY PROMPT 2: POLISH AUTH UI

**Use this AFTER auth system is built and working:**
```
AUTH UI POLISH

The authentication system is working. Now polish the UI to look professional.

Reference docs:
- _docs/DOC5_authentication_final.md (auth functionality)
- Design inspiration: Linear login page, Stripe signup

MAKE THESE UPDATES:

1. Modal Design:
- Dark backdrop with blur
- Centered white card
- Smooth fade-in animation
- Subtle shadow

2. Input Fields:
- Clean borders
- Blue focus ring
- Red error ring
- Proper spacing

3. Buttons:
- Blue primary color
- Hover states
- Loading spinner
- Disabled state during submit

4. Error Messages:
- Red text with icon
- Below input fields
- Fade in animation

5. Header:
- Professional layout
- Clean dropdown
- Proper hover states

UPDATE THESE FILES:
- frontend/src/components/auth/*.tsx (all modals)
- frontend/src/components/Header.tsx

USE ONLY:
- Tailwind CSS (no external libs)
- Inline SVG icons
- Simple transitions

Show me the updated files with professional styling.
