import React from "react";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/context/POSContext";
import { ShoppingCart } from "lucide-react";

function ButtonCart({ showCart, setShowCart }) {
  const { cartCount } = usePOS();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setShowCart(!showCart)}
      className="lg:hidden relative" // Only show on mobile/tablet
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full gradient-primary text-xs flex items-center justify-center text-primary-foreground">
          {cartCount}
        </span>
      )}
    </Button>
  );
}

export default ButtonCart;
