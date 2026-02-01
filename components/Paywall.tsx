"use client";

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Check, Zap, X, ShieldCheck } from 'lucide-react';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function Paywall({ onClose, onSuccess }: PaywallProps) {
    const [loading, setLoading] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    async function handleUpgrade() {
        setLoading(true);
        try {
            // 1. Create Order
            const res = await fetch('/api/payments/create-order', { method: 'POST' });
            if (!res.ok) throw new Error("Failed to create order");
            const order = await res.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SAOD6SpRnXBDEb', // Fallback or env
                amount: order.amount,
                currency: order.currency,
                name: "Persona AI",
                description: "Pro Upgrade - Unlimited Access",
                order_id: order.id,
                handler: function (_response: any) {
                    // 3. On Success (In MVP, we trust callback. In Prod, verify webhook)
                    onSuccess();
                },
                prefill: {
                    email: "user@example.com"
                },
                theme: {
                    color: "#F59E0B" // Amber-500
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (e) {
            console.error(e);
            alert("Payment failed to initialize.");
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className="w-full max-w-lg rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="p-8"
                    >
                        {/* Background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex justify-between items-start mb-6 relative">
                            <div>
                                <Dialog.Title className="text-2xl font-semibold text-white">
                                    Decode Reality. Unlimited.
                                </Dialog.Title>
                                <Dialog.Description className="text-zinc-400 mt-1 text-sm">
                                    Break the daily constraints. Access the full stream of consciousness.
                                </Dialog.Description>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative">
                            {/* Free Plan */}
                            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] transition-colors duration-200 hover:bg-white/[0.04]">
                                <h3 className="text-zinc-400 font-medium mb-1">Free</h3>
                                <div className="text-2xl font-bold text-zinc-100 mb-4">
                                    ₹0 <span className="text-xs font-normal text-zinc-600">/ forever</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                                        <Check size={14} className="text-zinc-600" />
                                        <span>10 messages / day</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                                        <Check size={14} className="text-zinc-600" />
                                        <span>Basic reasoning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Pro Plan */}
                            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 relative ring-1 ring-amber-500/20 transition-all duration-200 hover:ring-amber-500/40 hover:bg-amber-500/10">
                                <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                    RECOMMENDED
                                </div>
                                <h3 className="text-amber-200 font-medium mb-1 flex items-center gap-2">
                                    <Zap size={14} className="fill-amber-200" /> Pro
                                </h3>
                                <div className="text-2xl font-bold text-white mb-4">
                                    ₹299 <span className="text-xs font-normal text-zinc-500">/ month</span>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-white">
                                        <Check size={14} className="text-amber-400" />
                                        <span>Unlimited Messages</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-white">
                                        <Check size={14} className="text-amber-400" />
                                        <span>Priority Latency</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-white">
                                        <Check size={14} className="text-amber-400" />
                                        <span>First-Principles Tuning</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Connecting to Secure Gateway...</span>
                            ) : (
                                <>
                                    <span>Upgrade Access</span>
                                    <Zap size={16} className="fill-black/50" />
                                </>
                            )}
                        </button>

                        {/* Trust Footer */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
                            <ShieldCheck size={12} />
                            <span>Secured by Razorpay. Cancel anytime.</span>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
