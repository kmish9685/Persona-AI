'use client';

import { useState } from 'react';
import { Target, TrendingUp, Zap, Users, Clock } from 'lucide-react';

export interface ValuesProfile {
    optimizing_for: string[];
    tradeoff_preferences: {
        certainty_vs_upside: number;
        speed_vs_quality: number;
        solo_vs_team: number;
    };
    deal_breakers: string[];
}

interface ValuesQuizProps {
    onComplete: (values: ValuesProfile) => void;
    onSkip: () => void;
}

export default function ValuesQuiz({ onComplete, onSkip }: ValuesQuizProps) {
    const [step, setStep] = useState(1);
    const [values, setValues] = useState<Partial<ValuesProfile>>({
        optimizing_for: [],
        tradeoff_preferences: {
            certainty_vs_upside: 3,
            speed_vs_quality: 3,
            solo_vs_team: 3,
        },
        deal_breakers: [],
    });
    const [dealBreakerInput, setDealBreakerInput] = useState('');

    const optimizationOptions = [
        { id: 'financial_security', label: 'Financial Security', icon: '💰' },
        { id: 'growth', label: 'Learning & Growth', icon: '📈' },
        { id: 'impact', label: 'Impact & Legacy', icon: '🌟' },
        { id: 'freedom', label: 'Freedom & Autonomy', icon: '🦅' },
        { id: 'speed', label: 'Speed to Outcome', icon: '⚡' },
    ];

    const toggleOptimization = (id: string) => {
        const current = values.optimizing_for || [];
        if (current.includes(id)) {
            setValues({ ...values, optimizing_for: current.filter(x => x !== id) });
        } else {
            setValues({ ...values, optimizing_for: [...current, id] });
        }
    };

    const addDealBreaker = () => {
        if (dealBreakerInput.trim()) {
            setValues({
                ...values,
                deal_breakers: [...(values.deal_breakers || []), dealBreakerInput.trim()]
            });
            setDealBreakerInput('');
        }
    };

    const removeDealBreaker = (index: number) => {
        setValues({
            ...values,
            deal_breakers: values.deal_breakers?.filter((_, i) => i !== index) || []
        });
    };

    const handleComplete = () => {
        if (values.optimizing_for?.length && values.tradeoff_preferences && values.deal_breakers) {
            onComplete(values as ValuesProfile);
        }
    };

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Target className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-light text-white">Values Clarification</h3>
                        <p className="text-zinc-500 text-sm">Step {step} of 3</p>
                    </div>
                </div>
                <button
                    onClick={onSkip}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                >
                    Skip
                </button>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-white text-lg mb-2">What are you optimizing for?</h4>
                        <p className="text-zinc-500 text-sm mb-4">Select all that apply</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {optimizationOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => toggleOptimization(option.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${values.optimizing_for?.includes(option.id)
                                        ? 'bg-amber-500/20 border-amber-500/50'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{option.icon}</span>
                                    <span className="text-white font-medium">{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!values.optimizing_for?.length}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium rounded-lg transition-colors"
                    >
                        Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                    <div>
                        <h4 className="text-white text-lg mb-2">Rank your tradeoff preferences</h4>
                        <p className="text-zinc-500 text-sm mb-6">Where do you lean?</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-zinc-400 text-sm">Certainty</span>
                                <span className="text-zinc-400 text-sm">Upside Potential</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={values.tradeoff_preferences?.certainty_vs_upside || 3}
                                onChange={(e) => setValues({
                                    ...values,
                                    tradeoff_preferences: {
                                        ...values.tradeoff_preferences!,
                                        certainty_vs_upside: parseInt(e.target.value)
                                    }
                                })}
                                className="w-full accent-amber-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-zinc-400 text-sm">Speed</span>
                                <span className="text-zinc-400 text-sm">Quality</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={values.tradeoff_preferences?.speed_vs_quality || 3}
                                onChange={(e) => setValues({
                                    ...values,
                                    tradeoff_preferences: {
                                        ...values.tradeoff_preferences!,
                                        speed_vs_quality: parseInt(e.target.value)
                                    }
                                })}
                                className="w-full accent-amber-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3">
                                <span className="text-zinc-400 text-sm">Solo Control</span>
                                <span className="text-zinc-400 text-sm">Team Leverage</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={values.tradeoff_preferences?.solo_vs_team || 3}
                                onChange={(e) => setValues({
                                    ...values,
                                    tradeoff_preferences: {
                                        ...values.tradeoff_preferences!,
                                        solo_vs_team: parseInt(e.target.value)
                                    }
                                })}
                                className="w-full accent-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-white text-lg mb-2">What are your deal-breakers?</h4>
                        <p className="text-zinc-500 text-sm mb-4">What would make this a clear NO?</p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={dealBreakerInput}
                            onChange={(e) => setDealBreakerInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addDealBreaker()}
                            placeholder="e.g., requires >6 months without income"
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                        />
                        <button
                            onClick={addDealBreaker}
                            className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {values.deal_breakers && values.deal_breakers.length > 0 && (
                        <div className="space-y-2">
                            {values.deal_breakers.map((breaker, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                                >
                                    <span className="text-white text-sm">🚫 {breaker}</span>
                                    <button
                                        onClick={() => removeDealBreaker(index)}
                                        className="text-red-500 hover:text-red-400 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleComplete}
                            disabled={!values.deal_breakers?.length}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium rounded-lg transition-colors"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
