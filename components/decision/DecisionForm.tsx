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
                console.error("❌ Missing ID in response!", responseData);
                alert("Error: Analyzer returned no ID. Check console.");
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
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase tracking-widest font-bold">
                    <span>Inception</span>
                    <span>Analysis</span>
                </div>
                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-4">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className={clsx(
                            "text-xs font-medium transition-colors",
                            i === step ? "text-amber-500" : i < step ? "text-zinc-300" : "text-zinc-700"
                        )}>
                            {i + 1}. {s.title}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        {/* STEP 1: DECISION TYPE */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-light text-white mb-6">What difficult decision are you facing?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { id: 'pivot', label: 'Should I pivot?' },
                                        { id: 'hire', label: 'Should I hire?' },
                                        { id: 'raise', label: 'Should I raise funding?' },
                                        { id: 'feature', label: 'Should I build Feature X?' },
                                        { id: 'pricing', label: 'Pricing / Positioning' },
                                        { id: 'custom', label: 'Something else...' },
                                    ].map((opt) => (
                                        <label key={opt.id} className={clsx(
                                            "flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]",
                                            watch('decisionType') === opt.id
                                                ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                                : "bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                                        )}>
                                            <input
                                                type="radio"
                                                value={opt.id}
                                                {...register('decisionType')}
                                                className="opacity-0 w-0 h-0"
                                            />
                                            <span className="font-medium">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.decisionType && <p className="text-red-500 text-sm mt-2">{errors.decisionType.message}</p>}
                            </div>
                        )}

                        {/* STEP 2: CONSTRAINTS */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-light text-white mb-1">Define your constraints.</h2>
                                <p className="text-sm text-zinc-500 mb-6">Honest inputs = accurate analysis.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Runway (Months)</label>
                                        <input type="number" {...register('constraints.runwayMonths')} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none" />
                                        {errors.constraints?.runwayMonths && <p className="text-red-500 text-xs mt-1">{errors.constraints.runwayMonths.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Monthly Burn ({`₹/$`})</label>
                                        <input type="number" {...register('constraints.monthlyBurn')} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none" />
                                        {errors.constraints?.monthlyBurn && <p className="text-red-500 text-xs mt-1">{errors.constraints.monthlyBurn.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Current MRR</label>
                                        <input type="number" {...register('constraints.currentMrr')} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Team Size</label>
                                        <input type="number" {...register('constraints.teamSize')} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Your Skillset (Be honest)</label>
                                    <input type="text" placeholder="e.g., strong dev, weak marketing" {...register('constraints.skillset')} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none" />
                                    {errors.constraints?.skillset && <p className="text-red-500 text-xs mt-1">{errors.constraints.skillset.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Risk Tolerance</label>
                                    <div className="flex gap-4">
                                        {['low', 'medium', 'high'].map((lvl) => (
                                            <label key={lvl} className={clsx(
                                                "flex-1 text-center py-3 rounded-lg border cursor-pointer text-sm capitalize transition-colors",
                                                watch('constraints.riskTolerance') === lvl
                                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold"
                                                    : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
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
                            <div className="space-y-6">
                                <h2 className="text-xl font-light text-white mb-1">List your options.</h2>
                                <p className="text-sm text-zinc-500 mb-6">Valid decisions require at least two distinct paths.</p>

                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id}>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-bold text-zinc-500 uppercase">Option {String.fromCharCode(65 + index)}</label>
                                                {index > 1 && (
                                                    <button type="button" onClick={() => remove(index)} className="text-xs text-red-500 hover:underline">Remove</button>
                                                )}
                                            </div>
                                            <input
                                                {...register(`options.${index}.title` as const)}
                                                placeholder={`Option ${index + 1}`}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:outline-none"
                                            />
                                            {errors.options?.[index]?.title && <p className="text-red-500 text-xs mt-1">{errors.options[index]?.title?.message}</p>}
                                        </div>
                                    ))}
                                </div>

                                {fields.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => append({ title: '' })}
                                        className="text-sm text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 mt-2"
                                    >
                                        + Add another option
                                    </button>
                                )}
                            </div>
                        )}

                        {/* STEP 4: BLINDSPOTS */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-light text-white mb-1">Check your blindspots.</h2>
                                <p className="text-sm text-zinc-500 mb-6">What are you intentionally ignoring or assuming?</p>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Trade-offs & Assumptions</label>
                                    <textarea
                                        rows={6}
                                        {...register('blindspots')}
                                        placeholder="I'm assuming my co-founder won't quit... I'm ignoring the fact that competitor X is well-funded..."
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 5: CONTEXT */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-light text-white mb-1">Final Context.</h2>
                                <p className="text-sm text-zinc-500 mb-6">Any last details the engine should know?</p>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Additional Context</label>
                                    <textarea
                                        rows={6}
                                        {...register('context')}
                                        placeholder="We are a B2B SaaS in the healthcare space..."
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none resize-none"
                                    />
                                </div>

                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start">
                                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm text-amber-200 font-medium">Ready to analyze?</p>
                                        <p className="text-xs text-amber-500/80 mt-1">This will consume 1 credit from your plan. The engine will simulate outcomes for all options.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 0 || isSubmitting}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            step === 0 ? "text-zinc-700 cursor-not-allowed" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step === STEPS.length - 1 ? (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isSubmitting ? 'Analyzing...' : 'Generate Analysis'} <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
