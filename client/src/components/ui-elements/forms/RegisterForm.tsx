//@ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Gavel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerAdv, registerUser } from "@/components/functions/services/authService";
import Image from "next/image";
import { toast } from "sonner";
 
export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "lawyer">("user");
  const [loading, setLoading] = useState(false);
 


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      email: String(formData.get("email") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      password: String(formData.get("password") || "").trim(),
      
      role,
    };

    try {
      if (role === "lawyer") {
        let stateRollNumber = String(
          formData.get("stateRollNumber") || ""
        ).trim();
        let specialization = String (
          formData.get("specialization") || ""
        ).trim()
        stateRollNumber = stateRollNumber.replace(/\//g, "");
        specialization = specialization.replace(/\//g, "")
        payload.stateRollNumber = stateRollNumber;
        payload.specailization = specialization;

        const res = await registerAdv(payload);

        router.push("/dashboard/lawyer");
      } else {
        const res = await registerUser(payload);
        router.push("/dashboard/user");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration Failed");
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
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-100">
          Signup as <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent capitalize">{role}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Create your Vesper account to get started.</p>
      </div>

      {/* Fields */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name" className="text-slate-200 text-sm font-medium">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Satoshi Nakamoto"
            className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
            required
          />
        </div>

        {/* Lawyer Extra Fields */}
        <AnimatePresence>
          {role === "lawyer" && (
            <motion.div
              key="lawyer-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="stateRollNumber" className="text-slate-200 text-sm font-medium">State Roll Number</Label>
                <Input
                  id="stateRollNumber"
                  name="stateRollNumber"
                  type="text"
                  placeholder="Enter your state roll number"
                  className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialization" className="text-slate-200 text-sm font-medium">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  type="text"
                  placeholder="Family Law / Corporate"
                  className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-slate-200 text-sm font-medium">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-950/50 transition-all rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4 hover:cursor-pointer transition-colors"
        >
          Login
        </span>
      </div>
    </form>
  );
}
