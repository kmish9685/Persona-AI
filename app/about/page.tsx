'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Phone, Mail, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setStatus('sent');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm font-medium">Persona AI</Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2">
                            <ArrowLeft size={14} />
                            Back
                        </Link>
                        <Link href="/chat" className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors">
                            Start now
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">About</h1>
                        <p className="text-lg text-zinc-400 max-w-2xl">
                            Persona AI is built to help you think clearly about hard problems. No fluff, no comfort—just constraint-driven reasoning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-light mb-6">Get in touch</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm text-zinc-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm text-zinc-400 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send message'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info & Social Links */}
                        <div>
                            <h2 className="text-2xl font-light mb-6">Connect</h2>
                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Phone size={20} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Phone</p>
                                        <a href="tel:+917805096980" className="text-white hover:text-zinc-300 transition-colors">
                                            +91 7805096980
                                        </a>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Linkedin size={20} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">LinkedIn</p>
                                        <a
                                            href="https://www.linkedin.com/in/k-mishra980/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-zinc-300 transition-colors"
                                        >
                                            k-mishra980
                                        </a>
                                    </div>
                                </div>

                                {/* GitHub */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Github size={20} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">GitHub</p>
                                        <a
                                            href="https://github.com/kmish9685"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-zinc-300 transition-colors"
                                        >
                                            kmish9685
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="text-sm font-medium mb-2">About the creator</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Built with a focus on clarity and first-principles thinking.
                                    Persona AI is designed to help you make better decisions by stripping away noise and focusing on what matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-600">
                    <p>Simulated reasoning. Informational only.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
                        <Link href="/chat" className="hover:text-zinc-400 transition-colors">Chat</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
