import { DecisionForm } from '@/components/decision/DecisionForm';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function NewAnalysisPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            {/* Minimal Header */}
            <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tighter">
                        Persona <span className="text-amber-500">AI</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
                        New Decision Analysis
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base">
                        Input your constraints. We'll simulate the outcomes.
                    </p>
                </div>

                <DecisionForm />
            </main>
        </div>
    );
}
