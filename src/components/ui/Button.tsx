import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", fullWidth, size = "md", className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none";

  const sizes = {
    sm: "rounded-lg px-3 py-1.5 text-xs",
    md: "rounded-xl px-5 py-2.5 text-sm",
    lg: "rounded-xl px-6 py-3 text-base",
  };

  const styles = {
    primary:
      "bg-foreground text-background hover:opacity-90 shadow-sm hover:shadow-md",
    secondary:
      "bg-[var(--surface)] border border-[var(--border)] text-foreground hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] shadow-sm",
    ghost:
      "text-foreground/70 hover:text-foreground hover:bg-[var(--surface-hover)]",
    accent:
      "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white hover:opacity-90 shadow-md hover:shadow-lg",
  };

  return (
    <button
      {...props}
      className={[
        base,
        sizes[size],
        styles[variant],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
    />
  );
}
