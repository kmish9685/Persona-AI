'use client';

import Link from 'next/link';
import ChatDemoSection from '@/components/landing/ChatDemoSection';
import { Suspense, useState, useEffect } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, Zap, BarChart3, HelpCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import BoardSection from '@/components/landing/BoardSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import TestimonialSection from '@/components/landing/TestimonialSection';

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
            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">The "Just Tell Me What To Do" Engine</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tighter animate-fade-up">
            Clarify what you<br />
            <span className="text-gradient">
              already know.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-500 text-lg sm:text-xl mb-10 leading-relaxed">
            You don't need another generic chatbot. You need a <strong>Kill Signal</strong>, a <strong>Binary Verdict</strong>, and a <strong>Values Reality Check</strong>.
          </p>

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
              Start Analysis (Free) <ArrowRight size={16} />
            </Link>
            <Link href="/personas" className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2">
              Try Advisor Chat <Brain size={16} />
            </Link>
          </div>

          {/* Micro-Stats / Usage Proof */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 border-y border-white/5 py-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">~30s</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">To 5-Year Clarity</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">5+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Mental Models</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-amber-500">4.8/5</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Clarity Score</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => <Check key={i} size={10} className="text-emerald-500 fill-emerald-500" />)}
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Founders Approve</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: THE BOARDROOM (Personas Showcase) */}
      <BoardSection />

      {/* 2. Differentiator Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Not Another Chatbot.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">We don't chat. We compute decisions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard AI */}
            <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 opacity-60">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Standard AI</h3>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> "It depends on your goals..."</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Walls of text</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Zero accountability</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Hallucinates facts</li>
              </ul>
            </div>

            {/* Persona Chatbots */}
            <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5 opacity-80">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Persona Chatbots</h3>
              <ul className="space-y-4 text-zinc-400 text-sm">
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> Fun mimicry</li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> Good for brainstorming</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Still indecisive</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Entertainment focused</li>
              </ul>
            </div>

            {/* Persona AI Engine */}
            <div className="p-8 rounded-3xl bg-white/5 border border-amber-500/30 relative overflow-hidden shadow-2xl shadow-amber-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Zap size={40} /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 mb-6">Decision Engine</h3>
              <ul className="space-y-4 text-white text-sm">
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Kill Signals (When to quit)</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Values Alignment Check</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>5-Year Visualization</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong>Binary Verdict (YES/NO)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: COMPARISON SECTION (Show vs Tell) */}
      <ComparisonSection />

      {/* NEW: CHAT DEMO SECTION (Proves the "Chat" feature) */}
      <ChatDemoSection />

      {/* 4. USE CASE SCENARIOS */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Real Outcomes.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">From "Maybe" to "Move".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Kill Signal Detected</div>
              </div>
              <h3 className="font-bold text-lg mb-4">"Should I quit my job to build this MVP?"</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest text-[10px] block mb-1">User Values:</span>
                  <p className="text-zinc-400">Security &gt; Freedom. 3 month runway.</p>
                </div>
                <div className="text-sm">
                  <span className="text-amber-500 uppercase font-bold tracking-widest text-[10px] block mb-1">Verdict:</span>
                  <p className="text-white">Structured verdict: <strong>NO (Wait)</strong>. <br />Reason: Your values prioritize security, but your runway is too short. <strong>Kill Signal:</strong> If you don't have a paying pilot in 2 weeks, you will run out of cash.</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">High Conviction</div>
              </div>
              <h3 className="font-bold text-lg mb-4">"Which target market should we focus on?"</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-zinc-500 uppercase font-bold tracking-widest text-[10px] block mb-1">User Values:</span>
                  <p className="text-zinc-400">Speed &gt; Quality. Solo Founder.</p>
                </div>
                <div className="text-sm">
                  <span className="text-amber-500 uppercase font-bold tracking-widest text-[10px] block mb-1">Verdict:</span>
                  <p className="text-white">Structured verdict: <strong>SME/Prosumer</strong>. <br />Reason: Enterprise sales take 6 months. You value speed. Do not go upmarket yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Visual 3-Step Walkthrough */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">How It Works.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">From brain fog to binary verdict in 3 steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 font-black text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Describe Your Decision</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  Type what you're stuck on in plain English. Include your situation, stakes, and constraints. No forms to fill. No jargon needed.
                </p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 text-left">
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Example Input</div>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    "Should I quit my $120K job at Google to build my SaaS full-time? I have 50 beta users, 5 paying, wife is pregnant, 3 months savings..."
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 font-black text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Computes Your Decision</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  6 mental models analyze your constraints, extract options, and stress-test every path. Takes ~30 seconds. No back-and-forth chat needed.
                </p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 text-left">
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">What Happens</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Constraint Analysis
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} /> Option Stress-Testing
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }} /> Kill Signal Detection
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 font-black text-lg mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Get Your Verdict</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  A clear YES or NO with conviction score, kill signals, and conditional factors. No hedging. No "it depends." Just clarity.
                </p>
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 text-left">
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Example Output</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Verdict:</span>
                      <span className="text-xs font-bold text-red-400">NO (Wait)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Conviction:</span>
                      <span className="text-xs font-bold text-amber-500">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Kill Signal:</span>
                      <span className="text-xs font-bold text-red-500">🔴 Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/analyze/new" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              Try It Free <ArrowRight size={16} />
            </Link>
            <p className="text-zinc-600 text-xs mt-4 uppercase tracking-widest">2 free analyses · No credit card</p>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR - ICP Self-Identification */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">Built For Builders.</h2>
            <p className="text-zinc-500 text-lg uppercase tracking-widest text-xs font-bold">If you recognize yourself here, this tool was made for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-amber-500/20 transition-all group">
              <div className="text-2xl mb-4">🔥</div>
              <h3 className="font-bold text-white mb-2 text-sm">Solo Founders</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">No co-founder to debate with. No board to validate ideas. You need an unbiased second brain.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-amber-500/20 transition-all group">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="font-bold text-white mb-2 text-sm">Startup CEOs</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">Pivot or double down? Hire or outsource? Fire or coach? High-stakes decisions that keep you up at night.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-amber-500/20 transition-all group">
              <div className="text-2xl mb-4">🎯</div>
              <h3 className="font-bold text-white mb-2 text-sm">Career Switchers</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">Quit the corporate job? Take the offer? Start freelancing? Life-changing decisions need structure, not opinions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-amber-500/20 transition-all group">
              <div className="text-2xl mb-4">💡</div>
              <h3 className="font-bold text-white mb-2 text-sm">Indie Hackers</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">Which feature to build next? When to launch? How to price? Stop guessing, start computing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR - Enhanced Social Proof */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-black border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">500+</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Decisions Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-500 mb-1">4.8/5</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Clarity Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">30s</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Avg. Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-500 mb-1">92%</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Said "Worth It"</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: TESTIMONIALS */}
      <TestimonialSection />

      {/* 5. USER JOURNEY FLOW */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter uppercase">The Clarity Loop.</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-amber-500/50 transition-all">
                <Target size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">1. Values & Viz</span>
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
                <ShieldAlert size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">3. Kill Signals</span>
            </div>
            <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-red-500/50 transition-all text-red-500">
                <Zap size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">4. Gut Check</span>
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
