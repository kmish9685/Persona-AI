'use client';

import { X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FreshThinkingCard() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const dismissed = localStorage.getItem('freshThinkingDismissed');
        if (dismissed) {
            setIsVisible(false);
        }
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        localStorage.setItem('freshThinkingDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="mx-4 my-4 bg-[#1A1A1A] border border-[#FF9500] rounded-xl p-4 md:p-5 shadow-[0_0_20px_rgba(255,149,0,0.1)] relative animate-fade-in">
            <button
                onClick={dismiss}
                className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-[#FF9500] fill-[#FF9500]" />
                <h3 className="text-[16px] font-bold text-white tracking-wide">FRESH THINKING MODE</h3>
            </div>

            <p className="text-[14px] leading-[1.6] text-zinc-300 mb-4 font-medium">
                Decisions under uncertainty, stripped to reality.
            </p>

            <div className="text-[14px] leading-[1.6] text-zinc-400 space-y-3">
                <p>
                    Every conversation starts clean. No chat history, no bias from past questions. Just pure, context-free brutal honesty.
                </p>
                <p>
                    Why? Insights are perishable. Yesterday's advice doesn't apply to today's decisions.
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[12px] uppercase font-bold tracking-widest text-[#6B7280]">
                    Simulated Reasoning • Not a Human
                </p>
            </div>
        </div>
    );
}
