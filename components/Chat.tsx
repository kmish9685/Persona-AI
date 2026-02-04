'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Check } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import clsx from 'clsx';
import Link from 'next/link';

// Mock User Data (Replace with real auth later)
const MOCK_USER_EMAIL = "user@example.com";

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [remaining, setRemaining] = useState<number>(10);
    const [dismissedFreshThinking, setDismissedFreshThinking] = useState(false);

    // Dropdown States
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showPersonaMenu, setShowPersonaMenu] = useState(false);
    const [activePersona, setActivePersona] = useState('Elon Manager');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close menus on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-menu-container')) setShowProfileMenu(false);
            if (!target.closest('.persona-menu-container')) setShowPersonaMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial Scroll
    useEffect(() => {
        setTimeout(scrollToBottom, 100);
        const dismissed = localStorage.getItem('freshThinkingDismissed');
        if (dismissed) setDismissedFreshThinking(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleDismissFreshThinking = () => {
        setDismissedFreshThinking(true);
        localStorage.setItem('freshThinkingDismissed', 'true');
    };

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
            setShowPaywall(true);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    return (
        <div className="w-full h-[100dvh] flex flex-col bg-black text-white overflow-hidden font-sans">

            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b border-gray-800 bg-black/95 backdrop-blur">
                <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto w-full">

                    {/* Left: Logo (Clean) */}
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                        <span className="font-semibold text-sm sm:text-base hidden sm:inline-block tracking-tight text-zinc-100">Persona AI</span>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* Persona Switcher */}
                        <div className="relative persona-menu-container">
                            <button
                                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
                            >
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Model:</span>
                                <span className="text-sm font-semibold text-white">{activePersona}</span>
                                <ChevronDown size={14} className="text-zinc-500" />
                            </button>

                            {/* Persona Dropdown */}
                            <AnimatePresence>
                                {showPersonaMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-[#1A1A1A] border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                                    >
                                        <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Select Persona</div>
                                        {['Elon Manager', 'Sam Product', 'Naval Angel'].map((persona) => (
                                            <button
                                                key={persona}
                                                onClick={() => {
                                                    setActivePersona(persona);
                                                    setShowPersonaMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-between"
                                            >
                                                {persona}
                                                {activePersona === persona && <Check size={14} className="text-orange-500" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Message Count */}
                        <span className={clsx("text-xs font-mono hidden sm:block", remaining === 0 ? "text-red-500" : "text-gray-500")}>
                            {remaining}/10
                        </span>

                        {/* Profile Dropdown */}
                        <div className="relative profile-menu-container">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 transition-colors border border-zinc-700"
                            >
                                <User size={16} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-zinc-800/50">
                                            <p className="text-xs font-medium text-zinc-500 uppercase mb-1">Signed in as</p>
                                            <p className="text-sm font-semibold text-white truncate">{MOCK_USER_EMAIL}</p>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={() => setShowPaywall(true)}
                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-orange-500 hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                                            >
                                                Upgrade to Pro
                                                <span className="bg-orange-500/10 text-orange-500 text-[10px] px-1.5 py-0.5 rounded group-hover:bg-orange-500 group-hover:text-black transition-colors">NEW</span>
                                            </button>

                                            <a
                                                href="/api/auth/logout"
                                                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                            >
                                                Log Out
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </header>

            {/* Fresh Thinking Card */}
            {!dismissedFreshThinking && (
                <div className="px-4 py-3 bg-black border-b border-white/5 animate-fade-in relative z-20">
                    <div className="bg-[#1A1A1A] border border-orange-500 rounded-xl p-4 relative max-w-3xl mx-auto shadow-[0_0_20px_rgba(255,149,0,0.1)]">
                        <button
                            onClick={handleDismissFreshThinking}
                            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <h3 className="text-base font-semibold mb-2 text-white flex items-center gap-2">
                            ⚡ FRESH THINKING MODE
                        </h3>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Decisions under uncertainty, stripped to reality.
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Every conversation starts clean. No chat history, no bias from past questions.
                            Just pure, context-free brutal honesty.
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Why? Insights are perishable. Yesterday's advice doesn't apply to today's decisions.
                        </p>

                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">
                            SIMULATED REASONING • NOT A HUMAN
                        </p>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar bg-black">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full opacity-0"></div>
                ) : (
                    <div className="space-y-6 max-w-3xl mx-auto pb-8">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={clsx(
                                            "max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed relative shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-[#0A84FF] text-white rounded-br-none"
                                                : "bg-[#1A1A1A] text-gray-100 rounded-bl-none border border-white/5"
                                        )}
                                    >
                                        <p className={clsx(
                                            "text-[10px] font-bold uppercase mb-1 opacity-70 tracking-wider",
                                            msg.role === 'user' ? "text-blue-100 text-right" : "text-amber-500"
                                        )}>
                                            {msg.role === 'user' ? 'You' : 'Persona AI'}
                                        </p>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 w-full bg-black border-t border-gray-800 px-4 pt-3 pb-safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
                <div className="max-w-3xl mx-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading || remaining === 0}
                            className="
                                w-full bg-[#1A1A1A] border border-gray-700 rounded-full 
                                px-5 py-3.5 pr-14 text-white placeholder-gray-500
                                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                                text-[16px] transition-all
                            "
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading || remaining === 0}
                            className="
                                absolute right-2 top-1/2 -translate-y-1/2
                                w-9 h-9 rounded-full bg-orange-500 
                                flex items-center justify-center
                                disabled:bg-gray-700 disabled:cursor-not-allowed
                                hover:bg-orange-600 transition-transform active:scale-95
                            "
                        >
                            <span className="text-black font-bold text-xl leading-none mb-0.5">↑</span>
                        </button>
                    </div>

                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 leading-tight font-medium">
                        SIMULATED. NOT A REAL PERSON.<br />
                        Free messages: <span className={remaining === 0 ? "text-red-500" : ""}>{remaining}/10</span> • Insight is perishable. Calls not saved.
                    </p>
                </div>
            </div>

            {/* Modals */}
            {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onSuccess={() => setRemaining(9999)} />}
        </div>
    );
}
