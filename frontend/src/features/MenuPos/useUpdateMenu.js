import { updateMenu as updateMenuApi } from "@/services/apiMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  const { mutate: updateMenu, isPending: isUpdating } = useMutation({
    mutationFn: ({ updatedMenu, id }) => updateMenuApi({ id, updatedMenu }),

    onSuccess: () => {
      toast.success("Menu updated successfully");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateMenu, isUpdating };
}
