"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ActivatePremiumModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'email_mismatch' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [gumroadEmail, setGumroadEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [saleId, setSaleId] = useState('');

    useEffect(() => {
        activatePremium();
    }, []);

    async function activatePremium() {
        try {
            // Get sale_id from URL (Gumroad passes this)
            const saleIdParam = searchParams.get('sale_id');

            if (!saleIdParam) {
                setStatus('error');
                setMessage('Missing purchase information. Please contact support.');
                return;
            }

            setSaleId(saleIdParam);

            // Get logged-in user email (if any)
            // You may need to adjust this based on your auth implementation
            const userEmailParam = searchParams.get('email') || '';
            setUserEmail(userEmailParam);

            // Call activation API
            const res = await fetch('/api/activate-premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sale_id: saleIdParam,
                    user_email: userEmailParam
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                setStatus('success');
                setMessage(data.message);
                // Redirect to app after 3 seconds
                setTimeout(() => {
                    router.push('/chat');
                }, 3000);
            } else if (data.status === 'email_mismatch') {
                setStatus('email_mismatch');
                setMessage(data.message);
                setGumroadEmail(data.gumroad_email);
                setUserEmail(data.user_email);
            } else {
                setStatus('error');
                setMessage(data.message || 'Activation failed');
            }
        } catch (e) {
            console.error('Activation error:', e);
            setStatus('error');
            setMessage('An error occurred. Please try again or contact support.');
        }
    }

    async function handleManualVerification() {
        try {
            setStatus('loading');

            const res = await fetch('/api/verify-gumroad-purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sale_id: saleId,
                    user_email: userEmail,
                    confirmed: true
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => {
                    router.push('/chat');
                }, 3000);
            } else {
                setStatus('error');
                setMessage('Verification failed. Please contact support.');
            }
        } catch (e) {
            console.error('Manual verification error:', e);
            setStatus('error');
            setMessage('An error occurred during verification.');
        }
    }

    return (
        <Dialog open={true} onClose={() => { }} className="relative z-50">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-center"
                    >
                        {status === 'loading' && (
                            <>
                                <Loader2 className="w-16 h-16 mx-auto mb-4 text-[#5e6ad2] animate-spin" />
                                <h2 className="text-2xl font-semibold text-white mb-2">Activating Premium...</h2>
                                <p className="text-zinc-400">Please wait while we verify your purchase.</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                <h2 className="text-2xl font-semibold text-white mb-2">Premium Activated!</h2>
                                <p className="text-zinc-400 mb-4">{message}</p>
                                <p className="text-sm text-zinc-500">Redirecting to app...</p>
                            </>
                        )}

                        {status === 'email_mismatch' && (
                            <>
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#5e6ad2]" />
                                <h2 className="text-2xl font-semibold text-white mb-2">Email Mismatch</h2>
                                <p className="text-zinc-400 mb-4">{message}</p>

                                <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
                                    <p className="text-sm text-zinc-400 mb-2">
                                        <span className="font-semibold text-white">Gumroad email:</span> {gumroadEmail}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        <span className="font-semibold text-white">Your email:</span> {userEmail || 'Not logged in'}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-zinc-500">
                                        Please sign in with the email you used on Gumroad, or verify manually if this is your purchase.
                                    </p>
                                    <button
                                        onClick={handleManualVerification}
                                        className="w-full bg-[#5e6ad2] hover:bg-[#6b76e0] text-black font-semibold py-3 rounded-xl transition-all"
                                    >
                                        Yes, This Is My Purchase
                                    </button>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all"
                                    >
                                        Sign In with Correct Email
                                    </button>
                                </div>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                                <h2 className="text-2xl font-semibold text-white mb-2">Activation Failed</h2>
                                <p className="text-zinc-400 mb-6">{message}</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-[#5e6ad2] hover:bg-[#6b76e0] text-black font-semibold py-3 rounded-xl transition-all"
                                >
                                    Return to Home
                                </button>
                            </>
                        )}
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

