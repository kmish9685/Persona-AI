"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Zap, Check } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function Paywall({ onClose, onSuccess }: PaywallProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // Manual Location State
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [country, setCountry] = useState<string>('IN');
    const [name, setName] = useState('');

    // Derived state
    const isIndia = country === 'IN';

    // 1. Load Razorpay Script
    useEffect(() => {
        if (user && isIndia) {
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
    }, [user, isIndia]);

    // 2. Load Polar Script (Global Embed) - REMOVED: Using Hosted Checkout SDK Flow

    const { openSignIn } = useClerk(); // Ensure this hook is imported

    async function handleRazorpayUpgrade() {
        if (!user) {
            openSignIn({
                afterSignInUrl: '/chat?upgrade=true',
                afterSignUpUrl: '/chat?upgrade=true',
                redirectUrl: '/chat?upgrade=true' // covering bases
            });
            return;
        }

        setLoading(true);
        try {
            console.log("Creating Razorpay Order...");
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.detail || errorJson.error || errorText;
                } catch (e) { }

                throw new Error(errorMessage || 'Failed to create subscription');
            }

            const data = await res.json();
            console.log("Subscription created:", data);

            const rzpKey = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!rzpKey) {
                alert("Configuration Error: Razorpay Key ID is missing.");
                setLoading(false);
                return;
            }

            if (!(window as any).Razorpay) {
                alert('Razorpay SDK failed to load. Please check your connection.');
                setLoading(false);
                return;
            }

            const options = {
                key: rzpKey,
                subscription_id: data.subscription_id, // Recurring
                name: "Persona AI",
                description: "Founding Membership (Monthly)",
                // Removed amount/currency/order_id as per Subscription flow
                handler: function (_response: any) {
                    onSuccess();
                },
                prefill: {
                    name: name || user.primaryEmailAddress?.emailAddress,
                    email: user.primaryEmailAddress?.emailAddress,
                },
                theme: { color: "#F59E0B" },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                console.error("Payment Failed", response.error);
                alert("Payment Failed: " + response.error.reason);
                setLoading(false);
            });

        } catch (e: any) {
            console.error('Razorpay Error:', e);
            alert(`Error: ${e.message}`);
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-10"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-6 md:mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                                <Zap size={28} className="text-amber-500 fill-amber-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                                Feed the Silicon Brains 🧠
                            </h2>
                            <p className="text-zinc-400 text-sm">
                                High-IQ inferences are expensive. The GPU hamsters need premium electricity to keep roasting you.
                            </p>
                        </div>

                        {step === 'details' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Elon Musk"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Country</label>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="IN">India (₹ INR)</option>
                                        <option value="US">United States ($ USD)</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setStep('payment')}
                                    disabled={!name.trim()}
                                    className="w-full py-3.5 mt-2 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 rounded-xl border-2 border-amber-500/50 bg-amber-500/5 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-medium rounded-full">
                                        FOUNDING MEMBERS
                                    </div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Founding Access</h3>
                                            <p className="text-xs text-amber-400/80">Lock this price permanently</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-light text-white">
                                                {isIndia ? '₹99' : '$6.70'}
                                            </p>
                                            <p className="text-xs text-zinc-500">per month</p>
                                            <p className="text-[10px] text-red-500/80 mt-1 font-medium tracking-wide uppercase">Non-refundable</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2 my-4 border-t border-white/5 pt-4">
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            Unlimited messages
                                        </li>
                                    </ul>
                                    <p className="text-[10px] text-zinc-600 text-center mt-3">
                                        By subscribing, you agree to our <a href="/refund" target="_blank" className="underline hover:text-zinc-400">No Refund Policy</a>.
                                    </p>
                                </div>

                                {isIndia ? (
                                    <button
                                        onClick={handleRazorpayUpgrade}
                                        disabled={loading}
                                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                <Zap size={18} className="fill-black/50" />
                                                Pay with Razorpay
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <a
                                        href={`/api/polar/checkout?products=466c9b89-a140-4718-a180-fd06f3b33135&customerEmail=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`}
                                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center no-underline"
                                    >
                                        <Zap size={18} className="fill-black/50" />
                                        Pay with Polar (Hosted)
                                    </a>
                                )}

                                <button
                                    onClick={() => setStep('details')}
                                    className="w-full text-xs text-zinc-500 hover:text-white transition-colors"
                                >
                                    Back to details
                                </button>
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
