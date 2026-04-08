import { Button } from "@/components/ui/button";
import { useCurrentUser } from "./useCurrentUser";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserAvator() {
  const { user, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  if (isLoading) return <p>loading</p>;

  const { username } = user;

  return (
    <div className="flex items-center gap-3">
      <img
        src={user?.photo || "/default-user.jpg"}
        alt={username}
        className="w-10 h-10 rounded-full aspect-auto object-cover object-center border border-sidebar-accent"
      />
      <span className="text-sm font-medium text-secondary-foreground">
        {username}
      </span>
      <Button
        onClick={() => navigate(`/account/${user._id}`)}
        variant="ghost"
        size="icon"
        className="w-1/2 p-2"
      >
        <User
          className=" text-accent cursor-pointer hover:bg-secondary "
          size={30}
        />
      </Button>
    </div>
  );
}

export default UserAvator;
