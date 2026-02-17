'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Phone, Mail, ArrowLeft, Send } from 'lucide-react';
import { Suspense } from 'react';

function AboutContent() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setStatus('sent');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-lg tracking-tight text-white">Persona AI</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2">
                            <ArrowLeft size={14} />
                            Back
                        </Link>
                        {/* Glass Button */}
                        <Link href="/chat" className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md">
                            Start now
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 pt-20 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-20 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">About Us.</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Persona AI is built to help you think clearly about hard problems. <br className="hidden md:block" />
                            <span className="text-white">No fluff, no comfort—just constraint-driven reasoning.</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Get in touch
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Failed' : (
                                        <>
                                            Send message <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info & Social Links */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Connect</h2>
                                <div className="space-y-4">
                                    {/* Phone */}
                                    <a href="tel:+917805096980" className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                            <Phone size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Phone</p>
                                            <p className="text-white font-medium">+91 7805096980</p>
                                        </div>
                                    </a>

                                    {/* LinkedIn */}
                                    <a href="https://www.linkedin.com/in/k-mishra980/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                            <Linkedin size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">LinkedIn</p>
                                            <p className="text-white font-medium">k-mishra980</p>
                                        </div>
                                    </a>

                                    {/* GitHub */}
                                    <a href="https://github.com/kmish9685" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                                            <Github size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">GitHub</p>
                                            <p className="text-white font-medium">kmish9685</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-3xl">
                                <h3 className="text-lg font-bold mb-3 text-white">About the creator</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Built with a focus on clarity and first-principles thinking.
                                    Persona AI is disigned to help you make better decisions by stripping away noise and focusing on what matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-black">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-zinc-600 gap-4">
                    <p>© 2025 Persona AI. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
                        <Link href="/chat" className="hover:text-zinc-400 transition-colors">Chat</Link>
                        <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function AboutPage() {
    return (
        <Suspense fallback={null}>
            <AboutContent />
        </Suspense>
    );
}
