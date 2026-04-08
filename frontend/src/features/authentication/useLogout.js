import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: logout, isPending: isLoading } = useMutation({
        mutationFn: async () => {
            // If there's a backend logout route, call it here.
            // For now, we clear the local state/cache.
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.removeQueries();
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        },
    });

    return { logout, isLoading };
}
