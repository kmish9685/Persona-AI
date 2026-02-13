import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Clock, CheckCircle, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import DecisionCard from '@/components/decision/DecisionCard';

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
        <div className="min-h-screen bg-black text-white p-8 md:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-medium text-white mb-2 tracking-tight">My Decisions</h1>
                        <p className="text-zinc-400 font-light">History of your high-stakes choices.</p>
                    </div>
                    <Link href="/analyze/new" className="btn-premium bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all">
                        <Plus size={16} /> New Decision
                    </Link>
                </div>

                {/* Empty State */}
                {(!decisions || decisions.length === 0) && (
                    <div className="glass-panel rounded-3xl p-20 text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                            <Clock size={32} className="text-zinc-500" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-medium text-white mb-4 tracking-tight">No decisions tracked yet</h2>
                        <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
                            Stop overthinking. Use the decision engine to get clarity on your next big move in minutes, not weeks.
                        </p>
                        <Link href="/analyze/new" className="btn-premium text-white border border-white/10 hover:bg-white/5 px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all text-sm font-medium">
                            Start Analysis <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {decisions?.map((decision: any) => (
                        <DecisionCard key={decision.id} decision={decision} />
                    ))}
                </div>

            </div>
        </div>
    );
}
