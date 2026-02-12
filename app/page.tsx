'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown, Check, X, ArrowRight, Target, Rocket, Briefcase } from 'lucide-react';
import clsx from 'clsx';

function LandingPageContent() {
  const faqs = [
    {
      question: "Is this really unlimited?",
      answer: "Yes. If you upgrade to the Founding Membership (₹99/mo), you get unlimited messages. Free users get 10 messages/day."
    },
    {
      question: "Can I cancel anytime?",
      answer: "No. The Founding Membership is a lifetime price lock, but it is non-refundable. We prioritize committed users."
    },
    {
      question: "Why not just use GPTs?",
      answer: "GPTs are trained to be safe and give you options. Persona AI is fine-tuned to be brutal, opinionated, and first-principles driven. It doesn't hedge."
    },
    {
      question: "Will you add more personas?",
      answer: "Yes. We are training 'Sam Product', 'Naval Angel', and others. Founding Members get instant access to all future personas."
    }
  ];

  const features = [
    {
      icon: <Target className="w-5 h-5 text-orange-500" />,
      title: "First Principles Logic",
      desc: "No analogies. Just physics and economics."
    },
    {
      icon: <Rocket className="w-5 h-5 text-blue-500" />,
      title: "Leverage Optimization",
      desc: "Identify high-leverage activities instantly."
    },
    {
      icon: <Briefcase className="w-5 h-5 text-purple-500" />,
      title: "Founder Psychology",
      desc: "Y-Combinator style brutal feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-[120px]" />
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
                Mission
              </Link>
              <Link
                href="/personas"
                className="px-5 py-2 text-sm font-medium bg-white text-black hover:bg-gray-200 rounded-full transition-all"
              >
                Start Deciding
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 1. Hero Section: Answers > Options */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">Reasoning Engine v2.0 Live</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tighter text-white">
            Stop Chatting.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-blue-400">
              Start Deciding.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            GPTs give you options. Persona AI gives you answers.
            <br className="hidden sm:block" />
            Simulate the minds of Musk, Naval, and Graham.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/personas"
              className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              Get Decisions (Free)
            </Link>
            <Link
              href="#proof"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-full hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              See the Difference
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Proof Section: The Comparison */}
      <section id="proof" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">The "Waffle" vs. The Answer</h2>
            <p className="text-zinc-500">Why top founders stopped using standard ChatGPT.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Standard AI */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-900 rounded-lg"><X size={20} className="text-zinc-500" /></div>
                <h3 className="font-bold text-zinc-500">STANDARD AI</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-900 p-4 rounded-xl rounded-tr-none border border-white/5 text-sm text-zinc-400">
                  Should I raise VC funding?
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-xl rounded-tl-none border border-white/5 text-sm leading-relaxed text-zinc-500">
                  "Raising venture capital is a complex decision. There are pros and cons. On one hand, you get capital. On the other, you lose equity. Consider your market size, growth trajectory..."
                </div>
              </div>
            </div>

            {/* Persona AI */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-orange-500/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-lg"><Check size={20} className="text-black" /></div>
                <h3 className="font-bold text-white">PERSONA AI (Naval Mode)</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-800 p-4 rounded-xl rounded-tr-none text-sm text-white inline-block">
                  Should I raise VC funding?
                </div>
                <div className="bg-[#111] p-6 rounded-xl rounded-tl-none border-l-2 border-blue-500 text-sm leading-relaxed text-gray-200">
                  "If you can grow without it, do not raise. Capital is not the scarce resource; specific knowledge is. Raising money is selling future freedom. Only raise if you are pouring fuel on a fire that is already burning."
                </div>

                {/* Reasoning Component Showcase */}
                <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
                  <div className="bg-zinc-900/80 px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2 text-xs font-medium text-orange-400">
                      <Target size={12} />
                      <span>Reasoning Analysis</span>
                    </div>
                  </div>
                  <div className="p-4 bg-black/50 text-xs font-mono text-zinc-400 space-y-2">
                    <p><span className="text-zinc-500">Framework:</span> Leverage Optimization</p>
                    <p><span className="text-zinc-500">Logic:</span> Capital = permissionless leverage, but Equity = expensive cost.</p>
                    <p><span className="text-zinc-500">Conclusion:</span> Bootstrapping provides higher long-term agency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Multi-Persona Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">One Question.<br />Six Perspectives.</h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                Why settle for one generic answer? In <strong>Multi-Persona Mode</strong>, you get a war room of advisors instantly. Compare First Principles (Elon) against YC Logic (Paul Graham) in real-time.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-3">
                  {['elon', 'naval', 'paul', 'bezos', 'jobs', 'thiel'].map((id) => (
                    <div key={id} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                      <img src={`/personas/${id}.jpg`} alt={id} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-zinc-500 flex items-center">6 Minds working for you</span>
              </div>
            </div>

            {/* Grid Visual Representation */}
            <div className="w-full max-w-lg aspect-[4/3] bg-zinc-900/50 rounded-2xl border border-white/10 p-4 grid grid-cols-2 gap-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              {/* Fake Cards */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-black border border-white/5 rounded-lg p-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 mb-2"></div>
                  <div className="h-2 w-3/4 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-2 w-1/2 bg-zinc-800 rounded"></div>
                </div>
              ))}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <Link href="/personas" className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform whitespace-nowrap">
                  Try Multi-Persona Mode
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing / Features */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Founding Membership</h2>
          <div className="inline-block bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full text-sm font-medium mb-10 border border-orange-500/20">
            Limited Time Price Lock
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Rocket size={100} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-white/5 pb-8">
              <div className="text-left">
                <div className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-1">Lifetime Deal</div>
                <div className="text-5xl font-bold text-white">₹99<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-zinc-400 text-sm">Usually ₹999/mo.</p>
                <p className="text-emerald-400 text-sm font-medium">Early Adopters Only.</p>
              </div>
            </div>

            <ul className="space-y-4 text-left mb-10">
              <li className="flex items-center gap-3">
                <Check className="text-white shrink-0" size={18} />
                <span className="text-zinc-300"><strong>Unlimited Messages</strong> (vs 10/day)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-orange-400 shrink-0" size={18} />
                <span className="text-white">Access <strong>Multi-Persona Mode</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-orange-400 shrink-0" size={18} />
                <span className="text-white">Unlock <strong>Reasoning Breakdown</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-white shrink-0" size={18} />
                <span className="text-zinc-300">Access to all future personas (Sam, Trump)</span>
              </li>
            </ul>

            <Link href="/personas?upgrade=true" className="block w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-colors">
              Lock In ₹99/mo Price
            </Link>
            <p className="mt-4 text-xs text-zinc-600">Cancel anytime. Non-refundable.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5 text-center text-zinc-600 text-sm">
        <p>&copy; 2025 Persona AI. Built for the reckless ones.</p>
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
