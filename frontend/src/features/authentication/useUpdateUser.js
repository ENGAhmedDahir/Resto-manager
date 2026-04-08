import {
  updateUser as updateUserApi,
  updateUserPassword,
} from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateUserData() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, updatedUser }) => updateUserApi({ id, updatedUser }),

    onSuccess: () => {
      toast.success("User Account updated successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateUser, isUpdating };
}

export function useUpdatePassword() {
  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: updateUserPassword,

    onSuccess: () => {
      toast.success("Password updated successfully");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updatePassword, isUpdating };
}
