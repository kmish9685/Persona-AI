'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PersonaSelectionModal } from './PersonaSelectionModal';
import { HowItWorksModal } from '../../components/HowItWorksModal';
import { Zap, LogOut, ChevronDown, User } from 'lucide-react';
import clsx from 'clsx';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface HeaderProps {
    onShowPersona: () => void;
    onShowPaywall: () => void;
    remaining: number;
}

export const Header = ({ onShowPersona, onShowPaywall, remaining }: HeaderProps) => {
    const { user, isLoading, login, signup, logout } = useAuth();
    const [showPersonaModal, setShowPersonaModal] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);

    return (
        <header className="fixed top-0 inset-x-0 h-14 z-50 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl transition-all duration-300">
            {/* Left: Branding & Persona Status */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-default">
                    <img src="/personaai.png" alt="Persona AI" className="w-6 h-6 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium tracking-wide text-zinc-200 group-hover:text-white transition-colors font-display">Persona AI</span>
                </div>
                {/* Active Persona Indicator */}
                <div className="hidden sm:flex flex-col gap-0.5 pl-4 border-l border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Active:</span>
                        <span className="text-xs text-[#5e6ad2]/90 font-medium tracking-wide">Elon</span>
                    </div>
                    <span className="text-[9px] text-zinc-600 tracking-tight">First-principles. Physics over opinion.</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowHowItWorks(true)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors font-medium"
                >
                    How it works
                </button>
                <button
                    onClick={() => setShowPersonaModal(true)}
                    className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all px-4 py-1.5 rounded-full text-xs font-medium shadow-sm group"
                >
                    <span>Switch Persona</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-zinc-400 transition-colors" />
                </button>

                {/* Authenticated User Menu or Upgrade */}
                {!isLoading && user ? (
                    <Menu as="div" className="relative ml-2">
                        <Menu.Button className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5 outline-none group">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-[10px] font-bold text-white tracking-tight">
                                    {(user.email || 'U').substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <span className="hidden sm:inline max-w-[100px] truncate">{user.email}</span>
                            <ChevronDown size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-[#18181b] border border-white/10 shadow-xl focus:outline-none divide-y divide-white/5 ring-1 ring-black/5 z-[100]">
                                <div className="px-4 py-3">
                                    <p className="text-xs text-zinc-500">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate mt-0.5">{user.email}</p>
                                    <p className="text-[10px] text-zinc-500 mt-1 uppercase">Plan: {user.plan}</p>
                                </div>
                                <div className="p-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={onShowPaywall}
                                                className={clsx(
                                                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                                    active ? "bg-[#5e6ad2]/10 text-[#6b76e0]" : "text-[#5e6ad2]"
                                                )}
                                            >
                                                <Zap size={14} />
                                                Upgrade to Pro
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => logout()}
                                                className={clsx(
                                                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                                    active ? "bg-red-500/10 text-red-400" : "text-zinc-400"
                                                )}
                                            >
                                                <LogOut size={14} />
                                                Log Out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                ) : (
                    !isLoading && (
                        <>
                            <span className="hidden md:block text-xs text-zinc-600 font-mono tracking-tight mr-2">
                                {remaining > 0 ? `${remaining}/10 free` : 'Limit reached'}
                            </span>

                            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                <button
                                    onClick={onShowPaywall}
                                    className="px-3.5 py-1.5 text-xs font-medium bg-[#5e6ad2] text-black rounded-lg hover:bg-[#6b76e0] transition-all shadow-[0_0_15px_rgba(94,106,210,0.3)] hover:shadow-[0_0_20px_rgba(94,106,210,0.5)] active:scale-95 flex items-center gap-1.5"
                                >
                                    <Zap size={12} className="fill-black/50" />
                                    Upgrade
                                </button>
                                <button
                                    onClick={() => login()}
                                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => signup()}
                                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </>
                    )
                )}
            </div>

            {/* Modals */}
            <PersonaSelectionModal
                isOpen={showPersonaModal}
                onClose={() => setShowPersonaModal(false)}
            />
            <HowItWorksModal
                isOpen={showHowItWorks}
                onClose={() => setShowHowItWorks(false)}
            />
        </header>
    );
}

