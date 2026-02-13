'use client';

import { PERSONAS } from '@/lib/personas';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BoardSection() {
    return (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#080808] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Brain size={12} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">The Team</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase text-white">
                        Your Personal <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Board of Directors.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Don't just chat. Consult. Each persona is engineered to attack your problem from a specific, high-leverage angle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PERSONAS.map((persona) => (
                        <div key={persona.id} className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 hover:from-amber-500/20 hover:to-amber-500/0 transition-all duration-500">
                            <div className="absolute inset-0 bg-zinc-900/90 rounded-[22px] m-[1px]" />
                            <div className="relative p-6 flex items-start gap-5 h-full">
                                {/* Image / Avatar */}
                                <div className="shrink-0 relative">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 group-hover:border-amber-500/50 transition-colors">
                                        <img
                                            src={persona.image}
                                            alt={persona.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white group-hover:text-amber-500 transition-colors">
                                        {persona.name.charAt(0)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">{persona.name}</h3>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">{persona.tagline}</div>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                        {persona.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/personas" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest group">
                        Meet the full board <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
