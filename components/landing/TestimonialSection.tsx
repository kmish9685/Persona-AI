'use client';

import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        quote: "I fired my co-founder after a 20-minute session with the Steve Jobs persona. It was brutal, but it was the right call. Saved my company.",
        author: "Tech Founder",
        role: "Seed Stage SaaS",
        metric: "Saved 6mo Runway"
    },
    {
        quote: "The Elon persona tore apart my unit economics. I realized I was scaling a loss. Pivoted to enterprise sales the next week.",
        author: "Growth Lead",
        role: "E-commerce Aggregator",
        metric: "+40% Margins"
    },
    {
        quote: "I stopped asking my friends for advice. They are too nice. This thing doesn't care about my feelings, only my success.",
        author: "Solopreneur",
        role: "Indie Hacker",
        metric: "Launched in 4 Days"
    }
];

export default function TestimonialSection() {
    return (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#080808] border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Wall of Truth.</h2>
                    <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">Real founders. Real breakthroughs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-zinc-900/40 p-8 rounded-3xl border border-white/5 relative hover:-translate-y-1 transition-transform duration-300">
                            <Quote className="absolute top-8 right-8 text-amber-500/10" size={40} />

                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-amber-500 fill-amber-500" />)}
                            </div>

                            <p className="text-zinc-300 italic mb-8 leading-relaxed relative z-10">
                                "{t.quote}"
                            </p>

                            <div className="mt-auto border-t border-white/5 pt-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-white font-bold text-sm">{t.author}</div>
                                        <div className="text-zinc-600 text-xs uppercase tracking-widest">{t.role}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded inline-block">
                                            {t.metric}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
