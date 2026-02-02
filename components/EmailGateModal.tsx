"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EmailGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}

export function EmailGateModal({ isOpen, onClose, onSubmit }: EmailGateModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            // Call backend API - use the correct endpoint
            const response = await fetch('https://persona-ai-production.up.railway.app/email-capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    source: 'chat_gate'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit email');
            }

            const data = await response.json();

            // Store in localStorage
            localStorage.setItem('emailSubmitted', 'true');
            localStorage.setItem('emailSubmitDate', new Date().toISOString());
            localStorage.setItem('userEmail', email.toLowerCase().trim());

            // Call onSubmit callback
            onSubmit(email);
            setEmail('');
        } catch (err) {
            console.error('Email submission error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Mark as dismissed for today
        localStorage.setItem('emailGateDismissed', 'true');
        localStorage.setItem('emailGateDismissDate', new Date().toISOString());
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="relative w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl p-8 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* Headline */}
                            <h2 className="text-2xl font-bold text-white">
                                Quick Question Before We Continue
                            </h2>

                            {/* Body */}
                            <p className="text-base text-zinc-400 leading-relaxed">
                                Mind sharing your email? You'll get <span className="text-white font-medium">7 more messages today</span>, plus we can:
                            </p>
                            <ul className="text-base text-zinc-400 leading-relaxed space-y-2 ml-4">
                                <li>• Let you know when we launch new expert personas</li>
                                <li>• Share useful startup insights (optional, 1x/week)</li>
                            </ul>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0F0F0F] border border-white/10 focus:border-[#FF9500] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 text-white placeholder:text-zinc-600 px-4 py-3 rounded-lg text-base transition-all"
                                    disabled={loading}
                                    required
                                />

                                {error && (
                                    <p className="text-sm text-red-400">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email.trim()}
                                    className="w-full bg-[#FF9500] hover:bg-[#FFA500] text-black font-semibold px-6 py-3.5 rounded-lg text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    {loading ? 'Submitting...' : 'Continue (7 Free Messages)'}
                                </button>

                                {/* Subtext */}
                                <p className="text-center text-xs text-zinc-600 mt-2">
                                    5 seconds • We hate spam too
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
