export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

function RefundContent() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
            <div className="max-w-3xl mx-auto py-16">
                <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                <p className="text-zinc-400 mb-8">Last updated: February 4, 2026</p>

                <div className="space-y-8 text-zinc-300 leading-relaxed">
                    <section className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-red-400 mb-3">All Sales Are Final</h2>
                        <p className="text-zinc-200">
                            **We do NOT offer refunds.** By subscribing to Persona AI, you agree that your purchase is non-refundable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Why No Refunds?</h2>
                        <p className="mb-4">
                            Persona AI provides immediate access to high-cost GPU compute resources (LLM inference) the moment you start chatting.
                            Since we incur non-recoverable costs for every message generated, we cannot offer refunds on used time or tokens.
                        </p>
                        <p>
                            Think of this like buying a ticket to a concert or a flight. once the seat is reserved and the plane takes off, the value has been delivered.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Cancellation</h2>
                        <p>
                            You can cancel your subscription at any time to prevent future billing.
                            You will retain access to Pro features until the end of your current billing cycle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Contact Support</h2>
                        <p>
                            For billing disputes or technical issues, contact: <a href="mailto:kmish9685@gmail.com" className="text-[#FF9500] hover:underline">kmish9685@gmail.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function RefundPage() {
    return (
        <Suspense fallback={null}>
            <RefundContent />
        </Suspense>
    );
}
