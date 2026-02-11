"use client";

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { X, Zap, Check, ChevronDown } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import clsx from 'clsx';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
}

const countries = [
    { id: 'IN', name: 'India (₹ INR)', price: '₹99', symbol: '₹' },
    { id: 'US', name: 'United States ($ USD)', price: '$6.7', symbol: '$' },
];

export function Paywall({ onClose, onSuccess }: PaywallProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // Manual Location State
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [name, setName] = useState('');

    // Derived state
    const isIndia = selectedCountry.id === 'IN';

    // 1. Load Razorpay Script
    useEffect(() => {
        if (user && isIndia) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [user, isIndia]);

    const { openSignIn } = useClerk();

    async function handleRazorpayUpgrade() {
        if (!user) {
            openSignIn({
                afterSignInUrl: '/chat?upgrade=true',
                afterSignUpUrl: '/chat?upgrade=true',
                redirectUrl: '/chat?upgrade=true'
            });
            return;
        }

        setLoading(true);
        try {
            console.log("Creating Razorpay Order...");
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.detail || errorJson.error || errorText;
                } catch (e) { }

                throw new Error(errorMessage || 'Failed to create subscription');
            }

            const data = await res.json();
            console.log("Subscription created:", data);

            const rzpKey = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!rzpKey) {
                alert("Configuration Error: Razorpay Key ID is missing.");
                setLoading(false);
                return;
            }

            if (!(window as any).Razorpay) {
                alert('Razorpay SDK failed to load. Please check your connection.');
                setLoading(false);
                return;
            }

            const options = {
                key: rzpKey,
                order_id: data.id,
                name: "Persona AI",
                description: "Founding Membership (Monthly)",
                handler: function (_response: any) {
                    onSuccess();
                },
                prefill: {
                    name: name || user.primaryEmailAddress?.emailAddress,
                    email: user.primaryEmailAddress?.emailAddress,
                },
                theme: { color: "#F59E0B" },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                console.error("Payment Failed", response.error);
                alert("Payment Failed: " + response.error.reason);
                setLoading(false);
            });

        } catch (e: any) {
            console.error('Razorpay Error:', e);
            alert(`Error: ${e.message}`);
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-visible">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-10 text-zinc-400 hover:text-zinc-200"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-6 md:mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 ring-1 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                <Zap size={28} className="text-amber-500 fill-amber-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                                Feed the Silicon Brains 🧠
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                High-IQ inferences are expensive. The GPU hamsters need premium electricity to keep roasting you.
                            </p>
                        </div>

                        {step === 'details' ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Elon Musk"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Country</label>
                                    <Listbox value={selectedCountry} onChange={setSelectedCountry}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full w-full cursor-pointer bg-zinc-900 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-left text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all sm:text-sm">
                                                <span className="block truncate font-medium">{selectedCountry.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-[#202023] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 border border-white/5 scrollbar-thin scrollbar-thumb-zinc-700">
                                                    {countries.map((country, countryIdx) => (
                                                        <Listbox.Option
                                                            key={countryIdx}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-300'
                                                                }`
                                                            }
                                                            value={country}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-semibold text-amber-500' : 'font-normal'}`}>
                                                                        {country.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-500">
                                                                            <Check className="h-4 w-4" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>
                                <button
                                    onClick={() => setStep('payment')}
                                    disabled={!name.trim()}
                                    className="w-full py-3.5 mt-2 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Free Tier Card */}
                                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">The "Dabbler"</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">Free</span>
                                            <span className="text-zinc-500 text-sm">/forever</span>
                                        </div>
                                        <p className="text-zinc-500 text-xs mt-2">For those who like to window shop success.</p>
                                    </div>

                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-zinc-300">
                                            <div className="p-1 rounded-full bg-white/5 text-white mt-0.5">
                                                <Check size={12} />
                                            </div>
                                            10 Brutal Messages / Day
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-zinc-300">
                                            <div className="p-1 rounded-full bg-white/5 text-white mt-0.5">
                                                <Check size={12} />
                                            </div>
                                            Access to Elon Persona Only
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-zinc-300">
                                            <div className="p-1 rounded-full bg-white/5 text-white mt-0.5">
                                                <Check size={12} />
                                            </div>
                                            Standard Speed
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-zinc-500 opacity-50">
                                            <div className="p-1 rounded-full bg-red-500/10 text-red-500 mt-0.5">
                                                <X size={12} />
                                            </div>
                                            Other Personas Locked
                                        </li>
                                    </ul>
                                </div>

                                {/* Paid Tier Card - Highlighted */}
                                <div className="bg-[#0F0F0F] border-2 border-amber-500/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-[10px] font-bold tracking-wider rounded-full uppercase shadow-lg shadow-amber-500/20">
                                        Founding Members
                                    </div>

                                    <div className="flex justify-between items-end mb-4 relative z-10">
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Founding Access</h3>
                                            <p className="text-xs text-amber-400/90 font-medium">Price locked permanently</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1 justify-end">
                                                <p className="text-3xl font-bold text-white tracking-tighter">
                                                    {selectedCountry.price}
                                                </p>
                                                <p className="text-xs text-zinc-500 font-medium">/mo</p>
                                            </div>
                                            <p className="text-[10px] text-red-400 mt-1 font-bold tracking-wide uppercase">Non-refundable</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-4 border-t border-white/5 pt-4 relative z-10">
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-amber-500/10 mt-0.5">
                                                <Check size={12} className="text-amber-500" />
                                            </div>
                                            <span className="font-medium">Unlimited Brutal Truths</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-amber-500/10 mt-0.5">
                                                <Check size={12} className="text-amber-500" />
                                            </div>
                                            <span className="font-medium">Unlock ALL Personas (6 total)</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-amber-500/10 mt-0.5">
                                                <Check size={12} className="text-amber-500" />
                                            </div>
                                            <span className="font-medium">Faster Response Times</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-amber-500/10 mt-0.5">
                                                <Check size={12} className="text-amber-500" />
                                            </div>
                                            <span className="font-medium">Priority Support</span>
                                        </li>
                                    </ul>

                                    <p className="text-[10px] text-zinc-500 text-center mb-4 font-medium relative z-10">
                                        By subscribing, you agree to our <a href="/refund" target="_blank" className="text-zinc-400 underline hover:text-white transition-colors">No Refund Policy</a>.
                                    </p>

                                    {isIndia ? (
                                        <button
                                            onClick={handleRazorpayUpgrade}
                                            disabled={loading}
                                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10"
                                        >
                                            {loading ? 'Processing...' : (
                                                <>
                                                    <Zap size={18} className="fill-black/20" />
                                                    Pay with Razorpay
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <a
                                            href={`/api/polar/checkout?products=466c9b89-a140-4718-a180-fd06f3b33135&customerEmail=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`}
                                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-center no-underline shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10"
                                        >
                                            <Zap size={18} className="fill-black/20" />
                                            Pay with Polar (Hosted)
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={() => setStep('details')}
                                    className="w-full text-xs font-medium text-zinc-500 hover:text-white transition-colors py-2"
                                >
                                    ← Back to details
                                </button>
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
