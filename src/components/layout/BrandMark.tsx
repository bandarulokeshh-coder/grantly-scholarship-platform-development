import { GraduationCap } from "lucide-react";

export function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-soft"
    >
      <GraduationCap size={22} strokeWidth={2.2} />
    </span>
  );
}
