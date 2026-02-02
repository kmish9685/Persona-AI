'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium">Persona AI</Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About</Link>
            <Link href="/chat" className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
              Start now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight mb-6 leading-[1.1]">
            Stop Getting Polite BS<br />From AI. Get Brutal Truth.
          </h1>
          <p className="text-lg md:text-xl text-[#A0A0A0] max-w-[700px] mx-auto mb-10 leading-relaxed">
            AI personas that think like real professionals behind closed doors. Blunt. Experienced. The brutal advice they'd give you in private, not what sounds safe.
          </p>
          <Link
            href="/chat"
            className="inline-block px-8 py-4 bg-[#FF9500] text-black rounded-lg font-semibold text-lg hover:bg-[#FFA500] transition-all active:scale-95 shadow-[0_0_30px_rgba(255,149,0,0.3)]"
          >
            Try It Free (10 Messages)
          </Link>
          <p className="text-sm text-[#6B7280] mt-3">
            No signup • Get brutal answers in seconds
          </p>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Same Question, Different Answer
          </h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Other AI */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-xl">❌</span>
                <h3 className="text-base font-semibold text-zinc-400">Other AI</h3>
              </div>

              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-[#0A84FF] text-white px-4 py-3 rounded-xl max-w-[80%] text-sm">
                  Should I add more features?
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-[#252525] text-zinc-400 px-4 py-3 rounded-xl max-w-[80%] text-sm leading-relaxed">
                  Well, it really depends on your specific situation. You might want to consider user feedback, market validation, and...
                </div>
              </div>
            </div>

            {/* Persona AI */}
            <div className="bg-[#252525] border border-[#FF9500]/30 rounded-xl p-6 space-y-4 shadow-[0_0_20px_rgba(255,149,0,0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-500 text-xl">✅</span>
                <h3 className="text-base font-semibold text-white">Persona AI</h3>
              </div>

              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-[#0A84FF] text-white px-4 py-3 rounded-xl max-w-[80%] text-sm">
                  Should I add more features?
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] text-white px-4 py-3 rounded-xl max-w-[80%] text-sm leading-relaxed font-medium">
                  No. Ship what you have today. Features before users = death. Get 10 paying customers, then add features they demand. Stop procrastinating.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Objection Bullets */}
      <section className="py-20 px-6 bg-[#141414] border-t border-[#2A2A2A]">
        <div className="max-w-[800px] mx-auto space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <Check size={24} className="text-[#FF9500]" strokeWidth={3} />
            </div>
            <div>
              <p className="text-lg text-zinc-300 leading-relaxed">
                <span className="font-semibold text-white">Not another chatbot.</span> Persona AI is trained to replicate how real professionals think—no hedging, no "it depends", just direct answers you'd get from a seasoned advisor in private.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <Check size={24} className="text-[#FF9500]" strokeWidth={3} />
            </div>
            <div>
              <p className="text-lg text-zinc-300 leading-relaxed">
                <span className="font-semibold text-white">ChatGPT tells you what you want to hear.</span> Persona AI tells you what you need to know. Get 10 free brutal answers daily. Upgrade to unlimited for ₹299/month—less than one coffee meeting.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <Check size={24} className="text-[#FF9500]" strokeWidth={3} />
            </div>
            <div>
              <p className="text-lg text-zinc-300 leading-relaxed">
                <span className="font-semibold text-white">Built by founders, for founders.</span> Every response is capped at 120 words, forced to be actionable, and filtered to remove corporate BS. Test it free—no credit card needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/chat"
            className="inline-block px-8 py-4 bg-[#FF9500] text-black rounded-lg font-semibold text-lg hover:bg-[#FFA500] transition-all active:scale-95 shadow-[0_0_30px_rgba(255,149,0,0.3)]"
          >
            Try It Free (10 Messages)
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-[#6B7280] mb-4">
            <Link href="/privacy" className="hover:text-white transition-colors hover:underline">
              Privacy Policy
            </Link>
            <span className="text-[#2A2A2A]">|</span>
            <Link href="/terms" className="hover:text-white transition-colors hover:underline">
              Terms of Service
            </Link>
            <span className="text-[#2A2A2A]">|</span>
            <Link href="/refund" className="hover:text-white transition-colors hover:underline">
              Refund Policy
            </Link>
          </div>

          {/* Contact */}
          <div className="text-center text-sm text-[#6B7280] mb-4">
            Contact: <a href="mailto:support@personai.fun" className="hover:text-white transition-colors hover:underline">support@personai.fun</a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-[#6B7280]">
            © 2025 Persona AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
