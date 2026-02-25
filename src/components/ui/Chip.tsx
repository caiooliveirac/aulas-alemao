import type { HTMLAttributes } from "react";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "accent" | "warning";
};

export function Chip({ className, variant = "default", ...props }: ChipProps) {
  const styles = {
    default:
      "bg-[var(--surface)] border-[var(--border)] text-foreground/70",
    success:
      "bg-[var(--success)]/10 border-[var(--success)]/20 text-[var(--success)]",
    accent:
      "bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]",
    warning:
      "bg-[var(--warning)]/10 border-[var(--warning)]/20 text-[var(--warning)]",
  };

  return (
    <span
      {...props}
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        styles[variant],
        className ?? "",
      ].join(" ")}
    />
  );
}
