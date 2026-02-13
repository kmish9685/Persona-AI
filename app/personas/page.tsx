'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PERSONAS } from '@/lib/personas';
import { motion } from 'framer-motion';

export default function PersonasPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                        <span className="font-semibold text-sm sm:text-base tracking-tight">Persona AI</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Title Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Choose Your Advisor
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                        Select the thinking style that fits your current challenge
                    </p>
                </div>

                {/* Persona Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {PERSONAS.map((persona, index) => (
                        <motion.div
                            key={persona.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => router.push(`/chat?persona=${persona.id}`)}
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 
                                         hover:border-[#FF9500] transition-all duration-200 
                                         cursor-pointer group text-left h-full flex flex-col"
                            >
                                {/* Profile Image */}
                                <div className="mb-6 flex justify-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2A2A2A] group-hover:border-[#FF9500] transition-all">
                                        <img
                                            src={persona.image}
                                            alt={persona.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-xl font-bold mb-2 text-center">
                                    {persona.name}
                                </h3>

                                {/* Tagline */}
                                <p className="text-sm text-[#FF9500] font-semibold mb-3 text-center">
                                    {persona.tagline}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                                    {persona.description}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center justify-center gap-2 text-sm text-[#FF9500] 
                                              group-hover:gap-3 transition-all font-medium">
                                    <span>Select</span>
                                    <span>→</span>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        SIMULATED REASONING • NOT A HUMAN
                    </p>
                </div>
            </div>
        </div>
    );
}
