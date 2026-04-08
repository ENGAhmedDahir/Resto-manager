import { deleteMenu as deleteMenuApi } from "@/services/apiMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  const { mutate: deleteMenu, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteMenuApi(id),
    onSuccess: () => {
      toast.success("Menu deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteMenu, isDeleting };
}
