import { motion } from "framer-motion";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { usePOS } from "@/context/POSContext";
import { cn } from "@/lib/utils";
import UpdateMenu from "./UpdateMenu";
import DeleteMenu from "./DeleteMenu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ActionWrapper from "@/components/ui_components/ActionWrapper";

const MotionDiv = motion.div;

export function MenuItemCard({ item, className }) {
  const { addToCart } = usePOS();
  const isAvailable = item.available !== false;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
    });
  };

  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  return (
    <MotionDiv
      whileHover={{ scale: isAvailable ? 1.02 : 1 }}
      whileTap={{ scale: isAvailable ? 0.98 : 1 }}
      onClick={handleAddToCart}
      role="button"
      tabIndex={0}
      className={cn(
        "pos-item text-left w-full relative rounded-xl",
        isAvailable ? "cursor-pointer" : "cursor-not-allowed",
        className,
      )}
    >
      {/* Image */}
      {item.image && (
        <div className="aspect-video w-full mb-3 rounded-lg overflow-hidden bg-secondary">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CONTENT (fades when unavailable) */}
      <div className={cn("space-y-1", !isAvailable && "opacity-50")}>
        <h3 className="font-medium line-clamp-1">{item.name}</h3>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>

        <Separator className="my-4" />
      </div>

      {/* ACTIONS — ALWAYS visible & clickable */}
      <div className="relative z-10 flex items-center justify-between mt-2 opacity-100">
        {isAdminOrManager && (
          <>
            <ActionWrapper>
              <UpdateMenu menu={item} />
            </ActionWrapper>

            <ActionWrapper>
              <DeleteMenu menuItemId={item._id} menuItemName={item.name} />
            </ActionWrapper>
          </>
        )}
      </div>

      {/* Unavailable badge (visual only) */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl pointer-events-none">
          <Badge variant="destructive" className="text-lg">
            Unavailable
          </Badge>
        </div>
      )}
    </MotionDiv>
  );
}
