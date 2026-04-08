import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

const MotionSpan = motion.span;

function Logo({ collapsed }) {
  return (
    <div
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-2"
      } px-2`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary">
        <Utensils className="h-5 w-5 text-primary-foreground" />
      </div>
      {!collapsed && (
        <MotionSpan
          key="logo-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-light text-lg whitespace-nowrap text-sidebar-foreground"
        >
          RESTO MANAGER
        </MotionSpan>
      )}
    </div>
  );
}

export default Logo;
