"use client";
import { AiChat } from "@/components/core/AiChat";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Header bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Vesper AI Workspace
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-blue-950/80 border border-blue-800/60 text-blue-300 rounded-full">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Legal AI Powered
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="flex-1 flex justify-center items-center w-full">
        <AiChat />
      </div>
    </div>
  );
};

export default Page;
