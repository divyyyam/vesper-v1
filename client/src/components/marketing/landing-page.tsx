"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  Menu,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

const features = [
  {
    number: "01",
    icon: FileText,
    title: "Documents, made readable.",
    body: "Upload a legal PDF and get the obligations, risks, deadlines, and key clauses in plain language.",
  },
  {
    number: "02",
    icon: MessageSquareText,
    title: "Answers with context.",
    body: "Ask follow-up questions about Indian law and get clear next steps without decoding legal jargon.",
  },
  {
    number: "03",
    icon: Scale,
    title: "The right counsel, faster.",
    body: "Move from understanding the issue to booking a verified legal professional in one place.",
  },
];

const steps = [
  "Describe your situation or upload a PDF",
  "Review a structured, plain-language analysis",
  "Act with AI guidance or consult a verified lawyer",
];

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setSignedIn(Boolean(localStorage.getItem("token") && storedRole));
  }, []);

  const dashboardHref = role?.toLowerCase() === "lawyer"
    ? "/dashboard/lawyer"
    : "/dashboard/user";

  return (
    <main className="overflow-hidden bg-[#0d0d0d] text-[#f4f1ea]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d0d0d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <BrandMark />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {[
              ["Product", "#product"],
              ["How it works", "#how-it-works"],
              ["Security", "#security"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-[#a6a29a] transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {signedIn ? (
              <Link href={dashboardHref} className="rounded-full bg-[#f4f1ea] px-5 py-2.5 text-sm font-semibold text-[#111] transition-transform hover:-translate-y-0.5">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm text-[#d2cec6] transition-colors hover:text-white">Log in</Link>
                <Link href="/register" className="rounded-full bg-[#f4f1ea] px-5 py-2.5 text-sm font-semibold text-[#111] transition-transform hover:-translate-y-0.5">Get started</Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-white/15 md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#111] p-5 md:hidden">
            <nav className="flex flex-col gap-1">
              {[["Product", "#product"], ["How it works", "#how-it-works"], ["Security", "#security"]].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm text-[#d2cec6] hover:bg-white/5">{label}</a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {signedIn ? (
                  <Link href={dashboardHref} className="col-span-2 rounded-full bg-[#f4f1ea] px-4 py-2.5 text-center text-sm font-semibold text-[#111]">Open dashboard</Link>
                ) : (
                  <>
                    <Link href="/login" className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm">Log in</Link>
                    <Link href="/register" className="rounded-full bg-[#f4f1ea] px-4 py-2.5 text-center text-sm font-semibold text-[#111]">Get started</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="vesper-noise relative min-h-[920px] border-b border-white/10 pt-[72px] sm:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_38%,rgba(121,50,255,.26),transparent_24%),radial-gradient(circle_at_70%_60%,rgba(255,91,43,.28),transparent_28%)]" />
        <div className="vesper-grid absolute inset-y-0 right-0 w-[58%] opacity-40 [mask-image:linear-gradient(to_left,black,transparent)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full min-w-0 max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:px-12 lg:py-16">
          <div className="relative z-10 min-w-0 max-w-full animate-rise-in">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs text-[#c9c5bd]">
              <span className="size-1.5 rounded-full bg-[#ff6b3d]" />
              Legal clarity, built for real life
            </div>
            <h1 className="max-w-[880px] text-balance text-[clamp(4rem,8vw,8.6rem)] font-medium leading-[.86] tracking-[-.075em] text-[#f4f1ea]">
              Know where you stand.
            </h1>
            <p className="mt-9 max-w-full text-balance text-lg leading-8 text-[#aaa69e] sm:max-w-xl sm:text-xl">
              Vesper turns dense legal documents and complex questions into clear, practical next steps—then connects you with counsel when it matters.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/vesper-ai" className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#ff6b3d] px-7 text-sm font-semibold text-[#170b07] transition-all hover:bg-[#ff7a50] sm:w-auto">
                Ask Vesper
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/register" className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-7 text-sm font-medium text-white transition-colors hover:bg-white/[0.08] sm:w-auto">
                Create an account
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex h-[560px] w-full min-w-0 max-w-[600px] items-center justify-center lg:h-[690px]">
            <div className="absolute size-[min(90vw,560px)] rounded-full bg-[conic-gradient(from_205deg,#ff5b2b,#ff9a44_22%,#6e38ff_51%,#171717_73%,#ff5b2b)] opacity-90 blur-[1px]" />
            <div className="absolute size-[min(72vw,450px)] rounded-full bg-[#101010] shadow-[inset_0_0_80px_rgba(255,255,255,.08)]" />
            <div className="absolute size-[min(55vw,330px)] rounded-full border border-white/10 bg-[radial-gradient(circle_at_45%_35%,#252525,#0b0b0b_72%)] shadow-[0_30px_90px_rgba(0,0,0,.55)]" />
            <div className="relative z-10 w-[min(76vw,380px)] rotate-[-5deg] rounded-[24px] border border-white/15 bg-[#181818]/95 p-4 shadow-[0_40px_100px_rgba(0,0,0,.7)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[.2em] text-[#77736d]">Document review</p>
                  <p className="mt-1 text-sm font-medium text-white">Employment agreement</p>
                </div>
                <span className="rounded-full bg-[#ff6b3d]/15 px-2.5 py-1 text-[10px] text-[#ff8a66]">Complete</span>
              </div>
              <div className="space-y-3">
                {["Notice period", "Non-compete clause", "Termination terms"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] p-3.5">
                    <span className="flex items-center gap-3 text-xs text-[#c8c4bc]"><Check size={14} className="text-[#ff7a50]" />{item}</span>
                    <span className="text-[10px] text-[#77736d]">0{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-[#f0ede5] p-4 text-[#151515]">
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#6e6962]">Vesper insight</p>
                <p className="mt-2 text-sm font-medium leading-5">Two clauses deserve your attention before signing.</p>
              </div>
            </div>
          </div>

          <a href="#product" aria-label="Scroll to product" className="absolute bottom-8 left-5 hidden items-center gap-3 text-xs uppercase tracking-[.18em] text-[#77736d] sm:flex lg:left-12">
            <span className="grid size-9 place-items-center rounded-full border border-white/15"><ArrowDown size={14} /></span>
            Explore
          </a>
        </div>
      </section>

      <section id="product" className="border-b border-white/10 bg-[#f0ede5] text-[#161616]">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-8 border-b border-black/15 pb-16 lg:grid-cols-[.8fr_1.2fr]">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#6f6a63]">One clear workspace</p>
            <h2 className="max-w-4xl text-balance text-[clamp(2.8rem,5.5vw,6rem)] font-medium leading-[.95] tracking-[-.06em]">
              Legal help that feels human, not intimidating.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3">
            {features.map(({ number, icon: Icon, title, body }) => (
              <article key={number} className="group border-b border-black/15 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <div className="mb-20 flex items-center justify-between">
                  <span className="text-xs text-[#7c776f]">{number}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-black/20 transition-colors group-hover:bg-[#ff6b3d]"><Icon size={18} /></span>
                </div>
                <h3 className="text-2xl font-medium tracking-[-.035em]">{title}</h3>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-[#68635d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative border-b border-white/10 bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_78%,rgba(255,91,43,.18),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(114,58,255,.16),transparent_20%)]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-36">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8d8880]">How it works</p>
            <h2 className="mt-8 max-w-xl text-balance text-[clamp(3.2rem,6vw,6.5rem)] font-medium leading-[.9] tracking-[-.065em]">
              From unsure to informed.
            </h2>
          </div>
          <div className="self-end">
            {steps.map((step, index) => (
              <div key={step} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-t border-white/15 py-7 last:border-b">
                <span className="text-xs text-[#77736d]">0{index + 1}</span>
                <p className="text-base text-[#d8d4cc] sm:text-lg">{step}</p>
                <ArrowRight size={18} className="text-[#ff6b3d]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="bg-[#ff6b3d] text-[#180b07]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-28">
          <div>
            <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em]"><ShieldCheck size={16} /> Designed for trust</div>
            <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,7rem)] font-medium leading-[.9] tracking-[-.065em]">Clarity without compromising privacy.</h2>
          </div>
          <Link href="/register" className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#17110f] px-7 text-sm font-semibold text-white transition-transform hover:-translate-y-1">
            Start with Vesper <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="bg-[#0d0d0d] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p className="text-xs text-[#706c66]">AI-assisted information, not a substitute for professional legal advice.</p>
          <p className="text-xs text-[#706c66]">© {new Date().getFullYear()} Vesper</p>
        </div>
      </footer>
    </main>
  );
}
