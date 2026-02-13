'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, Zap, MessageSquare, BarChart3, Clock, Quote, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function LandingPageContent() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricing = {
    INR: {
      monthly: 149,
      annual: 999,
      symbol: "₹"
    },
    USD: {
      monthly: 3.25,
      annual: 39,
      symbol: "$"
    }
  };

  const frames = [
    {
      title: "The Problem",
      subtitle: "Endless chat, hedged advice, and zero clarity.",
      icon: <X className="text-red-500" />,
      tag: "Traditional AI",
      content: "Chatbots are designed to keep you talking. They say 'it depends' and give you more options, not fewer. You leave more confused than you started."
    },
    {
      title: "The Solution",
      subtitle: "Structured analysis + Binary Verdict.",
      icon: <Check className="text-emerald-500" />,
      tag: "Persona Engine",
      content: "We enforce constraints. We synthesize 6 persona perspectives to give you a single verdict, a conviction score, and clear kill signals. Decision compression."
    },
    {
      title: "The Result",
      subtitle: "Execute with absolute confidence.",
      icon: <Zap className="text-amber-500" />,
      tag: "The Outcome",
      content: "Move from indecision to action in 5 minutes. No more tokens. No more noise. Just engineering-grade clarity on your most important choices."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
              <span className="font-bold text-lg tracking-tight text-white uppercase tracking-tighter">Persona AI</span>
            </Link>

            <div className="flex items-center gap-6">
              <SignedIn>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  My Decisions
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
                  Start <ArrowRight size={14} />
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-400 uppercase">Decision Engine v2.0</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.1] animate-fade-up text-white">
            Stop Chatting.<br />
            <span className="text-zinc-500">Start Deciding.</span>
          </h1>

          {/* 3-Frame Carousel */}
          <div className="relative max-w-3xl mx-auto mb-16 animate-fade-up delay-100">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 min-h-[300px] flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-all duration-500">
              {/* Progress Bars - Ultra Minimal */}
              <div className="absolute top-0 left-0 right-0 flex gap-4 p-6 opacity-30 group-hover:opacity-60 transition-opacity">
                {frames.map((_, i) => (
                  <div key={i} className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white transition-all duration-500 ${currentFrame === i ? 'w-full' : 'w-0'}`}
                      style={{ transitionDuration: currentFrame === i ? '5000ms' : '0ms' }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center" key={currentFrame}>
                <div className="mb-6 opacity-80">
                  {frames[currentFrame].icon}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] mb-4">
                  {frames[currentFrame].tag}
                </div>
                <h2 className="text-2xl font-medium mb-4 text-white tracking-tight">{frames[currentFrame].title}</h2>
                <p className="text-zinc-400 text-lg max-w-xl leading-relaxed font-light">
                  {frames[currentFrame].content}
                </p>
              </div>

              {/* Navigation Arrows - Minimal */}
              <button
                onClick={() => setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCurrentFrame((prev) => (prev + 1) % frames.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up delay-200">
            <Link href="/analyze/new" className="btn-premium px-8 py-4 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 flex items-center gap-2">
              Start Decision Analysis <ArrowRight size={16} />
            </Link>
            <Link href="/personas" className="btn-premium px-8 py-4 bg-white/5 text-zinc-300 rounded-full border border-white/10 hover:bg-white/10 hover:text-white flex items-center gap-2">
              Advisor Chat <Brain size={16} />
            </Link>
          </div>

          {/* Micro-Stats / Usage Proof - Cleaned */}
          <div className="mt-20 flex flex-wrap justify-center gap-12 border-t border-white/5 pt-12 animate-fade-in delay-300">
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-medium text-white">~30s</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Process Time</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-medium text-white">6+</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Expert Models</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-medium text-white">4.8/5</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">Clarity Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Differentiator Grid - Cleaned */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6 tracking-tight text-white">Why this is different.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
              Most AI tools generate noise. We generate conviction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard AI */}
            <div className="p-8 rounded-3xl border border-white/5 bg-transparent hover:bg-white/[0.02] transition-colors">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8">Standard AI</h3>
              <ul className="space-y-6 text-zinc-400 text-sm font-medium">
                <li className="flex gap-3"><span className="text-zinc-600">—</span> "It depends" answers</li>
                <li className="flex gap-3"><span className="text-zinc-600">—</span> Endless clarification</li>
                <li className="flex gap-3"><span className="text-zinc-600">—</span> Zero accountability</li>
              </ul>
            </div>

            {/* Specialized Personas */}
            <div className="p-8 rounded-3xl border border-white/5 bg-transparent hover:bg-white/[0.02] transition-colors">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8">Role-Play Bots</h3>
              <ul className="space-y-6 text-zinc-400 text-sm font-medium">
                <li className="flex gap-3"><span className="text-zinc-600">—</span> Simulated empathy</li>
                <li className="flex gap-3"><span className="text-zinc-600">—</span> verbose backstories</li>
                <li className="flex gap-3"><span className="text-zinc-600">—</span> No synthesis</li>
              </ul>
            </div>

            {/* Persona AI Engine */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-8">Decision Engine</h3>
              <ul className="space-y-6 text-white text-sm font-medium">
                <li className="flex gap-3"><Check size={14} className="text-amber-500 mt-0.5" /> Binary Verdict (Yes/No)</li>
                <li className="flex gap-3"><Check size={14} className="text-amber-500 mt-0.5" /> Confidence Score</li>
                <li className="flex gap-3"><Check size={14} className="text-amber-500 mt-0.5" /> Kill Signals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Output Comparison - Minimal */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Generic Output */}
            <div className="flex flex-col opacity-40 hover:opacity-100 transition-opacity duration-500">
              <div className="mb-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Generic Output</div>
              <div className="text-zinc-400 font-serif leading-loose italic text-lg">
                "Deciding whether to pivot is a complex choice. On one hand, you have market feedback... on the other hand, you have sunk costs..."
              </div>
            </div>

            {/* Persona AI Output */}
            <div className="flex flex-col">
              <div className="mb-6 text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Engine Verdict</div>
              <div className="glass-panel rounded-2xl p-8 font-mono text-sm shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Pivot Decision</span>
                  <span className="text-emerald-400 font-bold">VERDICT: YES (85%)</span>
                </div>
                <div className="space-y-4 text-zinc-300">
                  <p><span className="text-zinc-500 uppercase text-[10px] tracking-widest block mb-1">Reasoning</span>User growth has flatlined (3% MoM) while CAC doubled. Market signal is negative.</p>
                  <p><span className="text-zinc-500 uppercase text-[10px] tracking-widest block mb-1">Kill Signal Met</span>CAC &gt; LTV for 3 consecutive months.</p>
                  <div className="pt-4 mt-4 border-t border-white/5 text-xs text-zinc-500">
                    Confidence: High • Consensus: 5/6 Personas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Use Case Scenarios - Premium Layout */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-4xl font-medium mb-6 tracking-tight text-white">Engineered for high-stakes choices.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
            {[
              { title: "Founder Dilemmas", desc: "Pivot vs. Persevere, Hiring Execs, Fundraising terms.", icon: <Target className="text-zinc-400" size={20} /> },
              { title: "Product Strategy", desc: "Feature prioritization, Sunset decisions, Pricing models.", icon: <Zap className="text-zinc-400" size={20} /> },
              { title: "Investment Memos", desc: "Go/No-Go on deals, Portfolio allocation, Risk assessment.", icon: <BarChart3 className="text-zinc-400" size={20} /> },
            ].map((item, i) => (
              <div key={i} className="bg-black p-10 hover:bg-zinc-900/50 transition-colors group">
                <div className="mb-6 opacity-50 group-hover:opacity-100 transition-opacity">{item.icon}</div>
                <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. USER JOURNEY FLOW */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">The System.</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-amber-500/50 transition-all">
                <BarChart3 size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">1. Context</span>
            </div>
            <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-amber-500/50 transition-all text-amber-500 shadow-2xl shadow-amber-500/10">
                <Brain size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">2. Engine</span>
            </div>
            <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-emerald-500/50 transition-all text-emerald-500">
                <Target size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">3. Verdict</span>
            </div>
            <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-red-500/50 transition-all text-red-500">
                <ShieldAlert size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">4. Signals</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">No Tokens. No Noise.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">Clear pricing for clear decisions.</p>
          </div>

          {/* Toggles */}
          <div className="flex flex-col items-center gap-6 mb-16">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center p-1 bg-zinc-900 border border-white/5 rounded-full">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Annual <span className="text-[10px] px-2 py-0.5 bg-black/20 rounded-full font-black">Save ~45%</span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-zinc-600">
              <button
                onClick={() => setCurrency('INR')}
                className={`transition-all ${currency === 'INR' ? 'text-white' : 'hover:text-zinc-400'}`}
              >
                India (INR)
              </button>
              <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
              <button
                onClick={() => setCurrency('USD')}
                className={`transition-all ${currency === 'USD' ? 'text-white' : 'hover:text-zinc-400'}`}
              >
                International (USD)
              </button>
            </div>
          </div>

          {/* Single High-Value Card */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel border border-amber-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-amber-500/5 animate-fade-in">
              <div className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Founding Member</div>

              <div className="mb-10 text-center sm:text-left">
                <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Unlimited Access</h3>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-2xl text-zinc-500">{pricing[currency].symbol}</span>
                  <span className="text-7xl font-black text-white">{pricing[currency][billingCycle]}</span>
                  <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                {billingCycle === 'annual' && currency === 'INR' && (
                  <p className="mt-2 text-sm text-amber-500 font-bold italic">Special Annual Launch Price: ₹83/mo equivalent</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>Unlimited Decision Analysis</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>All Founder Personas (6+)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>Binary Verdicts & Kill Signals</span>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>Advisor Chat Mode</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>Decision History Retention</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check size={16} className="text-amber-500" />
                    <span>Priority Inference Logic</span>
                  </li>
                </ul>
              </div>

              <Link href="/analyze/new" className="block w-full py-5 rounded-2xl bg-white text-black text-center font-black text-lg hover:bg-zinc-200 transition-all transform hover:scale-[1.02] shadow-xl shadow-white/10 flex items-center justify-center gap-2">
                Gain Absolute Clarity <Zap size={18} className="fill-black" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-6 grayscale opacity-40">
                <div className="text-[10px] font-bold uppercase tracking-widest">Visa</div>
                <div className="text-[10px] font-bold uppercase tracking-widest">Mastercard</div>
                <div className="text-[10px] font-bold uppercase tracking-widest">Stripe</div>
                <div className="text-[10px] font-bold uppercase tracking-widest">Razorpay</div>
              </div>
            </div>
          </div>

          <p className="mt-16 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] flex flex-wrap items-center justify-center gap-6">
            <span>NO TOKEN LIMITS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800"></span>
            <span>NO CONVERSATIONAL FLUFF</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800"></span>
            <span>PURE DECISION ENGINEERING</span>
          </p>
        </div>
      </section>

      {/* 7. FAQ Section */}
      {/* 6. Precision FAQ */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-medium mb-4 tracking-tight text-white">Common Questions.</h2>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Is this just a wrapper around ChatGPT?</h3>
              <p className="text-zinc-400 text-base leading-relaxed font-light">
                No. We use a multi-agent "Council" architecture. Your prompt is debated by 6 distinct personas (The Skeptic, The Visionary, The CFO, etc.) before a synthesis engine acts as the "Judge" to deliver a final verdict.
              </p>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">What are "Kill Signals"?</h3>
              <p className="text-zinc-400 text-base leading-relaxed font-light">
                Most advice is open-ended. Kill Signals are specific, falsifiable conditions (e.g., "If CAC &gt; $50 for 3 days") that trigger an immediate stop. We force you to define failure states upfront.
              </p>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Can I export the reports?</h3>
              <p className="text-zinc-400 text-base leading-relaxed font-light">
                Yes. All decisions are saved in your dashboard and can be exported as structured PDFs or Notion pages to share with stakeholders or investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Micro-Testimonial */}
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-zinc-900/40 border border-white/5 relative">
        <Quote className="absolute -top-4 -left-4 text-amber-500/20" size={60} />
        <p className="text-zinc-400 italic text-lg text-center mb-6">
          "Helped me cut through 3 weeks of indecision in under 2 minutes. The binary verdict is brutal but exactly what I needed."
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
          <div className="text-left">
            <div className="text-xs font-black uppercase tracking-widest">Early Beta User</div>
            <div className="text-[10px] text-zinc-600">SaaS Founder</div>
          </div>
        </div>
      </div>

      {/* Footer - Minimal */}
      <footer className="py-24 bg-black border-t border-white/5 text-center px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded-lg bg-zinc-800"></div>
            <span className="font-medium text-sm tracking-wide text-zinc-400 uppercase">Persona AI</span>
          </div>

          <div className="flex gap-10 text-zinc-500 text-[11px] font-bold tracking-[0.2em] uppercase">
            <Link href="/analyze/new" className="hover:text-white transition-colors">Start</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/personas" className="hover:text-white transition-colors">Methodology</Link>
          </div>

          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.2em]">
            &copy; 2025 Persona AI. Engineered for Clarity.
          </p>
        </div>
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
