"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Zap, Check } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { LoginModal } from '../src/components/auth/LoginModal';
import { SignupModal } from '../src/components/auth/SignupModal';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function Paywall({ onClose, onSuccess }: PaywallProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        if (user) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [user]);

    async function handleRazorpayUpgrade() {
        if (!user) {
            setShowLogin(true);
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order via Next.js API route
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(`Failed to create order: ${error}`);
            }

            const order = await res.json();

            // 2. Check if Razorpay is loaded
            if (!(window as any).Razorpay) {
                throw new Error('Razorpay SDK not loaded. Please refresh and try again.');
            }

            // 3. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SAOD6SpRnXBDEb',
                amount: order.amount,
                currency: order.currency,
                name: "Persona AI",
                description: "Founding Access - Unlimited Messages",
                order_id: order.id,
                handler: function (_response: any) {
                    onSuccess();
                },
                prefill: {
                    email: user.email
                },
                theme: {
                    color: "#F59E0B"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (e: any) {
            console.error('Razorpay error:', e);
            alert(`Payment failed: ${e.message}`);
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog open={true} onClose={onClose} className="relative z-50">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel
                        className="relative w-full max-w-2xl bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-10"
                        >
                            <X size={20} className="text-zinc-400" />
                        </button>

                        {/* Content */}
                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                                    <Zap size={32} className="text-amber-500 fill-amber-500" />
                                </div>
                                <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                                    Founding Access
                                </h2>
                                <p className="text-zinc-400 text-sm">
                                    Unlimited access to first-principles reasoning
                                </p>
                            </div>

                            {/* Authentication Required Message */}
                            {!user && (
                                <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-sm text-blue-400 text-center">
                                        Please sign in or create an account to upgrade
                                    </p>
                                </div>
                            )}

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {/* Free Plan */}
                                <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <h3 className="text-lg font-medium text-white mb-2">Free</h3>
                                    <p className="text-3xl font-light text-white mb-4">₹0</p>
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Check size={16} className="text-zinc-600" />
                                            10 messages/day
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Check size={16} className="text-zinc-600" />
                                            Basic access
                                        </li>
                                    </ul>
                                </div>

                                {/* Founding Access Plan */}
                                <div className="p-6 rounded-xl border-2 border-amber-500/50 bg-amber-500/5 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-medium rounded-full">
                                        FOUNDING MEMBERS
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">Founding Access</h3>
                                    <p className="text-xs text-amber-400/80 mb-3">Lock this price permanently</p>
                                    <p className="text-3xl font-light text-white mb-1">₹299</p>
                                    <p className="text-xs text-zinc-500 mb-1">per month</p>
                                    <p className="text-[11px] text-zinc-600 mb-4 italic">Early users keep this price. It will increase later.</p>
                                    <ul className="space-y-2 mb-4">
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            Unlimited messages
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            Priority latency
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            First-principles tuning
                                        </li>
                                    </ul>
                                    <p className="text-[10px] text-zinc-600 mt-3 border-t border-white/5 pt-3">
                                        Founding users keep this price permanently.
                                    </p>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleRazorpayUpgrade}
                                disabled={loading}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : user ? (
                                    <>
                                        <Zap size={18} className="fill-black/50" />
                                        Claim Founding Access — ₹299/month
                                    </>
                                ) : (
                                    <>Sign In to Upgrade</>
                                )}
                            </button>

                            {/* Footer Note */}
                            <p className="text-center text-xs text-zinc-600 mt-4">
                                Secure payment via Razorpay • Indian users only
                            </p>
                            <p className="text-center text-xs text-zinc-500 mt-2">
                                International payments coming soon
                            </p>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Auth Modals */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
            />
            <SignupModal
                isOpen={showSignup}
                onClose={() => setShowSignup(false)}
                onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
            />
        </>
    );
}

/* ============================================
   GUMROAD INTEGRATION - FROZEN FOR LAUNCH
   ============================================
   
   The following code is commented out to simplify
   the payment flow for launch. Gumroad will be
   reactivated post-PMF when international payments
   are needed.
   
   To reactivate:
   1. Uncomment country detection logic
   2. Uncomment Gumroad payment handler
   3. Uncomment country selector UI
   4. Update backend to enable Gumroad endpoints
   5. Test end-to-end flow
   
   ============================================ */

/*
// Country detection state
const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'gumroad'>('razorpay');
const [country, setCountry] = useState<string | null>(null);
const [showCountrySelector, setShowCountrySelector] = useState(false);
const [manualCountry, setManualCountry] = useState<'india' | 'international' | null>(null);

// Detect country when user is authenticated
useEffect(() => {
    if (user) {
        detectCountry();
    }
}, [user]);

async function detectCountry() {
    try {
        const res = await fetch('/api/detect-country');
        if (!res.ok) throw new Error('Detection failed');
        
        const data = await res.json();
        setCountry(data.country);
        setPaymentProvider(data.payment_provider);
    } catch (e) {
        console.error('Country detection failed:', e);
        setPaymentProvider('razorpay');
        setCountry(null);
    }
}

function handleGumroadUpgrade() {
    if (!user) {
        setShowLogin(true);
        return;
    }

    const gumroadUrl = `https://growthkuldeep.gumroad.com/l/persona-ai?wanted=true&email=${encodeURIComponent(user.email)}`;
    window.location.href = gumroadUrl;
}

// Country selector UI
{user && (
    <div className="mb-6 flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">
                {manualCountry ? 'Selected:' : 'Detected:'}
            </span>
            <span className="text-sm font-medium text-white">
                {isIndia ? '🇮🇳 India' : '🌍 International'}
            </span>
        </div>
        <button
            onClick={() => setShowCountrySelector(!showCountrySelector)}
            className="px-4 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
        >
            Change
        </button>
    </div>
)}
*/
