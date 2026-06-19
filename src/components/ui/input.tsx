import * as React from "react";

import { cn } from "@/lib/utils";

const inputDefault =
  "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-1 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

const inputBare =
  "w-full min-w-0 flex-1 rounded-none border-0 border-transparent bg-transparent px-0 py-0 text-sm text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:shadow-none focus-visible:ring-0 dark:border-transparent dark:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 md:text-sm";

export type InputProps = React.ComponentProps<"input"> & {
  variant?: "default" | "bare";
};

function Input({ className, type, variant = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(variant === "bare" ? inputBare : inputDefault, className)}
      {...props}
    />
  );
}

export { Input };
