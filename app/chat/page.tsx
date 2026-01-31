import { Chat } from '../../components/Chat';

export default function ChatPage() {
    return (
        <main className="h-screen w-full flex items-center justify-center bg-[#09090b]">
            <div className="absolute inset-0 bg-[#09090b]" />
            <div className="z-10 w-full flex justify-center">
                <Chat />
            </div>
        </main>
    );
}
