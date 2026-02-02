'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { MigrationModal } from './MigrationModal';
import { clsx } from 'clsx';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

interface SignupResponse {
    user: any;
    token?: string;
    hasMigration?: boolean;
    verification_required?: boolean;
    message?: string;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const { signup } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters");
            }

            const result: any = await signup(email, password);

            if (result.verification_required) {
                setIsVerificationSent(true);
            } else if (result.hasMigration) {
                setShowMigration(true);
            } else {
                onClose();
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    if (showMigration) {
        return <MigrationModal
            isOpen={true}
            email={email}
            onConfirm={() => {
                setShowMigration(false);
                onClose();
            }}
            onCancel={() => {
                setShowMigration(false);
                onClose();
            }}
        />;
    }


    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
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

                        {isVerificationSent ? (
                            <div className="text-center py-6">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                        <span className="text-3xl">📧</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Check your email</h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    We sent a verification link to <span className="font-semibold text-gray-800">{email}</span>.
                                    <br />Please click it to activate your account.
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 text-left mb-6">
                                    ⚠️ <strong>Note:</strong> Check your Spam or Promotions folder if you don't see it within 1 minute.
                                </div>
                                <button
                                    onClick={onSwitchToLogin}
                                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-lg transition-all"
                                >
                                    Proceed to Login
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Create account
                                    </Dialog.Title>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">
                                        Join to sync personas across devices
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                                    <div className="space-y-4">
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
                                                    minLength={8}
                                                    autoComplete="new-password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="w-full px-4 py-2.5 rounded-lg outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium bg-transparent"
                                                    placeholder="Min 8 chars"
                                                />
                                            </div>
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
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign Up"}
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-sm text-gray-500">
                                        Already have an account?{' '}
                                        <button onClick={onSwitchToLogin} className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] hover:underline transition-colors">
                                            Log in
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
