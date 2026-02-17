'use client';

import { PersonaResponse } from '@/types/chat';
import { PERSONAS } from '@/lib/personas';
import { ThinkingCard } from './ThinkingCard';
import { StressTestView } from './StressTestView';

interface MultiPersonaViewProps {
    responses: PersonaResponse[];
}

// Persona color mapping
const PERSONA_COLORS: Record<string, string> = {
    elon: '#FF9500',    // Orange
    naval: '#3B82F6',   // Blue
    paul: '#A855F7',    // Purple
    bezos: '#6B7280',   // Gray
    jobs: '#FFFFFF',    // White
    thiel: '#EF4444'    // Red
};

export function MultiPersonaView({ responses }: MultiPersonaViewProps) {
    return (
        <div className="space-y-4">
            {/* Mobile: Vertical stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {responses.map((response) => {
                    const persona = PERSONAS.find(p => p.id === response.personaId);
                    const borderColor = PERSONA_COLORS[response.personaId] || '#6B7280';

                    return (
                        <div
                            key={response.personaId}
                            className="bg-[#1A1A1A] rounded-xl p-5 transition-all hover:scale-[1.02]"
                            style={{ borderLeft: `3px solid ${borderColor}` }}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                                    <img
                                        src={persona?.image}
                                        alt={response.personaName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-white">
                                        {response.personaName}
                                    </div>
                                    <div
                                        className="text-xs font-medium"
                                        style={{ color: borderColor }}
                                    >
                                        {persona?.tagline}
                                    </div>
                                </div>
                            </div>

                            {/* Response */}
                            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {response.response}
                            </div>

                            {/* Stress Test View */}
                            <StressTestView
                                assumptions={response.assumptions}
                                missingData={response.missingData}
                                preMortem={response.preMortem}
                                biasCheck={response.biasCheck}
                            />

                            {/* Reasoning */}
                            {response.reasoning && (
                                <ThinkingCard
                                    content={response.reasoning}
                                    personaId={response.personaId}
                                    isExpanded={false} // Default collapsed for multi-view
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
