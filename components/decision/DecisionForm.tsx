'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { DecisionSchema, DecisionFormValues } from '@/lib/decision-schema';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = [
    { id: 'type', title: 'Decision Type' },
    { id: 'constraints', title: 'Calculated Constraints' },
    { id: 'options', title: 'Strategic Options' },
    { id: 'blindspots', title: 'Blindspots' },
    { id: 'context', title: 'Final Context' },
];

export function DecisionForm() {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { register, control, handleSubmit, watch, trigger, formState: { errors } } = useForm<DecisionFormValues>({
        resolver: zodResolver(DecisionSchema) as any,
        defaultValues: {
            decisionType: 'pivot', // Default or sensitive
            constraints: {
                runwayMonths: 0,
                monthlyBurn: 0,
                currentMrr: 0,
                teamSize: 1,
                skillset: '',
                riskTolerance: 'medium'
            },
            options: [{ title: '' }, { title: '' }],
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'options'
    });

    const nextStep = async () => {
        let valid = false;
        if (step === 0) valid = await trigger(['decisionType']);
        if (step === 1) valid = await trigger(['constraints']);
        if (step === 2) valid = await trigger(['options']);
        if (step === 3) valid = true; // optional
        if (step === 4) valid = true; // optional

        if (valid) setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

    const onSubmit = async (data: DecisionFormValues) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Analysis failed');

            const responseData = await res.json();
            console.log("🔍 Analyzer API Response:", responseData);

            if (!responseData.id) {
                setIsSubmitting(false);
                return;
            }

            router.push(`/analyze/${responseData.id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to generate analysis. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar - Ultra Thin */}
            <div className="mb-12">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-4 uppercase tracking-[0.2em] font-bold">
                    <span>Inception</span>
                    <span>Analysis</span>
                </div>
                <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    />
                </div>
                <div className="flex justify-between mt-6 px-1">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className={clsx(
                            "text-[10px] uppercase tracking-widest font-bold transition-colors duration-300",
                            i === step ? "text-amber-500" : i < step ? "text-zinc-500" : "text-zinc-800"
                        )}>
                            {s.title}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-500">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex-1"
                    >
                        {/* STEP 1: DECISION TYPE */}
                        {step === 0 && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-light text-white tracking-tight">What difficult decision are you facing?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'pivot', label: 'Should I pivot?' },
                                        { id: 'hire', label: 'Should I hire?' },
                                        { id: 'raise', label: 'Should I raise funding?' },
                                        { id: 'feature', label: 'Should I build Feature X?' },
                                        { id: 'pricing', label: 'Pricing / Positioning' },
                                        { id: 'custom', label: 'Something else...' },
                                    ].map((opt) => (
                                        <label key={opt.id} className={clsx(
                                            "flex items-center p-5 rounded-2xl border cursor-pointer transition-all duration-300",
                                            watch('decisionType') === opt.id
                                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                                                : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                        )}>
                                            <input
                                                type="radio"
                                                value={opt.id}
                                                {...register('decisionType')}
                                                className="opacity-0 w-0 h-0"
                                            />
                                            <span className="font-medium text-sm tracking-wide">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.decisionType && <p className="text-red-500 text-xs mt-2 font-mono uppercase tracking-wide">{errors.decisionType.message}</p>}
                            </div>
                        )}

                        {/* STEP 2: CONSTRAINTS */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-light text-white mb-2 tracking-tight">Define your constraints.</h2>
                                    <p className="text-sm text-zinc-500 font-light">Honest inputs = accurate analysis.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Runway (Months)</label>
                                        <input type="number" {...register('constraints.runwayMonths')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all" />
                                        {errors.constraints?.runwayMonths && <p className="text-red-500 text-xs mt-2 font-mono uppercase">{errors.constraints.runwayMonths.message}</p>}
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Monthly Burn ({`₹/$`})</label>
                                        <input type="number" {...register('constraints.monthlyBurn')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all" />
                                        {errors.constraints?.monthlyBurn && <p className="text-red-500 text-xs mt-2 font-mono uppercase">{errors.constraints.monthlyBurn.message}</p>}
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Current MRR</label>
                                        <input type="number" {...register('constraints.currentMrr')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Team Size</label>
                                        <input type="number" {...register('constraints.teamSize')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Your Skillset (Be honest)</label>
                                    <input type="text" placeholder="e.g., strong dev, weak marketing" {...register('constraints.skillset')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all" />
                                    {errors.constraints?.skillset && <p className="text-red-500 text-xs mt-2 font-mono uppercase">{errors.constraints.skillset.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Risk Tolerance</label>
                                    <div className="flex gap-4">
                                        {['low', 'medium', 'high'].map((lvl) => (
                                            <label key={lvl} className={clsx(
                                                "flex-1 text-center py-4 rounded-xl border cursor-pointer text-xs uppercase tracking-widest transition-all duration-300",
                                                watch('constraints.riskTolerance') === lvl
                                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                                    : "bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                                            )}>
                                                <input type="radio" value={lvl} {...register('constraints.riskTolerance')} className="hidden" />
                                                {lvl}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: OPTIONS */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-light text-white mb-2 tracking-tight">List your options.</h2>
                                    <p className="text-sm text-zinc-500 font-light">Valid decisions require at least two distinct paths.</p>
                                </div>

                                <div className="space-y-5">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="group">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Option {String.fromCharCode(65 + index)}</label>
                                                {index > 1 && (
                                                    <button type="button" onClick={() => remove(index)} className="text-[10px] uppercase tracking-widest text-red-500/70 hover:text-red-500 font-bold transition-colors">Remove</button>
                                                )}
                                            </div>
                                            <input
                                                {...register(`options.${index}.title` as const)}
                                                placeholder={`Enter Option ${index + 1}...`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none transition-all"
                                            />
                                            {errors.options?.[index]?.title && <p className="text-red-500 text-xs mt-2 font-mono uppercase">{errors.options[index]?.title?.message}</p>}
                                        </div>
                                    ))}
                                </div>

                                {fields.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => append({ title: '' })}
                                        className="text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-4 transition-colors"
                                    >
                                        + Add Option
                                    </button>
                                )}
                            </div>
                        )}

                        {/* STEP 4: BLINDSPOTS */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-light text-white mb-2 tracking-tight">Check your blindspots.</h2>
                                    <p className="text-sm text-zinc-500 font-light">What are you intentionally ignoring or assuming?</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Trade-offs & Assumptions</label>
                                    <textarea
                                        rows={8}
                                        {...register('blindspots')}
                                        placeholder="I'm assuming my co-founder won't quit... I'm ignoring the fact that competitor X is well-funded..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none resize-none transition-all leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 5: CONTEXT */}
                        {step === 4 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-light text-white mb-2 tracking-tight">Final Context.</h2>
                                    <p className="text-sm text-zinc-500 font-light">Any last details the engine should know?</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Additional Context</label>
                                    <textarea
                                        rows={8}
                                        {...register('context')}
                                        placeholder="We are a B2B SaaS in the healthcare space..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-zinc-700 focus:border-amber-500/30 focus:bg-white/10 focus:outline-none resize-none transition-all leading-relaxed"
                                    />
                                </div>

                                <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
                                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm text-amber-200 font-medium tracking-wide">Ready to analyze?</p>
                                        <p className="text-xs text-amber-500/60 mt-2 leading-relaxed">This will consume 1 credit. The engine will simulate outcomes, apply kill signals, and generate a binding verdict.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 0 || isSubmitting}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors",
                            step === 0 ? "text-zinc-800 cursor-not-allowed" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        <ArrowLeft size={14} /> Back
                    </button>

                    {step === STEPS.length - 1 ? (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-premium flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-wait text-xs uppercase tracking-widest hover:bg-zinc-200"
                        >
                            {isSubmitting ? 'Analyzing...' : 'Generate Analysis'} <ArrowRight size={14} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn-premium flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/10 font-bold rounded-full hover:bg-white/20 transition-colors text-xs uppercase tracking-widest"
                        >
                            Next <ArrowRight size={14} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
