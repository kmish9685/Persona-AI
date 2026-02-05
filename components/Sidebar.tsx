'use client';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F0F0F] border-r border-gray-800 z-50 animate-slide-left">
                <div className="p-4">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <img src="/logo.png" alt="Persona AI" className="w-8 h-8" />
                        <span className="font-bold text-white">Persona AI</span>
                    </div>

                    {/* Nav items */}
                    <nav className="space-y-2">
                        <a href="/chat" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            🏠 Home
                        </a>
                        <a href="/chat" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            💬 New Chat
                        </a>
                        <a href="/settings" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            ⚙️ Settings
                        </a>
                        <a href="/api/auth/logout" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors">
                            🚪 Log Out
                        </a>
                    </nav>
                </div>
            </aside>
        </>
    );
}
