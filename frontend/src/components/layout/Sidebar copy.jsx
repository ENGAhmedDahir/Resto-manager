import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useUI } from "@/context/UIContext";

import Logo from "../ui_components/Logo";
import MainNav from "../ui_components/MainNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarSeparator,
// } from "../ui/sidebar";

// export function AppSidebar() {
//   const { sidebarCollapsed } = useUI();

//   return (
//     <aside
//       className={`${
//         sidebarCollapsed ? "w-16" : "w-64"
//       } bg-gray-900 text-white transition-all duration-300 h-screen flex flex-col`}
//     >
//       <div className="p-4 font-bold text-lg">
//         {!sidebarCollapsed ? "MyApp" : "MA"}
//       </div>
//       <div className="flex-1 px-2">
//         {/* <nav className="space-y-2">
//           <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded">
//             <Menu className="w-5 h-5" />
//             {!sidebarCollapsed && <span>Dashboard</span>}
//           </a>
//           <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded">
//             <Menu className="w-5 h-5" />
//             {!sidebarCollapsed && <span>Settings</span>}
//           </a>
//         </nav> */}
//       </div>
//     </aside>
//   );
// }
// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader>
//         <Logo />
//       </SidebarHeader>
//       <SidebarSeparator className="mt-2" />
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <MainNav />
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {/* logo */}
        <Logo sidebarCollapsed={sidebarCollapsed} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <MainNav sidebarCollapsed={sidebarCollapsed} />
      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">JD</span>
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Manager</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
