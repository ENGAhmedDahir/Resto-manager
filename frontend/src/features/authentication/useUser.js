import { getUser } from "@/services/apiAuth";

import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
export function useUser() {
  const { userId } = useParams();
  const {
    isPending: isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    retry: false,
  });

  return { user, error, isLoading };
}
