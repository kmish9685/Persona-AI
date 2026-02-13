'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Trash2, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function DecisionCard({ decision }: { decision: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const result = decision.analysis_result?.recommendation || {};
    const verdict = result.verdict || "Analysis Pending";
    const score = result.conviction_score || 0;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        if (!confirm("Are you sure you want to delete this decision? This cannot be undone.")) return;

        setIsDeleting(true);

        try {
            // We need a route handler for this because we can't use Service Role on client
            // But wait, the user SHOULD own the decision, so RLS should allow delete via standard client?
            // Let's try standard client first. If RLS fails, we use an API route.
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Delete
            const { error } = await supabase
                .from('decisions')
                .delete()
                .eq('id', decision.id);

            if (error) throw error;

            router.refresh();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <Link href={`/analyze/${decision.id}`} className="group relative block bg-[#0F0F0F] border border-white/5 hover:border-white/20 rounded-xl p-6 transition-all hover:-translate-y-1">

            {/* Delete Button (Absolute) */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-20"
                title="Delete Decision"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>

            <div className="flex justify-between items-start mb-4 pr-10">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-2 min-h-[3.5rem]">{decision.title}</h3>
                <div className={`px-2 py-1 rounded text-xs font-mono ml-2 shrink-0 ${score >= 90 ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {score}%
                </div>
            </div>

            <div className="mb-6">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Verdict</p>
                <p className="text-zinc-300 text-sm line-clamp-3 leading-relaxed">{verdict}</p>
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
}
