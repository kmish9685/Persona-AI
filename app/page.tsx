'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, TrendingUp, Clock, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
              <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/analyze/new"
                className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-amber-500 hover:text-black rounded-full transition-all flex items-center gap-2"
              >
                Start Deciding <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center animate-slide-up">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-500 tracking-wide uppercase">The Decision Engine is Live</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tighter text-white">
            Stop Spending <br />
            2 Weeks on Decisions.
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compress your decision cycle to <span className="text-white font-medium">5 minutes</span>.
            <br className="hidden sm:block" />
            Validate assumptions, find kill signals, and execute.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze/new"
              className="px-8 py-4 bg-amber-500 text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Start Analysis (Free) <ArrowRight size={20} />
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-full hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              How it Works
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-600">No credit card required • 1 Free Analysis</p>
        </div>
      </section>

      {/* 2. Problem/Solution (The "Waffle" vs The Engine) */}
      <section id="proof" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Chatbots Waffle. Engines Decide.</h2>
            <p className="text-zinc-500 text-lg">Why founders are switching from standard ChatGPT.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Standard AI */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 opacity-60 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-900 rounded-lg"><X size={20} className="text-red-500" /></div>
                <h3 className="font-bold text-zinc-500 tracking-widest text-sm">STANDARD CHATBOT</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-900 p-4 rounded-xl rounded-tr-none border border-white/5 text-sm text-zinc-400">
                  Should I pivot to B2B?
                </div>
                <div className="bg-zinc-800/50 p-6 rounded-xl rounded-tl-none border border-white/5 text-sm leading-relaxed text-zinc-500">
                  "Pivoting to B2B has pros and cons. B2B often has higher LTV but longer sales cycles. Use a framework like SWOT analysis. Consider your team's strengths..."
                </div>
                <div className="text-xs text-red-500/50 italic font-mono mt-2">
                  → Verdict: "It depends" (Useless)
                </div>
              </div>
            </div>

            {/* Persona AI */}
            <div className="bg-[#0A0A0A] border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-amber-900/10">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-amber-500"><Zap size={80} /></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500 rounded-lg"><Check size={20} className="text-black" /></div>
                <h3 className="font-bold text-white tracking-widest text-sm">DECISION ENGINE</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-800 p-4 rounded-xl rounded-tr-none text-sm text-white inline-block">
                  Should I pivot to B2B?
                </div>
                <div className="bg-[#111] p-6 rounded-xl rounded-tl-none border-l-2 border-amber-500 text-sm leading-relaxed text-gray-200">
                  <strong className="block text-white mb-2 text-lg">Verdict: PIVOT IMMEDIATELY.</strong>
                  "Your runway is 4 months. B2C CAC is invalidating your unit economics. You have 2 warm B2B pilots. Pure survival logic dictates you chase the pilots."
                </div>

                {/* Kill Signals Showcase */}
                <div className="mt-4 border border-red-500/20 rounded-lg overflow-hidden bg-red-900/5">
                  <div className="px-4 py-2 flex items-center gap-2 border-b border-red-500/10">
                    <ShieldAlert size={14} className="text-red-500" />
                    <span className="text-xs font-bold text-red-400 uppercase">Kill Signal Identified</span>
                  </div>
                  <div className="p-3 text-xs text-zinc-400">
                    If Pilot A doesn't close by <span className="text-white">Day 14</span>, kill the company.
                  </div>
                </div>
              </div>
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
