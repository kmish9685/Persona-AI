'use client';

import { useState } from 'react';
import { Brain, Heart, HelpCircle, CheckCircle } from 'lucide-react';

export interface GutReaction {
    feeling: 'relieved' | 'disappointed' | 'confused' | 'validated';
    alignment: 'agrees' | 'disagrees' | 'neutral';
    confidence: number;
    notes?: string;
}

interface GutCheckModalProps {
    verdict: string;
    onComplete: (reaction: GutReaction) => void;
    onSkip: () => void;
}

export default function GutCheckModal({ verdict, onComplete, onSkip }: GutCheckModalProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [showInsight, setShowInsight] = useState(false);

    const feelings = [
        {
            id: 'relieved',
            label: 'Relieved',
            icon: '😌',
            description: 'You wanted this answer'
        },
        {
            id: 'disappointed',
            label: 'Disappointed',
            icon: '😞',
            description: 'You wanted the opposite'
        },
        {
            id: 'confused',
            label: 'Confused',
            icon: '😕',
            description: 'Still unclear'
        },
        {
            id: 'validated',
            label: 'Validated',
            icon: '✓',
            description: 'Confirms what you knew'
        }
    ];

    const getInsight = (feeling: string, verdict: string): { message: string; alignment: 'agrees' | 'disagrees' | 'neutral' } => {
        const isPositiveVerdict = verdict.toLowerCase().includes('yes') || verdict.toLowerCase().includes('go') || verdict.toLowerCase().includes('do it');

        if (feeling === 'disappointed') {
            return {
                message: isPositiveVerdict
                    ? "Your gut disagrees with AI. Deep down, you might actually want NO."
                    : "Your gut disagrees with AI. Deep down, you might actually want YES.",
                alignment: 'disagrees'
            };
        }

        if (feeling === 'relieved') {
            return {
                message: "Your gut agrees with the analysis. This is probably the right call.",
                alignment: 'agrees'
            };
        }

        if (feeling === 'validated') {
            return {
                message: "You already knew the answer. The AI just gave you permission to act on it.",
                alignment: 'agrees'
            };
        }

        return {
            message: "Still uncertain? Try the 5-year visualization exercise. Often clarifies things faster than more analysis.",
            alignment: 'neutral'
        };
    };

    const handleSelect = (feelingId: string) => {
        setSelected(feelingId);
        setShowInsight(true);

        const insight = getInsight(feelingId, verdict);

        // Auto-complete after showing insight
        setTimeout(() => {
            onComplete({
                feeling: feelingId as any,
                alignment: insight.alignment,
                confidence: feelingId === 'confused' ? 30 : 70,
            });
        }, 3000);
    };

    if (showInsight && selected) {
        const insight = getInsight(selected, verdict);

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-[#5e6ad2]/30 rounded-2xl p-8 max-w-lg w-full animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#5e6ad2]/20 flex items-center justify-center">
                            <Heart className="text-[#5e6ad2]" size={24} />
                        </div>
                        <h3 className="text-2xl font-light text-white">Gut Check Result</h3>
                    </div>

                    <div className={`p-6 rounded-xl mb-6 ${insight.alignment === 'agrees' ? 'bg-green-500/10 border border-green-500/30' :
                            insight.alignment === 'disagrees' ? 'bg-red-500/10 border border-red-500/30' :
                                'bg-[#5e6ad2]/10 border border-[#5e6ad2]/30'
                        }`}>
                        <p className="text-lg text-white leading-relaxed">
                            {insight.message}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-zinc-500 text-sm animate-pulse">Processing your gut reaction...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 max-w-lg w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#5e6ad2]/20 flex items-center justify-center">
                        <Brain className="text-[#5e6ad2]" size={24} />
                    </div>
                    <h3 className="text-2xl font-light text-white">Gut Check</h3>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-zinc-400 text-sm mb-2">AI says:</p>
                    <p className="text-white font-medium">{verdict}</p>
                </div>

                <p className="text-zinc-300 mb-6">How do you FEEL about this verdict?</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {feelings.map((feeling) => (
                        <button
                            key={feeling.id}
                            onClick={() => handleSelect(feeling.id)}
                            className="group p-4 bg-white/5 hover:bg-[#5e6ad2]/10 border border-white/10 hover:border-[#5e6ad2]/30 rounded-xl transition-all text-left"
                        >
                            <div className="text-3xl mb-2">{feeling.icon}</div>
                            <div className="text-white font-medium mb-1 group-hover:text-[#5e6ad2] transition-colors">
                                {feeling.label}
                            </div>
                            <div className="text-zinc-500 text-xs">{feeling.description}</div>
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <p className="text-xs text-zinc-600">Your reaction often reveals the real answer</p>
                    <button
                        onClick={onSkip}
                        className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}

