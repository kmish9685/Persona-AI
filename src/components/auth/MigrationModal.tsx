'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';

interface MigrationModalProps {
    isOpen: boolean;
    email: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function MigrationModal({ isOpen, email, onConfirm, onCancel }: MigrationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { migratePremium } = useAuth();

    async function handleConfirm() {
        setIsLoading(true);
        try {
            await migratePremium(email);
            onConfirm();
        } catch (e) {
            console.error(e);
            alert("Migration failed. Please contact support.");
            onCancel();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onCancel} className="relative z-[60]">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md bg-transparent">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-xl bg-white p-6 shadow-2xl border border-amber-200"
                    >
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 text-amber-500 mb-4 ring-8 ring-amber-50/50">
                                <Check size={28} strokeWidth={2.5} />
                            </div>
                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                Premium Plan Detected
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-500 mt-2 leading-relaxed">
                                We found an active Premium plan linked to your IP address.
                                Would you like to transfer it to your new account <span className="font-semibold text-gray-900">{email}</span>?
                            </Dialog.Description>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
                            >
                                No, keep on IP
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                                    <>
                                        <span>Transfer Plan</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
