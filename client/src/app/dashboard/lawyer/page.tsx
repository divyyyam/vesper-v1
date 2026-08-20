"use client";
import React, { useState } from "react";
import {
  FileText,
  Users,
  Clock,
  TrendingUp,
  Upload,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Lock,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";
const page = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter()
  const features = [
    {
      icon: MessageSquare,
      title: "AI Legal Assistant",
      desc: "Ask questions and get instant legal guidance powered by AI trained on Indian law.",
    },
    {
      icon: FileText,
      title: "Smart Document Drafting",
      desc: "Automatically generate complaints, petitions, and contracts in legally valid formats.",
    },
    {
      icon: Users,
      title: "Lawyer Matching",
      desc: "Connect with verified pro-bono lawyers based on case type and jurisdiction.",
    },
    {
      icon: BookOpen,
      title: "Legal Research",
      desc: "Search judgments, precedents, and statutes in plain language.",
    },
  ];

  const blockchainBenefits = [
    {
      icon: ShieldCheck,
      title: "Tamper-Proof Records",
      desc: "Every document is securely time-stamped and stored on blockchain for immutability.",
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      desc: "End-to-end encrypted data sharing ensures only authorized access to case files.",
    },
    {
      icon: Database,
      title: "Transparent Audit Trails",
      desc: "Track every case update with verifiable blockchain-backed records.",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-32 py-8 bg-[#0b0f19] text-slate-100 min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 px-6 py-4 rounded-2xl shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            ⚖️ Vesper AI Advocate Portal
          </h1>
          <p className="text-sm text-slate-400 font-medium">Empowering Advocates & Legal Professionals</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 py-4">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4 tracking-tight">
            Advocate Dashboard. <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Streamlined.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage your legal consultations, draft smart documents, and access instant case research tools powered by Vesper AI.
          </p>
        </div>

        {/* AI Features */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center tracking-wide">
            🌐 AI-Powered Legal Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-3 bg-indigo-950/80 border border-indigo-800/40 rounded-xl w-fit mb-4">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h4 className="font-semibold text-slate-100 text-lg mb-2">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Benefits */}
        <section className="mb-14">
          <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center tracking-wide">
            🔗 Client Confidentiality & Auditability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blockchainBenefits.map((b, i) => (
              <div
                key={i}
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-3 bg-purple-950/80 border border-purple-800/40 rounded-xl w-fit mb-4">
                  <b.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-100 text-lg mb-2">{b.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white text-center shadow-2xl shadow-purple-950/50 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-3 tracking-tight">
              Ready to Accelerate Your Legal Practice?
            </h3>
            <p className="text-slate-200 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Experience Vesper AI’s contract summarizer, flowchart builder, and AI legal assistant today.
            </p>
            <button
              onClick={() => router.push("/vesper-ai")}
              className="bg-white text-purple-700 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Launch Vesper AI Tools
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
