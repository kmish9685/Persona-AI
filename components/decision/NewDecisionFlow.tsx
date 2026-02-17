'use client';

import { useState } from 'react';
import { DecisionForm } from '@/components/decision/DecisionForm';
import FiveYearViz, { FiveYearScenario } from '@/components/FiveYearViz';
import ValuesQuiz, { ValuesProfile } from '@/components/ValuesQuiz';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDecisionFlow() {
    const [step, setStep] = useState<'viz' | 'values' | 'form'>('viz');
    // Store data from previous steps to pass to final form
    const [vizData, setVizData] = useState<{ scenarios: FiveYearScenario[], clarityAchieved: boolean } | null>(null);
    const [valuesData, setValuesData] = useState<ValuesProfile | null>(null);

    const handleVizComplete = (scenarios: FiveYearScenario[], clarityAchieved: boolean) => {
        setVizData({ scenarios, clarityAchieved });
        // If clarity achieved, we could offer to skip AI, but for now we proceed to values
        setStep('values');
    };

    const handleValuesComplete = (values: ValuesProfile) => {
        setValuesData(values);
        setStep('form');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress / Navigation */}
            <div className="mb-8 flex items-center justify-between text-zinc-500 text-sm">
                <Link href="/" className="flex items-center hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Cancel
                </Link>
                <div className="flex gap-4">
                    <span className={step === 'viz' ? 'text-amber-500 font-bold' : 'text-zinc-600'}>1. Visualize</span>
                    <span className={step === 'values' ? 'text-amber-500 font-bold' : 'text-zinc-600'}>2. Values</span>
                    <span className={step === 'form' ? 'text-amber-500 font-bold' : 'text-zinc-600'}>3. Analyze</span>
                </div>
            </div>

            {step === 'viz' && (
                <div className="animate-fade-in">
                    <FiveYearViz
                        onComplete={handleVizComplete}
                        onSkip={() => setStep('values')}
                    />
                </div>
            )}

            {step === 'values' && (
                <div className="animate-fade-in">
                    <ValuesQuiz
                        onComplete={handleValuesComplete}
                        onSkip={() => setStep('form')}
                    />
                </div>
            )}

            {step === 'form' && (
                <div className="animate-fade-in">
                    <DecisionForm
                        initialValues={valuesData}
                        vizData={vizData}
                    />
                </div>
            )}
        </div>
    );
}
