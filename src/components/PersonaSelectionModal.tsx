'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Lock, Check, Brain, Shield, TrendingUp, Cpu } from 'lucide-react';
import clsx from 'clsx';

interface PersonaSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PersonaSelectionModal({ isOpen, onClose }: PersonaSelectionModalProps) {
    const personas = [
        {
            id: 'elon',
            name: 'Elon Musk',
            role: 'Visionary Builder',
            desc: 'First-principles. Brutal clarity.',
            icon: Brain,
            locked: false,
            color: 'text-[#5e6ad2]',
            bg: 'bg-[#5e6ad2]/10',
            border: 'border-[#5e6ad2]/20'
        },
        {
            id: 'zuck',
            name: 'Mark Zuckerberg',
            role: 'Product & Platforms',
            desc: 'Systems. Scale. Leverage.',
            icon: Cpu,
            locked: true,
            color: 'text-blue-500',
            bg: 'bg-zinc-800/50',
            border: 'border-zinc-800'
        },
        {
            id: 'thiel',
            name: 'Peter Thiel',
            role: 'Contrarian Investor',
            desc: 'Zero to One. Monopoly power.',
            icon: TrendingUp,
            locked: true,
            color: 'text-purple-500',
            bg: 'bg-zinc-800/50',
            border: 'border-zinc-800'
        },
        {
            id: 'coming_soon',
            name: 'More Coming Soon',
            role: 'Additional Perspectives',
            desc: 'New mental frameworks unlocking soon.',
            icon: Shield,
            locked: true,
            color: 'text-zinc-500',
            bg: 'bg-zinc-900/50',
            border: 'border-zinc-800 dashed'
        }
    ];

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-4xl bg-transparent">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl p-6 md:p-8 relative overflow-hidden"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Title */}
                        <div className="mb-10 text-center md:text-left">
                            <Dialog.Title className="text-2xl font-bold text-white tracking-tight">
                                Select a Personality
                            </Dialog.Title>
                            <p className="text-zinc-400 mt-2 text-sm font-medium">
                                Choose a synthetic perspective to analyze your queries.
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {personas.map((persona) => (
                                <div
                                    key={persona.id}
                                    className={clsx(
                                        "relative group rounded-xl p-5 border transition-all duration-300",
                                        persona.locked
                                            ? `${persona.bg} ${persona.border} opacity-70 cursor-not-allowed`
                                            : "bg-[#18181b] border-[#5e6ad2]/40 shadow-[0_0_15px_rgba(94,106,210,0.1)] cursor-default ring-1 ring-[#5e6ad2]/20"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={clsx("p-2 rounded-lg", persona.locked ? "bg-zinc-900" : "bg-[#5e6ad2]/10")}>
                                            <persona.icon size={20} className={clsx(persona.locked ? "text-zinc-600" : persona.color)} />
                                        </div>
                                        {persona.locked ? (
                                            <Lock size={16} className="text-zinc-600 mt-1" />
                                        ) : (
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className={clsx("text-lg font-bold mb-1", persona.locked ? "text-zinc-500" : "text-white")}>
                                            {persona.name}
                                        </h3>
                                        <div className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider mb-3 bg-white/5 text-zinc-400 border border-white/5">
                                            {persona.role}
                                        </div>
                                        <p className={clsx("text-sm", persona.locked ? "text-zinc-600" : "text-zinc-300")}>
                                            {persona.desc}
                                        </p>
                                    </div>

                                    {!persona.locked && (
                                        <div className="absolute inset-0 border-2 border-[#5e6ad2]/20 rounded-xl pointer-events-none" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Message */}
                        <div className="mt-10 text-center border-t border-white/5 pt-6">
                            <p className="text-[#5e6ad2]/80 text-sm font-medium tracking-wide">
                                <span className="mr-2">✨</span>
                                Finish extracting value from Elon first. Wisdom compounds.
                                <span className="ml-2">✨</span>
                            </p>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

