"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  LoaderCircle,
  Mail,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { getLawyerAppointments, type Appointment } from "@/lib/appointment-api";

type Status = "all" | "upcoming" | "completed";

export default function LawyerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      setAppointments(await getLawyerAppointments(email));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load client appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAppointments(); }, [loadAppointments]);

  const visibleAppointments = useMemo(() => {
    const search = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const upcoming = new Date(appointment.scheduledAt).getTime() > Date.now();
      const matchesStatus = status === "all" || (status === "upcoming" ? upcoming : !upcoming);
      const matchesSearch = !search || [appointment.title, appointment.reason, appointment.user?.name || "", appointment.user?.email || appointment.userEmail || ""]
        .some((value) => value.toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [appointments, query, status]);

  const upcoming = appointments.filter((appointment) => new Date(appointment.scheduledAt).getTime() > Date.now());
  const today = appointments.filter((appointment) => new Date(appointment.scheduledAt).toDateString() === new Date().toDateString());
  const clientCount = new Set(appointments.map((appointment) => appointment.user?.email || appointment.userEmail).filter(Boolean)).size;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d0d] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">Client schedule</p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-.045em] text-white sm:text-5xl">Consultations.</h1>
            <p className="mt-3 text-sm text-[#8f8b84]">Review client context and prepare for upcoming sessions.</p>
          </div>
          <button type="button" onClick={() => void loadAppointments()} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 px-5 text-sm text-[#b7b3ac] hover:bg-white/5 hover:text-white disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
        </div>

        <div className="my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="All consultations" value={appointments.length} />
          <Stat label="Upcoming" value={upcoming.length} />
          <Stat label="Today" value={today.length} />
          <Stat label="Clients" value={clientCount} />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#716d67]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search client, title, or reason" className="h-11 w-full rounded-xl border border-white/10 bg-[#121212] pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#5f5b56] focus:border-[#ff7a50]/60" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="h-11 rounded-xl border border-white/10 bg-[#121212] px-4 text-sm text-[#b7b3ac] outline-none focus:border-[#ff7a50]/60">
            <option value="all">All statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && <div role="alert" className="mb-5 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200"><AlertCircle size={17} />{error}</div>}

        {loading ? (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-white/10"><span className="flex items-center gap-3 text-sm text-[#817d76]"><LoaderCircle size={17} className="animate-spin text-[#ff7a50]" /> Loading client schedule…</span></div>
        ) : visibleAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
            <Calendar size={30} className="mx-auto text-[#625f5a]" />
            <h2 className="mt-5 text-lg font-medium text-white">No consultations found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77736d]">{query || status !== "all" ? "Try changing your search or status filter." : "New client consultations will appear here when they are booked."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAppointments.map((appointment) => {
              const isUpcoming = new Date(appointment.scheduledAt).getTime() > Date.now();
              const clientEmail = appointment.user?.email || appointment.userEmail;
              const expanded = expandedId === appointment.id;
              return (
                <article key={appointment.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors hover:border-white/20">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] ${isUpcoming ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-200" : "border-white/10 text-[#77736d]"}`}>{isUpcoming ? "Upcoming" : "Completed"}</span>
                          <span className="text-xs text-[#716d67]">{appointment.reason}</span>
                        </div>
                        <h2 className="mt-4 text-xl font-medium tracking-[-.025em] text-white">{appointment.title}</h2>
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#918d86]">
                          <span className="flex items-center gap-2"><Clock size={14} className="text-[#ff7a50]" />{new Date(appointment.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                          <span className="flex items-center gap-2"><UserRound size={14} className="text-[#ff7a50]" />{appointment.user?.name || clientEmail || "Client"}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {clientEmail && <a href={`mailto:${clientEmail}?subject=${encodeURIComponent(`Regarding ${appointment.title}`)}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-xs text-[#b7b3ac] hover:bg-white/5 hover:text-white"><Mail size={14} /> Contact</a>}
                        <button type="button" onClick={() => setExpandedId(expanded ? null : appointment.id)} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f0ede5] px-4 text-xs font-medium text-[#151515] hover:bg-white"><FileText size={14} /> Details {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
                      </div>
                    </div>
                  </div>
                  {expanded && (
                    <div className="grid gap-5 border-t border-white/10 bg-black/10 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
                      <div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#716d67]">Client context</p><p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[#aaa69e]">{appointment.description}</p></div>
                      <div className="text-xs text-[#716d67] sm:text-right"><p>Booked {new Date(appointment.createdAt).toLocaleDateString([], { dateStyle: "medium" })}</p>{clientEmail && <p className="mt-2">{clientEmail}</p>}</div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="text-xs text-[#77736d]">{label}</p><p className="mt-3 text-3xl font-medium tracking-[-.04em] text-white">{value}</p></div>;
}
