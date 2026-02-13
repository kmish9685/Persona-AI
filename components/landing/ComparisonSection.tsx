'use client';

import { Check, X, Zap } from 'lucide-react';

export default function ComparisonSection() {
    return (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black overflow-hidden border-b border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Show, Don't Tell.</h2>
                    <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">The difference between a chat and a verdict.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Generic Output */}
                    <div className="flex flex-col opacity-60 hover:opacity-100 transition-opacity duration-500">
                        <div className="mb-4 text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-800"></div> Generic AI Output
                        </div>
                        <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-zinc-500 font-serif leading-relaxed italic relative">
                            <div className="absolute top-4 right-4 text-zinc-700/20"><X size={24} /></div>
                            "Deciding whether to pivot is a complex choice that depends on many factors. You should consider your market fit, runway, and team morale. On one hand, staying the course shows grit. On the other hand, pivoting might reveal new opportunities. Perhaps you could try a hybrid approach for a few weeks and reassess..."
                        </div>
                    </div>

                    {/* Persona AI Output */}
                    <div className="flex flex-col transform hover:scale-[1.02] transition-transform duration-500">
                        <div className="mb-4 text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> Persona AI Engine Output
                        </div>
                        <div className="flex-1 glass-panel border border-amber-500/20 rounded-2xl p-8 font-mono text-sm shadow-2xl shadow-amber-500/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-amber-500/20"><Zap size={40} /></div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-zinc-400">VERDICT:</span>
                                    <span className="text-green-500 font-black text-lg">PIVOT NOW</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-zinc-400">CONVICTION:</span>
                                    <span className="text-white font-black text-lg">84%</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block mb-2 uppercase text-[10px] tracking-widest">Kill Signals Triggered:</span>
                                    <ul className="space-y-3">
                                        <li className="text-red-400/90 pl-3 border-l-2 border-red-500/50 flex items-center justify-between">
                                            <span>CAC &gt; $50 in first 48h</span>
                                            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">CRITICAL</span>
                                        </li>
                                        <li className="text-red-400/90 pl-3 border-l-2 border-red-500/50 flex items-center justify-between">
                                            <span>Retention &lt; 20% by week 2</span>
                                            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">WARNING</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span className="text-amber-500 block mb-1 uppercase text-[10px] tracking-widest font-bold">Action Plan:</span>
                                    <p className="text-zinc-200 leading-relaxed">
                                        Kill "Option A" immediately. You are burning cash on a dead end. Launch MVP-B by Friday 5PM.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
