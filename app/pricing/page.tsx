'use client';

import Link from 'next/link';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                            <span className="font-bold text-lg tracking-tight">Persona AI</span>
                        </Link>
                        <Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Back to Chat
                        </Link>
                    </div>
                </div>
            </header>

            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Simple Pricing. <span className="text-[#FF9500]">No BS.</span></h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Invest in your decision making. Or don't. We're not your mom.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl p-8 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">The "Dabbler"</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">Free</span>
                                    <span className="text-zinc-500">/forever</span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-4">For those who like to window shop success.</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                                    <span className="text-zinc-300">10 Brutal Messages / Day</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                                    <span className="text-zinc-300">Access to Elon Persona Only</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                                    <span className="text-zinc-300">Standard Speed</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <X size={20} className="text-red-500/50 shrink-0 mt-0.5" />
                                    <span className="text-zinc-500 line-through">Sam Product & Naval Angel Personas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <X size={20} className="text-red-500/50 shrink-0 mt-0.5" />
                                    <span className="text-zinc-500 line-through">Deep Dive Reasoning</span>
                                </li>
                            </ul>

                            <Link href="/chat" className="block w-full py-4 text-center rounded-xl font-semibold border border-zinc-700 text-white hover:bg-zinc-800 transition-colors">
                                Stay Average
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-[#1A1A1A] border-2 border-[#FF9500] rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(255,149,0,0.1)]">
                            <div className="absolute top-0 right-0 bg-[#FF9500] text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                                MOST POPULAR
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">Founding Access</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">₹299</span>
                                    <span className="text-zinc-500">/month</span>
                                </div>
                                {/* <p className="text-[#FF9500] text-sm mt-4 font-medium">Cheaper than one bad decision.</p> */}
                                <p className="text-[#FF9500] text-sm mt-4 font-medium">Warning: May cause rapid career growth.</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Unlimited Brutal Truths</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Unlock ALL Personas (Sam, Naval)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Faster Response Times</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Priority Support (We actually reply)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
                                    <span className="text-white font-medium">Early Access to Voice Mode</span>
                                </li>
                            </ul>

                            <div className="text-center">
                                <Link href="/chat?upgrade=true" className="block w-full py-4 text-center rounded-xl font-bold bg-[#FF9500] text-black hover:bg-orange-500 transition-colors mb-3">
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
