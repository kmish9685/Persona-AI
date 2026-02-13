'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, Zap } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function LandingPageContent() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] bg-gradient-to-b from-amber-500/5 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-white">Persona AI</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/about" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Manifesto
              </Link>

              <SignedIn>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  href="/analyze/new"
                  className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-zinc-200 rounded-full transition-all flex items-center gap-2"
                >
                  Start Deciding <ArrowRight size={14} />
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center animate-slide-up">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">Reasoning Engine v2.0 Live</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tighter text-white">
            Stop Spending <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-blue-400">
              2 Weeks on Decisions.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compress your decision cycle to <span className="text-white font-medium">5 minutes</span>.
            <br className="hidden sm:block" />
            Validate assumptions, find kill signals, and execute.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-200 uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                Dashboard <ArrowRight size={16} />
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/analyze/new" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                Start Decision <Zap size={16} className="fill-black" />
              </Link>
            </SignedOut>

            <Link href="/personas" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              Talk to Famous Minds <Brain size={16} />
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-600">
            Unsure? <Link href="/personas" className="text-zinc-400 hover:text-white underline underline-offset-4">Talk to a Persona first</Link> or <Link href="/analyze/new" className="text-zinc-400 hover:text-white underline underline-offset-4">Run a Deep Analysis</Link>.
          </p>
        </div>
      </section>

      {/* 2. Hybrid Features Section */}
      <section id="proof" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Choose Your Mode</h2>
            <p className="text-zinc-500 text-lg">Two ways to get clarity.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mode A: Chat */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-800 rounded-lg"><Brain size={20} className="text-blue-400" /></div>
                <h3 className="font-bold text-white tracking-widest text-sm">MODE A: ADVISOR CHAT</h3>
              </div>
              <p className="text-zinc-400 mb-6 min-h-[60px]">
                Best for: Brainstorming, general advice, and exploring ideas with specific personalities (Elon, Naval, etc).
              </p>

              <Link href="/personas" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all">
                Chat Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mode B: Engine */}
            <div className="bg-[#0A0A0A] border border-orange-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-orange-900/5 hover:border-orange-500/40 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-orange-500"><Zap size={80} /></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500 rounded-lg"><Target size={20} className="text-black" /></div>
                <h3 className="font-bold text-white tracking-widest text-sm">MODE B: DECISION ENGINE</h3>
              </div>
              <p className="text-zinc-400 mb-6 min-h-[60px]">
                Best for: Hard binary choices (Pivot vs Stay, Hire vs Fire).
                Deep structured analysis with kill signals and conviction scores.
              </p>

              <Link href="/analyze/new" className="inline-flex items-center gap-2 text-orange-400 font-bold hover:gap-3 transition-all">
                Start Analysis <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Steps Visualization */}
      <section id="how-it-works" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-500 text-lg">Garbage in, garbage out. We force clarity first.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold border border-white/10 text-zinc-400">1</div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">Structure Context</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                You input messy thoughts. The engine forces you to define <strong>Constraints</strong> (Burn, Runway) and <strong>Options</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/20">2</div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">Simulate Futures</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The AI synthesizes 6 top founder personas (Musk, Naval, Thiel) to simulate the <strong>Second-Order Consequences</strong> of each option.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-2xl relative">
              <div className="absolute -top-5 left-8 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold border border-white/10 text-zinc-400">3</div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">Get Verdict</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Receive a comprehensive report with a clear <span className="text-green-500">Recommendation</span> and <span className="text-red-500">Kill Signals</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Comparison Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Why not just use ChatGPT?</h2>
            <p className="text-zinc-500 text-lg">Chatbots give advice. We give engineering-grade analysis.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-zinc-500 font-medium uppercase tracking-wider text-sm">Feature</th>
                  <th className="py-4 px-6 text-zinc-500 font-medium uppercase tracking-wider text-sm">Standard AI Chat</th>
                  <th className="py-4 px-6 text-white font-bold uppercase tracking-wider text-sm bg-amber-500/10 border-t border-x border-amber-500/20 rounded-t-xl">Persona AI Engine</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 font-medium">Output Format</td>
                  <td className="py-6 px-6 text-zinc-500">Wall of text</td>
                  <td className="py-6 px-6 text-white bg-amber-500/5 border-x border-amber-500/10 font-bold">Structured Decision Report</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 font-medium">Bias</td>
                  <td className="py-6 px-6 text-zinc-500">Polite, agreeable, "it depends"</td>
                  <td className="py-6 px-6 text-white bg-amber-500/5 border-x border-amber-500/10 font-bold">Contrarian, falsifiable, "Kill Signals"</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 font-medium">Reasoning Depth</td>
                  <td className="py-6 px-6 text-zinc-500">Surface level</td>
                  <td className="py-6 px-6 text-white bg-amber-500/5 border-x border-amber-500/10 font-bold">Second-order consequences (6mo view)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-6 px-6 font-medium">Context Limit</td>
                  <td className="py-6 px-6 text-zinc-500">Forgets previous details</td>
                  <td className="py-6 px-6 text-white bg-amber-500/5 border-x border-amber-500/10 font-bold">Persists constraints across decisions</td>
                </tr>
                <tr>
                  <td className="py-6 px-6 font-medium">Outcome</td>
                  <td className="py-6 px-6 text-zinc-500">More ideas (Overwhelm)</td>
                  <td className="py-6 px-6 text-white bg-amber-500/5 border-x border-b border-amber-500/10 rounded-b-xl font-bold">Binary Decision (Clarity)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Pricing */}
      <section id="pricing" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Founding Membership</h2>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden">

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-white/5 pb-8">
              <div className="text-left">
                <div className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-1">Monthly Pass</div>
                <div className="text-5xl font-bold text-white">₹99<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-zinc-400 text-sm">Less than a coffee.</p>
                <p className="text-amber-500 text-sm font-medium">Save weeks of indecision.</p>
              </div>
            </div>

            <ul className="space-y-4 text-left mb-10">
              <li className="flex items-center gap-3">
                <Check className="text-amber-500 shrink-0" size={18} />
                <span className="text-white"><strong>Unlimited Decision Analysis</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-amber-500 shrink-0" size={18} />
                <span className="text-white">Access to <strong>Deep Reasoning Model</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-zinc-500 shrink-0" size={18} />
                <span className="text-zinc-300">Kill Signal Dashboard (Coming Soon)</span>
              </li>
            </ul>

            <Link href="/analyze/new" className="block w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition-colors">
              Start Your First Analysis
            </Link>
            <p className="mt-4 text-xs text-zinc-600">Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5 text-center text-zinc-600 text-sm">
        <p>&copy; 2025 Persona AI. Stop Chatting. Start Deciding.</p>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPageContent />
    </Suspense>
  );
}
