import Heading from "@/components/ui_components/Heading";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import { useUI } from "@/context/UIContext";
import AddMenuItem from "@/features/MenuPos/AddMenuItem";
import Menus from "@/features/MenuPos/Menus";
import { useMenus } from "@/features/MenuPos/useMenus";

export default function MenuPOS() {
  const { isDesktop, sidebarCollapsed } = useUI();
  const { isLoading } = useMenus();
  if (isLoading) return <LoadingSpinner message="Loading Menus..." />;
  const collapsed = sidebarCollapsed && isDesktop;

  return (
    <>
      {/* Header Row */}
      <div
        className={`flex items-center justify-between mb-6 ${
          collapsed ? "lg:max-w-[850px]" : "lg:max-w-[700px]"
        }`}
      >
        <Heading title="Menu POS" subtitle="Take orders and manage your menu" />

        <AddMenuItem />
      </div>

      {/* Content */}
      {/* <div className="flex-1 flex flex-col h-screen overflow-hidden"> */}
      <div className="flex-1 flex flex-col overflow-hidden lg:mr-[380px]">
        <Menus />
      </div>
      {/* </div> */}
    </>
  );
}
