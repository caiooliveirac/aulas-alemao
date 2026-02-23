import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

export function Button({ variant = "primary", fullWidth, className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:opacity-90"
      : "border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10";

  return <button {...props} className={[base, styles, fullWidth ? "w-full" : "", className ?? ""].join(" ")} />;
}
