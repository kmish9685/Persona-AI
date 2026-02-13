'use client';

import { MessageSquare, User, Bot, Zap, X } from 'lucide-react';

export default function ChatDemoSection() {
    return (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <MessageSquare size={12} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Advisor Chat Mode</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Don't Chat. Consult.</h2>
                    <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">Standard bots agree with you. Advisors challenge you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* LEFT: Standard Chatbot */}
                    <div className="flex flex-col opacity-50 hover:opacity-100 transition-opacity duration-500">
                        <div className="text-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-600">Standard AI Chat</h3>
                        </div>
                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 font-sans text-sm h-full relative overflow-hidden">
                            {/* User Message */}
                            <div className="flex gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0"><User size={14} /></div>
                                <div className="bg-zinc-800 rounded-2xl rounded-tl-none p-4 text-zinc-300 max-w-[85%]">
                                    I'm worried my pricing is too high at $99. Should I lower it?
                                </div>
                            </div>

                            {/* Bot Message */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center shrink-0"><Bot size={14} className="text-blue-500" /></div>
                                <div className="bg-blue-900/10 border border-blue-500/10 rounded-2xl rounded-tr-none p-4 text-zinc-400 space-y-3">
                                    <p>Pricing is a difficult decision. There are pros and cons to lowering it.</p>
                                    <p>If you lower it, you might get more customers, but your margin will decrease. If you keep it high, you confirm premium value.</p>
                                    <p>Maybe you could try A/B testing or running a discount campaign to see what happens?</p>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4"><X className="text-red-500/50" /></div>
                        </div>
                    </div>

                    {/* RIGHT: Persona Advisor (Elon) */}
                    <div className="flex flex-col transform hover:scale-[1.02] transition-transform duration-500">
                        <div className="text-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Elon Persona</h3>
                        </div>
                        <div className="glass-panel border border-amber-500/30 rounded-3xl p-6 font-mono text-sm h-full shadow-2xl shadow-amber-500/5 relative overflow-hidden">
                            {/* User Message */}
                            <div className="flex gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0"><User size={14} /></div>
                                <div className="bg-zinc-800 rounded-2xl rounded-tl-none p-4 text-zinc-300 max-w-[85%]">
                                    I'm worried my pricing is too high at $99. Should I lower it?
                                </div>
                            </div>

                            {/* Bot Message */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img src="/personas/elon.jpg" className="w-full h-full object-cover opacity-80" alt="Elon" />
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl rounded-tr-none p-4 text-zinc-200">
                                    <p className="mb-2 font-bold text-amber-500 text-xs uppercase tracking-widest">Thinking from First Principles:</p>
                                    <p className="mb-3">Wrong question. The price is irrelevant if the value is infinite. </p>
                                    <p className="mb-3">If the product actually works, $99 is free. If it doesn't, $0 is too expensive.</p>
                                    <p className="font-bold text-white border-l-2 border-amber-500 pl-3">Fix the product, not the price.</p>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4"><Zap className="text-amber-500" size={20} /></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
