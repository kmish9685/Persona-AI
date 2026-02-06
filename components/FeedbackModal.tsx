"use client";

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, MessageSquare, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { user } = useUser();
    const [feedback, setFeedback] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit() {
        if (!feedback.trim()) return;

        setSending(true);
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user?.fullName || user?.firstName || 'Anonymous User',
                    email: user?.primaryEmailAddress?.emailAddress || 'anonymous@feedback.com',
                    message: `[PAYWALL FEEDBACK]: ${feedback}`
                }),
            });
            setSent(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error('Feedback failed:', error);
            onClose();
        } finally {
            setSending(false);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm bg-[#18181b] rounded-2xl border border-zinc-800 p-6 shadow-2xl">

                    {!sent ? (
                        <>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <MessageSquare size={18} className="text-zinc-400" />
                                        Wait, one second?
                                    </h3>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        Help us improve. Why didn't you upgrade today?
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-zinc-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <textarea
                                className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none mb-4"
                                placeholder="Too expensive? Not useful? Just browsing?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                autoFocus
                            />

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                                >
                                    Just close
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!feedback.trim() || sending}
                                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? 'Sending...' : (
                                        <>
                                            Submit Feedback <Send size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Send size={24} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Thanks!</h3>
                            <p className="text-sm text-zinc-400">Your feedback helps us behave better.</p>
                        </div>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
