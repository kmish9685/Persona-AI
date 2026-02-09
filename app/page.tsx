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
      question: "How is this different from ChatGPT?",
      answer: "ChatGPT is trained to be safe, polite, and generic. Persona AI is fine-tuned to be brutal, opinionated, and first-principles driven. It doesn't hedge."
    },
    {
      question: "Will you add more personas?",
      answer: "Yes. We are training 'Sam Product', 'Naval Angel', and others. Founding Members get instant access to all future personas."
    }
  ];

  const useCases = [
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Startup Founders",
      desc: "Get your pitch deck ripped apart before a VC does. Validate risky ideas fast."
    },
    {
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Product Builders",
      desc: "Stop building features nobody wants. Get a brutal reality check on your roadmap."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "Career Pivots",
      desc: "Thinking of quitting?Get the cold, hard advice your friends are too polite to give."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 overflow-x-hidden">
      {/* Background Decor - Subtle & Premium */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-white">Persona AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-6">
              <Link href="/about" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/pricing" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>

              {/* Glass Button - Minimal */}
              <Link
                href="/chat"
                className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center animate-slide-up">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 sm:mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">Online & Ready to Roast</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tighter text-white">
            Talk to Famous Minds.
          </h1>

          <div className="flex flex-col gap-2 mb-12 max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-normal">
              AI personas that think like real professionals behind closed doors.
            </p>
            <p className="text-lg sm:text-xl text-white font-medium">
              Blunt. Experienced. Unfiltered.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            {/* Glass Button - Hero */}
            <Link
              href="/chat"
              className="
                group relative inline-flex items-center justify-center px-8 py-4 
                bg-white/5 border border-white/10 hover:bg-white/10 text-white 
                font-medium rounded-full text-lg
                transition-all duration-200 backdrop-blur-md
                hover:scale-105 active:scale-95
                "
            >
              Start Chatting Free
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-sm text-zinc-500 font-medium">
              10 free messages/day • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 bg-black border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((item, idx) => (
              <div key={idx} className="bg-[#0A0A0A] border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-4 text-white tracking-tight">
            Same Question.
          </h2>
          <p className="text-xl sm:text-2xl text-zinc-500 text-center mb-16 font-medium">
            Different Answer.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Other AI Card - Fixed Visibility */}
            {/* Removed opacity-60/grayscale to make it visible but distinct */}
            <div className="group bg-[#080808] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 transition-colors">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="p-2 rounded-lg bg-zinc-900 text-zinc-500"><X size={18} /></div>
                <h3 className="font-bold text-zinc-600 tracking-wider text-sm uppercase">Standard AI</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-zinc-900 text-zinc-500 rounded-2xl px-5 py-3 max-w-[90%] text-sm border border-white/5">
                    Should I add more features?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-zinc-900/50 rounded-2xl p-5 max-w-[90%] border border-white/5">
                    <p className="text-sm text-zinc-500 leading-relaxed italic">
                      "Well, it depends on your situation. You might want to consider user feedback, market validation, and..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona AI Card - Highlighted */}
            <div className="relative group bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-white text-black"><Check size={18} /></div>
                <h3 className="font-bold text-white tracking-wider text-sm uppercase">Persona AI</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-zinc-800/50 text-white rounded-2xl px-5 py-3 max-w-[90%] text-sm border border-white/5">
                    Should I add more features?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="relative bg-[#111] rounded-2xl p-5 max-w-[90%] border-l-2 border-white overflow-hidden">
                    <p className="text-[10px] text-zinc-400 mb-2 font-bold uppercase tracking-wider">ELON MODE</p>
                    <p className="text-sm text-white leading-relaxed font-medium">
                      "No. Ship what you have today. Features before users = death.
                      Get 10 paying customers, then add features they demand."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Headless UI) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white tracking-tight">
            Start brutally honest.
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Disclosure key={idx} as="div" className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A] hover:bg-[#111] transition-colors">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 text-left text-sm font-medium text-white focus:outline-none">
                      <span className="text-base font-normal">{faq.question}</span>
                      <ChevronDown
                        className={clsx("h-5 w-5 text-zinc-500 transition-transform duration-200", open ? "rotate-180" : "")}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="px-6 pb-6 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
                        {faq.answer}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </div>

          <div className="mt-16 text-center">
            {/* Glass Button - CTA */}
            <Link
              href="/chat"
              className="
                inline-flex items-center justify-center px-8 py-3 
                bg-white/5 border border-white/10 hover:bg-white/10 text-white 
                font-medium rounded-full text-base
                transition-all duration-200 backdrop-blur-md
                "
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-zinc-500 font-medium">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-zinc-700">
            © 2025 Persona AI • Built for First Principles Thinkers
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
