'use client';

import Link from 'next/link';
import { Check, X, ArrowLeft } from 'lucide-react';
import posthog from 'posthog-js';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute bottom-[20%] left-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg" />
                            <span className="font-bold text-lg tracking-tight text-white">Persona AI</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link href="/" className="hidden sm:inline-flex text-sm text-zinc-400 hover:text-white transition-colors items-center gap-2">
                                <ArrowLeft size={14} />
                                Back
                            </Link>
                            {/* Glass Button */}
                            <Link href="/chat" className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md">
                                Start now
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">Simple Pricing. <span className="text-zinc-500">No BS.</span></h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Invest in your decision making. Or don't. We're not your mom.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/10 transition-colors">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-zinc-400 mb-4 uppercase tracking-widest">The "Dabbler"</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white">Free</span>
                                    <span className="text-zinc-500 text-lg">/forever</span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-6">For those who like to window shop success.</p>
                            </div>

                            <ul className="space-y-5 mb-10 flex-1">
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white/5 text-white"><Check size={14} /></div>
                                    <span className="text-zinc-300">10 Brutal Messages / Day</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white/5 text-white"><Check size={14} /></div>
                                    <span className="text-zinc-300">Access to Elon Persona Only</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white/5 text-white"><Check size={14} /></div>
                                    <span className="text-zinc-300">Standard Speed</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <div className="p-1 rounded-full bg-red-500/10 text-red-500"><X size={14} /></div>
                                    <span className="text-zinc-500">Sam Product & Naval Angel Personas</span>
                                </li>
                            </ul>

                            <Link href="/chat" className="block w-full py-4 text-center rounded-xl font-medium border border-white/10 text-white hover:bg-white/5 transition-colors">
                                Stay Average
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                            <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                                Most Popular
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">Founding Access</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white">₹99</span>
                                    <span className="text-zinc-500 text-lg">/month</span>
                                </div>
                                <p className="text-white text-sm mt-6 font-medium">Warning: May cause rapid career growth.</p>
                            </div>

                            <ul className="space-y-5 mb-10 flex-1">
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white text-black"><Check size={14} /></div>
                                    <span className="text-white font-medium">Unlimited Brutal Truths</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white text-black"><Check size={14} /></div>
                                    <span className="text-white font-medium">Unlock ALL Personas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white text-black"><Check size={14} /></div>
                                    <span className="text-white font-medium">Faster Response Times</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="p-1 rounded-full bg-white text-black"><Check size={14} /></div>
                                    <span className="text-white font-medium">Priority Support</span>
                                </li>
                            </ul>

                            <div className="text-center">
                                <Link
                                    href="/chat?upgrade=true"
                                    onClick={() => posthog.capture('checkout_started', { plan: 'founding_99' })}
                                    className="block w-full py-4 text-center rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-colors mb-4 shadow-lg shadow-white/10"
                                >
                                    Get Serious
                                </Link>
                                <p className="text-xs text-zinc-500">Cancel anytime. No lock-in.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
