'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#18181b] border border-white/10 p-8 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <Dialog.Title className="text-2xl font-light tracking-tight text-white">
                                        How this actually works
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                                    {/* 1. Core Idea */}
                                    <section>
                                        <h3 className="text-white font-medium mb-2">The core idea</h3>
                                        <p className="text-zinc-400">
                                            You ask a question. The system responds using a specific thinking style—currently Elon-style first principles.
                                            No comfort. No fluff. Just constraints, physics, and reality.
                                        </p>
                                    </section>

                                    {/* 2. Good Questions */}
                                    <section>
                                        <h3 className="text-white font-medium mb-2">Ask better questions</h3>
                                        <p className="text-zinc-400 mb-2">
                                            Vague questions get vague answers. Or dismissive ones. Your choice.
                                        </p>
                                        <ul className="space-y-1 text-zinc-500 text-xs ml-4">
                                            <li>• Include numbers: costs, timelines, scale</li>
                                            <li>• Define constraints: budget, time, resources</li>
                                            <li>• Ask about tradeoffs, not just solutions</li>
                                            <li>• Be specific about what you're optimizing for</li>
                                        </ul>
                                    </section>

                                    {/* 3. Locked Features */}
                                    <section>
                                        <h3 className="text-white font-medium mb-2">Why things are locked</h3>
                                        <p className="text-zinc-400">
                                            Limited personas. Limited free messages. This is intentional design, not a bug.
                                        </p>
                                        <p className="text-zinc-500 text-xs mt-2">
                                            Depth over novelty. Constraints force clarity. If everything were unlimited, you'd treat this like a toy instead of a tool.
                                        </p>
                                    </section>

                                    {/* 4. Ephemeral Chat */}
                                    <section>
                                        <h3 className="text-white font-medium mb-2">Chats are not saved</h3>
                                        <p className="text-zinc-400 mb-2">
                                            Your conversations disappear when you close the tab. This is a feature.
                                        </p>
                                        <ul className="space-y-1 text-zinc-500 text-xs ml-4">
                                            <li>• Forces you to write down what matters</li>
                                            <li>• Prevents dependency on chat history</li>
                                            <li>• Encourages action over archiving</li>
                                        </ul>
                                        <p className="text-zinc-600 text-xs mt-2 italic">
                                            Insight is perishable. Capture it or lose it.
                                        </p>
                                    </section>

                                    {/* 5. Persona Explanation */}
                                    <section>
                                        <h3 className="text-white font-medium mb-2">About personas</h3>
                                        <p className="text-zinc-400">
                                            The current persona (Elon) is a simulated thinking framework—first principles, physics-driven, impatient with vagueness.
                                            It's not a chatbot. It's a lens.
                                        </p>
                                        <p className="text-zinc-500 text-xs mt-2">
                                            More personas are coming. Think of this as a growing toolkit for different types of problems, not a toy collection.
                                        </p>
                                    </section>

                                    {/* 6. Challenge */}
                                    <section className="pt-4 border-t border-white/5">
                                        <p className="text-zinc-400">
                                            If you're still reading this, you're probably overthinking it.
                                        </p>
                                        <p className="text-white text-sm mt-1">
                                            Ask a real question. Include constraints. See what happens.
                                        </p>
                                    </section>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <button
                                        onClick={onClose}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
