"use client";

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Lock, Check, Zap, Brain, Sparkles, Hexagon } from 'lucide-react';
import clsx from 'clsx';

interface PersonaModalProps {
    onClose: () => void;
}

export function PersonaModal({ onClose }: PersonaModalProps) {
    
    const personas = [
        {
            id: 'first-principles',
            name: 'First-Principles Advisor',
            desc: 'Physics-based reasoning. Brutal honesty.',
            icon: Zap,
            active: true,
            locked: false
        },
        {
            id: 'creative',
            name: 'Lateral Thinker',
            desc: 'Non-linear connections & abstractions.',
            icon: Sparkles,
            active: false,
            locked: true
        },
        {
            id: 'analyst',
            name: 'Quantitative Analyst',
            desc: 'Data-driven probability mapping.',
            icon: Hexagon,
            active: false,
            locked: true
        },
        {
            id: 'devil',
            name: 'Strategic Antagonist',
            desc: 'Stress-testing via counter-arguments.',
            icon: Brain,
            active: false,
            locked: true
        }
    ];

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel 
                    className="w-full max-w-md rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <Dialog.Title className="text-lg font-medium text-white tracking-wide">
                                Select Persona
                            </Dialog.Title>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {personas.map((p) => (
                                <div 
                                    key={p.id}
                                    className={clsx(
                                        "relative p-4 rounded-xl border transition-all duration-200",
                                        p.active 
                                            ? "bg-white/5 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                                            : "bg-transparent border-white/5 opacity-60"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={clsx(
                                            "p-2 rounded-lg",
                                            p.active ? "bg-amber-500/10 text-amber-500" : "bg-white/5 text-zinc-500"
                                        )}>
                                            <p.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className={clsx(
                                                    "font-medium text-sm",
                                                    p.active ? "text-white" : "text-zinc-400"
                                                )}>{p.name}</h3>
                                                {p.active && <Check size={16} className="text-amber-500" />}
                                                {p.locked && <Lock size={14} className="text-zinc-600" />}
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1">{p.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Elite "Locked" Message */}
                            <div className="pt-4 mt-2 border-t border-white/5 text-center">
                                <p className="text-xs text-zinc-500 italic">
                                    "Depth over novelty. Master the First-Principles framework before expanding your toolkit."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
