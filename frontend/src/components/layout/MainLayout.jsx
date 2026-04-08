import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useUI } from "@/context/UIContext";

const MotionDiv = motion.div;
export function MainLayout() {
  const { isDesktop, sidebarCollapsed, sidebarOpen, setSidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <motion.main
        initial={false}
        animate={{ marginLeft: isDesktop ? (sidebarCollapsed ? 72 : 240) : 0 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        <Header />
        <div className="min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
