'use client';

import { useState } from 'react';
import { Loader2, ChevronDown, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
    active: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Clock },
    completed: { label: 'Analysis Done', color: 'bg-zinc-800 text-zinc-400 border-zinc-700', icon: CheckCircle },
    pivot: { label: 'Pivoted', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertTriangle },
    killed: { label: 'Killed / Stopped', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
    successful: { label: 'Successful', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
};

export default function DecisionStatus({ decisionId, initialStatus }: { decisionId: string, initialStatus: string }) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus || 'active');
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['active'];
    const Icon = config.icon;

    const handleUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/checkpoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    decisionId,
                    status: newStatus,
                    message: `Status updated to ${newStatus}`
                })
            });

            if (!res.ok) throw new Error("Failed");

            setStatus(newStatus);
            setIsOpen(false);
            router.refresh();
        } catch (e) {
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative inline-block text-left z-20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${config.color} hover:contrast-125`}
            >
                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
                {config.label}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-[#0F0F0F] border border-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-fade-in-up">
                    <div className="py-1">
                        {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                            <button
                                key={key}
                                onClick={() => handleUpdate(key)}
                                className={`group flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-800 transition-colors ${status === key ? 'text-white bg-zinc-800/50' : 'text-zinc-400'}`}
                            >
                                <conf.icon size={14} className={status === key ? 'text-white' : 'text-zinc-500 group-hover:text-white'} />
                                {conf.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
