import  LawyerSidebar  from "@/components/ui-elements/sidebar/lawyerSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DashboardAuthLayout from "@/components/functions/layout/DashboardLayout";
 
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
       <DashboardAuthLayout expectedRole="lawyer">
      <div className="flex min-h-screen">
        
        <LawyerSidebar/>

       
        <div className="flex-1 bg-[#0d0d0d] text-[#f4f1ea]">
          <SidebarInset className="bg-[#0d0d0d]">
            <header className="bg-[#0d0d0d]/90 sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 z-20 text-[#f4f1ea] backdrop-blur-xl">
              <SidebarTrigger className="-ml-1 text-slate-200 hover:text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
            </header>

            <main className="bg-[#0d0d0d] text-[#f4f1ea] min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
      </DashboardAuthLayout>
    </SidebarProvider>
  );
}
