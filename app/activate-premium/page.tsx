import { Suspense } from 'react';
import ActivatePremiumModal from '@/components/ActivatePremiumModal';

export default function ActivatePremiumPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <div className="min-h-screen bg-black">
                <ActivatePremiumModal />
            </div>
        </Suspense>
    );
}
