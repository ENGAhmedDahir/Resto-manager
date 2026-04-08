import { useEffect } from "react";
import UserCard from "./UserCard";
import { getUsers } from "@/services/apiAuth";

function Users() {
  useEffect(() => {
    async function getUserss() {
      getUsers();
    }
    getUserss();
  }, []);
  return (
    <div>
      <UserCard />
    </div>
  );
}

export default Users;
