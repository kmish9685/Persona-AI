'use client';

import { Check, X, Zap } from 'lucide-react';

export default function ComparisonSection() {
    return (
        <section className="relative z-10 px-6 lg:px-8 py-24 border-b overflow-hidden" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Show, don't tell.</h2>
                    <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>The difference between a chat and a verdict.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
                    {/* Generic Output */}
                    <div className="p-8 opacity-50 hover:opacity-100 transition-opacity duration-300" style={{ background: 'var(--bg-base)' }}>
                        <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.06em] flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-tertiary)' }} /> Generic AI Output
                        </div>
                        <div className="text-[14px] leading-relaxed relative" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            <div className="absolute top-0 right-0 opacity-10"><X size={20} style={{ color: 'var(--text-tertiary)' }} /></div>
                            "Deciding whether to pivot is a complex choice that depends on many factors. You should consider your market fit, runway, and team morale. On one hand, staying the course shows grit. On the other hand, pivoting might reveal new opportunities. Perhaps you could try a hybrid approach for a few weeks and reassess..."
                        </div>
                    </div>

                    {/* Persona AI Output */}
                    <div className="p-8 relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={40} style={{ color: '#5e6ad2' }} /></div>
                        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center gap-2" style={{ color: '#5e6ad2' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#5e6ad2' }} /> Persona AI Engine Output
                        </div>

                        <div className="space-y-5 relative z-10" style={{ fontFamily: '"Geist Mono", "Fira Code", "SF Mono", ui-monospace, monospace' }}>
                            <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>VERDICT:</span>
                                <span className="text-[15px] font-semibold" style={{ color: '#4dac68' }}>PIVOT NOW</span>
                            </div>
                            <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>CONVICTION:</span>
                                <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>84%</span>
                            </div>
                            <div>
                                <span className="text-[11px] uppercase tracking-[0.06em] block mb-2" style={{ color: 'var(--text-tertiary)' }}>Kill Signals Triggered:</span>
                                <ul className="space-y-2">
                                    <li className="text-[13px] pl-3 flex items-center justify-between" style={{ borderLeft: '2px solid rgba(224,93,93,0.5)', color: 'rgba(224,93,93,0.9)' }}>
                                        <span>CAC &gt; $50 in first 48h</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(224,93,93,0.12)', color: '#e05d5d' }}>CRITICAL</span>
                                    </li>
                                    <li className="text-[13px] pl-3 flex items-center justify-between" style={{ borderLeft: '2px solid rgba(224,93,93,0.5)', color: 'rgba(224,93,93,0.9)' }}>
                                        <span>Retention &lt; 20% by week 2</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(242,184,75,0.12)', color: '#f2b84b' }}>WARNING</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-3 rounded-md" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}>
                                <span className="accent-label block mb-1">Action Plan:</span>
                                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                    Kill "Option A" immediately. You are burning cash on a dead end. Launch MVP-B by Friday 5PM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
