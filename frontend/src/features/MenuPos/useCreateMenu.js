import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createMenu as createMenuApi } from "@/services/apiMenu";
export function useCreateMenu() {
  const queryClient = useQueryClient();
  const { mutate: createMenu, isPending: isCreating } = useMutation({
    mutationFn: createMenuApi,
    onSuccess: () => {
      toast.success("New menu successfully created");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createMenu, isCreating };
}
