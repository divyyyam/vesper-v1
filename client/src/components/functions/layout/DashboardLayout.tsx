"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type Role = "user" | "lawyer";

export default function DashboardAuthLayout({
  children,
  expectedRole,
}: {
  children: React.ReactNode;
  expectedRole: Role;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") as Role | null;

    if (!token || !email || !role) {
      router.replace("/login");
      return;
    }

    if (role !== expectedRole) {
      router.replace(role === "lawyer" ? "/dashboard/lawyer" : "/dashboard/user");
      return;
    }

    setAuthorized(true);
  }, [expectedRole, router]);

  if (!authorized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0d0d0d] text-[#8f8b84]">
        <div className="flex items-center gap-3 text-sm"><LoaderCircle size={17} className="animate-spin text-[#ff6b3d]" /> Checking your workspace…</div>
      </div>
    );
  }

  return <>{children}</>;
}
