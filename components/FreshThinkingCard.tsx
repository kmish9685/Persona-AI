"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

interface FreshThinkingCardProps {
    onClose?: () => void;
}

export function FreshThinkingCard({ onClose }: FreshThinkingCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if user has dismissed the card before
        const dismissed = localStorage.getItem('freshThinkingCardDismissed');
        if (dismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('freshThinkingCardDismissed', 'true');
        setIsVisible(false);
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full bg-[#1A1A1A] border border-[#FF9500]/30 rounded-xl p-5 md:p-6 mb-6 shadow-[0_0_20px_rgba(255,149,0,0.1)]"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-zinc-600 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Desktop Version */}
                    <div className="hidden md:block space-y-3">
                        {/* Title */}
                        <div className="flex items-center gap-2">
                            <Zap size={24} className="text-[#FF9500]" />
                            <h3 className="text-base font-bold text-white uppercase tracking-wide">
                                Fresh Thinking Mode
                            </h3>
                        </div>

                        {/* Body */}
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Decisions under uncertainty, stripped to reality.
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Every conversation starts clean. No chat history, no bias from past questions.
                            Just pure, context-free brutal honesty.
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Why? Insights are perishable. Yesterday's advice doesn't apply to today's decisions.
                        </p>

                        {/* Footer */}
                        <p className="text-xs text-zinc-600 uppercase tracking-widest font-medium pt-2 border-t border-white/5">
                            Simulated Reasoning • Not a Human
                        </p>
                    </div>

                    {/* Mobile Version */}
                    <div className="md:hidden space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap size={20} className="text-[#FF9500]" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                Fresh Thinking Mode
                            </h3>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            No saved chats. Every conversation is new.
                        </p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Insights are perishable.
                        </p>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium pt-1">
                            Simulated • Not a Human
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
