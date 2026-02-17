'use client';

import { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export interface FiveYearScenario {
    option: string;
    typical_day: string;
    proud_of: string;
    regrets: string;
}

interface FiveYearVizProps {
    onComplete: (scenarios: FiveYearScenario[], clarityAchieved: boolean) => void;
    onSkip: () => void;
}

export default function FiveYearViz({ onComplete, onSkip }: FiveYearVizProps) {
    const [scenarioA, setScenarioA] = useState<Omit<FiveYearScenario, 'option'>>({
        typical_day: '',
        proud_of: '',
        regrets: '',
    });

    const [scenarioB, setScenarioB] = useState<Omit<FiveYearScenario, 'option'>>({
        typical_day: '',
        proud_of: '',
        regrets: '',
    });

    const [choice, setChoice] = useState<string | null>(null);

    const isComplete = scenarioA.typical_day && scenarioA.proud_of && scenarioB.typical_day && scenarioB.proud_of;

    const handleComplete = () => {
        const scenarios: FiveYearScenario[] = [
            { option: 'YES', ...scenarioA },
            { option: 'NO', ...scenarioB },
        ];

        const clarityAchieved = choice !== null && choice !== 'unsure';
        onComplete(scenarios, clarityAchieved);
    };

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-light text-white">5-Year Visualization</h3>
                        <p className="text-zinc-500 text-sm">Often answers itself in 10 minutes</p>
                    </div>
                </div>
                <button
                    onClick={onSkip}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                >
                    Skip to AI Analysis
                </button>
            </div>

            <p className="text-zinc-300 mb-8">
                Before using AI, try this: Visualize your life 5 years from now in each scenario. The answer is usually obvious.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Scenario A: YES */}
                <div className="p-6 bg-green-500/5 border border-green-500/30 rounded-xl">
                    <h4 className="text-green-500 font-bold mb-4">Scenario A: You choose YES</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">Your typical Tuesday looks like:</label>
                            <textarea
                                value={scenarioA.typical_day}
                                onChange={(e) => setScenarioA({ ...scenarioA, typical_day: e.target.value })}
                                placeholder="Walking into the office, first meeting at 10am..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/50 resize-none"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">You're proud that:</label>
                            <textarea
                                value={scenarioA.proud_of}
                                onChange={(e) => setScenarioA({ ...scenarioA, proud_of: e.target.value })}
                                placeholder="I took the leap and built something..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/50 resize-none"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">You regret:</label>
                            <textarea
                                value={scenarioA.regrets}
                                onChange={(e) => setScenarioA({ ...scenarioA, regrets: e.target.value })}
                                placeholder="Not starting sooner, or..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/50 resize-none"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Scenario B: NO */}
                <div className="p-6 bg-red-500/5 border border-red-500/30 rounded-xl">
                    <h4 className="text-red-500 font-bold mb-4">Scenario B: You choose NO</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">Your typical Tuesday looks like:</label>
                            <textarea
                                value={scenarioB.typical_day}
                                onChange={(e) => setScenarioB({ ...scenarioB, typical_day: e.target.value })}
                                placeholder="Same desk, same commute..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 resize-none"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">You're proud that:</label>
                            <textarea
                                value={scenarioB.proud_of}
                                onChange={(e) => setScenarioB({ ...scenarioB, proud_of: e.target.value })}
                                placeholder="I stayed patient, built savings..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 resize-none"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="text-zinc-400 text-sm mb-2 block">You regret:</label>
                            <textarea
                                value={scenarioB.regrets}
                                onChange={(e) => setScenarioB({ ...scenarioB, regrets: e.target.value })}
                                placeholder="Not taking the chance when..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 resize-none"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isComplete && (
                <div className="mb-6 p-6 bg-[#5e6ad2]/10 border border-[#5e6ad2]/30 rounded-xl">
                    <p className="text-white mb-4">Which future do you want to live?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setChoice('A')}
                            className={`flex-1 py-3 rounded-lg transition-all ${choice === 'A'
                                    ? 'bg-green-500 text-black font-medium'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            Scenario A (YES)
                        </button>
                        <button
                            onClick={() => setChoice('B')}
                            className={`flex-1 py-3 rounded-lg transition-all ${choice === 'B'
                                    ? 'bg-red-500 text-black font-medium'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            Scenario B (NO)
                        </button>
                        <button
                            onClick={() => setChoice('unsure')}
                            className={`flex-1 py-3 rounded-lg transition-all ${choice === 'unsure'
                                    ? 'bg-zinc-500 text-black font-medium'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            Still Unsure
                        </button>
                    </div>
                </div>
            )}

            {choice && choice !== 'unsure' && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                        ✓ You already know the answer. Want AI validation or ready to decide?
                    </p>
                </div>
            )}

            <button
                onClick={handleComplete}
                disabled={!isComplete}
                className="w-full py-3 bg-[#5e6ad2] hover:bg-[#4f5bc4] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {choice && choice !== 'unsure' ? 'Proceed Anyway' : 'Continue to AI Analysis'}
                <ArrowRight size={16} />
            </button>
        </div>
    );
}

