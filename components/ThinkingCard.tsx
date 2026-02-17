import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { getPersonaById } from '@/lib/personas';

interface ThinkingCardProps {
    content: string;
    personaId: string;
    isExpanded?: boolean;
}

export function ThinkingCard({ content, personaId, isExpanded = true }: ThinkingCardProps) {
    const [expanded, setExpanded] = useState(isExpanded);
    const persona = getPersonaById(personaId);

    // Parse header and body
    // The prompt output format is: "THINKING FROM ...:\n[Step 1]..."
    // We want to extract that first line if it looks like a header.
    const lines = content.split('\n');
    let header = `THINKING FROM ${persona.name.toUpperCase()}`;
    let body = content;

    if (lines[0].toUpperCase().startsWith('THINKING')) {
        header = lines[0].replace(':', '');
        body = lines.slice(1).join('\n').trim();
    }

    // Persona-specific accent colors (can expand this later)
    const accentColor = "#5e6ad2"; // Default Indigo/Purple for "Intelligence"

    return (
        <div className="w-full my-2">
            <div
                className={clsx(
                    "rounded-xl overflow-hidden border transition-all duration-300",
                    expanded
                        ? "bg-[#0F0F10] border-indigo-500/30 shadow-[0_0_15px_rgba(94,106,210,0.1)]"
                        : "bg-[#0F0F10] border-white/5 hover:border-white/10"
                )}
            >
                {/* Header / Toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between px-4 py-3 group"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={clsx(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            expanded ? "bg-indigo-400" : "bg-gray-600"
                        )} />
                        <span className="font-display text-[11px] uppercase tracking-[0.15em] font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                            {header}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {expanded ? 'COLLAPSE' : 'EXPAND'}
                        </span>
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <div className="px-4 pb-4 overflow-hidden">
                                <div className="pl-4 border-l border-white/10 ml-0.5">
                                    <div className="font-mono text-[12px] leading-relaxed text-gray-400 whitespace-pre-wrap">
                                        {body || <span className="italic text-gray-600">Analyzing...</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
