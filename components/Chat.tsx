"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowUp } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import { EmailGateModal } from './EmailGateModal';
import { FreshThinkingCard } from './FreshThinkingCard';
// import { PersonaModal } from './PersonaModal'; // Removed
import { Header } from '../src/components/Header';
import clsx from 'clsx';

// Custom Rocket Icon Component
const RocketIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2L4 14h8v8l8-12h-8V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.2" />
    </svg>
);


export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showEmailGate, setShowEmailGate] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [remaining, setRemaining] = useState<number>(10); // Start with 10 for optimistic UI
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check for upgrade URL parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('upgrade') === 'true') {
            setShowPaywall(true);
            // Remove the parameter from URL
            window.history.replaceState({}, '', '/chat');
        }
    }, []);

    // Check email gate status on mount
    useEffect(() => {
        const emailSubmitted = localStorage.getItem('emailSubmitted');
        const dismissed = localStorage.getItem('emailGateDismissed');
        const dismissDate = localStorage.getItem('emailGateDismissDate');

        // Reset dismissal if it's a new day
        if (dismissDate) {
            const lastDismiss = new Date(dismissDate);
            const today = new Date();
            if (lastDismiss.toDateString() !== today.toDateString()) {
                localStorage.removeItem('emailGateDismissed');
                localStorage.removeItem('emailGateDismissDate');
            }
        }
    }, []);

    // Trigger email gate after 3 messages
    useEffect(() => {
        const emailSubmitted = localStorage.getItem('emailSubmitted');
        const dismissed = localStorage.getItem('emailGateDismissed');

        if (messageCount === 3 && !emailSubmitted && !dismissed) {
            setShowEmailGate(true);
        }
    }, [messageCount]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    async function handleSend() {
        if (!input.trim() || loading || remaining === 0) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Increment message count for email gate trigger
        setMessageCount(prev => prev + 1);

        try {
            const data = await sendMessage(userMsg.content);
            const aiMsg: Message = { role: 'assistant', content: data.response };

            if (data.remaining_free !== undefined) {
                setRemaining(data.remaining_free);

                // Show paywall when messages run out
                if (data.remaining_free === 0) {
                    setTimeout(() => setShowPaywall(true), 1000);
                }
            }

            setMessages(prev => [...prev, aiMsg]);
        } catch (error: unknown) {
            const e = error as Error;
            if (e.message?.includes("402") || e.message?.includes("Payment")) {
                setShowPaywall(true);
                setRemaining(0);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: Something went wrong." }]);
            }
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] supports-[height:100cqh]:h-[100cqh] bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20 overflow-hidden">
            <Header
                onShowPersona={() => { }} // No-op, managed internally
                onShowPaywall={() => setShowPaywall(true)}
                remaining={remaining}
            />

            {/* Chat Area - Flex Grow with Auto Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-4 px-4 scroll-smooth overscroll-contain">
                <div className="w-full max-w-3xl mx-auto flex flex-col justify-end min-h-full pb-4">

                    {/* Fresh Thinking Card - Only show when no messages */}
                    {messages.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 mt-[-60px] md:mt-[-100px] px-4">
                            <div className="pointer-events-auto transform scale-90 md:scale-100 transition-transform">
                                <FreshThinkingCard />
                            </div>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center text-center space-y-6 select-none my-auto z-10 hidden md:flex"
                            >
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-2xl">
                                    <RocketIcon size={40} className="text-zinc-500" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-light tracking-tighter text-white">
                                        Decisions, stripped to reality.
                                    </h2>
                                    <p className="text-base text-zinc-500 max-w-md mx-auto mt-3 leading-relaxed">
                                        An advisory engine serving blunt, first-principles logic.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={clsx(
                                    "group flex gap-3 md:gap-4 mb-6 z-10",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={clsx(
                                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 select-none transition-transform duration-200",
                                    msg.role === 'assistant' ? "bg-zinc-800 text-zinc-200" : "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                )}>
                                    {msg.role === 'assistant' ? <RocketIcon size={16} /> : <User size={16} />}
                                </div>

                                <div className={clsx(
                                    "flex flex-col max-w-[85%] md:max-w-[80%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={clsx(
                                        "text-[15px] md:text-base whitespace-pre-wrap select-text py-2.5 px-4 rounded-2xl",
                                        msg.role === 'assistant'
                                            ? "text-zinc-200 font-light leading-relaxed"
                                            : "bg-[#27272a] text-zinc-100 shadow-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 mb-6 select-none"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mt-1">
                                <RocketIcon size={16} className="text-zinc-200 animate-bounce" />
                            </div>
                            <span className="text-zinc-500 text-sm mt-2 font-mono">Thinking...</span>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-2" />
                </div>
            </div>

            {/* Input Area - Flex None (Sticks to bottom) */}
            <div className="flex-none bg-[#09090b]/95 backdrop-blur-xl border-t border-white/5 p-3 md:p-6 z-20 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Input Container */}
                    <div className={clsx(
                        "relative group transition-opacity duration-300",
                        remaining === 0 ? "opacity-50" : "opacity-100"
                    )}>
                        <div className="relative overflow-hidden rounded-2xl bg-[#18181b] border border-white/10 shadow-lg focus-within:ring-1 focus-within:ring-white/20 focus-within:border-white/20 transition-all hover:border-white/20">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={messages.length === 0 ? "Ask anything..." : "Reply..."}
                                className="w-full bg-transparent pl-4 pr-12 py-3.5 md:pl-5 md:pr-14 md:py-4 text-[16px] md:text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:cursor-not-allowed"
                                disabled={loading || remaining === 0}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading || remaining === 0}
                                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all transform active:scale-95"
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Footer Limits & Warnings */}
                    <div className="flex items-center justify-between px-2 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] uppercase tracking-widest text-[#F59E0B] font-semibold">
                            Simulated Person
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium tracking-wide font-mono">
                            {remaining === 0 ? "LIMIT REACHED" : `${remaining}/10 FREE`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showPaywall && (
                <Paywall
                    onClose={() => setShowPaywall(false)}
                    onSuccess={() => {
                        setRemaining(9999);
                        setShowPaywall(false);
                    }}
                />
            )}

            {showEmailGate && (
                <EmailGateModal
                    isOpen={showEmailGate}
                    onClose={() => setShowEmailGate(false)}
                    onSubmit={(email) => {
                        console.log('Email submitted:', email);
                        // Extend remaining messages by 7
                        setRemaining(prev => prev + 7);
                        setShowEmailGate(false);
                    }}
                />
            )}
        </div>
    );
}
