import { DecisionForm } from '@/components/decision/DecisionForm';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function NewAnalysisPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            {/* Minimal Header */}
            <header className="border-b border-white/5 bg-black sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="font-medium text-lg tracking-tight hover:opacity-80 transition-opacity">
                        Persona <span className="text-zinc-500">AI</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-tight">
                        New Decision Analysis
                    </h1>
                    <p className="text-zinc-400 text-lg font-light">
                        Input your constraints. We'll simulate the outcomes.
                    </p>
                </div>

                <DecisionForm />
            </main>
        </div>
    );
}
