'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void;
    onSwitchToForgotPassword: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, onSwitchToForgotPassword }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            onClose();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* 1. Modal Design: Dark backdrop with blur, smooth fade-in */}
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
                                onClick={onClose}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <Dialog.Title className="text-2xl font-bold text-gray-900 tracking-tight">
                                Welcome back
                            </Dialog.Title>
                            <p className="text-sm text-gray-500 mt-2 font-medium">
                                Enter your details to access your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                            <div className="space-y-4">
                                {/* 2. Input Fields: Clean borders, Blue focus ring */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                                    <div className={clsx(
                                        "relative transition-all duration-200 rounded-lg border",
                                        focusedField === 'email' ? "border-blue-500 ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300"
                                    )}>
                                        <input
                                            type="email"
                                            required
                                            autoComplete="off"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-4 py-2.5 rounded-lg outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium bg-transparent"
                                            placeholder="name@work-email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                    <div className={clsx(
                                        "relative transition-all duration-200 rounded-lg border",
                                        focusedField === 'password' ? "border-blue-500 ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300"
                                    )}>
                                        <input
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-4 py-2.5 rounded-lg outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium bg-transparent"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Forgot Password Link */}
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={onSwitchToForgotPassword}
                                        className="text-sm text-[#0A84FF] hover:text-[#0066CC] font-medium hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
                                >
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Don&apos;t have an account?{' '}
                                <button onClick={onSwitchToSignup} className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] hover:underline transition-colors">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
