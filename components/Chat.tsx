"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowUp } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
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
        <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20">
            <Header
                onShowPersona={() => { }} // No-op, managed internally
                onShowPaywall={() => setShowPaywall(true)}
                remaining={remaining}
            />

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-24 pb-36 select-text">
                <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 select-none"
                            >
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
                                    <RocketIcon size={32} className="text-zinc-500" />
                                </div>
                                <h2 className="text-2xl font-light tracking-tight text-white/90">
                                    Decisions under uncertainty, stripped to reality.
                                </h2>
                                <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                                    An advisory engine serving blunt, first-principles logic optimized for leverage.
                                </p>
                                <p className="text-xs text-zinc-600 mt-3 italic">
                                    Reasoning inspired by Elon Musk's first-principles thinking.
                                </p>
                                <div className="pt-6 border-t border-white/5 mt-2">
                                    <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em]">
                                        Simulated Reasoning • Not a Human
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
                                    "group flex gap-4 mb-8",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Fixed Icon/Avatar */}
                                <div className={clsx(
                                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 select-none transition-transform duration-200 group-hover:scale-105",
                                    msg.role === 'assistant' ? "bg-white/10 text-zinc-200" : "bg-blue-600/20 text-blue-400"
                                )}>
                                    {msg.role === 'assistant' ? <RocketIcon size={16} /> : <User size={16} />}
                                </div>

                                <div className={clsx(
                                    "flex flex-col max-w-[85%] md:max-w-[75%]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={clsx(
                                        "text-base whitespace-pre-wrap select-text py-1 px-1",
                                        msg.role === 'assistant'
                                            ? "text-zinc-100 font-normal leading-[1.7] space-y-3"
                                            : "text-zinc-400 leading-7"
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
                            className="flex gap-4 mb-8 select-none"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mt-1">
                                <RocketIcon size={16} className="text-zinc-200 animate-pulse" />
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
            <div className="fixed bottom-0 inset-x-0 p-4 md:p-6 z-50 pointer-events-none">
                <div className="max-w-4xl mx-auto relative bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-6 pb-4 md:pt-10 md:pb-6 pointer-events-auto">

                    {/* Input Container */}
                    <div className={clsx(
                        "relative group transition-opacity duration-300",
                        remaining === 0 ? "opacity-50" : "opacity-100"
                    )}>
                        <div className="relative overflow-hidden rounded-2xl bg-[#18181b]/90 backdrop-blur-xl border border-white/10 shadow-2xl focus-within:ring-2 focus-within:ring-white/10 focus-within:border-white/20 transition-all">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={remaining > 0 ? "Ask a question..." : "Daily limit reached."}
                                className="w-full bg-transparent pl-5 pr-14 py-4 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed"
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
                    <div className="text-center mt-4 space-y-1.5 select-none">
                        <p className="text-[10px] uppercase tracking-widest text-[#F59E0B]/60 font-medium">
                            Simulated. Not a real person.
                        </p>
                        <p className="text-[10px] text-zinc-600 font-medium tracking-wide">
                            {remaining === 0 ? "Daily limit reached." : `Free messages: ${remaining} / 10`} • Insight is perishable. Calls are not saved.
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
        </div>
    );
}
