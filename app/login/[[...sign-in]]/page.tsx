import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-md",
                        card: "bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl",
                        headerTitle: "text-white font-bold",
                        headerSubtitle: "text-zinc-400",
                        socialButtonsBlockButton: "bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700",
                        formButtonPrimary: "bg-amber-500 hover:bg-amber-600 text-black font-bold",
                        footerActionLink: "text-amber-500 hover:text-amber-400",
                        formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
                        formFieldLabel: "text-zinc-400"
                    }
                }}
            />
        </div>
    );
}
