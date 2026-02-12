'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BrainCircuit, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReasoningAccordionProps {
    reasoning: string;
    compact?: boolean;
    isPremium?: boolean;
    onUnlock?: () => void;
}

export function ReasoningAccordion({ reasoning, compact = false, isPremium = true, onUnlock }: ReasoningAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!reasoning) return null;

    const handleToggle = () => {
        if (!isPremium && onUnlock) {
            onUnlock();
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`w-full mt-2 ${compact ? 'mb-2' : 'mb-4'}`}>
            <button
                onClick={handleToggle}
                className={`flex items-center gap-2 text-xs font-medium transition-colors ${compact ? 'w-full justify-between' : ''} ${!isPremium ? 'text-amber-500 hover:text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <div className="flex items-center gap-2">
                    {!isPremium ? <Lock size={14} /> : <BrainCircuit size={14} className={isOpen ? "text-orange-500" : ""} />}
                    <span>{isPremium ? (isOpen ? "Hide Reasoning" : "View Reasoning Analysis") : "Unlock Reasoning Analysis"}</span>
                </div>
                {isPremium && (isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>

            <AnimatePresence>
                {isOpen && isPremium && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className={`mt-2 p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 text-xs font-mono leading-relaxed whitespace-pre-wrap ${compact ? 'max-h-40 overflow-y-auto custom-scrollbar' : ''}`}>
                            {reasoning}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
