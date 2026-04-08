import { Menu, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/context/UIContext";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import UserAvator from "@/features/authentication/UserAvator";
import Logout from "@/features/authentication/Logout";

export function Header() {
  const { setSidebarOpen } = useUI();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      {/* Left side: mobile menu + title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1> */}
      </div>

      {/* Right side: theme toggle + notifications */}
      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <UserAvator />
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {/* i will add v2 real time Notifications */}
        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button> */}

        <Logout />
      </div>
    </header>
  );
}
