'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PERSONAS, getPersonaById } from '@/lib/personas';
import { ChevronDown, Check } from 'lucide-react';

interface PersonaSwitcherProps {
    currentPersona: string;
}

export function PersonaSwitcher({ currentPersona }: PersonaSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const currentPersonaData = getPersonaById(currentPersona);

    const handleSwitch = (personaId: string) => {
        router.push(`/chat?persona=${personaId}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-gray-700 
                         rounded-lg text-sm hover:border-orange-500 transition-colors"
            >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600">
                    <img src={currentPersonaData.image} alt={currentPersonaData.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline">Switch Persona</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full mt-2 right-0 w-64 bg-[#1A1A1A] border border-gray-700 
                                  rounded-lg shadow-xl z-50 overflow-hidden">
                        {PERSONAS.map((persona) => (
                            <button
                                key={persona.id}
                                onClick={() => handleSwitch(persona.id)}
                                className={`
                                    w-full px-4 py-3 text-left hover:bg-[#2A2A2A] transition-colors
                                    flex items-center gap-3 border-b border-gray-800 last:border-b-0
                                    ${persona.id === currentPersona ? 'bg-[#2A2A2A]' : ''}
                                `}
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                                    <img src={persona.image} alt={persona.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{persona.name}</div>
                                    <div className="text-xs text-gray-500">{persona.tagline}</div>
                                </div>
                                {persona.id === currentPersona && (
                                    <Check size={14} className="text-orange-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
