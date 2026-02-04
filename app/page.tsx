'use client';

import Link from 'next/link';
import { Check, Menu, X } from 'lucide-react';
import { useState, Suspense } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

function LandingPageContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#FF9500]/30 selection:text-white">

      {/* Sticky Header */}
      <nav className="fixed top-0 inset-x-0 z-50 h-[60px] border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Persona AI"
              className="w-10 h-10 rounded-md object-contain"
            />
            <span className="text-sm font-semibold tracking-wide text-white group-hover:text-zinc-200 transition-colors">Persona AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Log In</Link>
            <Link href="/signup" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign Up</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[60px] inset-x-0 bg-[#0A0A0A] border-b border-white/10 z-40 p-4 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            <Link href="/login" className="px-4 py-3 bg-[#1A1A1A] rounded-xl text-center font-medium">Log In</Link>
            <Link href="/signup" className="px-4 py-3 bg-[#1A1A1A] rounded-xl text-center font-medium">Sign Up</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-[100px] pb-24">

        {/* HERO SECTION */}
        <section className="px-6 md:px-8 text-center max-w-[900px] mx-auto mb-16 md:mb-24 animate-slide-up">
          <h1 className="text-[28px] md:text-[56px] font-bold leading-[1.2] md:leading-[1.1] tracking-tight text-white mb-6">
            Stop Getting Polite BS<br />From AI. Get Brutal Truth.
          </h1>

          <p className="text-[16px] md:text-[24px] leading-[1.6] md:leading-[1.4] text-[#A0A0A0] max-w-[700px] mx-auto mb-10">
            AI personas that think like real professionals behind closed doors. Blunt. Experienced. The brutal advice they'd give you in private, not what sounds safe.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/chat"
              className="w-full md:w-auto min-w-[280px] h-[52px] md:h-[56px] flex items-center justify-center bg-[#FF9500] hover:bg-[#FF9500]/90 text-black font-semibold text-[16px] md:text-[18px] rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(255,149,0,0.2)]"
            >
              Try It Free (10 Messages)
            </Link>
            <p className="text-[14px] text-[#6B7280] font-medium">
              No signup • Get brutal answers in seconds
            </p>
          </div>
        </section>


        {/* COMPARISON SECTION */}
        <section className="px-6 md:px-8 max-w-[1200px] mx-auto mb-20 md:mb-32 animate-slide-up-delay-1">
          <h2 className="text-[20px] md:text-[24px] font-semibold text-center mb-10 text-zinc-100">
            Same Question, Different Answer
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">

            {/* LEFT: Other AI */}
            <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 md:p-8 flex flex-col gap-4 md:gap-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <span className="text-xl">❌</span>
                <span className="text-[#6B7280] font-medium uppercase tracking-wider text-sm">Other AI</span>
              </div>

              {/* Q/A */}
              <div className="space-y-4">
                <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/20 p-4 rounded-xl">
                  <p className="text-[#0A84FF] text-xs font-bold mb-1 uppercase">You</p>
                  <p className="text-zinc-200 text-sm md:text-base">Should I add more features?</p>
                </div>
                <div className="bg-[#2A2A2A]/50 border border-white/5 p-4 rounded-xl">
                  <p className="text-zinc-500 text-xs font-bold mb-1 uppercase">AI Assistant</p>
                  <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
                    Well, it really depends on your specific situation. You might want to consider user feedback, market validation, and...
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Persona AI */}
            <div className="flex-1 bg-[#1A1A1A] border border-[#FF9500]/40 rounded-2xl p-5 md:p-8 flex flex-col gap-4 md:gap-6 shadow-[0_0_40px_rgba(255,149,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9500]" />

              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <span className="text-xl">✅</span>
                <span className="text-white font-bold uppercase tracking-wider text-sm">Persona AI</span>
              </div>

              {/* Q/A */}
              <div className="space-y-4">
                <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/20 p-4 rounded-xl">
                  <p className="text-[#0A84FF] text-xs font-bold mb-1 uppercase">You</p>
                  <p className="text-zinc-200 text-sm md:text-base">Should I add more features?</p>
                </div>
                <div className="bg-[#FF9500]/5 border border-[#FF9500]/10 p-4 rounded-xl">
                  <p className="text-[#FF9500] text-xs font-bold mb-1 uppercase">Elon Persona</p>
                  <p className="text-white font-medium text-sm md:text-base leading-relaxed text-[15px]">
                    No. Ship what you have today. Features before users = death. Get 10 paying customers, then add features they demand. Stop procrastinating.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* BULLETS SECTION */}
        <section className="px-6 md:px-8 max-w-[1200px] mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">

            {[
              {
                title: "Not another chatbot.",
                text: "Persona AI is trained to replicate how real professionals think—no hedging, no \"it depends\", just direct answers you'd get from a seasoned advisor in private."
              },
              {
                title: "ChatGPT tells you what you want to hear.",
                text: "Persona AI tells you what you need to know. Get 10 free brutal answers daily. Upgrade to unlimited for ₹299/month—less than one coffee meeting."
              },
              {
                title: "Built by founders, for founders.",
                text: "Every response is capped at 120 words, forced to be actionable, and filtered to remove corporate BS. Test it free—no credit card needed."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 flex items-center justify-center mb-4">
                  <Check size={20} className="text-[#FF9500]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-[#A0A0A0] leading-relaxed text-sm">
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </section>


        {/* FINAL CTA */}
        <section className="px-6 text-center pb-20">
          <Link
            href="/chat"
            className="inline-flex w-full md:w-auto h-[52px] md:h-[56px] items-center justify-center px-8 bg-[#FF9500] hover:bg-[#FF9500]/90 text-black font-semibold text-[16px] md:text-[18px] rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(255,149,0,0.2)]"
          >
            Try It Free (10 Messages)
          </Link>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#2A2A2A] py-10 px-6 text-center text-sm md:text-base bg-[#0A0A0A]">
        <div className="flex flex-wrap justify-center gap-6 text-[#6B7280] mb-6 font-medium">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <p className="text-[#404040]">© 2025 Persona AI. All rights reserved.</p>
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
