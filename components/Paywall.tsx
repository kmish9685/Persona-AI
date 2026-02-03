"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Zap, Check } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function Paywall({ onClose, onSuccess }: PaywallProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Manual Location State
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [country, setCountry] = useState<string>('IN');
    const [name, setName] = useState('');

    // Derived state
    const isIndia = country === 'IN';

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
            // Redirect to Auth0 login instead of showing deleted modal
            window.location.href = "/api/auth/login?returnTo=/chat";
            return;
        }

        setLoading(true);
        try {
            console.log("Creating Razorpay Order...");
            // 1. Create Order via Next.js API route
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const error = await res.text();
                console.error("Razorpay Order API Error:", error);
                throw new Error(`Failed to create order: ${error}`);
            }

            const order = await res.json();
            console.log("Razorpay Order Created:", order);

            // 2. Check if Razorpay is loaded
            if (!(window as any).Razorpay) {
                throw new Error('Razorpay SDK not loaded. Please refresh and try again.');
            }

            // 3. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure correct key var
                amount: order.amount,
                currency: order.currency,
                name: "Persona AI",
                description: "Founding Access - Unlimited Messages",
                order_id: order.id,
                handler: function (_response: any) {
                    onSuccess();
                },
                prefill: {
                    name: name || user.email, // Use manual name if available
                    email: user.email,
                    contact: ""
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

    async function handlePolarCheckout() {
        if (!user) {
            window.location.href = "/api/auth/login?returnTo=/chat";
            return;
        }

        setLoading(true);
        // Direct Link Strategy (Fixes 404)
        const polarLink = "https://buy.polar.sh/polar_cl_yRdwa0cqXG8R7odwLf0MlAat2L4xjIgmmtF1S0u8ayb";
        // Pre-fill email
        const targetUrl = user.email
            ? `${polarLink}?email=${encodeURIComponent(user.email)}`
            : polarLink;

        console.log("Redirecting to Polar Direct Link:", targetUrl);
        window.location.href = targetUrl;
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-10"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="text-center mb-6 md:mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                                <Zap size={28} className="text-amber-500 fill-amber-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                                Founding Access
                            </h2>
                            <p className="text-zinc-400 text-sm">
                                Unlimited access to first-principles reasoning
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
                                        <option value="UK">United Kingdom (£ GBP)</option>
                                        <option value="EU">Europe (€ EUR)</option>
                                        <option value="OTHER">Rest of World ($ USD)</option>
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
                                {/* Plan Card */}
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
                                                {isIndia ? '₹299' : '$6.70'}
                                            </p>
                                            <p className="text-xs text-zinc-500">per month</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 my-4 border-t border-white/5 pt-4">
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            Unlimited messages
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-white">
                                            <Check size={16} className="text-amber-500" />
                                            Priority latency
                                        </li>
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={isIndia ? handleRazorpayUpgrade : handlePolarCheckout}
                                    disabled={loading}
                                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Zap size={18} className="fill-black/50" />
                                            Pay with {isIndia ? 'Razorpay' : 'Polar'}
                                        </>
                                    )}
                                </button>

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
