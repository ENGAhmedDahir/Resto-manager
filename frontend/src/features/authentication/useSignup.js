import { signup as signupApi } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSignup() {
  const queryClient = useQueryClient();
  const { mutate: signup, isPending: isCreating } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success("Account created successfully. Please verify via email.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { signup, isCreating };
}
