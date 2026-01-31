import { Chat } from '../components/Chat';

export default function Home() {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-[#09090b]">
      {/* Linear style background often #18181B but deeper background #09090b contrasts well */}
      <div className="absolute inset-0 bg-[#09090b]" />
      <div className="z-10 w-full flex justify-center">
        <Chat />
      </div>
    </main>
  );
}
