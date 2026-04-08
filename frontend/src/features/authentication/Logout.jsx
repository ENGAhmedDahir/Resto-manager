import { LogOut } from "lucide-react";
import { useLogout } from "./useLogout";
import { Button } from "@/components/ui/button";
import SpinnerMini from "@/components/ui_components/SpinnerMini";

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <Button variant="ghost" size="icon" disabled={isLoading} onClick={logout}>
      {!isLoading ? <LogOut className="h-5 w-5" /> : <SpinnerMini />}
    </Button>
  );
}

export default Logout;
