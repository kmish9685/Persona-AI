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
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-0 px-4 scroll-smooth overscroll-contain">
                <div className="w-full max-w-2xl mx-auto flex flex-col justify-end min-h-full pb-32">

                    {/* Fresh Thinking Card (Hidden/Handled) */}
                    {/* Splash Screen - Claude Style */}
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center justify-center text-center space-y-6 select-none my-auto z-10"
                            >
                                <div className="p-1">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                                        {/* Use the new logo */}
                                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-90" />
                                    </div>
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
                                    "group mb-6 z-10 flex w-full",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === 'user' ? (
                                    // User: Bubble (Claude Style - Light Gray/Beige but Dark Mode adapted)
                                    <div className="bg-[#27272a] text-zinc-100 py-3 px-5 rounded-2xl max-w-[85%] text-[16px] leading-relaxed shadow-sm">
                                        {msg.content}
                                    </div>
                                ) : (
                                    // AI: No Bubble (Document Style)
                                    <div className="flex gap-4 max-w-full">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mt-1">
                                            <img src="/logo.png" className="w-5 h-5 opacity-90" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Elon</span>
                                            <div className="text-[16px] md:text-[17px] leading-7 text-zinc-200 font-light whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 mb-6 pl-0"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-transparent flex items-center justify-center mt-1">
                                {/* Loading Spinner - Claude uses a specific one, we use a simple pulse here */}
                                <div className="w-4 h-4 border-2 border-orange-500/50 border-t-orange-500 rounded-full animate-spin" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area - Absolute Bottom Floating Pill */}
            <div className="absolute bottom-0 inset-x-0 p-4 pb-8 z-30 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pt-12">
                <div className="max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-[#18181b] border border-white/10 overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/5 focus-within:ring-orange-500/50 focus-within:border-orange-500/50 transition-all">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything..."
                                className="w-full bg-transparent pl-6 pr-14 py-4 text-[16px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                                disabled={loading || remaining === 0}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading || remaining === 0}
                                className={clsx(
                                    "absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-2xl transition-all duration-300",
                                    input.trim() ? "bg-orange-500 text-black hover:bg-orange-400" : "bg-white/5 text-zinc-600"
                                )}
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-3">
                        <p className="text-[10px] text-zinc-600 font-medium tracking-wide">
                            {remaining === 0 ? "LIMIT REACHED" : `${remaining} free messages remaining`}
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
