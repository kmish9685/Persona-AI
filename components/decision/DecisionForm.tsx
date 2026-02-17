'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { Paywall } from '@/components/Paywall';

interface DecisionFormProps {
    initialValues?: any; // ValuesProfile
    vizData?: any; // 5-Year Viz
}

export function DecisionForm({ initialValues, vizData }: DecisionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showPaywall, setShowPaywall] = useState(false);
    const [remainingFree, setRemainingFree] = useState<number | null>(null);
    const router = useRouter();

    // Simple form state
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const [options, setOptions] = useState('');
    const [constraints, setConstraints] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !context.trim()) {
            setError('Please fill in at least the decision title and context.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title,
                context,
                options: options.split('\n').filter(o => o.trim()).map((o, i) => ({
                    title: o.trim(),
                    description: `Option ${String.fromCharCode(65 + i)}`
                })),
                constraints: constraints || 'No specific constraints provided',
                decisionType: 'custom',
                values_profile: initialValues,
                five_year_viz: vizData?.scenarios,
                viz_clarity_achieved: vizData?.clarityAchieved
            };

            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            // Handle free limit reached
            if (res.status === 403 && responseData.error === 'FREE_LIMIT_REACHED') {
                setShowPaywall(true);
                setIsSubmitting(false);
                return;
            }

            if (!res.ok) {
                throw new Error(responseData.error || `HTTP ${res.status}: Analysis failed`);
            }

            console.log("🔍 Analyzer API Response:", responseData);

            if (responseData.remaining_free !== undefined && responseData.remaining_free !== 'unlimited') {
                setRemainingFree(responseData.remaining_free);
            }

            if (!responseData.id) {
                throw new Error('No decision ID returned from API');
            }

            router.push(`/analyze/${responseData.id}`);
        } catch (err: any) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to generate analysis. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-300">{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:p-10 space-y-8">
                {/* Decision Title */}
                <div>
                    <label className="block text-sm font-bold text-white mb-3 uppercase tracking-widest">
                        What's the decision?
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Should I quit my job to build my startup full-time?"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-lg placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors"
                        required
                    />
                </div>

                {/* Context */}
                <div>
                    <label className="block text-sm font-bold text-white mb-3 uppercase tracking-widest">
                        Full Context
                    </label>
                    <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Include everything relevant: your situation, stakes, timeline, resources, dependencies...
                        
Example:
- Age: 28, married, 1 kid
- Current: $120K/year at Google, $80K savings
- Side project: 50 beta users, 5 paying ($150/mo total MRR)
- Timeline: Stock vests in 4 months ($80K)
- Risk: Wife is pregnant, need health insurance"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none transition-colors min-h-[200px] font-mono text-sm"
                        required
                    />
                </div>

                {/* Options (Optional) */}
                <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                        Options (Optional - one per line)
                    </label>
                    <textarea
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        placeholder="Quit now
Stay at Google, build on weekends
Take 6-month sabbatical"
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-amber-500/30 focus:outline-none transition-colors min-h-[100px] font-mono text-sm"
                    />
                    <p className="text-xs text-zinc-600 mt-2">If blank, AI will extract options from your context.</p>
                </div>

                {/* Constraints (Optional) */}
                <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                        Hard Constraints (Optional)
                    </label>
                    <input
                        type="text"
                        value={constraints}
                        onChange={(e) => setConstraints(e.target.value)}
                        placeholder="e.g., Must have health insurance, Can't relocate, 3-month max runway"
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-amber-500/30 focus:outline-none transition-colors"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Decision'
                        )}
                    </button>
                    <p className="text-center text-zinc-600 text-xs mt-4 uppercase tracking-widest">
                        ⚡ Analysis completes in ~30 seconds
                    </p>
                    {remainingFree !== null && (
                        <p className="text-center text-amber-500/60 text-xs mt-2">
                            {remainingFree > 0
                                ? `${remainingFree} free ${remainingFree === 1 ? 'analysis' : 'analyses'} remaining`
                                : 'This is your last free analysis'
                            }
                        </p>
                    )}
                </div>
            </form>

            {/* Paywall Modal */}
            {showPaywall && (
                <Paywall
                    onClose={() => setShowPaywall(false)}
                    onSuccess={() => {
                        setShowPaywall(false);
                        // Re-submit after payment
                        const form = document.querySelector('form');
                        if (form) form.requestSubmit();
                    }}
                />
            )}
        </div>
    );
}
