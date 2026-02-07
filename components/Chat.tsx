'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Check, LogOut, Sparkles, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import { FeedbackModal } from './FeedbackModal';
import { useClerk, useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import posthog from 'posthog-js';

// Simple Toast Component
function Toast({ message, onClose }: { message: string, onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
        >
            <AlertCircle size={18} className="text-amber-500" />
            <p className="text-sm font-medium">{message}</p>
        </motion.div>
    );
}

export function Chat() {
    const { user } = useUser();
    const { signOut, openSignIn } = useClerk(); // Using openSignIn for modal/redirect
    const searchParams = useSearchParams();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [remaining, setRemaining] = useState<number>(10);
    const [dismissedFreshThinking, setDismissedFreshThinking] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Dropdown States
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showPersonaMenu, setShowPersonaMenu] = useState(false);
    const [activePersona, setActivePersona] = useState('Elon Manager');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial Scroll & Check for Upgrade Trigger
    useEffect(() => {
        setTimeout(scrollToBottom, 100);
        const dismissed = localStorage.getItem('freshThinkingDismissed');
        if (dismissed) setDismissedFreshThinking(true);

        if (searchParams.get('upgrade') === 'true') {
            setShowPaywall(true);
        }

        // Instant Unlock on Payment Success
        if (searchParams.get('payment') === 'success') {
            posthog.capture('payment_success', { plan: 'founding_99' });
            setRemaining(9999);
            setShowPaywall(false);
            setToastMessage("Payment Successful! You are now a Founding Member.");
            // Optional: Clean URL
            router.replace('/chat');
        }
    }, [searchParams, router]);

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
        if (!input.trim() || loading || remaining === 0) {
            // If try to send when remaining is 0 (and button disabled, but just in case)
            if (remaining === 0) {
                if (!user) {
                    openSignIn({ redirectUrl: '/chat' });
                } else {
                    setShowPaywall(true);
                }
            }
            return;
        }

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        posthog.capture('message_sent', {
            persona: activePersona,
            is_authenticated: !!user
        });

        const updatedMessages = [...messages, userMsg];
        try {
            const data = await sendMessage(updatedMessages);
            const aiMsg: Message = { role: 'assistant', content: data.response };

            if (data.remaining_free !== undefined) {
                setRemaining(data.remaining_free);
                if (data.remaining_free === 0) {
                    // Logic: Limit Reached after this message.
                    setTimeout(() => {
                        if (!user) {
                            // 1. Force Login first
                            openSignIn({ redirectUrl: '/chat' });
                        } else {
                            // 2. If already logged in, show Paywall
                            setShowPaywall(true);
                        }
                    }, 1000);
                }
            }
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            // On error (likely 402), check login status
            if (!user) {
                openSignIn({ redirectUrl: '/chat' });
            } else {
                setShowPaywall(true);
            }
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    // Dynamic Sarcastic Empty State
    const getEmptyStateText = () => {
        switch (activePersona) {
            case 'Elon Manager':
                return "Production is at zero. Ask me something useful or go back to work.";
            case 'Sam Product':
                return "The interface is blank because you haven't shipped a prompt yet.";
            case 'Naval Angel':
                return "A quiet mind is good. But a quiet chat won't build you wealth. Ask.";
            default:
                return "Silence is golden, but I'm expensive. Ask me something.";
        }
    };

    const personas = [
        { id: 'Elon Manager', name: 'Elon Manager', locked: false },
        { id: 'Sam Product', name: 'Sam Product', locked: true },
        { id: 'Naval Angel', name: 'Naval Angel', locked: true }
    ];

    return (
        <div className="w-full h-[100dvh] flex flex-col bg-black text-white overflow-hidden font-sans relative">

            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b border-gray-800 bg-black/95 backdrop-blur">
                <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto w-full">

                    {/* Left: Logo (Clean) */}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                        <span className="font-semibold text-sm sm:text-base hidden sm:inline-block tracking-tight text-zinc-100">Persona AI</span>
                    </Link>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* Persona Switcher (Cool & Professional) */}
                        <div className="relative persona-menu-container">
                            <button
                                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 transition-all hover:border-zinc-700 active:scale-95 group"
                            >
                                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">MODEL</span>
                                <div className="h-3 w-[1px] bg-zinc-700 mx-0.5"></div>
                                <span className="text-sm font-semibold text-white tracking-wide">{activePersona}</span>
                                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${showPersonaMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Persona Dropdown */}
                            <AnimatePresence>
                                {showPersonaMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-[#0F0F0F] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/5"
                                    >
                                        <div className="px-4 py-2.5 border-b border-zinc-800/50 bg-zinc-900/30">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Intelligence</p>
                                        </div>

                                        <div className="p-1.5 space-y-0.5">
                                            {personas.map((persona) => (
                                                <button
                                                    key={persona.id}
                                                    onClick={() => {
                                                        if (!persona.locked) {
                                                            setActivePersona(persona.id);
                                                            setShowPersonaMenu(false);
                                                        } else {
                                                            // Locked Logic: Show Toast instead of Paywall
                                                            setToastMessage("Still training. Creator is feeding me their public data...");
                                                            setShowPersonaMenu(false);
                                                        }
                                                    }}
                                                    className={clsx(
                                                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group",
                                                        activePersona === persona.id
                                                            ? "bg-zinc-800 text-white font-medium"
                                                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50",
                                                        persona.locked && "opacity-75"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {persona.name}
                                                        {persona.locked && <Lock size={12} className="text-zinc-600" />}
                                                    </span>
                                                    {activePersona === persona.id && <Check size={14} className="text-[#FF9500]" />}
                                                    {persona.locked && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">LOCKED</span>}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800/50">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={12} className="text-purple-400" />
                                                <p className="text-[10px] text-zinc-400 font-medium italic">
                                                    More coming soon... (if you behave)
                                                </p>
                                            </div>
                                        </div>
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
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all border",
                                    showProfileMenu ? "bg-zinc-700 border-zinc-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                )}
                            >
                                {user?.imageUrl ? (
                                    <img src={user.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={16} />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-2 w-64 bg-[#0F0F0F] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/5"
                                    >
                                        <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Signed in as</p>
                                            <p className="text-sm font-semibold text-white truncate">
                                                {user?.primaryEmailAddress?.emailAddress || "Guest User"}
                                            </p>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setShowPaywall(true);
                                                    setShowProfileMenu(false);
                                                }}
                                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#FF9500] hover:bg-[#FF9500]/10 transition-colors flex items-center justify-between group"
                                            >
                                                <span>Upgrade to Pro</span>
                                                <span className="bg-[#FF9500]/10 text-[#FF9500] text-[10px] px-1.5 py-0.5 rounded border border-[#FF9500]/20 group-hover:border-[#FF9500]/40 transition-colors">NEW</span>
                                            </button>

                                            {!user ? (
                                                <button
                                                    onClick={() => openSignIn({ redirectUrl: '/chat' })}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 mt-1"
                                                >
                                                    <LogIn size={14} />
                                                    Log In / Sign Up
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 mt-1"
                                                >
                                                    <LogOut size={14} />
                                                    Log Out
                                                </button>
                                            )}
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
                    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center px-4 animate-fade-in opacity-80">
                        <h1 className="text-2xl font-bold text-zinc-800 mb-2 select-none tracking-tight">
                            PERSONA AI
                        </h1>
                        <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                            "{getEmptyStateText()}"
                        </p>
                    </div>
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

            {/* Modals and Toasts */}
            {showPaywall && (
                <Paywall
                    onClose={() => {
                        setShowPaywall(false);
                        // Trigger Feedback Modal on Paywall Abandonment
                        setTimeout(() => setShowFeedbackModal(true), 300);
                    }}
                    onSuccess={() => setRemaining(9999)}
                />
            )}
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
            <AnimatePresence>
                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </AnimatePresence>
        </div>
    );
}
