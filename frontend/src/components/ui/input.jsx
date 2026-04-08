import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
        "placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
