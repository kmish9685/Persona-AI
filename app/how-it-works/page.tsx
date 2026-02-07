import Link from 'next/link';
import { ArrowLeft, MessageSquare, Shield, Zap } from 'lucide-react';

export const metadata = {
    title: 'How to Use Persona AI - The Brutal Feedback Guide',
    description: 'Learn how to use AI personas to get brutal, unfiltered feedback on your ideas in 3 simple steps.',
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                            <span className="font-bold text-lg tracking-tight">Persona AI</span>
                        </Link>
                        <Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <ArrowLeft size={16} />
                            Back to Chat
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
                    How to Get <span className="text-[#FF9500]">Brutally Honest</span> Feedback
                </h1>
                <p className="text-xl text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
                    Most AI lies to make you feel good. Persona AI is designed to tear your bad ideas apart so you can rebuild them better. Here is how to use it.
                </p>

                {/* Improved Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Step 1 */}
                    <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 relative">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#FF9500] text-black font-bold flex items-center justify-center rounded-xl text-xl shadow-lg shadow-orange-500/20">1</div>
                        <h3 className="text-xl font-bold mb-4 mt-2">Pick Your "Enemy"</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Choose a persona based on the type of grilling you need.
                        </p>
                        <ul className="text-xs text-zinc-500 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <strong className="text-zinc-300">Elon:</strong> First-principles engineering & physics.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <strong className="text-zinc-300">Sam:</strong> Product market fit & scale.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <strong className="text-zinc-300">Naval:</strong> Wealth & leverage leverage.
                            </li>
                        </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 relative">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#FF9500] text-black font-bold flex items-center justify-center rounded-xl text-xl shadow-lg shadow-orange-500/20">2</div>
                        <h3 className="text-xl font-bold mb-4 mt-2">Ask the Unaskable</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Don't ask "Is my idea good?". Ask "Why will this fail?".
                        </p>
                        <div className="bg-black/50 p-3 rounded-lg border border-zinc-800">
                            <p className="text-xs text-red-400 line-through mb-1">"How do I market this?"</p>
                            <p className="text-xs text-green-400">"Roast my go-to-market strategy."</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 relative">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#FF9500] text-black font-bold flex items-center justify-center rounded-xl text-xl shadow-lg shadow-orange-500/20">3</div>
                        <h3 className="text-xl font-bold mb-4 mt-2">Analyze the Verdict</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            The AI will give you 3-4 bullet points of actionable, often harsh, truth.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#FF9500]">
                            <Zap size={14} />
                            <span>Take action or ignore at your peril.</span>
                        </div>
                    </div>
                </div>

                {/* FAQ For SEO */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="border-b border-zinc-800 pb-6">
                            <h3 className="text-lg font-semibold mb-2">What is Persona AI?</h3>
                            <p className="text-zinc-400">
                                Persona AI is a platform that simulates conversations with famous tech visionaries. Unlike standard chatbots, our personas are prompted to be brutally honest, direct, and free from corporate politeness.
                            </p>
                        </div>
                        <div className="border-b border-zinc-800 pb-6">
                            <h3 className="text-lg font-semibold mb-2">Is Persona AI free?</h3>
                            <p className="text-zinc-400">
                                Yes, you can send 10 messages per day for free. For unlimited access and more personas, you can upgrade to the Founding Plan for just ₹99/month.
                            </p>
                        </div>
                        <div className="border-b border-zinc-800 pb-6">
                            <h3 className="text-lg font-semibold mb-2">How accurate are the personas?</h3>
                            <p className="text-zinc-400">
                                We use advanced prompt engineering to mimic the thinking patterns, speech style, and decision-making logic of each figure. However, they are AI simulations, not the real people.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-20">
                    <Link
                        href="/chat"
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#FF9500] text-black font-bold rounded-xl text-lg hover:bg-orange-500 transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-500/20"
                    >
                        Start Getting Feedback
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12 bg-black mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400 font-medium">
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link href="/how-it-works" className="hover:text-white transition-colors text-[#FF9500]">How it Works</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        Contact: <a href="mailto:kmish9685@gmail.com" className="text-gray-400 hover:text-white">kmish9685@gmail.com</a>
                    </p>
                    <p className="text-sm text-gray-600">
                        © 2025 Persona AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
