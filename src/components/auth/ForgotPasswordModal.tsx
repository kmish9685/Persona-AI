'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Loader2, CheckCircle, Mail } from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { forgotPassword } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setIsSuccess(true);
        } catch (err) {
            // Even on error, show success message (security - don't reveal if email exists)
            setIsSuccess(true);
        } finally {
            setIsLoading(false);
        }
    }

    function handleClose() {
        setEmail('');
        setIsSuccess(false);
        onClose();
    }

    function handleBackToLogin() {
        setEmail('');
        setIsSuccess(false);
        onBackToLogin();
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-[400px] bg-transparent">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-xl bg-white p-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>

                        {!isSuccess ? (
                            <>
                                <div className="text-center mb-8">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Reset Your Password
                                    </Dialog.Title>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">
                                        Enter your email and we'll send you a reset link
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                                            Email
                                        </label>
                                        <div className="relative transition-all duration-200 rounded-lg border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium bg-transparent"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#FF9500] hover:bg-[#FFA500] text-black font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(255,149,0,0.3)] hover:shadow-[0_4px_12px_rgba(255,149,0,0.2)] active:scale-[0.98]"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Send Reset Link"}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleBackToLogin}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                    >
                                        ← Back to login
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <Mail size={32} className="text-green-600" />
                                    </div>
                                </div>

                                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-3">
                                    Check Your Email
                                </Dialog.Title>

                                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                    We sent a reset link to <span className="font-semibold text-gray-900">{email}</span>
                                </p>

                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    The link expires in 1 hour.
                                </p>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                    <p className="text-xs text-amber-800 font-medium">
                                        💡 Can't find the email? Check your spam folder!
                                    </p>
                                </div>

                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
                                >
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
