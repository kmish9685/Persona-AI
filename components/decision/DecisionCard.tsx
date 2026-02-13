'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Trash2, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function DecisionCard({ decision }: { decision: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Mobile expand toggle

    const result = decision.analysis_result?.recommendation || {};
    const verdict = result.verdict || "Analysis Pending";
    const score = result.conviction_score || 0;
    const isHighScore = score >= 90;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stop card click
        if (!confirm("Are you sure you want to delete this decision? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/analyze/${decision.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete");
            router.refresh();
        } catch (error) {
            alert("Failed to delete. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group relative block glass-panel rounded-2xl transition-all duration-500 cursor-pointer ${isExpanded ? 'bg-zinc-900 border-white/20' : 'hover:border-white/20'}`}
        >
            {/* Delete Button */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors z-20 opacity-0 group-hover:opacity-100"
                style={{ opacity: 1 }} // Force visible for accessibility on touch
                title="Delete Decision"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={1.5} />}
            </button>

            <div className="p-8">
                <div className="flex flex-col gap-4 mb-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold border ${isHighScore ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                            {score}% Conviction
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                            {new Date(decision.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-xl font-medium text-white group-hover:text-amber-500 transition-colors leading-tight">
                        {decision.title}
                    </h3>
                </div>

                {/* Verdict */}
                <div className={`text-sm text-zinc-400 leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {verdict}
                </div>

                {/* Footer Action */}
                <div className={`mt-8 pt-6 border-t border-white/5 flex items-center justify-between transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                        {isExpanded ? "Close" : "Details"}
                    </span>
                    <Link href={`/analyze/${decision.id}`} className="flex items-center gap-2 text-xs font-bold text-white hover:text-amber-500 transition-colors uppercase tracking-widest">
                        View Report <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
