import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Vesper home"
      className="group inline-flex items-center gap-2.5 text-[#f4f1ea]"
    >
      <span className="relative grid size-7 place-items-center rounded-full border border-white/25 bg-white/[0.04]">
        <span className="size-2.5 rounded-full bg-[#ff6b3d] shadow-[0_0_18px_rgba(255,107,61,.75)] transition-transform duration-300 group-hover:scale-125" />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.02em]">Vesper</span>
      )}
    </Link>
  );
}
