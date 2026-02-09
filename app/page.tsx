'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown, Check, X, Zap } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Persona AI" className="w-9 h-9 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-zinc-100">Persona AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-6">
              <Link href="/about" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/pricing" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>

              <Link
                href="/chat"
                className="px-5 py-2 text-sm font-bold bg-[#FF9500] hover:bg-orange-400 text-black rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,149,0,0.3)]"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 sm:mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">Online & Ready to Roast</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 tracking-tighter text-white">
            Talk to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Famous Minds.</span><br />
            Get Brutal Opinions.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-12 max-w-2xl mx-auto">
            AI personas that think like real professionals behind closed doors.
            <span className="text-white font-medium"> Blunt. Experienced. Unfiltered.</span>
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/chat"
              className="
                group relative inline-flex items-center justify-center px-8 py-4 
                bg-[#FF9500] hover:bg-orange-400 text-black 
                font-bold rounded-full text-lg
                transition-all duration-200
                hover:scale-105 active:scale-95
                shadow-[0_0_40px_rgba(255,149,0,0.4)]
                "
            >
              Try It Free
              <Zap size={20} className="ml-2 fill-black/20" />
            </Link>

            <p className="text-sm text-zinc-600 font-medium">
              10 free messages/day • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 bg-[#080808]/50 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-16 text-white tracking-tight">
            Same Question. <span className="text-zinc-500">Different Answer.</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Other AI Card */}
            <div className="group bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><X size={20} /></div>
                <h3 className="font-bold text-zinc-500 tracking-wider text-sm uppercase">Standard AI</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-[#0A84FF]/10 text-blue-200 border border-blue-500/20 rounded-2xl px-5 py-3 max-w-[90%]">
                    <p className="text-[10px] font-bold text-[#0A84FF] mb-1 uppercase tracking-wider">You</p>
                    <p className="text-sm">Should I add more features?</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] rounded-2xl p-5 max-w-[90%] border border-white/5">
                    <p className="text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-wider">AI Assistant</p>
                    <p className="text-sm text-zinc-400 leading-relaxed italic">
                      "Well, it depends on your situation. You might want to consider user feedback, market validation, and..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona AI Card */}
            <div className="relative group bg-[#111] border border-[#FF9500]/30 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(255,149,0,0.05)] hover:shadow-[0_0_50px_rgba(255,149,0,0.15)] transition-all">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#FF9500] to-transparent opacity-50" />

              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Check size={20} /></div>
                <h3 className="font-bold text-white tracking-wider text-sm uppercase">Persona AI</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="bg-[#0A84FF]/10 text-blue-100 border border-blue-500/20 rounded-2xl px-5 py-3 max-w-[90%]">
                    <p className="text-[10px] font-bold text-[#0A84FF] mb-1 uppercase tracking-wider">You</p>
                    <p className="text-sm">Should I add more features?</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="relative bg-[#1A1A1A] rounded-2xl p-5 max-w-[90%] border-l-4 border-[#FF9500] overflow-hidden">
                    <div className="absolute inset-0 bg-[#FF9500]/5 pointer-events-none" />
                    <p className="text-[10px] text-[#FF9500] mb-1 font-bold uppercase tracking-wider">Elon Mode</p>
                    <p className="text-sm text-white leading-relaxed font-medium">
                      "No. Ship what you have today. Features before users = death.
                      Get 10 paying customers, then add features they demand.
                      Stop procrastinating."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Headless UI) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 bg-[#0F0F0F] border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Frequency Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Disclosure key={idx} as="div" className="border border-white/10 rounded-2xl overflow-hidden bg-[#141414]">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 text-left text-sm font-medium text-white hover:bg-white/5 transition-colors focus:outline-none">
                      <span className="text-base">{faq.question}</span>
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
                      <Disclosure.Panel className="px-6 pb-4 pt-0 text-sm text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
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
