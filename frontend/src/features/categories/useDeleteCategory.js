import { deleteCategory as deleteCategoryApi } from "@/services/apiCategries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteCategory, isDeleting };
}
