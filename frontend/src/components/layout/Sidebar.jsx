import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUI } from "@/context/UIContext";
import Logo from "../ui_components/Logo";
import MainNav from "../ui_components/MainNav";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const MotionAside = motion.aside;

export function Sidebar() {
  const {
    isDesktop,
    sidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    setSidebarCollapsed,
  } = useUI();

  const collapsed = sidebarCollapsed && isDesktop;

  return (
    <AnimatePresence>
      {(sidebarOpen || isDesktop) && (
        <MotionAside
          initial={{ x: -240 }}
          animate={{ x: 0, width: collapsed ? 72 : 240 }}
          exit={{ x: -240 }}
          transition={{ duration: 0.2 }}
          className={`fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar flex flex-col ${
            collapsed ? "items-center px-2" : "px-4"
          }`}
        >
          {/* Header */}
          <div
            className={`flex h-16 items-center border-b border-sidebar-border ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            <Logo collapsed={collapsed} />

            {!collapsed && isDesktop && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block shrink-0"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gradient-primary " />
                )}
              </Button>
            )}

            {!isDesktop && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <MainNav collapsed={collapsed} />

          {/* Footer */}
          {/* <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                <span className="text-sm font-medium">JD</span>
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Manager
                  </p>
                </motion.div>
              )}
            </div>
          </div> */}
        </MotionAside>
      )}
    </AnimatePresence>
  );
}
