import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const baseClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";
    const focusClasses =
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    const classes = className?.includes("focus-style-none")
      ? cn(
          baseClasses,
          "border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:ring-0",
          className
        )
      : cn(baseClasses, focusClasses, className);

    return <input type={type} className={classes} ref={ref} {...props} />;
  }
);
Input.displayName = "Input";

export { Input };
