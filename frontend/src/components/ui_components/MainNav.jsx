import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  BarChart3,
  FolderOpen,
  Users,
  Settings,
  Grid,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/authentication/useCurrentUser";
import { useUI } from "../../context/UIContext";

const MotionDiv = motion.div;
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ShoppingCart, label: "Menu POS", path: "/pos" },
  { icon: ClipboardList, label: "Orders", path: "/orders" },
  {
    icon: Package,
    label: "Inventory",
    path: "/inventory",
    roles: ["admin", "manager", "chef"],
    subItems: [
      { label: "Inventory", path: "/inventory" },
      { label: "Stock Log", path: "/stock-logs" },
      { label: "Category Inventory", path: "/category-inventory" },
    ],
  },
  {
    icon: Grid,
    label: "Tables",
    path: "/tables",
    roles: ["admin", "manager"],
  },
  {
    icon: BarChart3,
    label: "Reports",
    path: "/reports",
    roles: ["admin", "manager"],
  },
  {
    icon: FolderOpen,
    label: "Categories",
    path: "/categories",
    roles: ["admin", "manager"],
  },
  { icon: Users, label: "Users", path: "/users", roles: ["admin"] },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    roles: ["admin", "manager"],
  },
];

function MainNav({ collapsed }) {
  const location = useLocation();
  const { setSidebarCollapsed, setSidebarOpen, isDesktop } = useUI();
  const { user } = useCurrentUser();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
      <ul className="space-y-1 relative">
        {filteredNavItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenus[item.label];
          const isActive =
            location.pathname === item.path ||
            (hasSubItems &&
              item.subItems.some((sub) => location.pathname === sub.path));

          return (
            <li key={item.label} className="relative">
              {hasSubItems ? (
                <div>
                  <button
                    onClick={() => {
                      if (collapsed && isDesktop) setSidebarCollapsed(false);
                      toggleMenu(item.label);
                    }}
                    className={cn(
                      "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-all relative",
                      isActive
                        ? "bg-sidebar-accent/50 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive && "text-sidebar-primary",
                        )}
                      />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-3 whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    )}
                  </button>

                  {!collapsed && (
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-1 space-y-1 border-l-2 border-sidebar-accent ml-5 pl-2">
                        {item.subItems.map((subItem) => {
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <li key={subItem.path}>
                              <NavLink
                                to={subItem.path}
                                onClick={() => {
                                  if (!isDesktop) setSidebarOpen(false);
                                }}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm transition-colors",
                                  isSubActive
                                    ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30",
                                )}
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => {
                    // Auto-expand sidebar if collapsed (desktop)
                    if (collapsed && isDesktop) setSidebarCollapsed(false);

                    // Auto-close sidebar if mobile
                    if (!isDesktop) setSidebarOpen(false);
                  }}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition-all relative",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  {isActive && (
                    <MotionDiv
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-sidebar-primary"
                    />
                  )}

                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive && "text-sidebar-primary",
                    )}
                  />

                  {!collapsed ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-3 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  ) : (
                    <span className="sr-only group-hover:not-sr-only absolute left-full ml-2 px-2 py-1 text-xs rounded bg-muted text-muted-foreground shadow-lg z-10">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainNav;
