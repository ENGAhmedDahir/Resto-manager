import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import { useCurrentUser } from "./useCurrentUser";
import { useUser } from "./useUser";
import UpdateUserData from "./UpdateUserData";
import UpdatePassword from "./UpdatePassword";

function UserSettings() {
  const { user = {}, isLoading } = useUser();
  const { user: currentUser, isLoading: isLoadingCurrent } = useCurrentUser();

  if (isLoading || isLoadingCurrent)
    return <LoadingSpinner message="Loading User Info" />;

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="flex flex-col gap-4">
      <UpdateUserData user={user} />
      {isAdmin && <UpdatePassword userId={user._id} />}
    </div>
  );
}

export default UserSettings;
