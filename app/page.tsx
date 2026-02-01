'use client';

import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Phone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium">Persona AI</Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About</Link>
            <Link href="/chat?upgrade=true" className="px-4 py-1.5 text-sm font-medium bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors">
              Upgrade
            </Link>
            <Link href="/chat" className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
              Start now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
            Decisions under uncertainty.<br />Stripped to reality.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Persona AI is a first-principles advisory system. It doesn't motivate you. It tells you what actually matters.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/chat" className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
              Start thinking clearly
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* What this is */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">What this is</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Persona AI helps you think clearly about hard problems using constraint-driven reasoning.
            No fluff. No comfort. Just tradeoffs.
          </p>
        </div>
      </section>

      {/* What this is NOT */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">What this is NOT</h2>
          <ul className="space-y-3 text-zinc-400 text-lg">
            <li>• Not a chatbot</li>
            <li>• Not a coach</li>
            <li>• Not a motivational tool</li>
            <li>• Not a human</li>
          </ul>
        </div>
      </section>

      {/* Persona Highlight */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-4">Elon-style first-principles thinking</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-4">
            Reasoning inspired by public frameworks and interviews. Simulated. Not a real person.
          </p>
          <p className="text-zinc-500 text-sm">More personas coming soon.</p>
        </div>
      </section>

      {/* How people use it */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">How people use it</h2>
          <ul className="space-y-3 text-zinc-400 text-lg">
            <li>• Career decisions</li>
            <li>• Startup tradeoffs</li>
            <li>• Strategy under uncertainty</li>
            <li>• Hard 'what should I do next' questions</li>
          </ul>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Transparency</h2>
          <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
            <p>Free messages are limited. Conversations are not saved. Depth over volume is intentional.</p>
            <p className="text-zinc-500 text-sm">This keeps the system focused on clarity, not archiving.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">Ask a better question.</h2>
          <Link href="/chat" className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
            Start now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <p>Simulated reasoning. Informational only.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
            <a href="https://www.linkedin.com/in/k-mishra980/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="https://github.com/kmish9685" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              <Github size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
