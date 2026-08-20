"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, User, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/components/functions/services/authService";

const sidebarNav = [
  {
    title: "Appointments",
    basePath: "/dashboard/user",
    baseLink:null,
    items: [
      { title: "Add Appointment", path: "/add-appointments" },
      { title: "All Appointments", path: "/all-appointments" },
    ],
  },
];

export default function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setUserEmail(localStorage.getItem("email"));
      setUserRole(localStorage.getItem("role"));
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <Sidebar {...props}>
      {/* --- Header --- */}
      <SidebarHeader className="p-4 border-b border-slate-800 bg-slate-900">
        <button
          onClick={() => router.push("/dashboard/user")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>

        <h1 className="mt-4 text-xl font-bold text-slate-100 tracking-wide">
          Vesper AI
        </h1>
      </SidebarHeader>

      {/* --- Main Nav --- */}
      <SidebarContent className="gap-0 flex-1 bg-slate-900 text-slate-100">
        {sidebarNav.map((group) => (
          <Collapsible
            key={group.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="text-slate-200 text-sm font-semibold"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white">
                    {group.baseLink ? (
                      <>
                        <Link href={group.baseLink} className="flex-1 text-left">
                          {group.title}
                        </Link>
                        <ChevronRight className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-left">{group.title}</span>
                        <ChevronRight className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    )}
                  </div>
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const fullPath = `${group.basePath}${item.path}`;
                      const isActive = pathname === fullPath;

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive} className="text-slate-300 hover:text-white hover:bg-slate-800">
                            <Link href={fullPath}>{item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      {/* --- User Info with HoverCard --- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <HoverCard openDelay={100}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                <User size={20} className="text-slate-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-100">
                  {userEmail || "Guest"}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {userRole || "No role"}
                </span>
              </div>
            </div>
          </HoverCardTrigger>

          <HoverCardContent side="top" align="end" className="p-2 w-40 bg-slate-900 border-slate-800">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 text-red-400 hover:bg-slate-800 hover:text-red-300"
            >
              <LogOut size={16} />
              Log out
            </Button>
          </HoverCardContent>
        </HoverCard>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
