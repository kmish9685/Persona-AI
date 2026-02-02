export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
            <div className="max-w-3xl mx-auto py-16">
                <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                <p className="text-zinc-400 mb-4">Last updated: February 2, 2026</p>

                <div className="space-y-6 text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">7-Day Money-Back Guarantee</h2>
                        <p>We offer a full refund within 7 days of purchase if you're not satisfied with Persona AI Premium.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">How to Request a Refund</h2>
                        <p>Email us at <a href="mailto:support@personai.fun" className="text-[#FF9500] hover:underline">support@personai.fun</a> with your purchase details. Refunds are processed within 5-7 business days.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Eligibility</h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Refund requests must be made within 7 days of purchase</li>
                            <li>Only one refund per user</li>
                            <li>Subscription will be canceled upon refund</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
                        <p>Questions? Email: <a href="mailto:support@personai.fun" className="text-[#FF9500] hover:underline">support@personai.fun</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
