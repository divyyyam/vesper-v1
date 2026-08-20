import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/ui-elements/forms/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Background glow ambient effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md flex flex-col gap-6 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800/80 shadow-2xl shadow-blue-950/20 relative z-10">
        <div className="flex justify-center mb-2">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-slate-100 hover:text-blue-400 transition-colors">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex size-9 items-center justify-center rounded-xl shadow-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent text-2xl font-extrabold tracking-wide">Vesper</span>
          </a>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
