export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
            <div className="max-w-3xl mx-auto py-16">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-zinc-400 mb-4">Last updated: February 2, 2026</p>

                <div className="space-y-6 text-zinc-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Information We Collect</h2>
                        <p>We collect email addresses when you voluntarily provide them through our email gate modal. This information is used solely to extend your free message limit and send occasional product updates.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">How We Use Your Information</h2>
                        <p>Your email is used to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Extend your free message limit</li>
                            <li>Notify you of new personas and features</li>
                            <li>Send optional startup insights (1x/week maximum)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Data Security</h2>
                        <p>We use Supabase for secure data storage with industry-standard encryption and security practices.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
                        <p>For privacy concerns, contact us at: <a href="mailto:support@personai.fun" className="text-[#FF9500] hover:underline">support@personai.fun</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
