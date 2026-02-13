import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
        return (
            <div className="text-white p-10 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                <p className="text-zinc-300 mb-4">The server is missing the Database Secret Key.</p>
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded text-red-200 text-sm font-mono">
                    SUPABASE_SERVICE_ROLE_KEY is undefined.
                </div>
            </div>
        );
    }

    // Verify it is actually a SERVICE key (not anon)
    const parts = serviceRoleKey.split('.');
    let keyRole = 'unknown';
    if (parts.length === 3) {
        try {
            const payload = parts[1];
            // Simple base64 decode for debug
            const decodedStr = Buffer.from(payload, 'base64').toString();
            const decoded = JSON.parse(decodedStr);
            keyRole = decoded.role;
        } catch (e) {
            keyRole = 'parse_error';
        }
    }

    if (keyRole !== 'service_role') {
        return (
            <div className="text-white p-10 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Key Configuration Error</h1>
                <p className="text-zinc-300 mb-4">You put the WRONG key in Vercel.</p>
                <div className="bg-zinc-900 border border-red-500/30 p-6 rounded text-sm space-y-4">
                    <div>
                        <p className="text-zinc-500 uppercase text-xs font-bold">Expected Role</p>
                        <p className="text-green-500 font-mono">service_role</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase text-xs font-bold">Your Key's Role</p>
                        <p className="text-red-500 font-mono text-xl">{keyRole}</p>
                    </div>
                    <p className="text-zinc-400">
                        You likely pasted the <strong>anon key</strong> into the <code>SUPABASE_SERVICE_ROLE_KEY</code> variable in Vercel.
                        <br />
                        <br />
                        <strong>Fix:</strong> Go to Supabase &rarr; Settings &rarr; API &rarr; Copy the <strong>service_role (secret)</strong> key &rarr; Paste it in Vercel.
                    </p>
                </div>
            </div>
        );
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
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-light text-white mb-2">Decision Analysis</h1>
                        <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-zinc-400">
                            {decision_compression?.time_saved || "Compressed from 2 weeks → 5 mins"}
                        </div>
                    </div>
                    <p className="text-zinc-500">Analysis for: <span className="text-white">{decision.title}</span></p>
                </div>

                {/* Recommendation Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-black border border-amber-500/30 rounded-2xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><TrendingUp size={100} /></div>

                    <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2">Recommendation</h2>
                    <h3 className="text-3xl font-bold text-white mb-4">{recommendation.verdict}</h3>
                    <p className="text-lg text-zinc-300 leading-relaxed mb-6 max-w-3xl">{recommendation.reasoning}</p>

                    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2 rounded-lg border border-white/5">
                        <span className="text-zinc-400 text-sm">Conviction Score:</span>
                        <span className="text-amber-500 font-bold">{recommendation.conviction_score}%</span>
                    </div>
                </div>

                {/* Kill Signals */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <Skull size={20} className="text-red-500" /> Kill Signals
                        </h3>
                        <p className="text-sm text-zinc-500 mb-4">Abort if these happen.</p>
                        <div className="space-y-4">
                            {kill_signals.map((ks: any, i: number) => (
                                <div key={i} className="bg-[#111] border border-red-500/20 p-4 rounded-xl">
                                    <div className="text-xs font-bold text-red-500 mb-1">{ks.timeframe}</div>
                                    <div className="text-sm text-zinc-300 mb-2">{ks.signal}</div>
                                    <div className="text-xs bg-red-500/10 text-red-400 inline-block px-2 py-1 rounded">Action: {ks.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Options Analysis */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-light mb-4 text-white">Option Analysis</h3>
                        <div className="space-y-6">
                            {options_analysis.map((opt: any, i: number) => (
                                <div key={i} className="bg-[#0F0F0F] border border-white/5 p-6 rounded-2xl">
                                    <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">{opt.title}</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Second-Order Consequences</p>
                                            <ul className="space-y-1">
                                                {opt.consequences.map((c: string, idx: number) => (
                                                    <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                                                        <span className="text-zinc-600 mt-1">→</span> {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase mb-2">What must be true</p>
                                            <ul className="space-y-1">
                                                {opt.requirements.map((r: string, idx: number) => (
                                                    <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                                                        <CheckCircle size={14} className="text-emerald-500/50 mt-1 shrink-0" /> {r}
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
        </div>
    );
}
