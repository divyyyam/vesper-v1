import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

interface AuthShellProps {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

const assurances = [
  "Plain-language document analysis",
  "Access to verified legal professionals",
  "Private, secure legal workspace",
];

export function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <main className="grid min-h-screen bg-[#0d0d0d] text-[#f4f1ea] lg:grid-cols-[minmax(420px,.9fr)_minmax(540px,1.1fr)]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_85%,rgba(255,91,43,.38),transparent_34%),radial-gradient(circle_at_88%_15%,rgba(111,55,255,.26),transparent_28%)]" />
        <div className="vesper-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

        <div className="relative z-10">
          <BrandMark />
        </div>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[.2em] text-[#9c978f]">{eyebrow}</p>
          <h1 className="text-balance text-[clamp(3.5rem,5.8vw,6.6rem)] font-medium leading-[.88] tracking-[-.065em]">{title}</h1>
          <p className="mt-8 max-w-md text-base leading-7 text-[#aaa69e]">{description}</p>

          <div className="mt-12 space-y-4 border-t border-white/15 pt-8">
            {assurances.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-[#c8c4bc]">
                <span className="grid size-6 place-items-center rounded-full border border-white/15 bg-white/5"><Check size={13} className="text-[#ff7a50]" /></span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-[#77736d]">
          <ShieldCheck size={14} /> Your information stays private.
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8">
        <div className="absolute inset-x-0 top-0 flex h-[72px] items-center justify-between border-b border-white/10 px-5 sm:px-8 lg:hidden">
          <BrandMark />
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#9c978f] hover:text-white"><ArrowLeft size={14} /> Home</Link>
        </div>

        <div className="w-full max-w-[430px] animate-rise-in">
          {children}
        </div>
      </section>
    </main>
  );
}
