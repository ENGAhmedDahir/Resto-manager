import { getUsers } from "@/services/apiAuth";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  const { isPending: isLoading, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { isLoading, users };
}
