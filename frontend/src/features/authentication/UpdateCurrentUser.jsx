import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import UpdatePassword from "./UpdatePassword";
import UpdateUserData from "./UpdateUserData";

import { useCurrentUser } from "./useCurrentUser";

// this is ADMIN user
function UpdateCurrentUser() {
  const { user = {}, isLoading } = useCurrentUser();
  if (isLoading) return <LoadingSpinner message="Loading User Info" />;

  const isAdmin = user.role === "admin";

  return (
    <div className="flex flex-col gap-4">
      <UpdateUserData user={user} />
      {isAdmin && <UpdatePassword userId={user._id} />}
    </div>
  );
}

export default UpdateCurrentUser;
