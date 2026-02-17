import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "w-full max-w-md",
                        card: "bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl",
                        headerTitle: "text-white font-bold",
                        headerSubtitle: "text-zinc-400",
                        socialButtonsBlockButton: "bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700",
                        formButtonPrimary: "bg-[#5e6ad2] hover:bg-[#4f5bc4] text-white font-bold",
                        footerActionLink: "text-[#5e6ad2] hover:text-[#6b76e0]",
                        formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
                        formFieldLabel: "text-zinc-400"
                    }
                }}
            />
        </div>
    );
}
