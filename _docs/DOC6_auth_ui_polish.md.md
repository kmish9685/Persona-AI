
Read guidelines.md first.

## TASK: Polish Authentication UI (Linear/Stripe Style)

Make auth modals look professional, clean, and trustworthy. Reference: Linear's login page and Stripe's signup flow.

### Technical Requirements:

**Tech Stack:**
- Styling: Tailwind CSS only
- Animations: Tailwind transitions (no external libs)
- Form Validation: React Hook Form + Zod
- Loading States: Tailwind spinners

**File Locations:**
- All auth components in: frontend/src/components/auth/
- Shared styles: frontend/src/styles/auth.css (if needed)

**Exact Design Reference:**

**Linear Login Page**: https://linear.app/login
- Clean centered modal
- Subtle shadow
- Focus states with blue glow
- Minimal text
- Clear error messages below inputs

**Stripe Signup**: https://dashboard.stripe.com/register
- Professional feel
- Good input spacing
- Clear CTAs
- Progressive disclosure (show errors only after user types)

**Specific Polish Requirements:**

1. **Modal Design:**
   - Dark backdrop (bg-black/50)
   - Centered white card (max-w-md)
   - Rounded corners (rounded-lg)
   - Shadow (shadow-2xl)
   - Smooth fade-in animation

2. **Input Fields:**
   - Clean borders (border-gray-300)
   - Focus state: blue ring (ring-2 ring-blue-500)
   - Error state: red ring (ring-2 ring-red-500)
   - Placeholder text: gray-400
   - Padding: px-4 py-3
   - Font: text-sm

3. **Buttons:**
   - Primary: bg-blue-600 hover:bg-blue-700
   - Full width
   - Padding: py-3
   - Rounded: rounded-md
   - Loading state: show spinner, disable button
   - Transition: transition-colors duration-200

4. **Error Messages:**
   - Color: text-red-600
   - Size: text-sm
   - Position: Below input with mt-1
   - Icon: Show red alert icon
   - Fade in: animate-fade-in

5. **Success Messages:**
   - Color: text-green-600
   - Same style as errors
   - Show checkmark icon

6. **Typography:**
   - Headings: font-semibold text-xl
   - Body: text-sm text-gray-700
   - Links: text-blue-600 hover:text-blue-700 underline

7. **Spacing:**
   - Input gap: space-y-4
   - Modal padding: p-6
   - Button margin-top: mt-6

8. **Loading States:**
   - Spinner: Tailwind spin animation
   - Disable form during submission
   - Button text: "Logging in..." with spinner

9. **Responsive:**
   - Mobile: Full screen modal (sm:max-w-md)
   - Desktop: Centered card

10. **Accessibility:**
    - Proper labels (for screen readers)
    - Tab order (keyboard navigation)
    - ARIA labels
    - Focus visible states

**Code Structure:**
```typescript
// frontend/src/components/auth/LoginModal.tsx
export function LoginModal({ isOpen, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Log in to Persona AI
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`
                w-full px-4 py-3 rounded-md border
                ${error ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
              `}
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`
                w-full px-4 py-3 rounded-md border
                ${error ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
              `}
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 animate-fade-in">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3 rounded-md font-medium text-white
              ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
              transition-colors duration-200
              disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Log in'
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## DO NOT:

### Don't Add:
- ❌ External animation libraries (Framer Motion, etc.)
- ❌ Custom fonts (system fonts only)
- ❌ Gradient backgrounds (solid colors only)
- ❌ Icons library (use SVG inline or Tailwind icons)

### Don't Use:
- ❌ CSS modules or styled-components (Tailwind only)
- ❌ Complex animations (simple fade/slide only)
- ❌ Custom CSS files unless absolutely necessary

### Critical Rules:
- ❌ NEVER sacrifice accessibility for style
- ❌ NEVER use colors that fail WCAG contrast standards
- ❌ NEVER hide error messages or validation
- ❌ Keep animations under 300ms (fast, not showy)

---

## SUCCESS CRITERIA:

When done, auth modals should:
1. ✅ Look professional (like Linear/Stripe)
2. ✅ Have smooth animations (fade in/out)
3. ✅ Show clear error states (red borders, error text)
4. ✅ Have good loading states (spinner + disabled button)
5. ✅ Be fully responsive (mobile + desktop)
6. ✅ Be accessible (keyboard nav + screen readers)
7. ✅ Have proper focus states (visible blue rings)

### Visual Test:
- [ ] Modal centers on screen
- [ ] Backdrop is dark and blurred
- [ ] Inputs have clear focus states
- [ ] Errors show in red with icon
- [ ] Loading state disables form
- [ ] Links are blue and underlined
- [ ] Mobile: modal takes full width with margin
- [ ] Desktop: modal is fixed width centered

DELIVERY:
Show before/after screenshots or provide detailed description of changes made.

Reply: "✅ Auth UI polished - ready to review"
