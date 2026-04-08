import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ size = "md", center = false, className, ...props }) {
  // Define size classes
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={cn(center && "flex justify-center items-center")}>
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn(sizeClasses[size], "animate-spin", className)}
        {...props}
      />
    </div>
  );
}

export { Spinner };
