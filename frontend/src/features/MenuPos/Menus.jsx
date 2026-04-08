import { usePOS } from "@/context/POSContext";
import { MenuGrid } from "./MenuGrid";
import { useMenus } from "./useMenus";

import SearchMenu from "./SearchMenu";
import ButtonCart from "./ButtonCart";
import { Modal } from "@/components/ui_components/Modal";
import { POSCart } from "./POSCart";
import { useState } from "react";
import CategoriesList from "./CategoriesList";
import CheckOut from "./CheckOut";
import MenuSkeleton from "@/components/ui_components/skeleton/MenuSkeleton";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";

function Menus() {
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const { state } = usePOS();
  const { menus = [], isLoading } = useMenus();
  if (isLoading) return <LoadingSpinner message="Menus" />;

  const filteredItems = menus.filter((item) => {
    const matchesCategory =
      state.activeCategory === "all" ||
      item.category?._id === state.activeCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Modal>
      {/* Main content */}
      <>
        <div className="space-y-4">
          <SearchMenu search={search} setSearch={setSearch} />
          {/* Mobienu search={search} setSearch={setSearch} />
          {/* Mobile Cart Button */}
          <ButtonCart showCart={showCart} setShowCart={setShowCart} />

          <CategoriesList />
        </div>

        {/* Menu Items */}
        {isLoading ? <MenuSkeleton /> : <MenuGrid items={filteredItems} />}
      </>

      {/* Cart Sidebar (Desktop) */}
      <div className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-[320px] xl:w-[380px] bg-card border-l border-border shadow-lg z-40">
        <POSCart />
      </div>

      {/* Cart Drawer (Mobile/Tablet) */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCart(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[85%] sm:w-[380px] bg-card border-l border-border shadow-lg">
            <POSCart />
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckOut />
    </Modal>
  );
}

export default Menus;
