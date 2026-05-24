import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MenuItemCard } from "./MenuItemCard";

const MotionDiv = motion.div;

export function MenuGrid({ items, className }) {
  return (
    <div className="overflow-y-auto  h-[calc(100vh-180px)] px-2 ">
      <div
        className={cn(
          " grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 pb-6",
          className,
        )}
      >
        {items.map((item, index) => (
          <MotionDiv
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            style={{ willChange: "transform" }}
          >
            <MenuItemCard item={item} />
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
