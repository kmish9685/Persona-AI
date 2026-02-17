'use client';

import Link from 'next/link';
import ChatDemoSection from '@/components/landing/ChatDemoSection';
import { Suspense, useState, useEffect } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, Zap, BarChart3, HelpCircle, ChevronLeft, ChevronRight, Sparkles, Clock, Users, TrendingUp, Eye, Shield } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import BoardSection from '@/components/landing/BoardSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import TestimonialSection from '@/components/landing/TestimonialSection';

function LandingPageContent() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const pricing = {
    INR: { monthly: 149, annual: 999, symbol: "₹" },
    USD: { monthly: 3.25, annual: 39, symbol: "$" }
  };

  const frames = [
    {
      title: "The Problem",
      subtitle: "Endless chat, hedged advice, and zero clarity.",
      icon: <X className="text-red-400" size={20} />,
      tag: "Traditional AI",
      content: "Chatbots keep you talking. They say \"it depends\" and give you more options, not fewer. You leave more confused than when you started."
    },
    {
      title: "The Solution",
      subtitle: "Structured analysis. Binary verdict.",
      icon: <Check className="text-emerald-400" size={20} />,
      tag: "Persona Engine",
      content: "We enforce constraints. 6 persona perspectives synthesized into a single verdict, a conviction score, and clear kill signals. Decision compression."
    },
    {
      title: "The Result",
      subtitle: "Execute with absolute confidence.",
      icon: <Zap className="text-amber-400" size={20} />,
      tag: "The Outcome",
      content: "Move from indecision to action in under a minute. No tokens, no noise. Engineering-grade clarity on your most important choices."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-amber-500/30 overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background gradient — subtle amber glow from top */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[90%] h-[50%] bg-gradient-to-b from-amber-500/[0.04] to-transparent rounded-full blur-[100px]" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'rgba(10,10,11,0.8)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Persona AI" className="w-7 h-7 rounded-md" />
              <span className="font-semibold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Persona AI</span>
            </Link>

            <div className="flex items-center gap-4">
              <SignedIn>
                <Link href="/dashboard" className="text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  My Decisions
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <Link href="/login" className="hidden sm:block text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                  Login
                </Link>
                <Link
                  href="/analyze/new"
                  className="px-4 py-2 text-[13px] font-medium bg-amber-500 text-black hover:bg-amber-400 rounded-lg transition-all flex items-center gap-2"
                >
                  Get started <ArrowRight size={13} />
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative z-10 px-6 lg:px-8 pt-24 sm:pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 animate-fade-up" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>The decision engine for builders</span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(40px,6vw,72px)] font-semibold leading-[1.05] mb-6 tracking-[-0.04em] animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Clarify what you<br />
            <span className="text-gradient">already know.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-lg mx-auto text-[16px] leading-relaxed mb-10 animate-fade-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}>
            You don't need another chatbot. You need a <strong className="text-white font-medium">Kill Signal</strong>, a <strong className="text-white font-medium">Binary Verdict</strong>, and a <strong className="text-white font-medium">Values Reality Check</strong>.
          </p>

          {/* 3-Frame Carousel */}
          <div className="relative max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-xl p-8 sm:p-10 min-h-[260px] flex flex-col justify-center relative overflow-hidden group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-hero)' }}>
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4">
                {frames.map((_, i) => (
                  <div key={i} className="h-[2px] flex-1 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                    <div
                      className={`h-full bg-amber-500/80 ${currentFrame === i ? 'w-full' : 'w-0'}`}
                      style={{ transition: currentFrame === i ? 'width 5000ms linear' : 'width 0ms' }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center" key={currentFrame}>
                <div className="mb-4 p-2.5 rounded-lg" style={{ background: 'var(--bg-active)', border: '1px solid var(--border-subtle)' }}>
                  {frames[currentFrame].icon}
                </div>
                <div className="accent-label mb-2">{frames[currentFrame].tag}</div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 tracking-tight">{frames[currentFrame].title}</h2>
                <p className="text-[15px] max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {frames[currentFrame].content}
                </p>
              </div>

              {/* Nav Arrows */}
              <button
                onClick={() => setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
              >
                <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button
                onClick={() => setCurrentFrame((prev) => (prev + 1) % frames.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
              >
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/analyze/new" className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all transform hover:scale-[1.02] font-medium text-[14px] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              Start Analysis (Free) <ArrowRight size={15} />
            </Link>
            <Link href="/personas" className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-medium text-[14px] transition-all flex items-center justify-center gap-2 hover:text-white" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
              Try Advisor Chat <Brain size={15} />
            </Link>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 py-8 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-white">~30s</span>
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>To Full Clarity</span>
            </div>
            <div className="w-px h-10 hidden sm:block" style={{ background: 'var(--border-default)' }} />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-white">6</span>
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Mental Models</span>
            </div>
            <div className="w-px h-10 hidden sm:block" style={{ background: 'var(--border-default)' }} />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-amber-500">4.8/5</span>
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Clarity Score</span>
            </div>
            <div className="w-px h-10 hidden sm:block" style={{ background: 'var(--border-default)' }} />
            <div className="flex flex-col items-center">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map(i => <Check key={i} size={10} className="text-emerald-400" />)}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Founders Approve</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOARDROOM (Personas Showcase) ─── */}
      <BoardSection />

      {/* ─── 2. NOT ANOTHER CHATBOT ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">Not another chatbot.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>We don't chat. We compute decisions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            {/* Standard AI */}
            <div className="p-8 opacity-60" style={{ background: 'var(--bg-base)' }}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-tertiary)' }}>Standard AI</h3>
              <ul className="space-y-3 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> "It depends on your goals..."</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Walls of text</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Zero accountability</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Hallucinates facts</li>
              </ul>
            </div>

            {/* Persona Chatbots */}
            <div className="p-8 opacity-80" style={{ background: 'var(--bg-base)' }}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-secondary)' }}>Persona Chatbots</h3>
              <ul className="space-y-3 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> Fun mimicry</li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0" /> Good for brainstorming</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Still indecisive</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-1 shrink-0" /> Entertainment focused</li>
              </ul>
            </div>

            {/* Persona AI Engine */}
            <div className="p-8 relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Zap size={32} /></div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 mb-6">Decision Engine</h3>
              <ul className="space-y-3 text-[14px] text-white">
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong className="font-medium">Kill Signals (When to quit)</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong className="font-medium">Values Alignment Check</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong className="font-medium">5-Year Visualization</strong></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-1 shrink-0 text-amber-500" /> <strong className="font-medium">Binary Verdict (YES/NO)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ─── */}
      <ComparisonSection />

      {/* ─── CHAT DEMO ─── */}
      <ChatDemoSection />

      {/* ─── 3. REAL OUTCOMES ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">Real outcomes.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>From "maybe" to "move."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            <div className="p-8" style={{ background: 'var(--bg-base)' }}>
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(224,93,93,0.12)', color: '#e05d5d' }}>
                  <ShieldAlert size={11} /> Kill Signal Detected
                </span>
              </div>
              <h3 className="font-semibold text-[17px] mb-4 tracking-tight">"Should I quit my job to build this MVP?"</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--text-tertiary)' }}>User Values</span>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Security &gt; Freedom. 3 month runway.</p>
                </div>
                <div>
                  <span className="accent-label block mb-1">Verdict</span>
                  <p className="text-[14px] text-white leading-relaxed">
                    <strong className="font-semibold">NO (Wait)</strong> — Your values prioritize security, but your runway is too short. <span className="text-red-400 font-medium">Kill Signal:</span> If you don't have a paying pilot in 2 weeks, you will run out of cash.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8" style={{ background: 'var(--bg-base)' }}>
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(77,172,104,0.12)', color: '#4dac68' }}>
                  <TrendingUp size={11} /> High Conviction
                </span>
              </div>
              <h3 className="font-semibold text-[17px] mb-4 tracking-tight">"Which target market should we focus on?"</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--text-tertiary)' }}>User Values</span>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Speed &gt; Quality. Solo Founder.</p>
                </div>
                <div>
                  <span className="accent-label block mb-1">Verdict</span>
                  <p className="text-[14px] text-white leading-relaxed">
                    <strong className="font-semibold">SME/Prosumer</strong> — Enterprise sales take 6 months. You value speed. Do not go upmarket yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">How it works.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>From brain fog to binary verdict in 3 steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[72px] left-[20%] right-[20%] h-px" style={{ background: 'linear-gradient(to right, transparent, var(--accent-subtle), transparent)' }} />

            {[
              {
                num: "01",
                title: "Describe your decision",
                desc: "Type what you're stuck on in plain English. Include your situation, stakes, and constraints.",
                label: "Example Input",
                detail: '"Should I quit my $120K job to build my SaaS full-time? 50 beta users, 5 paying, wife is pregnant, 3 months savings..."'
              },
              {
                num: "02",
                title: "AI computes your decision",
                desc: "6 mental models analyze constraints, extract options, and stress-test every path. ~30 seconds.",
                label: "What happens",
                items: [
                  { color: '#4dac68', text: 'Constraint analysis' },
                  { color: '#f2b84b', text: 'Option stress-testing' },
                  { color: '#e05d5d', text: 'Kill signal detection' },
                ]
              },
              {
                num: "03",
                title: "Get your verdict",
                desc: "A clear YES or NO with conviction score, kill signals, and conditional factors. No hedging.",
                label: "Example Output",
                output: [
                  { key: 'Verdict', value: 'NO (Wait)', color: '#e05d5d' },
                  { key: 'Conviction', value: '87%', color: '#f2b84b' },
                  { key: 'Kill Signal', value: '🔴 Active', color: '#e05d5d' }
                ]
              }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5 text-[13px] font-semibold text-amber-500 transition-all group-hover:bg-amber-500 group-hover:text-black" style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    {step.num}
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  <div className="rounded-lg p-4 text-left" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="accent-label mb-2">{step.label}</div>
                    {step.detail && (
                      <p className="text-[12px] font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.detail}</p>
                    )}
                    {step.items && (
                      <div className="space-y-2">
                        {step.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color, animationDelay: `${idx * 0.2}s` }} />
                            {item.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {step.output && (
                      <div className="space-y-2">
                        {step.output.map((row, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{row.key}</span>
                            <span className="text-[12px] font-semibold" style={{ color: row.color }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/analyze/new" className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-black rounded-lg font-medium text-[14px] hover:bg-amber-400 transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              Try it free <ArrowRight size={15} />
            </Link>
            <p className="text-[12px] mt-3" style={{ color: 'var(--text-tertiary)' }}>2 free analyses · No credit card required</p>
          </div>
        </div>
      </section>

      {/* ─── 5. BUILT FOR BUILDERS ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">Built for builders.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>If you recognize yourself here, this tool was made for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            {[
              { icon: '🔥', title: 'Solo Founders', desc: 'No co-founder to debate with. No board to validate ideas. You need an unbiased second brain.' },
              { icon: '⚡', title: 'Startup CEOs', desc: 'Pivot or double down? Hire or outsource? Fire or coach? High-stakes decisions that keep you up at night.' },
              { icon: '🎯', title: 'Career Switchers', desc: 'Quit the corporate job? Take the offer? Start freelancing? Life-changing decisions need structure, not opinions.' },
              { icon: '💡', title: 'Indie Hackers', desc: 'Which feature to build next? When to launch? How to price? Stop guessing, start computing.' }
            ].map((card, i) => (
              <div key={i} className="p-6 transition-all group hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-base)' }}>
                <div className="text-xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-[14px] text-white mb-2">{card.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-14 border-b" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Decisions Analyzed', color: 'white' },
              { value: '4.8/5', label: 'Clarity Score', color: '#f2b84b' },
              { value: '30s', label: 'Avg. Analysis Time', color: 'white' },
              { value: '92%', label: 'Said "Worth It"', color: '#4dac68' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-semibold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialSection />

      {/* ─── THE CLARITY LOOP ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">The clarity loop.</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { icon: <Target size={22} />, label: '1. Values & Viz', color: '' },
              { icon: <Brain size={22} />, label: '2. Engine', color: 'text-amber-500' },
              { icon: <ShieldAlert size={22} />, label: '3. Kill Signals', color: 'text-emerald-400' },
              { icon: <Zap size={22} />, label: '4. Gut Check', color: 'text-red-400' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                {i > 0 && <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0 mb-2 md:mb-0 md:hidden" />}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all group-hover:border-amber-500/30 ${step.color}`} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                  {step.icon}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{step.label}</span>
              </div>
            ))}
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex justify-between px-24 -mt-10">
            <ArrowRight size={16} style={{ color: 'var(--border-default)' }} />
            <ArrowRight size={16} style={{ color: 'var(--border-default)' }} />
            <ArrowRight size={16} style={{ color: 'var(--border-default)' }} />
          </div>
        </div>
      </section>

      {/* ─── 6. PRICING ─── */}
      <section id="pricing" className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">Simple pricing.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>No tokens. No noise. Clear pricing for clear decisions.</p>
          </div>

          {/* Toggles */}
          <div className="flex flex-col items-center gap-5 mb-14">
            <div className="flex items-center p-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-md text-[13px] font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'hover:text-white'}`}
                style={billingCycle !== 'monthly' ? { color: 'var(--text-secondary)' } : {}}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-md text-[13px] font-medium transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-amber-500 text-black' : 'hover:text-white'}`}
                style={billingCycle !== 'annual' ? { color: 'var(--text-secondary)' } : {}}
              >
                Annual <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded text-[11px] font-semibold">−45%</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[12px] font-medium tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              <button onClick={() => setCurrency('INR')} className={`transition-all uppercase ${currency === 'INR' ? 'text-white' : 'hover:text-zinc-400'}`}>India (INR)</button>
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
              <button onClick={() => setCurrency('USD')} className={`transition-all uppercase ${currency === 'USD' ? 'text-white' : 'hover:text-zinc-400'}`}>International (USD)</button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="rounded-xl p-8 sm:p-10 relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 0 40px rgba(245,158,11,0.05)' }}>
              <div className="absolute top-5 right-6 accent-label px-2.5 py-1 rounded-md" style={{ background: 'var(--accent-subtle)' }}>Founding Member</div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Unlimited Access</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl" style={{ color: 'var(--text-tertiary)' }}>{pricing[currency].symbol}</span>
                  <span className="text-[56px] font-semibold text-white leading-none tracking-tight">{pricing[currency][billingCycle]}</span>
                  <span className="text-[13px] font-medium ml-1" style={{ color: 'var(--text-tertiary)' }}>/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                {billingCycle === 'annual' && currency === 'INR' && (
                  <p className="mt-2 text-[13px] text-amber-500 font-medium">₹83/mo equivalent — annual launch price</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Unlimited Decision Analysis',
                  'All Founder Personas (6+)',
                  'Binary Verdicts & Kill Signals',
                  'Advisor Chat Mode',
                  'Decision History',
                  'Priority Inference'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={14} className="text-amber-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/analyze/new" className="block w-full py-3.5 rounded-lg bg-amber-500 text-black text-center font-medium text-[14px] hover:bg-amber-400 transition-all transform hover:scale-[1.01]">
                Gain Absolute Clarity
              </Link>

              <div className="mt-5 flex items-center justify-center gap-5 opacity-30">
                {['Visa', 'Mastercard', 'Razorpay'].map(p => (
                  <div key={p} className="text-[10px] font-semibold uppercase tracking-wider">{p}</div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-14 text-center text-[10px] font-medium uppercase tracking-[0.15em] flex flex-wrap items-center justify-center gap-4" style={{ color: 'var(--text-tertiary)' }}>
            <span>No token limits</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
            <span>No conversational fluff</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
            <span>Pure decision engineering</span>
          </p>
        </div>
      </section>

      {/* ─── 7. FAQ ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3 tracking-[-0.03em]">FAQ</h2>
          </div>

          <div className="space-y-0 divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {[
              { q: 'Is this just another AI chatbot?', a: 'No. This is a structured decision engine. We prioritize clarity, binary tradeoffs, and kill signals over generic conversational responses.' },
              { q: 'Why not just use ChatGPT?', a: 'ChatGPT is reactive. Our engine enforces reasoning constraints and re-evaluation protocols that generic prompts often miss.' },
              { q: 'Who is this for?', a: 'Founders, builders, and strategic thinkers who need high-conviction decisions — not just stylized opinions.' },
              { q: 'What are "Kill Signals"?', a: 'Specific, falsifiable conditions (e.g. CAC/Runway targets) that, if met, mean you should stop or pivot immediately.' }
            ].map((faq, i) => (
              <div key={i} className="py-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="font-semibold text-[15px] mb-2 flex items-center gap-2 text-white">
                  <HelpCircle size={14} className="text-amber-500 shrink-0" /> {faq.q}
                </h3>
                <p className="text-[14px] leading-relaxed pl-6" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 border-t text-center px-6" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Persona AI" className="w-7 h-7 rounded-md grayscale" />
            <span className="font-semibold text-[15px] tracking-tight" style={{ color: 'var(--text-secondary)' }}>Persona AI</span>
          </div>
          <div className="flex gap-6 text-[13px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            <Link href="/analyze/new" className="hover:text-white transition-colors">Start</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/personas" className="hover:text-white transition-colors">Advisors</Link>
          </div>
          <p className="text-[11px] tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            © 2025 Persona AI. Decision compression for builders.
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
