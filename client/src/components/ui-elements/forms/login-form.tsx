"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Gavel, UserRound } from "lucide-react";
import { loginAdv, loginUser } from "@/components/functions/services/authService";

type Role = "user" | "lawyer";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload: {
      email: string;
      password: string;
      role: Role;
      stateRollNumber?: string;
    } = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || "").trim(),
      role,
    };

    try {
      if (role === "lawyer") {
        payload.stateRollNumber = String(formData.get("stateRollNumber") || "")
          .trim()
          .replace(/\//g, "");
        await loginAdv(payload);
        router.push("/dashboard/lawyer");
        return;
      }

      await loginUser(payload);
      router.push("/dashboard/user");
    } catch (loginError) {
      console.error(loginError);
      const message = (loginError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "We couldn’t sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ff7a50]">Sign in</p>
        <h2 className="mt-3 text-4xl font-medium tracking-[-.045em] text-white">Welcome back.</h2>
        <p className="mt-3 text-sm leading-6 text-[#8f8b84]">Choose your workspace and enter your details.</p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.035] p-1">
        {([
          { key: "user" as const, label: "For individuals", icon: UserRound },
          { key: "lawyer" as const, label: "For lawyers", icon: Gavel },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key)}
            className={`flex h-11 items-center justify-center gap-2 rounded-full text-xs font-medium transition-all ${role === key ? "bg-[#f0ede5] text-[#141414]" : "text-[#908c85] hover:text-white"}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" />

        {role === "lawyer" && (
          <Field label="State roll number" name="stateRollNumber" type="text" placeholder="MH/123/2024" autoComplete="off" />
        )}

        <Field label="Password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#ff6b3d] px-6 text-sm font-semibold text-[#180b07] transition-all hover:bg-[#ff7a50] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
        {!loading && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
      </button>

      <p className="text-center text-sm text-[#817d76]">
        New to Vesper?{" "}
        <Link href="/register" className="font-medium text-[#f0ede5] underline decoration-white/30 underline-offset-4 hover:decoration-white">Create an account</Link>
      </p>
    </form>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function Field({ label, name, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[#b7b3ac]">{label}</span>
      <input
        name={name}
        required
        {...props}
        className="h-13 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-[#625f5a] focus:border-[#ff7a50]/70 focus:bg-white/[0.055] focus:ring-4 focus:ring-[#ff6b3d]/10"
      />
    </label>
  );
}
