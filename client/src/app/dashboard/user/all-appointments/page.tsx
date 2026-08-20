"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  LoaderCircle,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  deleteAppointment,
  getUserAppointments,
  type Appointment,
} from "@/lib/appointment-api";

type Status = "all" | "scheduled" | "soon" | "completed";

function appointmentStatus(dateValue: string): Exclude<Status, "all"> {
  const difference = new Date(dateValue).getTime() - Date.now();
  if (difference < 0) return "completed";
  if (difference < 24 * 60 * 60 * 1000) return "soon";
  return "scheduled";
}

function statusLabel(status: Exclude<Status, "all">) {
  return status === "completed" ? "Completed" : status === "soon" ? "Within 24 hours" : "Scheduled";
}

export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
      setAppointments(await getUserAppointments(email));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAppointments(); }, [loadAppointments]);

  const visibleAppointments = useMemo(() => {
    const search = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const matchesSearch = !search || [appointment.title, appointment.reason, appointment.lawyer?.name || "", appointment.lawyer?.email || ""]
        .some((value) => value.toLowerCase().includes(search));
      const matchesStatus = status === "all" || appointmentStatus(appointment.scheduledAt) === status;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, query, status]);

  async function cancelAppointment(appointment: Appointment) {
    if (!window.confirm(`Cancel “${appointment.title}”? This cannot be undone.`)) return;
    setCancellingId(appointment.id);
    setError("");
    try {
      await deleteAppointment(appointment.id);
      setAppointments((current) => current.filter((item) => item.id !== appointment.id));
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Could not cancel the appointment.");
    } finally {
      setCancellingId(null);
    }
  }

  const upcomingCount = appointments.filter((item) => appointmentStatus(item.scheduledAt) !== "completed").length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d0d] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">Appointments</p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-.045em] text-white sm:text-5xl">Your consultations.</h1>
            <p className="mt-3 text-sm text-[#8f8b84]">Review upcoming sessions and keep track of past legal consultations.</p>
          </div>
          <Link href="/dashboard/user/add-appointments" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ff6b3d] px-5 text-sm font-semibold text-[#170b07] hover:bg-[#ff7a50]"><Plus size={16} /> Book consultation</Link>
        </div>

        <div className="my-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Total consultations" value={appointments.length} />
          <Stat label="Upcoming" value={upcomingCount} />
          <Stat label="Completed" value={appointments.length - upcomingCount} />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#716d67]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, lawyer, or reason" className="h-11 w-full rounded-xl border border-white/10 bg-[#121212] pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#5f5b56] focus:border-[#ff7a50]/60" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="h-11 rounded-xl border border-white/10 bg-[#121212] px-4 text-sm text-[#b7b3ac] outline-none focus:border-[#ff7a50]/60">
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="soon">Within 24 hours</option>
            <option value="completed">Completed</option>
          </select>
          <button type="button" onClick={() => void loadAppointments()} disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-[#a6a29a] hover:bg-white/5 hover:text-white disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</button>
        </div>

        {error && <div role="alert" className="mb-5 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200"><AlertCircle size={17} />{error}</div>}

        {loading ? (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-white/10"><span className="flex items-center gap-3 text-sm text-[#817d76]"><LoaderCircle size={17} className="animate-spin text-[#ff7a50]" /> Loading consultations…</span></div>
        ) : visibleAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
            <Calendar size={30} className="mx-auto text-[#625f5a]" />
            <h2 className="mt-5 text-lg font-medium text-white">No consultations found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77736d]">{query || status !== "all" ? "Try changing your search or status filter." : "Book a consultation when you are ready to speak with a legal professional."}</p>
            {!query && status === "all" && <Link href="/dashboard/user/add-appointments" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#ff7a50]">Book your first consultation <ArrowRight size={15} /></Link>}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAppointments.map((appointment) => {
              const currentStatus = appointmentStatus(appointment.scheduledAt);
              const lawyerEmail = appointment.lawyer?.email || appointment.lawyerEmail;
              return (
                <article key={appointment.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-white/20 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.1em] ${currentStatus === "completed" ? "border-white/10 text-[#77736d]" : currentStatus === "soon" ? "border-amber-400/25 bg-amber-400/8 text-amber-200" : "border-emerald-400/20 bg-emerald-400/8 text-emerald-200"}`}>{statusLabel(currentStatus)}</span>
                        <span className="text-xs text-[#716d67]">{appointment.reason}</span>
                      </div>
                      <h2 className="mt-4 text-xl font-medium tracking-[-.025em] text-white">{appointment.title}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8f8b84]">{appointment.description}</p>
                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#918d86]">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-[#ff7a50]" />{new Date(appointment.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                        <span className="flex items-center gap-2"><UserRound size={14} className="text-[#ff7a50]" />{appointment.lawyer?.name || lawyerEmail || "Assigned lawyer"}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {lawyerEmail && <a href={`mailto:${lawyerEmail}?subject=${encodeURIComponent(`Regarding ${appointment.title}`)}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-xs text-[#b7b3ac] hover:bg-white/5 hover:text-white"><Mail size={14} /> Contact</a>}
                      {currentStatus !== "completed" && (
                        <button type="button" onClick={() => void cancelAppointment(appointment)} disabled={cancellingId === appointment.id} className="inline-flex h-10 items-center gap-2 rounded-full border border-red-400/15 px-4 text-xs text-red-300 hover:bg-red-400/8 disabled:opacity-50">
                          {cancellingId === appointment.id ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />} Cancel
                        </button>
                      )}
                    </div>
                  </div>
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
