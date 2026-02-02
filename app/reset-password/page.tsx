'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/AuthContext';
import { Loader2, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const router = useRouter();
    const { resetPassword } = useAuth();

    useEffect(() => {
        // Check if we have a recovery token in the URL hash
        // Supabase format: #access_token=xxx&type=recovery
        const hash = window.location.hash;
        if (hash.includes('access_token') && hash.includes('type=recovery')) {
            setHasToken(true);
        } else {
            setError('Invalid or expired reset link. Please request a new one.');
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(newPassword);

            // SECURITY: Logout immediately so they have to sign in with new credentials
            try {
                const { createClient } = require('@supabase/supabase-js');
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                await supabase.auth.signOut();
            } catch (e) {
                console.error('Logout error:', e);
            }

            setIsSuccess(true);

            // Redirect to homepage with login modal after 2 seconds
            setTimeout(() => {
                router.push('/?login=true');
            }, 2000);
        } catch (err) {
            setError((err as Error).message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    }

    if (!hasToken && !error) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 size={32} className="animate-spin text-white mx-auto" />
                    <p className="text-zinc-400 mt-4">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
            <div className="w-full max-w-[400px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white p-8 shadow-2xl"
                >
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Create New Password
                                </h1>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Enter a strong password for your account
                                </p>
                            </div>

                            {error && !hasToken && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle size={16} className="flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{error}</p>
                                            <button
                                                onClick={() => router.push('/?forgot-password=true')}
                                                className="text-red-700 hover:underline font-semibold mt-1"
                                            >
                                                Request a new reset link →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {hasToken && (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                minLength={8}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium transition-all"
                                                placeholder="Min 8 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {newPassword && newPassword.length < 8 && (
                                            <p className="text-xs text-red-500 mt-1 ml-1">
                                                Password must be at least 8 characters
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium transition-all"
                                                placeholder="Re-enter password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1 ml-1">
                                                Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    {error && hasToken && (
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
                                        disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                                        className="w-full bg-[#FF9500] hover:bg-[#FFA500] text-black font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(255,149,0,0.3)] hover:shadow-[0_4px_12px_rgba(255,149,0,0.2)] active:scale-[0.98]"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Reset Password"}
                                    </button>
                                </form>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Password Reset Successful!
                            </h2>

                            <p className="text-sm text-gray-600 mb-4">
                                Redirecting to login...
                            </p>

                            <div className="flex justify-center">
                                <Loader2 size={20} className="animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
