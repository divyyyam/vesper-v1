"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Gavel, UserRound } from "lucide-react";
import { registerAdv, registerUser } from "@/components/functions/services/authService";

type Role = "user" | "lawyer";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      if (role === "lawyer") {
        const stateRollNumber = String(formData.get("stateRollNumber") || "").trim().replace(/\//g, "");
        const specialization = String(formData.get("specialization") || "").trim();
        await registerAdv({ email, name, password, stateRollNumber, specialization });
        router.push("/dashboard/lawyer");
        return;
      }

      await registerUser({ email, name, password });
      router.push("/dashboard/user");
    } catch (registerError) {
      console.error(registerError);
      const message = (registerError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "We couldn’t create your account. Please review your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">Get started</p>
        <h2 className="mt-3 text-4xl font-medium tracking-[-.045em] text-white">Create your account.</h2>
        <p className="mt-3 text-sm leading-6 text-[#8f8b84]">A focused workspace for every legal next step.</p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.035] p-1">
        {([
          { key: "user" as const, label: "For individuals", icon: UserRound },
          { key: "lawyer" as const, label: "For lawyers", icon: Gavel },
        ]).map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" onClick={() => setRole(key)} className={`flex h-11 items-center justify-center gap-2 rounded-full text-xs font-medium transition-all ${role === key ? "bg-[#f0ede5] text-[#141414]" : "text-[#908c85] hover:text-white"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" type="text" placeholder="Your name" autoComplete="name" className="sm:col-span-1" />
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" className="sm:col-span-1" />
        {role === "lawyer" && (
          <>
            <Field label="State roll number" name="stateRollNumber" type="text" placeholder="MH/123/2024" autoComplete="off" />
            <Field label="Specialisation" name="specialization" type="text" placeholder="Corporate law" autoComplete="off" />
          </>
        )}
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" className="sm:col-span-2" minLength={8} />
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <button type="submit" disabled={loading} className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#ff6b3d] px-6 text-sm font-semibold text-[#180b07] transition-all hover:bg-[#ff7a50] disabled:cursor-wait disabled:opacity-60">
        {loading ? "Creating account…" : "Create account"}
        {!loading && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
      </button>

      <p className="text-center text-sm text-[#817d76]">
        Already have an account?{" "}<Link href="/login" className="font-medium text-[#f0ede5] underline decoration-white/30 underline-offset-4 hover:decoration-white">Sign in</Link>
      </p>
    </form>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function Field({ label, name, className = "", ...props }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-medium text-[#b7b3ac]">{label}</span>
      <input name={name} required {...props} className="h-13 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-[#625f5a] focus:border-[#ff7a50]/70 focus:bg-white/[0.055] focus:ring-4 focus:ring-[#ff6b3d]/10" />
    </label>
  );
}
