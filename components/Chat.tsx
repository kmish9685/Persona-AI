"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, User, Bot, AlertCircle, ArrowUp } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import clsx from 'clsx';

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [remaining, setRemaining] = useState<number>(10); // Start with 10 for optimistic UI
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

        try {
            const data = await sendMessage(userMsg.content);
            const aiMsg: Message = { role: 'assistant', content: data.response };

            if (data.remaining_free !== undefined) {
                setRemaining(data.remaining_free);
            }

            // Artificial delay for "thinking" feel if response is too fast? 
            // Nah, speed provides "premium" feel.
            setMessages(prev => [...prev, aiMsg]);
        } catch (e: any) {
            if (e.message.includes("402") || e.message.includes("Payment")) {
                setShowPaywall(true);
                setRemaining(0); // Force limit state
                // Remove the failed user message? Or keep it? 
                // Let's keep it but show error.
                // Actually, standard is to show the paywall overlay immediately.
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: Something went wrong." }]);
            }
        } finally {
            setLoading(false);
            // Re-focus input after send (desktop)
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
        <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 h-14 z-50 flex items-center justify-between px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-sm font-medium tracking-wide text-zinc-200">Persona AI</span>
                </div>

                {/* Header Limit Display (Optional, subtle backup) */}
                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-xs text-zinc-600 font-mono tracking-tight">
                        {remaining > 0 ? `${remaining} free msgs` : 'Limit reached'}
                    </span>
                    <button
                        onClick={() => setShowPaywall(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-colors"
                    >
                        <Zap size={12} className="fill-amber-300" />
                        <span>Upgrade</span>
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-24 pb-36">
                <div className="w-full max-w-3xl mx-auto px-4 md:px-6">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4"
                            >
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                                    <Bot size={32} className="text-zinc-500" />
                                </div>
                                <h2 className="text-xl font-medium text-zinc-200">First-Principles Advisor</h2>
                                <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                                    I don't do small talk. I optimize for truth and leverage. <br />
                                    Ask me how to break your constraints.
                                </p>
                            </motion.div>
                        )}

                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={clsx(
                                    "group flex gap-4 mb-8",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Fixed Icon/Avatar */}
                                <div className={clsx(
                                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1",
                                    msg.role === 'assistant' ? "bg-white/10 text-zinc-200" : "bg-blue-600/20 text-blue-400"
                                )}>
                                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>

                                <div className={clsx(
                                    "flex flex-col max-w-[85%] md:max-w-[75%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={clsx(
                                        "text-base leading-7 whitespace-pre-wrap",
                                        msg.role === 'assistant' ? "text-zinc-100 font-normal" : "text-zinc-400"
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
                            className="flex gap-4 mb-8"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mt-1">
                                <Bot size={16} className="text-zinc-200 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-1 mt-3">
                                <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Floating Input */}
            <div className="fixed bottom-0 inset-x-0 p-6 z-50">
                <div className="max-w-3xl mx-auto relative bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-10 pb-4">

                    {/* Input Container */}
                    <div className={clsx(
                        "relative group transition-opacity duration-300",
                        remaining === 0 ? "opacity-50" : "opacity-100"
                    )}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={remaining > 0 ? "Type a message..." : "Daily limit reached. Upgrade to continue."}
                            className="w-full bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all shadow-xl shadow-black/50 disabled:cursor-not-allowed"
                            disabled={loading || remaining === 0}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading || remaining === 0}
                            className="absolute right-2 top-2 p-2 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all transform active:scale-95"
                        >
                            <ArrowUp size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Footer Transparency & Limit Text */}
                    <div className="flex items-center justify-between mt-3 px-1">
                        <p className="text-[10px] text-zinc-600 font-medium tracking-wide">
                            {remaining === 0 ? (
                                <span className="text-amber-500/80">Limit reached for today.</span>
                            ) : (
                                <span>Free messages left: {remaining} / 10</span>
                            )}
                        </p>

                        <p className="text-[10px] text-zinc-700 font-medium hidden sm:block">
                            Limits ensure our API stays reliable for everyone.
                        </p>
                    </div>
                </div>
            </div>

            {/* Paywall Overlay */}
            {showPaywall && (
                <Paywall
                    onClose={() => setShowPaywall(false)}
                    onSuccess={() => {
                        setRemaining(9999); // Unlimited
                        setShowPaywall(false);
                    }}
                />
            )}
        </div>
    );
}
