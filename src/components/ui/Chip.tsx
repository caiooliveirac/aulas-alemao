import type { HTMLAttributes } from "react";

export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={[
        "inline-flex items-center rounded-full border border-black/10 dark:border-white/15 px-2.5 py-1 text-xs",
        className ?? "",
      ].join(" ")}
    />
  );
}
