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
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Decision Engine for Real Choices — Not Chatbot Noise</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tighter animate-fade-up">
            Stop Chatting.<br />
            <span className="text-gradient">
              Start Deciding.
            </span>
          </h1>

          {/* 3-Frame Carousel */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 sm:p-12 min-h-[320px] sm:min-h-[280px] flex flex-col justify-center relative overflow-hidden group">
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 flex gap-2 p-4">
                {frames.map((_, i) => (
                  <div key={i} className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-amber-500/80 transition-all duration-500 ${currentFrame === i ? 'w-full' : 'w-0'}`}
                      style={{ transitionDuration: currentFrame === i ? '5000ms' : '0ms' }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center animate-fade-in" key={currentFrame}>
                <div className="mb-4 p-3 bg-white/5 rounded-2xl border border-white/10">
                  {frames[currentFrame].icon}
                </div>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
                  {frames[currentFrame].tag}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{frames[currentFrame].title}</h2>
                <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                  {frames[currentFrame].content}
                </p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentFrame((prev) => (prev + 1) % frames.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 uppercase tracking-widest text-xs font-black">
            <Link href="/analyze/new" className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
              Start Decision Analysis <ArrowRight size={16} />
            </Link>
            <Link href="/personas" className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2">
              Try Advisor Chat <Brain size={16} />
            </Link>
          </div>

          {/* Micro-Stats / Usage Proof */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 border-y border-white/5 py-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">~30s</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Process Time</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">6+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Personas Simulated</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-amber-500">4.8/5</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Clarity Rating</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => <Check key={i} size={10} className="text-emerald-500 fill-emerald-500" />)}
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Beta Feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Differentiator Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Why Persona AI?</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">Standard AI is for chatting. Persona AI is for deciding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard AI */}
            <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 opacity-60">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Standard AI</h3>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Hedged "It depends" answers</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> No clear tradeoffs</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Wall of conversational text</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> No accountability</li>
              </ul>
            </div>

            {/* Specialized Personas */}
            <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 opacity-80">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Persona Chatbots</h3>
              <ul className="space-y-4 text-zinc-400 text-sm">
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> Stylized language mimicry</li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> One perspective at a time</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Still conversational/wordy</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> No structured verdict</li>
              </ul>
            </div>

            {/* Persona AI Engine */}
            <div className="p-8 rounded-3xl bg-white/5 border border-amber-500/30 relative overflow-hidden shadow-2xl shadow-amber-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Zap size={40} /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 mb-6">Decision Engine</h3>
              <ul className="space-y-4 text-white text-sm">
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Binary Verdict (YES/NO)</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Conviction Score (0-100%)</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Kill Signals (When to quit)</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> 2nd Order Effects Analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOW VS TELL (THE PROOF) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Show, Don't Tell.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">The difference between a chat and a verdict.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Generic Output */}
            <div className="flex flex-col">
              <div className="mb-4 text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div> Generic AI Output
              </div>
              <div className="flex-1 bg-zinc-900/30 border border-white/5 rounded-2xl p-6 text-zinc-500 font-serif leading-relaxed italic">
                "Deciding whether to pivot is a complex choice that depends on many factors. You should consider your market fit, runway, and team morale. On one hand, staying the course shows grit. On the other hand, pivoting might reveal new opportunities. Perhaps you could try a hybrid approach for a few weeks and reassess..."
              </div>
            </div>

            {/* Persona AI Output */}
            <div className="flex flex-col">
              <div className="mb-4 text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> Persona AI Engine Output
              </div>
              <div className="flex-1 glass-panel border border-amber-500/20 rounded-2xl p-6 font-mono text-sm shadow-xl shadow-amber-500/5">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-zinc-400">VERDICT:</span>
                    <span className="text-green-500 font-black">PIVOT NOW</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-zinc-400">CONVICTION:</span>
                    <span className="text-white font-black">84%</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1 uppercase text-[10px] tracking-widest">Kill Signals:</span>
                    <ul className="space-y-2">
                      <li className="text-red-400/80 pl-2 border-l-2 border-red-500/30">If CAC &gt; $50 in first 48h</li>
                      <li className="text-red-400/80 pl-2 border-l-2 border-red-500/30">If Retention &lt; 20% by week 2</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1 uppercase text-[10px] tracking-widest">Next Action:</span>
                    <p className="text-zinc-200">Kill Option A immediately. Launch MVP-B by Friday.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. USE CASE SCENARIOS */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Real Outcomes.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">From "Maybe" to "Move".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5">
              <h3 className="font-bold text-lg mb-4">"Should I quit my job to build this MVP?"</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest text-[10px] block mb-1">Before:</span>
                  <p className="text-zinc-400">Spent 3 months agonizing over 'what-ifs' and asking friend's opinions.</p>
                </div>
                <div className="text-sm">
                  <span className="text-amber-500 uppercase font-bold tracking-widest text-[10px] block mb-1">After:</span>
                  <p className="text-white">Structured verdict: <strong>NO (Wait)</strong>. Conviction: 82%. Found 3 kill signals related to runway that weren't considered.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5">
              <h3 className="font-bold text-lg mb-4">"Which target market should we focus on?"</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest text-[10px] block mb-1">Before:</span>
                  <p className="text-zinc-400">Team debated for 2 weeks. Everyone had a different 'favorite' niche.</p>
                </div>
                <div className="text-sm">
                  <span className="text-amber-500 uppercase font-bold tracking-widest text-[10px] block mb-1">After:</span>
                  <p className="text-white">Structured verdict: <strong>Enterprise B2B</strong>. Conviction: 75%. Logic: Highest leverage for current skillsets.</p>
                </div>
              </div>
            </div>
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

      {/* 6. PRICING SECTION */}
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
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">FAQ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-amber-500" /> Is this just another AI chatbot?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">No. This is a structured decision engine. We prioritize clarity, binary tradeoffs, and kill signals over generic conversational responses.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-amber-500" /> Why not just use ChatGPT?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">ChatGPT is reactive. Our engine enforces reasoning constraints and re-evaluation protocols that generic prompts often miss.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-amber-500" /> Who is this for?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Founders, builders, and strategic thinkers who need high-conviction decisions, not just stylized opinions.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-amber-500" /> What are "Kill Signals"?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">These are specific, falsifiable conditions (e.g. CAC/Runway targets) that, if met, mean you should stop or pivot immediately.</p>
            </div>
          </div>

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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/5 text-center px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg grayscale" />
            <span className="font-black text-lg tracking-widest text-zinc-400 uppercase">Persona AI</span>
          </div>
          <div className="flex gap-8 text-zinc-500 text-xs font-bold tracking-widest uppercase">
            <Link href="/analyze/new" className="hover:text-white">Start</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/personas" className="hover:text-white">Advisors</Link>
          </div>
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.2em]">
            &copy; 2025 Persona AI. DECISION COMPRESSION FOR BUILDERS.
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
