'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowUp, Menu, MoreHorizontal, Zap } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import { EmailGateModal } from './EmailGateModal';
import { FreshThinkingCard } from './FreshThinkingCard';
import clsx from 'clsx';
import Link from 'next/link';

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
    const [messageCount, setMessageCount] = useState(0); // Session count
    const [remaining, setRemaining] = useState<number>(10);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial Scroll
    useEffect(() => {
        setTimeout(scrollToBottom, 100);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Handle Sending
    async function handleSend() {
        if (!input.trim() || loading || remaining === 0) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setMessageCount(prev => prev + 1);

        try {
            const data = await sendMessage(userMsg.content);
            const aiMsg: Message = { role: 'assistant', content: data.response };

            if (data.remaining_free !== undefined) {
                setRemaining(data.remaining_free);
                if (data.remaining_free === 0) setTimeout(() => setShowPaywall(true), 1000);
            }
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setShowPaywall(true); // Assuming mainly payment limits causes errors now
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-[#09090b] text-zinc-100 font-sans">

            {/* 1. HEADER (Sticky) */}
            <header className="flex-none h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-40 sticky top-0">
                <button className="p-2 -ml-2 text-zinc-400 hover:text-white">
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="Persona AI"
                        className="w-8 h-8 rounded-md object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm tracking-wide leading-none">Persona AI</span>
                        <span className={clsx(
                            "text-[10px] font-mono leading-tight",
                            remaining === 0 ? "text-red-500" : "text-zinc-500"
                        )}>
                            {remaining}/10 free
                        </span>
                    </div>
                </div>

                <User size={16} className="text-zinc-600" />
            </header>

            {/* 2. MAIN SCROLL AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth overscroll-contain pb-32">
                <div className="max-w-2xl mx-auto flex flex-col min-h-full">

                    {/* Fresh Thinking Card - Always at top of chat stream */}
                    <FreshThinkingCard />

                    {/* Messages */}
                    <div className="px-4 pt-2 pb-4 space-y-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none">
                                <RocketIcon size={48} className="mb-4 text-zinc-500" />
                                <p className="text-sm font-momo text-zinc-500">INITIATED</p>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx(
                                        "flex w-full animate-fade-in",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={clsx(
                                        "max-w-[85%] rounded-2xl p-4 text-[15px] leading-relaxed relative",
                                        msg.role === 'user'
                                            ? "bg-[#0A84FF] text-white rounded-br-none"
                                            : "bg-[#1A1A1A] text-zinc-100 rounded-bl-none border border-white/5"
                                    )}>
                                        {/* Label */}
                                        <p className={clsx(
                                            "text-[10px] font-bold uppercase mb-1 tracking-wider opacity-50",
                                            msg.role === 'user' ? "text-blue-100 text-right" : "text-amber-500/80"
                                        )}>
                                            {msg.role === 'user' ? 'You' : 'Persona AI'}
                                        </p>

                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                <div className="bg-[#1A1A1A] rounded-2xl rounded-bl-none p-4 border border-white/5 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>
            </div>

            {/* 3. STICKY INPUT AREA */}
            <div className="flex-none fixed bottom-0 inset-x-0 bg-[#0A0A0A] border-t border-white/5 z-50 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <div className="max-w-2xl mx-auto space-y-3">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            disabled={loading || remaining === 0}
                            className="w-full bg-[#1A1A1A] text-white placeholder:text-zinc-600 rounded-[24px] pl-4 pr-12 py-3.5 text-[16px] border border-[#2A2A2A] focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-inner"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading || remaining === 0}
                            className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-[#FF9500] hover:bg-[#FFA500] disabled:bg-zinc-800 disabled:text-zinc-600 rounded-full flex items-center justify-center text-black font-bold transition-transform active:scale-95"
                        >
                            <ArrowUp size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-[#4B5563] tracking-wider">
                            Simulated • Not a Real Person
                        </p>
                        <p className="text-[10px] text-[#4B5563]">
                            Free messages: <span className={remaining === 0 ? "text-red-500 font-bold" : "text-zinc-400"}>{remaining}/10</span> • Insight is perishable • Calls not saved
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onSuccess={() => setRemaining(9999)} />}
        </div>
    );
}
