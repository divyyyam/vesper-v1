"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  FileSearch,
  MessageSquareText,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { getLawyerAppointments, getUserAppointments } from "@/lib/appointment-api";

type Role = "user" | "lawyer";

export function DashboardHome({ role }: { role: Role }) {
  const [name, setName] = useState("");
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email") || "";
    const storedName = localStorage.getItem("name");
    setName(storedName || email.split("@")[0] || (role === "lawyer" ? "Counsel" : "there"));
    if (!email) return;
    const request = role === "lawyer" ? getLawyerAppointments(email) : getUserAppointments(email);
    request.then((items) => setAppointmentCount(items.length)).catch(() => setAppointmentCount(null));
  }, [role]);

  const actions = role === "lawyer"
    ? [
        { icon: Calendar, title: "Client appointments", body: "Review upcoming consultations and the context each client shared.", href: "/dashboard/lawyer/appointments", label: "Open schedule" },
        { icon: MessageSquareText, title: "Legal assistant", body: "Research a legal question or organize a line of reasoning with Vesper.", href: "/vesper-ai", label: "Start conversation" },
        { icon: FileSearch, title: "Review a document", body: "Upload a PDF to extract its important clauses, obligations, and risks.", href: "/vesper-ai", label: "Review document" },
      ]
    : [
        { icon: MessageSquareText, title: "Ask Vesper", body: "Understand a legal situation or get a dense document explained clearly.", href: "/vesper-ai", label: "Start conversation" },
        { icon: Plus, title: "Book a consultation", body: "Choose a verified lawyer and schedule time to discuss your matter.", href: "/dashboard/user/add-appointments", label: "Find a lawyer" },
        { icon: Calendar, title: "Your appointments", body: "Review, contact, or cancel your scheduled legal consultations.", href: "/dashboard/user/all-appointments", label: "View appointments" },
      ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d0d] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#151515] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(112,54,255,.25),transparent_28%),radial-gradient(circle_at_75%_90%,rgba(255,91,43,.25),transparent_34%)]" />
          <div className="vesper-grid absolute inset-y-0 right-0 w-1/2 opacity-30 [mask-image:linear-gradient(to_left,black,transparent)]" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">{role === "lawyer" ? "Counsel workspace" : "Your legal workspace"}</p>
            <h1 className="mt-5 text-balance text-[clamp(3rem,6vw,6rem)] font-medium leading-[.92] tracking-[-.06em] text-white">Good to see you, {name}.</h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#aaa69e] sm:text-base">{role === "lawyer" ? "Stay on top of client consultations and use Vesper when your research needs a quick, structured starting point." : "Start with a question, review your next consultation, or book time with a legal professional."}</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#77736d]">Quick actions</p><h2 className="mt-2 text-2xl font-medium tracking-[-.035em] text-white">What would you like to do?</h2></div>
            {appointmentCount !== null && <p className="hidden text-xs text-[#77736d] sm:block">{appointmentCount} consultation{appointmentCount === 1 ? "" : "s"} on record</p>}
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {actions.map(({ icon: Icon, title, body, href, label }, index) => (
              <Link key={title} href={href} className="group flex min-h-64 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]">
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full border border-white/12 text-[#ff7a50]"><Icon size={17} /></span><span className="text-xs text-[#5f5b56]">0{index + 1}</span></div>
                <h3 className="mt-12 text-xl font-medium tracking-[-.025em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#817d76]">{body}</p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-medium text-[#c8c4bc]">{label}<ArrowRight size={14} className="text-[#ff7a50] transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ff6b3d]/12 text-[#ff7a50]"><ShieldCheck size={17} /></span><div><h2 className="text-sm font-medium text-white">Use informed judgment</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#77736d]">Vesper provides AI-assisted legal information. Confirm important decisions with a qualified legal professional.</p></div></div>
        </section>
      </div>
    </div>
  );
}
