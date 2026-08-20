"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  LoaderCircle,
  Search,
  UserRound,
} from "lucide-react";
import {
  createAppointment,
  getLawyers,
  type Lawyer,
} from "@/lib/appointment-api";

interface FormState {
  title: string;
  description: string;
  reason: string;
  scheduledAt: string;
}

const initialForm: FormState = {
  title: "",
  description: "",
  reason: "",
  scheduledAt: "",
};

const reasons = [
  "Contract Review",
  "Legal Advice",
  "Litigation Support",
  "Document Preparation",
  "Business Law",
  "Family Law",
  "Criminal Law",
  "Property Law",
  "Other",
];

function minimumLocalDateTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AddAppointmentPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    getLawyers()
      .then((data) => active && setLawyers(data))
      .catch((error: unknown) => active && setNotice({ type: "error", text: error instanceof Error ? error.message : "Could not load lawyers." }))
      .finally(() => active && setLoadingLawyers(false));
    return () => { active = false; };
  }, []);

  const filteredLawyers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return lawyers;
    return lawyers.filter((lawyer) =>
      [lawyer.name, lawyer.email, lawyer.specialization || ""]
        .some((value) => value.toLowerCase().includes(search)),
    );
  }, [lawyers, query]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      setNotice({ type: "error", text: "Your session has expired. Please sign in again." });
      return;
    }
    if (!selectedLawyer) {
      setNotice({ type: "error", text: "Choose a lawyer before scheduling." });
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now() + 60 * 60 * 1000) {
      setNotice({ type: "error", text: "Choose a time at least one hour from now." });
      return;
    }

    setSubmitting(true);
    try {
      await createAppointment({
        ...form,
        scheduledAt: scheduledDate.toISOString(),
        userEmail,
        lawyerEmail: selectedLawyer.email,
      });
      setForm(initialForm);
      setSelectedLawyer(null);
      setQuery("");
      setNotice({ type: "success", text: "Your consultation has been scheduled." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Could not schedule the appointment." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d0d] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">Appointments</p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-.045em] text-white sm:text-5xl">Book a consultation.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#8f8b84]">Share enough context for your lawyer to prepare, then choose a time that works.</p>
          </div>
          <Link href="/dashboard/user/all-appointments" className="inline-flex items-center gap-2 text-sm text-[#b7b3ac] hover:text-white">View appointments <ArrowRight size={15} /></Link>
        </div>

        {notice && (
          <div role="status" className={`mb-6 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-200" : "border-red-400/20 bg-red-400/8 text-red-200"}`}>
            <span className="flex items-center gap-2">{notice.type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}{notice.text}</span>
            {notice.type === "success" && <Link href="/dashboard/user/all-appointments" className="shrink-0 font-medium underline underline-offset-4">View booking</Link>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="grid size-9 place-items-center rounded-full bg-[#ff6b3d]/15 text-[#ff7a50]"><FileText size={16} /></span>
              <div><h2 className="text-base font-medium text-white">Consultation details</h2><p className="mt-0.5 text-xs text-[#716d67]">Tell the lawyer what you need help with.</p></div>
            </div>

            <Field label="Appointment title">
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Employment contract review" className="field-control" />
            </Field>

            <Field label="Reason for consultation">
              <div className="relative">
                <select required value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} className="field-control appearance-none pr-10">
                  <option value="">Select a reason</option>
                  {reasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#77736d]" />
              </div>
            </Field>

            <Field label="Background and questions">
              <textarea required rows={6} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Briefly explain the situation, relevant deadlines, and what you would like to understand." className="field-control min-h-36 resize-y py-3" />
            </Field>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="grid size-9 place-items-center rounded-full bg-[#ff6b3d]/15 text-[#ff7a50]"><Calendar size={16} /></span>
              <div><h2 className="text-base font-medium text-white">Counsel and time</h2><p className="mt-0.5 text-xs text-[#716d67]">Choose who you want to speak with.</p></div>
            </div>

            <Field label="Lawyer">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77736d]" />
                <input
                  value={query}
                  disabled={loadingLawyers}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(event) => { setQuery(event.target.value); setSelectedLawyer(null); setDropdownOpen(true); }}
                  placeholder={loadingLawyers ? "Loading lawyers…" : "Search name or specialisation"}
                  className="field-control pl-10"
                />
                {loadingLawyers && <LoaderCircle size={15} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#ff7a50]" />}
                {dropdownOpen && !loadingLawyers && (
                  <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-white/15 bg-[#171717] p-1 shadow-2xl">
                    {filteredLawyers.length ? filteredLawyers.map((lawyer) => (
                      <button key={lawyer.id} type="button" onClick={() => { setSelectedLawyer(lawyer); setQuery(lawyer.name); setDropdownOpen(false); }} className="w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5">
                        <span className="block text-sm font-medium text-white">{lawyer.name}</span>
                        <span className="mt-1 block text-xs text-[#817d76]">{lawyer.specialization || "General practice"} · {lawyer.email}</span>
                      </button>
                    )) : <p className="px-3 py-6 text-center text-xs text-[#716d67]">No lawyers match your search.</p>}
                  </div>
                )}
              </div>
            </Field>

            {selectedLawyer && (
              <div className="flex items-start gap-3 rounded-xl border border-[#ff6b3d]/20 bg-[#ff6b3d]/8 p-4">
                <UserRound size={17} className="mt-0.5 text-[#ff7a50]" />
                <div><p className="text-sm font-medium text-white">{selectedLawyer.name}</p><p className="mt-1 text-xs text-[#a17e71]">{selectedLawyer.specialization || "General practice"} · Roll {selectedLawyer.stateRollNumber}</p></div>
              </div>
            )}

            <Field label="Date and time">
              <div className="relative">
                <Clock size={15} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#77736d]" />
                <input required type="datetime-local" min={minimumLocalDateTime()} value={form.scheduledAt} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} className="field-control pl-10 [color-scheme:dark]" />
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#67635d]">Appointments must be at least one hour from now.</p>
            </Field>

            <button type="submit" disabled={submitting || loadingLawyers || !selectedLawyer} className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#ff6b3d] text-sm font-semibold text-[#170b07] transition-colors hover:bg-[#ff7a50] disabled:cursor-not-allowed disabled:bg-[#303030] disabled:text-[#77736d]">
              {submitting ? <><LoaderCircle size={16} className="animate-spin" /> Scheduling…</> : <>Schedule consultation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>}
            </button>
          </section>
        </form>
      </div>

      {dropdownOpen && <button type="button" aria-label="Close lawyer list" onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-20 cursor-default" />}
      <style jsx>{`
        .field-control { width: 100%; min-height: 52px; border-radius: 12px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.035); padding-left: 16px; padding-right: 16px; color: white; font-size: 14px; outline: none; transition: border-color .2s, background .2s, box-shadow .2s; }
        .field-control::placeholder { color: #625f5a; }
        .field-control:focus { border-color: rgba(255,122,80,.7); background: rgba(255,255,255,.055); box-shadow: 0 0 0 4px rgba(255,107,61,.08); }
        .field-control:disabled { cursor: wait; opacity: .6; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium text-[#b7b3ac]">{label}</span>{children}</label>;
}
