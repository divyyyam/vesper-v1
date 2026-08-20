//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Gavel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdv, loginUser } from "@/components/functions/services/authService";
 
export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "lawyer">("user");
  const [loading, setLoading] = useState(false);
 
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || "").trim(),
      role,
      
    };

    try {
      if (role === "lawyer") {
        let stateRollNumber = String(
          formData.get("stateRollNumber") || ""
        ).trim();
        stateRollNumber = stateRollNumber.replace(/\//g, "");
        payload.stateRollNumber = stateRollNumber;

        const res = await loginAdv(payload);

        router.push("/dashboard/lawyer");
      }

      const res = await loginUser(payload);

      router.push("/dashboard/user");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Role Switcher */}
      <div className="flex gap-2 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl">
        {[
          { key: "user", label: "User", icon: User },
          { key: "lawyer", label: "Lawyer", icon: Gavel },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key as "user" | "lawyer")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 capitalize font-medium text-sm transition-all duration-200 ${
              role === key
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold text-slate-100">
          Login as <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent capitalize">{role}</span>
        </h1>
        <p className="text-xs text-slate-400">Welcome back! Please enter your details.</p>
      </div>

      {/* Common Fields */}
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            required
          />
        </div>

        {/* Lawyer Extra Field */}
        <AnimatePresence>
          {role === "lawyer" && (
            <motion.div
              key="lawyer-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-2"
            >
              <Label htmlFor="stateRollNumber" className="text-slate-200 text-sm font-medium">State Roll Number</Label>
              <Input
                id="stateRollNumber"
                name="stateRollNumber"
                type="text"
                placeholder="MH/123/sos"
                className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-slate-200 text-sm font-medium">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-950/50 transition-all rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <a
          onClick={() => router.push("/register")}
          className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 hover:cursor-pointer transition-colors"
        >
          Sign up
        </a>
      </div>
    </form>
  );
}
