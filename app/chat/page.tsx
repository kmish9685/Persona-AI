import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { Chat } from '../../components/Chat';

function ChatFallback() {
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
        </div>
    );
}

export default function ChatPage() {
    return (
        <main className="h-screen w-full flex items-center justify-center bg-[#09090b]">
            <div className="absolute inset-0 bg-[#09090b]" />
            <div className="z-10 w-full flex justify-center">
                <Suspense fallback={<ChatFallback />}>
                    <Chat />
                </Suspense>
            </div>
        </main>
    );
}
