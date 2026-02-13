import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DecisionStatus from '@/components/decision/DecisionStatus';

import { ArrowLeft, AlertTriangle, TrendingUp, Skull, CheckCircle } from 'lucide-react';

export default async function AnalysisResultPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const user = await currentUser();
    if (!user) return redirect('/login');

    // Check for Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables!");
        return <div className="text-red-500 p-10">System Configuration Error. Please contact support.</div>;
    }

    // Bypass RLS using Service Role Key
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

    const { data: decision, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !decision) {
        console.error("Decision Fetch Error:", error);
        return (
            <div className="text-white p-10 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Decision Not Found</h1>
                <div className="bg-zinc-900 p-6 rounded-lg border border-red-500/20 font-mono text-sm space-y-2">
                    <p><span className="text-zinc-500">Decision ID:</span> <span className="text-amber-500">{params.id}</span></p>
                    <p><span className="text-zinc-500">User ID:</span> <span className="text-blue-400">{user.id}</span></p>
                    <p><span className="text-zinc-500">Service Key:</span> <span className={serviceRoleKey ? "text-green-500" : "text-red-500"}>{serviceRoleKey ? "Present (Starts with " + serviceRoleKey.substring(0, 5) + "...)" : "MISSING"}</span></p>
                    {error && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-red-400 font-bold">Supabase Error:</p>
                            <pre className="whitespace-pre-wrap text-xs text-red-300 mt-2">{JSON.stringify(error, null, 2)}</pre>
                        </div>
                    )}
                    {!error && !decision && <p className="text-yellow-500 mt-4">Database query returned no data (null) for this ID.</p>}
                </div>
                <div className="mt-6 flex gap-4">
                    <Link href="/analyze/new" className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200">Try Again</Link>
                    <Link href="/" className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700">Home</Link>
                </div>
            </div>
        );
    }

    // Manual Security Check
    if (decision.user_id !== user.id) {
        return <div className="text-red-500 p-10">Unauthorized access to this decision.</div>;
    }

    const result = decision.analysis_result;
    const { recommendation, options_analysis, kill_signals, decision_compression } = result;

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12">
            <div className="max-w-5xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-zinc-500 hover:text-white mb-10 transition-colors text-sm font-medium tracking-wide">
                    <ArrowLeft size={16} className="mr-2" /> Back to Decisions
                </Link>

                {/* Header */}
                <div className="mb-12 border-b border-white/5 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight leading-tight">Decision Report</h1>
                            <DecisionStatus decisionId={decision.id} initialStatus={decision.status} />
                        </div>
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-400 self-start md:self-auto flex items-center gap-2">
                            <CheckCircle size={12} className="text-emerald-500" />
                            {decision_compression?.time_saved || "Compressed from 2 weeks → 5 mins"}
                        </div>
                    </div>
                    <p className="text-zinc-500 text-lg font-light">Analysis Target: <span className="text-white font-normal">{decision.title}</span></p>
                </div>

                {/* Recommendation Engine Card */}
                <div className="glass-panel rounded-3xl p-10 md:p-12 mb-16 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-500">Engine Verdict</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">{recommendation.verdict}</h3>
                            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light max-w-3xl">
                                {recommendation.reasoning}
                            </p>
                        </div>

                        <div className="flex flex-col items-end min-w-[140px]">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Conviction</span>
                            <div className="text-6xl font-medium text-white tracking-tighter tabular-nums">
                                {recommendation.conviction_score}<span className="text-2xl text-zinc-600">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kill Signals - Grid Layout */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-red-500/10 rounded-lg"><Skull size={20} className="text-red-500" /></div>
                        <h3 className="text-xl font-medium text-white tracking-tight">Kill Signals</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kill_signals.map((ks: any, i: number) => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-red-500/20 transition-colors group">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 group-hover:text-red-400 transition-colors">
                                    {ks.timeframe}
                                </div>
                                <div className="text-base text-zinc-300 font-medium mb-4 leading-relaxed">
                                    {ks.signal}
                                </div>
                                <div className="text-[10px] font-mono text-red-400 bg-red-500/5 inline-block px-3 py-1.5 rounded border border-red-500/10">
                                    Action: {ks.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Option Analysis - Clean Stacks */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp size={20} className="text-blue-500" /></div>
                        <h3 className="text-xl font-medium text-white tracking-tight">Scenario Analysis</h3>
                    </div>

                    <div className="space-y-4">
                        {options_analysis.map((opt: any, i: number) => (
                            <div key={i} className="glass-panel p-8 rounded-3xl">
                                <h4 className="text-xl font-medium text-white mb-8 pb-4 border-b border-white/5">
                                    <span className="text-zinc-500 mr-4 font-mono text-sm">0{i + 1}</span>
                                    {opt.title}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Second-Order Effects</p>
                                        <ul className="space-y-3">
                                            {opt.consequences.map((c: string, idx: number) => (
                                                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-3 leading-relaxed">
                                                    <span className="w-1 h-1 rounded-full bg-zinc-600 mt-2 shrink-0"></span> {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Requirements</p>
                                        <ul className="space-y-3">
                                            {opt.requirements.map((r: string, idx: number) => (
                                                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-3 leading-relaxed">
                                                    <CheckCircle size={14} className="text-emerald-500/70 mt-0.5 shrink-0" /> {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
