'use client';

import Link from 'next/link';
import { Suspense } from 'react';

function LandingPageContent() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Persona AI" className="w-10 h-10 rounded-md opacity-90" />
              <span className="font-bold text-xl tracking-tight">Persona AI</span>
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-6">
              <Link href="/about" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/pricing" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>

              <Link
                href="/chat"
                className="px-5 py-2 text-sm font-semibold bg-[#FF9500] hover:bg-orange-500 text-black rounded-lg transition-colors shadow-lg shadow-orange-500/10"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-white">
            Stop Getting Polite BS<br />From AI. Get Brutal Truth.
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            AI personas that think like real professionals behind closed doors.
            Blunt. Experienced. The brutal advice they'd give you in private,
            not what sounds safe.
          </p>

          <div className="flex flex-col items-center">
            <Link
              href="/chat"
              className="
                inline-flex items-center justify-center px-8 py-4 bg-[#FF9500] text-black 
                font-bold rounded-xl text-lg
                hover:bg-orange-500 transition-all
                transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(255,149,0,0.25)]
                "
            >
              Try It Free (10 Messages)
            </Link>

            <p className="text-sm text-gray-500 mt-4 font-medium">
              No signup • Get brutal answers in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-[#080808] border-y border-white/5 animate-slide-up-delay-1">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-100">
            Same Question, Different Answer
          </h2>

          {/* Mobile: Stacked, Desktop: Side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Other AI Card */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <span className="text-red-500 text-xl">❌</span>
                <h3 className="font-bold text-gray-500 tracking-wider text-sm uppercase">OTHER AI</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#0A84FF]/10 text-blue-200 border border-blue-500/20 rounded-xl px-4 py-3 inline-block max-w-[90%]">
                    <p className="text-xs font-bold text-[#0A84FF] mb-1">YOU</p>
                    <p className="text-sm">Should I add more features?</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#252525] rounded-xl p-4 max-w-[90%]">
                    <p className="text-xs text-gray-500 mb-1 font-bold">AI ASSISTANT</p>
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      "Well, it really depends on your specific situation. You might want to
                      consider user feedback, market validation, and..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona AI Card */}
            <div className="bg-[#1A1A1A] border-2 border-[#FF9500] rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_0_30px_rgba(255,149,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9500]" />
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <span className="text-green-500 text-xl">✅</span>
                <h3 className="font-bold text-white tracking-wider text-sm uppercase">PERSONA AI</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#0A84FF]/10 text-blue-100 border border-blue-500/20 rounded-xl px-4 py-3 inline-block max-w-[90%]">
                    <p className="text-xs font-bold text-[#0A84FF] mb-1">YOU</p>
                    <p className="text-sm">Should I add more features?</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#2A2A2A] rounded-xl p-4 max-w-[90%] border-l-4 border-[#FF9500]">
                    <p className="text-xs text-[#FF9500] mb-1 font-bold">ELON PERSONA</p>
                    <p className="text-sm text-white leading-relaxed font-semibold">
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

      {/* Three Bullets */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#0F0F0F] animate-slide-up-delay-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Bullet 1 */}
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500 text-xl">✓</div>
              <p className="text-sm leading-relaxed text-gray-400">
                <strong className="text-white block mb-2 text-base">Not another chatbot.</strong>
                Persona AI is trained to replicate how real professionals think—no hedging, no "it depends",
                just direct answers you'd get from a seasoned advisor in private.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500 text-xl">✓</div>
              <p className="text-sm leading-relaxed text-gray-400">
                <strong className="text-white block mb-2 text-base">ChatGPT tells you what you want to hear.</strong>
                Persona AI tells you what you need to know. Get 10 free brutal answers daily. Upgrade to unlimited
                for ₹299/month.
              </p>
            </div>

            {/* Bullet 3 */}
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 md:p-8 hover:border-[#333] transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500 text-xl">✓</div>
              <p className="text-sm leading-relaxed text-gray-400">
                <strong className="text-white block mb-2 text-base">Built by founders, for founders.</strong>
                Every response is capped at 120 words, forced to be actionable, and filtered to remove corporate BS.
                Test it free—no credit card needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Contact: <a href="mailto:kmish9685@gmail.com" className="text-gray-400 hover:text-white">kmish9685@gmail.com</a>
          </p>
          <p className="text-sm text-gray-600">
            © 2025 Persona AI. All rights reserved.
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
