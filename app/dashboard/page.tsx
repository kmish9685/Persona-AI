import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Clock, CheckCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) return redirect('/login');

    // Bypass RLS using Service Role Key for now (Internal Dashboard)
    // Ideally we should use standard client + RLS, but this guarantees data access for the demo.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return <div className="text-red-500 p-10">Configuration Error: Missing Service Key</div>;
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

    const { data: decisions, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Dashboard Fetch Error:", error);
        return <div className="text-red-500 p-10">Error loading decisions.</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-light text-white mb-2">Decision Tracker</h1>
                        <p className="text-zinc-500">Track and manage your critical pivots.</p>
                    </div>
                    <Link href="/analyze/new" className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                        <Plus size={18} /> New Decision
                    </Link>
                </div>

                {/* Empty State */}
                {(!decisions || decisions.length === 0) && (
                    <div className="border border-zinc-800 rounded-2xl p-16 text-center bg-zinc-900/30">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={32} className="text-zinc-600" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No decisions tracked yet</h2>
                        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Stop overthinking. Use the decision engine to get clarity on your next big move in minutes, not weeks.</p>
                        <Link href="/analyze/new" className="text-white border border-white/20 hover:bg-white/10 px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
                            Values.Start Checkbox Analysis <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decisions?.map((decision: any) => {
                        const result = decision.analysis_result?.recommendation || {};
                        const verdict = result.verdict || "Analysis Pending";
                        const score = result.conviction_score || 0;

                        return (
                            <Link key={decision.id} href={`/analyze/${decision.id}`} className="group block bg-[#0F0F0F] border border-white/5 hover:border-white/20 rounded-xl p-6 transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-2 min-h-[3.5rem]">{decision.title}</h3>
                                    <div className={`px-2 py-1 rounded text-xs font-mono ml-2 shrink-0 ${score >= 90 ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {score}%
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Verdict</p>
                                    <p className="text-zinc-300 text-sm line-clamp-3">{verdict}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <span className="text-xs text-zinc-600 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(decision.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-zinc-500 group-hover:text-white flex items-center gap-1 transition-colors">
                                        View Analysis <ArrowRight size={12} />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
